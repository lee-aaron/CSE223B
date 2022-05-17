#/bin/bash

[ ! -f ".subnet-cli.pk" ] && subnet-cli create key

./cmds/get-uris.sh

subnet-cli wizard \
--node-ids=NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg,NodeID-MFrZFVCXPv5iCn6M9K6XduxGTYp891xXZ,NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN,NodeID-GWPcbFJZFfZreETSoWjPimr846mXEKCtu \
--vm-genesis-path=$GOPATH/src/github.com/ava-labs/subnet-evm/networks/11111/genesis.json \
--vm-id=koLWBW5foH5NC644EoYFe81PWxYZeBd3CvvgjZAXUGs5XR1Lt \
--chain-name=cse223b \
--private-key-path=subnet-cli/.insecure.ewoq.key \
--public-uri=http://localhost:56956