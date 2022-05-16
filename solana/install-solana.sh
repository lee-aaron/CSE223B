#/bin/bash

git clone https://github.com/solana-labs/solana.git
cd solana
cargo build --release
cd ..