#/bin/bash

wget https://github.com/ava-labs/avalanche-network-runner/releases/download/v1.0.16-beta/avalanche-network-runner_1.0.16-beta_linux_amd64.tar.gz
tar -xvzf avalanche-network-runner_1.0.16-beta_linux_amd64.tar.gz
mv avalanche-network-runner /usr/local/bin/
rm avalanche-network-runner_1.0.16-beta_linux_amd64.tar.gz LICENSE.header