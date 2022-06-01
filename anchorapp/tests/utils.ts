import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Anchorapp } from "../target/types/anchorapp";
import * as fs from "fs";

let program = anchor.workspace.Anchorapp as Program<Anchorapp>;

type PubKey = anchor.web3.PublicKey;
type KeyPair = anchor.web3.Keypair;

const DATA_SIZE = 992;
const NUM_INODES = 31;

export type Inode = {
  direct: PubKey[];
  next: PubKey;
};

export async function readInode(inodeKey: PubKey): Promise<Inode> {
  let state = await program.account.block.fetch(inodeKey);
  if (!state.isInode) throw new TypeError("Not an inode");

  let inodes: PubKey[] = state.content["inode"]["inodes"];
  return {
    direct: inodes.slice(1, state.size + 1),
    next: inodes[0],
  };
}

export async function readData(datakey: PubKey): Promise<Uint8Array> {
  let state = await program.account.block.fetch(datakey);
  if (state.isInode) throw new TypeError("Not a data block");

  let rawData: Uint8Array = state.content["data"]["data"];
  let size: number = state.size;
  let result = new Uint8Array(size);
  result.set(rawData.slice(0, size), 0);
  // console.log("Read data size:", size, result.buffer);
  return result;
}

export async function createDataBlock(
  blockKey: KeyPair,
  userKey: PubKey,
  data?: Buffer
) {
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

export async function setData(
  blockKey: KeyPair,
  userKey: PubKey,
  data: Buffer
) {
  await program.methods
    .setData(data)
    .accounts({
      mySpace: blockKey.publicKey,
      user: userKey,
    })
    .signers([])
    .rpc();
}

export async function createInodeBlock(
  blockKey: KeyPair,
  userKey: PubKey,
  inode?: Inode
) {
  await program.methods
    .createInodeBlock(userKey)
    .accounts({
      mySpace: blockKey.publicKey,
      user: userKey,
    })
    .signers([blockKey])
    .rpc();
  if (inode !== undefined) {
    await setInode(blockKey, userKey, inode);
  }
}

export async function setInode(
  blockKey: KeyPair,
  userKey: PubKey,
  inode: Inode
) {
  program.methods
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

function readBuffer(fd: number): Promise<Buffer> {
  return new Promise(function (ok, notOk) {
    var buffer = Buffer.alloc(DATA_SIZE);
    fs.read(fd, buffer, 0, buffer.length, null, (err, bytesRead, buffer) => {
      if (err) return notOk(err);
      // Truncate buffer to fit
      var result = Buffer.alloc(bytesRead);
      result.set(buffer.subarray(0, bytesRead), 0);
      ok(result);
    });
  });
}

function writeBuffer(fd: number, buffer: Buffer): Promise<void> {
  return new Promise(function (ok, notOk) {
    fs.write(
      fd,
      buffer,
      0,
      buffer.length,
      null,
      (err, bytesWritten, buffer) => {
        if (err) return notOk(err);
        ok();
      }
    );
  });
}

export async function uploadFile(
  filePath: string,
  userKey: PubKey
): Promise<PubKey> {
  let fd = fs.openSync(filePath, "r");

  var blockKeys: PubKey[] = [];
  var bytesWritten = 0;

  let promises = [];
  while (true) {
    var blockKey = anchor.web3.Keypair.generate();
    var chunk = await readBuffer(fd);

    // End of file reached
    if (chunk.length === 0) break;

    // console.log("Attempt to write", chunk.length, "bytes...");
    process.stdout.write(".");
    promises.push(createDataBlock(blockKey, userKey, Buffer.from(chunk.buffer)));
    bytesWritten += chunk.length;

    // Add block pair
    blockKeys.push(blockKey.publicKey);
  }
  fs.closeSync(fd);

  if (blockKeys.length === 0) throw RangeError("Empty file");

  // Then write inodes
  var headInodeKey: PubKey = null;
  var currInodeKey: KeyPair = anchor.web3.Keypair.generate();

  for (var i = 0; i < blockKeys.length; i += NUM_INODES - 1) {
    var nextInodeKey: KeyPair = null;
    if (i + NUM_INODES - 1 < blockKeys.length)
      nextInodeKey = anchor.web3.Keypair.generate();

    var inode = {
      direct: blockKeys.slice(
        i,
        Math.min(i + NUM_INODES - 1, blockKeys.length)
      ),
      next: nextInodeKey == null ? null : nextInodeKey.publicKey,
    };
    // console.log("Attempt to write inode", inode);
    promises.push(createInodeBlock(currInodeKey, userKey, inode));

    if (headInodeKey === null) headInodeKey = currInodeKey.publicKey;
    currInodeKey = nextInodeKey;
  }

  await Promise.all(promises);

  console.log("Write size:", bytesWritten);
  return headInodeKey;
}

export async function downloadFile(filePath: string, inodeKey: PubKey) {
  let fd = fs.openSync(filePath, "w");

  let currInode = await readInode(inodeKey);

  var bytesRead = 0;
  while (currInode !== null) {
    // Read current inode data
    for (var i = 0; i < currInode.direct.length; i++) {
      // console.log("Reading data from inode:", currInode.direct[i]);
      var data: Uint8Array = await readData(currInode.direct[i]);
      // console.log("Read data:", data.length);
      process.stdout.write(".");

      // Write data to file
      await writeBuffer(fd, Buffer.from(data.buffer));
      bytesRead += data.length;
    }

    // Go to next inode
    if (currInode.next === null) break;
    currInode = await readInode(currInode.next);
  }

  // Close and report
  console.log("Read size:", bytesRead);
  fs.closeSync(fd);
}
