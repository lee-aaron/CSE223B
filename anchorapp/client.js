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
  const myAccount = anchor.web3.Keypair.generate();

  // Create the new account and initialize it with the program.
  // #region code-simplified
  await program.rpc.initialize(new anchor.BN(1234), {
    accounts: {
      myAccount: myAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [myAccount],
  });
  // #endregion code-simplified

  // Fetch the newly created account from the cluster.
  const account = await program.account.myAccount.fetch(myAccount.publicKey);

  // Check it's state was initialized.
  assert.ok(account.data.eq(new anchor.BN(1234)));
}

console.log("Running client.");
main().then(() => console.log("Success"));