const YAML = require('yaml');
const { readFile, writeFile } = require('fs/promises');
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
 * @typedef lenraBaseConf The lenra.config.yml expected content
 * @property {string} componentsApi The components API version
 * @property {watchdogConf} watchdog
 * @property {string[]?} needed_envs List of the needed environment variables in the Lenra environment
 * @property {imageDescriptor[] & {name: string?}} builders The builders
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

    // TODO: create builders

    buffer.push(`FROM ghcr.io/openfaas/of-watchdog:${watchdogVersion} as watchdog`);

    conf.builders?.forEach((builder, position) => addImageDescription(buffer, { name: `builder-${position}`, ...builder }));
    addImageDescription(buffer, conf);

    // Copy and configure the watchdog
    const watchdogPath = `${conf.watchdog?.targetDir || '/usr/bin/'}fwatchdog`;
    buffer.push(`COPY --from=watchdog /fwatchdog "${watchdogPath}"`);
    buffer.push(`RUN chmod +x "${watchdogPath}"`);
    Object.entries(conf.watchdog.params).forEach(([key, value]) => buffer.push(`ENV ${key}="${value}"`));

    // Healthcheck and entrypoint
    buffer.push(`HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1`);
    buffer.push(`CMD ["${watchdogPath}"]`);

    await writeFile('Dockerfile', buffer.join('\n'));
}

const nameRegex = /^[a-z]+([-][a-z]+){0,3}$/;
const existingNames = ['app', 'watchdog']

/**
 * Adds a image descriptor to a buffer
 * @param {string[]} buffer The lines buffer
 * @param {imageDescriptor & {name: string?}} imageDescriptor The image description to add
 */
function addImageDescription(buffer, imageDescriptor) {
    if (imageDescriptor.name) {
        if (existingNames.includes(imageDescriptor.name)) throw new Error(`There is already an image with the name '${imageDescriptor.name}'`);
        // TODO: does not work ?
        // if (imageDescriptor.name.match(nameRegex)) throw new Error(`The name '${imageDescriptor.name}' does not match the name regex /${nameRegex.source}/`);
        existingNames.push(imageDescriptor.name);
    }

    buffer.push(`# ${imageDescriptor.name || 'app'}`);
    buffer.push(`FROM ${imageDescriptor.image} as ${imageDescriptor.name || 'app'}`);

    // Set env variables
    if (imageDescriptor.envs) Object.entries(imageDescriptor.envs).forEach(([key, value]) => buffer.push(`ENV ${key}="${value}"`));

    // TODO: manage pre-install ?

    // Copy sources (filtered by .dockerignore)
    if (imageDescriptor.workdir) buffer.push(`WORKDIR ${imageDescriptor.workdir}`);
    buffer.push(`COPY . ./`);

    // TODO: copy build artifacts

    // Run install script if any
    imageDescriptor.script?.forEach(cmd => buffer.push(`RUN ${cmd}`));
    buffer.push('');
}

/*
id=$(docker create image-name)
docker cp $id:path - > local-tar-file
docker rm -v $id
*/

generateDockerfile();