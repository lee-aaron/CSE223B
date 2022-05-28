import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Anchorapp } from "../target/types/anchorapp";
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe("anchorapp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Anchorapp as Program<Anchorapp>;

  it("create block and set data", async () => {
    const spaceKeyPair = anchor.web3.Keypair.generate();
    const claimer = (program.provider as anchor.AnchorProvider).wallet;

    // Claim space
    await program.methods
      .createDataBlock(claimer.publicKey)
      .accounts({
        mySpace: spaceKeyPair.publicKey,
        user: claimer.publicKey,
      })
      .signers([spaceKeyPair])
      .rpc();
    
    // Update message
    let text = "h".repeat(3);
    let array = Uint8Array.from(text.split("").map(c => c.charCodeAt(0)));
    let buffer = Buffer.from(array.buffer);
    await program.methods
      .setData(buffer)
      .accounts({
        mySpace: spaceKeyPair.publicKey,
        user: claimer.publicKey,
      })
      .signers([])
      .rpc();

    let state = await program.account.block.fetch(spaceKeyPair.publicKey);
    let data = state.content.data;
    chai.expect(data['data']).to.not.equal(undefined);
    data = data['data'];
    array.forEach((e, i) => chai.expect(e).to.equal(data[i]));

    // Not working
    // await program.rpc.getData({
    //   accounts: {
    //     mySpace: spaceKeyPair.publicKey,
    //   },
    //   signers: [],
    // });
  });

  // it("claim a space already claimed", async () => {
  //   const spaceKeyPair = anchor.web3.Keypair.generate();
  //   const claimer1 = (program.provider as anchor.AnchorProvider).wallet;
  //   const claimer2 = anchor.web3.Keypair.generate();

  //   // Claim space
  //   await program.methods
  //     .claimSpace(claimer1.publicKey, "user")
  //     .accounts({
  //       mySpace: spaceKeyPair.publicKey,
  //       user: claimer1.publicKey,
  //     })
  //     .signers([spaceKeyPair])
  //     .rpc();
    
  //   // Claim space again with the space key
  //   chai.expect(program.methods
  //     .claimSpace(claimer2.publicKey, "user")
  //     .accounts({
  //       mySpace: spaceKeyPair.publicKey,
  //       user: claimer2.publicKey,
  //     })
  //     .signers([spaceKeyPair])
  //     .rpc()).to.be.rejectedWith("Error");
  // });

  // it("write to a space not owned", async () => {
  //   const spaceKeyPair = anchor.web3.Keypair.generate();
  //   const claimer1 = (program.provider as anchor.AnchorProvider).wallet;
  //   const claimer2 = anchor.web3.Keypair.generate();

  //   // Claim space
  //   await program.methods
  //     .claimSpace(claimer1.publicKey, "user")
  //     .accounts({
  //       mySpace: spaceKeyPair.publicKey,
  //       user: claimer1.publicKey,
  //     })
  //     .signers([spaceKeyPair])
  //     .rpc();
    
  //   // Write some content
  //   await program.methods
  //     .postMessage("hello there!")
  //     .accounts({
  //       mySpace: spaceKeyPair.publicKey,
  //       user: claimer1.publicKey,
  //     })
  //     .signers([])
  //     .rpc();
    
  //   // Write again to the space
  //   chai.expect(program.methods
  //     .postMessage("hello there!")
  //     .accounts({
  //       mySpace: spaceKeyPair.publicKey,
  //       user: claimer2.publicKey,
  //     })
  //     .signers([])
  //     .rpc()).to.be.rejectedWith("Error");
  // });

  // it("time test", async () => {
  //   const spaceKeyPair = anchor.web3.Keypair.generate();
  //   const claimer = (program.provider as anchor.AnchorProvider).wallet;

  //   // Claim space
  //   await program.methods
  //     .claimSpace(claimer.publicKey, "user")
  //     .accounts({
  //       mySpace: spaceKeyPair.publicKey,
  //       user: claimer.publicKey,
  //     })
  //     .signers([spaceKeyPair])
  //     .rpc();
    
    // Write some content
    // console.time("write");
    // await program.methods
    //   .postMessage("hello there!")
    //   .accounts({
    //     mySpace: spaceKeyPair.publicKey,
    //     user: claimer.publicKey,
    //   })
    //   .signers([])
    //   .rpc();
    // console.timeEnd("write");
    
    // Get message
    // console.time("read");
    // await program.methods
    //   .getMessage()
    //   .accounts({
    //     mySpace: spaceKeyPair.publicKey,
    //   })
    //   .signers([])
    //   .rpc();
    // console.timeEnd("read");
  // });
});
