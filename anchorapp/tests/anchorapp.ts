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

  it("claim a space and post a message", async () => {
    const spaceKeyPair = anchor.web3.Keypair.generate();
    const claimer = (program.provider as anchor.AnchorProvider).wallet;

    // Claim space
    await program.methods
      .claimSpace(claimer.publicKey, "user")
      .accounts({
        mySpace: spaceKeyPair.publicKey,
        user: claimer.publicKey,
      })
      .signers([spaceKeyPair])
      .rpc();
    
    // Update message
    await program.methods
      .postMessage(claimer.publicKey, "hello there!")
      .accounts({
        mySpace: spaceKeyPair.publicKey,
        user: claimer.publicKey,
      })
      .signers([])
      .rpc();

    let spaceState = await program.account.space.fetch(spaceKeyPair.publicKey);
    
    // Name: user
    let name = String.fromCharCode(...spaceState.name);
    chai.expect(name.substring(0, name.indexOf('\0'))).to.equal("user");
    let message = String.fromCharCode(...spaceState.message);
    chai.expect(message.substring(0, message.indexOf('\0'))).to.equal("hello there!");
  });

  it("claim a space already claimed", async () => {
    const spaceKeyPair = anchor.web3.Keypair.generate();
    const claimer1 = (program.provider as anchor.AnchorProvider).wallet;
    const claimer2 = anchor.web3.Keypair.generate();

    // Claim space
    await program.methods
      .claimSpace(claimer1.publicKey, "user")
      .accounts({
        mySpace: spaceKeyPair.publicKey,
        user: claimer1.publicKey,
      })
      .signers([spaceKeyPair])
      .rpc();
    
    // Claim space again with the space key
    chai.expect(program.methods
      .claimSpace(claimer2.publicKey, "user")
      .accounts({
        mySpace: spaceKeyPair.publicKey,
        user: claimer2.publicKey,
      })
      .signers([spaceKeyPair])
      .rpc()).to.be.rejectedWith("Error");
  });
});
