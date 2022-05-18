#/bin/bash

AVALANCHEGO_EXEC_PATH="${GOPATH}/avalanchego/build/avalanchego"

avalanche-network-runner server --log-level debug --port=":8080" --grpc-gateway-port=":8081"