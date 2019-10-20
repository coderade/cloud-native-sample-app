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


## Using Kubernetes

### Prerequisites

Using the template Helm charts assumes the following pre-requisites are complete:  

1. You have a Kubernetes cluster  
  This could be one hosted by a cloud provider or running locally, for example using [Minikube](https://kubernetes.io/docs/setup/minikube/)
  
2. You have kubectl installed and configured for your cluster  
  The [Kuberenetes command line](https://kubernetes.io/docs/tasks/tools/install-kubectl/) tool, `kubectl`, is used to view and control your Kubernetes cluster. 

3. You have the Helm command line and Tiller backend installed  
   [Helm and Tiller](https://docs.helm.sh/using_helm/) provide the command line tool and backend service for deploying your application using the Helm chart. 
   
4. You have created and published a Docker image for your application  
The Docker Template project provides guidance on [building a run image](https://github.com/CloudNativeJS/docker#using-dockerfile-tools) for your application and [publishing it to the DockerHub registry](https://github.com/CloudNativeJS/docker#publishing-the-image).

5. Your application has a "health" endpoint  
  This allows Kubernetes to restart your application if it fails or becomes unresponsive. The [Health Connect](https://github.com/CloudNativeJS/cloud-health-connect) middleware can be used to add a health endpoint.

### Adding the Chart to your Application

In order to add Helm Charts to your application, copy the `charts` directory from this project into your application's root directory.

You then need to make a single change before the charts are usable: to set the `image.repository` for your application.

#### Setting the `image.repository` parameter

In order to change the `image.respository` parameter, open the `charts/cloud-native-sample-app/values.yaml` file and change the following entry:  

```sh
image:
  repository: <namespace>/cloud-native-sample-app
```
to set `<namespace>` to your namespace on DockerHub where you published your application as `cloud-native-sample-app`. 

### Configuring the Chart for your Application

The following table lists the configurable parameters of the template Helm chart and their default values.

| Parameter                  | Description                                     | Default                                                    |
| -----------------------    | ---------------------------------------------   | ---------------------------------------------------------- |
| `image.repository`         | image repository                                | `<namespace>/cloud-native-sample-app`                                 |
| `image.tag`                | Image tag                                       | `latest`                                                    |
| `image.pullPolicy`         | Image pull policy                               | `Always`                                                   |
| `livenessProbe`   | Confuration for any liveness probe provided |   YAML object of liveness probe. See [Liveness and Readiness Probes](#liveness-and-readiness-probes)                            |
| `readinessProbe`         | Confuration provided for any liveness probe provided      | YAML object of readiness probe. See [Liveness and Readiness Probes](#liveness-and-readiness-probes)         |
| `service.name`             | Kubernetes service name                                | `Node`                                                     |
| `service.type`             | Kubernetes service type exposing port                  | `NodePort`                                                 |
| `service.port`             | TCP Port for this service                       | 3000                                                       |
| `resources.limits.memory`  | Memory resource limits                          | `128m`                                                     |
| `resources.limits.cpu`     | CPU resource limits                             | `100m`                                                     |

#### Liveness and Readiness Probes

With the default configuration, no liveness or readiness is enabled. This means that the container is considered healthy as long as its main process is running, otherwise it's considered a failure.

Optionally, you add configurations for readiness and liveness probes by configuring `image.readinessProbe` and `image.livenessProbe` parameters, respectively. Example configuration is provided in the `values.yaml` file.

The `initialDelaySeconds` defines how long to wait before performing the first probe. Default value for readiness probe is 2 seconds and for liveness probe is 20 seconds. You should set appropriate values for your container, if necessary, to ensure that the readiness and liveness probes don’t interfere with each other. Otherwise, the liveness probe might continuously restart the pod and the pod will never be marked as ready.

More information about configuring liveness and readiness probes can be found [here](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)


### Using the Chart to deploy your Application to Kubernetes

In order to use the Helm chart to deploy and verify your applicaton in Kubernetes, run the following commands:

1. From the directory containing `Chart.yaml`, run:  

  ```sh
  helm install --name cloud-native-sample-app .
  ```  
  This deploys and runs your applicaton in Kubernetes, and prints the following text to the console:  
  
  ```sh
  Congratulations, you have deployed your Node.js Application to Kubernetes using Helm!

  To verify your application is running, run the following two commands to set the SAMPLE_NODE_PORT and SAMPPLE_NODE_IP environment variables to the locaton of your application:

  export SAMPLE_NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services cloud-native-sample-app-service)
  export SAMPLE_NODE_IP=$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")
  
  And then open your web browser to http://${SAMPLE_NODE_IP}:${SAMPLE_NODE_PORT} from the command line, eg:
  
  open http://${SAMPLE_NODE_IP}:${SAMPLE_NODE_PORT}
  ```
  
2. Copy, paste and run the `export` lines printed to the console
  eg:
  
  ```sh
  export SAMPLE_NODE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].nodePort}" services cloud-native-sample-app-service)
  export SAMPLE_NODE_IP=$(kubectl get nodes --namespace default -o jsonpath="{.items[0].status.addresses[0].address}")
  ```
  
3. Open a browser to view your application:  
  Open your browser to `http://${SAMPLE_NODE_IP}:${SAMPLE_NODE_PORT}` from the command line using:
  
  ```sh
  open http://${SAMPLE_NODE_IP}:${SAMPLE_NODE_PORT}
  ```

You application should now be visible in your browser.


### Uninstalling your Application
If you installed your application with:  

```sh
helm install --name cloud-native-sample-app .
```
then you can:

* Find the deployment using `helm list --all` and searching for an entry with the chart name "cloud-native-sample-app".
* Remove the application with `helm delete --purge cloud-native-sample-app`.
