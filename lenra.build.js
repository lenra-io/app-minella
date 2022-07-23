const YAML = require('yaml');
const { readFile, writeFile } = require('fs/promises');
const watchdogBuilder = 'watchdog';
const watchdogVersion = '0.8.4';

/**
 * @typedef watchdogConf The OpenFaaS of-watchdog configuration
 * @property {string} targetDir The watchdog copy target directory
 * @property {Object.<string, string>} params The watchdog parameters
 * 
 * @typedef artifactCopier Describe an artifact copied from a previous builder
 * @property {string?} builder The source builder name. The default value is `builder-${position}` with position being the position of the builder in the builders list (starting at 0)
 * @property {string} source The source path
 * @property {string} destination The destination in the current image descriptor
 * @property {string?} mode The destination mode of the artifact
 * 
 * @typedef namedObject
 * @property {string} name The element name
 * 
 * @typedef imageDescriptor Describes a Docker image
 * @property {string} image The initial Docker image
 * @property {string?} workdir The image workdir
 * @property {Object.<string, string>?} envs The environment variables defined in the Dockerfile
 * @property {string?} user The runtime user. Default "app"
 * @property {string[]?} rootScript The command lines executed as root user
 * @property {string[]?} script The command lines executed after 
 * @property {boolean?} copySources If true, copies the sources filtered by the .dockerignore file to the workdir
 * @property {artifactCopier[]?} artifacts The artifacts of the previous builders
 * 
 * @typedef {namedObject & imageDescriptor} namedImageDescritor
 * 
 * @typedef lenraBaseConf The lenra.config.yml expected content
 * @property {string} componentsApi The components API version
 * @property {watchdogConf} watchdog
 * @property {string[]?} needed_envs List of the needed environment variables in the Lenra environment
 * @property {namedImageDescritor} builders The builders
 * 
 * @typedef {lenraBaseConf & imageDescriptor} lenraConf
 */

async function generateDockerfile() {
    /**
     * @type {lenraConf}
     */
    const conf = await readFile('lenra.config.yml', 'utf8').then(YAML.parse);
    console.log("conf", conf);
    const buffer = [];
    const watchdogPath = `${conf.watchdog?.targetDir || '/usr/bin/'}fwatchdog`;

    // Add watchdog to builders
    if (!conf.builders) conf.builders = [];
    conf.builders.push({ name: watchdogBuilder, image: `ghcr.io/openfaas/of-watchdog:${watchdogVersion}` });

    conf.builders.forEach((builder, position) => addImageDescription(buffer, { name: `builder-${position}`, ...builder }));
    addImageDescription(buffer, {
        ...conf,
        artifacts: [...conf.artifacts, {
            builder: watchdogBuilder,
            source: '/fwatchdog',
            destination: watchdogPath,
            mode: '+x'
        }],
        envs: { ...conf.envs, ...conf.watchdog.params }
    });

    // Healthcheck and entrypoint
    buffer.push(`HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1`);
    buffer.push(`CMD ["${watchdogPath}"]`);

    await writeFile('Dockerfile', buffer.join('\n'));
}

const nameRegex = /^[a-z]+(\-[a-z]+)*$/;
const existingNames = [];

/**
 * Adds a image descriptor to a buffer
 * @param {string[]} buffer The lines buffer
 * @param {namedImageDescritor} imageDescriptor The image description to add
 */
function addImageDescription(buffer, imageDescriptor) {
    if (imageDescriptor.name) {
        if (existingNames.includes(imageDescriptor.name)) throw new Error(`There is already an image with the name '${imageDescriptor.name}'`);
        // TODO: does not work ?
        // if (imageDescriptor.name.match(nameRegex)) throw new Error(`The name '${imageDescriptor.name}' does not match the name regex /${nameRegex.source}/`);
        existingNames.push(imageDescriptor.name);
    }

    buffer.push(`# ${imageDescriptor.name || 'app'}`);
    buffer.push(`FROM ${imageDescriptor.image}${(imageDescriptor.name) ? ` as ${imageDescriptor.name}`: ''}`);

    // Set env variables
    if (imageDescriptor.envs) addEnvs(buffer, imageDescriptor.envs);

    // Set workdir
    if (imageDescriptor.workdir) buffer.push(`WORKDIR ${imageDescriptor.workdir}`);

    // Copy sources (filtered by .dockerignore)
    if (imageDescriptor.copySources) buffer.push(`COPY . ./`);

    const rootScript = [];

    // Copy build artifacts
    if (imageDescriptor.artifacts) {
        imageDescriptor.artifacts.forEach(artifact => {
            if (imageDescriptor.name == artifact.builder) throw new Error(`The copy can't from the same builder '${artifact.builder}'`);
            if (!existingNames.includes(artifact.builder)) throw new Error(`The builder '${artifact.builder}' is not found in previous artifacts`);
            buffer.push(`COPY --from=${artifact.builder} "${artifact.source}" "${artifact.destination}"`);
            if (artifact.mode) rootScript.push(`chmod -R ${artifact.mode} "${artifact.destination}"`);
        });
    }

    if (imageDescriptor.rootScript) rootScript.push.apply(rootScript, imageDescriptor.rootScript);

    // Root script
    if (rootScript.length > 0) {
        buffer.push(`USER 0`);
        addScripts(buffer, rootScript);
    }

    if (!imageDescriptor.name || imageDescriptor.script?.length) buffer.push(`USER ${imageDescriptor.user || 'app'}`);

    // Run install script if any
    if (imageDescriptor.script) addScripts(buffer, imageDescriptor.script);
    buffer.push('');
}

/**
 * Adds scripts to a Docker image lines buffer
 * @param {string[]} buffer The buffer
 * @param {string[]} scripts The scripts to add
 */
function addScripts(buffer, scripts) {
    // TODO: manage multiline script
    scripts.forEach((cmd, i) => buffer.push(`${(i == 0) ? 'RUN ' : '\t'}${cmd} ${(i < scripts.length - 1) ? ' && \\' : ''}`));
}

/**
 * Adds env variables to a Docker image line buffer
 * @param {string[]} buffer The buffer
 * @param {Object<string, string>} envs The envs key value map
 */
function addEnvs(buffer, envs) {
    const entries = Object.entries(envs);
    entries.forEach(([key, value], i) => buffer.push(`${(i == 0) ? 'ENV ' : '\t'}${key}="${value}" ${(i < entries.length - 1) ? ' \\' : ''}`));
}

/*
id=$(docker create image-name)
docker cp $id:path - > local-tar-file
docker rm -v $id
*/

generateDockerfile();