#/bin/bash

wget https://github.com/ava-labs/avalanchego/releases/download/v1.7.10/avalanchego-linux-arm64-v1.7.10.tar.gz
tar -xvzf avalanchego-linux-arm64-v1.7.10.tar.gz

echo "Update your AVALANCHEGO_EXEC_PATH: ${PWD}/avalanchego-v1.7.10/avalanchego"

rm avalanchego-linux-arm64-v1.7.10.tar.gz