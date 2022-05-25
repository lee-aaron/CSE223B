// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const assert = require("assert");
const anchor = require("@project-serum/anchor");

const idl = JSON.parse(
  require("fs").readFileSync("./target/idl/anchorapp.json", "utf8")
);
const programId = new anchor.web3.PublicKey("AB7UQ9XjLKKGYRuqZqb4ZXgVMEs3KpftkNsYLBfKohm3");

// Configure the local cluster.
const provider = anchor.AnchorProvider.local()
anchor.setProvider(provider);

async function main() {
  // #region code-simplified
  // The program to execute.
  const program = new anchor.Program(idl, programId);

  // The Account to create.
  const mySpace = anchor.web3.Keypair.generate();

  // Create the new account and initialize it with the program.
  // #region code-simplified
  await program.rpc.claimSpace(provider.wallet.publicKey, "user", {
    accounts: {
      mySpace: mySpace.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [mySpace],
  });
  await program.rpc.postMessage(provider.wallet.publicKey, "hello there!", {
    accounts: {
      mySpace: mySpace.publicKey,
      user: provider.wallet.publicKey,
    },
    signers: [],
  });
  // #endregion code-simplified

  // Fetch the newly created account from the cluster.
  const space = await program.account.space.fetch(mySpace.publicKey);

  // Check it's state was initialized.
  console.log("Got space name:", space.name);
  console.log("Got space message:", space.message);
  // assert.ok(space.data.eq(new anchor.BN(1234)));
}

console.log("Running client.");
main().then(() => console.log("Success"));