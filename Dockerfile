# build-ts
FROM node:16-alpine as build-ts
WORKDIR /tmp/build
COPY . ./
USER 0
RUN addgroup -S app  && \
	adduser -S -g app app  && \
	chmod -R 777 ./ 
USER app
RUN npm i  && \
	rm -Rf node_modules 

# watchdog
FROM ghcr.io/openfaas/of-watchdog:0.8.4 as watchdog

# app
FROM node:16-alpine
ENV NPM_CONFIG_LOGLEVEL="warn"  \
	cgi_headers="true"  \
	fprocess="node server.js"  \
	mode="http"  \
	upstream_url="http://127.0.0.1:3000"  \
	exec_timeout="10s"  \
	write_timeout="15s"  \
	read_timeout="15s"  \
	prefix_logs="false" 
WORKDIR /home/app
COPY --from=build-ts "/tmp/build/" "/home/app/"
COPY --from=watchdog "/fwatchdog" "/usr/bin/fwatchdog"
USER 0
RUN chmod -R +x "/usr/bin/fwatchdog"  && \
	addgroup -S app  && \
	adduser -S -g app app 
USER app
RUN npm i --omit=dev 

HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1
CMD ["/usr/bin/fwatchdog"]