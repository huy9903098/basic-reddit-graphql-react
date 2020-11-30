#!/bin/bash

echo What should version be?
read VERSION 

docker build -t huyfromspace/hotts:$VERSION .
docker push huyfromspace/hotts:$VERSION
ssh root@139.59.133.213 "docker pull huyfromspace/hotts:$VERSION && docker tag huyfromspace/hotts:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"