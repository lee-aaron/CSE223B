#!/bin/bash

curl -X POST -k http://localhost:8081/v1/control/health -d '' -s | grep '"healthy":true' > /dev/null
if [ $? -ne 0 ]; then
    echo "Clusters not healthy"
    exit 1
fi
curl -X POST -k http://localhost:8081/v1/control/uris -d ''