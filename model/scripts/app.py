from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_cors import CORS, cross_origin
import os
import predict
import base64
import constants
import logging
from random import randint, randrange
import subprocess
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, template_folder='Template')
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

logger = logging.getLogger("CZ4171 Food Classifier Deployment Server")
logging.basicConfig(level=logging.INFO, format='%(asctime)s : %(levelname)s : %(name)s : %(message)s')

ENVIRONMENT = os.getenv("FLASK_ENV")

@app.route('/', methods=['GET','POST'])
@cross_origin()
def index():
    if request.method == 'POST':
        if 'file' in request.form:
            base64_image_str = request.form['file']
        else:
            base64_image_str = request.json['file']
        
        base64_image_str = base64_image_str[base64_image_str.find(",")+1:]
        if base64_image_str != '' and base64_image_str != None:
            with open("temp/temp.jpeg", "wb") as fh:
                fh.write(base64.b64decode(base64_image_str))
            fh.close()
            response = jsonify({"prediction": predict.get_prediction("temp/temp.jpeg")})
            os.remove("temp/temp.jpeg")
            return response
        else:
            return jsonify({"status": "failure"})
    else:
        return jsonify({"status": "success", "message": "Hello World... Base API"})


@app.route('/train', methods=['GET','POST'])
@cross_origin()
def train():
    if request.method == 'POST' and ENVIRONMENT != "PRODUCTION":
        logger.info('/train endpoint has been hit, do not spam...')
        if 'file' in request.form:
            base64_image_str = request.form['file']
            image_category = request.form['cat']
        else:
            base64_image_str = request.json['file']
            image_category = request.json['cat']

        base64_image_str = base64_image_str[base64_image_str.find(",")+1:]
        # image_category = image_category.lower()
        # image_category = image_category.replace(" ", "_")
        if base64_image_str != '':
            with open(constants.DATA_DIR + "/train/" + image_category + "/{}.jpeg".format("added_from_iot_device_" + str(int(randint(10000, 99999)))), "wb") as fh:
                fh.write(base64.b64decode(base64_image_str))
            fh.close()

            if constants.TRAIN_BY_API_NOT_CRON == True:
                subprocess.call(constants.HOME_DIR + "/retrain.sh", shell=True)

            return jsonify({"status": "success"})
        else:
            return jsonify({"status": "failure"})

    else:
        return jsonify({"status": "success", "message": f"Hello World... Base API? Note that retraining of model does not work in production yet and the current environment is {ENVIRONMENT}"})


if __name__ == '__main__':
    app.run(debug = True)