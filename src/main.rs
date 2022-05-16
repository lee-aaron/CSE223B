use std::{process::Command, str::FromStr};
use solana_client::{
    rpc_client::{self, RpcClient}
};
use solana_sdk::{
    signature::Signer,
    signer::keypair::Keypair,
    pubkey::Pubkey
};

fn main() -> anyhow::Result<()> {
    let mut cmd = Command::new("solana");
    cmd.arg("address");
    let addr = cmd.output().unwrap().stdout;
    let key = std::str::from_utf8(&addr)?;
    println!("addr: {:?}", std::str::from_utf8(&addr).unwrap());

    let client = RpcClient::new("http://localhost:8899");
    let mut trim_addr = key.to_string();
    trim_addr.truncate(key.len() - 1);
    let pubkey = Pubkey::from_str(trim_addr.as_str())?;
    let account = client.get_account(&pubkey)?;

    println!("account: {:?}", account);

    Ok(())
}
