# syntax=docker/dockerfile:1.4

# of-watchdog
FROM ghcr.io/openfaas/of-watchdog:0.9.6 as of-watchdog

# runtime
FROM node:16-alpine as runtime
ENV \
    mode="http"\
    upstream_url="http://127.0.0.1:3000"\
    fprocess="npm start"
WORKDIR /app
ADD --link . ./
COPY --link --chown=1000:1000 --from=of-watchdog "/fwatchdog" "/fwatchdog"
USER 0
RUN \
    npm i --omit=dev
EXPOSE 8080
CMD ["/fwatchdog"]
