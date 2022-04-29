import os
import cv2
import argparse
import numpy as np
import pandas as pd
import logging
import constants

from keras.layers import Dense, Flatten, Dropout, Convolution2D, MaxPooling2D, GlobalAveragePooling2D
from keras.models import Sequential, load_model
from keras.preprocessing.image import ImageDataGenerator   

from sklearn.metrics import accuracy_score
import tensorflow as tf
import shutil
import tensorflow.keras.utils as utils

logger = logging.getLogger("CZ4171 Food Classifier")
logging.basicConfig(level=logging.INFO, format='%(asctime)s : %(levelname)s : %(name)s : %(message)s')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--generate', help = 'Generate model or use existing model', required = False)
    args = parser.parse_args()
    logger.info('--generate argument: {}'.format(args.generate))  

    if args.generate == "True":

        """
        Generate a new model
        """

        train_datagen = ImageDataGenerator(rescale = 1./255, shear_range = 0.2, zoom_range = 0.2, horizontal_flip = True)
        validation_datagen = ImageDataGenerator(rescale = 1./255)
        training_set = train_datagen.flow_from_directory(constants.DATA_DIR + '/train', target_size = (64, 64), batch_size = 32, class_mode = 'binary')
        validation_set = validation_datagen.flow_from_directory(constants.DATA_DIR + '/valid', target_size = (64, 64), batch_size = 32, class_mode = 'binary')

        logger.info('Generating model...')
        model = Sequential()
        model.add(Convolution2D(filters = 32, kernel_size = (5,5), strides = 2, padding = 'Same', activation ='relu', input_shape = (64,64,3), kernel_initializer='he_normal'))
        model.add(Convolution2D(filters = 32, kernel_size = (5,5), strides = 2, padding = 'Same', activation ='relu',kernel_initializer='he_normal'))
        model.add(MaxPooling2D(pool_size=(2,2)))
        model.add(Dropout(0.2))
        model.add(Convolution2D(filters = 64, kernel_size = (3,3),padding = 'Same', activation ='relu',kernel_initializer='he_normal'))
        model.add(Convolution2D(filters = 64, kernel_size = (3,3),padding = 'Same', activation ='relu',kernel_initializer='he_normal'))
        model.add(MaxPooling2D(pool_size=(2,2)))
        model.add(Dropout(0.2))
        model.add(Convolution2D(filters = 128, kernel_size = (2,2),padding = 'Same', activation ='relu',kernel_initializer='he_normal'))
        model.add(Convolution2D(filters = 128, kernel_size = (2,2),padding = 'Same', activation ='relu',kernel_initializer='he_normal'))
        model.add(MaxPooling2D(pool_size=(2,2)))
        model.add(Dropout(0.2))
        model.add(Convolution2D(filters = 256, kernel_size = (2,2),padding = 'Same', activation ='relu',kernel_initializer='he_normal'))
        model.add(Convolution2D(filters = 256, kernel_size = (2,2),padding = 'Same', activation ='relu',kernel_initializer='he_normal'))
        model.add(GlobalAveragePooling2D())
        model.add(Dense(512, activation = "relu",kernel_initializer='he_normal'))
        model.add(Dropout(0.2))
        model.add(Dense(constants.PREDICTION_NUMBERS, activation = "softmax",kernel_initializer='he_normal',kernel_regularizer=tf.keras.regularizers.l2()))
        model.compile(optimizer = 'Adam' , loss = "sparse_categorical_crossentropy", metrics=["accuracy"])
        logger.info('Model generated!')

        logger.info('Training model...')
        model.fit_generator(training_set, steps_per_epoch = constants.STEPS_PER_EPOCH/32, epochs = constants.NUMBER_OF_EPOCHS, validation_data = validation_set, validation_steps = constants.VALIDATION_STEPS/32) 
        logger.info('Model trained!')    
        
        logger.info('Saving model...')    
        if os.path.exists('./model.h5'):
            os.remove('./model.h5')
        model.save('model.h5')
        try:
            shutil.rmtree("saved_model")
        except OSError as e:
            print("Error: %s - %s." % (e.filename, e.strerror))
            
        pre_model = tf.keras.models.load_model("model.h5")
        pre_model.save("saved_model")
        logger.info('Model saved!')    

        logger.info('Testing generated model...')  
        model = load_model('model.h5')
        test_datagen = ImageDataGenerator(rescale=1./255)
        test_generator = test_datagen.flow_from_directory(constants.DATA_DIR + '/test', target_size=(64,64), batch_size=32)
        x_test, y_test = test_generator.next()
        y_pred_conf = model.predict(x_test)
        y_pred = np.argmax(y_pred_conf,axis=1)
        y_label = np.argmax(y_test,axis=1)
        print('Accuracy score: {:.1f}%'.format(accuracy_score(y_pred,y_label)*100))

    else:

        """
        the model in backup/ has been trained with 10,000 epochs ang ~8hrs
        """

        logger.info('Testing backup model...')  
        model = load_model(f"{constants.HOME_DIR}/backup/model.h5")
        test_datagen = ImageDataGenerator(rescale=1./255)
        test_generator = test_datagen.flow_from_directory(constants.DATA_DIR + '/test', target_size=(64,64), batch_size=32)
        x_test, y_test = test_generator.next()
        y_pred_conf = model.predict(x_test)
        y_pred = np.argmax(y_pred_conf,axis=1)
        y_label = np.argmax(y_test,axis=1)
        print('Accuracy score: {:.1f}%'.format(accuracy_score(y_pred,y_label)*100))

