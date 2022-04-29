import os
import cv2
import argparse
import numpy as np
import pandas as pd
import constants
from keras.models import load_model
import tensorflow as tf
import numpy as np
import json
import requests
import glob

from dotenv import load_dotenv
load_dotenv()

# https://stackoverflow.com/questions/17170752/python-opencv-load-image-from-byte-string
# https://towardsdatascience.com/deploying-deep-learning-models-using-tensorflow-serving-with-docker-and-flask-3b9a76ffbbda
# https://www.tensorflow.org/tfx/serving/docker
# https://github.com/muhammadarslanidrees/Deploying-Deep-Learning-Models-using-TensorFlow-Serving-with-Docker-and-Flask

# TODO: transform this to work with tensorflow serving
# https://stackoverflow.com/questions/55303156/keras-h5-to-tensorflow-serving-in-2019
# https://stackoverflow.com/questions/60005661/tensorflow-2-0-convert-keras-model-to-pb-file

def get_prediction(image_path, imread=True):
    if os.getenv('FLASK_ENV') in [None,"DEV","DEVELOPMENT"]:
        ENDPOINT = "localhost:8501"
    else:
        ENDPOINT = os.getenv('MODEL_ENDPOINT')
    MODEL_URI='http://{}/v1/models/cz4171:predict'.format(ENDPOINT)

    if not imread:
        data = json.dumps({
            'instances': img.tolist()
        })
        response = requests.post(MODEL_URI, data=data.encode('utf-8'))
        prediction = constants.PREDICTION_LABELS[list(json.loads(response.text)['predictions'][0]).index(1.0)]
        return prediction

    image = np.expand_dims(cv2.resize(cv2.cvtColor(cv2.imread(image_path, 1), cv2.COLOR_BGR2RGB), (64, 64)), axis = 0)

    data = json.dumps({
        'instances': image.tolist()
    })
    response = requests.post(MODEL_URI, data=data.encode('utf-8'))
    prediction = constants.PREDICTION_LABELS[[round(a) for a in list(json.loads(response.text)['predictions'][0])].index(1)]
    return prediction

def get_image(image_path, args_type):
    if args_type == "BYTE":
        f = open(image_path, 'rb')
        img = f.read()
        img = cv2.imdecode(np.frombuffer(img, np.uint8), -1)
        img = np.expand_dims(cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (64, 64)), axis = 0)
    else:
        img = np.expand_dims(cv2.resize(cv2.cvtColor(cv2.imread(image_path, 1), cv2.COLOR_BGR2RGB), (64, 64)), axis = 0)
    return img

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--quick', help = 'Test with all images under testing-images/', required = False)
    parser.add_argument('--image', help = 'Path to the image to be predicted', required = False)
    parser.add_argument('--type', help = 'Type of file of the image', required = False)
    parser.add_argument('--rest', help = 'REST API enabled or disabled', required = False)
    args = parser.parse_args()

    if args.quick == "True":
        model = load_model(f"{constants.HOME_DIR}/backup/model.h5")
        for image in glob.glob(os.path.join(f'{constants.HOME_DIR}/images_for_predict_script', '*')):
            img = get_image(image, "")
            prediction = constants.PREDICTION_LABELS[list((model.predict(img).astype(int))[0]).index(1)]
            print(f"Prediction for {os.path.basename(image)}: {prediction}")
        exit()

    if args.image == None or args.image == "":
        print("Either --image or --quick must be True (cannot be both...)")
        exit()

    if args.rest == "True":
        img = get_image(args.image, args.type)
        prediction = get_prediction(img, False)
        print(prediction)  

    else:
        model = load_model(f"{constants.HOME_DIR}/backup/model.h5")
        img = get_image(args.image, args.type)
        prediction = constants.PREDICTION_LABELS[list((model.predict(img).astype(int))[0]).index(1)]
        print(prediction)    
