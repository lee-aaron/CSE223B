import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Anchorapp } from "../target/types/anchorapp";
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import * as util from "./utils"
// const file = readFileSync('./filename.txt', 'utf-8');

chai.use(chaiAsPromised);

describe("anchorapp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.Anchorapp as Program<Anchorapp>;

  it("create block and set data", async () => {
    const dataKeyPair = anchor.web3.Keypair.generate();
    const claimer = (program.provider as anchor.AnchorProvider).wallet;

    // Claim space
    await util.createDataBlock(dataKeyPair, claimer.publicKey);
    
    // Update message
    let text = "A".repeat(3);
    let array = Uint8Array.from(text.split("").map(c => c.charCodeAt(0)));
    let buffer = Buffer.from(array.buffer);
    await util.setData(dataKeyPair, claimer.publicKey, buffer);

    let data = await util.readData(dataKeyPair.publicKey);
    // array.forEach((e, i) => chai.expect(e).to.equal(data[i]));
    chai.expect(data).to.deep.equal(array);

    // let state = await program.account.block.fetch(dataKeyPair.publicKey);
    // chai.expect(!state.isInode);
    // chai.expect(state.size).to.equal(text.length);
    // let data = state.content['data'];
    // chai.expect(data).to.not.equal(undefined);
    // data = data['data'];
    // array.forEach((e, i) => chai.expect(e).to.equal(data[i]));
  });

  it("create block and set inodes", async () => {
    const dataKeyPair = anchor.web3.Keypair.generate();
    const claimer = (program.provider as anchor.AnchorProvider).wallet;

    // Claim space
    await util.createInodeBlock(dataKeyPair, claimer.publicKey);
    
    // Update message
    let accounts = Array(3).fill(anchor.web3.Keypair.generate().publicKey);
    let inode = {direct: accounts, next: null};
    await util.setInode(dataKeyPair, claimer.publicKey, inode);

    let result = await util.readInode(dataKeyPair.publicKey);
    chai.expect(result).to.deep.equal(inode);
    
    // Add next pointer for testing
    // let state = await program.account.block.fetch(spaceKeyPair.publicKey);
    // chai.expect(state.isInode);
    // chai.expect(state.size).to.equal(accounts.length);
    // let inodes = state.content['inode'];
    // chai.expect(inodes).to.not.equal(undefined);
    // accounts.unshift(null);
    // inodes = inodes['inodes'];
    // accounts.forEach((e, i) => chai.expect(e).to.deep.equal(inodes[i]));
  });
  
  it("set next inode and direct blocks", async () => {
    const dataKeyPair = anchor.web3.Keypair.generate();
    const claimer = (program.provider as anchor.AnchorProvider).wallet;

    // Claim space
    await util.createInodeBlock(dataKeyPair, claimer.publicKey);
    
    // Update message
    let accounts = Array(30).fill(anchor.web3.Keypair.generate().publicKey);
    let inode = {direct: accounts, next: anchor.web3.Keypair.generate().publicKey};
    await util.setInode(dataKeyPair, claimer.publicKey, inode);

    let result = await util.readInode(dataKeyPair.publicKey);
    chai.expect(result).to.deep.equal(inode);
  });
});