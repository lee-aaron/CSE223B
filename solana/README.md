# Solana

This folder contains files to run a Solana network privately

## Install libudev and clang

`sudo apt-get install libudev-dev clang -y`

## Grafana Dashboards

`cd solana/metrics`

`./scripts/start.sh` may need be ran twice to start

`solana-test-validator` should run after exporting the METRICS_CONFIG env vars

Go to `localhost:3000`

## Adding more Validators

`solana-test-validator --faucet-port 8891 --dynamic-port-range 6000-6020 --rpc-port 5555 -l ledger2`