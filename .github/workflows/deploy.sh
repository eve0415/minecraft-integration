#!/usr/bin/env bash
set -e
IMAGE="eve0415/minecraft-integration"
CID=$(docker ps | grep $IMAGE | awk '{print $1}')
docker pull $IMAGE:latest

for im in $CID
do
    LATEST=`docker inspect --format "{{.Id}}" $IMAGE`
    RUNNING=`docker inspect --format "{{.Image}}" $im`
    NAME=`docker inspect --format '{{.Name}}' $im | sed "s/\///g"`
    echo "Latest:" $LATEST
    echo "Running:" $RUNNING
    if [ "$RUNNING" != "$LATEST" ];then
        echo "upgrading $IMAGE"
        docker stop $NAME
        docker run -v $PWD/data:/app/data/ --env-file .env -p 25500:25500 --name MI -itd --rm eve0415/minecraft-integration
    else
        echo "$IMAGE is up to date"
    fi
done