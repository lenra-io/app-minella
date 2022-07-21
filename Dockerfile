FROM ghcr.io/openfaas/of-watchdog:0.8.4 as watchdog
FROM node:16-alpine
ENV NPM_CONFIG_LOGLEVEL="warn"
WORKDIR /home/app
COPY . ./
RUN npm i --omit=dev
COPY --from=watchdog /fwatchdog "/usr/bin/fwatchdog"
RUN chmod +x "/usr/bin/fwatchdog"
ENV cgi_headers="true"
ENV fprocess="node server.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"
ENV port="3333"
ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"
ENV prefix_logs="false"
HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1
CMD ["/usr/bin/fwatchdog"]