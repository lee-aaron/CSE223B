// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

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
  // const dataKeyPair = anchor.web3.Keypair.generate();
  const program = new anchor.Program(idl, programId);
  const user = program.provider.wallet;

  // Upload file
  console.time("upload");
  var inode = await util.uploadFile("testfile", user.publicKey);
  console.timeEnd("upload");
  console.log("Uploaded file with head inode at:", inode.toString());

  // Download file
  console.time("download");
  await util.downloadFile("testfile.out", inode);
  console.timeEnd("download");
}

// Report:
// Write size: 24577
// upload: 22.290s
// Read size: 24577
// download: 29.71ms

console.log("Running client.");
main().then(() => console.log("Success"));