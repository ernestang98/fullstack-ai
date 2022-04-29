# CZ4171 Capstone Project

### Demonstration [link](https://www.youtube.com/watch?v=15EVDtcwoNc)

### Architecture:

![](Architecture%20Design.png)

1. Cross Platform Mobile Application (Ionic Framework)

2. API Server with RabbitMQ message queue (NestJS Framework)

3. Food Classifier Model Server (Flask, Tensorflow, Docker)

Mobile Application has the ability to send requests to API Server. RabbitMQ converts requests to tasks and loads it on message queue. Worker consumes tasks one by one and execute them.

### How to start:

1. Run Model Server

	```
	cd model
	docker run -p 8501:8501 --name cz4171 -v "$(pwd)/backup/saved_model:/models/cz4171/1" -e MODEL_NAME=cz4171 tensorflow/serving &
   virtualenv venv
   source venv/bin/activate
   pip3 install -r requirements.txt
   flask run
	```
	
	Parameters to set in `scripts/.env` file
	
	- FLASK_ENV (DEVELOPMENT/PRODUCTION)

	- MODEL_ENDPOINT (docker server endpoint)

	Parameters to set in `scripts/constants.py` file
	
	- DATA_DIR

	- HOME_DIR

	Parameters to set in the `retrain.sh`
	
	- directory

	Note:
	
	- If run in PRODUCTION, `/train` endpoint will not work due to architectural design

	- You need to structure your DATA_DIR as such [test/train/valid]/[Food Category]/[IMAGES.PNG]

2. Run Producer

	```
	cd api-producer
   yarn
   yarn start
	```
	
	Parameters to set in `env/.env.production` and `env/.env.development` file
	
	- RABBITMQ=amqp://localhost:5672/

	- MONGODB=mongodb://localhost:27017/

3. Run Consumer

	```
	cd api-consumer
	yarn
	yarn start
	```
	
	Parameters to set in `env/.env.production` and `env/.env.development` file
	
	- RABBITMQ=amqp://localhost:5672/

	- MONGODB=mongodb://localhost:27017/
	
4. Run Mobile Application

	```
	ionic cordova emulate ios/android --livereload --external
	ionic cordova run browser --external
	```
	
	Parameters to set in `src/app/utils/constants.ts` file
	
	- default_server_ip

	- default_name

### Deployment to Heroku/Firebase

1. How to push subdirectories ref [here](https://stackoverflow.com/questions/26241683/heroku-deploy-a-sub-directory)

	`git subtree push --prefix server heroku master`
	
2. How to deploy ionic application ref [here](https://ionicframework.com/docs/angular/pwa)

	```
   ionic cordova build browser
   firebase deploy
	```

3. Deployed Links

	- API/Producer: [http://cz4171-prod-api.herokuapp.com/](http://cz4171-prod-api.herokuapp.com/)

	- Tensorflow Serving Container: [http://cz4171-tf-heroku-container.herokuapp.com/](http://cz4171-tf-heroku-container.herokuapp.com/)

	- Flask Container Connector: Cannot be deployed

		`Compiled slug size: 700MB is too large (max is 500MB).`

	- Worker: Cannot be deployed since flask connector cannot be deployed

	- Mobile Application (Web Version): [https://cz4171deployment.web.app/dashboard](https://cz4171deployment.web.app/dashboard)

### Errors Encountered

- Error 1:

    ```
    {
        err: TypeError: Cannot read property 'heartbeat' of undefined
            at /path/to/project/node_modules/amqp-connection-manager/dist/cjs/AmqpConnectionManager.js:229:42
            at processTicksAndRejections (internal/process/task_queues.js:95:5),
        url: undefined
    }
    ```

    - Hotfix: Raised an issue in GitHub seen [here](https://github.com/jwalton/node-amqp-connection-manager/issues/232). Hardcode a heartbeat value which is otherwise left undefined which then throws the error.

