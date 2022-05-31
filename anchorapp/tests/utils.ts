import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Anchorapp } from "../target/types/anchorapp";
import { readFileSync, writeFileSync } from 'fs';

let program = anchor.workspace.Anchorapp as Program<Anchorapp>;

type PubKey = anchor.web3.PublicKey;
type KeyPair = anchor.web3.Keypair;

const DATA_SIZE = 992;
const NUM_INODES = 31;

export type Inode = {
  direct: PubKey[],
  next: PubKey
}

export async function readInode(inodeKey: PubKey): Promise<Inode> {
  let state = await program.account.block.fetch(inodeKey);
  if (!state.isInode) throw new TypeError("Not an inode");

  let inodes: PubKey[] = state.content['inode']['inodes'];
  return {
    direct: inodes.slice(1, state.size + 1),
    next: inodes[0]
  };
}

export async function readData(datakey: PubKey): Promise<Uint8Array> {
  let state = await program.account.block.fetch(datakey);
  if (state.isInode) throw new TypeError("Not a data block");

  let rawData: Uint8Array = state.content['data']['data'];
  let size: number = state.size;
  // console.log("Read data size:", size);
  return rawData.slice(0, size);
}

export async function createDataBlock(blockKey: KeyPair, userKey: PubKey, data?: Buffer) {
  await program.methods
    .createDataBlock(userKey)
    .accounts({
      mySpace: blockKey.publicKey,
      user: userKey,
    })
    .signers([blockKey])
    .rpc();

  if (data !== undefined) {
    await setData(blockKey, userKey, data);
  }
}

export async function setData(blockKey: KeyPair, userKey: PubKey, data: Buffer) {
  await program.methods
    .setData(data)
    .accounts({
      mySpace: blockKey.publicKey,
      user: userKey,
    })
    .signers([])
    .rpc();
}

export async function createInodeBlock(blockKey: KeyPair, userKey: PubKey, inode?: Inode) {
  await program.methods
    .createInodeBlock(userKey)
    .accounts({
      mySpace: blockKey.publicKey,
      user: userKey,
    })
    .signers([blockKey])
    .rpc();
  if (inode !== undefined) {
    await setInodes(blockKey, userKey, inode);
  }
}

export async function setInodes(blockKey: KeyPair, userKey: PubKey, inode: Inode) {
  await program.methods
    .setDirectBlocks(inode.direct)
    .accounts({
      mySpace: blockKey.publicKey,
      user: userKey,
    })
    .signers([])
    .rpc();
  await program.methods
    .setNextInodeBlock(inode.next)
    .accounts({
      mySpace: blockKey.publicKey,
      user: userKey,
    })
    .signers([])
    .rpc();
}

export async function uploadFile(filePath: string, userKey: PubKey): Promise<PubKey> {
  let result: string = readFileSync(filePath, 'utf-8');
  let encoder = new TextEncoder();
  let bytes: Uint8Array = encoder.encode(result);

  // Write data first
  var blockKeys: PubKey[] = [];
  var bufferIndex = 0;
  for(var i = 0; i < bytes.length; i += DATA_SIZE) {
    var blockKey = anchor.web3.Keypair.generate();
    var writeSize = Math.min(bufferIndex+DATA_SIZE, bytes.length)-bufferIndex;
    var chunk = new Uint8Array(writeSize);
    chunk.set(bytes.subarray(bufferIndex, bufferIndex+writeSize), 0);
    // console.log("Attempt to write", chunk.length, "bytes...");
    await createDataBlock(blockKey, userKey, Buffer.from(chunk.buffer));
    bufferIndex += writeSize;

    // Add block pair
    blockKeys.push(blockKey.publicKey);
  }

  // Then write inodes
  var headInodeKey: PubKey = null;
  for(var i = 0; i < blockKeys.length; i += NUM_INODES-1) {
    var nextInodeKey = null;
    if(i + NUM_INODES-1 < blockKeys.length) nextInodeKey = anchor.web3.Keypair.generate();

    var inode = {
      direct: blockKeys.slice(i, Math.min(i+NUM_INODES-1, blockKeys.length)),
      next: nextInodeKey,
    };
    var currInodeKey = anchor.web3.Keypair.generate();
    console.log("Attempt to write inode", inode);
    await createInodeBlock(currInodeKey, userKey, inode);

    if(headInodeKey === null) headInodeKey = currInodeKey.publicKey;
  }

  console.log("Write size:", bufferIndex);
  return headInodeKey;
}

export async function downloadFile(filePath: string, inodeKey: PubKey) {
  let currInode = await readInode(inodeKey);
  let buffer: Uint8Array = new Uint8Array(0);

  var size = 0;
  while(currInode !== null) {
    // Copy & preallocate buffer
    var newBuffer = new Uint8Array(size + currInode.direct.length*DATA_SIZE);
    newBuffer.set(buffer, 0);
    buffer = newBuffer;

    // Read current inode data
    for(var i = 0; i < currInode.direct.length; i++) {
      // console.log("Reading data from inode:", currInode.direct[i]);
      var data = await readData(currInode.direct[i]);
      buffer.set(data, size);
      size += data.length;
    }

    // Go to next inode
    if(currInode.next === null) break;
    currInode = await readInode(currInode.next);
  }

  // Truncate unused buffer
  var newBuffer = new Uint8Array(size);
  newBuffer.set(buffer.subarray(0, size), 0);
  buffer = newBuffer;

  // Write data to file
  let decoder = new TextDecoder();
  console.log("Read size:", buffer.length);
  writeFileSync(filePath, decoder.decode(buffer));
}