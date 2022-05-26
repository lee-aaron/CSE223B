// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.

const assert = require("assert");
const anchor = require("@project-serum/anchor");

const idl = JSON.parse(
  require("fs").readFileSync("./target/idl/anchorapp.json", "utf8")
);
const programId = new anchor.web3.PublicKey("AB7UQ9XjLKKGYRuqZqb4ZXgVMEs3KpftkNsYLBfKohm3");
// const programId = new anchor.web3.PublicKey("6scwiUMW8MxfJdsXZG878DEm8dLh8ZDPNBezmC3HeZwn");

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

  console.time('post');
  await program.rpc.postMessage("hello there!", {
    accounts: {
      mySpace: mySpace.publicKey,
      user: provider.wallet.publicKey,
    },
    signers: [],
  });
  console.timeEnd('post');
  // #endregion code-simplified

  console.time('read');
  let result = await program.rpc.getMessage({
    accounts: {
      mySpace: mySpace.publicKey,
      user: provider.wallet.publicKey,
    },
    signers: [],
  });
  console.timeEnd('read');

  // console.log(String.fromCharCode(...result));
  // assert.ok(space.data.eq(new anchor.BN(1234)));
}

console.log("Running client.");
main().then(() => console.log("Success"));