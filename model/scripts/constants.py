import os
import glob

DATA_DIR = "CHANGE THIS"

HOME_DIR = "CHANGE THIS"

PREDICTION_LABELS = {}

COUNTER = 0

"""
Must be sorted alphabetically as labelling by ImageDataGenerator.flow_from_directory() will label alphabetically
"""

for possible_dir in sorted(os.listdir(f"{DATA_DIR}/train")):
    if os.path.isdir(f"{DATA_DIR}/train/{possible_dir}"):
        PREDICTION_LABELS[COUNTER] = possible_dir
        COUNTER += 1

PREDICTION_LABELS_NUMBERS = list(PREDICTION_LABELS.keys())[-1] + 1

PREDICTION_NUMBERS = len(list(PREDICTION_LABELS.keys()))

"""
Ensure ratio of train:valid:test is 8:1:1
"""

# for index in PREDICTION_LABELS:
#     print(f"Validating data points for {PREDICTION_LABELS[index]}")
#     print(len(glob.glob(os.path.join(f'{DATA_DIR}/train/{PREDICTION_LABELS[index]}', '*'))))
#     print(len(glob.glob(os.path.join(f'{DATA_DIR}/test/{PREDICTION_LABELS[index]}', '*'))))
#     print(len(glob.glob(os.path.join(f'{DATA_DIR}/valid/{PREDICTION_LABELS[index]}', '*'))))

# assert len(glob.glob(os.path.join(f'{DATA_DIR}/train/{PREDICTION_LABELS[0]}', '*'))) == len(glob.glob(os.path.join(f'{DATA_DIR}/test/{PREDICTION_LABELS[0]}', '*'))) * 8
# assert len(glob.glob(os.path.join(f'{DATA_DIR}/valid/{PREDICTION_LABELS[0]}', '*'))) == len(glob.glob(os.path.join(f'{DATA_DIR}/test/{PREDICTION_LABELS[0]}', '*')))

"""
STEPS_PER_EPOCH & VALIDATION_STEPS should be number of labels * number of images per label
"""

STEPS_PER_EPOCH = len(list(PREDICTION_LABELS.keys())) * len(glob.glob(os.path.join(f'{DATA_DIR}/train/{PREDICTION_LABELS[0]}', '*')))

VALIDATION_STEPS = len(list(PREDICTION_LABELS.keys())) * len(glob.glob(os.path.join(f'{DATA_DIR}/valid/{PREDICTION_LABELS[0]}', '*')))

TRAIN_BY_API_NOT_CRON = True

NUMBER_OF_EPOCHS = 1
