#!/bin/sh

directory="CHANGE ME TO THE ABSOLUTE PATH TO CZ4171/model"

starting_datetime=$(date)

echo "Collected new images, training model now at $starting_datetime" >> "$directory/cron_resources/retrain.log"

cd $(echo $directory)

source venv/bin/activate

cd scripts

python3 main.py --generate True

middle_datetime_1=$(date)

echo "Generated .h5 and .pb file at $middle_datetime_1" >> "$directory/cron_resources/retrain.log"

docker container stop cz4171

docker container rm cz4171

docker run -p 8501:8501 --name cz4171 -v "$directory/scripts/saved_model:/models/cz4171/1" -e MODEL_NAME=cz4171 tensorflow/serving &

completed_datetime=$(date)

echo "Retrained and deployed new model at $completed_datetime" >> "$directory/cron_resources/retrain.log"

echo $'\n' >> "$directory/cron_resources/retrain.log"