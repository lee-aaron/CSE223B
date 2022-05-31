// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const assert = require("assert");
const anchor = require("@project-serum/anchor");
const util = require("./tests/utils.js");

const idl = JSON.parse(
  require("fs").readFileSync("./target/idl/anchorapp.json", "utf8")
);
// const programId = new anchor.web3.PublicKey("AB7UQ9XjLKKGYRuqZqb4ZXgVMEs3KpftkNsYLBfKohm3");
const programId = new anchor.web3.PublicKey("6scwiUMW8MxfJdsXZG878DEm8dLh8ZDPNBezmC3HeZwn");

// Configure the local cluster.
const provider = anchor.AnchorProvider.local()
anchor.setProvider(provider);

async function main() {
  // #region code-simplified
  // The program to execute.
  const program = new anchor.Program(idl, programId);

  const dataKeyPair = anchor.web3.Keypair.generate();
  const claimer = program.provider.wallet;

  // Claim space
  await util.createInodeBlock(dataKeyPair, claimer.publicKey);
  
  // Update message
  let accounts = new Array(30);
  accounts.fill(anchor.web3.Keypair.generate().publicKey, 0, accounts.length);
  let inode = {direct: accounts, next: anchor.web3.Keypair.generate().publicKey};
  await util.setInode(dataKeyPair, claimer.publicKey, inode);

  let result = await util.readInode(dataKeyPair.publicKey);
  console.log(result);
}

console.log("Running client.");
main().then(() => console.log("Success"));