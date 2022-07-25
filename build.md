To build the app use the next steps.

## Generate the Dockerfile:

```bash
node lenra.build.js
```

## Build the Docker image

```bash
docker build -t registry.lenra.io/my-app .
```

### Deamonless solution

[Img](https://github.com/genuinetools/img) is a deamonless Docker image build based on buildx that can be used in a Kubernetes pod

```bash
docker run --rm -it --entrypoint sh -v $(pwd):/tmp/app --workdir /tmp/app --security-opt seccomp=unconfined --security-opt apparmor=unconfined r.j3ss.co/img
```

In the container:

```bash
img build -t registry.lenra.io/my-app .
img push registry.lenra.io/my-app
```

Build to tar archive:

```bash
img build --output type=tar,dest=out.tar .
```
