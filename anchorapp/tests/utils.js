"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var anchor = require("@project-serum/anchor");
var fs_1 = require("fs");
var program = anchor.workspace.Anchorapp;
var DATA_SIZE = 992;
var NUM_INODES = 31;
function readInode(inodeKey) {
    return __awaiter(this, void 0, void 0, function () {
        var state, inodes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.account.block.fetch(inodeKey)];
                case 1:
                    state = _a.sent();
                    if (!state.isInode)
                        throw new TypeError("Not an inode");
                    inodes = state.content['inode']['inodes'];
                    return [2 /*return*/, {
                            direct: inodes.slice(1, state.size + 1),
                            next: inodes[0]
                        }];
            }
        });
    });
}
exports.readInode = readInode;
function readData(datakey) {
    return __awaiter(this, void 0, void 0, function () {
        var state, rawData, size;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.account.block.fetch(datakey)];
                case 1:
                    state = _a.sent();
                    if (state.isInode)
                        throw new TypeError("Not a data block");
                    rawData = state.content['data']['data'];
                    size = state.size;
                    // console.log("Read data size:", size);
                    return [2 /*return*/, rawData.slice(0, size)];
            }
        });
    });
}
exports.readData = readData;
function createDataBlock(blockKey, userKey, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.methods
                        .createDataBlock(userKey)
                        .accounts({
                        mySpace: blockKey.publicKey,
                        user: userKey
                    })
                        .signers([blockKey])
                        .rpc()];
                case 1:
                    _a.sent();
                    if (!(data !== undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, setData(blockKey, userKey, data)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createDataBlock = createDataBlock;
function setData(blockKey, userKey, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.methods
                        .setData(data)
                        .accounts({
                        mySpace: blockKey.publicKey,
                        user: userKey
                    })
                        .signers([])
                        .rpc()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setData = setData;
function createInodeBlock(blockKey, userKey, inode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.methods
                        .createInodeBlock(userKey)
                        .accounts({
                        mySpace: blockKey.publicKey,
                        user: userKey
                    })
                        .signers([blockKey])
                        .rpc()];
                case 1:
                    _a.sent();
                    if (!(inode !== undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, setInodes(blockKey, userKey, inode)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createInodeBlock = createInodeBlock;
function setInodes(blockKey, userKey, inode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, program.methods
                        .setDirectBlocks(inode.direct)
                        .accounts({
                        mySpace: blockKey.publicKey,
                        user: userKey
                    })
                        .signers([])
                        .rpc()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, program.methods
                            .setNextInodeBlock(inode.next)
                            .accounts({
                            mySpace: blockKey.publicKey,
                            user: userKey
                        })
                            .signers([])
                            .rpc()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setInodes = setInodes;
function uploadFile(filePath, userKey) {
    return __awaiter(this, void 0, void 0, function () {
        var result, encoder, bytes, blockKeys, bufferIndex, i, blockKey, writeSize, chunk, headInodeKey, i, nextInodeKey, inode, currInodeKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = fs_1.readFileSync(filePath, 'utf-8');
                    encoder = new TextEncoder();
                    bytes = encoder.encode(result);
                    blockKeys = [];
                    bufferIndex = 0;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < bytes.length)) return [3 /*break*/, 4];
                    blockKey = anchor.web3.Keypair.generate();
                    writeSize = Math.min(bufferIndex + DATA_SIZE, bytes.length) - bufferIndex;
                    chunk = new Uint8Array(writeSize);
                    chunk.set(bytes.subarray(bufferIndex, bufferIndex + writeSize), 0);
                    // console.log("Attempt to write", chunk.length, "bytes...");
                    return [4 /*yield*/, createDataBlock(blockKey, userKey, Buffer.from(chunk.buffer))];
                case 2:
                    // console.log("Attempt to write", chunk.length, "bytes...");
                    _a.sent();
                    bufferIndex += writeSize;
                    // Add block pair
                    blockKeys.push(blockKey.publicKey);
                    _a.label = 3;
                case 3:
                    i += DATA_SIZE;
                    return [3 /*break*/, 1];
                case 4:
                    headInodeKey = null;
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < blockKeys.length)) return [3 /*break*/, 8];
                    nextInodeKey = null;
                    if (i + NUM_INODES - 1 < blockKeys.length)
                        nextInodeKey = anchor.web3.Keypair.generate();
                    inode = {
                        direct: blockKeys.slice(i, Math.min(i + NUM_INODES - 1, blockKeys.length)),
                        next: nextInodeKey
                    };
                    currInodeKey = anchor.web3.Keypair.generate();
                    console.log("Attempt to write inode", inode);
                    return [4 /*yield*/, createInodeBlock(currInodeKey, userKey, inode)];
                case 6:
                    _a.sent();
                    if (headInodeKey === null)
                        headInodeKey = currInodeKey.publicKey;
                    _a.label = 7;
                case 7:
                    i += NUM_INODES - 1;
                    return [3 /*break*/, 5];
                case 8:
                    console.log("Write size:", bufferIndex);
                    return [2 /*return*/, headInodeKey];
            }
        });
    });
}
exports.uploadFile = uploadFile;
function downloadFile(filePath, inodeKey) {
    return __awaiter(this, void 0, void 0, function () {
        var currInode, buffer, size, newBuffer, i, data, newBuffer, decoder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readInode(inodeKey)];
                case 1:
                    currInode = _a.sent();
                    buffer = new Uint8Array(0);
                    size = 0;
                    _a.label = 2;
                case 2:
                    if (!(currInode !== null)) return [3 /*break*/, 8];
                    newBuffer = new Uint8Array(size + currInode.direct.length * DATA_SIZE);
                    newBuffer.set(buffer, 0);
                    buffer = newBuffer;
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < currInode.direct.length)) return [3 /*break*/, 6];
                    return [4 /*yield*/, readData(currInode.direct[i])];
                case 4:
                    data = _a.sent();
                    buffer.set(data, size);
                    size += data.length;
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 3];
                case 6:
                    // Go to next inode
                    if (currInode.next === null)
                        return [3 /*break*/, 8];
                    return [4 /*yield*/, readInode(currInode.next)];
                case 7:
                    currInode = _a.sent();
                    return [3 /*break*/, 2];
                case 8:
                    newBuffer = new Uint8Array(size);
                    newBuffer.set(buffer.subarray(0, size), 0);
                    buffer = newBuffer;
                    decoder = new TextDecoder();
                    console.log("Read size:", buffer.length);
                    fs_1.writeFileSync(filePath, decoder.decode(buffer));
                    return [2 /*return*/];
            }
        });
    });
}
exports.downloadFile = downloadFile;
