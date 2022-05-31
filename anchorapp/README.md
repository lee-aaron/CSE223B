## README

Repo initialized with `anchor init`

Require `solana-cli` installed and user has a wallet.

### How to run
- Call `./setup.sh` to install dependency and build app
- Fire up solana local network with `solana-test-validator`
- Call `anchor deploy` to deploy the program
- (**Important**) Note the program id in the output:
  ```Program Id: 6scwiUMW8MxfJdsXZG878DEm8dLh8ZDPNBezmC3HeZwn```
- Update this id to `Anchor.toml`, `client.js`, and `lib.rs`.
- Call `anchor build; anchor deploy` again to deploy this new program.
- Make a transaction with `ANCHOR_WALLET=<YOUR-KEYPAIR-PATH> node client.js` where `<YOUR-KEYPAIR-PATH>` is the wallet path (`solana config get keypair`).

### Testfile

`dd if=/dev/urandom of=testfile bs=[num bytes] count=1`