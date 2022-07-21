const YAML = require('yaml');
const { readFile, writeFile } = require('fs/promises');
const watchdogVersion = '0.8.4';

async function generateDockerfile() {
    const conf = await readFile('lenra.config.yml', 'utf8').then(YAML.parse);
    console.log("conf", conf);
    const buffer = [];
    buffer.push(`FROM ghcr.io/openfaas/of-watchdog:${watchdogVersion} as watchdog`);
    buffer.push(`FROM ${conf.image}`);

    // Set env variables
    Object.entries(conf.envs).forEach(([key, value]) => buffer.push(`ENV ${key}="${value}"`));

    // TODO: manage pre-install ?

    // Copy sources (filtered by .dockerignore)
    if (conf.workdir) buffer.push(`WORKDIR ${conf.workdir}`);
    buffer.push(`COPY . ./`);

    // TODO: copy build artifacts

    // Run install script if any
    conf.script?.forEach(cmd => buffer.push(`RUN ${cmd}`));

    // Copy and configure the watchdog
    const watchdogPath = `${conf.watchdog?.target_dir || '/usr/bin/'}fwatchdog`;
    buffer.push(`COPY --from=watchdog /fwatchdog "${watchdogPath}"`);
    buffer.push(`RUN chmod +x "${watchdogPath}"`);
    Object.entries(conf.watchdog.envs).forEach(([key, value]) => buffer.push(`ENV ${key}="${value}"`));

    // Healthcheck and entrypoint
    buffer.push(`HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1`);
    buffer.push(`CMD ["${watchdogPath}"]`);

    await writeFile('Dockerfile', buffer.join('\n'));
}

/*
id=$(docker create image-name)
docker cp $id:path - > local-tar-file
docker rm -v $id
*/

generateDockerfile();