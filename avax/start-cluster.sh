#/bin/bash

AVALANCHEGO_EXEC_PATH="${HOME}/avalanchego/build/avalanchego"

# takes in an argument that will specify number of nodes to start in cluster
# default 5

avalanche-network-runner control start \
--log-level debug \
--endpoint="0.0.0.0:8080" \
--number-of-nodes=${1:-5} \
--avalanchego-path ${AVALANCHEGO_EXEC_PATH}