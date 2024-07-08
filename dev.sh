#!/bin/bash

echo “Deploying file to server…

rsync -av --progress --exclude="node_modules" * adminsagellc@172.200.99.112:/var/www/html/hich
echo “Done !”