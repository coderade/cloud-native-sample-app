# cloud-native-sample-app

Cloud Native app developed with Node.js ready to be packaged with Docker and deployed with Kubernetes.

This project is based on the [CloudNativeJS](https://github.com/CloudNativeJS) standards.

## Pulling from dockerhub

The image of this project is available on dockerhub: [r/valdeci/cloud-native-sample-app](https://hub.docker.com/r/valdeci/cloud-native-sample-app).

To pull it use the following command:

    docker pull valdeci/cloud-native-sample-app 

## Using `Dockerfile`

The Dockerfile on this project creates a Docker image for the application that:

* Uses the node:10 image
* Runs your application under the `node` user 

The Dockerfile also do the following:

* It listens on port 3000
* It can be started using `npm start`

You can change these settings by updating the `EXPOSE` and `CMD` entries of the Dockerfile.

### Building the Docker image for your application

After any required changes have been made to the Dockerfile, you can build a Docker image for your application using 
the following command:

```sh
docker build -t cloud-native-sample-app -f Dockerfile .
```
where `cloud-native-sample-app` is the name you want to give your created Docker image.

### Running the Docker image for your application

After the Docker image has been created for your application, you can run it using either of the following commands:

* Run as an interactive application on your command line:
  
  ```sh
  docker run -i -p 3000:3000 -t cloud-native-sample-app
  ```
  
  This maps port 3000 in the Docker image to port 3000 on your machine. If you are using a different port, you will need 
  to change the mapping.

* Run as a daemon process:
  ```sh
  docker run -d -p 3000:3000 -t cloud-native-sample-app
  ```
  This uses the `-d` flag rather than the `-i` flag to run the Docker image as a background task.

## Using `Dockerfile-tools`

The Dockerfile-tools on this project creates a Docker image for your application that:

* Uses the node:10 image
* Runs you application under the `node` user 
* Provides a script for running in `dev` mode using `nodemon`
* Provides a script for running in `debug` mode using `node --inspect`

The Dockerfile-tools file also do the following:

* It listens on port 3000
* It can be started using `"node ./bin/www`

You can change the port by editing the `EXPOSE` entry in the Dockerfile-tools file, and the start command by editing 
the `run-dev` and `run-debug` scripts.

### Building the Docker tools image for your application

After any required changes have been made to the Dockerfile-tools, you can build a Docker image for your application 
using the following command:

```sh
docker build -t cloud-native-sample-app-tools -f Dockerfile-tools .
```
where `cloud-native-sample-app-tools` is the name you want to give your created tools Docker image.

### Running the Docker tools image for your application: Development Mode

Running the image in Development Mode uses `nodemon` to watch for changes in your application and automatically restart 
it as those changes are made.

To enable your local changes to be updated in the Docker image, you must map your local file system into the running 
Docker container, as follows:

1. Generate a Linux version of your `node_modules` dependencies locally, by generating them inside the node:10 docker 
image:
  ```sh
  docker run -i -v "$PWD"/package.json:/tmp/package.json -v "$PWD"/node_modules_linux:/tmp/node_modules -w /tmp -t node:10 npm install
  ```
  This step only needs to be repeated if you modify your package.json file.
  
2. Run the Docker tools image as an interactive application on your command line in dev mode:
  ```sh
  docker run -i -p 3000:3000 -v "$PWD"/:/app -v "$PWD"/node_modules_linux:/app/node_modules -t cloud-native-sample-app-tools /bin/run-dev
  ```
  This maps port 3000 in the Docker image to port 3000 on your machine. If you are using a different port, you will need 
  to change the mapping.
  
  This command also maps your local directory into the Docker container, allowing you to modify your Node.js application
  code and see the changes running immediately in the container.
     
### Running the Docker tools image for your application: Debug Mode

In order to run your application in debug mode:
* Run as an interactive applications on your command line in debug mode:
  ```sh
  docker run -i -p 3000:3000 -p 9229:9229 -t cloud-native-sample-app-tools /bin/run-debug
  ```
  This maps port 3000 in the Docker image to port 3000 on your machine. If you are using a different port, you will need 
  to change the mapping.
  This command also maps port 9229 in the image to the same port on your machine so that you can connect the debugger.

If you wish to run your Docker tools image as a background task, switch the `-i` flag to `-d` on the command line.

## Using `Dockerfile-run`

The Dockerfile-run fike creates a Docker image using a multi-stage build that:

* Retrieves your dependencies and compiles any native add-ons using the node:10 image
* Copies your dependencies into the node:10-slim image for reduced size
* Runs your application under the `node` user 

The Dockerfile-run file also do the following:

* It listens on port 3000
* It can be started using `npm start`

You can change these settings by updating the `EXPOSE` and `CMD` entries of the Dockerfile-run template.

### Building the Docker run image for your application

After any required changes have been made to the Dockerfile-run file, you can build a Docker image for your application 
using the following command:

```sh
docker build -t cloud-native-sample-app-run -f Dockerfile-run .
```
where `cloud-native-sample-app-run` is the name you want to give your created Docker run image.

### Running the Docker run image for your application
After the Docker run image has been created for your application, you can run it using either of the following commands:

* Run as an interactive application on your command line:
  ```sh
  docker run -i -p 3000:3000 -t cloud-native-sample-app-run
  ```
  This maps port 3000 in the Docker image to port 3000 on your machine. If you are using a different port, you will need 
  to change the mapping.

* Run as a daemon process:
  ```sh
  docker run -d -p 3000:3000 -t cloud-native-sample-app-run
  ```
  This additionally uses the `-d` flag to run the Docker image as a background task.
