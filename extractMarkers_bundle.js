var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = {exports: {}}).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// node_modules/strtok3/lib/FsPromise.js
var require_FsPromise = __commonJS({
  "node_modules/strtok3/lib/FsPromise.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.readFile = exports2.writeFileSync = exports2.writeFile = exports2.read = exports2.open = exports2.close = exports2.stat = exports2.createReadStream = exports2.pathExists = void 0;
    var fs2 = require("fs");
    exports2.pathExists = fs2.existsSync;
    exports2.createReadStream = fs2.createReadStream;
    async function stat(path) {
      return new Promise((resolve, reject) => {
        fs2.stat(path, (err, stats) => {
          if (err)
            reject(err);
          else
            resolve(stats);
        });
      });
    }
    exports2.stat = stat;
    async function close(fd) {
      return new Promise((resolve, reject) => {
        fs2.close(fd, (err) => {
          if (err)
            reject(err);
          else
            resolve();
        });
      });
    }
    exports2.close = close;
    async function open(path, mode) {
      return new Promise((resolve, reject) => {
        fs2.open(path, mode, (err, fd) => {
          if (err)
            reject(err);
          else
            resolve(fd);
        });
      });
    }
    exports2.open = open;
    async function read(fd, buffer, offset, length, position) {
      return new Promise((resolve, reject) => {
        fs2.read(fd, buffer, offset, length, position, (err, bytesRead, _buffer) => {
          if (err)
            reject(err);
          else
            resolve({bytesRead, buffer: _buffer});
        });
      });
    }
    exports2.read = read;
    async function writeFile(path, data) {
      return new Promise((resolve, reject) => {
        fs2.writeFile(path, data, (err) => {
          if (err)
            reject(err);
          else
            resolve();
        });
      });
    }
    exports2.writeFile = writeFile;
    function writeFileSync(path, data) {
      fs2.writeFileSync(path, data);
    }
    exports2.writeFileSync = writeFileSync;
    async function readFile(path) {
      return new Promise((resolve, reject) => {
        fs2.readFile(path, (err, buffer) => {
          if (err)
            reject(err);
          else
            resolve(buffer);
        });
      });
    }
    exports2.readFile = readFile;
  }
});

// node_modules/peek-readable/lib/EndOfFileStream.js
var require_EndOfFileStream = __commonJS({
  "node_modules/peek-readable/lib/EndOfFileStream.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.EndOfStreamError = exports2.defaultMessages = void 0;
    exports2.defaultMessages = "End-Of-Stream";
    var EndOfStreamError = class extends Error {
      constructor() {
        super(exports2.defaultMessages);
      }
    };
    exports2.EndOfStreamError = EndOfStreamError;
  }
});

// node_modules/peek-readable/lib/index.js
var require_lib = __commonJS({
  "node_modules/peek-readable/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.StreamReader = exports2.EndOfStreamError = void 0;
    var EndOfFileStream_1 = require_EndOfFileStream();
    var EndOfFileStream_2 = require_EndOfFileStream();
    Object.defineProperty(exports2, "EndOfStreamError", {enumerable: true, get: function() {
      return EndOfFileStream_2.EndOfStreamError;
    }});
    var Deferred = class {
      constructor() {
        this.promise = new Promise((resolve, reject) => {
          this.reject = reject;
          this.resolve = resolve;
        });
      }
    };
    var maxStreamReadSize = 1 * 1024 * 1024;
    var StreamReader = class {
      constructor(s) {
        this.s = s;
        this.endOfStream = false;
        this.peekQueue = [];
        if (!s.read || !s.once) {
          throw new Error("Expected an instance of stream.Readable");
        }
        this.s.once("end", () => this.reject(new EndOfFileStream_1.EndOfStreamError()));
        this.s.once("error", (err) => this.reject(err));
        this.s.once("close", () => this.reject(new Error("Stream closed")));
      }
      async peek(buffer, offset, length) {
        const bytesRead = await this.read(buffer, offset, length);
        this.peekQueue.push(buffer.slice(offset, offset + bytesRead));
        return bytesRead;
      }
      async read(buffer, offset, length) {
        if (length === 0) {
          return 0;
        }
        if (this.peekQueue.length === 0 && this.endOfStream) {
          throw new EndOfFileStream_1.EndOfStreamError();
        }
        let remaining = length;
        let bytesRead = 0;
        while (this.peekQueue.length > 0 && remaining > 0) {
          const peekData = this.peekQueue.pop();
          const lenCopy = Math.min(peekData.length, remaining);
          peekData.copy(buffer, offset + bytesRead, 0, lenCopy);
          bytesRead += lenCopy;
          remaining -= lenCopy;
          if (lenCopy < peekData.length) {
            this.peekQueue.push(peekData.slice(lenCopy));
          }
        }
        while (remaining > 0 && !this.endOfStream) {
          const reqLen = Math.min(remaining, maxStreamReadSize);
          const chunkLen = await this._read(buffer, offset + bytesRead, reqLen);
          bytesRead += chunkLen;
          if (chunkLen < reqLen)
            break;
          remaining -= chunkLen;
        }
        return bytesRead;
      }
      async _read(buffer, offset, length) {
        if (this.request)
          throw new Error("Concurrent read operation?");
        const readBuffer = this.s.read(length);
        if (readBuffer) {
          readBuffer.copy(buffer, offset);
          return readBuffer.length;
        } else {
          this.request = {
            buffer,
            offset,
            length,
            deferred: new Deferred()
          };
          this.s.once("readable", () => {
            this.tryRead();
          });
          return this.request.deferred.promise.then((n) => {
            this.request = null;
            return n;
          }, (err) => {
            this.request = null;
            throw err;
          });
        }
      }
      tryRead() {
        const readBuffer = this.s.read(this.request.length);
        if (readBuffer) {
          readBuffer.copy(this.request.buffer, this.request.offset);
          this.request.deferred.resolve(readBuffer.length);
        } else {
          this.s.once("readable", () => {
            this.tryRead();
          });
        }
      }
      reject(err) {
        this.endOfStream = true;
        if (this.request) {
          this.request.deferred.reject(err);
          this.request = null;
        }
      }
    };
    exports2.StreamReader = StreamReader;
  }
});

// node_modules/strtok3/lib/AbstractTokenizer.js
var require_AbstractTokenizer = __commonJS({
  "node_modules/strtok3/lib/AbstractTokenizer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.AbstractTokenizer = void 0;
    var peek_readable_1 = require_lib();
    var AbstractTokenizer = class {
      constructor(fileInfo) {
        this.position = 0;
        this.numBuffer = Buffer.alloc(10);
        this.fileInfo = fileInfo ? fileInfo : {};
      }
      async readToken(token, position) {
        const buffer = Buffer.alloc(token.len);
        const len = await this.readBuffer(buffer, {position});
        if (len < token.len)
          throw new peek_readable_1.EndOfStreamError();
        return token.get(buffer, 0);
      }
      async peekToken(token, position = this.position) {
        const buffer = Buffer.alloc(token.len);
        const len = await this.peekBuffer(buffer, {position});
        if (len < token.len)
          throw new peek_readable_1.EndOfStreamError();
        return token.get(buffer, 0);
      }
      async readNumber(token) {
        const len = await this.readBuffer(this.numBuffer, {length: token.len});
        if (len < token.len)
          throw new peek_readable_1.EndOfStreamError();
        return token.get(this.numBuffer, 0);
      }
      async peekNumber(token) {
        const len = await this.peekBuffer(this.numBuffer, {length: token.len});
        if (len < token.len)
          throw new peek_readable_1.EndOfStreamError();
        return token.get(this.numBuffer, 0);
      }
      async close() {
      }
    };
    exports2.AbstractTokenizer = AbstractTokenizer;
  }
});

// node_modules/strtok3/lib/ReadStreamTokenizer.js
var require_ReadStreamTokenizer = __commonJS({
  "node_modules/strtok3/lib/ReadStreamTokenizer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ReadStreamTokenizer = void 0;
    var AbstractTokenizer_1 = require_AbstractTokenizer();
    var peek_readable_1 = require_lib();
    var maxBufferSize = 256e3;
    var ReadStreamTokenizer = class extends AbstractTokenizer_1.AbstractTokenizer {
      constructor(stream2, fileInfo) {
        super(fileInfo);
        this.streamReader = new peek_readable_1.StreamReader(stream2);
      }
      async getFileInfo() {
        return this.fileInfo;
      }
      async readBuffer(buffer, options) {
        let offset = 0;
        let length = buffer.length;
        if (options) {
          if (Number.isInteger(options.length)) {
            length = options.length;
          } else {
            length -= options.offset || 0;
          }
          if (options.position) {
            const skipBytes = options.position - this.position;
            if (skipBytes > 0) {
              await this.ignore(skipBytes);
              return this.readBuffer(buffer, options);
            } else if (skipBytes < 0) {
              throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
            }
          }
          if (options.offset) {
            offset = options.offset;
          }
        }
        if (length === 0) {
          return 0;
        }
        const bytesRead = await this.streamReader.read(buffer, offset, length);
        this.position += bytesRead;
        if ((!options || !options.mayBeLess) && bytesRead < length) {
          throw new peek_readable_1.EndOfStreamError();
        }
        return bytesRead;
      }
      async peekBuffer(buffer, options) {
        let offset = 0;
        let bytesRead;
        let length = buffer.length;
        if (options) {
          if (options.offset) {
            offset = options.offset;
          }
          if (Number.isInteger(options.length)) {
            length = options.length;
          } else {
            length -= options.offset || 0;
          }
          if (options.position) {
            const skipBytes = options.position - this.position;
            if (skipBytes > 0) {
              const skipBuffer = Buffer.alloc(length + skipBytes);
              bytesRead = await this.peekBuffer(skipBuffer, {mayBeLess: options.mayBeLess});
              skipBuffer.copy(buffer, offset, skipBytes);
              return bytesRead - skipBytes;
            } else if (skipBytes < 0) {
              throw new Error("Cannot peek from a negative offset in a stream");
            }
          }
        }
        try {
          bytesRead = await this.streamReader.peek(buffer, offset, length);
        } catch (err) {
          if (options && options.mayBeLess && err instanceof peek_readable_1.EndOfStreamError) {
            return 0;
          }
          throw err;
        }
        if ((!options || !options.mayBeLess) && bytesRead < length) {
          throw new peek_readable_1.EndOfStreamError();
        }
        return bytesRead;
      }
      async ignore(length) {
        const bufSize = Math.min(maxBufferSize, length);
        const buf = Buffer.alloc(bufSize);
        let totBytesRead = 0;
        while (totBytesRead < length) {
          const remaining = length - totBytesRead;
          const bytesRead = await this.readBuffer(buf, {length: Math.min(bufSize, remaining)});
          if (bytesRead < 0) {
            return bytesRead;
          }
          totBytesRead += bytesRead;
        }
        return totBytesRead;
      }
    };
    exports2.ReadStreamTokenizer = ReadStreamTokenizer;
  }
});

// node_modules/strtok3/lib/BufferTokenizer.js
var require_BufferTokenizer = __commonJS({
  "node_modules/strtok3/lib/BufferTokenizer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.BufferTokenizer = void 0;
    var peek_readable_1 = require_lib();
    var BufferTokenizer = class {
      constructor(buffer, fileInfo) {
        this.buffer = buffer;
        this.position = 0;
        this.fileInfo = fileInfo ? fileInfo : {};
        this.fileInfo.size = this.fileInfo.size ? this.fileInfo.size : buffer.length;
      }
      async readBuffer(buffer, options) {
        if (options && options.position) {
          if (options.position < this.position) {
            throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
          }
          this.position = options.position;
        }
        return this.peekBuffer(buffer, options).then((bytesRead) => {
          this.position += bytesRead;
          return bytesRead;
        });
      }
      async peekBuffer(buffer, options) {
        let offset = 0;
        let length = buffer.length;
        let position = this.position;
        if (options) {
          if (options.position) {
            if (options.position < this.position) {
              throw new Error("`options.position` can be less than `tokenizer.position`");
            }
            position = options.position;
          }
          if (Number.isInteger(options.length)) {
            length = options.length;
          } else {
            length -= options.offset || 0;
          }
          if (options.offset) {
            offset = options.offset;
          }
        }
        if (length === 0) {
          return Promise.resolve(0);
        }
        position = position || this.position;
        if (!length) {
          length = buffer.length;
        }
        const bytes2read = Math.min(this.buffer.length - position, length);
        if ((!options || !options.mayBeLess) && bytes2read < length) {
          throw new peek_readable_1.EndOfStreamError();
        } else {
          this.buffer.copy(buffer, offset, position, position + bytes2read);
          return bytes2read;
        }
      }
      async readToken(token, position) {
        this.position = position || this.position;
        try {
          const tv = this.peekToken(token, this.position);
          this.position += token.len;
          return tv;
        } catch (err) {
          this.position += this.buffer.length - position;
          throw err;
        }
      }
      async peekToken(token, position = this.position) {
        if (this.buffer.length - position < token.len) {
          throw new peek_readable_1.EndOfStreamError();
        }
        return token.get(this.buffer, position);
      }
      async readNumber(token) {
        return this.readToken(token);
      }
      async peekNumber(token) {
        return this.peekToken(token);
      }
      async ignore(length) {
        const bytesIgnored = Math.min(this.buffer.length - this.position, length);
        this.position += bytesIgnored;
        return bytesIgnored;
      }
      async close() {
      }
    };
    exports2.BufferTokenizer = BufferTokenizer;
  }
});

// node_modules/strtok3/lib/core.js
var require_core = __commonJS({
  "node_modules/strtok3/lib/core.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.fromBuffer = exports2.fromStream = exports2.EndOfStreamError = void 0;
    var ReadStreamTokenizer_1 = require_ReadStreamTokenizer();
    var BufferTokenizer_1 = require_BufferTokenizer();
    var peek_readable_1 = require_lib();
    Object.defineProperty(exports2, "EndOfStreamError", {enumerable: true, get: function() {
      return peek_readable_1.EndOfStreamError;
    }});
    function fromStream2(stream2, fileInfo) {
      fileInfo = fileInfo ? fileInfo : {};
      return new ReadStreamTokenizer_1.ReadStreamTokenizer(stream2, fileInfo);
    }
    exports2.fromStream = fromStream2;
    function fromBuffer2(buffer, fileInfo) {
      return new BufferTokenizer_1.BufferTokenizer(buffer, fileInfo);
    }
    exports2.fromBuffer = fromBuffer2;
  }
});

// node_modules/strtok3/lib/FileTokenizer.js
var require_FileTokenizer = __commonJS({
  "node_modules/strtok3/lib/FileTokenizer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.fromFile = exports2.FileTokenizer = void 0;
    var AbstractTokenizer_1 = require_AbstractTokenizer();
    var peek_readable_1 = require_lib();
    var fs2 = require_FsPromise();
    var FileTokenizer = class extends AbstractTokenizer_1.AbstractTokenizer {
      constructor(fd, fileInfo) {
        super(fileInfo);
        this.fd = fd;
      }
      async readBuffer(buffer, options) {
        let offset = 0;
        let length = buffer.length;
        if (options) {
          if (options.position) {
            if (options.position < this.position) {
              throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
            }
            this.position = options.position;
          }
          if (Number.isInteger(options.length)) {
            length = options.length;
          } else {
            length -= options.offset || 0;
          }
          if (options.offset) {
            offset = options.offset;
          }
        }
        if (length === 0) {
          return Promise.resolve(0);
        }
        const res = await fs2.read(this.fd, buffer, offset, length, this.position);
        this.position += res.bytesRead;
        if (res.bytesRead < length && (!options || !options.mayBeLess)) {
          throw new peek_readable_1.EndOfStreamError();
        }
        return res.bytesRead;
      }
      async peekBuffer(buffer, options) {
        let offset = 0;
        let length = buffer.length;
        let position = this.position;
        if (options) {
          if (options.position) {
            if (options.position < this.position) {
              throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
            }
            position = options.position;
          }
          if (Number.isInteger(options.length)) {
            length = options.length;
          } else {
            length -= options.offset || 0;
          }
          if (options.offset) {
            offset = options.offset;
          }
        }
        if (length === 0) {
          return Promise.resolve(0);
        }
        const res = await fs2.read(this.fd, buffer, offset, length, position);
        if ((!options || !options.mayBeLess) && res.bytesRead < length) {
          throw new peek_readable_1.EndOfStreamError();
        }
        return res.bytesRead;
      }
      async ignore(length) {
        const bytesLeft = this.fileInfo.size - this.position;
        if (length <= bytesLeft) {
          this.position += length;
          return length;
        } else {
          this.position += bytesLeft;
          return bytesLeft;
        }
      }
      async close() {
        return fs2.close(this.fd);
      }
    };
    exports2.FileTokenizer = FileTokenizer;
    async function fromFile(sourceFilePath) {
      const stat = await fs2.stat(sourceFilePath);
      if (!stat.isFile) {
        throw new Error(`File not a file: ${sourceFilePath}`);
      }
      const fd = await fs2.open(sourceFilePath, "r");
      return new FileTokenizer(fd, {path: sourceFilePath, size: stat.size});
    }
    exports2.fromFile = fromFile;
  }
});

// node_modules/strtok3/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/strtok3/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.fromStream = exports2.fromBuffer = exports2.EndOfStreamError = exports2.fromFile = void 0;
    var fs2 = require_FsPromise();
    var core = require_core();
    var FileTokenizer_1 = require_FileTokenizer();
    Object.defineProperty(exports2, "fromFile", {enumerable: true, get: function() {
      return FileTokenizer_1.fromFile;
    }});
    var core_1 = require_core();
    Object.defineProperty(exports2, "EndOfStreamError", {enumerable: true, get: function() {
      return core_1.EndOfStreamError;
    }});
    Object.defineProperty(exports2, "fromBuffer", {enumerable: true, get: function() {
      return core_1.fromBuffer;
    }});
    async function fromStream2(stream2, fileInfo) {
      fileInfo = fileInfo ? fileInfo : {};
      if (stream2.path) {
        const stat = await fs2.stat(stream2.path);
        fileInfo.path = stream2.path;
        fileInfo.size = stat.size;
      }
      return core.fromStream(stream2, fileInfo);
    }
    exports2.fromStream = fromStream2;
  }
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/ieee754/index.js"(exports2) {
    exports2.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports2.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// node_modules/token-types/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/token-types/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.writeIntBE = exports2.readIntBE = exports2.writeUIntBE = exports2.readUIntBE = exports2.writeIntLE = exports2.AnsiStringType = exports2.StringType = exports2.BufferType = exports2.IgnoreType = exports2.Float80_LE = exports2.Float80_BE = exports2.Float64_LE = exports2.Float64_BE = exports2.Float32_LE = exports2.Float32_BE = exports2.Float16_LE = exports2.Float16_BE = exports2.INT64_BE = exports2.UINT64_BE = exports2.INT64_LE = exports2.UINT64_LE = exports2.INT32_LE = exports2.INT32_BE = exports2.INT24_BE = exports2.INT24_LE = exports2.INT16_LE = exports2.INT16_BE = exports2.INT8 = exports2.UINT32_BE = exports2.UINT32_LE = exports2.UINT24_BE = exports2.UINT24_LE = exports2.UINT16_BE = exports2.UINT16_LE = exports2.UINT8 = void 0;
    var ieee754 = require_ieee754();
    exports2.UINT8 = {
      len: 1,
      get(buf, off) {
        return buf.readUInt8(off);
      },
      put(buf, off, v) {
        return buf.writeUInt8(v, off);
      }
    };
    exports2.UINT16_LE = {
      len: 2,
      get(buf, off) {
        return buf.readUInt16LE(off);
      },
      put(buf, off, v) {
        return buf.writeUInt16LE(v, off);
      }
    };
    exports2.UINT16_BE = {
      len: 2,
      get(buf, off) {
        return buf.readUInt16BE(off);
      },
      put(buf, off, v) {
        return buf.writeUInt16BE(v, off);
      }
    };
    exports2.UINT24_LE = {
      len: 3,
      get(buf, off) {
        return buf.readUIntLE(off, 3);
      },
      put(buf, off, v) {
        return buf.writeUIntLE(v, off, 3);
      }
    };
    exports2.UINT24_BE = {
      len: 3,
      get(buf, off) {
        return buf.readUIntBE(off, 3);
      },
      put(buf, off, v) {
        return buf.writeUIntBE(v, off, 3);
      }
    };
    exports2.UINT32_LE = {
      len: 4,
      get(buf, off) {
        return buf.readUInt32LE(off);
      },
      put(b, o, v) {
        return b.writeUInt32LE(v, o);
      }
    };
    exports2.UINT32_BE = {
      len: 4,
      get(buf, off) {
        return buf.readUInt32BE(off);
      },
      put(buf, off, v) {
        return buf.writeUInt32BE(v, off);
      }
    };
    exports2.INT8 = {
      len: 1,
      get(buf, off) {
        return buf.readInt8(off);
      },
      put(buf, off, v) {
        return buf.writeInt8(v, off);
      }
    };
    exports2.INT16_BE = {
      len: 2,
      get(buf, off) {
        return buf.readInt16BE(off);
      },
      put(b, o, v) {
        return b.writeInt16BE(v, o);
      }
    };
    exports2.INT16_LE = {
      len: 2,
      get(buf, off) {
        return buf.readInt16LE(off);
      },
      put(b, o, v) {
        return b.writeInt16LE(v, o);
      }
    };
    exports2.INT24_LE = {
      len: 3,
      get(buf, off) {
        return buf.readIntLE(off, 3);
      },
      put(b, o, v) {
        return b.writeIntLE(v, o, 3);
      }
    };
    exports2.INT24_BE = {
      len: 3,
      get(buf, off) {
        return buf.readIntBE(off, 3);
      },
      put(b, o, v) {
        return b.writeIntBE(v, o, 3);
      }
    };
    exports2.INT32_BE = {
      len: 4,
      get(buf, off) {
        return buf.readInt32BE(off);
      },
      put(b, o, v) {
        return b.writeInt32BE(v, o);
      }
    };
    exports2.INT32_LE = {
      len: 4,
      get(buf, off) {
        return buf.readInt32LE(off);
      },
      put(b, o, v) {
        return b.writeInt32LE(v, o);
      }
    };
    exports2.UINT64_LE = {
      len: 8,
      get(buf, off) {
        return readUIntLE(buf, off, this.len);
      },
      put(b, o, v) {
        return writeUIntLE(b, v, o, this.len);
      }
    };
    exports2.INT64_LE = {
      len: 8,
      get(buf, off) {
        return readIntLE(buf, off, this.len);
      },
      put(b, off, v) {
        return writeIntLE(b, v, off, this.len);
      }
    };
    exports2.UINT64_BE = {
      len: 8,
      get(b, off) {
        return readUIntBE(b, off, this.len);
      },
      put(b, o, v) {
        return writeUIntBE(b, v, o, this.len);
      }
    };
    exports2.INT64_BE = {
      len: 8,
      get(b, off) {
        return readIntBE(b, off, this.len);
      },
      put(b, off, v) {
        return writeIntBE(b, v, off, this.len);
      }
    };
    exports2.Float16_BE = {
      len: 2,
      get(b, off) {
        return ieee754.read(b, off, false, 10, this.len);
      },
      put(b, off, v) {
        ieee754.write(b, v, off, false, 10, this.len);
        return off + this.len;
      }
    };
    exports2.Float16_LE = {
      len: 2,
      get(b, off) {
        return ieee754.read(b, off, true, 10, this.len);
      },
      put(b, off, v) {
        ieee754.write(b, v, off, true, 10, this.len);
        return off + this.len;
      }
    };
    exports2.Float32_BE = {
      len: 4,
      get(b, off) {
        return b.readFloatBE(off);
      },
      put(b, off, v) {
        return b.writeFloatBE(v, off);
      }
    };
    exports2.Float32_LE = {
      len: 4,
      get(b, off) {
        return b.readFloatLE(off);
      },
      put(b, off, v) {
        return b.writeFloatLE(v, off);
      }
    };
    exports2.Float64_BE = {
      len: 8,
      get(b, off) {
        return b.readDoubleBE(off);
      },
      put(b, off, v) {
        return b.writeDoubleBE(v, off);
      }
    };
    exports2.Float64_LE = {
      len: 8,
      get(b, off) {
        return b.readDoubleLE(off);
      },
      put(b, off, v) {
        return b.writeDoubleLE(v, off);
      }
    };
    exports2.Float80_BE = {
      len: 10,
      get(b, off) {
        return ieee754.read(b, off, false, 63, this.len);
      },
      put(b, off, v) {
        ieee754.write(b, v, off, false, 63, this.len);
        return off + this.len;
      }
    };
    exports2.Float80_LE = {
      len: 10,
      get(b, off) {
        return ieee754.read(b, off, true, 63, this.len);
      },
      put(b, off, v) {
        ieee754.write(b, v, off, true, 63, this.len);
        return off + this.len;
      }
    };
    var IgnoreType = class {
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
      }
    };
    exports2.IgnoreType = IgnoreType;
    var BufferType = class {
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        return buf.slice(off, off + this.len);
      }
    };
    exports2.BufferType = BufferType;
    var StringType = class {
      constructor(len, encoding) {
        this.len = len;
        this.encoding = encoding;
      }
      get(buf, off) {
        return buf.toString(this.encoding, off, off + this.len);
      }
    };
    exports2.StringType = StringType;
    var AnsiStringType = class {
      constructor(len) {
        this.len = len;
      }
      static decode(buffer, off, until) {
        let str = "";
        for (let i = off; i < until; ++i) {
          str += AnsiStringType.codePointToString(AnsiStringType.singleByteDecoder(buffer[i]));
        }
        return str;
      }
      static inRange(a, min, max) {
        return min <= a && a <= max;
      }
      static codePointToString(cp) {
        if (cp <= 65535) {
          return String.fromCharCode(cp);
        } else {
          cp -= 65536;
          return String.fromCharCode((cp >> 10) + 55296, (cp & 1023) + 56320);
        }
      }
      static singleByteDecoder(bite) {
        if (AnsiStringType.inRange(bite, 0, 127)) {
          return bite;
        }
        const codePoint = AnsiStringType.windows1252[bite - 128];
        if (codePoint === null) {
          throw Error("invaliding encoding");
        }
        return codePoint;
      }
      get(buf, off = 0) {
        return AnsiStringType.decode(buf, off, off + this.len);
      }
    };
    exports2.AnsiStringType = AnsiStringType;
    AnsiStringType.windows1252 = [
      8364,
      129,
      8218,
      402,
      8222,
      8230,
      8224,
      8225,
      710,
      8240,
      352,
      8249,
      338,
      141,
      381,
      143,
      144,
      8216,
      8217,
      8220,
      8221,
      8226,
      8211,
      8212,
      732,
      8482,
      353,
      8250,
      339,
      157,
      382,
      376,
      160,
      161,
      162,
      163,
      164,
      165,
      166,
      167,
      168,
      169,
      170,
      171,
      172,
      173,
      174,
      175,
      176,
      177,
      178,
      179,
      180,
      181,
      182,
      183,
      184,
      185,
      186,
      187,
      188,
      189,
      190,
      191,
      192,
      193,
      194,
      195,
      196,
      197,
      198,
      199,
      200,
      201,
      202,
      203,
      204,
      205,
      206,
      207,
      208,
      209,
      210,
      211,
      212,
      213,
      214,
      215,
      216,
      217,
      218,
      219,
      220,
      221,
      222,
      223,
      224,
      225,
      226,
      227,
      228,
      229,
      230,
      231,
      232,
      233,
      234,
      235,
      236,
      237,
      238,
      239,
      240,
      241,
      242,
      243,
      244,
      245,
      246,
      247,
      248,
      249,
      250,
      251,
      252,
      253,
      254,
      255
    ];
    function readUIntLE(buf, offset, byteLength) {
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;
      let val = buf[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength && (mul *= 256)) {
        val += buf[offset + i] * mul;
      }
      return val;
    }
    function writeUIntLE(buf, value, offset, byteLength) {
      value = +value;
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;
      let mul = 1;
      let i = 0;
      buf[offset] = value & 255;
      while (++i < byteLength && (mul *= 256)) {
        buf[offset + i] = value / mul & 255;
      }
      return offset + byteLength;
    }
    function readIntLE(buf, offset, byteLength) {
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;
      let val = buf[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength && (mul *= 256)) {
        val += buf[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength);
      return val;
    }
    function writeIntLE(buf, value, offset, byteLength) {
      value = +value;
      offset = offset >>> 0;
      let i = 0;
      let mul = 1;
      let sub = 0;
      buf[offset] = value & 255;
      while (++i < byteLength && (mul *= 256)) {
        if (value < 0 && sub === 0 && buf[offset + i - 1] !== 0) {
          sub = 1;
        }
        buf[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength;
    }
    exports2.writeIntLE = writeIntLE;
    function readUIntBE(buf, offset, byteLength) {
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;
      let val = buf[offset + --byteLength];
      let mul = 1;
      while (byteLength > 0 && (mul *= 256)) {
        val += buf[offset + --byteLength] * mul;
      }
      return val;
    }
    exports2.readUIntBE = readUIntBE;
    function writeUIntBE(buf, value, offset, byteLength) {
      value = +value;
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;
      let i = byteLength - 1;
      let mul = 1;
      buf[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        buf[offset + i] = value / mul & 255;
      }
      return offset + byteLength;
    }
    exports2.writeUIntBE = writeUIntBE;
    function readIntBE(buf, offset, byteLength) {
      offset = offset >>> 0;
      byteLength = byteLength >>> 0;
      let i = byteLength;
      let mul = 1;
      let val = buf[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += buf[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength);
      return val;
    }
    exports2.readIntBE = readIntBE;
    function writeIntBE(buf, value, offset, byteLength) {
      value = +value;
      offset = offset >>> 0;
      let i = byteLength - 1;
      let mul = 1;
      let sub = 0;
      buf[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && buf[offset + i + 1] !== 0) {
          sub = 1;
        }
        buf[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength;
    }
    exports2.writeIntBE = writeIntBE;
  }
});

// node_modules/file-type/util.js
var require_util = __commonJS({
  "node_modules/file-type/util.js"(exports2) {
    "use strict";
    exports2.stringToBytes = (string) => [...string].map((character) => character.charCodeAt(0));
    exports2.tarHeaderChecksumMatches = (buffer, offset = 0) => {
      const readSum = parseInt(buffer.toString("utf8", 148, 154).replace(/\0.*$/, "").trim(), 8);
      if (isNaN(readSum)) {
        return false;
      }
      let sum = 8 * 32;
      for (let i = offset; i < offset + 148; i++) {
        sum += buffer[i];
      }
      for (let i = offset + 156; i < offset + 512; i++) {
        sum += buffer[i];
      }
      return readSum === sum;
    };
    exports2.uint32SyncSafeToken = {
      get: (buffer, offset) => {
        return buffer[offset + 3] & 127 | buffer[offset + 2] << 7 | buffer[offset + 1] << 14 | buffer[offset] << 21;
      },
      len: 4
    };
  }
});

// node_modules/file-type/supported.js
var require_supported = __commonJS({
  "node_modules/file-type/supported.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      extensions: [
        "jpg",
        "png",
        "apng",
        "gif",
        "webp",
        "flif",
        "xcf",
        "cr2",
        "cr3",
        "orf",
        "arw",
        "dng",
        "nef",
        "rw2",
        "raf",
        "tif",
        "bmp",
        "icns",
        "jxr",
        "psd",
        "indd",
        "zip",
        "tar",
        "rar",
        "gz",
        "bz2",
        "7z",
        "dmg",
        "mp4",
        "mid",
        "mkv",
        "webm",
        "mov",
        "avi",
        "mpg",
        "mp2",
        "mp3",
        "m4a",
        "oga",
        "ogg",
        "ogv",
        "opus",
        "flac",
        "wav",
        "spx",
        "amr",
        "pdf",
        "epub",
        "exe",
        "swf",
        "rtf",
        "wasm",
        "woff",
        "woff2",
        "eot",
        "ttf",
        "otf",
        "ico",
        "flv",
        "ps",
        "xz",
        "sqlite",
        "nes",
        "crx",
        "xpi",
        "cab",
        "deb",
        "ar",
        "rpm",
        "Z",
        "lz",
        "cfb",
        "mxf",
        "mts",
        "blend",
        "bpg",
        "docx",
        "pptx",
        "xlsx",
        "3gp",
        "3g2",
        "jp2",
        "jpm",
        "jpx",
        "mj2",
        "aif",
        "qcp",
        "odt",
        "ods",
        "odp",
        "xml",
        "mobi",
        "heic",
        "cur",
        "ktx",
        "ape",
        "wv",
        "dcm",
        "ics",
        "glb",
        "pcap",
        "dsf",
        "lnk",
        "alias",
        "voc",
        "ac3",
        "m4v",
        "m4p",
        "m4b",
        "f4v",
        "f4p",
        "f4b",
        "f4a",
        "mie",
        "asf",
        "ogm",
        "ogx",
        "mpc",
        "arrow",
        "shp",
        "aac",
        "mp1",
        "it",
        "s3m",
        "xm",
        "ai",
        "skp",
        "avif",
        "eps",
        "lzh",
        "pgp",
        "asar",
        "stl",
        "chm",
        "3mf",
        "zst",
        "vcf"
      ],
      mimeTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/flif",
        "image/x-xcf",
        "image/x-canon-cr2",
        "image/x-canon-cr3",
        "image/tiff",
        "image/bmp",
        "image/vnd.ms-photo",
        "image/vnd.adobe.photoshop",
        "application/x-indesign",
        "application/epub+zip",
        "application/x-xpinstall",
        "application/vnd.oasis.opendocument.text",
        "application/vnd.oasis.opendocument.spreadsheet",
        "application/vnd.oasis.opendocument.presentation",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/zip",
        "application/x-tar",
        "application/x-rar-compressed",
        "application/gzip",
        "application/x-bzip2",
        "application/x-7z-compressed",
        "application/x-apple-diskimage",
        "application/x-apache-arrow",
        "video/mp4",
        "audio/midi",
        "video/x-matroska",
        "video/webm",
        "video/quicktime",
        "video/vnd.avi",
        "audio/vnd.wave",
        "audio/qcelp",
        "audio/x-ms-asf",
        "video/x-ms-asf",
        "application/vnd.ms-asf",
        "video/mpeg",
        "video/3gpp",
        "audio/mpeg",
        "audio/mp4",
        "audio/opus",
        "video/ogg",
        "audio/ogg",
        "application/ogg",
        "audio/x-flac",
        "audio/ape",
        "audio/wavpack",
        "audio/amr",
        "application/pdf",
        "application/x-msdownload",
        "application/x-shockwave-flash",
        "application/rtf",
        "application/wasm",
        "font/woff",
        "font/woff2",
        "application/vnd.ms-fontobject",
        "font/ttf",
        "font/otf",
        "image/x-icon",
        "video/x-flv",
        "application/postscript",
        "application/eps",
        "application/x-xz",
        "application/x-sqlite3",
        "application/x-nintendo-nes-rom",
        "application/x-google-chrome-extension",
        "application/vnd.ms-cab-compressed",
        "application/x-deb",
        "application/x-unix-archive",
        "application/x-rpm",
        "application/x-compress",
        "application/x-lzip",
        "application/x-cfb",
        "application/x-mie",
        "application/mxf",
        "video/mp2t",
        "application/x-blender",
        "image/bpg",
        "image/jp2",
        "image/jpx",
        "image/jpm",
        "image/mj2",
        "audio/aiff",
        "application/xml",
        "application/x-mobipocket-ebook",
        "image/heif",
        "image/heif-sequence",
        "image/heic",
        "image/heic-sequence",
        "image/icns",
        "image/ktx",
        "application/dicom",
        "audio/x-musepack",
        "text/calendar",
        "text/vcard",
        "model/gltf-binary",
        "application/vnd.tcpdump.pcap",
        "audio/x-dsf",
        "application/x.ms.shortcut",
        "application/x.apple.alias",
        "audio/x-voc",
        "audio/vnd.dolby.dd-raw",
        "audio/x-m4a",
        "image/apng",
        "image/x-olympus-orf",
        "image/x-sony-arw",
        "image/x-adobe-dng",
        "image/x-nikon-nef",
        "image/x-panasonic-rw2",
        "image/x-fujifilm-raf",
        "video/x-m4v",
        "video/3gpp2",
        "application/x-esri-shape",
        "audio/aac",
        "audio/x-it",
        "audio/x-s3m",
        "audio/x-xm",
        "video/MP1S",
        "video/MP2P",
        "application/vnd.sketchup.skp",
        "image/avif",
        "application/x-lzh-compressed",
        "application/pgp-encrypted",
        "application/x-asar",
        "model/stl",
        "application/vnd.ms-htmlhelp",
        "model/3mf",
        "application/zstd"
      ]
    };
  }
});

// node_modules/file-type/core.js
var require_core2 = __commonJS({
  "node_modules/file-type/core.js"(exports, module) {
    "use strict";
    var Token = require_lib3();
    var strtok3 = require_core();
    var {
      stringToBytes,
      tarHeaderChecksumMatches,
      uint32SyncSafeToken
    } = require_util();
    var supported = require_supported();
    var minimumBytes = 4100;
    async function fromStream(stream2) {
      const tokenizer = await strtok3.fromStream(stream2);
      try {
        return await fromTokenizer(tokenizer);
      } finally {
        await tokenizer.close();
      }
    }
    async function fromBuffer(input) {
      if (!(input instanceof Uint8Array || input instanceof ArrayBuffer || Buffer.isBuffer(input))) {
        throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`Buffer\` or \`ArrayBuffer\`, got \`${typeof input}\``);
      }
      const buffer = input instanceof Buffer ? input : Buffer.from(input);
      if (!(buffer && buffer.length > 1)) {
        return;
      }
      const tokenizer = strtok3.fromBuffer(buffer);
      return fromTokenizer(tokenizer);
    }
    function _check(buffer, headers, options) {
      options = {
        offset: 0,
        ...options
      };
      for (const [index, header] of headers.entries()) {
        if (options.mask) {
          if (header !== (options.mask[index] & buffer[index + options.offset])) {
            return false;
          }
        } else if (header !== buffer[index + options.offset]) {
          return false;
        }
      }
      return true;
    }
    async function fromTokenizer(tokenizer) {
      try {
        return _fromTokenizer(tokenizer);
      } catch (error) {
        if (!(error instanceof strtok3.EndOfStreamError)) {
          throw error;
        }
      }
    }
    async function _fromTokenizer(tokenizer) {
      let buffer = Buffer.alloc(minimumBytes);
      const bytesRead = 12;
      const check = (header, options) => _check(buffer, header, options);
      const checkString = (header, options) => check(stringToBytes(header), options);
      if (!tokenizer.fileInfo.size) {
        tokenizer.fileInfo.size = Number.MAX_SAFE_INTEGER;
      }
      await tokenizer.peekBuffer(buffer, {length: bytesRead, mayBeLess: true});
      if (check([66, 77])) {
        return {
          ext: "bmp",
          mime: "image/bmp"
        };
      }
      if (check([11, 119])) {
        return {
          ext: "ac3",
          mime: "audio/vnd.dolby.dd-raw"
        };
      }
      if (check([120, 1])) {
        return {
          ext: "dmg",
          mime: "application/x-apple-diskimage"
        };
      }
      if (check([77, 90])) {
        return {
          ext: "exe",
          mime: "application/x-msdownload"
        };
      }
      if (check([37, 33])) {
        await tokenizer.peekBuffer(buffer, {length: 24, mayBeLess: true});
        if (checkString("PS-Adobe-", {offset: 2}) && checkString(" EPSF-", {offset: 14})) {
          return {
            ext: "eps",
            mime: "application/eps"
          };
        }
        return {
          ext: "ps",
          mime: "application/postscript"
        };
      }
      if (check([31, 160]) || check([31, 157])) {
        return {
          ext: "Z",
          mime: "application/x-compress"
        };
      }
      if (check([255, 216, 255])) {
        return {
          ext: "jpg",
          mime: "image/jpeg"
        };
      }
      if (check([73, 73, 188])) {
        return {
          ext: "jxr",
          mime: "image/vnd.ms-photo"
        };
      }
      if (check([31, 139, 8])) {
        return {
          ext: "gz",
          mime: "application/gzip"
        };
      }
      if (check([66, 90, 104])) {
        return {
          ext: "bz2",
          mime: "application/x-bzip2"
        };
      }
      if (checkString("ID3")) {
        await tokenizer.ignore(6);
        const id3HeaderLen = await tokenizer.readToken(uint32SyncSafeToken);
        if (tokenizer.position + id3HeaderLen > tokenizer.fileInfo.size) {
          return {
            ext: "mp3",
            mime: "audio/mpeg"
          };
        }
        await tokenizer.ignore(id3HeaderLen);
        return fromTokenizer(tokenizer);
      }
      if (checkString("MP+")) {
        return {
          ext: "mpc",
          mime: "audio/x-musepack"
        };
      }
      if ((buffer[0] === 67 || buffer[0] === 70) && check([87, 83], {offset: 1})) {
        return {
          ext: "swf",
          mime: "application/x-shockwave-flash"
        };
      }
      if (check([71, 73, 70])) {
        return {
          ext: "gif",
          mime: "image/gif"
        };
      }
      if (checkString("FLIF")) {
        return {
          ext: "flif",
          mime: "image/flif"
        };
      }
      if (checkString("8BPS")) {
        return {
          ext: "psd",
          mime: "image/vnd.adobe.photoshop"
        };
      }
      if (checkString("WEBP", {offset: 8})) {
        return {
          ext: "webp",
          mime: "image/webp"
        };
      }
      if (checkString("MPCK")) {
        return {
          ext: "mpc",
          mime: "audio/x-musepack"
        };
      }
      if (checkString("FORM")) {
        return {
          ext: "aif",
          mime: "audio/aiff"
        };
      }
      if (checkString("icns", {offset: 0})) {
        return {
          ext: "icns",
          mime: "image/icns"
        };
      }
      if (check([80, 75, 3, 4])) {
        try {
          while (tokenizer.position + 30 < tokenizer.fileInfo.size) {
            await tokenizer.readBuffer(buffer, {length: 30});
            const zipHeader = {
              compressedSize: buffer.readUInt32LE(18),
              uncompressedSize: buffer.readUInt32LE(22),
              filenameLength: buffer.readUInt16LE(26),
              extraFieldLength: buffer.readUInt16LE(28)
            };
            zipHeader.filename = await tokenizer.readToken(new Token.StringType(zipHeader.filenameLength, "utf-8"));
            await tokenizer.ignore(zipHeader.extraFieldLength);
            if (zipHeader.filename === "META-INF/mozilla.rsa") {
              return {
                ext: "xpi",
                mime: "application/x-xpinstall"
              };
            }
            if (zipHeader.filename.endsWith(".rels") || zipHeader.filename.endsWith(".xml")) {
              const type = zipHeader.filename.split("/")[0];
              switch (type) {
                case "_rels":
                  break;
                case "word":
                  return {
                    ext: "docx",
                    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  };
                case "ppt":
                  return {
                    ext: "pptx",
                    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  };
                case "xl":
                  return {
                    ext: "xlsx",
                    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  };
                default:
                  break;
              }
            }
            if (zipHeader.filename.startsWith("xl/")) {
              return {
                ext: "xlsx",
                mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              };
            }
            if (zipHeader.filename.startsWith("3D/") && zipHeader.filename.endsWith(".model")) {
              return {
                ext: "3mf",
                mime: "model/3mf"
              };
            }
            if (zipHeader.filename === "mimetype" && zipHeader.compressedSize === zipHeader.uncompressedSize) {
              const mimeType = await tokenizer.readToken(new Token.StringType(zipHeader.compressedSize, "utf-8"));
              switch (mimeType) {
                case "application/epub+zip":
                  return {
                    ext: "epub",
                    mime: "application/epub+zip"
                  };
                case "application/vnd.oasis.opendocument.text":
                  return {
                    ext: "odt",
                    mime: "application/vnd.oasis.opendocument.text"
                  };
                case "application/vnd.oasis.opendocument.spreadsheet":
                  return {
                    ext: "ods",
                    mime: "application/vnd.oasis.opendocument.spreadsheet"
                  };
                case "application/vnd.oasis.opendocument.presentation":
                  return {
                    ext: "odp",
                    mime: "application/vnd.oasis.opendocument.presentation"
                  };
                default:
              }
            }
            if (zipHeader.compressedSize === 0) {
              let nextHeaderIndex = -1;
              while (nextHeaderIndex < 0 && tokenizer.position < tokenizer.fileInfo.size) {
                await tokenizer.peekBuffer(buffer, {mayBeLess: true});
                nextHeaderIndex = buffer.indexOf("504B0304", 0, "hex");
                await tokenizer.ignore(nextHeaderIndex >= 0 ? nextHeaderIndex : buffer.length);
              }
            } else {
              await tokenizer.ignore(zipHeader.compressedSize);
            }
          }
        } catch (error) {
          if (!(error instanceof strtok3.EndOfStreamError)) {
            throw error;
          }
        }
        return {
          ext: "zip",
          mime: "application/zip"
        };
      }
      if (checkString("OggS")) {
        await tokenizer.ignore(28);
        const type = Buffer.alloc(8);
        await tokenizer.readBuffer(type);
        if (_check(type, [79, 112, 117, 115, 72, 101, 97, 100])) {
          return {
            ext: "opus",
            mime: "audio/opus"
          };
        }
        if (_check(type, [128, 116, 104, 101, 111, 114, 97])) {
          return {
            ext: "ogv",
            mime: "video/ogg"
          };
        }
        if (_check(type, [1, 118, 105, 100, 101, 111, 0])) {
          return {
            ext: "ogm",
            mime: "video/ogg"
          };
        }
        if (_check(type, [127, 70, 76, 65, 67])) {
          return {
            ext: "oga",
            mime: "audio/ogg"
          };
        }
        if (_check(type, [83, 112, 101, 101, 120, 32, 32])) {
          return {
            ext: "spx",
            mime: "audio/ogg"
          };
        }
        if (_check(type, [1, 118, 111, 114, 98, 105, 115])) {
          return {
            ext: "ogg",
            mime: "audio/ogg"
          };
        }
        return {
          ext: "ogx",
          mime: "application/ogg"
        };
      }
      if (check([80, 75]) && (buffer[2] === 3 || buffer[2] === 5 || buffer[2] === 7) && (buffer[3] === 4 || buffer[3] === 6 || buffer[3] === 8)) {
        return {
          ext: "zip",
          mime: "application/zip"
        };
      }
      if (checkString("ftyp", {offset: 4}) && (buffer[8] & 96) !== 0) {
        const brandMajor = buffer.toString("binary", 8, 12).replace("\0", " ").trim();
        switch (brandMajor) {
          case "avif":
            return {ext: "avif", mime: "image/avif"};
          case "mif1":
            return {ext: "heic", mime: "image/heif"};
          case "msf1":
            return {ext: "heic", mime: "image/heif-sequence"};
          case "heic":
          case "heix":
            return {ext: "heic", mime: "image/heic"};
          case "hevc":
          case "hevx":
            return {ext: "heic", mime: "image/heic-sequence"};
          case "qt":
            return {ext: "mov", mime: "video/quicktime"};
          case "M4V":
          case "M4VH":
          case "M4VP":
            return {ext: "m4v", mime: "video/x-m4v"};
          case "M4P":
            return {ext: "m4p", mime: "video/mp4"};
          case "M4B":
            return {ext: "m4b", mime: "audio/mp4"};
          case "M4A":
            return {ext: "m4a", mime: "audio/x-m4a"};
          case "F4V":
            return {ext: "f4v", mime: "video/mp4"};
          case "F4P":
            return {ext: "f4p", mime: "video/mp4"};
          case "F4A":
            return {ext: "f4a", mime: "audio/mp4"};
          case "F4B":
            return {ext: "f4b", mime: "audio/mp4"};
          case "crx":
            return {ext: "cr3", mime: "image/x-canon-cr3"};
          default:
            if (brandMajor.startsWith("3g")) {
              if (brandMajor.startsWith("3g2")) {
                return {ext: "3g2", mime: "video/3gpp2"};
              }
              return {ext: "3gp", mime: "video/3gpp"};
            }
            return {ext: "mp4", mime: "video/mp4"};
        }
      }
      if (checkString("MThd")) {
        return {
          ext: "mid",
          mime: "audio/midi"
        };
      }
      if (checkString("wOFF") && (check([0, 1, 0, 0], {offset: 4}) || checkString("OTTO", {offset: 4}))) {
        return {
          ext: "woff",
          mime: "font/woff"
        };
      }
      if (checkString("wOF2") && (check([0, 1, 0, 0], {offset: 4}) || checkString("OTTO", {offset: 4}))) {
        return {
          ext: "woff2",
          mime: "font/woff2"
        };
      }
      if (check([212, 195, 178, 161]) || check([161, 178, 195, 212])) {
        return {
          ext: "pcap",
          mime: "application/vnd.tcpdump.pcap"
        };
      }
      if (checkString("DSD ")) {
        return {
          ext: "dsf",
          mime: "audio/x-dsf"
        };
      }
      if (checkString("LZIP")) {
        return {
          ext: "lz",
          mime: "application/x-lzip"
        };
      }
      if (checkString("fLaC")) {
        return {
          ext: "flac",
          mime: "audio/x-flac"
        };
      }
      if (check([66, 80, 71, 251])) {
        return {
          ext: "bpg",
          mime: "image/bpg"
        };
      }
      if (checkString("wvpk")) {
        return {
          ext: "wv",
          mime: "audio/wavpack"
        };
      }
      if (checkString("%PDF")) {
        await tokenizer.ignore(1350);
        const maxBufferSize = 10 * 1024 * 1024;
        const buffer2 = Buffer.alloc(Math.min(maxBufferSize, tokenizer.fileInfo.size));
        await tokenizer.readBuffer(buffer2, {mayBeLess: true});
        if (buffer2.includes(Buffer.from("AIPrivateData"))) {
          return {
            ext: "ai",
            mime: "application/postscript"
          };
        }
        return {
          ext: "pdf",
          mime: "application/pdf"
        };
      }
      if (check([0, 97, 115, 109])) {
        return {
          ext: "wasm",
          mime: "application/wasm"
        };
      }
      if (check([73, 73, 42, 0])) {
        if (checkString("CR", {offset: 8})) {
          return {
            ext: "cr2",
            mime: "image/x-canon-cr2"
          };
        }
        if (check([28, 0, 254, 0], {offset: 8}) || check([31, 0, 11, 0], {offset: 8})) {
          return {
            ext: "nef",
            mime: "image/x-nikon-nef"
          };
        }
        if (check([8, 0, 0, 0], {offset: 4}) && (check([45, 0, 254, 0], {offset: 8}) || check([39, 0, 254, 0], {offset: 8}))) {
          return {
            ext: "dng",
            mime: "image/x-adobe-dng"
          };
        }
        buffer = Buffer.alloc(24);
        await tokenizer.peekBuffer(buffer);
        if ((check([16, 251, 134, 1], {offset: 4}) || check([8, 0, 0, 0], {offset: 4})) && check([0, 254, 0, 4, 0, 1, 0, 0, 0, 1, 0, 0, 0, 3, 1], {offset: 9})) {
          return {
            ext: "arw",
            mime: "image/x-sony-arw"
          };
        }
        return {
          ext: "tif",
          mime: "image/tiff"
        };
      }
      if (check([77, 77, 0, 42])) {
        return {
          ext: "tif",
          mime: "image/tiff"
        };
      }
      if (checkString("MAC ")) {
        return {
          ext: "ape",
          mime: "audio/ape"
        };
      }
      if (check([26, 69, 223, 163])) {
        async function readField() {
          const msb = await tokenizer.peekNumber(Token.UINT8);
          let mask = 128;
          let ic = 0;
          while ((msb & mask) === 0) {
            ++ic;
            mask >>= 1;
          }
          const id = Buffer.alloc(ic + 1);
          await tokenizer.readBuffer(id);
          return id;
        }
        async function readElement() {
          const id = await readField();
          const lenField = await readField();
          lenField[0] ^= 128 >> lenField.length - 1;
          const nrLen = Math.min(6, lenField.length);
          return {
            id: id.readUIntBE(0, id.length),
            len: lenField.readUIntBE(lenField.length - nrLen, nrLen)
          };
        }
        async function readChildren(level, children) {
          while (children > 0) {
            const e = await readElement();
            if (e.id === 17026) {
              return tokenizer.readToken(new Token.StringType(e.len, "utf-8"));
            }
            await tokenizer.ignore(e.len);
            --children;
          }
        }
        const re = await readElement();
        const docType = await readChildren(1, re.len);
        switch (docType) {
          case "webm":
            return {
              ext: "webm",
              mime: "video/webm"
            };
          case "matroska":
            return {
              ext: "mkv",
              mime: "video/x-matroska"
            };
          default:
            return;
        }
      }
      if (check([82, 73, 70, 70])) {
        if (check([65, 86, 73], {offset: 8})) {
          return {
            ext: "avi",
            mime: "video/vnd.avi"
          };
        }
        if (check([87, 65, 86, 69], {offset: 8})) {
          return {
            ext: "wav",
            mime: "audio/vnd.wave"
          };
        }
        if (check([81, 76, 67, 77], {offset: 8})) {
          return {
            ext: "qcp",
            mime: "audio/qcelp"
          };
        }
      }
      if (checkString("SQLi")) {
        return {
          ext: "sqlite",
          mime: "application/x-sqlite3"
        };
      }
      if (check([78, 69, 83, 26])) {
        return {
          ext: "nes",
          mime: "application/x-nintendo-nes-rom"
        };
      }
      if (checkString("Cr24")) {
        return {
          ext: "crx",
          mime: "application/x-google-chrome-extension"
        };
      }
      if (checkString("MSCF") || checkString("ISc(")) {
        return {
          ext: "cab",
          mime: "application/vnd.ms-cab-compressed"
        };
      }
      if (check([237, 171, 238, 219])) {
        return {
          ext: "rpm",
          mime: "application/x-rpm"
        };
      }
      if (check([197, 208, 211, 198])) {
        return {
          ext: "eps",
          mime: "application/eps"
        };
      }
      if (check([40, 181, 47, 253])) {
        return {
          ext: "zst",
          mime: "application/zstd"
        };
      }
      if (check([79, 84, 84, 79, 0])) {
        return {
          ext: "otf",
          mime: "font/otf"
        };
      }
      if (checkString("#!AMR")) {
        return {
          ext: "amr",
          mime: "audio/amr"
        };
      }
      if (checkString("{\\rtf")) {
        return {
          ext: "rtf",
          mime: "application/rtf"
        };
      }
      if (check([70, 76, 86, 1])) {
        return {
          ext: "flv",
          mime: "video/x-flv"
        };
      }
      if (checkString("IMPM")) {
        return {
          ext: "it",
          mime: "audio/x-it"
        };
      }
      if (checkString("-lh0-", {offset: 2}) || checkString("-lh1-", {offset: 2}) || checkString("-lh2-", {offset: 2}) || checkString("-lh3-", {offset: 2}) || checkString("-lh4-", {offset: 2}) || checkString("-lh5-", {offset: 2}) || checkString("-lh6-", {offset: 2}) || checkString("-lh7-", {offset: 2}) || checkString("-lzs-", {offset: 2}) || checkString("-lz4-", {offset: 2}) || checkString("-lz5-", {offset: 2}) || checkString("-lhd-", {offset: 2})) {
        return {
          ext: "lzh",
          mime: "application/x-lzh-compressed"
        };
      }
      if (check([0, 0, 1, 186])) {
        if (check([33], {offset: 4, mask: [241]})) {
          return {
            ext: "mpg",
            mime: "video/MP1S"
          };
        }
        if (check([68], {offset: 4, mask: [196]})) {
          return {
            ext: "mpg",
            mime: "video/MP2P"
          };
        }
      }
      if (checkString("ITSF")) {
        return {
          ext: "chm",
          mime: "application/vnd.ms-htmlhelp"
        };
      }
      if (check([253, 55, 122, 88, 90, 0])) {
        return {
          ext: "xz",
          mime: "application/x-xz"
        };
      }
      if (checkString("<?xml ")) {
        return {
          ext: "xml",
          mime: "application/xml"
        };
      }
      if (check([55, 122, 188, 175, 39, 28])) {
        return {
          ext: "7z",
          mime: "application/x-7z-compressed"
        };
      }
      if (check([82, 97, 114, 33, 26, 7]) && (buffer[6] === 0 || buffer[6] === 1)) {
        return {
          ext: "rar",
          mime: "application/x-rar-compressed"
        };
      }
      if (checkString("solid ")) {
        return {
          ext: "stl",
          mime: "model/stl"
        };
      }
      if (checkString("BLENDER")) {
        return {
          ext: "blend",
          mime: "application/x-blender"
        };
      }
      if (checkString("!<arch>")) {
        await tokenizer.ignore(8);
        const str = await tokenizer.readToken(new Token.StringType(13, "ascii"));
        if (str === "debian-binary") {
          return {
            ext: "deb",
            mime: "application/x-deb"
          };
        }
        return {
          ext: "ar",
          mime: "application/x-unix-archive"
        };
      }
      if (check([137, 80, 78, 71, 13, 10, 26, 10])) {
        await tokenizer.ignore(8);
        async function readChunkHeader() {
          return {
            length: await tokenizer.readToken(Token.INT32_BE),
            type: await tokenizer.readToken(new Token.StringType(4, "binary"))
          };
        }
        do {
          const chunk = await readChunkHeader();
          if (chunk.length < 0) {
            return;
          }
          switch (chunk.type) {
            case "IDAT":
              return {
                ext: "png",
                mime: "image/png"
              };
            case "acTL":
              return {
                ext: "apng",
                mime: "image/apng"
              };
            default:
              await tokenizer.ignore(chunk.length + 4);
          }
        } while (tokenizer.position + 8 < tokenizer.fileInfo.size);
        return {
          ext: "png",
          mime: "image/png"
        };
      }
      if (check([65, 82, 82, 79, 87, 49, 0, 0])) {
        return {
          ext: "arrow",
          mime: "application/x-apache-arrow"
        };
      }
      if (check([103, 108, 84, 70, 2, 0, 0, 0])) {
        return {
          ext: "glb",
          mime: "model/gltf-binary"
        };
      }
      if (check([102, 114, 101, 101], {offset: 4}) || check([109, 100, 97, 116], {offset: 4}) || check([109, 111, 111, 118], {offset: 4}) || check([119, 105, 100, 101], {offset: 4})) {
        return {
          ext: "mov",
          mime: "video/quicktime"
        };
      }
      if (check([73, 73, 82, 79, 8, 0, 0, 0, 24])) {
        return {
          ext: "orf",
          mime: "image/x-olympus-orf"
        };
      }
      if (checkString("gimp xcf ")) {
        return {
          ext: "xcf",
          mime: "image/x-xcf"
        };
      }
      if (check([73, 73, 85, 0, 24, 0, 0, 0, 136, 231, 116, 216])) {
        return {
          ext: "rw2",
          mime: "image/x-panasonic-rw2"
        };
      }
      if (check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
        async function readHeader() {
          const guid = Buffer.alloc(16);
          await tokenizer.readBuffer(guid);
          return {
            id: guid,
            size: await tokenizer.readToken(Token.UINT64_LE)
          };
        }
        await tokenizer.ignore(30);
        while (tokenizer.position + 24 < tokenizer.fileInfo.size) {
          const header = await readHeader();
          let payload = header.size - 24;
          if (_check(header.id, [145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101])) {
            const typeId = Buffer.alloc(16);
            payload -= await tokenizer.readBuffer(typeId);
            if (_check(typeId, [64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) {
              return {
                ext: "asf",
                mime: "audio/x-ms-asf"
              };
            }
            if (_check(typeId, [192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) {
              return {
                ext: "asf",
                mime: "video/x-ms-asf"
              };
            }
            break;
          }
          await tokenizer.ignore(payload);
        }
        return {
          ext: "asf",
          mime: "application/vnd.ms-asf"
        };
      }
      if (check([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10])) {
        return {
          ext: "ktx",
          mime: "image/ktx"
        };
      }
      if ((check([126, 16, 4]) || check([126, 24, 4])) && check([48, 77, 73, 69], {offset: 4})) {
        return {
          ext: "mie",
          mime: "application/x-mie"
        };
      }
      if (check([39, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], {offset: 2})) {
        return {
          ext: "shp",
          mime: "application/x-esri-shape"
        };
      }
      if (check([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10])) {
        await tokenizer.ignore(20);
        const type = await tokenizer.readToken(new Token.StringType(4, "ascii"));
        switch (type) {
          case "jp2 ":
            return {
              ext: "jp2",
              mime: "image/jp2"
            };
          case "jpx ":
            return {
              ext: "jpx",
              mime: "image/jpx"
            };
          case "jpm ":
            return {
              ext: "jpm",
              mime: "image/jpm"
            };
          case "mjp2":
            return {
              ext: "mj2",
              mime: "image/mj2"
            };
          default:
            return;
        }
      }
      if (check([0, 0, 1, 186]) || check([0, 0, 1, 179])) {
        return {
          ext: "mpg",
          mime: "video/mpeg"
        };
      }
      if (check([0, 1, 0, 0, 0])) {
        return {
          ext: "ttf",
          mime: "font/ttf"
        };
      }
      if (check([0, 0, 1, 0])) {
        return {
          ext: "ico",
          mime: "image/x-icon"
        };
      }
      if (check([0, 0, 2, 0])) {
        return {
          ext: "cur",
          mime: "image/x-icon"
        };
      }
      if (check([208, 207, 17, 224, 161, 177, 26, 225])) {
        return {
          ext: "cfb",
          mime: "application/x-cfb"
        };
      }
      await tokenizer.peekBuffer(buffer, {length: Math.min(256, tokenizer.fileInfo.size), mayBeLess: true});
      if (checkString("BEGIN:")) {
        if (checkString("VCARD", {offset: 6})) {
          return {
            ext: "vcf",
            mime: "text/vcard"
          };
        }
        if (checkString("VCALENDAR", {offset: 6})) {
          return {
            ext: "ics",
            mime: "text/calendar"
          };
        }
      }
      if (checkString("FUJIFILMCCD-RAW")) {
        return {
          ext: "raf",
          mime: "image/x-fujifilm-raf"
        };
      }
      if (checkString("Extended Module:")) {
        return {
          ext: "xm",
          mime: "audio/x-xm"
        };
      }
      if (checkString("Creative Voice File")) {
        return {
          ext: "voc",
          mime: "audio/x-voc"
        };
      }
      if (check([4, 0, 0, 0]) && buffer.length >= 16) {
        const jsonSize = buffer.readUInt32LE(12);
        if (jsonSize > 12 && jsonSize < 240 && buffer.length >= jsonSize + 16) {
          try {
            const header = buffer.slice(16, jsonSize + 16).toString();
            const json = JSON.parse(header);
            if (json.files) {
              return {
                ext: "asar",
                mime: "application/x-asar"
              };
            }
          } catch (_) {
          }
        }
      }
      if (check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
        return {
          ext: "mxf",
          mime: "application/mxf"
        };
      }
      if (checkString("SCRM", {offset: 44})) {
        return {
          ext: "s3m",
          mime: "audio/x-s3m"
        };
      }
      if (check([71], {offset: 4}) && (check([71], {offset: 192}) || check([71], {offset: 196}))) {
        return {
          ext: "mts",
          mime: "video/mp2t"
        };
      }
      if (check([66, 79, 79, 75, 77, 79, 66, 73], {offset: 60})) {
        return {
          ext: "mobi",
          mime: "application/x-mobipocket-ebook"
        };
      }
      if (check([68, 73, 67, 77], {offset: 128})) {
        return {
          ext: "dcm",
          mime: "application/dicom"
        };
      }
      if (check([76, 0, 0, 0, 1, 20, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70])) {
        return {
          ext: "lnk",
          mime: "application/x.ms.shortcut"
        };
      }
      if (check([98, 111, 111, 107, 0, 0, 0, 0, 109, 97, 114, 107, 0, 0, 0, 0])) {
        return {
          ext: "alias",
          mime: "application/x.apple.alias"
        };
      }
      if (check([76, 80], {offset: 34}) && (check([0, 0, 1], {offset: 8}) || check([1, 0, 2], {offset: 8}) || check([2, 0, 2], {offset: 8}))) {
        return {
          ext: "eot",
          mime: "application/vnd.ms-fontobject"
        };
      }
      if (check([6, 6, 237, 245, 216, 29, 70, 229, 189, 49, 239, 231, 254, 116, 183, 29])) {
        return {
          ext: "indd",
          mime: "application/x-indesign"
        };
      }
      await tokenizer.peekBuffer(buffer, {length: Math.min(512, tokenizer.fileInfo.size), mayBeLess: true});
      if (tarHeaderChecksumMatches(buffer)) {
        return {
          ext: "tar",
          mime: "application/x-tar"
        };
      }
      if (check([255, 254, 255, 14, 83, 0, 107, 0, 101, 0, 116, 0, 99, 0, 104, 0, 85, 0, 112, 0, 32, 0, 77, 0, 111, 0, 100, 0, 101, 0, 108, 0])) {
        return {
          ext: "skp",
          mime: "application/vnd.sketchup.skp"
        };
      }
      if (checkString("-----BEGIN PGP MESSAGE-----")) {
        return {
          ext: "pgp",
          mime: "application/pgp-encrypted"
        };
      }
      if (buffer.length >= 2 && check([255, 224], {offset: 0, mask: [255, 224]})) {
        if (check([16], {offset: 1, mask: [22]})) {
          if (check([8], {offset: 1, mask: [8]})) {
            return {
              ext: "aac",
              mime: "audio/aac"
            };
          }
          return {
            ext: "aac",
            mime: "audio/aac"
          };
        }
        if (check([2], {offset: 1, mask: [6]})) {
          return {
            ext: "mp3",
            mime: "audio/mpeg"
          };
        }
        if (check([4], {offset: 1, mask: [6]})) {
          return {
            ext: "mp2",
            mime: "audio/mpeg"
          };
        }
        if (check([6], {offset: 1, mask: [6]})) {
          return {
            ext: "mp1",
            mime: "audio/mpeg"
          };
        }
      }
    }
    var stream = (readableStream) => new Promise((resolve, reject) => {
      const stream = eval("require")("stream");
      readableStream.on("error", reject);
      readableStream.once("readable", async () => {
        const pass = new stream.PassThrough();
        let outputStream;
        if (stream.pipeline) {
          outputStream = stream.pipeline(readableStream, pass, () => {
          });
        } else {
          outputStream = readableStream.pipe(pass);
        }
        const chunk = readableStream.read(minimumBytes) || readableStream.read() || Buffer.alloc(0);
        try {
          const fileType2 = await fromBuffer(chunk);
          pass.fileType = fileType2;
        } catch (error) {
          reject(error);
        }
        resolve(outputStream);
      });
    });
    var fileType = {
      fromStream,
      fromTokenizer,
      fromBuffer,
      stream
    };
    Object.defineProperty(fileType, "extensions", {
      get() {
        return new Set(supported.extensions);
      }
    });
    Object.defineProperty(fileType, "mimeTypes", {
      get() {
        return new Set(supported.mimeTypes);
      }
    });
    module.exports = fileType;
  }
});

// node_modules/content-type/index.js
var require_content_type = __commonJS({
  "node_modules/content-type/index.js"(exports2) {
    "use strict";
    var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g;
    var TEXT_REGEXP = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/;
    var TOKEN_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
    var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g;
    var QUOTE_REGEXP = /([\\"])/g;
    var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
    exports2.format = format;
    exports2.parse = parse;
    function format(obj) {
      if (!obj || typeof obj !== "object") {
        throw new TypeError("argument obj is required");
      }
      var parameters = obj.parameters;
      var type = obj.type;
      if (!type || !TYPE_REGEXP.test(type)) {
        throw new TypeError("invalid type");
      }
      var string = type;
      if (parameters && typeof parameters === "object") {
        var param;
        var params = Object.keys(parameters).sort();
        for (var i = 0; i < params.length; i++) {
          param = params[i];
          if (!TOKEN_REGEXP.test(param)) {
            throw new TypeError("invalid parameter name");
          }
          string += "; " + param + "=" + qstring(parameters[param]);
        }
      }
      return string;
    }
    function parse(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      var header = typeof string === "object" ? getcontenttype(string) : string;
      if (typeof header !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      var index = header.indexOf(";");
      var type = index !== -1 ? header.substr(0, index).trim() : header.trim();
      if (!TYPE_REGEXP.test(type)) {
        throw new TypeError("invalid media type");
      }
      var obj = new ContentType(type.toLowerCase());
      if (index !== -1) {
        var key;
        var match;
        var value;
        PARAM_REGEXP.lastIndex = index;
        while (match = PARAM_REGEXP.exec(header)) {
          if (match.index !== index) {
            throw new TypeError("invalid parameter format");
          }
          index += match[0].length;
          key = match[1].toLowerCase();
          value = match[2];
          if (value[0] === '"') {
            value = value.substr(1, value.length - 2).replace(QESC_REGEXP, "$1");
          }
          obj.parameters[key] = value;
        }
        if (index !== header.length) {
          throw new TypeError("invalid parameter format");
        }
      }
      return obj;
    }
    function getcontenttype(obj) {
      var header;
      if (typeof obj.getHeader === "function") {
        header = obj.getHeader("content-type");
      } else if (typeof obj.headers === "object") {
        header = obj.headers && obj.headers["content-type"];
      }
      if (typeof header !== "string") {
        throw new TypeError("content-type header is missing from object");
      }
      return header;
    }
    function qstring(val) {
      var str = String(val);
      if (TOKEN_REGEXP.test(str)) {
        return str;
      }
      if (str.length > 0 && !TEXT_REGEXP.test(str)) {
        throw new TypeError("invalid parameter value");
      }
      return '"' + str.replace(QUOTE_REGEXP, "\\$1") + '"';
    }
    function ContentType(type) {
      this.parameters = Object.create(null);
      this.type = type;
    }
  }
});

// node_modules/media-typer/index.js
var require_media_typer = __commonJS({
  "node_modules/media-typer/index.js"(exports2) {
    "use strict";
    var SUBTYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
    var TYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
    var TYPE_REGEXP = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;
    exports2.format = format;
    exports2.parse = parse;
    exports2.test = test;
    function format(obj) {
      if (!obj || typeof obj !== "object") {
        throw new TypeError("argument obj is required");
      }
      var subtype = obj.subtype;
      var suffix = obj.suffix;
      var type = obj.type;
      if (!type || !TYPE_NAME_REGEXP.test(type)) {
        throw new TypeError("invalid type");
      }
      if (!subtype || !SUBTYPE_NAME_REGEXP.test(subtype)) {
        throw new TypeError("invalid subtype");
      }
      var string = type + "/" + subtype;
      if (suffix) {
        if (!TYPE_NAME_REGEXP.test(suffix)) {
          throw new TypeError("invalid suffix");
        }
        string += "+" + suffix;
      }
      return string;
    }
    function test(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      if (typeof string !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      return TYPE_REGEXP.test(string.toLowerCase());
    }
    function parse(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      if (typeof string !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      var match = TYPE_REGEXP.exec(string.toLowerCase());
      if (!match) {
        throw new TypeError("invalid media type");
      }
      var type = match[1];
      var subtype = match[2];
      var suffix;
      var index = subtype.lastIndexOf("+");
      if (index !== -1) {
        suffix = subtype.substr(index + 1);
        subtype = subtype.substr(0, index);
      }
      return new MediaType(type, subtype, suffix);
    }
    function MediaType(type, subtype, suffix) {
      this.type = type;
      this.subtype = subtype;
      this.suffix = suffix;
    }
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self = debug;
          const curr = Number(new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for (i = 0; i < len; i++) {
          if (!split[i]) {
            continue;
          }
          namespaces = split[i].replace(/\*/g, ".*?");
          if (namespaces[0] === "-") {
            createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
          } else {
            createDebug.names.push(new RegExp("^" + namespaces + "$"));
          }
        }
      }
      function disable() {
        const namespaces = [
          ...createDebug.names.map(toNamespace),
          ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        if (name[name.length - 1] === "*") {
          return true;
        }
        let i;
        let len;
        for (i = 0, len = createDebug.skips.length; i < len; i++) {
          if (createDebug.skips[i].test(name)) {
            return false;
          }
        }
        for (i = 0, len = createDebug.names.length; i < len; i++) {
          if (createDebug.names[i].test(name)) {
            return true;
          }
        }
        return false;
      }
      function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var {formatters} = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(() => {
    }, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require("supports-color");
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const {namespace: name, useColors: useColors2} = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} [0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return new Date().toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.format(...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var {formatters} = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/music-metadata/lib/type.js
var require_type = __commonJS({
  "node_modules/music-metadata/lib/type.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.TrackType = void 0;
    var TrackType;
    (function(TrackType2) {
      TrackType2[TrackType2["video"] = 1] = "video";
      TrackType2[TrackType2["audio"] = 2] = "audio";
      TrackType2[TrackType2["complex"] = 3] = "complex";
      TrackType2[TrackType2["logo"] = 4] = "logo";
      TrackType2[TrackType2["subtitle"] = 17] = "subtitle";
      TrackType2[TrackType2["button"] = 18] = "button";
      TrackType2[TrackType2["control"] = 32] = "control";
    })(TrackType = exports2.TrackType || (exports2.TrackType = {}));
  }
});

// node_modules/music-metadata/lib/common/GenericTagTypes.js
var require_GenericTagTypes = __commonJS({
  "node_modules/music-metadata/lib/common/GenericTagTypes.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.isUnique = exports2.isSingleton = exports2.commonTags = void 0;
    exports2.commonTags = {
      year: {multiple: false},
      track: {multiple: false},
      disk: {multiple: false},
      title: {multiple: false},
      artist: {multiple: false},
      artists: {multiple: true, unique: true},
      albumartist: {multiple: false},
      album: {multiple: false},
      date: {multiple: false},
      originaldate: {multiple: false},
      originalyear: {multiple: false},
      comment: {multiple: true, unique: false},
      genre: {multiple: true, unique: true},
      picture: {multiple: true, unique: true},
      composer: {multiple: true, unique: true},
      lyrics: {multiple: true, unique: false},
      albumsort: {multiple: false, unique: true},
      titlesort: {multiple: false, unique: true},
      work: {multiple: false, unique: true},
      artistsort: {multiple: false, unique: true},
      albumartistsort: {multiple: false, unique: true},
      composersort: {multiple: false, unique: true},
      lyricist: {multiple: true, unique: true},
      writer: {multiple: true, unique: true},
      conductor: {multiple: true, unique: true},
      remixer: {multiple: true, unique: true},
      arranger: {multiple: true, unique: true},
      engineer: {multiple: true, unique: true},
      producer: {multiple: true, unique: true},
      technician: {multiple: true, unique: true},
      djmixer: {multiple: true, unique: true},
      mixer: {multiple: true, unique: true},
      label: {multiple: true, unique: true},
      grouping: {multiple: false},
      subtitle: {multiple: true},
      discsubtitle: {multiple: false},
      totaltracks: {multiple: false},
      totaldiscs: {multiple: false},
      compilation: {multiple: false},
      rating: {multiple: true},
      bpm: {multiple: false},
      mood: {multiple: false},
      media: {multiple: false},
      catalognumber: {multiple: true, unique: true},
      tvShow: {multiple: false},
      tvShowSort: {multiple: false},
      tvSeason: {multiple: false},
      tvEpisode: {multiple: false},
      tvEpisodeId: {multiple: false},
      tvNetwork: {multiple: false},
      podcast: {multiple: false},
      podcasturl: {multiple: false},
      releasestatus: {multiple: false},
      releasetype: {multiple: true},
      releasecountry: {multiple: false},
      script: {multiple: false},
      language: {multiple: false},
      copyright: {multiple: false},
      license: {multiple: false},
      encodedby: {multiple: false},
      encodersettings: {multiple: false},
      gapless: {multiple: false},
      barcode: {multiple: false},
      isrc: {multiple: true},
      asin: {multiple: false},
      musicbrainz_recordingid: {multiple: false},
      musicbrainz_trackid: {multiple: false},
      musicbrainz_albumid: {multiple: false},
      musicbrainz_artistid: {multiple: true},
      musicbrainz_albumartistid: {multiple: true},
      musicbrainz_releasegroupid: {multiple: false},
      musicbrainz_workid: {multiple: false},
      musicbrainz_trmid: {multiple: false},
      musicbrainz_discid: {multiple: false},
      acoustid_id: {multiple: false},
      acoustid_fingerprint: {multiple: false},
      musicip_puid: {multiple: false},
      musicip_fingerprint: {multiple: false},
      website: {multiple: false},
      "performer:instrument": {multiple: true, unique: true},
      averageLevel: {multiple: false},
      peakLevel: {multiple: false},
      notes: {multiple: true, unique: false},
      key: {multiple: false},
      originalalbum: {multiple: false},
      originalartist: {multiple: false},
      discogs_artist_id: {multiple: true, unique: true},
      discogs_release_id: {multiple: false},
      discogs_label_id: {multiple: false},
      discogs_master_release_id: {multiple: false},
      discogs_votes: {multiple: false},
      discogs_rating: {multiple: false},
      replaygain_track_peak: {multiple: false},
      replaygain_track_gain: {multiple: false},
      replaygain_album_peak: {multiple: false},
      replaygain_album_gain: {multiple: false},
      replaygain_track_minmax: {multiple: false},
      replaygain_album_minmax: {multiple: false},
      replaygain_undo: {multiple: false},
      description: {multiple: true},
      longDescription: {multiple: false},
      category: {multiple: true},
      hdVideo: {multiple: false},
      keywords: {multiple: true},
      movement: {multiple: false},
      movementIndex: {multiple: false},
      movementTotal: {multiple: false},
      podcastId: {multiple: false},
      showMovement: {multiple: false},
      stik: {multiple: false}
    };
    function isSingleton(alias) {
      return exports2.commonTags.hasOwnProperty(alias) && !exports2.commonTags[alias].multiple;
    }
    exports2.isSingleton = isSingleton;
    function isUnique(alias) {
      return !exports2.commonTags[alias].multiple || exports2.commonTags[alias].unique;
    }
    exports2.isUnique = isUnique;
  }
});

// node_modules/music-metadata/lib/common/GenericTagMapper.js
var require_GenericTagMapper = __commonJS({
  "node_modules/music-metadata/lib/common/GenericTagMapper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.CommonTagMapper = void 0;
    var CommonTagMapper = class {
      constructor(tagTypes, tagMap) {
        this.tagTypes = tagTypes;
        this.tagMap = tagMap;
      }
      static toIntOrNull(str) {
        const cleaned = parseInt(str, 10);
        return isNaN(cleaned) ? null : cleaned;
      }
      static normalizeTrack(origVal) {
        const split = origVal.toString().split("/");
        return {
          no: parseInt(split[0], 10) || null,
          of: parseInt(split[1], 10) || null
        };
      }
      mapGenericTag(tag, warnings) {
        tag = {id: tag.id, value: tag.value};
        this.postMap(tag, warnings);
        const id = this.getCommonName(tag.id);
        return id ? {id, value: tag.value} : null;
      }
      getCommonName(tag) {
        return this.tagMap[tag];
      }
      postMap(tag, warnings) {
        return;
      }
    };
    exports2.CommonTagMapper = CommonTagMapper;
    CommonTagMapper.maxRatingScore = 1;
  }
});

// node_modules/music-metadata/lib/id3v1/ID3v1TagMap.js
var require_ID3v1TagMap = __commonJS({
  "node_modules/music-metadata/lib/id3v1/ID3v1TagMap.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ID3v1TagMapper = void 0;
    var GenericTagMapper_1 = require_GenericTagMapper();
    var id3v1TagMap = {
      title: "title",
      artist: "artist",
      album: "album",
      year: "year",
      comment: "comment",
      track: "track",
      genre: "genre"
    };
    var ID3v1TagMapper = class extends GenericTagMapper_1.CommonTagMapper {
      constructor() {
        super(["ID3v1"], id3v1TagMap);
      }
    };
    exports2.ID3v1TagMapper = ID3v1TagMapper;
  }
});

// node_modules/music-metadata/lib/common/Windows1292Decoder.js
var require_Windows1292Decoder = __commonJS({
  "node_modules/music-metadata/lib/common/Windows1292Decoder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.Windows1292Decoder = void 0;
    var Windows1292Decoder = class {
      static decode(buffer) {
        let str = "";
        for (const i in buffer) {
          if (buffer.hasOwnProperty(i)) {
            str += Windows1292Decoder.codePointToString(Windows1292Decoder.singleByteDecoder(buffer[i]));
          }
        }
        return str;
      }
      static inRange(a, min, max) {
        return min <= a && a <= max;
      }
      static codePointToString(cp) {
        if (cp <= 65535) {
          return String.fromCharCode(cp);
        } else {
          cp -= 65536;
          return String.fromCharCode((cp >> 10) + 55296, (cp & 1023) + 56320);
        }
      }
      static singleByteDecoder(bite) {
        if (Windows1292Decoder.inRange(bite, 0, 127)) {
          return bite;
        }
        const codePoint = Windows1292Decoder.windows1252[bite - 128];
        if (codePoint === null) {
          throw Error("invaliding encoding");
        }
        return codePoint;
      }
    };
    exports2.Windows1292Decoder = Windows1292Decoder;
    Windows1292Decoder.windows1252 = [
      8364,
      129,
      8218,
      402,
      8222,
      8230,
      8224,
      8225,
      710,
      8240,
      352,
      8249,
      338,
      141,
      381,
      143,
      144,
      8216,
      8217,
      8220,
      8221,
      8226,
      8211,
      8212,
      732,
      8482,
      353,
      8250,
      339,
      157,
      382,
      376,
      160,
      161,
      162,
      163,
      164,
      165,
      166,
      167,
      168,
      169,
      170,
      171,
      172,
      173,
      174,
      175,
      176,
      177,
      178,
      179,
      180,
      181,
      182,
      183,
      184,
      185,
      186,
      187,
      188,
      189,
      190,
      191,
      192,
      193,
      194,
      195,
      196,
      197,
      198,
      199,
      200,
      201,
      202,
      203,
      204,
      205,
      206,
      207,
      208,
      209,
      210,
      211,
      212,
      213,
      214,
      215,
      216,
      217,
      218,
      219,
      220,
      221,
      222,
      223,
      224,
      225,
      226,
      227,
      228,
      229,
      230,
      231,
      232,
      233,
      234,
      235,
      236,
      237,
      238,
      239,
      240,
      241,
      242,
      243,
      244,
      245,
      246,
      247,
      248,
      249,
      250,
      251,
      252,
      253,
      254,
      255
    ];
  }
});

// node_modules/music-metadata/lib/common/Util.js
var require_Util = __commonJS({
  "node_modules/music-metadata/lib/common/Util.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.toRatio = exports2.dbToRatio = exports2.ratioToDb = void 0;
    var Windows1292Decoder_1 = require_Windows1292Decoder();
    var Util = class {
      static findZero(buffer, start, end, encoding) {
        let i = start;
        if (encoding === "utf16") {
          while (buffer[i] !== 0 || buffer[i + 1] !== 0) {
            if (i >= end)
              return end;
            i += 2;
          }
          return i;
        } else {
          while (buffer[i] !== 0) {
            if (i >= end)
              return end;
            i++;
          }
          return i;
        }
      }
      static trimRightNull(x) {
        const pos0 = x.indexOf("\0");
        return pos0 === -1 ? x : x.substr(0, pos0);
      }
      static swapBytes(buffer) {
        const l = buffer.length;
        if ((l & 1) !== 0)
          throw new Error("Buffer length must be even");
        for (let i = 0; i < l; i += 2) {
          const a = buffer[i];
          buffer[i] = buffer[i + 1];
          buffer[i + 1] = a;
        }
        return buffer;
      }
      static readUTF16String(buffer) {
        let offset = 0;
        if (buffer[0] === 254 && buffer[1] === 255) {
          buffer = Util.swapBytes(buffer);
          offset = 2;
        } else if (buffer[0] === 255 && buffer[1] === 254) {
          offset = 2;
        }
        return buffer.toString("ucs2", offset);
      }
      static decodeString(buffer, encoding) {
        if (buffer[0] === 255 && buffer[1] === 254 && buffer[2] === 254 && buffer[3] === 255) {
          buffer = buffer.slice(2);
        }
        if (encoding === "utf16le" || encoding === "utf16") {
          return Util.readUTF16String(buffer);
        } else if (encoding === "utf8") {
          return buffer.toString("utf8");
        } else if (encoding === "iso-8859-1") {
          return Windows1292Decoder_1.Windows1292Decoder.decode(buffer);
        }
        throw Error(encoding + " encoding is not supported!");
      }
      static stripNulls(str) {
        str = str.replace(/^\x00+/g, "");
        str = str.replace(/\x00+$/g, "");
        return str;
      }
      static getBitAllignedNumber(buf, byteOffset, bitOffset, len) {
        const byteOff = byteOffset + ~~(bitOffset / 8);
        const bitOff = bitOffset % 8;
        let value = buf[byteOff];
        value &= 255 >> bitOff;
        const bitsRead = 8 - bitOff;
        const bitsLeft = len - bitsRead;
        if (bitsLeft < 0) {
          value >>= 8 - bitOff - len;
        } else if (bitsLeft > 0) {
          value <<= bitsLeft;
          value |= Util.getBitAllignedNumber(buf, byteOffset, bitOffset + bitsRead, bitsLeft);
        }
        return value;
      }
      static isBitSet(buf, byteOffset, bitOffset) {
        return Util.getBitAllignedNumber(buf, byteOffset, bitOffset, 1) === 1;
      }
      static a2hex(str) {
        const arr = [];
        for (let i = 0, l = str.length; i < l; i++) {
          const hex = Number(str.charCodeAt(i)).toString(16);
          arr.push(hex.length === 1 ? "0" + hex : hex);
        }
        return arr.join(" ");
      }
    };
    exports2.default = Util;
    Util.strtokBITSET = {
      get: (buf, off, bit) => {
        return (buf[off] & 1 << bit) !== 0;
      },
      len: 1
    };
    function ratioToDb(ratio) {
      return 10 * Math.log10(ratio);
    }
    exports2.ratioToDb = ratioToDb;
    function dbToRatio(dB) {
      return Math.pow(10, dB / 10);
    }
    exports2.dbToRatio = dbToRatio;
    function toRatio(value) {
      const ps = value.split(" ").map((p) => p.trim().toLowerCase());
      if (ps.length >= 1) {
        const v = parseFloat(ps[0]);
        if (ps.length === 2 && ps[1] === "db") {
          return {
            dB: v,
            ratio: dbToRatio(v)
          };
        } else {
          return {
            dB: ratioToDb(v),
            ratio: v
          };
        }
      }
    }
    exports2.toRatio = toRatio;
  }
});

// node_modules/music-metadata/lib/common/CaseInsensitiveTagMap.js
var require_CaseInsensitiveTagMap = __commonJS({
  "node_modules/music-metadata/lib/common/CaseInsensitiveTagMap.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.CaseInsensitiveTagMap = void 0;
    var GenericTagMapper_1 = require_GenericTagMapper();
    var CaseInsensitiveTagMap = class extends GenericTagMapper_1.CommonTagMapper {
      constructor(tagTypes, tagMap) {
        const upperCaseMap = {};
        for (const tag of Object.keys(tagMap)) {
          upperCaseMap[tag.toUpperCase()] = tagMap[tag];
        }
        super(tagTypes, upperCaseMap);
      }
      getCommonName(tag) {
        return this.tagMap[tag.toUpperCase()];
      }
    };
    exports2.CaseInsensitiveTagMap = CaseInsensitiveTagMap;
  }
});

// node_modules/music-metadata/lib/id3v2/ID3v24TagMapper.js
var require_ID3v24TagMapper = __commonJS({
  "node_modules/music-metadata/lib/id3v2/ID3v24TagMapper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ID3v24TagMapper = void 0;
    var GenericTagMapper_1 = require_GenericTagMapper();
    var Util_1 = require_Util();
    var CaseInsensitiveTagMap_1 = require_CaseInsensitiveTagMap();
    var id3v24TagMap = {
      TIT2: "title",
      TPE1: "artist",
      "TXXX:Artists": "artists",
      TPE2: "albumartist",
      TALB: "album",
      TDRV: "date",
      TORY: "originalyear",
      TPOS: "disk",
      TCON: "genre",
      APIC: "picture",
      TCOM: "composer",
      "USLT:description": "lyrics",
      TSOA: "albumsort",
      TSOT: "titlesort",
      TOAL: "originalalbum",
      TSOP: "artistsort",
      TSO2: "albumartistsort",
      TSOC: "composersort",
      TEXT: "lyricist",
      "TXXX:Writer": "writer",
      TPE3: "conductor",
      TPE4: "remixer",
      "IPLS:arranger": "arranger",
      "IPLS:engineer": "engineer",
      "IPLS:producer": "producer",
      "IPLS:DJ-mix": "djmixer",
      "IPLS:mix": "mixer",
      TPUB: "label",
      TIT1: "grouping",
      TIT3: "subtitle",
      TRCK: "track",
      TCMP: "compilation",
      POPM: "rating",
      TBPM: "bpm",
      TMED: "media",
      "TXXX:CATALOGNUMBER": "catalognumber",
      "TXXX:MusicBrainz Album Status": "releasestatus",
      "TXXX:MusicBrainz Album Type": "releasetype",
      "TXXX:MusicBrainz Album Release Country": "releasecountry",
      "TXXX:RELEASECOUNTRY": "releasecountry",
      "TXXX:SCRIPT": "script",
      TLAN: "language",
      TCOP: "copyright",
      WCOP: "license",
      TENC: "encodedby",
      TSSE: "encodersettings",
      "TXXX:BARCODE": "barcode",
      "TXXX:ISRC": "isrc",
      TSRC: "isrc",
      "TXXX:ASIN": "asin",
      "TXXX:originalyear": "originalyear",
      "UFID:http://musicbrainz.org": "musicbrainz_recordingid",
      "TXXX:MusicBrainz Release Track Id": "musicbrainz_trackid",
      "TXXX:MusicBrainz Album Id": "musicbrainz_albumid",
      "TXXX:MusicBrainz Artist Id": "musicbrainz_artistid",
      "TXXX:MusicBrainz Album Artist Id": "musicbrainz_albumartistid",
      "TXXX:MusicBrainz Release Group Id": "musicbrainz_releasegroupid",
      "TXXX:MusicBrainz Work Id": "musicbrainz_workid",
      "TXXX:MusicBrainz TRM Id": "musicbrainz_trmid",
      "TXXX:MusicBrainz Disc Id": "musicbrainz_discid",
      "TXXX:ACOUSTID_ID": "acoustid_id",
      "TXXX:Acoustid Id": "acoustid_id",
      "TXXX:Acoustid Fingerprint": "acoustid_fingerprint",
      "TXXX:MusicIP PUID": "musicip_puid",
      "TXXX:MusicMagic Fingerprint": "musicip_fingerprint",
      WOAR: "website",
      TDRC: "date",
      TYER: "year",
      TDOR: "originaldate",
      "TIPL:arranger": "arranger",
      "TIPL:engineer": "engineer",
      "TIPL:producer": "producer",
      "TIPL:DJ-mix": "djmixer",
      "TIPL:mix": "mixer",
      TMOO: "mood",
      SYLT: "lyrics",
      TSST: "discsubtitle",
      TKEY: "key",
      COMM: "comment",
      TOPE: "originalartist",
      "PRIV:AverageLevel": "averageLevel",
      "PRIV:PeakLevel": "peakLevel",
      "TXXX:DISCOGS_ARTIST_ID": "discogs_artist_id",
      "TXXX:DISCOGS_ARTISTS": "artists",
      "TXXX:DISCOGS_ARTIST_NAME": "artists",
      "TXXX:DISCOGS_ALBUM_ARTISTS": "albumartist",
      "TXXX:DISCOGS_CATALOG": "catalognumber",
      "TXXX:DISCOGS_COUNTRY": "releasecountry",
      "TXXX:DISCOGS_DATE": "originaldate",
      "TXXX:DISCOGS_LABEL": "label",
      "TXXX:DISCOGS_LABEL_ID": "discogs_label_id",
      "TXXX:DISCOGS_MASTER_RELEASE_ID": "discogs_master_release_id",
      "TXXX:DISCOGS_RATING": "discogs_rating",
      "TXXX:DISCOGS_RELEASED": "date",
      "TXXX:DISCOGS_RELEASE_ID": "discogs_release_id",
      "TXXX:DISCOGS_VOTES": "discogs_votes",
      "TXXX:CATALOGID": "catalognumber",
      "TXXX:STYLE": "genre",
      "TXXX:REPLAYGAIN_TRACK_PEAK": "replaygain_track_peak",
      "TXXX:REPLAYGAIN_TRACK_GAIN": "replaygain_track_gain",
      "TXXX:REPLAYGAIN_ALBUM_PEAK": "replaygain_album_peak",
      "TXXX:REPLAYGAIN_ALBUM_GAIN": "replaygain_album_gain",
      "TXXX:MP3GAIN_MINMAX": "replaygain_track_minmax",
      "TXXX:MP3GAIN_ALBUM_MINMAX": "replaygain_album_minmax",
      "TXXX:MP3GAIN_UNDO": "replaygain_undo",
      MVNM: "movement",
      MVIN: "movementIndex",
      PCST: "podcast",
      TCAT: "category",
      TDES: "description",
      TDRL: "date",
      TGID: "podcastId",
      TKWD: "keywords",
      WFED: "podcasturl"
    };
    var ID3v24TagMapper = class extends CaseInsensitiveTagMap_1.CaseInsensitiveTagMap {
      static toRating(popm) {
        return {
          source: popm.email,
          rating: popm.rating > 0 ? (popm.rating - 1) / 254 * GenericTagMapper_1.CommonTagMapper.maxRatingScore : void 0
        };
      }
      constructor() {
        super(["ID3v2.3", "ID3v2.4"], id3v24TagMap);
      }
      postMap(tag, warnings) {
        switch (tag.id) {
          case "UFID":
            if (tag.value.owner_identifier === "http://musicbrainz.org") {
              tag.id += ":" + tag.value.owner_identifier;
              tag.value = Util_1.default.decodeString(tag.value.identifier, "iso-8859-1");
            }
            break;
          case "PRIV":
            switch (tag.value.owner_identifier) {
              case "AverageLevel":
              case "PeakValue":
                tag.id += ":" + tag.value.owner_identifier;
                tag.value = tag.value.data.length === 4 ? tag.value.data.readUInt32LE(0) : null;
                if (tag.value === null) {
                  warnings.addWarning(`Failed to parse PRIV:PeakValue`);
                }
                break;
              default:
                warnings.addWarning(`Unknown PRIV owner-identifier: ${tag.value.owner_identifier}`);
            }
            break;
          case "COMM":
            tag.value = tag.value ? tag.value.text : null;
            break;
          case "POPM":
            tag.value = ID3v24TagMapper.toRating(tag.value);
            break;
          default:
            break;
        }
      }
    };
    exports2.ID3v24TagMapper = ID3v24TagMapper;
  }
});

// node_modules/music-metadata/lib/asf/AsfTagMapper.js
var require_AsfTagMapper = __commonJS({
  "node_modules/music-metadata/lib/asf/AsfTagMapper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.AsfTagMapper = void 0;
    var GenericTagMapper_1 = require_GenericTagMapper();
    var asfTagMap = {
      Title: "title",
      Author: "artist",
      "WM/AlbumArtist": "albumartist",
      "WM/AlbumTitle": "album",
      "WM/Year": "date",
      "WM/OriginalReleaseTime": "originaldate",
      "WM/OriginalReleaseYear": "originalyear",
      Description: "comment",
      "WM/TrackNumber": "track",
      "WM/PartOfSet": "disk",
      "WM/Genre": "genre",
      "WM/Composer": "composer",
      "WM/Lyrics": "lyrics",
      "WM/AlbumSortOrder": "albumsort",
      "WM/TitleSortOrder": "titlesort",
      "WM/ArtistSortOrder": "artistsort",
      "WM/AlbumArtistSortOrder": "albumartistsort",
      "WM/ComposerSortOrder": "composersort",
      "WM/Writer": "lyricist",
      "WM/Conductor": "conductor",
      "WM/ModifiedBy": "remixer",
      "WM/Engineer": "engineer",
      "WM/Producer": "producer",
      "WM/DJMixer": "djmixer",
      "WM/Mixer": "mixer",
      "WM/Publisher": "label",
      "WM/ContentGroupDescription": "grouping",
      "WM/SubTitle": "subtitle",
      "WM/SetSubTitle": "discsubtitle",
      "WM/IsCompilation": "compilation",
      "WM/SharedUserRating": "rating",
      "WM/BeatsPerMinute": "bpm",
      "WM/Mood": "mood",
      "WM/Media": "media",
      "WM/CatalogNo": "catalognumber",
      "MusicBrainz/Album Status": "releasestatus",
      "MusicBrainz/Album Type": "releasetype",
      "MusicBrainz/Album Release Country": "releasecountry",
      "WM/Script": "script",
      "WM/Language": "language",
      Copyright: "copyright",
      LICENSE: "license",
      "WM/EncodedBy": "encodedby",
      "WM/EncodingSettings": "encodersettings",
      "WM/Barcode": "barcode",
      "WM/ISRC": "isrc",
      "MusicBrainz/Track Id": "musicbrainz_recordingid",
      "MusicBrainz/Release Track Id": "musicbrainz_trackid",
      "MusicBrainz/Album Id": "musicbrainz_albumid",
      "MusicBrainz/Artist Id": "musicbrainz_artistid",
      "MusicBrainz/Album Artist Id": "musicbrainz_albumartistid",
      "MusicBrainz/Release Group Id": "musicbrainz_releasegroupid",
      "MusicBrainz/Work Id": "musicbrainz_workid",
      "MusicBrainz/TRM Id": "musicbrainz_trmid",
      "MusicBrainz/Disc Id": "musicbrainz_discid",
      "Acoustid/Id": "acoustid_id",
      "Acoustid/Fingerprint": "acoustid_fingerprint",
      "MusicIP/PUID": "musicip_puid",
      "WM/ARTISTS": "artists",
      "WM/InitialKey": "key",
      ASIN: "asin",
      "WM/Work": "work",
      "WM/AuthorURL": "website",
      "WM/Picture": "picture"
    };
    var AsfTagMapper = class extends GenericTagMapper_1.CommonTagMapper {
      static toRating(rating) {
        return {
          rating: parseFloat(rating + 1) / 5
        };
      }
      constructor() {
        super(["asf"], asfTagMap);
      }
      postMap(tag) {
        switch (tag.id) {
          case "WM/SharedUserRating":
            const keys = tag.id.split(":");
            tag.value = AsfTagMapper.toRating(tag.value);
            tag.id = keys[0];
            break;
        }
      }
    };
    exports2.AsfTagMapper = AsfTagMapper;
  }
});

// node_modules/music-metadata/lib/id3v2/ID3v22TagMapper.js
var require_ID3v22TagMapper = __commonJS({
  "node_modules/music-metadata/lib/id3v2/ID3v22TagMapper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ID3v22TagMapper = exports2.id3v22TagMap = void 0;
    var CaseInsensitiveTagMap_1 = require_CaseInsensitiveTagMap();
    exports2.id3v22TagMap = {
      TT2: "title",
      TP1: "artist",
      TP2: "albumartist",
      TAL: "album",
      TYE: "year",
      COM: "comment",
      TRK: "track",
      TPA: "disk",
      TCO: "genre",
      PIC: "picture",
      TCM: "composer",
      TOR: "originaldate",
      TOT: "originalalbum",
      TXT: "lyricist",
      TP3: "conductor",
      TPB: "label",
      TT1: "grouping",
      TT3: "subtitle",
      TLA: "language",
      TCR: "copyright",
      WCP: "license",
      TEN: "encodedby",
      TSS: "encodersettings",
      WAR: "website",
      "COM:iTunPGAP": "gapless",
      PCS: "podcast",
      TCP: "compilation",
      TDR: "date",
      TS2: "albumartistsort",
      TSA: "albumsort",
      TSC: "composersort",
      TSP: "artistsort",
      TST: "titlesort",
      WFD: "podcasturl"
    };
    var ID3v22TagMapper = class extends CaseInsensitiveTagMap_1.CaseInsensitiveTagMap {
      constructor() {
        super(["ID3v2.2"], exports2.id3v22TagMap);
      }
    };
    exports2.ID3v22TagMapper = ID3v22TagMapper;
  }
});

// node_modules/music-metadata/lib/apev2/APEv2TagMapper.js
var require_APEv2TagMapper = __commonJS({
  "node_modules/music-metadata/lib/apev2/APEv2TagMapper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.APEv2TagMapper = void 0;
    var CaseInsensitiveTagMap_1 = require_CaseInsensitiveTagMap();
    var apev2TagMap = {
      Title: "title",
      Artist: "artist",
      Artists: "artists",
      "Album Artist": "albumartist",
      Album: "album",
      Year: "date",
      Originalyear: "originalyear",
      Originaldate: "originaldate",
      Comment: "comment",
      Track: "track",
      Disc: "disk",
      DISCNUMBER: "disk",
      Genre: "genre",
      "Cover Art (Front)": "picture",
      "Cover Art (Back)": "picture",
      Composer: "composer",
      Lyrics: "lyrics",
      ALBUMSORT: "albumsort",
      TITLESORT: "titlesort",
      WORK: "work",
      ARTISTSORT: "artistsort",
      ALBUMARTISTSORT: "albumartistsort",
      COMPOSERSORT: "composersort",
      Lyricist: "lyricist",
      Writer: "writer",
      Conductor: "conductor",
      MixArtist: "remixer",
      Arranger: "arranger",
      Engineer: "engineer",
      Producer: "producer",
      DJMixer: "djmixer",
      Mixer: "mixer",
      Label: "label",
      Grouping: "grouping",
      Subtitle: "subtitle",
      DiscSubtitle: "discsubtitle",
      Compilation: "compilation",
      BPM: "bpm",
      Mood: "mood",
      Media: "media",
      CatalogNumber: "catalognumber",
      MUSICBRAINZ_ALBUMSTATUS: "releasestatus",
      MUSICBRAINZ_ALBUMTYPE: "releasetype",
      RELEASECOUNTRY: "releasecountry",
      Script: "script",
      Language: "language",
      Copyright: "copyright",
      LICENSE: "license",
      EncodedBy: "encodedby",
      EncoderSettings: "encodersettings",
      Barcode: "barcode",
      ISRC: "isrc",
      ASIN: "asin",
      musicbrainz_trackid: "musicbrainz_recordingid",
      musicbrainz_releasetrackid: "musicbrainz_trackid",
      MUSICBRAINZ_ALBUMID: "musicbrainz_albumid",
      MUSICBRAINZ_ARTISTID: "musicbrainz_artistid",
      MUSICBRAINZ_ALBUMARTISTID: "musicbrainz_albumartistid",
      MUSICBRAINZ_RELEASEGROUPID: "musicbrainz_releasegroupid",
      MUSICBRAINZ_WORKID: "musicbrainz_workid",
      MUSICBRAINZ_TRMID: "musicbrainz_trmid",
      MUSICBRAINZ_DISCID: "musicbrainz_discid",
      Acoustid_Id: "acoustid_id",
      ACOUSTID_FINGERPRINT: "acoustid_fingerprint",
      MUSICIP_PUID: "musicip_puid",
      Weblink: "website",
      REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
      REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
      MP3GAIN_MINMAX: "replaygain_track_minmax",
      MP3GAIN_UNDO: "replaygain_undo"
    };
    var APEv2TagMapper = class extends CaseInsensitiveTagMap_1.CaseInsensitiveTagMap {
      constructor() {
        super(["APEv2"], apev2TagMap);
      }
    };
    exports2.APEv2TagMapper = APEv2TagMapper;
  }
});

// node_modules/music-metadata/lib/mp4/MP4TagMapper.js
var require_MP4TagMapper = __commonJS({
  "node_modules/music-metadata/lib/mp4/MP4TagMapper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.MP4TagMapper = exports2.tagType = void 0;
    var CaseInsensitiveTagMap_1 = require_CaseInsensitiveTagMap();
    var mp4TagMap = {
      "\xA9nam": "title",
      "\xA9ART": "artist",
      aART: "albumartist",
      "----:com.apple.iTunes:Band": "albumartist",
      "\xA9alb": "album",
      "\xA9day": "date",
      "\xA9cmt": "comment",
      "\xA9com": "comment",
      trkn: "track",
      disk: "disk",
      "\xA9gen": "genre",
      covr: "picture",
      "\xA9wrt": "composer",
      "\xA9lyr": "lyrics",
      soal: "albumsort",
      sonm: "titlesort",
      soar: "artistsort",
      soaa: "albumartistsort",
      soco: "composersort",
      "----:com.apple.iTunes:LYRICIST": "lyricist",
      "----:com.apple.iTunes:CONDUCTOR": "conductor",
      "----:com.apple.iTunes:REMIXER": "remixer",
      "----:com.apple.iTunes:ENGINEER": "engineer",
      "----:com.apple.iTunes:PRODUCER": "producer",
      "----:com.apple.iTunes:DJMIXER": "djmixer",
      "----:com.apple.iTunes:MIXER": "mixer",
      "----:com.apple.iTunes:LABEL": "label",
      "\xA9grp": "grouping",
      "----:com.apple.iTunes:SUBTITLE": "subtitle",
      "----:com.apple.iTunes:DISCSUBTITLE": "discsubtitle",
      cpil: "compilation",
      tmpo: "bpm",
      "----:com.apple.iTunes:MOOD": "mood",
      "----:com.apple.iTunes:MEDIA": "media",
      "----:com.apple.iTunes:CATALOGNUMBER": "catalognumber",
      tvsh: "tvShow",
      tvsn: "tvSeason",
      tves: "tvEpisode",
      sosn: "tvShowSort",
      tven: "tvEpisodeId",
      tvnn: "tvNetwork",
      pcst: "podcast",
      purl: "podcasturl",
      "----:com.apple.iTunes:MusicBrainz Album Status": "releasestatus",
      "----:com.apple.iTunes:MusicBrainz Album Type": "releasetype",
      "----:com.apple.iTunes:MusicBrainz Album Release Country": "releasecountry",
      "----:com.apple.iTunes:SCRIPT": "script",
      "----:com.apple.iTunes:LANGUAGE": "language",
      cprt: "copyright",
      "\xA9cpy": "copyright",
      "----:com.apple.iTunes:LICENSE": "license",
      "\xA9too": "encodedby",
      pgap: "gapless",
      "----:com.apple.iTunes:BARCODE": "barcode",
      "----:com.apple.iTunes:ISRC": "isrc",
      "----:com.apple.iTunes:ASIN": "asin",
      "----:com.apple.iTunes:NOTES": "comment",
      "----:com.apple.iTunes:MusicBrainz Track Id": "musicbrainz_recordingid",
      "----:com.apple.iTunes:MusicBrainz Release Track Id": "musicbrainz_trackid",
      "----:com.apple.iTunes:MusicBrainz Album Id": "musicbrainz_albumid",
      "----:com.apple.iTunes:MusicBrainz Artist Id": "musicbrainz_artistid",
      "----:com.apple.iTunes:MusicBrainz Album Artist Id": "musicbrainz_albumartistid",
      "----:com.apple.iTunes:MusicBrainz Release Group Id": "musicbrainz_releasegroupid",
      "----:com.apple.iTunes:MusicBrainz Work Id": "musicbrainz_workid",
      "----:com.apple.iTunes:MusicBrainz TRM Id": "musicbrainz_trmid",
      "----:com.apple.iTunes:MusicBrainz Disc Id": "musicbrainz_discid",
      "----:com.apple.iTunes:Acoustid Id": "acoustid_id",
      "----:com.apple.iTunes:Acoustid Fingerprint": "acoustid_fingerprint",
      "----:com.apple.iTunes:MusicIP PUID": "musicip_puid",
      "----:com.apple.iTunes:fingerprint": "musicip_fingerprint",
      "----:com.apple.iTunes:replaygain_track_gain": "replaygain_track_gain",
      "----:com.apple.iTunes:replaygain_track_peak": "replaygain_track_peak",
      "----:com.apple.iTunes:replaygain_album_gain": "replaygain_album_gain",
      "----:com.apple.iTunes:replaygain_album_peak": "replaygain_album_peak",
      "----:com.apple.iTunes:replaygain_track_minmax": "replaygain_track_minmax",
      "----:com.apple.iTunes:replaygain_album_minmax": "replaygain_album_minmax",
      "----:com.apple.iTunes:replaygain_undo": "replaygain_undo",
      gnre: "genre",
      "----:com.apple.iTunes:ALBUMARTISTSORT": "albumartistsort",
      "----:com.apple.iTunes:ARTISTS": "artists",
      "----:com.apple.iTunes:ORIGINALDATE": "originaldate",
      "----:com.apple.iTunes:ORIGINALYEAR": "originalyear",
      desc: "description",
      ldes: "longDescription",
      "\xA9mvn": "movement",
      "\xA9mvi": "movementIndex",
      "\xA9mvc": "movementTotal",
      "\xA9wrk": "work",
      catg: "category",
      egid: "podcastId",
      hdvd: "hdVideo",
      keyw: "keywords",
      shwm: "showMovement",
      stik: "stik"
    };
    exports2.tagType = "iTunes";
    var MP4TagMapper = class extends CaseInsensitiveTagMap_1.CaseInsensitiveTagMap {
      constructor() {
        super([exports2.tagType], mp4TagMap);
      }
    };
    exports2.MP4TagMapper = MP4TagMapper;
  }
});

// node_modules/music-metadata/lib/ogg/vorbis/VorbisTagMapper.js
var require_VorbisTagMapper = __commonJS({
  "node_modules/music-metadata/lib/ogg/vorbis/VorbisTagMapper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.VorbisTagMapper = void 0;
    var GenericTagMapper_1 = require_GenericTagMapper();
    var vorbisTagMap = {
      TITLE: "title",
      ARTIST: "artist",
      ARTISTS: "artists",
      ALBUMARTIST: "albumartist",
      "ALBUM ARTIST": "albumartist",
      ALBUM: "album",
      DATE: "date",
      ORIGINALDATE: "originaldate",
      ORIGINALYEAR: "originalyear",
      COMMENT: "comment",
      TRACKNUMBER: "track",
      DISCNUMBER: "disk",
      GENRE: "genre",
      METADATA_BLOCK_PICTURE: "picture",
      COMPOSER: "composer",
      LYRICS: "lyrics",
      ALBUMSORT: "albumsort",
      TITLESORT: "titlesort",
      WORK: "work",
      ARTISTSORT: "artistsort",
      ALBUMARTISTSORT: "albumartistsort",
      COMPOSERSORT: "composersort",
      LYRICIST: "lyricist",
      WRITER: "writer",
      CONDUCTOR: "conductor",
      REMIXER: "remixer",
      ARRANGER: "arranger",
      ENGINEER: "engineer",
      PRODUCER: "producer",
      DJMIXER: "djmixer",
      MIXER: "mixer",
      LABEL: "label",
      GROUPING: "grouping",
      SUBTITLE: "subtitle",
      DISCSUBTITLE: "discsubtitle",
      TRACKTOTAL: "totaltracks",
      DISCTOTAL: "totaldiscs",
      COMPILATION: "compilation",
      RATING: "rating",
      BPM: "bpm",
      KEY: "key",
      MOOD: "mood",
      MEDIA: "media",
      CATALOGNUMBER: "catalognumber",
      RELEASESTATUS: "releasestatus",
      RELEASETYPE: "releasetype",
      RELEASECOUNTRY: "releasecountry",
      SCRIPT: "script",
      LANGUAGE: "language",
      COPYRIGHT: "copyright",
      LICENSE: "license",
      ENCODEDBY: "encodedby",
      ENCODERSETTINGS: "encodersettings",
      BARCODE: "barcode",
      ISRC: "isrc",
      ASIN: "asin",
      MUSICBRAINZ_TRACKID: "musicbrainz_recordingid",
      MUSICBRAINZ_RELEASETRACKID: "musicbrainz_trackid",
      MUSICBRAINZ_ALBUMID: "musicbrainz_albumid",
      MUSICBRAINZ_ARTISTID: "musicbrainz_artistid",
      MUSICBRAINZ_ALBUMARTISTID: "musicbrainz_albumartistid",
      MUSICBRAINZ_RELEASEGROUPID: "musicbrainz_releasegroupid",
      MUSICBRAINZ_WORKID: "musicbrainz_workid",
      MUSICBRAINZ_TRMID: "musicbrainz_trmid",
      MUSICBRAINZ_DISCID: "musicbrainz_discid",
      ACOUSTID_ID: "acoustid_id",
      ACOUSTID_ID_FINGERPRINT: "acoustid_fingerprint",
      MUSICIP_PUID: "musicip_puid",
      WEBSITE: "website",
      NOTES: "notes",
      TOTALTRACKS: "totaltracks",
      TOTALDISCS: "totaldiscs",
      DISCOGS_ARTIST_ID: "discogs_artist_id",
      DISCOGS_ARTISTS: "artists",
      DISCOGS_ARTIST_NAME: "artists",
      DISCOGS_ALBUM_ARTISTS: "albumartist",
      DISCOGS_CATALOG: "catalognumber",
      DISCOGS_COUNTRY: "releasecountry",
      DISCOGS_DATE: "originaldate",
      DISCOGS_LABEL: "label",
      DISCOGS_LABEL_ID: "discogs_label_id",
      DISCOGS_MASTER_RELEASE_ID: "discogs_master_release_id",
      DISCOGS_RATING: "discogs_rating",
      DISCOGS_RELEASED: "date",
      DISCOGS_RELEASE_ID: "discogs_release_id",
      DISCOGS_VOTES: "discogs_votes",
      CATALOGID: "catalognumber",
      STYLE: "genre",
      REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
      REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
      REPLAYGAIN_ALBUM_GAIN: "replaygain_album_gain",
      REPLAYGAIN_ALBUM_PEAK: "replaygain_album_peak",
      REPLAYGAIN_MINMAX: "replaygain_track_minmax",
      REPLAYGAIN_ALBUM_MINMAX: "replaygain_album_minmax",
      REPLAYGAIN_UNDO: "replaygain_undo"
    };
    var VorbisTagMapper = class extends GenericTagMapper_1.CommonTagMapper {
      static toRating(email, rating) {
        return {
          source: email ? email.toLowerCase() : email,
          rating: parseFloat(rating) * GenericTagMapper_1.CommonTagMapper.maxRatingScore
        };
      }
      constructor() {
        super(["vorbis"], vorbisTagMap);
      }
      postMap(tag) {
        if (tag.id.indexOf("RATING:") === 0) {
          const keys = tag.id.split(":");
          tag.value = VorbisTagMapper.toRating(keys[1], tag.value);
          tag.id = keys[0];
        }
      }
    };
    exports2.VorbisTagMapper = VorbisTagMapper;
  }
});

// node_modules/music-metadata/lib/riff/RiffInfoTagMap.js
var require_RiffInfoTagMap = __commonJS({
  "node_modules/music-metadata/lib/riff/RiffInfoTagMap.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.RiffInfoTagMapper = exports2.riffInfoTagMap = void 0;
    var GenericTagMapper_1 = require_GenericTagMapper();
    exports2.riffInfoTagMap = {
      IART: "artist",
      ICRD: "date",
      INAM: "title",
      TITL: "title",
      IPRD: "album",
      ITRK: "track",
      COMM: "comment",
      ICMT: "comment",
      ICNT: "releasecountry",
      GNRE: "genre",
      IWRI: "writer",
      RATE: "rating",
      YEAR: "year",
      ISFT: "encodedby",
      CODE: "encodedby",
      TURL: "website",
      IGNR: "genre",
      IENG: "engineer",
      ITCH: "technician",
      IMED: "media",
      IRPD: "album"
    };
    var RiffInfoTagMapper = class extends GenericTagMapper_1.CommonTagMapper {
      constructor() {
        super(["exif"], exports2.riffInfoTagMap);
      }
    };
    exports2.RiffInfoTagMapper = RiffInfoTagMapper;
  }
});

// node_modules/music-metadata/lib/matroska/MatroskaTagMapper.js
var require_MatroskaTagMapper = __commonJS({
  "node_modules/music-metadata/lib/matroska/MatroskaTagMapper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.MatroskaTagMapper = void 0;
    var CaseInsensitiveTagMap_1 = require_CaseInsensitiveTagMap();
    var ebmlTagMap = {
      "segment:title": "title",
      "album:ARITST": "albumartist",
      "album:ARITSTSORT": "albumartistsort",
      "album:TITLE": "album",
      "album:DATE_RECORDED": "originaldate",
      "track:ARTIST": "artist",
      "track:ARTISTSORT": "artistsort",
      "track:TITLE": "title",
      "track:PART_NUMBER": "track",
      "track:MUSICBRAINZ_TRACKID": "musicbrainz_recordingid",
      "track:MUSICBRAINZ_ALBUMID": "musicbrainz_albumid",
      "track:MUSICBRAINZ_ARTISTID": "musicbrainz_artistid",
      "track:PUBLISHER": "label",
      picture: "picture"
    };
    var MatroskaTagMapper = class extends CaseInsensitiveTagMap_1.CaseInsensitiveTagMap {
      constructor() {
        super(["matroska"], ebmlTagMap);
      }
    };
    exports2.MatroskaTagMapper = MatroskaTagMapper;
  }
});

// node_modules/music-metadata/lib/common/CombinedTagMapper.js
var require_CombinedTagMapper = __commonJS({
  "node_modules/music-metadata/lib/common/CombinedTagMapper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.CombinedTagMapper = void 0;
    var ID3v1TagMap_1 = require_ID3v1TagMap();
    var ID3v24TagMapper_1 = require_ID3v24TagMapper();
    var AsfTagMapper_1 = require_AsfTagMapper();
    var ID3v22TagMapper_1 = require_ID3v22TagMapper();
    var APEv2TagMapper_1 = require_APEv2TagMapper();
    var MP4TagMapper_1 = require_MP4TagMapper();
    var VorbisTagMapper_1 = require_VorbisTagMapper();
    var RiffInfoTagMap_1 = require_RiffInfoTagMap();
    var MatroskaTagMapper_1 = require_MatroskaTagMapper();
    var CombinedTagMapper = class {
      constructor() {
        this.tagMappers = {};
        [
          new ID3v1TagMap_1.ID3v1TagMapper(),
          new ID3v22TagMapper_1.ID3v22TagMapper(),
          new ID3v24TagMapper_1.ID3v24TagMapper(),
          new MP4TagMapper_1.MP4TagMapper(),
          new MP4TagMapper_1.MP4TagMapper(),
          new VorbisTagMapper_1.VorbisTagMapper(),
          new APEv2TagMapper_1.APEv2TagMapper(),
          new AsfTagMapper_1.AsfTagMapper(),
          new RiffInfoTagMap_1.RiffInfoTagMapper(),
          new MatroskaTagMapper_1.MatroskaTagMapper()
        ].forEach((mapper) => {
          this.registerTagMapper(mapper);
        });
      }
      mapTag(tagType, tag, warnings) {
        const tagMapper = this.tagMappers[tagType];
        if (tagMapper) {
          return this.tagMappers[tagType].mapGenericTag(tag, warnings);
        }
        throw new Error("No generic tag mapper defined for tag-format: " + tagType);
      }
      registerTagMapper(genericTagMapper) {
        for (const tagType of genericTagMapper.tagTypes) {
          this.tagMappers[tagType] = genericTagMapper;
        }
      }
    };
    exports2.CombinedTagMapper = CombinedTagMapper;
  }
});

// node_modules/music-metadata/lib/common/MetadataCollector.js
var require_MetadataCollector = __commonJS({
  "node_modules/music-metadata/lib/common/MetadataCollector.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.joinArtists = exports2.MetadataCollector = void 0;
    var type_1 = require_type();
    var _debug = require_src();
    var GenericTagTypes_1 = require_GenericTagTypes();
    var CombinedTagMapper_1 = require_CombinedTagMapper();
    var GenericTagMapper_1 = require_GenericTagMapper();
    var Util_1 = require_Util();
    var FileType = require_core2();
    var debug = _debug("music-metadata:collector");
    var TagPriority = ["matroska", "APEv2", "vorbis", "ID3v2.4", "ID3v2.3", "ID3v2.2", "exif", "asf", "iTunes", "ID3v1"];
    var MetadataCollector = class {
      constructor(opts) {
        this.opts = opts;
        this.format = {
          tagTypes: [],
          trackInfo: []
        };
        this.native = {};
        this.common = {
          track: {no: null, of: null},
          disk: {no: null, of: null},
          movementIndex: {}
        };
        this.quality = {
          warnings: []
        };
        this.commonOrigin = {};
        this.originPriority = {};
        this.tagMapper = new CombinedTagMapper_1.CombinedTagMapper();
        let priority = 1;
        for (const tagType of TagPriority) {
          this.originPriority[tagType] = priority++;
        }
        this.originPriority.artificial = 500;
        this.originPriority.id3v1 = 600;
      }
      hasAny() {
        return Object.keys(this.native).length > 0;
      }
      addStreamInfo(streamInfo) {
        debug(`streamInfo: type=${type_1.TrackType[streamInfo.type]}, codec=${streamInfo.codecName}`);
        this.format.trackInfo.push(streamInfo);
      }
      setFormat(key, value) {
        debug(`format: ${key} = ${value}`);
        this.format[key] = value;
        if (this.opts.observer) {
          this.opts.observer({metadata: this, tag: {type: "format", id: key, value}});
        }
      }
      addTag(tagType, tagId, value) {
        debug(`tag ${tagType}.${tagId} = ${value}`);
        if (!this.native[tagType]) {
          this.format.tagTypes.push(tagType);
          this.native[tagType] = [];
        }
        this.native[tagType].push({id: tagId, value});
        this.toCommon(tagType, tagId, value);
      }
      addWarning(warning) {
        this.quality.warnings.push({message: warning});
      }
      postMap(tagType, tag) {
        switch (tag.id) {
          case "artist":
            if (this.commonOrigin.artist === this.originPriority[tagType]) {
              return this.postMap("artificial", {id: "artists", value: tag.value});
            }
            if (!this.common.artists) {
              this.setGenericTag("artificial", {id: "artists", value: tag.value});
            }
            break;
          case "artists":
            if (!this.common.artist || this.commonOrigin.artist === this.originPriority.artificial) {
              if (!this.common.artists || this.common.artists.indexOf(tag.value) === -1) {
                const artists = (this.common.artists || []).concat([tag.value]);
                const value = joinArtists(artists);
                const artistTag = {id: "artist", value};
                this.setGenericTag("artificial", artistTag);
              }
            }
            break;
          case "picture":
            this.postFixPicture(tag.value).then((picture) => {
              if (picture !== null) {
                tag.value = picture;
                this.setGenericTag(tagType, tag);
              }
            });
            return;
          case "totaltracks":
            this.common.track.of = GenericTagMapper_1.CommonTagMapper.toIntOrNull(tag.value);
            return;
          case "totaldiscs":
            this.common.disk.of = GenericTagMapper_1.CommonTagMapper.toIntOrNull(tag.value);
            return;
          case "movementTotal":
            this.common.movementIndex.of = GenericTagMapper_1.CommonTagMapper.toIntOrNull(tag.value);
            return;
          case "track":
          case "disk":
          case "movementIndex":
            const of = this.common[tag.id].of;
            this.common[tag.id] = GenericTagMapper_1.CommonTagMapper.normalizeTrack(tag.value);
            this.common[tag.id].of = of != null ? of : this.common[tag.id].of;
            return;
          case "year":
          case "originalyear":
            tag.value = parseInt(tag.value, 10);
            break;
          case "date":
            const year = parseInt(tag.value.substr(0, 4), 10);
            if (!isNaN(year)) {
              this.common.year = year;
            }
            break;
          case "discogs_label_id":
          case "discogs_release_id":
          case "discogs_master_release_id":
          case "discogs_artist_id":
          case "discogs_votes":
            tag.value = typeof tag.value === "string" ? parseInt(tag.value, 10) : tag.value;
            break;
          case "replaygain_track_gain":
          case "replaygain_track_peak":
          case "replaygain_album_gain":
          case "replaygain_album_peak":
            tag.value = Util_1.toRatio(tag.value);
            break;
          case "replaygain_track_minmax":
            tag.value = tag.value.split(",").map((v) => parseInt(v, 10));
            break;
          case "replaygain_undo":
            const minMix = tag.value.split(",").map((v) => parseInt(v, 10));
            tag.value = {
              leftChannel: minMix[0],
              rightChannel: minMix[1]
            };
            break;
          case "gapless":
          case "compilation":
          case "podcast":
          case "showMovement":
            tag.value = tag.value === "1" || tag.value === 1;
            break;
          case "isrc":
            if (this.common[tag.id] && this.common[tag.id].indexOf(tag.value) !== -1)
              return;
            break;
          default:
        }
        if (tag.value !== null) {
          this.setGenericTag(tagType, tag);
        }
      }
      toCommonMetadata() {
        return {
          format: this.format,
          native: this.native,
          quality: this.quality,
          common: this.common
        };
      }
      async postFixPicture(picture) {
        if (picture.data && picture.data.length > 0) {
          if (!picture.format) {
            const fileType2 = await FileType.fromBuffer(picture.data);
            if (fileType2) {
              picture.format = fileType2.mime;
            } else {
              return null;
            }
          }
          picture.format = picture.format.toLocaleLowerCase();
          switch (picture.format) {
            case "image/jpg":
              picture.format = "image/jpeg";
          }
          return picture;
        }
        this.addWarning(`Empty picture tag found`);
        return null;
      }
      toCommon(tagType, tagId, value) {
        const tag = {id: tagId, value};
        const genericTag = this.tagMapper.mapTag(tagType, tag, this);
        if (genericTag) {
          this.postMap(tagType, genericTag);
        }
      }
      setGenericTag(tagType, tag) {
        debug(`common.${tag.id} = ${tag.value}`);
        const prio0 = this.commonOrigin[tag.id] || 1e3;
        const prio1 = this.originPriority[tagType];
        if (GenericTagTypes_1.isSingleton(tag.id)) {
          if (prio1 <= prio0) {
            this.common[tag.id] = tag.value;
            this.commonOrigin[tag.id] = prio1;
          } else {
            return debug(`Ignore native tag (singleton): ${tagType}.${tag.id} = ${tag.value}`);
          }
        } else {
          if (prio1 === prio0) {
            if (!GenericTagTypes_1.isUnique(tag.id) || this.common[tag.id].indexOf(tag.value) === -1) {
              this.common[tag.id].push(tag.value);
            } else {
              debug(`Ignore duplicate value: ${tagType}.${tag.id} = ${tag.value}`);
            }
          } else if (prio1 < prio0) {
            this.common[tag.id] = [tag.value];
            this.commonOrigin[tag.id] = prio1;
          } else {
            return debug(`Ignore native tag (list): ${tagType}.${tag.id} = ${tag.value}`);
          }
        }
        if (this.opts.observer) {
          this.opts.observer({metadata: this, tag: {type: "common", id: tag.id, value: tag.value}});
        }
      }
    };
    exports2.MetadataCollector = MetadataCollector;
    function joinArtists(artists) {
      if (artists.length > 2) {
        return artists.slice(0, artists.length - 1).join(", ") + " & " + artists[artists.length - 1];
      }
      return artists.join(" & ");
    }
    exports2.joinArtists = joinArtists;
  }
});

// node_modules/music-metadata/lib/id3v2/ID3v2Token.js
var require_ID3v2Token = __commonJS({
  "node_modules/music-metadata/lib/id3v2/ID3v2Token.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.TextEncodingToken = exports2.ExtendedHeader = exports2.ID3v2Header = exports2.UINT32SYNCSAFE = exports2.AttachedPictureType = void 0;
    var Token2 = require_lib3();
    var Util_1 = require_Util();
    var AttachedPictureType;
    (function(AttachedPictureType2) {
      AttachedPictureType2[AttachedPictureType2["Other"] = 0] = "Other";
      AttachedPictureType2[AttachedPictureType2["32x32 pixels 'file icon' (PNG only)"] = 1] = "32x32 pixels 'file icon' (PNG only)";
      AttachedPictureType2[AttachedPictureType2["Other file icon"] = 2] = "Other file icon";
      AttachedPictureType2[AttachedPictureType2["Cover (front)"] = 3] = "Cover (front)";
      AttachedPictureType2[AttachedPictureType2["Cover (back)"] = 4] = "Cover (back)";
      AttachedPictureType2[AttachedPictureType2["Leaflet page"] = 5] = "Leaflet page";
      AttachedPictureType2[AttachedPictureType2["Media (e.g. label side of CD)"] = 6] = "Media (e.g. label side of CD)";
      AttachedPictureType2[AttachedPictureType2["Lead artist/lead performer/soloist"] = 7] = "Lead artist/lead performer/soloist";
      AttachedPictureType2[AttachedPictureType2["Artist/performer"] = 8] = "Artist/performer";
      AttachedPictureType2[AttachedPictureType2["Conductor"] = 9] = "Conductor";
      AttachedPictureType2[AttachedPictureType2["Band/Orchestra"] = 10] = "Band/Orchestra";
      AttachedPictureType2[AttachedPictureType2["Composer"] = 11] = "Composer";
      AttachedPictureType2[AttachedPictureType2["Lyricist/text writer"] = 12] = "Lyricist/text writer";
      AttachedPictureType2[AttachedPictureType2["Recording Location"] = 13] = "Recording Location";
      AttachedPictureType2[AttachedPictureType2["During recording"] = 14] = "During recording";
      AttachedPictureType2[AttachedPictureType2["During performance"] = 15] = "During performance";
      AttachedPictureType2[AttachedPictureType2["Movie/video screen capture"] = 16] = "Movie/video screen capture";
      AttachedPictureType2[AttachedPictureType2["A bright coloured fish"] = 17] = "A bright coloured fish";
      AttachedPictureType2[AttachedPictureType2["Illustration"] = 18] = "Illustration";
      AttachedPictureType2[AttachedPictureType2["Band/artist logotype"] = 19] = "Band/artist logotype";
      AttachedPictureType2[AttachedPictureType2["Publisher/Studio logotype"] = 20] = "Publisher/Studio logotype";
    })(AttachedPictureType = exports2.AttachedPictureType || (exports2.AttachedPictureType = {}));
    exports2.UINT32SYNCSAFE = {
      get: (buf, off) => {
        return buf[off + 3] & 127 | buf[off + 2] << 7 | buf[off + 1] << 14 | buf[off] << 21;
      },
      len: 4
    };
    exports2.ID3v2Header = {
      len: 10,
      get: (buf, off) => {
        return {
          fileIdentifier: new Token2.StringType(3, "ascii").get(buf, off),
          version: {
            major: Token2.INT8.get(buf, off + 3),
            revision: Token2.INT8.get(buf, off + 4)
          },
          flags: {
            unsynchronisation: Util_1.default.strtokBITSET.get(buf, off + 5, 7),
            isExtendedHeader: Util_1.default.strtokBITSET.get(buf, off + 5, 6),
            expIndicator: Util_1.default.strtokBITSET.get(buf, off + 5, 5),
            footer: Util_1.default.strtokBITSET.get(buf, off + 5, 4)
          },
          size: exports2.UINT32SYNCSAFE.get(buf, off + 6)
        };
      }
    };
    exports2.ExtendedHeader = {
      len: 10,
      get: (buf, off) => {
        return {
          size: Token2.UINT32_BE.get(buf, off),
          extendedFlags: Token2.UINT16_BE.get(buf, off + 4),
          sizeOfPadding: Token2.UINT32_BE.get(buf, off + 6),
          crcDataPresent: Util_1.default.strtokBITSET.get(buf, off + 4, 31)
        };
      }
    };
    exports2.TextEncodingToken = {
      len: 1,
      get: (buf, off) => {
        switch (buf.readUInt8(off)) {
          case 0:
            return {encoding: "iso-8859-1"};
          case 1:
            return {encoding: "utf16", bom: true};
          case 2:
            return {encoding: "utf16", bom: false};
          case 3:
            return {encoding: "utf8", bom: false};
          default:
            return {encoding: "utf8", bom: false};
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/common/BasicParser.js
var require_BasicParser = __commonJS({
  "node_modules/music-metadata/lib/common/BasicParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.BasicParser = void 0;
    var BasicParser = class {
      init(metadata, tokenizer, options) {
        this.metadata = metadata;
        this.tokenizer = tokenizer;
        this.options = options;
        return this;
      }
    };
    exports2.BasicParser = BasicParser;
  }
});

// node_modules/music-metadata/lib/common/FourCC.js
var require_FourCC = __commonJS({
  "node_modules/music-metadata/lib/common/FourCC.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.FourCcToken = void 0;
    var Util_1 = require_Util();
    var validFourCC = /^[\x21-\x7e??][\x20-\x7e\x00()]{3}/;
    exports2.FourCcToken = {
      len: 4,
      get: (buf, off) => {
        const id = buf.toString("binary", off, off + exports2.FourCcToken.len);
        switch (id) {
          default:
            if (!id.match(validFourCC)) {
              throw new Error(`FourCC contains invalid characters: ${Util_1.default.a2hex(id)} "${id}"`);
            }
        }
        return id;
      },
      put: (buffer, offset, id) => {
        const str = Buffer.from(id, "binary");
        if (str.length !== 4)
          throw new Error("Invalid length");
        return str.copy(buffer, offset);
      }
    };
  }
});

// node_modules/music-metadata/lib/apev2/APEv2Token.js
var require_APEv2Token = __commonJS({
  "node_modules/music-metadata/lib/apev2/APEv2Token.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.isBitSet = exports2.parseTagFlags = exports2.TagField = exports2.TagItemHeader = exports2.TagFooter = exports2.Header = exports2.DescriptorParser = exports2.DataType = void 0;
    var Token2 = require_lib3();
    var FourCC_1 = require_FourCC();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["text_utf8"] = 0] = "text_utf8";
      DataType2[DataType2["binary"] = 1] = "binary";
      DataType2[DataType2["external_info"] = 2] = "external_info";
      DataType2[DataType2["reserved"] = 3] = "reserved";
    })(DataType = exports2.DataType || (exports2.DataType = {}));
    exports2.DescriptorParser = {
      len: 52,
      get: (buf, off) => {
        return {
          ID: FourCC_1.FourCcToken.get(buf, off),
          version: Token2.UINT32_LE.get(buf, off + 4) / 1e3,
          descriptorBytes: Token2.UINT32_LE.get(buf, off + 8),
          headerBytes: Token2.UINT32_LE.get(buf, off + 12),
          seekTableBytes: Token2.UINT32_LE.get(buf, off + 16),
          headerDataBytes: Token2.UINT32_LE.get(buf, off + 20),
          apeFrameDataBytes: Token2.UINT32_LE.get(buf, off + 24),
          apeFrameDataBytesHigh: Token2.UINT32_LE.get(buf, off + 28),
          terminatingDataBytes: Token2.UINT32_LE.get(buf, off + 32),
          fileMD5: new Token2.BufferType(16).get(buf, off + 36)
        };
      }
    };
    exports2.Header = {
      len: 24,
      get: (buf, off) => {
        return {
          compressionLevel: Token2.UINT16_LE.get(buf, off),
          formatFlags: Token2.UINT16_LE.get(buf, off + 2),
          blocksPerFrame: Token2.UINT32_LE.get(buf, off + 4),
          finalFrameBlocks: Token2.UINT32_LE.get(buf, off + 8),
          totalFrames: Token2.UINT32_LE.get(buf, off + 12),
          bitsPerSample: Token2.UINT16_LE.get(buf, off + 16),
          channel: Token2.UINT16_LE.get(buf, off + 18),
          sampleRate: Token2.UINT32_LE.get(buf, off + 20)
        };
      }
    };
    exports2.TagFooter = {
      len: 32,
      get: (buf, off) => {
        return {
          ID: new Token2.StringType(8, "ascii").get(buf, off),
          version: Token2.UINT32_LE.get(buf, off + 8),
          size: Token2.UINT32_LE.get(buf, off + 12),
          fields: Token2.UINT32_LE.get(buf, off + 16),
          flags: parseTagFlags(Token2.UINT32_LE.get(buf, off + 20))
        };
      }
    };
    exports2.TagItemHeader = {
      len: 8,
      get: (buf, off) => {
        return {
          size: Token2.UINT32_LE.get(buf, off),
          flags: parseTagFlags(Token2.UINT32_LE.get(buf, off + 4))
        };
      }
    };
    var TagField = (footer) => {
      return new Token2.BufferType(footer.size - exports2.TagFooter.len);
    };
    exports2.TagField = TagField;
    function parseTagFlags(flags) {
      return {
        containsHeader: isBitSet(flags, 31),
        containsFooter: isBitSet(flags, 30),
        isHeader: isBitSet(flags, 31),
        readOnly: isBitSet(flags, 0),
        dataType: (flags & 6) >> 1
      };
    }
    exports2.parseTagFlags = parseTagFlags;
    function isBitSet(num, bit) {
      return (num & 1 << bit) !== 0;
    }
    exports2.isBitSet = isBitSet;
  }
});

// node_modules/music-metadata/lib/apev2/APEv2Parser.js
var require_APEv2Parser = __commonJS({
  "node_modules/music-metadata/lib/apev2/APEv2Parser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.APEv2Parser = void 0;
    var initDebug = require_src();
    var strtok32 = require_core();
    var Util_1 = require_Util();
    var BasicParser_1 = require_BasicParser();
    var APEv2Token_1 = require_APEv2Token();
    var token_types_1 = require_lib3();
    var debug = initDebug("music-metadata:parser:APEv2");
    var tagFormat = "APEv2";
    var preamble = "APETAGEX";
    var APEv2Parser = class extends BasicParser_1.BasicParser {
      constructor() {
        super(...arguments);
        this.ape = {};
      }
      static tryParseApeHeader(metadata, tokenizer, options) {
        const apeParser = new APEv2Parser();
        apeParser.init(metadata, tokenizer, options);
        return apeParser.tryParseApeHeader();
      }
      static calculateDuration(ah) {
        let duration = ah.totalFrames > 1 ? ah.blocksPerFrame * (ah.totalFrames - 1) : 0;
        duration += ah.finalFrameBlocks;
        return duration / ah.sampleRate;
      }
      static async findApeFooterOffset(reader, offset) {
        const apeBuf = Buffer.alloc(APEv2Token_1.TagFooter.len);
        await reader.randomRead(apeBuf, 0, APEv2Token_1.TagFooter.len, offset - APEv2Token_1.TagFooter.len);
        const tagFooter = APEv2Token_1.TagFooter.get(apeBuf, 0);
        if (tagFooter.ID === "APETAGEX") {
          debug(`APE footer header at offset=${offset}`);
          return {footer: tagFooter, offset: offset - tagFooter.size};
        }
      }
      static parseTagFooter(metadata, buffer, options) {
        const footer = APEv2Token_1.TagFooter.get(buffer, buffer.length - APEv2Token_1.TagFooter.len);
        if (footer.ID !== preamble)
          throw new Error("Unexpected APEv2 Footer ID preamble value.");
        strtok32.fromBuffer(buffer);
        const apeParser = new APEv2Parser();
        apeParser.init(metadata, strtok32.fromBuffer(buffer), options);
        return apeParser.parseTags(footer);
      }
      async tryParseApeHeader() {
        if (this.tokenizer.fileInfo.size && this.tokenizer.fileInfo.size - this.tokenizer.position < APEv2Token_1.TagFooter.len) {
          debug(`No APEv2 header found, end-of-file reached`);
          return;
        }
        const footer = await this.tokenizer.peekToken(APEv2Token_1.TagFooter);
        if (footer.ID === preamble) {
          await this.tokenizer.ignore(APEv2Token_1.TagFooter.len);
          return this.parseTags(footer);
        } else {
          debug(`APEv2 header not found at offset=${this.tokenizer.position}`);
          if (this.tokenizer.fileInfo.size) {
            const remaining = this.tokenizer.fileInfo.size - this.tokenizer.position;
            const buffer = Buffer.alloc(remaining);
            await this.tokenizer.readBuffer(buffer);
            return APEv2Parser.parseTagFooter(this.metadata, buffer, this.options);
          }
        }
      }
      async parse() {
        const descriptor = await this.tokenizer.readToken(APEv2Token_1.DescriptorParser);
        if (descriptor.ID !== "MAC ")
          throw new Error("Unexpected descriptor ID");
        this.ape.descriptor = descriptor;
        const lenExp = descriptor.descriptorBytes - APEv2Token_1.DescriptorParser.len;
        const header = await (lenExp > 0 ? this.parseDescriptorExpansion(lenExp) : this.parseHeader());
        await this.tokenizer.ignore(header.forwardBytes);
        return this.tryParseApeHeader();
      }
      async parseTags(footer) {
        const keyBuffer = Buffer.alloc(256);
        let bytesRemaining = footer.size - APEv2Token_1.TagFooter.len;
        debug(`Parse APE tags at offset=${this.tokenizer.position}, size=${bytesRemaining}`);
        for (let i = 0; i < footer.fields; i++) {
          if (bytesRemaining < APEv2Token_1.TagItemHeader.len) {
            this.metadata.addWarning(`APEv2 Tag-header: ${footer.fields - i} items remaining, but no more tag data to read.`);
            break;
          }
          const tagItemHeader = await this.tokenizer.readToken(APEv2Token_1.TagItemHeader);
          bytesRemaining -= APEv2Token_1.TagItemHeader.len + tagItemHeader.size;
          await this.tokenizer.peekBuffer(keyBuffer, {length: Math.min(keyBuffer.length, bytesRemaining)});
          let zero = Util_1.default.findZero(keyBuffer, 0, keyBuffer.length);
          const key = await this.tokenizer.readToken(new token_types_1.StringType(zero, "ascii"));
          await this.tokenizer.ignore(1);
          bytesRemaining -= key.length + 1;
          switch (tagItemHeader.flags.dataType) {
            case APEv2Token_1.DataType.text_utf8: {
              const value = await this.tokenizer.readToken(new token_types_1.StringType(tagItemHeader.size, "utf8"));
              const values = value.split(/\x00/g);
              for (const val of values) {
                this.metadata.addTag(tagFormat, key, val);
              }
              break;
            }
            case APEv2Token_1.DataType.binary:
              if (this.options.skipCovers) {
                await this.tokenizer.ignore(tagItemHeader.size);
              } else {
                const picData = Buffer.alloc(tagItemHeader.size);
                await this.tokenizer.readBuffer(picData);
                zero = Util_1.default.findZero(picData, 0, picData.length);
                const description = picData.toString("utf8", 0, zero);
                const data = Buffer.from(picData.slice(zero + 1));
                this.metadata.addTag(tagFormat, key, {
                  description,
                  data
                });
              }
              break;
            case APEv2Token_1.DataType.external_info:
              debug(`Ignore external info ${key}`);
              await this.tokenizer.ignore(tagItemHeader.size);
              break;
            default:
              throw new Error(`Unexpected data-type: ${tagItemHeader.flags.dataType}`);
          }
        }
      }
      async parseDescriptorExpansion(lenExp) {
        await this.tokenizer.ignore(lenExp);
        return this.parseHeader();
      }
      async parseHeader() {
        const header = await this.tokenizer.readToken(APEv2Token_1.Header);
        this.metadata.setFormat("lossless", true);
        this.metadata.setFormat("container", "Monkey's Audio");
        this.metadata.setFormat("bitsPerSample", header.bitsPerSample);
        this.metadata.setFormat("sampleRate", header.sampleRate);
        this.metadata.setFormat("numberOfChannels", header.channel);
        this.metadata.setFormat("duration", APEv2Parser.calculateDuration(header));
        return {
          forwardBytes: this.ape.descriptor.seekTableBytes + this.ape.descriptor.headerDataBytes + this.ape.descriptor.apeFrameDataBytes + this.ape.descriptor.terminatingDataBytes
        };
      }
    };
    exports2.APEv2Parser = APEv2Parser;
  }
});

// node_modules/music-metadata/lib/id3v1/ID3v1Parser.js
var require_ID3v1Parser = __commonJS({
  "node_modules/music-metadata/lib/id3v1/ID3v1Parser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.hasID3v1Header = exports2.ID3v1Parser = exports2.Genres = void 0;
    var initDebug = require_src();
    var Util_1 = require_Util();
    var Token2 = require_lib3();
    var BasicParser_1 = require_BasicParser();
    var APEv2Parser_1 = require_APEv2Parser();
    var debug = initDebug("music-metadata:parser:ID3v1");
    exports2.Genres = [
      "Blues",
      "Classic Rock",
      "Country",
      "Dance",
      "Disco",
      "Funk",
      "Grunge",
      "Hip-Hop",
      "Jazz",
      "Metal",
      "New Age",
      "Oldies",
      "Other",
      "Pop",
      "R&B",
      "Rap",
      "Reggae",
      "Rock",
      "Techno",
      "Industrial",
      "Alternative",
      "Ska",
      "Death Metal",
      "Pranks",
      "Soundtrack",
      "Euro-Techno",
      "Ambient",
      "Trip-Hop",
      "Vocal",
      "Jazz+Funk",
      "Fusion",
      "Trance",
      "Classical",
      "Instrumental",
      "Acid",
      "House",
      "Game",
      "Sound Clip",
      "Gospel",
      "Noise",
      "Alt. Rock",
      "Bass",
      "Soul",
      "Punk",
      "Space",
      "Meditative",
      "Instrumental Pop",
      "Instrumental Rock",
      "Ethnic",
      "Gothic",
      "Darkwave",
      "Techno-Industrial",
      "Electronic",
      "Pop-Folk",
      "Eurodance",
      "Dream",
      "Southern Rock",
      "Comedy",
      "Cult",
      "Gangsta Rap",
      "Top 40",
      "Christian Rap",
      "Pop/Funk",
      "Jungle",
      "Native American",
      "Cabaret",
      "New Wave",
      "Psychedelic",
      "Rave",
      "Showtunes",
      "Trailer",
      "Lo-Fi",
      "Tribal",
      "Acid Punk",
      "Acid Jazz",
      "Polka",
      "Retro",
      "Musical",
      "Rock & Roll",
      "Hard Rock",
      "Folk",
      "Folk/Rock",
      "National Folk",
      "Swing",
      "Fast-Fusion",
      "Bebob",
      "Latin",
      "Revival",
      "Celtic",
      "Bluegrass",
      "Avantgarde",
      "Gothic Rock",
      "Progressive Rock",
      "Psychedelic Rock",
      "Symphonic Rock",
      "Slow Rock",
      "Big Band",
      "Chorus",
      "Easy Listening",
      "Acoustic",
      "Humour",
      "Speech",
      "Chanson",
      "Opera",
      "Chamber Music",
      "Sonata",
      "Symphony",
      "Booty Bass",
      "Primus",
      "Porn Groove",
      "Satire",
      "Slow Jam",
      "Club",
      "Tango",
      "Samba",
      "Folklore",
      "Ballad",
      "Power Ballad",
      "Rhythmic Soul",
      "Freestyle",
      "Duet",
      "Punk Rock",
      "Drum Solo",
      "A Cappella",
      "Euro-House",
      "Dance Hall",
      "Goa",
      "Drum & Bass",
      "Club-House",
      "Hardcore",
      "Terror",
      "Indie",
      "BritPop",
      "Negerpunk",
      "Polsk Punk",
      "Beat",
      "Christian Gangsta Rap",
      "Heavy Metal",
      "Black Metal",
      "Crossover",
      "Contemporary Christian",
      "Christian Rock",
      "Merengue",
      "Salsa",
      "Thrash Metal",
      "Anime",
      "JPop",
      "Synthpop",
      "Abstract",
      "Art Rock",
      "Baroque",
      "Bhangra",
      "Big Beat",
      "Breakbeat",
      "Chillout",
      "Downtempo",
      "Dub",
      "EBM",
      "Eclectic",
      "Electro",
      "Electroclash",
      "Emo",
      "Experimental",
      "Garage",
      "Global",
      "IDM",
      "Illbient",
      "Industro-Goth",
      "Jam Band",
      "Krautrock",
      "Leftfield",
      "Lounge",
      "Math Rock",
      "New Romantic",
      "Nu-Breakz",
      "Post-Punk",
      "Post-Rock",
      "Psytrance",
      "Shoegaze",
      "Space Rock",
      "Trop Rock",
      "World Music",
      "Neoclassical",
      "Audiobook",
      "Audio Theatre",
      "Neue Deutsche Welle",
      "Podcast",
      "Indie Rock",
      "G-Funk",
      "Dubstep",
      "Garage Rock",
      "Psybient"
    ];
    var Iid3v1Token = {
      len: 128,
      get: (buf, off) => {
        const header = new Id3v1StringType(3).get(buf, off);
        return header === "TAG" ? {
          header,
          title: new Id3v1StringType(30).get(buf, off + 3),
          artist: new Id3v1StringType(30).get(buf, off + 33),
          album: new Id3v1StringType(30).get(buf, off + 63),
          year: new Id3v1StringType(4).get(buf, off + 93),
          comment: new Id3v1StringType(28).get(buf, off + 97),
          zeroByte: Token2.UINT8.get(buf, off + 127),
          track: Token2.UINT8.get(buf, off + 126),
          genre: Token2.UINT8.get(buf, off + 127)
        } : null;
      }
    };
    var Id3v1StringType = class extends Token2.StringType {
      constructor(len) {
        super(len, "binary");
      }
      get(buf, off) {
        let value = super.get(buf, off);
        value = Util_1.default.trimRightNull(value);
        value = value.trim();
        return value.length > 0 ? value : void 0;
      }
    };
    var ID3v1Parser = class extends BasicParser_1.BasicParser {
      static getGenre(genreIndex) {
        if (genreIndex < exports2.Genres.length) {
          return exports2.Genres[genreIndex];
        }
        return void 0;
      }
      async parse() {
        if (!this.tokenizer.fileInfo.size) {
          debug("Skip checking for ID3v1 because the file-size is unknown");
          return;
        }
        if (this.options.apeHeader) {
          this.tokenizer.ignore(this.options.apeHeader.offset - this.tokenizer.position);
          const apeParser = new APEv2Parser_1.APEv2Parser();
          apeParser.init(this.metadata, this.tokenizer, this.options);
          await apeParser.parseTags(this.options.apeHeader.footer);
        }
        const offset = this.tokenizer.fileInfo.size - Iid3v1Token.len;
        if (this.tokenizer.position > offset) {
          debug("Already consumed the last 128 bytes");
          return;
        }
        const header = await this.tokenizer.readToken(Iid3v1Token, offset);
        if (header) {
          debug("ID3v1 header found at: pos=%s", this.tokenizer.fileInfo.size - Iid3v1Token.len);
          for (const id of ["title", "artist", "album", "comment", "track", "year"]) {
            if (header[id] && header[id] !== "")
              this.addTag(id, header[id]);
          }
          const genre = ID3v1Parser.getGenre(header.genre);
          if (genre)
            this.addTag("genre", genre);
        } else {
          debug("ID3v1 header not found at: pos=%s", this.tokenizer.fileInfo.size - Iid3v1Token.len);
        }
      }
      addTag(id, value) {
        this.metadata.addTag("ID3v1", id, value);
      }
    };
    exports2.ID3v1Parser = ID3v1Parser;
    async function hasID3v1Header(reader) {
      if (reader.fileSize >= 128) {
        const tag = Buffer.alloc(3);
        await reader.randomRead(tag, 0, tag.length, reader.fileSize - 128);
        return tag.toString("binary") === "TAG";
      }
      return false;
    }
    exports2.hasID3v1Header = hasID3v1Header;
  }
});

// node_modules/music-metadata/lib/id3v2/FrameParser.js
var require_FrameParser = __commonJS({
  "node_modules/music-metadata/lib/id3v2/FrameParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.FrameParser = exports2.parseGenre = void 0;
    var initDebug = require_src();
    var Token2 = require_lib3();
    var Util_1 = require_Util();
    var ID3v2Token_1 = require_ID3v2Token();
    var ID3v1Parser_1 = require_ID3v1Parser();
    var debug = initDebug("music-metadata:id3v2:frame-parser");
    var defaultEnc = "iso-8859-1";
    function parseGenre(origVal) {
      const genres = [];
      let code;
      let word = "";
      for (const c of origVal) {
        if (typeof code === "string") {
          if (c === "(" && code === "") {
            word += "(";
            code = void 0;
          } else if (c === ")") {
            if (word !== "") {
              genres.push(word);
              word = "";
            }
            const genre = parseGenreCode(code);
            if (genre) {
              genres.push(genre);
            }
            code = void 0;
          } else
            code += c;
        } else if (c === "(") {
          code = "";
        } else {
          word += c;
        }
      }
      if (word) {
        if (genres.length === 0 && word.match(/^\d*$/)) {
          word = ID3v1Parser_1.Genres[word];
        }
        genres.push(word);
      }
      return genres;
    }
    exports2.parseGenre = parseGenre;
    function parseGenreCode(code) {
      if (code === "RX")
        return "Remix";
      if (code === "CR")
        return "Cover";
      if (code.match(/^\d*$/)) {
        return ID3v1Parser_1.Genres[code];
      }
    }
    var FrameParser = class {
      constructor(major, warningCollector) {
        this.major = major;
        this.warningCollector = warningCollector;
      }
      readData(b, type, includeCovers) {
        if (b.length === 0) {
          this.warningCollector.addWarning(`id3v2.${this.major} header has empty tag type=${type}`);
          return;
        }
        const {encoding, bom} = ID3v2Token_1.TextEncodingToken.get(b, 0);
        const length = b.length;
        let offset = 0;
        let output = [];
        const nullTerminatorLength = FrameParser.getNullTerminatorLength(encoding);
        let fzero;
        const out = {};
        debug(`Parsing tag type=${type}, encoding=${encoding}, bom=${bom}`);
        switch (type !== "TXXX" && type[0] === "T" ? "T*" : type) {
          case "T*":
          case "IPLS":
          case "MVIN":
          case "MVNM":
          case "PCS":
          case "PCST":
            const text = Util_1.default.decodeString(b.slice(1), encoding).replace(/\x00+$/, "");
            switch (type) {
              case "TMCL":
              case "TIPL":
              case "IPLS":
                output = this.splitValue(type, text);
                output = FrameParser.functionList(output);
                break;
              case "TRK":
              case "TRCK":
              case "TPOS":
                output = text;
                break;
              case "TCOM":
              case "TEXT":
              case "TOLY":
              case "TOPE":
              case "TPE1":
              case "TSRC":
                output = this.splitValue(type, text);
                break;
              case "TCO":
              case "TCON":
                output = this.splitValue(type, text).map((v) => parseGenre(v)).reduce((acc, val) => acc.concat(val), []);
                break;
              case "PCS":
              case "PCST":
                output = this.major >= 4 ? this.splitValue(type, text) : [text];
                output = Array.isArray(output) && output[0] === "" ? 1 : 0;
                break;
              default:
                output = this.major >= 4 ? this.splitValue(type, text) : [text];
            }
            break;
          case "TXXX":
            output = FrameParser.readIdentifierAndData(b, offset + 1, length, encoding);
            output = {
              description: output.id,
              text: this.splitValue(type, Util_1.default.decodeString(output.data, encoding).replace(/\x00+$/, ""))
            };
            break;
          case "PIC":
          case "APIC":
            if (includeCovers) {
              const pic = {};
              offset += 1;
              switch (this.major) {
                case 2:
                  pic.format = Util_1.default.decodeString(b.slice(offset, offset + 3), "iso-8859-1");
                  offset += 3;
                  break;
                case 3:
                case 4:
                  fzero = Util_1.default.findZero(b, offset, length, defaultEnc);
                  pic.format = Util_1.default.decodeString(b.slice(offset, fzero), defaultEnc);
                  offset = fzero + 1;
                  break;
                default:
                  throw new Error("Warning: unexpected major versionIndex: " + this.major);
              }
              pic.format = FrameParser.fixPictureMimeType(pic.format);
              pic.type = ID3v2Token_1.AttachedPictureType[b[offset]];
              offset += 1;
              fzero = Util_1.default.findZero(b, offset, length, encoding);
              pic.description = Util_1.default.decodeString(b.slice(offset, fzero), encoding);
              offset = fzero + nullTerminatorLength;
              pic.data = Buffer.from(b.slice(offset, length));
              output = pic;
            }
            break;
          case "CNT":
          case "PCNT":
            output = Token2.UINT32_BE.get(b, 0);
            break;
          case "SYLT":
            offset += 7;
            output = [];
            while (offset < length) {
              const txt = b.slice(offset, offset = Util_1.default.findZero(b, offset, length, encoding));
              offset += 5;
              output.push(Util_1.default.decodeString(txt, encoding));
            }
            break;
          case "ULT":
          case "USLT":
          case "COM":
          case "COMM":
            offset += 1;
            out.language = Util_1.default.decodeString(b.slice(offset, offset + 3), defaultEnc);
            offset += 3;
            fzero = Util_1.default.findZero(b, offset, length, encoding);
            out.description = Util_1.default.decodeString(b.slice(offset, fzero), encoding);
            offset = fzero + nullTerminatorLength;
            out.text = Util_1.default.decodeString(b.slice(offset, length), encoding).replace(/\x00+$/, "");
            output = [out];
            break;
          case "UFID":
            output = FrameParser.readIdentifierAndData(b, offset, length, defaultEnc);
            output = {owner_identifier: output.id, identifier: output.data};
            break;
          case "PRIV":
            output = FrameParser.readIdentifierAndData(b, offset, length, defaultEnc);
            output = {owner_identifier: output.id, data: output.data};
            break;
          case "POPM":
            fzero = Util_1.default.findZero(b, offset, length, defaultEnc);
            const email = Util_1.default.decodeString(b.slice(offset, fzero), defaultEnc);
            offset = fzero + 1;
            const dataLen = length - offset;
            output = {
              email,
              rating: b.readUInt8(offset),
              counter: dataLen >= 5 ? b.readUInt32BE(offset + 1) : void 0
            };
            break;
          case "GEOB": {
            fzero = Util_1.default.findZero(b, offset + 1, length, encoding);
            const mimeType = Util_1.default.decodeString(b.slice(offset + 1, fzero), defaultEnc);
            offset = fzero + 1;
            fzero = Util_1.default.findZero(b, offset, length - offset, encoding);
            const filename = Util_1.default.decodeString(b.slice(offset, fzero), defaultEnc);
            offset = fzero + 1;
            fzero = Util_1.default.findZero(b, offset, length - offset, encoding);
            const description = Util_1.default.decodeString(b.slice(offset, fzero), defaultEnc);
            output = {
              type: mimeType,
              filename,
              description,
              data: b.slice(offset + 1, length)
            };
            break;
          }
          case "WCOM":
          case "WCOP":
          case "WOAF":
          case "WOAR":
          case "WOAS":
          case "WORS":
          case "WPAY":
          case "WPUB":
            output = Util_1.default.decodeString(b.slice(offset, fzero), defaultEnc);
            break;
          case "WXXX": {
            fzero = Util_1.default.findZero(b, offset + 1, length, encoding);
            const description = Util_1.default.decodeString(b.slice(offset + 1, fzero), encoding);
            offset = fzero + (encoding === "utf16" ? 2 : 1);
            output = {description, url: Util_1.default.decodeString(b.slice(offset, length), defaultEnc)};
            break;
          }
          case "WFD":
          case "WFED":
            output = Util_1.default.decodeString(b.slice(offset + 1, Util_1.default.findZero(b, offset + 1, length, encoding)), encoding);
            break;
          case "MCDI": {
            output = b.slice(0, length);
            break;
          }
          default:
            debug("Warning: unsupported id3v2-tag-type: " + type);
            break;
        }
        return output;
      }
      static fixPictureMimeType(pictureType) {
        pictureType = pictureType.toLocaleLowerCase();
        switch (pictureType) {
          case "jpg":
            return "image/jpeg";
          case "png":
            return "image/png";
        }
        return pictureType;
      }
      static functionList(entries) {
        const res = {};
        for (let i = 0; i + 1 < entries.length; i += 2) {
          const names = entries[i + 1].split(",");
          res[entries[i]] = res.hasOwnProperty(entries[i]) ? res[entries[i]].concat(names) : names;
        }
        return res;
      }
      splitValue(tag, text) {
        let values;
        if (this.major < 4) {
          values = text.split(/\x00/g);
          if (values.length > 1) {
            this.warningCollector.addWarning(`ID3v2.${this.major} ${tag} uses non standard null-separator.`);
          } else {
            values = text.split(/\//g);
          }
        } else {
          values = text.split(/\x00/g);
        }
        return FrameParser.trimArray(values);
      }
      static trimArray(values) {
        return values.map((value) => value.replace(/\x00+$/, "").trim());
      }
      static readIdentifierAndData(b, offset, length, encoding) {
        const fzero = Util_1.default.findZero(b, offset, length, encoding);
        const id = Util_1.default.decodeString(b.slice(offset, fzero), encoding);
        offset = fzero + FrameParser.getNullTerminatorLength(encoding);
        return {id, data: b.slice(offset, length)};
      }
      static getNullTerminatorLength(enc) {
        return enc === "utf16" ? 2 : 1;
      }
    };
    exports2.FrameParser = FrameParser;
  }
});

// node_modules/music-metadata/lib/id3v2/ID3v2Parser.js
var require_ID3v2Parser = __commonJS({
  "node_modules/music-metadata/lib/id3v2/ID3v2Parser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ID3v2Parser = void 0;
    var Token2 = require_lib3();
    var Util_1 = require_Util();
    var FrameParser_1 = require_FrameParser();
    var ID3v2Token_1 = require_ID3v2Token();
    var ID3v2Parser = class {
      static removeUnsyncBytes(buffer) {
        let readI = 0;
        let writeI = 0;
        while (readI < buffer.length - 1) {
          if (readI !== writeI) {
            buffer[writeI] = buffer[readI];
          }
          readI += buffer[readI] === 255 && buffer[readI + 1] === 0 ? 2 : 1;
          writeI++;
        }
        if (readI < buffer.length) {
          buffer[writeI++] = buffer[readI];
        }
        return buffer.slice(0, writeI);
      }
      static getFrameHeaderLength(majorVer) {
        switch (majorVer) {
          case 2:
            return 6;
          case 3:
          case 4:
            return 10;
          default:
            throw new Error("header versionIndex is incorrect");
        }
      }
      static readFrameFlags(b) {
        return {
          status: {
            tag_alter_preservation: Util_1.default.strtokBITSET.get(b, 0, 6),
            file_alter_preservation: Util_1.default.strtokBITSET.get(b, 0, 5),
            read_only: Util_1.default.strtokBITSET.get(b, 0, 4)
          },
          format: {
            grouping_identity: Util_1.default.strtokBITSET.get(b, 1, 7),
            compression: Util_1.default.strtokBITSET.get(b, 1, 3),
            encryption: Util_1.default.strtokBITSET.get(b, 1, 2),
            unsynchronisation: Util_1.default.strtokBITSET.get(b, 1, 1),
            data_length_indicator: Util_1.default.strtokBITSET.get(b, 1, 0)
          }
        };
      }
      static readFrameData(buf, frameHeader, majorVer, includeCovers, warningCollector) {
        const frameParser = new FrameParser_1.FrameParser(majorVer, warningCollector);
        switch (majorVer) {
          case 2:
            return frameParser.readData(buf, frameHeader.id, includeCovers);
          case 3:
          case 4:
            if (frameHeader.flags.format.unsynchronisation) {
              buf = ID3v2Parser.removeUnsyncBytes(buf);
            }
            if (frameHeader.flags.format.data_length_indicator) {
              buf = buf.slice(4, buf.length);
            }
            return frameParser.readData(buf, frameHeader.id, includeCovers);
          default:
            throw new Error("Unexpected majorVer: " + majorVer);
        }
      }
      static makeDescriptionTagName(tag, description) {
        return tag + (description ? ":" + description : "");
      }
      async parse(metadata, tokenizer, options) {
        this.tokenizer = tokenizer;
        this.metadata = metadata;
        this.options = options;
        const id3Header = await this.tokenizer.readToken(ID3v2Token_1.ID3v2Header);
        if (id3Header.fileIdentifier !== "ID3") {
          throw new Error("expected ID3-header file-identifier 'ID3' was not found");
        }
        this.id3Header = id3Header;
        this.headerType = "ID3v2." + id3Header.version.major;
        if (id3Header.flags.isExtendedHeader) {
          return this.parseExtendedHeader();
        } else {
          return this.parseId3Data(id3Header.size);
        }
      }
      async parseExtendedHeader() {
        const extendedHeader = await this.tokenizer.readToken(ID3v2Token_1.ExtendedHeader);
        const dataRemaining = extendedHeader.size - ID3v2Token_1.ExtendedHeader.len;
        if (dataRemaining > 0) {
          return this.parseExtendedHeaderData(dataRemaining, extendedHeader.size);
        } else {
          return this.parseId3Data(this.id3Header.size - extendedHeader.size);
        }
      }
      async parseExtendedHeaderData(dataRemaining, extendedHeaderSize) {
        const buffer = Buffer.alloc(dataRemaining);
        await this.tokenizer.readBuffer(buffer, {length: dataRemaining});
        return this.parseId3Data(this.id3Header.size - extendedHeaderSize);
      }
      async parseId3Data(dataLen) {
        const buffer = Buffer.alloc(dataLen);
        await this.tokenizer.readBuffer(buffer, {length: dataLen});
        for (const tag of this.parseMetadata(buffer)) {
          if (tag.id === "TXXX") {
            if (tag.value) {
              for (const text of tag.value.text) {
                this.addTag(ID3v2Parser.makeDescriptionTagName(tag.id, tag.value.description), text);
              }
            }
          } else if (tag.id === "COM") {
            for (const value of tag.value) {
              this.addTag(ID3v2Parser.makeDescriptionTagName(tag.id, value.description), value.text);
            }
          } else if (tag.id === "COMM") {
            for (const value of tag.value) {
              this.addTag(ID3v2Parser.makeDescriptionTagName(tag.id, value.description), value);
            }
          } else if (Array.isArray(tag.value)) {
            for (const value of tag.value) {
              this.addTag(tag.id, value);
            }
          } else {
            this.addTag(tag.id, tag.value);
          }
        }
      }
      addTag(id, value) {
        this.metadata.addTag(this.headerType, id, value);
      }
      parseMetadata(data) {
        let offset = 0;
        const tags = [];
        while (true) {
          if (offset === data.length)
            break;
          const frameHeaderLength = ID3v2Parser.getFrameHeaderLength(this.id3Header.version.major);
          if (offset + frameHeaderLength > data.length) {
            this.metadata.addWarning("Illegal ID3v2 tag length");
            break;
          }
          const frameHeaderBytes = data.slice(offset, offset += frameHeaderLength);
          const frameHeader = this.readFrameHeader(frameHeaderBytes, this.id3Header.version.major);
          const frameDataBytes = data.slice(offset, offset += frameHeader.length);
          const values = ID3v2Parser.readFrameData(frameDataBytes, frameHeader, this.id3Header.version.major, !this.options.skipCovers, this.metadata);
          if (values) {
            tags.push({id: frameHeader.id, value: values});
          }
        }
        return tags;
      }
      readFrameHeader(v, majorVer) {
        let header;
        switch (majorVer) {
          case 2:
            header = {
              id: v.toString("ascii", 0, 3),
              length: Token2.UINT24_BE.get(v, 3)
            };
            if (!header.id.match(/[A-Z0-9]{3}/g)) {
              this.metadata.addWarning(`Invalid ID3v2.${this.id3Header.version.major} frame-header-ID: ${header.id}`);
            }
            break;
          case 3:
          case 4:
            header = {
              id: v.toString("ascii", 0, 4),
              length: (majorVer === 4 ? ID3v2Token_1.UINT32SYNCSAFE : Token2.UINT32_BE).get(v, 4),
              flags: ID3v2Parser.readFrameFlags(v.slice(8, 10))
            };
            if (!header.id.match(/[A-Z0-9]{4}/g)) {
              this.metadata.addWarning(`Invalid ID3v2.${this.id3Header.version.major} frame-header-ID: ${header.id}`);
            }
            break;
          default:
            throw new Error("Unexpected majorVer: " + majorVer);
        }
        return header;
      }
    };
    exports2.ID3v2Parser = ID3v2Parser;
  }
});

// node_modules/music-metadata/lib/aiff/AiffToken.js
var require_AiffToken = __commonJS({
  "node_modules/music-metadata/lib/aiff/AiffToken.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.Common = void 0;
    var Token2 = require_lib3();
    var FourCC_1 = require_FourCC();
    var Common = class {
      constructor(header, isAifc) {
        this.isAifc = isAifc;
        const minimumChunkSize = isAifc ? 22 : 18;
        if (header.chunkSize < minimumChunkSize)
          throw new Error(`COMMON CHUNK size should always be at least ${minimumChunkSize}`);
        this.len = header.chunkSize;
      }
      get(buf, off) {
        const shift = buf.readUInt16BE(off + 8) - 16398;
        const baseSampleRate = buf.readUInt16BE(off + 8 + 2);
        const res = {
          numChannels: buf.readUInt16BE(off),
          numSampleFrames: buf.readUInt32BE(off + 2),
          sampleSize: buf.readUInt16BE(off + 6),
          sampleRate: shift < 0 ? baseSampleRate >> Math.abs(shift) : baseSampleRate << shift
        };
        if (this.isAifc) {
          res.compressionType = FourCC_1.FourCcToken.get(buf, off + 18);
          if (this.len > 22) {
            const strLen = buf.readInt8(off + 22);
            const padding = (strLen + 1) % 2;
            if (23 + strLen + padding === this.len) {
              res.compressionName = new Token2.StringType(strLen, "binary").get(buf, off + 23);
            } else {
              throw new Error("Illegal pstring length");
            }
          }
        } else {
          res.compressionName = "PCM";
        }
        return res;
      }
    };
    exports2.Common = Common;
  }
});

// node_modules/music-metadata/lib/iff/index.js
var require_iff = __commonJS({
  "node_modules/music-metadata/lib/iff/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.Header = void 0;
    var FourCC_1 = require_FourCC();
    exports2.Header = {
      len: 8,
      get: (buf, off) => {
        return {
          chunkID: FourCC_1.FourCcToken.get(buf, off),
          chunkSize: buf.readUInt32BE(off + 4)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/aiff/AiffParser.js
var require_AiffParser = __commonJS({
  "node_modules/music-metadata/lib/aiff/AiffParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.AIFFParser = void 0;
    var Token2 = require_lib3();
    var initDebug = require_src();
    var strtok32 = require_core();
    var ID3v2Parser_1 = require_ID3v2Parser();
    var FourCC_1 = require_FourCC();
    var BasicParser_1 = require_BasicParser();
    var AiffToken = require_AiffToken();
    var iff = require_iff();
    var debug = initDebug("music-metadata:parser:aiff");
    var AIFFParser = class extends BasicParser_1.BasicParser {
      async parse() {
        const header = await this.tokenizer.readToken(iff.Header);
        if (header.chunkID !== "FORM")
          throw new Error("Invalid Chunk-ID, expected 'FORM'");
        const type = await this.tokenizer.readToken(FourCC_1.FourCcToken);
        switch (type) {
          case "AIFF":
            this.metadata.setFormat("container", type);
            this.isCompressed = false;
            break;
          case "AIFC":
            this.metadata.setFormat("container", "AIFF-C");
            this.isCompressed = true;
            break;
          default:
            throw Error("Unsupported AIFF type: " + type);
        }
        this.metadata.setFormat("lossless", !this.isCompressed);
        try {
          while (!this.tokenizer.fileInfo.size || this.tokenizer.fileInfo.size - this.tokenizer.position >= iff.Header.len) {
            debug("Reading AIFF chunk at offset=" + this.tokenizer.position);
            const chunkHeader = await this.tokenizer.readToken(iff.Header);
            debug(`Chunk id=${chunkHeader.chunkID}`);
            const nextChunk = 2 * Math.round(chunkHeader.chunkSize / 2);
            const bytesRead = await this.readData(chunkHeader);
            await this.tokenizer.ignore(nextChunk - bytesRead);
          }
        } catch (err) {
          if (err instanceof strtok32.EndOfStreamError) {
            debug(`End-of-stream`);
          } else {
            throw err;
          }
        }
      }
      async readData(header) {
        switch (header.chunkID) {
          case "COMM":
            const common = await this.tokenizer.readToken(new AiffToken.Common(header, this.isCompressed));
            this.metadata.setFormat("bitsPerSample", common.sampleSize);
            this.metadata.setFormat("sampleRate", common.sampleRate);
            this.metadata.setFormat("numberOfChannels", common.numChannels);
            this.metadata.setFormat("numberOfSamples", common.numSampleFrames);
            this.metadata.setFormat("duration", common.numSampleFrames / common.sampleRate);
            this.metadata.setFormat("codec", common.compressionName);
            return header.chunkSize;
          case "ID3 ":
            const id3_data = await this.tokenizer.readToken(new Token2.BufferType(header.chunkSize));
            const rst = strtok32.fromBuffer(id3_data);
            await new ID3v2Parser_1.ID3v2Parser().parse(this.metadata, rst, this.options);
            return header.chunkSize;
          case "SSND":
            if (this.metadata.format.duration) {
              this.metadata.setFormat("bitrate", 8 * header.chunkSize / this.metadata.format.duration);
            }
            return 0;
          default:
            return 0;
        }
      }
    };
    exports2.AIFFParser = AIFFParser;
  }
});

// node_modules/music-metadata/lib/asf/GUID.js
var require_GUID = __commonJS({
  "node_modules/music-metadata/lib/asf/GUID.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var GUID = class {
      constructor(str) {
        this.str = str;
      }
      static fromBin(bin, offset = 0) {
        return new GUID(this.decode(bin, offset));
      }
      static decode(objectId, offset = 0) {
        const guid = objectId.readUInt32LE(offset).toString(16) + "-" + objectId.readUInt16LE(offset + 4).toString(16) + "-" + objectId.readUInt16LE(offset + 6).toString(16) + "-" + objectId.readUInt16BE(offset + 8).toString(16) + "-" + objectId.slice(offset + 10, offset + 16).toString("hex");
        return guid.toUpperCase();
      }
      static decodeMediaType(mediaType) {
        switch (mediaType.str) {
          case GUID.AudioMedia.str:
            return "audio";
          case GUID.VideoMedia.str:
            return "video";
          case GUID.CommandMedia.str:
            return "command";
          case GUID.Degradable_JPEG_Media.str:
            return "degradable-jpeg";
          case GUID.FileTransferMedia.str:
            return "file-transfer";
          case GUID.BinaryMedia.str:
            return "binary";
        }
      }
      static encode(str) {
        const bin = Buffer.alloc(16);
        bin.writeUInt32LE(parseInt(str.slice(0, 8), 16), 0);
        bin.writeUInt16LE(parseInt(str.slice(9, 13), 16), 4);
        bin.writeUInt16LE(parseInt(str.slice(14, 18), 16), 6);
        Buffer.from(str.slice(19, 23), "hex").copy(bin, 8);
        Buffer.from(str.slice(24), "hex").copy(bin, 10);
        return bin;
      }
      equals(guid) {
        return this.str === guid.str;
      }
      toBin() {
        return GUID.encode(this.str);
      }
    };
    exports2.default = GUID;
    GUID.HeaderObject = new GUID("75B22630-668E-11CF-A6D9-00AA0062CE6C");
    GUID.DataObject = new GUID("75B22636-668E-11CF-A6D9-00AA0062CE6C");
    GUID.SimpleIndexObject = new GUID("33000890-E5B1-11CF-89F4-00A0C90349CB");
    GUID.IndexObject = new GUID("D6E229D3-35DA-11D1-9034-00A0C90349BE");
    GUID.MediaObjectIndexObject = new GUID("FEB103F8-12AD-4C64-840F-2A1D2F7AD48C");
    GUID.TimecodeIndexObject = new GUID("3CB73FD0-0C4A-4803-953D-EDF7B6228F0C");
    GUID.FilePropertiesObject = new GUID("8CABDCA1-A947-11CF-8EE4-00C00C205365");
    GUID.StreamPropertiesObject = new GUID("B7DC0791-A9B7-11CF-8EE6-00C00C205365");
    GUID.HeaderExtensionObject = new GUID("5FBF03B5-A92E-11CF-8EE3-00C00C205365");
    GUID.CodecListObject = new GUID("86D15240-311D-11D0-A3A4-00A0C90348F6");
    GUID.ScriptCommandObject = new GUID("1EFB1A30-0B62-11D0-A39B-00A0C90348F6");
    GUID.MarkerObject = new GUID("F487CD01-A951-11CF-8EE6-00C00C205365");
    GUID.BitrateMutualExclusionObject = new GUID("D6E229DC-35DA-11D1-9034-00A0C90349BE");
    GUID.ErrorCorrectionObject = new GUID("75B22635-668E-11CF-A6D9-00AA0062CE6C");
    GUID.ContentDescriptionObject = new GUID("75B22633-668E-11CF-A6D9-00AA0062CE6C");
    GUID.ExtendedContentDescriptionObject = new GUID("D2D0A440-E307-11D2-97F0-00A0C95EA850");
    GUID.ContentBrandingObject = new GUID("2211B3FA-BD23-11D2-B4B7-00A0C955FC6E");
    GUID.StreamBitratePropertiesObject = new GUID("7BF875CE-468D-11D1-8D82-006097C9A2B2");
    GUID.ContentEncryptionObject = new GUID("2211B3FB-BD23-11D2-B4B7-00A0C955FC6E");
    GUID.ExtendedContentEncryptionObject = new GUID("298AE614-2622-4C17-B935-DAE07EE9289C");
    GUID.DigitalSignatureObject = new GUID("2211B3FC-BD23-11D2-B4B7-00A0C955FC6E");
    GUID.PaddingObject = new GUID("1806D474-CADF-4509-A4BA-9AABCB96AAE8");
    GUID.ExtendedStreamPropertiesObject = new GUID("14E6A5CB-C672-4332-8399-A96952065B5A");
    GUID.AdvancedMutualExclusionObject = new GUID("A08649CF-4775-4670-8A16-6E35357566CD");
    GUID.GroupMutualExclusionObject = new GUID("D1465A40-5A79-4338-B71B-E36B8FD6C249");
    GUID.StreamPrioritizationObject = new GUID("D4FED15B-88D3-454F-81F0-ED5C45999E24");
    GUID.BandwidthSharingObject = new GUID("A69609E6-517B-11D2-B6AF-00C04FD908E9");
    GUID.LanguageListObject = new GUID("7C4346A9-EFE0-4BFC-B229-393EDE415C85");
    GUID.MetadataObject = new GUID("C5F8CBEA-5BAF-4877-8467-AA8C44FA4CCA");
    GUID.MetadataLibraryObject = new GUID("44231C94-9498-49D1-A141-1D134E457054");
    GUID.IndexParametersObject = new GUID("D6E229DF-35DA-11D1-9034-00A0C90349BE");
    GUID.MediaObjectIndexParametersObject = new GUID("6B203BAD-3F11-48E4-ACA8-D7613DE2CFA7");
    GUID.TimecodeIndexParametersObject = new GUID("F55E496D-9797-4B5D-8C8B-604DFE9BFB24");
    GUID.CompatibilityObject = new GUID("26F18B5D-4584-47EC-9F5F-0E651F0452C9");
    GUID.AdvancedContentEncryptionObject = new GUID("43058533-6981-49E6-9B74-AD12CB86D58C");
    GUID.AudioMedia = new GUID("F8699E40-5B4D-11CF-A8FD-00805F5C442B");
    GUID.VideoMedia = new GUID("BC19EFC0-5B4D-11CF-A8FD-00805F5C442B");
    GUID.CommandMedia = new GUID("59DACFC0-59E6-11D0-A3AC-00A0C90348F6");
    GUID.JFIF_Media = new GUID("B61BE100-5B4E-11CF-A8FD-00805F5C442B");
    GUID.Degradable_JPEG_Media = new GUID("35907DE0-E415-11CF-A917-00805F5C442B");
    GUID.FileTransferMedia = new GUID("91BD222C-F21C-497A-8B6D-5AA86BFC0185");
    GUID.BinaryMedia = new GUID("3AFB65E2-47EF-40F2-AC2C-70A90D71D343");
    GUID.ASF_Index_Placeholder_Object = new GUID("D9AADE20-7C17-4F9C-BC28-8555DD98E2A2");
  }
});

// node_modules/music-metadata/lib/asf/AsfUtil.js
var require_AsfUtil = __commonJS({
  "node_modules/music-metadata/lib/asf/AsfUtil.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.AsfUtil = void 0;
    var Util_1 = require_Util();
    var Token2 = require_lib3();
    var AsfUtil = class {
      static getParserForAttr(i) {
        return AsfUtil.attributeParsers[i];
      }
      static parseUnicodeAttr(buf) {
        return Util_1.default.stripNulls(Util_1.default.decodeString(buf, "utf16le"));
      }
      static parseByteArrayAttr(buf) {
        const newBuf = Buffer.alloc(buf.length);
        buf.copy(newBuf);
        return newBuf;
      }
      static parseBoolAttr(buf, offset = 0) {
        return AsfUtil.parseWordAttr(buf, offset) === 1;
      }
      static parseDWordAttr(buf, offset = 0) {
        return buf.readUInt32LE(offset);
      }
      static parseQWordAttr(buf, offset = 0) {
        return Token2.UINT64_LE.get(buf, offset);
      }
      static parseWordAttr(buf, offset = 0) {
        return buf.readUInt16LE(offset);
      }
    };
    exports2.AsfUtil = AsfUtil;
    AsfUtil.attributeParsers = [
      AsfUtil.parseUnicodeAttr,
      AsfUtil.parseByteArrayAttr,
      AsfUtil.parseBoolAttr,
      AsfUtil.parseDWordAttr,
      AsfUtil.parseQWordAttr,
      AsfUtil.parseWordAttr,
      AsfUtil.parseByteArrayAttr
    ];
  }
});

// node_modules/music-metadata/lib/asf/AsfObject.js
var require_AsfObject = __commonJS({
  "node_modules/music-metadata/lib/asf/AsfObject.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.WmPictureToken = exports2.MetadataLibraryObjectState = exports2.MetadataObjectState = exports2.ExtendedStreamPropertiesObjectState = exports2.ExtendedContentDescriptionObjectState = exports2.ContentDescriptionObjectState = exports2.readCodecEntries = exports2.HeaderExtensionObject = exports2.StreamPropertiesObject = exports2.FilePropertiesObject = exports2.IgnoreObjectState = exports2.State = exports2.HeaderObjectToken = exports2.TopLevelHeaderObjectToken = exports2.DataType = void 0;
    var Util_1 = require_Util();
    var Token2 = require_lib3();
    var GUID_1 = require_GUID();
    var AsfUtil_1 = require_AsfUtil();
    var ID3v2Token_1 = require_ID3v2Token();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["UnicodeString"] = 0] = "UnicodeString";
      DataType2[DataType2["ByteArray"] = 1] = "ByteArray";
      DataType2[DataType2["Bool"] = 2] = "Bool";
      DataType2[DataType2["DWord"] = 3] = "DWord";
      DataType2[DataType2["QWord"] = 4] = "QWord";
      DataType2[DataType2["Word"] = 5] = "Word";
    })(DataType = exports2.DataType || (exports2.DataType = {}));
    exports2.TopLevelHeaderObjectToken = {
      len: 30,
      get: (buf, off) => {
        return {
          objectId: GUID_1.default.fromBin(new Token2.BufferType(16).get(buf, off)),
          objectSize: Token2.UINT64_LE.get(buf, off + 16),
          numberOfHeaderObjects: Token2.UINT32_LE.get(buf, off + 24)
        };
      }
    };
    exports2.HeaderObjectToken = {
      len: 24,
      get: (buf, off) => {
        return {
          objectId: GUID_1.default.fromBin(new Token2.BufferType(16).get(buf, off)),
          objectSize: Token2.UINT64_LE.get(buf, off + 16)
        };
      }
    };
    var State = class {
      constructor(header) {
        this.len = header.objectSize - exports2.HeaderObjectToken.len;
      }
      postProcessTag(tags, name, valueType, data) {
        if (name === "WM/Picture") {
          tags.push({id: name, value: WmPictureToken.fromBuffer(data)});
        } else {
          const parseAttr = AsfUtil_1.AsfUtil.getParserForAttr(valueType);
          if (!parseAttr) {
            throw new Error("unexpected value headerType: " + valueType);
          }
          tags.push({id: name, value: parseAttr(data)});
        }
      }
    };
    exports2.State = State;
    var IgnoreObjectState = class extends State {
      constructor(header) {
        super(header);
      }
      get(buf, off) {
        return null;
      }
    };
    exports2.IgnoreObjectState = IgnoreObjectState;
    var FilePropertiesObject = class extends State {
      constructor(header) {
        super(header);
      }
      get(buf, off) {
        return {
          fileId: GUID_1.default.fromBin(buf, off),
          fileSize: Token2.UINT64_LE.get(buf, off + 16),
          creationDate: Token2.UINT64_LE.get(buf, off + 24),
          dataPacketsCount: Token2.UINT64_LE.get(buf, off + 32),
          playDuration: Token2.UINT64_LE.get(buf, off + 40),
          sendDuration: Token2.UINT64_LE.get(buf, off + 48),
          preroll: Token2.UINT64_LE.get(buf, off + 56),
          flags: {
            broadcast: Util_1.default.strtokBITSET.get(buf, off + 64, 24),
            seekable: Util_1.default.strtokBITSET.get(buf, off + 64, 25)
          },
          minimumDataPacketSize: Token2.UINT32_LE.get(buf, off + 68),
          maximumDataPacketSize: Token2.UINT32_LE.get(buf, off + 72),
          maximumBitrate: Token2.UINT32_LE.get(buf, off + 76)
        };
      }
    };
    exports2.FilePropertiesObject = FilePropertiesObject;
    FilePropertiesObject.guid = GUID_1.default.FilePropertiesObject;
    var StreamPropertiesObject = class extends State {
      constructor(header) {
        super(header);
      }
      get(buf, off) {
        return {
          streamType: GUID_1.default.decodeMediaType(GUID_1.default.fromBin(buf, off)),
          errorCorrectionType: GUID_1.default.fromBin(buf, off + 8)
        };
      }
    };
    exports2.StreamPropertiesObject = StreamPropertiesObject;
    StreamPropertiesObject.guid = GUID_1.default.StreamPropertiesObject;
    var HeaderExtensionObject = class {
      constructor() {
        this.len = 22;
      }
      get(buf, off) {
        return {
          reserved1: GUID_1.default.fromBin(buf, off),
          reserved2: buf.readUInt16LE(off + 16),
          extensionDataSize: buf.readUInt32LE(off + 18)
        };
      }
    };
    exports2.HeaderExtensionObject = HeaderExtensionObject;
    HeaderExtensionObject.guid = GUID_1.default.HeaderExtensionObject;
    var CodecListObjectHeader = {
      len: 20,
      get: (buf, off) => {
        return {
          entryCount: buf.readUInt16LE(off + 16)
        };
      }
    };
    async function readString(tokenizer) {
      const length = await tokenizer.readNumber(Token2.UINT16_LE);
      return (await tokenizer.readToken(new Token2.StringType(length * 2, "utf16le"))).replace("\0", "");
    }
    async function readCodecEntries(tokenizer) {
      const codecHeader = await tokenizer.readToken(CodecListObjectHeader);
      const entries = [];
      for (let i = 0; i < codecHeader.entryCount; ++i) {
        entries.push(await readCodecEntry(tokenizer));
      }
      return entries;
    }
    exports2.readCodecEntries = readCodecEntries;
    async function readInformation(tokenizer) {
      const length = await tokenizer.readNumber(Token2.UINT16_LE);
      const buf = Buffer.alloc(length);
      await tokenizer.readBuffer(buf);
      return buf;
    }
    async function readCodecEntry(tokenizer) {
      const type = await tokenizer.readNumber(Token2.UINT16_LE);
      return {
        type: {
          videoCodec: (type & 1) === 1,
          audioCodec: (type & 2) === 2
        },
        codecName: await readString(tokenizer),
        description: await readString(tokenizer),
        information: await readInformation(tokenizer)
      };
    }
    var ContentDescriptionObjectState = class extends State {
      constructor(header) {
        super(header);
      }
      get(buf, off) {
        const tags = [];
        let pos = off + 10;
        for (let i = 0; i < ContentDescriptionObjectState.contentDescTags.length; ++i) {
          const length = buf.readUInt16LE(off + i * 2);
          if (length > 0) {
            const tagName = ContentDescriptionObjectState.contentDescTags[i];
            const end = pos + length;
            tags.push({id: tagName, value: AsfUtil_1.AsfUtil.parseUnicodeAttr(buf.slice(pos, end))});
            pos = end;
          }
        }
        return tags;
      }
    };
    exports2.ContentDescriptionObjectState = ContentDescriptionObjectState;
    ContentDescriptionObjectState.guid = GUID_1.default.ContentDescriptionObject;
    ContentDescriptionObjectState.contentDescTags = ["Title", "Author", "Copyright", "Description", "Rating"];
    var ExtendedContentDescriptionObjectState = class extends State {
      constructor(header) {
        super(header);
      }
      get(buf, off) {
        const tags = [];
        const attrCount = buf.readUInt16LE(off);
        let pos = off + 2;
        for (let i = 0; i < attrCount; i += 1) {
          const nameLen = buf.readUInt16LE(pos);
          pos += 2;
          const name = AsfUtil_1.AsfUtil.parseUnicodeAttr(buf.slice(pos, pos + nameLen));
          pos += nameLen;
          const valueType = buf.readUInt16LE(pos);
          pos += 2;
          const valueLen = buf.readUInt16LE(pos);
          pos += 2;
          const value = buf.slice(pos, pos + valueLen);
          pos += valueLen;
          this.postProcessTag(tags, name, valueType, value);
        }
        return tags;
      }
    };
    exports2.ExtendedContentDescriptionObjectState = ExtendedContentDescriptionObjectState;
    ExtendedContentDescriptionObjectState.guid = GUID_1.default.ExtendedContentDescriptionObject;
    var ExtendedStreamPropertiesObjectState = class extends State {
      constructor(header) {
        super(header);
      }
      get(buf, off) {
        return {
          startTime: Token2.UINT64_LE.get(buf, off),
          endTime: Token2.UINT64_LE.get(buf, off + 8),
          dataBitrate: buf.readInt32LE(off + 12),
          bufferSize: buf.readInt32LE(off + 16),
          initialBufferFullness: buf.readInt32LE(off + 20),
          alternateDataBitrate: buf.readInt32LE(off + 24),
          alternateBufferSize: buf.readInt32LE(off + 28),
          alternateInitialBufferFullness: buf.readInt32LE(off + 32),
          maximumObjectSize: buf.readInt32LE(off + 36),
          flags: {
            reliableFlag: Util_1.default.strtokBITSET.get(buf, off + 40, 0),
            seekableFlag: Util_1.default.strtokBITSET.get(buf, off + 40, 1),
            resendLiveCleanpointsFlag: Util_1.default.strtokBITSET.get(buf, off + 40, 2)
          },
          streamNumber: buf.readInt16LE(off + 42),
          streamLanguageId: buf.readInt16LE(off + 44),
          averageTimePerFrame: buf.readInt32LE(off + 52),
          streamNameCount: buf.readInt32LE(off + 54),
          payloadExtensionSystems: buf.readInt32LE(off + 56),
          streamNames: [],
          streamPropertiesObject: null
        };
      }
    };
    exports2.ExtendedStreamPropertiesObjectState = ExtendedStreamPropertiesObjectState;
    ExtendedStreamPropertiesObjectState.guid = GUID_1.default.ExtendedStreamPropertiesObject;
    var MetadataObjectState = class extends State {
      constructor(header) {
        super(header);
      }
      get(buf, off) {
        const tags = [];
        const descriptionRecordsCount = buf.readUInt16LE(off);
        let pos = off + 2;
        for (let i = 0; i < descriptionRecordsCount; i += 1) {
          pos += 4;
          const nameLen = buf.readUInt16LE(pos);
          pos += 2;
          const dataType = buf.readUInt16LE(pos);
          pos += 2;
          const dataLen = buf.readUInt32LE(pos);
          pos += 4;
          const name = AsfUtil_1.AsfUtil.parseUnicodeAttr(buf.slice(pos, pos + nameLen));
          pos += nameLen;
          const data = buf.slice(pos, pos + dataLen);
          pos += dataLen;
          const parseAttr = AsfUtil_1.AsfUtil.getParserForAttr(dataType);
          if (!parseAttr) {
            throw new Error("unexpected value headerType: " + dataType);
          }
          this.postProcessTag(tags, name, dataType, data);
        }
        return tags;
      }
    };
    exports2.MetadataObjectState = MetadataObjectState;
    MetadataObjectState.guid = GUID_1.default.MetadataObject;
    var MetadataLibraryObjectState = class extends MetadataObjectState {
      constructor(header) {
        super(header);
      }
    };
    exports2.MetadataLibraryObjectState = MetadataLibraryObjectState;
    MetadataLibraryObjectState.guid = GUID_1.default.MetadataLibraryObject;
    var WmPictureToken = class {
      constructor(len) {
        this.len = len;
      }
      static fromBase64(base64str) {
        return this.fromBuffer(Buffer.from(base64str, "base64"));
      }
      static fromBuffer(buffer) {
        const pic = new WmPictureToken(buffer.length);
        return pic.get(buffer, 0);
      }
      get(buffer, offset) {
        const typeId = buffer.readUInt8(offset++);
        const size = buffer.readInt32LE(offset);
        let index = 5;
        while (buffer.readUInt16BE(index) !== 0) {
          index += 2;
        }
        const format = buffer.slice(5, index).toString("utf16le");
        while (buffer.readUInt16BE(index) !== 0) {
          index += 2;
        }
        const description = buffer.slice(5, index).toString("utf16le");
        return {
          type: ID3v2Token_1.AttachedPictureType[typeId],
          format,
          description,
          size,
          data: buffer.slice(index + 4)
        };
      }
    };
    exports2.WmPictureToken = WmPictureToken;
  }
});

// node_modules/music-metadata/lib/asf/AsfParser.js
var require_AsfParser = __commonJS({
  "node_modules/music-metadata/lib/asf/AsfParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.AsfParser = void 0;
    var type_1 = require_type();
    var GUID_1 = require_GUID();
    var AsfObject = require_AsfObject();
    var _debug = require_src();
    var BasicParser_1 = require_BasicParser();
    var debug = _debug("music-metadata:parser:ASF");
    var headerType = "asf";
    var AsfParser = class extends BasicParser_1.BasicParser {
      async parse() {
        const header = await this.tokenizer.readToken(AsfObject.TopLevelHeaderObjectToken);
        if (!header.objectId.equals(GUID_1.default.HeaderObject)) {
          throw new Error("expected asf header; but was not found; got: " + header.objectId.str);
        }
        try {
          await this.parseObjectHeader(header.numberOfHeaderObjects);
        } catch (err) {
          debug("Error while parsing ASF: %s", err);
        }
      }
      async parseObjectHeader(numberOfObjectHeaders) {
        let tags;
        do {
          const header = await this.tokenizer.readToken(AsfObject.HeaderObjectToken);
          debug("header GUID=%s", header.objectId.str);
          switch (header.objectId.str) {
            case AsfObject.FilePropertiesObject.guid.str:
              const fpo = await this.tokenizer.readToken(new AsfObject.FilePropertiesObject(header));
              this.metadata.setFormat("duration", fpo.playDuration / 1e7 - fpo.preroll / 1e3);
              this.metadata.setFormat("bitrate", fpo.maximumBitrate);
              break;
            case AsfObject.StreamPropertiesObject.guid.str:
              const spo = await this.tokenizer.readToken(new AsfObject.StreamPropertiesObject(header));
              this.metadata.setFormat("container", "ASF/" + spo.streamType);
              break;
            case AsfObject.HeaderExtensionObject.guid.str:
              const extHeader = await this.tokenizer.readToken(new AsfObject.HeaderExtensionObject());
              await this.parseExtensionObject(extHeader.extensionDataSize);
              break;
            case AsfObject.ContentDescriptionObjectState.guid.str:
              tags = await this.tokenizer.readToken(new AsfObject.ContentDescriptionObjectState(header));
              this.addTags(tags);
              break;
            case AsfObject.ExtendedContentDescriptionObjectState.guid.str:
              tags = await this.tokenizer.readToken(new AsfObject.ExtendedContentDescriptionObjectState(header));
              this.addTags(tags);
              break;
            case GUID_1.default.CodecListObject.str:
              const codecs = await AsfObject.readCodecEntries(this.tokenizer);
              codecs.forEach((codec) => {
                this.metadata.addStreamInfo({
                  type: codec.type.videoCodec ? type_1.TrackType.video : type_1.TrackType.audio,
                  codecName: codec.codecName
                });
              });
              const audioCodecs = codecs.filter((codec) => codec.type.audioCodec).map((codec) => codec.codecName).join("/");
              this.metadata.setFormat("codec", audioCodecs);
              break;
            case GUID_1.default.StreamBitratePropertiesObject.str:
              await this.tokenizer.ignore(header.objectSize - AsfObject.HeaderObjectToken.len);
              break;
            case GUID_1.default.PaddingObject.str:
              debug("Padding: %s bytes", header.objectSize - AsfObject.HeaderObjectToken.len);
              await this.tokenizer.ignore(header.objectSize - AsfObject.HeaderObjectToken.len);
              break;
            default:
              this.metadata.addWarning("Ignore ASF-Object-GUID: " + header.objectId.str);
              debug("Ignore ASF-Object-GUID: %s", header.objectId.str);
              await this.tokenizer.readToken(new AsfObject.IgnoreObjectState(header));
          }
        } while (--numberOfObjectHeaders);
      }
      addTags(tags) {
        tags.forEach((tag) => {
          this.metadata.addTag(headerType, tag.id, tag.value);
        });
      }
      async parseExtensionObject(extensionSize) {
        do {
          const header = await this.tokenizer.readToken(AsfObject.HeaderObjectToken);
          switch (header.objectId.str) {
            case AsfObject.ExtendedStreamPropertiesObjectState.guid.str:
              await this.tokenizer.readToken(new AsfObject.ExtendedStreamPropertiesObjectState(header));
              break;
            case AsfObject.MetadataObjectState.guid.str:
              const moTags = await this.tokenizer.readToken(new AsfObject.MetadataObjectState(header));
              this.addTags(moTags);
              break;
            case AsfObject.MetadataLibraryObjectState.guid.str:
              const mlTags = await this.tokenizer.readToken(new AsfObject.MetadataLibraryObjectState(header));
              this.addTags(mlTags);
              break;
            case GUID_1.default.PaddingObject.str:
              await this.tokenizer.ignore(header.objectSize - AsfObject.HeaderObjectToken.len);
              break;
            case GUID_1.default.CompatibilityObject.str:
              this.tokenizer.ignore(header.objectSize - AsfObject.HeaderObjectToken.len);
              break;
            case GUID_1.default.ASF_Index_Placeholder_Object.str:
              await this.tokenizer.ignore(header.objectSize - AsfObject.HeaderObjectToken.len);
              break;
            default:
              this.metadata.addWarning("Ignore ASF-Object-GUID: " + header.objectId.str);
              await this.tokenizer.readToken(new AsfObject.IgnoreObjectState(header));
              break;
          }
          extensionSize -= header.objectSize;
        } while (extensionSize > 0);
      }
    };
    exports2.AsfParser = AsfParser;
  }
});

// node_modules/music-metadata/lib/ogg/vorbis/Vorbis.js
var require_Vorbis = __commonJS({
  "node_modules/music-metadata/lib/ogg/vorbis/Vorbis.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.IdentificationHeader = exports2.CommonHeader = exports2.VorbisPictureToken = void 0;
    var Token2 = require_lib3();
    var ID3v2Token_1 = require_ID3v2Token();
    var VorbisPictureToken = class {
      constructor(len) {
        this.len = len;
      }
      static fromBase64(base64str) {
        return this.fromBuffer(Buffer.from(base64str, "base64"));
      }
      static fromBuffer(buffer) {
        const pic = new VorbisPictureToken(buffer.length);
        return pic.get(buffer, 0);
      }
      get(buffer, offset) {
        const type = ID3v2Token_1.AttachedPictureType[Token2.UINT32_BE.get(buffer, offset)];
        const mimeLen = Token2.UINT32_BE.get(buffer, offset += 4);
        const format = buffer.toString("utf-8", offset += 4, offset + mimeLen);
        const descLen = Token2.UINT32_BE.get(buffer, offset += mimeLen);
        const description = buffer.toString("utf-8", offset += 4, offset + descLen);
        const width = Token2.UINT32_BE.get(buffer, offset += descLen);
        const height = Token2.UINT32_BE.get(buffer, offset += 4);
        const colour_depth = Token2.UINT32_BE.get(buffer, offset += 4);
        const indexed_color = Token2.UINT32_BE.get(buffer, offset += 4);
        const picDataLen = Token2.UINT32_BE.get(buffer, offset += 4);
        const data = Buffer.from(buffer.slice(offset += 4, offset + picDataLen));
        return {
          type,
          format,
          description,
          width,
          height,
          colour_depth,
          indexed_color,
          data
        };
      }
    };
    exports2.VorbisPictureToken = VorbisPictureToken;
    exports2.CommonHeader = {
      len: 7,
      get: (buf, off) => {
        return {
          packetType: buf.readUInt8(off),
          vorbis: new Token2.StringType(6, "ascii").get(buf, off + 1)
        };
      }
    };
    exports2.IdentificationHeader = {
      len: 23,
      get: (buf, off) => {
        return {
          version: buf.readUInt32LE(off + 0),
          channelMode: buf.readUInt8(off + 4),
          sampleRate: buf.readUInt32LE(off + 5),
          bitrateMax: buf.readUInt32LE(off + 9),
          bitrateNominal: buf.readUInt32LE(off + 13),
          bitrateMin: buf.readUInt32LE(off + 17)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/id3v2/AbstractID3Parser.js
var require_AbstractID3Parser = __commonJS({
  "node_modules/music-metadata/lib/id3v2/AbstractID3Parser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.AbstractID3Parser = void 0;
    var core_1 = require_core();
    var ID3v2Token_1 = require_ID3v2Token();
    var ID3v2Parser_1 = require_ID3v2Parser();
    var ID3v1Parser_1 = require_ID3v1Parser();
    var _debug = require_src();
    var BasicParser_1 = require_BasicParser();
    var debug = _debug("music-metadata:parser:ID3");
    var AbstractID3Parser = class extends BasicParser_1.BasicParser {
      constructor() {
        super(...arguments);
        this.id3parser = new ID3v2Parser_1.ID3v2Parser();
      }
      static async startsWithID3v2Header(tokenizer) {
        return (await tokenizer.peekToken(ID3v2Token_1.ID3v2Header)).fileIdentifier === "ID3";
      }
      async parse() {
        try {
          await this.parseID3v2();
        } catch (err) {
          if (err instanceof core_1.EndOfStreamError) {
            debug(`End-of-stream`);
          } else {
            throw err;
          }
        }
      }
      finalize() {
        return;
      }
      async parseID3v2() {
        await this.tryReadId3v2Headers();
        debug("End of ID3v2 header, go to MPEG-parser: pos=%s", this.tokenizer.position);
        await this._parse();
        if (this.options.skipPostHeaders && this.metadata.hasAny()) {
          this.finalize();
        } else {
          const id3v1parser = new ID3v1Parser_1.ID3v1Parser();
          await id3v1parser.init(this.metadata, this.tokenizer, this.options).parse();
          this.finalize();
        }
      }
      async tryReadId3v2Headers() {
        const id3Header = await this.tokenizer.peekToken(ID3v2Token_1.ID3v2Header);
        if (id3Header.fileIdentifier === "ID3") {
          debug("Found ID3v2 header, pos=%s", this.tokenizer.position);
          await this.id3parser.parse(this.metadata, this.tokenizer, this.options);
          return this.tryReadId3v2Headers();
        }
      }
    };
    exports2.AbstractID3Parser = AbstractID3Parser;
  }
});

// node_modules/music-metadata/lib/ogg/vorbis/VorbisDecoder.js
var require_VorbisDecoder = __commonJS({
  "node_modules/music-metadata/lib/ogg/vorbis/VorbisDecoder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.VorbisDecoder = void 0;
    var Token2 = require_lib3();
    var VorbisDecoder = class {
      constructor(data, offset) {
        this.data = data;
        this.offset = offset;
      }
      readInt32() {
        const value = Token2.UINT32_LE.get(this.data, this.offset);
        this.offset += 4;
        return value;
      }
      readStringUtf8() {
        const len = this.readInt32();
        const value = this.data.toString("utf8", this.offset, this.offset + len);
        this.offset += len;
        return value;
      }
      parseUserComment() {
        const offset0 = this.offset;
        const v = this.readStringUtf8();
        const idx = v.indexOf("=");
        return {
          key: v.slice(0, idx).toUpperCase(),
          value: v.slice(idx + 1),
          len: this.offset - offset0
        };
      }
    };
    exports2.VorbisDecoder = VorbisDecoder;
  }
});

// node_modules/music-metadata/lib/ogg/vorbis/VorbisParser.js
var require_VorbisParser = __commonJS({
  "node_modules/music-metadata/lib/ogg/vorbis/VorbisParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.VorbisParser = void 0;
    var Token2 = require_lib3();
    var _debug = require_src();
    var VorbisDecoder_1 = require_VorbisDecoder();
    var Vorbis_1 = require_Vorbis();
    var debug = _debug("music-metadata:parser:ogg:vorbis1");
    var VorbisParser = class {
      constructor(metadata, options) {
        this.metadata = metadata;
        this.options = options;
        this.pageSegments = [];
      }
      parsePage(header, pageData) {
        if (header.headerType.firstPage) {
          this.parseFirstPage(header, pageData);
        } else {
          if (header.headerType.continued) {
            if (this.pageSegments.length === 0) {
              throw new Error("Cannot continue on previous page");
            }
            this.pageSegments.push(pageData);
          }
          if (header.headerType.lastPage || !header.headerType.continued) {
            if (this.pageSegments.length > 0) {
              const fullPage = Buffer.concat(this.pageSegments);
              this.parseFullPage(fullPage);
            }
            this.pageSegments = header.headerType.lastPage ? [] : [pageData];
          }
        }
        if (header.headerType.lastPage) {
          this.calculateDuration(header);
        }
      }
      flush() {
        this.parseFullPage(Buffer.concat(this.pageSegments));
      }
      parseUserComment(pageData, offset) {
        const decoder = new VorbisDecoder_1.VorbisDecoder(pageData, offset);
        const tag = decoder.parseUserComment();
        this.addTag(tag.key, tag.value);
        return tag.len;
      }
      addTag(id, value) {
        if (id === "METADATA_BLOCK_PICTURE" && typeof value === "string") {
          if (this.options.skipCovers) {
            debug(`Ignore picture`);
            return;
          }
          value = Vorbis_1.VorbisPictureToken.fromBase64(value);
          debug(`Push picture: id=${id}, format=${value.format}`);
        } else {
          debug(`Push tag: id=${id}, value=${value}`);
        }
        this.metadata.addTag("vorbis", id, value);
      }
      calculateDuration(header) {
        if (this.metadata.format.sampleRate && header.absoluteGranulePosition >= 0) {
          this.metadata.setFormat("numberOfSamples", header.absoluteGranulePosition);
          this.metadata.setFormat("duration", this.metadata.format.numberOfSamples / this.metadata.format.sampleRate);
        }
      }
      parseFirstPage(header, pageData) {
        this.metadata.setFormat("codec", "Vorbis I");
        debug("Parse first page");
        const commonHeader = Vorbis_1.CommonHeader.get(pageData, 0);
        if (commonHeader.vorbis !== "vorbis")
          throw new Error("Metadata does not look like Vorbis");
        if (commonHeader.packetType === 1) {
          const idHeader = Vorbis_1.IdentificationHeader.get(pageData, Vorbis_1.CommonHeader.len);
          this.metadata.setFormat("sampleRate", idHeader.sampleRate);
          this.metadata.setFormat("bitrate", idHeader.bitrateNominal);
          this.metadata.setFormat("numberOfChannels", idHeader.channelMode);
          debug("sample-rate=%s[hz], bitrate=%s[b/s], channel-mode=%s", idHeader.sampleRate, idHeader.bitrateNominal, idHeader.channelMode);
        } else
          throw new Error("First Ogg page should be type 1: the identification header");
      }
      parseFullPage(pageData) {
        const commonHeader = Vorbis_1.CommonHeader.get(pageData, 0);
        debug("Parse full page: type=%s, byteLength=%s", commonHeader.packetType, pageData.byteLength);
        switch (commonHeader.packetType) {
          case 3:
            return this.parseUserCommentList(pageData, Vorbis_1.CommonHeader.len);
          case 1:
          case 5:
            break;
        }
      }
      parseUserCommentList(pageData, offset) {
        const strLen = Token2.UINT32_LE.get(pageData, offset);
        offset += 4;
        offset += strLen;
        let userCommentListLength = Token2.UINT32_LE.get(pageData, offset);
        offset += 4;
        while (userCommentListLength-- > 0) {
          offset += this.parseUserComment(pageData, offset);
        }
      }
    };
    exports2.VorbisParser = VorbisParser;
  }
});

// node_modules/music-metadata/lib/flac/FlacParser.js
var require_FlacParser = __commonJS({
  "node_modules/music-metadata/lib/flac/FlacParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.FlacParser = void 0;
    var Util_1 = require_Util();
    var Token2 = require_lib3();
    var Vorbis_1 = require_Vorbis();
    var AbstractID3Parser_1 = require_AbstractID3Parser();
    var FourCC_1 = require_FourCC();
    var _debug = require_src();
    var VorbisParser_1 = require_VorbisParser();
    var VorbisDecoder_1 = require_VorbisDecoder();
    var debug = _debug("music-metadata:parser:FLAC");
    var BlockType;
    (function(BlockType2) {
      BlockType2[BlockType2["STREAMINFO"] = 0] = "STREAMINFO";
      BlockType2[BlockType2["PADDING"] = 1] = "PADDING";
      BlockType2[BlockType2["APPLICATION"] = 2] = "APPLICATION";
      BlockType2[BlockType2["SEEKTABLE"] = 3] = "SEEKTABLE";
      BlockType2[BlockType2["VORBIS_COMMENT"] = 4] = "VORBIS_COMMENT";
      BlockType2[BlockType2["CUESHEET"] = 5] = "CUESHEET";
      BlockType2[BlockType2["PICTURE"] = 6] = "PICTURE";
    })(BlockType || (BlockType = {}));
    var FlacParser = class extends AbstractID3Parser_1.AbstractID3Parser {
      constructor() {
        super(...arguments);
        this.padding = 0;
      }
      init(metadata, tokenizer, options) {
        super.init(metadata, tokenizer, options);
        this.vorbisParser = new VorbisParser_1.VorbisParser(metadata, options);
        return this;
      }
      async _parse() {
        const fourCC = await this.tokenizer.readToken(FourCC_1.FourCcToken);
        if (fourCC.toString() !== "fLaC") {
          throw new Error("Invalid FLAC preamble");
        }
        let blockHeader;
        do {
          blockHeader = await this.tokenizer.readToken(Metadata.BlockHeader);
          await this.parseDataBlock(blockHeader);
        } while (!blockHeader.lastBlock);
        if (this.tokenizer.fileInfo.size && this.metadata.format.duration) {
          const dataSize = this.tokenizer.fileInfo.size - this.tokenizer.position;
          this.metadata.setFormat("bitrate", 8 * dataSize / this.metadata.format.duration);
        }
      }
      parseDataBlock(blockHeader) {
        debug(`blockHeader type=${blockHeader.type}, length=${blockHeader.length}`);
        switch (blockHeader.type) {
          case BlockType.STREAMINFO:
            return this.parseBlockStreamInfo(blockHeader.length);
          case BlockType.PADDING:
            this.padding += blockHeader.length;
            break;
          case BlockType.APPLICATION:
            break;
          case BlockType.SEEKTABLE:
            break;
          case BlockType.VORBIS_COMMENT:
            return this.parseComment(blockHeader.length);
          case BlockType.CUESHEET:
            break;
          case BlockType.PICTURE:
            return this.parsePicture(blockHeader.length).then();
          default:
            this.metadata.addWarning("Unknown block type: " + blockHeader.type);
        }
        return this.tokenizer.ignore(blockHeader.length).then();
      }
      async parseBlockStreamInfo(dataLen) {
        if (dataLen !== Metadata.BlockStreamInfo.len)
          throw new Error("Unexpected block-stream-info length");
        const streamInfo = await this.tokenizer.readToken(Metadata.BlockStreamInfo);
        this.metadata.setFormat("container", "FLAC");
        this.metadata.setFormat("codec", "FLAC");
        this.metadata.setFormat("lossless", true);
        this.metadata.setFormat("numberOfChannels", streamInfo.channels);
        this.metadata.setFormat("bitsPerSample", streamInfo.bitsPerSample);
        this.metadata.setFormat("sampleRate", streamInfo.sampleRate);
        if (streamInfo.totalSamples > 0) {
          this.metadata.setFormat("duration", streamInfo.totalSamples / streamInfo.sampleRate);
        }
      }
      async parseComment(dataLen) {
        const data = await this.tokenizer.readToken(new Token2.BufferType(dataLen));
        const decoder = new VorbisDecoder_1.VorbisDecoder(data, 0);
        decoder.readStringUtf8();
        const commentListLength = decoder.readInt32();
        for (let i = 0; i < commentListLength; i++) {
          const tag = decoder.parseUserComment();
          this.vorbisParser.addTag(tag.key, tag.value);
        }
      }
      async parsePicture(dataLen) {
        if (this.options.skipCovers) {
          return this.tokenizer.ignore(dataLen);
        } else {
          const picture = await this.tokenizer.readToken(new Vorbis_1.VorbisPictureToken(dataLen));
          this.vorbisParser.addTag("METADATA_BLOCK_PICTURE", picture);
        }
      }
    };
    exports2.FlacParser = FlacParser;
    var Metadata = class {
    };
    Metadata.BlockHeader = {
      len: 4,
      get: (buf, off) => {
        return {
          lastBlock: Util_1.default.strtokBITSET.get(buf, off, 7),
          type: Util_1.default.getBitAllignedNumber(buf, off, 1, 7),
          length: Token2.UINT24_BE.get(buf, off + 1)
        };
      }
    };
    Metadata.BlockStreamInfo = {
      len: 34,
      get: (buf, off) => {
        return {
          minimumBlockSize: Token2.UINT16_BE.get(buf, off),
          maximumBlockSize: Token2.UINT16_BE.get(buf, off + 2) / 1e3,
          minimumFrameSize: Token2.UINT24_BE.get(buf, off + 4),
          maximumFrameSize: Token2.UINT24_BE.get(buf, off + 7),
          sampleRate: Token2.UINT24_BE.get(buf, off + 10) >> 4,
          channels: Util_1.default.getBitAllignedNumber(buf, off + 12, 4, 3) + 1,
          bitsPerSample: Util_1.default.getBitAllignedNumber(buf, off + 12, 7, 5) + 1,
          totalSamples: Util_1.default.getBitAllignedNumber(buf, off + 13, 4, 36),
          fileMD5: new Token2.BufferType(16).get(buf, off + 18)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/mp4/AtomToken.js
var require_AtomToken = __commonJS({
  "node_modules/music-metadata/lib/mp4/AtomToken.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ChapterText = exports2.StcoAtom = exports2.StszAtom = exports2.StscAtom = exports2.SampleToChunkToken = exports2.SttsAtom = exports2.TimeToSampleToken = exports2.SoundSampleDescriptionV0 = exports2.SoundSampleDescriptionVersion = exports2.StsdAtom = exports2.TrackHeaderAtom = exports2.NameAtom = exports2.DataAtom = exports2.MvhdAtom = exports2.MdhdAtom = exports2.FixedLengthAtom = exports2.mhdr = exports2.tkhd = exports2.ftyp = exports2.ExtendedSize = exports2.Header = void 0;
    var Token2 = require_lib3();
    var FourCC_1 = require_FourCC();
    var initDebug = require_src();
    var debug = initDebug("music-metadata:parser:MP4:atom");
    exports2.Header = {
      len: 8,
      get: (buf, off) => {
        const length = Token2.UINT32_BE.get(buf, off);
        if (length < 0)
          throw new Error("Invalid atom header length");
        return {
          length,
          name: new Token2.StringType(4, "binary").get(buf, off + 4)
        };
      },
      put: (buf, off, hdr) => {
        Token2.UINT32_BE.put(buf, off, hdr.length);
        return FourCC_1.FourCcToken.put(buf, off + 4, hdr.name);
      }
    };
    exports2.ExtendedSize = Token2.UINT64_BE;
    exports2.ftyp = {
      len: 4,
      get: (buf, off) => {
        return {
          type: new Token2.StringType(4, "ascii").get(buf, off)
        };
      }
    };
    exports2.tkhd = {
      len: 4,
      get: (buf, off) => {
        return {
          type: new Token2.StringType(4, "ascii").get(buf, off)
        };
      }
    };
    exports2.mhdr = {
      len: 8,
      get: (buf, off) => {
        return {
          version: Token2.UINT8.get(buf, off + 0),
          flags: Token2.UINT24_BE.get(buf, off + 1),
          nextItemID: Token2.UINT32_BE.get(buf, off + 4)
        };
      }
    };
    var FixedLengthAtom = class {
      constructor(len, expLen, atomId) {
        this.len = len;
        if (len < expLen) {
          throw new Error(`Atom ${atomId} expected to be ${expLen}, but specifies ${len} bytes long.`);
        } else if (len > expLen) {
          debug(`Warning: atom ${atomId} expected to be ${expLen}, but was actually ${len} bytes long.`);
        }
      }
    };
    exports2.FixedLengthAtom = FixedLengthAtom;
    var SecondsSinceMacEpoch = {
      len: 4,
      get: (buf, off) => {
        const secondsSinceUnixEpoch = Token2.UINT32_BE.get(buf, off) - 2082844800;
        return new Date(secondsSinceUnixEpoch * 1e3);
      }
    };
    var MdhdAtom = class extends FixedLengthAtom {
      constructor(len) {
        super(len, 24, "mdhd");
        this.len = len;
      }
      get(buf, off) {
        return {
          version: Token2.UINT8.get(buf, off + 0),
          flags: Token2.UINT24_BE.get(buf, off + 1),
          creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
          modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
          timeScale: Token2.UINT32_BE.get(buf, off + 12),
          duration: Token2.UINT32_BE.get(buf, off + 16),
          language: Token2.UINT16_BE.get(buf, off + 20),
          quality: Token2.UINT16_BE.get(buf, off + 22)
        };
      }
    };
    exports2.MdhdAtom = MdhdAtom;
    var MvhdAtom = class extends FixedLengthAtom {
      constructor(len) {
        super(len, 100, "mvhd");
        this.len = len;
      }
      get(buf, off) {
        return {
          version: Token2.UINT8.get(buf, off),
          flags: Token2.UINT24_BE.get(buf, off + 1),
          creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
          modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
          timeScale: Token2.UINT32_BE.get(buf, off + 12),
          duration: Token2.UINT32_BE.get(buf, off + 16),
          preferredRate: Token2.UINT32_BE.get(buf, off + 20),
          preferredVolume: Token2.UINT16_BE.get(buf, off + 24),
          previewTime: Token2.UINT32_BE.get(buf, off + 72),
          previewDuration: Token2.UINT32_BE.get(buf, off + 76),
          posterTime: Token2.UINT32_BE.get(buf, off + 80),
          selectionTime: Token2.UINT32_BE.get(buf, off + 84),
          selectionDuration: Token2.UINT32_BE.get(buf, off + 88),
          currentTime: Token2.UINT32_BE.get(buf, off + 92),
          nextTrackID: Token2.UINT32_BE.get(buf, off + 96)
        };
      }
    };
    exports2.MvhdAtom = MvhdAtom;
    var DataAtom = class {
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        return {
          type: {
            set: Token2.UINT8.get(buf, off + 0),
            type: Token2.UINT24_BE.get(buf, off + 1)
          },
          locale: Token2.UINT24_BE.get(buf, off + 4),
          value: new Token2.BufferType(this.len - 8).get(buf, off + 8)
        };
      }
    };
    exports2.DataAtom = DataAtom;
    var NameAtom = class {
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        return {
          version: Token2.UINT8.get(buf, off),
          flags: Token2.UINT24_BE.get(buf, off + 1),
          name: new Token2.StringType(this.len - 4, "utf-8").get(buf, off + 4)
        };
      }
    };
    exports2.NameAtom = NameAtom;
    var TrackHeaderAtom = class {
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        return {
          version: Token2.UINT8.get(buf, off),
          flags: Token2.UINT24_BE.get(buf, off + 1),
          creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
          modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
          trackId: Token2.UINT32_BE.get(buf, off + 12),
          duration: Token2.UINT32_BE.get(buf, off + 20),
          layer: Token2.UINT16_BE.get(buf, off + 24),
          alternateGroup: Token2.UINT16_BE.get(buf, off + 26),
          volume: Token2.UINT16_BE.get(buf, off + 28)
        };
      }
    };
    exports2.TrackHeaderAtom = TrackHeaderAtom;
    var stsdHeader = {
      len: 8,
      get: (buf, off) => {
        return {
          version: Token2.UINT8.get(buf, off),
          flags: Token2.UINT24_BE.get(buf, off + 1),
          numberOfEntries: Token2.UINT32_BE.get(buf, off + 4)
        };
      }
    };
    var SampleDescriptionTable = class {
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        return {
          dataFormat: FourCC_1.FourCcToken.get(buf, off),
          dataReferenceIndex: Token2.UINT16_BE.get(buf, off + 10),
          description: new Token2.BufferType(this.len - 12).get(buf, off + 12)
        };
      }
    };
    var StsdAtom = class {
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const header = stsdHeader.get(buf, off);
        off += stsdHeader.len;
        const table = [];
        for (let n = 0; n < header.numberOfEntries; ++n) {
          const size = Token2.UINT32_BE.get(buf, off);
          off += Token2.UINT32_BE.len;
          table.push(new SampleDescriptionTable(size).get(buf, off));
          off += size;
        }
        return {
          header,
          table
        };
      }
    };
    exports2.StsdAtom = StsdAtom;
    exports2.SoundSampleDescriptionVersion = {
      len: 8,
      get(buf, off) {
        return {
          version: Token2.INT16_BE.get(buf, off),
          revision: Token2.INT16_BE.get(buf, off + 2),
          vendor: Token2.INT32_BE.get(buf, off + 4)
        };
      }
    };
    exports2.SoundSampleDescriptionV0 = {
      len: 12,
      get(buf, off) {
        return {
          numAudioChannels: Token2.INT16_BE.get(buf, off + 0),
          sampleSize: Token2.INT16_BE.get(buf, off + 2),
          compressionId: Token2.INT16_BE.get(buf, off + 4),
          packetSize: Token2.INT16_BE.get(buf, off + 6),
          sampleRate: Token2.UINT16_BE.get(buf, off + 8) + Token2.UINT16_BE.get(buf, off + 10) / 1e4
        };
      }
    };
    var SimpleTableAtom = class {
      constructor(len, token) {
        this.len = len;
        this.token = token;
      }
      get(buf, off) {
        const nrOfEntries = Token2.INT32_BE.get(buf, off + 4);
        return {
          version: Token2.INT8.get(buf, off + 0),
          flags: Token2.INT24_BE.get(buf, off + 1),
          numberOfEntries: nrOfEntries,
          entries: readTokenTable(buf, this.token, off + 8, this.len - 8, nrOfEntries)
        };
      }
    };
    exports2.TimeToSampleToken = {
      len: 8,
      get(buf, off) {
        return {
          count: Token2.INT32_BE.get(buf, off + 0),
          duration: Token2.INT32_BE.get(buf, off + 4)
        };
      }
    };
    var SttsAtom = class extends SimpleTableAtom {
      constructor(len) {
        super(len, exports2.TimeToSampleToken);
        this.len = len;
      }
    };
    exports2.SttsAtom = SttsAtom;
    exports2.SampleToChunkToken = {
      len: 12,
      get(buf, off) {
        return {
          firstChunk: Token2.INT32_BE.get(buf, off),
          samplesPerChunk: Token2.INT32_BE.get(buf, off + 4),
          sampleDescriptionId: Token2.INT32_BE.get(buf, off + 8)
        };
      }
    };
    var StscAtom = class extends SimpleTableAtom {
      constructor(len) {
        super(len, exports2.SampleToChunkToken);
        this.len = len;
      }
    };
    exports2.StscAtom = StscAtom;
    var StszAtom = class {
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const nrOfEntries = Token2.INT32_BE.get(buf, off + 8);
        return {
          version: Token2.INT8.get(buf, off),
          flags: Token2.INT24_BE.get(buf, off + 1),
          sampleSize: Token2.INT32_BE.get(buf, off + 4),
          numberOfEntries: nrOfEntries,
          entries: readTokenTable(buf, Token2.INT32_BE, off + 12, this.len - 12, nrOfEntries)
        };
      }
    };
    exports2.StszAtom = StszAtom;
    var StcoAtom = class extends SimpleTableAtom {
      constructor(len) {
        super(len, Token2.INT32_BE);
        this.len = len;
      }
    };
    exports2.StcoAtom = StcoAtom;
    var ChapterText = class {
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const titleLen = Token2.INT16_BE.get(buf, off + 0);
        const str = new Token2.StringType(titleLen, "utf-8");
        return str.get(buf, off + 2);
      }
    };
    exports2.ChapterText = ChapterText;
    function readTokenTable(buf, token, off, remainingLen, numberOfEntries) {
      debug(`remainingLen=${remainingLen}, numberOfEntries=${numberOfEntries} * token-len=${token.len}`);
      if (remainingLen === 0)
        return [];
      if (remainingLen !== numberOfEntries * token.len)
        throw new Error("mismatch number-of-entries with remaining atom-length");
      const entries = [];
      for (let n = 0; n < numberOfEntries; ++n) {
        entries.push(token.get(buf, off));
        off += token.len;
      }
      return entries;
    }
  }
});

// node_modules/music-metadata/lib/mp4/Atom.js
var require_Atom = __commonJS({
  "node_modules/music-metadata/lib/mp4/Atom.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.Atom = void 0;
    var initDebug = require_src();
    var AtomToken = require_AtomToken();
    var debug = initDebug("music-metadata:parser:MP4:Atom");
    var Atom = class {
      constructor(header, extended, parent) {
        this.header = header;
        this.extended = extended;
        this.parent = parent;
        this.children = [];
        this.atomPath = (this.parent ? this.parent.atomPath + "." : "") + this.header.name;
      }
      static async readAtom(tokenizer, dataHandler, parent, remaining) {
        const offset = tokenizer.position;
        const header = await tokenizer.readToken(AtomToken.Header);
        const extended = header.length === 1;
        if (extended) {
          header.length = await tokenizer.readToken(AtomToken.ExtendedSize);
        }
        const atomBean = new Atom(header, header.length === 1, parent);
        const payloadLength = atomBean.getPayloadLength(remaining);
        debug(`parse atom name=${atomBean.atomPath}, extended=${atomBean.extended}, offset=${offset}, len=${atomBean.header.length}`);
        await atomBean.readData(tokenizer, dataHandler, payloadLength);
        return atomBean;
      }
      getHeaderLength() {
        return this.extended ? 16 : 8;
      }
      getPayloadLength(remaining) {
        return (this.header.length === 0 ? remaining : this.header.length) - this.getHeaderLength();
      }
      async readAtoms(tokenizer, dataHandler, size) {
        while (size > 0) {
          const atomBean = await Atom.readAtom(tokenizer, dataHandler, this, size);
          this.children.push(atomBean);
          size -= atomBean.header.length === 0 ? size : atomBean.header.length;
        }
      }
      async readData(tokenizer, dataHandler, remaining) {
        switch (this.header.name) {
          case "moov":
          case "udta":
          case "trak":
          case "mdia":
          case "minf":
          case "stbl":
          case "<id>":
          case "ilst":
          case "tref":
            return this.readAtoms(tokenizer, dataHandler, this.getPayloadLength(remaining));
          case "meta":
            await tokenizer.ignore(4);
            return this.readAtoms(tokenizer, dataHandler, this.getPayloadLength(remaining) - 4);
          case "mdhd":
          case "mvhd":
          case "tkhd":
          case "stsz":
          case "mdat":
          default:
            return dataHandler(this, remaining);
        }
      }
    };
    exports2.Atom = Atom;
  }
});

// node_modules/music-metadata/lib/mp4/MP4Parser.js
var require_MP4Parser = __commonJS({
  "node_modules/music-metadata/lib/mp4/MP4Parser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.MP4Parser = void 0;
    var initDebug = require_src();
    var Token2 = require_lib3();
    var BasicParser_1 = require_BasicParser();
    var Atom_1 = require_Atom();
    var AtomToken = require_AtomToken();
    var ID3v1Parser_1 = require_ID3v1Parser();
    var type_1 = require_type();
    var debug = initDebug("music-metadata:parser:MP4");
    var tagFormat = "iTunes";
    var encoderDict = {
      raw: {
        lossy: false,
        format: "raw"
      },
      MAC3: {
        lossy: true,
        format: "MACE 3:1"
      },
      MAC6: {
        lossy: true,
        format: "MACE 6:1"
      },
      ima4: {
        lossy: true,
        format: "IMA 4:1"
      },
      ulaw: {
        lossy: true,
        format: "uLaw 2:1"
      },
      alaw: {
        lossy: true,
        format: "uLaw 2:1"
      },
      Qclp: {
        lossy: true,
        format: "QUALCOMM PureVoice"
      },
      ".mp3": {
        lossy: true,
        format: "MPEG-1 layer 3"
      },
      alac: {
        lossy: false,
        format: "ALAC"
      },
      "ac-3": {
        lossy: true,
        format: "AC-3"
      },
      mp4a: {
        lossy: true,
        format: "MPEG-4/AAC"
      },
      mp4s: {
        lossy: true,
        format: "MP4S"
      },
      c608: {
        lossy: true,
        format: "CEA-608"
      },
      c708: {
        lossy: true,
        format: "CEA-708"
      }
    };
    function distinct(value, index, self) {
      return self.indexOf(value) === index;
    }
    var MP4Parser = class extends BasicParser_1.BasicParser {
      constructor() {
        super(...arguments);
        this.atomParsers = {
          mvhd: async (len) => {
            const _mvhd = await this.tokenizer.readToken(new AtomToken.MvhdAtom(len));
            this.metadata.setFormat("creationTime", _mvhd.creationTime);
            this.metadata.setFormat("modificationTime", _mvhd.modificationTime);
          },
          mdhd: async (len) => {
            const mdhd_data = await this.tokenizer.readToken(new AtomToken.MdhdAtom(len));
            const td = this.getTrackDescription();
            td.creationTime = mdhd_data.creationTime;
            td.modificationTime = mdhd_data.modificationTime;
            td.timeScale = mdhd_data.timeScale;
            td.duration = mdhd_data.duration;
          },
          chap: async (len) => {
            const td = this.getTrackDescription();
            const trackIds = [];
            while (len >= Token2.UINT32_BE.len) {
              trackIds.push(await this.tokenizer.readNumber(Token2.UINT32_BE));
              len -= Token2.UINT32_BE.len;
            }
            td.chapterList = trackIds;
          },
          tkhd: async (len) => {
            const track = await this.tokenizer.readToken(new AtomToken.TrackHeaderAtom(len));
            this.tracks.push(track);
          },
          mdat: async (len) => {
            this.audioLengthInBytes = len;
            this.calculateBitRate();
            if (this.options.includeChapters) {
              const trackWithChapters = this.tracks.filter((track) => track.chapterList);
              if (trackWithChapters.length === 1) {
                const chapterTrackIds = trackWithChapters[0].chapterList;
                const chapterTracks = this.tracks.filter((track) => chapterTrackIds.indexOf(track.trackId) !== -1);
                if (chapterTracks.length === 1) {
                  return this.parseChapterTrack(chapterTracks[0], trackWithChapters[0], len);
                }
              }
            }
            await this.tokenizer.ignore(len);
          },
          ftyp: async (len) => {
            const types = [];
            while (len > 0) {
              const ftype = await this.tokenizer.readToken(AtomToken.ftyp);
              len -= AtomToken.ftyp.len;
              const value = ftype.type.replace(/\W/g, "");
              if (value.length > 0) {
                types.push(value);
              }
            }
            debug(`ftyp: ${types.join("/")}`);
            const x = types.filter(distinct).join("/");
            this.metadata.setFormat("container", x);
          },
          stsd: async (len) => {
            const stsd = await this.tokenizer.readToken(new AtomToken.StsdAtom(len));
            const trackDescription = this.getTrackDescription();
            trackDescription.soundSampleDescription = stsd.table.map((dfEntry) => this.parseSoundSampleDescription(dfEntry));
          },
          stsc: async (len) => {
            const stsc = await this.tokenizer.readToken(new AtomToken.StscAtom(len));
            this.getTrackDescription().sampleToChunkTable = stsc.entries;
          },
          stts: async (len) => {
            const stts = await this.tokenizer.readToken(new AtomToken.SttsAtom(len));
            this.getTrackDescription().timeToSampleTable = stts.entries;
          },
          stsz: async (len) => {
            const stsz = await this.tokenizer.readToken(new AtomToken.StszAtom(len));
            const td = this.getTrackDescription();
            td.sampleSize = stsz.sampleSize;
            td.sampleSizeTable = stsz.entries;
          },
          stco: async (len) => {
            const stco = await this.tokenizer.readToken(new AtomToken.StcoAtom(len));
            this.getTrackDescription().chunkOffsetTable = stco.entries;
          },
          date: async (len) => {
            const date = await this.tokenizer.readToken(new Token2.StringType(len, "utf-8"));
            this.addTag("date", date);
          }
        };
      }
      static read_BE_Signed_Integer(value) {
        return Token2.readIntBE(value, 0, value.length);
      }
      static read_BE_Unsigned_Integer(value) {
        return Token2.readUIntBE(value, 0, value.length);
      }
      async parse() {
        this.tracks = [];
        let remainingFileSize = this.tokenizer.fileInfo.size;
        while (!this.tokenizer.fileInfo.size || remainingFileSize > 0) {
          try {
            const token = await this.tokenizer.peekToken(AtomToken.Header);
            if (token.name === "\0\0\0\0") {
              const errMsg = `Error at offset=${this.tokenizer.position}: box.id=0`;
              debug(errMsg);
              this.addWarning(errMsg);
              break;
            }
          } catch (error) {
            const errMsg = `Error at offset=${this.tokenizer.position}: ${error.message}`;
            debug(errMsg);
            this.addWarning(errMsg);
            break;
          }
          const rootAtom = await Atom_1.Atom.readAtom(this.tokenizer, (atom, remaining) => this.handleAtom(atom, remaining), null, remainingFileSize);
          remainingFileSize -= rootAtom.header.length === 0 ? remainingFileSize : rootAtom.header.length;
        }
        const formatList = [];
        this.tracks.forEach((track) => {
          const trackFormats = [];
          track.soundSampleDescription.forEach((ssd) => {
            const streamInfo = {};
            const encoderInfo = encoderDict[ssd.dataFormat];
            if (encoderInfo) {
              trackFormats.push(encoderInfo.format);
              streamInfo.codecName = encoderInfo.format;
            } else {
              streamInfo.codecName = `<${ssd.dataFormat}>`;
            }
            if (ssd.description) {
              const {description} = ssd;
              if (description.sampleRate > 0) {
                streamInfo.type = type_1.TrackType.audio;
                streamInfo.audio = {
                  samplingFrequency: description.sampleRate,
                  bitDepth: description.sampleSize,
                  channels: description.numAudioChannels
                };
              }
            }
            this.metadata.addStreamInfo(streamInfo);
          });
          if (trackFormats.length >= 1) {
            formatList.push(trackFormats.join("/"));
          }
        });
        if (formatList.length > 0) {
          this.metadata.setFormat("codec", formatList.filter(distinct).join("+"));
        }
        const audioTracks = this.tracks.filter((track) => {
          return track.soundSampleDescription.length >= 1 && track.soundSampleDescription[0].description && track.soundSampleDescription[0].description.numAudioChannels > 0;
        });
        if (audioTracks.length >= 1) {
          const audioTrack = audioTracks[0];
          const duration = audioTrack.duration / audioTrack.timeScale;
          this.metadata.setFormat("duration", duration);
          const ssd = audioTrack.soundSampleDescription[0];
          if (ssd.description) {
            this.metadata.setFormat("sampleRate", ssd.description.sampleRate);
            this.metadata.setFormat("bitsPerSample", ssd.description.sampleSize);
            this.metadata.setFormat("numberOfChannels", ssd.description.numAudioChannels);
          }
          const encoderInfo = encoderDict[ssd.dataFormat];
          if (encoderInfo) {
            this.metadata.setFormat("lossless", !encoderInfo.lossy);
          }
          this.calculateBitRate();
        }
      }
      async handleAtom(atom, remaining) {
        if (atom.parent) {
          switch (atom.parent.header.name) {
            case "ilst":
            case "<id>":
              return this.parseMetadataItemData(atom);
          }
        }
        if (this.atomParsers[atom.header.name]) {
          return this.atomParsers[atom.header.name](remaining);
        } else {
          debug(`No parser for atom path=${atom.atomPath}, payload-len=${remaining}, ignoring atom`);
          await this.tokenizer.ignore(remaining);
        }
      }
      getTrackDescription() {
        return this.tracks[this.tracks.length - 1];
      }
      calculateBitRate() {
        if (this.audioLengthInBytes && this.metadata.format.duration) {
          this.metadata.setFormat("bitrate", 8 * this.audioLengthInBytes / this.metadata.format.duration);
        }
      }
      addTag(id, value) {
        this.metadata.addTag(tagFormat, id, value);
      }
      addWarning(message) {
        debug("Warning: " + message);
        this.metadata.addWarning(message);
      }
      parseMetadataItemData(metaAtom) {
        let tagKey = metaAtom.header.name;
        return metaAtom.readAtoms(this.tokenizer, async (child, remaining) => {
          const payLoadLength = child.getPayloadLength(remaining);
          switch (child.header.name) {
            case "data":
              return this.parseValueAtom(tagKey, child);
            case "name":
              const name = await this.tokenizer.readToken(new AtomToken.NameAtom(payLoadLength));
              tagKey += ":" + name.name;
              break;
            case "mean":
              const mean = await this.tokenizer.readToken(new AtomToken.NameAtom(payLoadLength));
              tagKey += ":" + mean.name;
              break;
            default:
              const dataAtom = await this.tokenizer.readToken(new Token2.BufferType(payLoadLength));
              this.addWarning("Unsupported meta-item: " + tagKey + "[" + child.header.name + "] => value=" + dataAtom.toString("hex") + " ascii=" + dataAtom.toString("ascii"));
          }
        }, metaAtom.getPayloadLength(0));
      }
      async parseValueAtom(tagKey, metaAtom) {
        const dataAtom = await this.tokenizer.readToken(new AtomToken.DataAtom(metaAtom.header.length - AtomToken.Header.len));
        if (dataAtom.type.set !== 0) {
          throw new Error("Unsupported type-set != 0: " + dataAtom.type.set);
        }
        switch (dataAtom.type.type) {
          case 0:
            switch (tagKey) {
              case "trkn":
              case "disk":
                const num = Token2.UINT8.get(dataAtom.value, 3);
                const of = Token2.UINT8.get(dataAtom.value, 5);
                this.addTag(tagKey, num + "/" + of);
                break;
              case "gnre":
                const genreInt = Token2.UINT8.get(dataAtom.value, 1);
                const genreStr = ID3v1Parser_1.Genres[genreInt - 1];
                this.addTag(tagKey, genreStr);
                break;
              default:
            }
            break;
          case 1:
          case 18:
            this.addTag(tagKey, dataAtom.value.toString("utf-8"));
            break;
          case 13:
            if (this.options.skipCovers)
              break;
            this.addTag(tagKey, {
              format: "image/jpeg",
              data: Buffer.from(dataAtom.value)
            });
            break;
          case 14:
            if (this.options.skipCovers)
              break;
            this.addTag(tagKey, {
              format: "image/png",
              data: Buffer.from(dataAtom.value)
            });
            break;
          case 21:
            this.addTag(tagKey, MP4Parser.read_BE_Signed_Integer(dataAtom.value));
            break;
          case 22:
            this.addTag(tagKey, MP4Parser.read_BE_Unsigned_Integer(dataAtom.value));
            break;
          case 65:
            this.addTag(tagKey, dataAtom.value.readInt8(0));
            break;
          case 66:
            this.addTag(tagKey, dataAtom.value.readInt16BE(0));
            break;
          case 67:
            this.addTag(tagKey, dataAtom.value.readInt32BE(0));
            break;
          default:
            this.addWarning(`atom key=${tagKey}, has unknown well-known-type (data-type): ${dataAtom.type.type}`);
        }
      }
      parseSoundSampleDescription(sampleDescription) {
        const ssd = {
          dataFormat: sampleDescription.dataFormat,
          dataReferenceIndex: sampleDescription.dataReferenceIndex
        };
        let offset = 0;
        const version = AtomToken.SoundSampleDescriptionVersion.get(sampleDescription.description, offset);
        offset += AtomToken.SoundSampleDescriptionVersion.len;
        if (version.version === 0 || version.version === 1) {
          ssd.description = AtomToken.SoundSampleDescriptionV0.get(sampleDescription.description, offset);
        } else {
          debug(`Warning: sound-sample-description ${version} not implemented`);
        }
        return ssd;
      }
      async parseChapterTrack(chapterTrack, track, len) {
        if (!chapterTrack.sampleSize) {
          if (chapterTrack.chunkOffsetTable.length !== chapterTrack.sampleSizeTable.length)
            throw new Error("Expected equal chunk-offset-table & sample-size-table length.");
        }
        const chapters = [];
        for (let i = 0; i < chapterTrack.chunkOffsetTable.length && len > 0; ++i) {
          const chunkOffset = chapterTrack.chunkOffsetTable[i];
          const nextChunkLen = chunkOffset - this.tokenizer.position;
          const sampleSize = chapterTrack.sampleSize > 0 ? chapterTrack.sampleSize : chapterTrack.sampleSizeTable[i];
          len -= nextChunkLen + sampleSize;
          if (len < 0)
            throw new Error("Chapter chunk exceeding token length");
          await this.tokenizer.ignore(nextChunkLen);
          const title = await this.tokenizer.readToken(new AtomToken.ChapterText(sampleSize));
          debug(`Chapter ${i + 1}: ${title}`);
          const chapter = {
            title,
            sampleOffset: this.findSampleOffset(track, this.tokenizer.position)
          };
          debug(`Chapter title=${chapter.title}, offset=${chapter.sampleOffset}/${this.tracks[0].duration}`);
          chapters.push(chapter);
        }
        this.metadata.setFormat("chapters", chapters);
        await this.tokenizer.ignore(len);
      }
      findSampleOffset(track, chapterOffset) {
        let totalDuration = 0;
        track.timeToSampleTable.forEach((e) => {
          totalDuration += e.count * e.duration;
        });
        debug(`Total duration=${totalDuration}`);
        let chunkIndex = 0;
        while (chunkIndex < track.chunkOffsetTable.length && track.chunkOffsetTable[chunkIndex] < chapterOffset) {
          ++chunkIndex;
        }
        return this.getChunkDuration(chunkIndex + 1, track);
      }
      getChunkDuration(chunkId, track) {
        let ttsi = 0;
        let ttsc = track.timeToSampleTable[ttsi].count;
        let ttsd = track.timeToSampleTable[ttsi].duration;
        let curChunkId = 1;
        let samplesPerChunk = this.getSamplesPerChunk(curChunkId, track.sampleToChunkTable);
        let totalDuration = 0;
        while (curChunkId < chunkId) {
          const nrOfSamples = Math.min(ttsc, samplesPerChunk);
          totalDuration += nrOfSamples * ttsd;
          ttsc -= nrOfSamples;
          samplesPerChunk -= nrOfSamples;
          if (samplesPerChunk === 0) {
            ++curChunkId;
            samplesPerChunk = this.getSamplesPerChunk(curChunkId, track.sampleToChunkTable);
          } else {
            ++ttsi;
            ttsc = track.timeToSampleTable[ttsi].count;
            ttsd = track.timeToSampleTable[ttsi].duration;
          }
        }
        return totalDuration;
      }
      getSamplesPerChunk(chunkId, stcTable) {
        for (let i = 0; i < stcTable.length - 1; ++i) {
          if (chunkId >= stcTable[i].firstChunk && chunkId < stcTable[i + 1].firstChunk) {
            return stcTable[i].samplesPerChunk;
          }
        }
        return stcTable[stcTable.length - 1].samplesPerChunk;
      }
    };
    exports2.MP4Parser = MP4Parser;
  }
});

// node_modules/music-metadata/lib/mpeg/ReplayGainDataFormat.js
var require_ReplayGainDataFormat = __commonJS({
  "node_modules/music-metadata/lib/mpeg/ReplayGainDataFormat.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ReplayGain = void 0;
    var Util_1 = require_Util();
    var NameCode;
    (function(NameCode2) {
      NameCode2[NameCode2["not_set"] = 0] = "not_set";
      NameCode2[NameCode2["radio"] = 1] = "radio";
      NameCode2[NameCode2["audiophile"] = 2] = "audiophile";
    })(NameCode || (NameCode = {}));
    var ReplayGainOriginator;
    (function(ReplayGainOriginator2) {
      ReplayGainOriginator2[ReplayGainOriginator2["unspecified"] = 0] = "unspecified";
      ReplayGainOriginator2[ReplayGainOriginator2["engineer"] = 1] = "engineer";
      ReplayGainOriginator2[ReplayGainOriginator2["user"] = 2] = "user";
      ReplayGainOriginator2[ReplayGainOriginator2["automatic"] = 3] = "automatic";
      ReplayGainOriginator2[ReplayGainOriginator2["rms_average"] = 4] = "rms_average";
    })(ReplayGainOriginator || (ReplayGainOriginator = {}));
    exports2.ReplayGain = {
      len: 2,
      get: (buf, off) => {
        const gain_type = Util_1.default.getBitAllignedNumber(buf, off, 0, 3);
        const sign = Util_1.default.getBitAllignedNumber(buf, off, 6, 1);
        const gain_adj = Util_1.default.getBitAllignedNumber(buf, off, 7, 9) / 10;
        if (gain_type > 0) {
          return {
            type: Util_1.default.getBitAllignedNumber(buf, off, 0, 3),
            origin: Util_1.default.getBitAllignedNumber(buf, off, 3, 3),
            adjustment: sign ? -gain_adj : gain_adj
          };
        }
        return void 0;
      }
    };
  }
});

// node_modules/music-metadata/lib/mpeg/ExtendedLameHeader.js
var require_ExtendedLameHeader = __commonJS({
  "node_modules/music-metadata/lib/mpeg/ExtendedLameHeader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ExtendedLameHeader = void 0;
    var Token2 = require_lib3();
    var Util_1 = require_Util();
    var ReplayGainDataFormat_1 = require_ReplayGainDataFormat();
    exports2.ExtendedLameHeader = {
      len: 27,
      get: (buf, off) => {
        const track_peak = Token2.UINT32_BE.get(buf, off + 2);
        return {
          revision: Util_1.default.getBitAllignedNumber(buf, off, 0, 4),
          vbr_method: Util_1.default.getBitAllignedNumber(buf, off, 4, 4),
          lowpass_filter: 100 * Token2.UINT8.get(buf, off + 1),
          track_peak: track_peak === 0 ? void 0 : track_peak / Math.pow(2, 23),
          track_gain: ReplayGainDataFormat_1.ReplayGain.get(buf, 6),
          album_gain: ReplayGainDataFormat_1.ReplayGain.get(buf, 8),
          music_length: Token2.UINT32_BE.get(buf, off + 20),
          music_crc: Token2.UINT8.get(buf, off + 24),
          header_crc: Token2.UINT16_BE.get(buf, off + 24)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/mpeg/XingTag.js
var require_XingTag = __commonJS({
  "node_modules/music-metadata/lib/mpeg/XingTag.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.readXingHeader = exports2.XingHeaderFlags = exports2.LameEncoderVersion = exports2.InfoTagHeaderTag = void 0;
    var Token2 = require_lib3();
    var Util_1 = require_Util();
    var ExtendedLameHeader_1 = require_ExtendedLameHeader();
    exports2.InfoTagHeaderTag = new Token2.StringType(4, "ascii");
    exports2.LameEncoderVersion = new Token2.StringType(6, "ascii");
    exports2.XingHeaderFlags = {
      len: 4,
      get: (buf, off) => {
        return {
          frames: Util_1.default.isBitSet(buf, off, 31),
          bytes: Util_1.default.isBitSet(buf, off, 30),
          toc: Util_1.default.isBitSet(buf, off, 29),
          vbrScale: Util_1.default.isBitSet(buf, off, 28)
        };
      }
    };
    async function readXingHeader(tokenizer) {
      const flags = await tokenizer.readToken(exports2.XingHeaderFlags);
      const xingInfoTag = {};
      if (flags.frames) {
        xingInfoTag.numFrames = await tokenizer.readToken(Token2.UINT32_BE);
      }
      if (flags.bytes) {
        xingInfoTag.streamSize = await tokenizer.readToken(Token2.UINT32_BE);
      }
      if (flags.toc) {
        xingInfoTag.toc = Buffer.alloc(100);
        await tokenizer.readBuffer(xingInfoTag.toc);
      }
      if (flags.vbrScale) {
        xingInfoTag.vbrScale = await tokenizer.readToken(Token2.UINT32_BE);
      }
      const lameTag = await tokenizer.peekToken(new Token2.StringType(4, "ascii"));
      if (lameTag === "LAME") {
        await tokenizer.ignore(4);
        xingInfoTag.lame = {
          version: await tokenizer.readToken(new Token2.StringType(5, "ascii"))
        };
        const majorMinorVersion = xingInfoTag.lame.version.match(/\d+.\d+/g)[0];
        const version = majorMinorVersion.split(".").map((n) => parseInt(n, 10));
        if (version[0] >= 3 && version[1] >= 90) {
          xingInfoTag.lame.extended = await tokenizer.readToken(ExtendedLameHeader_1.ExtendedLameHeader);
        }
      }
      return xingInfoTag;
    }
    exports2.readXingHeader = readXingHeader;
  }
});

// node_modules/music-metadata/lib/mpeg/MpegParser.js
var require_MpegParser = __commonJS({
  "node_modules/music-metadata/lib/mpeg/MpegParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.MpegParser = void 0;
    var Token2 = require_lib3();
    var core_1 = require_core();
    var initDebug = require_src();
    var Util_1 = require_Util();
    var AbstractID3Parser_1 = require_AbstractID3Parser();
    var XingTag_1 = require_XingTag();
    var debug = initDebug("music-metadata:parser:mpeg");
    var maxPeekLen = 1024;
    var MPEG4 = {
      AudioObjectTypes: [
        "AAC Main",
        "AAC LC",
        "AAC SSR",
        "AAC LTP"
      ],
      SamplingFrequencies: [
        96e3,
        88200,
        64e3,
        48e3,
        44100,
        32e3,
        24e3,
        22050,
        16e3,
        12e3,
        11025,
        8e3,
        7350,
        void 0,
        void 0,
        -1
      ]
    };
    var MPEG4_ChannelConfigurations = [
      void 0,
      ["front-center"],
      ["front-left", "front-right"],
      ["front-center", "front-left", "front-right"],
      ["front-center", "front-left", "front-right", "back-center"],
      ["front-center", "front-left", "front-right", "back-left", "back-right"],
      ["front-center", "front-left", "front-right", "back-left", "back-right", "LFE-channel"],
      ["front-center", "front-left", "front-right", "side-left", "side-right", "back-left", "back-right", "LFE-channel"]
    ];
    var MpegFrameHeader = class {
      constructor(buf, off) {
        this.versionIndex = Util_1.default.getBitAllignedNumber(buf, off + 1, 3, 2);
        this.layer = MpegFrameHeader.LayerDescription[Util_1.default.getBitAllignedNumber(buf, off + 1, 5, 2)];
        if (this.versionIndex > 1 && this.layer === 0) {
          this.parseAdtsHeader(buf, off);
        } else {
          this.parseMpegHeader(buf, off);
        }
        this.isProtectedByCRC = !Util_1.default.isBitSet(buf, off + 1, 7);
      }
      calcDuration(numFrames) {
        return numFrames * this.calcSamplesPerFrame() / this.samplingRate;
      }
      calcSamplesPerFrame() {
        return MpegFrameHeader.samplesInFrameTable[this.version === 1 ? 0 : 1][this.layer];
      }
      calculateSideInfoLength() {
        if (this.layer !== 3)
          return 2;
        if (this.channelModeIndex === 3) {
          if (this.version === 1) {
            return 17;
          } else if (this.version === 2 || this.version === 2.5) {
            return 9;
          }
        } else {
          if (this.version === 1) {
            return 32;
          } else if (this.version === 2 || this.version === 2.5) {
            return 17;
          }
        }
      }
      calcSlotSize() {
        return [null, 4, 1, 1][this.layer];
      }
      parseMpegHeader(buf, off) {
        this.container = "MPEG";
        this.bitrateIndex = Util_1.default.getBitAllignedNumber(buf, off + 2, 0, 4);
        this.sampRateFreqIndex = Util_1.default.getBitAllignedNumber(buf, off + 2, 4, 2);
        this.padding = Util_1.default.isBitSet(buf, off + 2, 6);
        this.privateBit = Util_1.default.isBitSet(buf, off + 2, 7);
        this.channelModeIndex = Util_1.default.getBitAllignedNumber(buf, off + 3, 0, 2);
        this.modeExtension = Util_1.default.getBitAllignedNumber(buf, off + 3, 2, 2);
        this.isCopyrighted = Util_1.default.isBitSet(buf, off + 3, 4);
        this.isOriginalMedia = Util_1.default.isBitSet(buf, off + 3, 5);
        this.emphasis = Util_1.default.getBitAllignedNumber(buf, off + 3, 7, 2);
        this.version = MpegFrameHeader.VersionID[this.versionIndex];
        this.channelMode = MpegFrameHeader.ChannelMode[this.channelModeIndex];
        this.codec = `MPEG ${this.version} Layer ${this.layer}`;
        const bitrateInKbps = this.calcBitrate();
        if (!bitrateInKbps) {
          throw new Error("Cannot determine bit-rate");
        }
        this.bitrate = bitrateInKbps * 1e3;
        this.samplingRate = this.calcSamplingRate();
        if (this.samplingRate == null) {
          throw new Error("Cannot determine sampling-rate");
        }
      }
      parseAdtsHeader(buf, off) {
        debug(`layer=0 => ADTS`);
        this.version = this.versionIndex === 2 ? 4 : 2;
        this.container = "ADTS/MPEG-" + this.version;
        const profileIndex = Util_1.default.getBitAllignedNumber(buf, off + 2, 0, 2);
        this.codec = "AAC";
        this.codecProfile = MPEG4.AudioObjectTypes[profileIndex];
        debug(`MPEG-4 audio-codec=${this.codec}`);
        const samplingFrequencyIndex = Util_1.default.getBitAllignedNumber(buf, off + 2, 2, 4);
        this.samplingRate = MPEG4.SamplingFrequencies[samplingFrequencyIndex];
        debug(`sampling-rate=${this.samplingRate}`);
        const channelIndex = Util_1.default.getBitAllignedNumber(buf, off + 2, 7, 3);
        this.mp4ChannelConfig = MPEG4_ChannelConfigurations[channelIndex];
        debug(`channel-config=${this.mp4ChannelConfig.join("+")}`);
        this.frameLength = Util_1.default.getBitAllignedNumber(buf, off + 3, 6, 2) << 11;
      }
      calcBitrate() {
        if (this.bitrateIndex === 0 || this.bitrateIndex === 15) {
          return;
        }
        const codecIndex = `${Math.floor(this.version)}${this.layer}`;
        return MpegFrameHeader.bitrate_index[this.bitrateIndex][codecIndex];
      }
      calcSamplingRate() {
        if (this.sampRateFreqIndex === 3)
          return null;
        return MpegFrameHeader.sampling_rate_freq_index[this.version][this.sampRateFreqIndex];
      }
    };
    MpegFrameHeader.SyncByte1 = 255;
    MpegFrameHeader.SyncByte2 = 224;
    MpegFrameHeader.VersionID = [2.5, null, 2, 1];
    MpegFrameHeader.LayerDescription = [0, 3, 2, 1];
    MpegFrameHeader.ChannelMode = ["stereo", "joint_stereo", "dual_channel", "mono"];
    MpegFrameHeader.bitrate_index = {
      1: {11: 32, 12: 32, 13: 32, 21: 32, 22: 8, 23: 8},
      2: {11: 64, 12: 48, 13: 40, 21: 48, 22: 16, 23: 16},
      3: {11: 96, 12: 56, 13: 48, 21: 56, 22: 24, 23: 24},
      4: {11: 128, 12: 64, 13: 56, 21: 64, 22: 32, 23: 32},
      5: {11: 160, 12: 80, 13: 64, 21: 80, 22: 40, 23: 40},
      6: {11: 192, 12: 96, 13: 80, 21: 96, 22: 48, 23: 48},
      7: {11: 224, 12: 112, 13: 96, 21: 112, 22: 56, 23: 56},
      8: {11: 256, 12: 128, 13: 112, 21: 128, 22: 64, 23: 64},
      9: {11: 288, 12: 160, 13: 128, 21: 144, 22: 80, 23: 80},
      10: {11: 320, 12: 192, 13: 160, 21: 160, 22: 96, 23: 96},
      11: {11: 352, 12: 224, 13: 192, 21: 176, 22: 112, 23: 112},
      12: {11: 384, 12: 256, 13: 224, 21: 192, 22: 128, 23: 128},
      13: {11: 416, 12: 320, 13: 256, 21: 224, 22: 144, 23: 144},
      14: {11: 448, 12: 384, 13: 320, 21: 256, 22: 160, 23: 160}
    };
    MpegFrameHeader.sampling_rate_freq_index = {
      1: {0: 44100, 1: 48e3, 2: 32e3},
      2: {0: 22050, 1: 24e3, 2: 16e3},
      2.5: {0: 11025, 1: 12e3, 2: 8e3}
    };
    MpegFrameHeader.samplesInFrameTable = [
      [0, 384, 1152, 1152],
      [0, 384, 1152, 576]
    ];
    var FrameHeader = {
      len: 4,
      get: (buf, off) => {
        return new MpegFrameHeader(buf, off);
      }
    };
    function getVbrCodecProfile(vbrScale) {
      return "V" + Math.floor((100 - vbrScale) / 10);
    }
    var MpegParser = class extends AbstractID3Parser_1.AbstractID3Parser {
      constructor() {
        super(...arguments);
        this.frameCount = 0;
        this.syncFrameCount = -1;
        this.countSkipFrameData = 0;
        this.totalDataLength = 0;
        this.bitrates = [];
        this.calculateEofDuration = false;
        this.buf_frame_header = Buffer.alloc(4);
        this.syncPeek = {
          buf: Buffer.alloc(maxPeekLen),
          len: 0
        };
      }
      async _parse() {
        this.metadata.setFormat("lossless", false);
        try {
          let quit = false;
          while (!quit) {
            await this.sync();
            quit = await this.parseCommonMpegHeader();
          }
        } catch (err) {
          if (err instanceof core_1.EndOfStreamError) {
            debug(`End-of-stream`);
            if (this.calculateEofDuration) {
              const numberOfSamples = this.frameCount * this.samplesPerFrame;
              this.metadata.setFormat("numberOfSamples", numberOfSamples);
              const duration = numberOfSamples / this.metadata.format.sampleRate;
              debug(`Calculate duration at EOF: ${duration} sec.`, duration);
              this.metadata.setFormat("duration", duration);
            }
          } else {
            throw err;
          }
        }
      }
      finalize() {
        const format = this.metadata.format;
        const hasID3v1 = this.metadata.native.hasOwnProperty("ID3v1");
        if (format.duration && this.tokenizer.fileInfo.size) {
          const mpegSize = this.tokenizer.fileInfo.size - this.mpegOffset - (hasID3v1 ? 128 : 0);
          if (format.codecProfile && format.codecProfile[0] === "V") {
            this.metadata.setFormat("bitrate", mpegSize * 8 / format.duration);
          }
        } else if (this.tokenizer.fileInfo.size && format.codecProfile === "CBR") {
          const mpegSize = this.tokenizer.fileInfo.size - this.mpegOffset - (hasID3v1 ? 128 : 0);
          const numberOfSamples = Math.round(mpegSize / this.frame_size) * this.samplesPerFrame;
          this.metadata.setFormat("numberOfSamples", numberOfSamples);
          const duration = numberOfSamples / format.sampleRate;
          debug("Calculate CBR duration based on file size: %s", duration);
          this.metadata.setFormat("duration", duration);
        }
      }
      async sync() {
        let gotFirstSync = false;
        while (true) {
          let bo = 0;
          this.syncPeek.len = await this.tokenizer.peekBuffer(this.syncPeek.buf, {length: maxPeekLen, mayBeLess: true});
          if (this.syncPeek.len <= 163) {
            throw new core_1.EndOfStreamError();
          }
          while (true) {
            if (gotFirstSync && (this.syncPeek.buf[bo] & 224) === 224) {
              this.buf_frame_header[0] = MpegFrameHeader.SyncByte1;
              this.buf_frame_header[1] = this.syncPeek.buf[bo];
              await this.tokenizer.ignore(bo);
              debug(`Sync at offset=${this.tokenizer.position - 1}, frameCount=${this.frameCount}`);
              if (this.syncFrameCount === this.frameCount) {
                debug(`Re-synced MPEG stream, frameCount=${this.frameCount}`);
                this.frameCount = 0;
                this.frame_size = 0;
              }
              this.syncFrameCount = this.frameCount;
              return;
            } else {
              gotFirstSync = false;
              bo = this.syncPeek.buf.indexOf(MpegFrameHeader.SyncByte1, bo);
              if (bo === -1) {
                if (this.syncPeek.len < this.syncPeek.buf.length) {
                  throw new core_1.EndOfStreamError();
                }
                await this.tokenizer.ignore(this.syncPeek.len);
                break;
              } else {
                ++bo;
                gotFirstSync = true;
              }
            }
          }
        }
      }
      async parseCommonMpegHeader() {
        if (this.frameCount === 0) {
          this.mpegOffset = this.tokenizer.position - 1;
        }
        await this.tokenizer.peekBuffer(this.buf_frame_header, {offset: 1, length: 3});
        let header;
        try {
          header = FrameHeader.get(this.buf_frame_header, 0);
        } catch (err) {
          await this.tokenizer.ignore(1);
          this.metadata.addWarning("Parse error: " + err.message);
          return false;
        }
        await this.tokenizer.ignore(3);
        this.metadata.setFormat("container", header.container);
        this.metadata.setFormat("codec", header.codec);
        this.metadata.setFormat("lossless", false);
        this.metadata.setFormat("sampleRate", header.samplingRate);
        this.frameCount++;
        if (header.version >= 2 && header.layer === 0) {
          return this.parseAdts(header);
        } else {
          return this.parseAudioFrameHeader(header);
        }
      }
      async parseAudioFrameHeader(header) {
        this.metadata.setFormat("numberOfChannels", header.channelMode === "mono" ? 1 : 2);
        this.metadata.setFormat("bitrate", header.bitrate);
        if (this.frameCount < 20 * 1e4) {
          debug("offset=%s MP%s bitrate=%s sample-rate=%s", this.tokenizer.position - 4, header.layer, header.bitrate, header.samplingRate);
        }
        const slot_size = header.calcSlotSize();
        if (slot_size === null) {
          throw new Error("invalid slot_size");
        }
        const samples_per_frame = header.calcSamplesPerFrame();
        debug(`samples_per_frame=${samples_per_frame}`);
        const bps = samples_per_frame / 8;
        const fsize = bps * header.bitrate / header.samplingRate + (header.padding ? slot_size : 0);
        this.frame_size = Math.floor(fsize);
        this.audioFrameHeader = header;
        this.bitrates.push(header.bitrate);
        if (this.frameCount === 1) {
          this.offset = FrameHeader.len;
          await this.skipSideInformation();
          return false;
        }
        if (this.frameCount === 3) {
          if (this.areAllSame(this.bitrates)) {
            this.samplesPerFrame = samples_per_frame;
            this.metadata.setFormat("codecProfile", "CBR");
            if (this.tokenizer.fileInfo.size)
              return true;
          } else if (this.metadata.format.duration) {
            return true;
          }
          if (!this.options.duration) {
            return true;
          }
        }
        if (this.options.duration && this.frameCount === 4) {
          this.samplesPerFrame = samples_per_frame;
          this.calculateEofDuration = true;
        }
        this.offset = 4;
        if (header.isProtectedByCRC) {
          await this.parseCrc();
          return false;
        } else {
          await this.skipSideInformation();
          return false;
        }
      }
      async parseAdts(header) {
        const buf = Buffer.alloc(3);
        await this.tokenizer.readBuffer(buf);
        header.frameLength += Util_1.default.getBitAllignedNumber(buf, 0, 0, 11);
        this.totalDataLength += header.frameLength;
        this.samplesPerFrame = 1024;
        const framesPerSec = header.samplingRate / this.samplesPerFrame;
        const bytesPerFrame = this.frameCount === 0 ? 0 : this.totalDataLength / this.frameCount;
        const bitrate = 8 * bytesPerFrame * framesPerSec + 0.5;
        this.metadata.setFormat("bitrate", bitrate);
        debug(`frame-count=${this.frameCount}, size=${header.frameLength} bytes, bit-rate=${bitrate}`);
        await this.tokenizer.ignore(header.frameLength > 7 ? header.frameLength - 7 : 1);
        if (this.frameCount === 3) {
          this.metadata.setFormat("codecProfile", header.codecProfile);
          if (header.mp4ChannelConfig) {
            this.metadata.setFormat("numberOfChannels", header.mp4ChannelConfig.length);
          }
          if (this.options.duration) {
            this.calculateEofDuration = true;
          } else {
            return true;
          }
        }
        return false;
      }
      async parseCrc() {
        this.crc = await this.tokenizer.readNumber(Token2.INT16_BE);
        this.offset += 2;
        return this.skipSideInformation();
      }
      async skipSideInformation() {
        const sideinfo_length = this.audioFrameHeader.calculateSideInfoLength();
        await this.tokenizer.readToken(new Token2.BufferType(sideinfo_length));
        this.offset += sideinfo_length;
        await this.readXtraInfoHeader();
        return;
      }
      async readXtraInfoHeader() {
        const headerTag = await this.tokenizer.readToken(XingTag_1.InfoTagHeaderTag);
        this.offset += XingTag_1.InfoTagHeaderTag.len;
        switch (headerTag) {
          case "Info":
            this.metadata.setFormat("codecProfile", "CBR");
            return this.readXingInfoHeader();
          case "Xing":
            const infoTag = await this.readXingInfoHeader();
            const codecProfile = getVbrCodecProfile(infoTag.vbrScale);
            this.metadata.setFormat("codecProfile", codecProfile);
            return null;
          case "Xtra":
            break;
          case "LAME":
            const version = await this.tokenizer.readToken(XingTag_1.LameEncoderVersion);
            if (this.frame_size >= this.offset + XingTag_1.LameEncoderVersion.len) {
              this.offset += XingTag_1.LameEncoderVersion.len;
              this.metadata.setFormat("tool", "LAME " + version);
              await this.skipFrameData(this.frame_size - this.offset);
              return null;
            } else {
              this.metadata.addWarning("Corrupt LAME header");
              break;
            }
        }
        const frameDataLeft = this.frame_size - this.offset;
        if (frameDataLeft < 0) {
          this.metadata.addWarning("Frame " + this.frameCount + "corrupt: negative frameDataLeft");
        } else {
          await this.skipFrameData(frameDataLeft);
        }
        return null;
      }
      async readXingInfoHeader() {
        const _offset = this.tokenizer.position;
        const infoTag = await XingTag_1.readXingHeader(this.tokenizer);
        this.offset += this.tokenizer.position - _offset;
        if (infoTag.lame) {
          this.metadata.setFormat("tool", "LAME " + Util_1.default.stripNulls(infoTag.lame.version));
          if (infoTag.lame.extended) {
            this.metadata.setFormat("trackPeakLevel", infoTag.lame.extended.track_peak);
            if (infoTag.lame.extended.track_gain) {
              this.metadata.setFormat("trackGain", infoTag.lame.extended.track_gain.adjustment);
            }
            if (infoTag.lame.extended.album_gain) {
              this.metadata.setFormat("albumGain", infoTag.lame.extended.album_gain.adjustment);
            }
            this.metadata.setFormat("duration", infoTag.lame.extended.music_length / 1e3);
          }
        }
        if (infoTag.streamSize) {
          const duration = this.audioFrameHeader.calcDuration(infoTag.numFrames);
          this.metadata.setFormat("duration", duration);
          debug("Get duration from Xing header: %s", this.metadata.format.duration);
          return infoTag;
        }
        const frameDataLeft = this.frame_size - this.offset;
        await this.skipFrameData(frameDataLeft);
        return infoTag;
      }
      async skipFrameData(frameDataLeft) {
        if (frameDataLeft < 0)
          throw new Error("frame-data-left cannot be negative");
        await this.tokenizer.ignore(frameDataLeft);
        this.countSkipFrameData += frameDataLeft;
      }
      areAllSame(array) {
        const first = array[0];
        return array.every((element) => {
          return element === first;
        });
      }
    };
    exports2.MpegParser = MpegParser;
  }
});

// node_modules/music-metadata/lib/musepack/sv8/StreamVersion8.js
var require_StreamVersion8 = __commonJS({
  "node_modules/music-metadata/lib/musepack/sv8/StreamVersion8.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.StreamReader = void 0;
    var Token2 = require_lib3();
    var Util_1 = require_Util();
    var initDebug = require_src();
    var debug = initDebug("music-metadata:parser:musepack:sv8");
    var PacketKey = new Token2.StringType(2, "binary");
    var SH_part1 = {
      len: 5,
      get: (buf, off) => {
        return {
          crc: Token2.UINT32_LE.get(buf, off),
          streamVersion: Token2.UINT8.get(buf, off + 4)
        };
      }
    };
    var SH_part3 = {
      len: 2,
      get: (buf, off) => {
        return {
          sampleFrequency: [44100, 48e3, 37800, 32e3][Util_1.default.getBitAllignedNumber(buf, off, 0, 3)],
          maxUsedBands: Util_1.default.getBitAllignedNumber(buf, off, 3, 5),
          channelCount: Util_1.default.getBitAllignedNumber(buf, off + 1, 0, 4) + 1,
          msUsed: Util_1.default.isBitSet(buf, off + 1, 4),
          audioBlockFrames: Util_1.default.getBitAllignedNumber(buf, off + 1, 5, 3)
        };
      }
    };
    var StreamReader = class {
      constructor(tokenizer) {
        this.tokenizer = tokenizer;
      }
      async readPacketHeader() {
        const key = await this.tokenizer.readToken(PacketKey);
        const size = await this.readVariableSizeField();
        return {
          key,
          payloadLength: size.value - 2 - size.len
        };
      }
      async readStreamHeader(size) {
        const streamHeader = {};
        debug(`Reading SH at offset=${this.tokenizer.position}`);
        const part1 = await this.tokenizer.readToken(SH_part1);
        size -= SH_part1.len;
        Object.assign(streamHeader, part1);
        debug(`SH.streamVersion = ${part1.streamVersion}`);
        const sampleCount = await this.readVariableSizeField();
        size -= sampleCount.len;
        streamHeader.sampleCount = sampleCount.value;
        const bs = await this.readVariableSizeField();
        size -= bs.len;
        streamHeader.beginningOfSilence = bs.value;
        const part3 = await this.tokenizer.readToken(SH_part3);
        size -= SH_part3.len;
        Object.assign(streamHeader, part3);
        await this.tokenizer.ignore(size);
        return streamHeader;
      }
      async readVariableSizeField(len = 1, hb = 0) {
        let n = await this.tokenizer.readNumber(Token2.UINT8);
        if ((n & 128) === 0) {
          return {len, value: hb + n};
        }
        n &= 127;
        n += hb;
        return this.readVariableSizeField(len + 1, n << 7);
      }
    };
    exports2.StreamReader = StreamReader;
  }
});

// node_modules/music-metadata/lib/musepack/sv8/MpcSv8Parser.js
var require_MpcSv8Parser = __commonJS({
  "node_modules/music-metadata/lib/musepack/sv8/MpcSv8Parser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.MpcSv8Parser = void 0;
    var initDebug = require_src();
    var BasicParser_1 = require_BasicParser();
    var SV8 = require_StreamVersion8();
    var APEv2Parser_1 = require_APEv2Parser();
    var FourCC_1 = require_FourCC();
    var debug = initDebug("music-metadata:parser:musepack");
    var MpcSv8Parser = class extends BasicParser_1.BasicParser {
      constructor() {
        super(...arguments);
        this.audioLength = 0;
      }
      async parse() {
        const signature = await this.tokenizer.readToken(FourCC_1.FourCcToken);
        if (signature !== "MPCK")
          throw new Error("Invalid Magic number");
        this.metadata.setFormat("container", "Musepack, SV8");
        return this.parsePacket();
      }
      async parsePacket() {
        const sv8reader = new SV8.StreamReader(this.tokenizer);
        do {
          const header = await sv8reader.readPacketHeader();
          debug(`packet-header key=${header.key}, payloadLength=${header.payloadLength}`);
          switch (header.key) {
            case "SH":
              const sh = await sv8reader.readStreamHeader(header.payloadLength);
              this.metadata.setFormat("numberOfSamples", sh.sampleCount);
              this.metadata.setFormat("sampleRate", sh.sampleFrequency);
              this.metadata.setFormat("duration", sh.sampleCount / sh.sampleFrequency);
              this.metadata.setFormat("numberOfChannels", sh.channelCount);
              break;
            case "AP":
              this.audioLength += header.payloadLength;
              await this.tokenizer.ignore(header.payloadLength);
              break;
            case "RG":
            case "EI":
            case "SO":
            case "ST":
            case "CT":
              await this.tokenizer.ignore(header.payloadLength);
              break;
            case "SE":
              this.metadata.setFormat("bitrate", this.audioLength * 8 / this.metadata.format.duration);
              return APEv2Parser_1.APEv2Parser.tryParseApeHeader(this.metadata, this.tokenizer, this.options);
            default:
              throw new Error(`Unexpected header: ${header.key}`);
          }
        } while (true);
      }
    };
    exports2.MpcSv8Parser = MpcSv8Parser;
  }
});

// node_modules/music-metadata/lib/musepack/sv7/StreamVersion7.js
var require_StreamVersion7 = __commonJS({
  "node_modules/music-metadata/lib/musepack/sv7/StreamVersion7.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.Header = void 0;
    var Token2 = require_lib3();
    var Util_1 = require_Util();
    exports2.Header = {
      len: 6 * 4,
      get: (buf, off) => {
        const header = {
          signature: buf.toString("binary", off, off + 3),
          streamMinorVersion: Util_1.default.getBitAllignedNumber(buf, off + 3, 0, 4),
          streamMajorVersion: Util_1.default.getBitAllignedNumber(buf, off + 3, 4, 4),
          frameCount: Token2.UINT32_LE.get(buf, off + 4),
          maxLevel: Token2.UINT16_LE.get(buf, off + 8),
          sampleFrequency: [44100, 48e3, 37800, 32e3][Util_1.default.getBitAllignedNumber(buf, off + 10, 0, 2)],
          link: Util_1.default.getBitAllignedNumber(buf, off + 10, 2, 2),
          profile: Util_1.default.getBitAllignedNumber(buf, off + 10, 4, 4),
          maxBand: Util_1.default.getBitAllignedNumber(buf, off + 11, 0, 6),
          intensityStereo: Util_1.default.isBitSet(buf, off + 11, 6),
          midSideStereo: Util_1.default.isBitSet(buf, off + 11, 7),
          titlePeak: Token2.UINT16_LE.get(buf, off + 12),
          titleGain: Token2.UINT16_LE.get(buf, off + 14),
          albumPeak: Token2.UINT16_LE.get(buf, off + 16),
          albumGain: Token2.UINT16_LE.get(buf, off + 18),
          lastFrameLength: Token2.UINT32_LE.get(buf, off + 20) >>> 20 & 2047,
          trueGapless: Util_1.default.isBitSet(buf, off + 23, 0)
        };
        header.lastFrameLength = header.trueGapless ? Token2.UINT32_LE.get(buf, 20) >>> 20 & 2047 : 0;
        return header;
      }
    };
  }
});

// node_modules/music-metadata/lib/musepack/sv7/BitReader.js
var require_BitReader = __commonJS({
  "node_modules/music-metadata/lib/musepack/sv7/BitReader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.BitReader = void 0;
    var Token2 = require_lib3();
    var BitReader = class {
      constructor(tokenizer) {
        this.tokenizer = tokenizer;
        this.pos = 0;
        this.dword = void 0;
      }
      async read(bits) {
        while (this.dword === void 0) {
          this.dword = await this.tokenizer.readToken(Token2.UINT32_LE);
        }
        let out = this.dword;
        this.pos += bits;
        if (this.pos < 32) {
          out >>>= 32 - this.pos;
          return out & (1 << bits) - 1;
        } else {
          this.pos -= 32;
          if (this.pos === 0) {
            this.dword = void 0;
            return out & (1 << bits) - 1;
          } else {
            this.dword = await this.tokenizer.readToken(Token2.UINT32_LE);
            if (this.pos) {
              out <<= this.pos;
              out |= this.dword >>> 32 - this.pos;
            }
            return out & (1 << bits) - 1;
          }
        }
      }
      async ignore(bits) {
        if (this.pos > 0) {
          const remaining = 32 - this.pos;
          this.dword = void 0;
          bits -= remaining;
          this.pos = 0;
        }
        const remainder = bits % 32;
        const numOfWords = (bits - remainder) / 32;
        await this.tokenizer.ignore(numOfWords * 4);
        return this.read(remainder);
      }
    };
    exports2.BitReader = BitReader;
  }
});

// node_modules/music-metadata/lib/musepack/sv7/MpcSv7Parser.js
var require_MpcSv7Parser = __commonJS({
  "node_modules/music-metadata/lib/musepack/sv7/MpcSv7Parser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.MpcSv7Parser = void 0;
    var initDebug = require_src();
    var BasicParser_1 = require_BasicParser();
    var SV7 = require_StreamVersion7();
    var APEv2Parser_1 = require_APEv2Parser();
    var BitReader_1 = require_BitReader();
    var debug = initDebug("music-metadata:parser:musepack");
    var MpcSv7Parser = class extends BasicParser_1.BasicParser {
      constructor() {
        super(...arguments);
        this.audioLength = 0;
      }
      async parse() {
        const header = await this.tokenizer.readToken(SV7.Header);
        if (header.signature !== "MP+")
          throw new Error("Unexpected magic number");
        debug(`stream-version=${header.streamMajorVersion}.${header.streamMinorVersion}`);
        this.metadata.setFormat("container", "Musepack, SV7");
        this.metadata.setFormat("sampleRate", header.sampleFrequency);
        const numberOfSamples = 1152 * (header.frameCount - 1) + header.lastFrameLength;
        this.metadata.setFormat("numberOfSamples", numberOfSamples);
        this.duration = numberOfSamples / header.sampleFrequency;
        this.metadata.setFormat("duration", this.duration);
        this.bitreader = new BitReader_1.BitReader(this.tokenizer);
        this.metadata.setFormat("numberOfChannels", header.midSideStereo || header.intensityStereo ? 2 : 1);
        const version = await this.bitreader.read(8);
        this.metadata.setFormat("codec", (version / 100).toFixed(2));
        await this.skipAudioData(header.frameCount);
        debug(`End of audio stream, switching to APEv2, offset=${this.tokenizer.position}`);
        return APEv2Parser_1.APEv2Parser.tryParseApeHeader(this.metadata, this.tokenizer, this.options);
      }
      async skipAudioData(frameCount) {
        while (frameCount-- > 0) {
          const frameLength = await this.bitreader.read(20);
          this.audioLength += 20 + frameLength;
          await this.bitreader.ignore(frameLength);
        }
        const lastFrameLength = await this.bitreader.read(11);
        this.audioLength += lastFrameLength;
        this.metadata.setFormat("bitrate", this.audioLength / this.duration);
      }
    };
    exports2.MpcSv7Parser = MpcSv7Parser;
  }
});

// node_modules/music-metadata/lib/musepack/index.js
var require_musepack = __commonJS({
  "node_modules/music-metadata/lib/musepack/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    var initDebug = require_src();
    var Token2 = require_lib3();
    var MpcSv8Parser_1 = require_MpcSv8Parser();
    var MpcSv7Parser_1 = require_MpcSv7Parser();
    var AbstractID3Parser_1 = require_AbstractID3Parser();
    var debug = initDebug("music-metadata:parser:musepack");
    var MusepackParser = class extends AbstractID3Parser_1.AbstractID3Parser {
      async _parse() {
        const signature = await this.tokenizer.peekToken(new Token2.StringType(3, "binary"));
        let mpcParser;
        switch (signature) {
          case "MP+": {
            debug("Musepack stream-version 7");
            mpcParser = new MpcSv7Parser_1.MpcSv7Parser();
            break;
          }
          case "MPC": {
            debug("Musepack stream-version 8");
            mpcParser = new MpcSv8Parser_1.MpcSv8Parser();
            break;
          }
          default: {
            throw new Error("Invalid Musepack signature prefix");
          }
        }
        mpcParser.init(this.metadata, this.tokenizer, this.options);
        return mpcParser.parse();
      }
    };
    exports2.default = MusepackParser;
  }
});

// node_modules/music-metadata/lib/ogg/opus/Opus.js
var require_Opus = __commonJS({
  "node_modules/music-metadata/lib/ogg/opus/Opus.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.IdHeader = void 0;
    var Token2 = require_lib3();
    var IdHeader = class {
      constructor(len) {
        this.len = len;
        if (len < 19) {
          throw new Error("ID-header-page 0 should be at least 19 bytes long");
        }
      }
      get(buf, off) {
        return {
          magicSignature: new Token2.StringType(8, "ascii").get(buf, off + 0),
          version: buf.readUInt8(off + 8),
          channelCount: buf.readUInt8(off + 9),
          preSkip: buf.readInt16LE(off + 10),
          inputSampleRate: buf.readInt32LE(off + 12),
          outputGain: buf.readInt16LE(off + 16),
          channelMapping: buf.readUInt8(off + 18)
        };
      }
    };
    exports2.IdHeader = IdHeader;
  }
});

// node_modules/music-metadata/lib/ogg/opus/OpusParser.js
var require_OpusParser = __commonJS({
  "node_modules/music-metadata/lib/ogg/opus/OpusParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.OpusParser = void 0;
    var Token2 = require_lib3();
    var Opus = require_Opus();
    var VorbisParser_1 = require_VorbisParser();
    var OpusParser = class extends VorbisParser_1.VorbisParser {
      constructor(metadata, options, tokenizer) {
        super(metadata, options);
        this.tokenizer = tokenizer;
        this.lastPos = -1;
      }
      parseFirstPage(header, pageData) {
        this.metadata.setFormat("codec", "Opus");
        this.idHeader = new Opus.IdHeader(pageData.length).get(pageData, 0);
        if (this.idHeader.magicSignature !== "OpusHead")
          throw new Error("Illegal ogg/Opus magic-signature");
        this.metadata.setFormat("sampleRate", this.idHeader.inputSampleRate);
        this.metadata.setFormat("numberOfChannels", this.idHeader.channelCount);
      }
      parseFullPage(pageData) {
        const magicSignature = new Token2.StringType(8, "ascii").get(pageData, 0);
        switch (magicSignature) {
          case "OpusTags":
            this.parseUserCommentList(pageData, 8);
            this.lastPos = this.tokenizer.position - pageData.length;
            break;
          default:
            break;
        }
      }
      calculateDuration(header) {
        if (this.metadata.format.sampleRate && header.absoluteGranulePosition >= 0) {
          const pos_48bit = header.absoluteGranulePosition - this.idHeader.preSkip;
          this.metadata.setFormat("numberOfSamples", pos_48bit);
          this.metadata.setFormat("duration", pos_48bit / 48e3);
          if (this.lastPos !== -1 && this.tokenizer.fileInfo.size && this.metadata.format.duration) {
            const dataSize = this.tokenizer.fileInfo.size - this.lastPos;
            this.metadata.setFormat("bitrate", 8 * dataSize / this.metadata.format.duration);
          }
        }
      }
    };
    exports2.OpusParser = OpusParser;
  }
});

// node_modules/music-metadata/lib/ogg/speex/Speex.js
var require_Speex = __commonJS({
  "node_modules/music-metadata/lib/ogg/speex/Speex.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.Header = void 0;
    var Token2 = require_lib3();
    var Util_1 = require_Util();
    exports2.Header = {
      len: 80,
      get: (buf, off) => {
        return {
          speex: new Token2.StringType(8, "ascii").get(buf, off + 0),
          version: Util_1.default.trimRightNull(new Token2.StringType(20, "ascii").get(buf, off + 8)),
          version_id: buf.readInt32LE(off + 28),
          header_size: buf.readInt32LE(off + 32),
          rate: buf.readInt32LE(off + 36),
          mode: buf.readInt32LE(off + 40),
          mode_bitstream_version: buf.readInt32LE(off + 44),
          nb_channels: buf.readInt32LE(off + 48),
          bitrate: buf.readInt32LE(off + 52),
          frame_size: buf.readInt32LE(off + 56),
          vbr: buf.readInt32LE(off + 60),
          frames_per_packet: buf.readInt32LE(off + 64),
          extra_headers: buf.readInt32LE(off + 68),
          reserved1: buf.readInt32LE(off + 72),
          reserved2: buf.readInt32LE(off + 76)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/speex/SpeexParser.js
var require_SpeexParser = __commonJS({
  "node_modules/music-metadata/lib/ogg/speex/SpeexParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.SpeexParser = void 0;
    var initDebug = require_src();
    var Speex = require_Speex();
    var VorbisParser_1 = require_VorbisParser();
    var debug = initDebug("music-metadata:parser:ogg:speex");
    var SpeexParser = class extends VorbisParser_1.VorbisParser {
      constructor(metadata, options, tokenizer) {
        super(metadata, options);
        this.tokenizer = tokenizer;
      }
      parseFirstPage(header, pageData) {
        debug("First Ogg/Speex page");
        const speexHeader = Speex.Header.get(pageData, 0);
        this.metadata.setFormat("codec", `Speex ${speexHeader.version}`);
        this.metadata.setFormat("numberOfChannels", speexHeader.nb_channels);
        this.metadata.setFormat("sampleRate", speexHeader.rate);
        if (speexHeader.bitrate !== -1) {
          this.metadata.setFormat("bitrate", speexHeader.bitrate);
        }
      }
    };
    exports2.SpeexParser = SpeexParser;
  }
});

// node_modules/music-metadata/lib/ogg/theora/Theora.js
var require_Theora = __commonJS({
  "node_modules/music-metadata/lib/ogg/theora/Theora.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.IdentificationHeader = void 0;
    var Token2 = require_lib3();
    exports2.IdentificationHeader = {
      len: 42,
      get: (buf, off) => {
        return {
          id: new Token2.StringType(7, "ascii").get(buf, off),
          vmaj: buf.readUInt8(off + 7),
          vmin: buf.readUInt8(off + 8),
          vrev: buf.readUInt8(off + 9),
          vmbw: buf.readUInt16BE(off + 10),
          vmbh: buf.readUInt16BE(off + 17),
          nombr: Token2.UINT24_BE.get(buf, off + 37),
          nqual: buf.readUInt8(off + 40)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/theora/TheoraParser.js
var require_TheoraParser = __commonJS({
  "node_modules/music-metadata/lib/ogg/theora/TheoraParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.TheoraParser = void 0;
    var initDebug = require_src();
    var Theora_1 = require_Theora();
    var debug = initDebug("music-metadata:parser:ogg:theora");
    var TheoraParser = class {
      constructor(metadata, options, tokenizer) {
        this.metadata = metadata;
        this.tokenizer = tokenizer;
      }
      parsePage(header, pageData) {
        if (header.headerType.firstPage) {
          this.parseFirstPage(header, pageData);
        }
      }
      flush() {
        debug("flush");
      }
      calculateDuration(header) {
        debug("duration calculation not implemented");
      }
      parseFirstPage(header, pageData) {
        debug("First Ogg/Theora page");
        this.metadata.setFormat("codec", "Theora");
        const idHeader = Theora_1.IdentificationHeader.get(pageData, 0);
        this.metadata.setFormat("bitrate", idHeader.nombr);
      }
    };
    exports2.TheoraParser = TheoraParser;
  }
});

// node_modules/music-metadata/lib/ogg/OggParser.js
var require_OggParser = __commonJS({
  "node_modules/music-metadata/lib/ogg/OggParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.OggParser = exports2.SegmentTable = void 0;
    var Token2 = require_lib3();
    var initDebug = require_src();
    var Util_1 = require_Util();
    var FourCC_1 = require_FourCC();
    var VorbisParser_1 = require_VorbisParser();
    var OpusParser_1 = require_OpusParser();
    var SpeexParser_1 = require_SpeexParser();
    var BasicParser_1 = require_BasicParser();
    var TheoraParser_1 = require_TheoraParser();
    var core_1 = require_core();
    var debug = initDebug("music-metadata:parser:ogg");
    var SegmentTable = class {
      constructor(header) {
        this.len = header.page_segments;
      }
      static sum(buf, off, len) {
        let s = 0;
        for (let i = off; i < off + len; ++i) {
          s += buf[i];
        }
        return s;
      }
      get(buf, off) {
        return {
          totalPageSize: SegmentTable.sum(buf, off, this.len)
        };
      }
    };
    exports2.SegmentTable = SegmentTable;
    var OggParser = class extends BasicParser_1.BasicParser {
      async parse() {
        debug("pos=%s, parsePage()", this.tokenizer.position);
        try {
          let header;
          do {
            header = await this.tokenizer.readToken(OggParser.Header);
            if (header.capturePattern !== "OggS")
              throw new Error("Invalid Ogg capture pattern");
            this.metadata.setFormat("container", "Ogg");
            this.header = header;
            this.pageNumber = header.pageSequenceNo;
            debug("page#=%s, Ogg.id=%s", header.pageSequenceNo, header.capturePattern);
            const segmentTable = await this.tokenizer.readToken(new SegmentTable(header));
            debug("totalPageSize=%s", segmentTable.totalPageSize);
            const pageData = await this.tokenizer.readToken(new Token2.BufferType(segmentTable.totalPageSize));
            debug("firstPage=%s, lastPage=%s, continued=%s", header.headerType.firstPage, header.headerType.lastPage, header.headerType.continued);
            if (header.headerType.firstPage) {
              const id = new Token2.StringType(7, "ascii").get(pageData, 0);
              switch (id) {
                case "vorbis":
                  debug("Set page consumer to Ogg/Vorbis");
                  this.pageConsumer = new VorbisParser_1.VorbisParser(this.metadata, this.options);
                  break;
                case "OpusHea":
                  debug("Set page consumer to Ogg/Opus");
                  this.pageConsumer = new OpusParser_1.OpusParser(this.metadata, this.options, this.tokenizer);
                  break;
                case "Speex  ":
                  debug("Set page consumer to Ogg/Speex");
                  this.pageConsumer = new SpeexParser_1.SpeexParser(this.metadata, this.options, this.tokenizer);
                  break;
                case "fishead":
                case "\0theora":
                  debug("Set page consumer to Ogg/Theora");
                  this.pageConsumer = new TheoraParser_1.TheoraParser(this.metadata, this.options, this.tokenizer);
                  break;
                default:
                  throw new Error("gg audio-codec not recognized (id=" + id + ")");
              }
            }
            this.pageConsumer.parsePage(header, pageData);
          } while (!header.headerType.lastPage);
        } catch (err) {
          if (err instanceof core_1.EndOfStreamError) {
            this.metadata.addWarning("Last OGG-page is not marked with last-page flag");
            debug(`End-of-stream`);
            this.metadata.addWarning("Last OGG-page is not marked with last-page flag");
            if (this.header) {
              this.pageConsumer.calculateDuration(this.header);
            }
          } else if (err.message.startsWith("FourCC")) {
            if (this.pageNumber > 0) {
              this.metadata.addWarning("Invalid FourCC ID, maybe last OGG-page is not marked with last-page flag");
              this.pageConsumer.flush();
            }
          } else {
            throw err;
          }
        }
      }
    };
    exports2.OggParser = OggParser;
    OggParser.Header = {
      len: 27,
      get: (buf, off) => {
        return {
          capturePattern: FourCC_1.FourCcToken.get(buf, off),
          version: buf.readUInt8(off + 4),
          headerType: {
            continued: Util_1.default.strtokBITSET.get(buf, off + 5, 0),
            firstPage: Util_1.default.strtokBITSET.get(buf, off + 5, 1),
            lastPage: Util_1.default.strtokBITSET.get(buf, off + 5, 2)
          },
          absoluteGranulePosition: buf.readIntLE(off + 6, 6),
          streamSerialNumber: Token2.UINT32_LE.get(buf, off + 14),
          pageSequenceNo: Token2.UINT32_LE.get(buf, off + 18),
          pageChecksum: Token2.UINT32_LE.get(buf, off + 22),
          page_segments: buf.readUInt8(off + 26)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/riff/RiffChunk.js
var require_RiffChunk = __commonJS({
  "node_modules/music-metadata/lib/riff/RiffChunk.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ListInfoTagValue = exports2.Header = void 0;
    var Token2 = require_lib3();
    exports2.Header = {
      len: 8,
      get: (buf, off) => {
        return {
          chunkID: buf.toString("binary", off, off + 4),
          chunkSize: buf.readUInt32LE(off + 4)
        };
      }
    };
    var ListInfoTagValue = class {
      constructor(tagHeader) {
        this.tagHeader = tagHeader;
        this.len = tagHeader.chunkSize;
        this.len += this.len & 1;
      }
      get(buf, off) {
        return new Token2.StringType(this.tagHeader.chunkSize, "ascii").get(buf, off);
      }
    };
    exports2.ListInfoTagValue = ListInfoTagValue;
  }
});

// node_modules/music-metadata/lib/wav/WaveChunk.js
var require_WaveChunk = __commonJS({
  "node_modules/music-metadata/lib/wav/WaveChunk.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.FactChunk = exports2.Format = exports2.WaveFormat = void 0;
    var WaveFormat;
    (function(WaveFormat2) {
      WaveFormat2[WaveFormat2["PCM"] = 1] = "PCM";
      WaveFormat2[WaveFormat2["ADPCM"] = 2] = "ADPCM";
      WaveFormat2[WaveFormat2["IEEE_FLOAT"] = 3] = "IEEE_FLOAT";
      WaveFormat2[WaveFormat2["MPEG_ADTS_AAC"] = 5632] = "MPEG_ADTS_AAC";
      WaveFormat2[WaveFormat2["MPEG_LOAS"] = 5634] = "MPEG_LOAS";
      WaveFormat2[WaveFormat2["RAW_AAC1"] = 255] = "RAW_AAC1";
      WaveFormat2[WaveFormat2["DOLBY_AC3_SPDIF"] = 146] = "DOLBY_AC3_SPDIF";
      WaveFormat2[WaveFormat2["DVM"] = 8192] = "DVM";
      WaveFormat2[WaveFormat2["RAW_SPORT"] = 576] = "RAW_SPORT";
      WaveFormat2[WaveFormat2["ESST_AC3"] = 577] = "ESST_AC3";
      WaveFormat2[WaveFormat2["DRM"] = 9] = "DRM";
      WaveFormat2[WaveFormat2["DTS2"] = 8193] = "DTS2";
      WaveFormat2[WaveFormat2["MPEG"] = 80] = "MPEG";
    })(WaveFormat = exports2.WaveFormat || (exports2.WaveFormat = {}));
    var Format = class {
      constructor(header) {
        if (header.chunkSize < 16)
          throw new Error("Invalid chunk size");
        this.len = header.chunkSize;
      }
      get(buf, off) {
        return {
          wFormatTag: buf.readUInt16LE(off),
          nChannels: buf.readUInt16LE(off + 2),
          nSamplesPerSec: buf.readUInt32LE(off + 4),
          nAvgBytesPerSec: buf.readUInt32LE(off + 8),
          nBlockAlign: buf.readUInt16LE(off + 12),
          wBitsPerSample: buf.readUInt16LE(off + 14)
        };
      }
    };
    exports2.Format = Format;
    var FactChunk = class {
      constructor(header) {
        if (header.chunkSize < 4) {
          throw new Error("Invalid fact chunk size.");
        }
        this.len = header.chunkSize;
      }
      get(buf, off) {
        return {
          dwSampleLength: buf.readUInt32LE(off)
        };
      }
    };
    exports2.FactChunk = FactChunk;
  }
});

// node_modules/music-metadata/lib/wav/WaveParser.js
var require_WaveParser = __commonJS({
  "node_modules/music-metadata/lib/wav/WaveParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.WaveParser = void 0;
    var strtok32 = require_core();
    var Token2 = require_lib3();
    var initDebug = require_src();
    var riff = require_RiffChunk();
    var WaveChunk = require_WaveChunk();
    var ID3v2Parser_1 = require_ID3v2Parser();
    var Util_1 = require_Util();
    var FourCC_1 = require_FourCC();
    var BasicParser_1 = require_BasicParser();
    var debug = initDebug("music-metadata:parser:RIFF");
    var WaveParser = class extends BasicParser_1.BasicParser {
      async parse() {
        const riffHeader = await this.tokenizer.readToken(riff.Header);
        debug(`pos=${this.tokenizer.position}, parse: chunkID=${riffHeader.chunkID}`);
        if (riffHeader.chunkID !== "RIFF")
          return;
        return this.parseRiffChunk(riffHeader.chunkSize).catch((err) => {
          if (!(err instanceof strtok32.EndOfStreamError)) {
            throw err;
          }
        });
      }
      async parseRiffChunk(chunkSize) {
        const type = await this.tokenizer.readToken(FourCC_1.FourCcToken);
        this.metadata.setFormat("container", type);
        switch (type) {
          case "WAVE":
            return this.readWaveChunk(chunkSize - FourCC_1.FourCcToken.len);
          default:
            throw new Error(`Unsupported RIFF format: RIFF/${type}`);
        }
      }
      async readWaveChunk(remaining) {
        while (remaining >= riff.Header.len) {
          const header = await this.tokenizer.readToken(riff.Header);
          remaining -= riff.Header.len + header.chunkSize;
          this.header = header;
          debug(`pos=${this.tokenizer.position}, readChunk: chunkID=RIFF/WAVE/${header.chunkID}`);
          switch (header.chunkID) {
            case "LIST":
              await this.parseListTag(header);
              break;
            case "fact":
              this.metadata.setFormat("lossless", false);
              this.fact = await this.tokenizer.readToken(new WaveChunk.FactChunk(header));
              break;
            case "fmt ":
              const fmt = await this.tokenizer.readToken(new WaveChunk.Format(header));
              let subFormat = WaveChunk.WaveFormat[fmt.wFormatTag];
              if (!subFormat) {
                debug("WAVE/non-PCM format=" + fmt.wFormatTag);
                subFormat = "non-PCM (" + fmt.wFormatTag + ")";
              }
              this.metadata.setFormat("codec", subFormat);
              this.metadata.setFormat("bitsPerSample", fmt.wBitsPerSample);
              this.metadata.setFormat("sampleRate", fmt.nSamplesPerSec);
              this.metadata.setFormat("numberOfChannels", fmt.nChannels);
              this.metadata.setFormat("bitrate", fmt.nBlockAlign * fmt.nSamplesPerSec * 8);
              this.blockAlign = fmt.nBlockAlign;
              break;
            case "id3 ":
            case "ID3 ":
              const id3_data = await this.tokenizer.readToken(new Token2.BufferType(header.chunkSize));
              const rst = strtok32.fromBuffer(id3_data);
              await new ID3v2Parser_1.ID3v2Parser().parse(this.metadata, rst, this.options);
              break;
            case "data":
              if (this.metadata.format.lossless !== false) {
                this.metadata.setFormat("lossless", true);
              }
              const numberOfSamples = this.fact ? this.fact.dwSampleLength : header.chunkSize === 4294967295 ? void 0 : header.chunkSize / this.blockAlign;
              if (numberOfSamples) {
                this.metadata.setFormat("numberOfSamples", numberOfSamples);
                this.metadata.setFormat("duration", numberOfSamples / this.metadata.format.sampleRate);
              }
              this.metadata.setFormat("bitrate", this.metadata.format.numberOfChannels * this.blockAlign * this.metadata.format.sampleRate);
              await this.tokenizer.ignore(header.chunkSize);
              break;
            default:
              debug(`Ignore chunk: RIFF/${header.chunkID} of ${header.chunkSize} bytes`);
              this.metadata.addWarning("Ignore chunk: RIFF/" + header.chunkID);
              await this.tokenizer.ignore(header.chunkSize);
          }
          if (this.header.chunkSize % 2 === 1) {
            debug("Read odd padding byte");
            await this.tokenizer.ignore(1);
          }
        }
      }
      async parseListTag(listHeader) {
        const listType = await this.tokenizer.readToken(new Token2.StringType(4, "binary"));
        debug("pos=%s, parseListTag: chunkID=RIFF/WAVE/LIST/%s", this.tokenizer.position, listType);
        switch (listType) {
          case "INFO":
            return this.parseRiffInfoTags(listHeader.chunkSize - 4);
          case "adtl":
          default:
            this.metadata.addWarning("Ignore chunk: RIFF/WAVE/LIST/" + listType);
            debug("Ignoring chunkID=RIFF/WAVE/LIST/" + listType);
            return this.tokenizer.ignore(listHeader.chunkSize - 4).then();
        }
      }
      async parseRiffInfoTags(chunkSize) {
        while (chunkSize >= 8) {
          const header = await this.tokenizer.readToken(riff.Header);
          const valueToken = new riff.ListInfoTagValue(header);
          const value = await this.tokenizer.readToken(valueToken);
          this.addTag(header.chunkID, Util_1.default.stripNulls(value));
          chunkSize -= 8 + valueToken.len;
        }
        if (chunkSize !== 0) {
          throw Error("Illegal remaining size: " + chunkSize);
        }
      }
      addTag(id, value) {
        this.metadata.addTag("exif", id, value);
      }
    };
    exports2.WaveParser = WaveParser;
  }
});

// node_modules/music-metadata/lib/wavpack/WavPackToken.js
var require_WavPackToken = __commonJS({
  "node_modules/music-metadata/lib/wavpack/WavPackToken.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.WavPack = void 0;
    var Token2 = require_lib3();
    var FourCC_1 = require_FourCC();
    var SampleRates = [
      6e3,
      8e3,
      9600,
      11025,
      12e3,
      16e3,
      22050,
      24e3,
      32e3,
      44100,
      48e3,
      64e3,
      88200,
      96e3,
      192e3,
      -1
    ];
    var WavPack = class {
      static isBitSet(flags, bitOffset) {
        return WavPack.getBitAllignedNumber(flags, bitOffset, 1) === 1;
      }
      static getBitAllignedNumber(flags, bitOffset, len) {
        return flags >>> bitOffset & 4294967295 >>> 32 - len;
      }
    };
    exports2.WavPack = WavPack;
    WavPack.BlockHeaderToken = {
      len: 32,
      get: (buf, off) => {
        const flags = Token2.UINT32_LE.get(buf, off + 24);
        const res = {
          BlockID: FourCC_1.FourCcToken.get(buf, off),
          blockSize: Token2.UINT32_LE.get(buf, off + 4),
          version: Token2.UINT16_LE.get(buf, off + 8),
          totalSamples: Token2.UINT32_LE.get(buf, off + 12),
          blockIndex: Token2.UINT32_LE.get(buf, off + 16),
          blockSamples: Token2.UINT32_LE.get(buf, off + 20),
          flags: {
            bitsPerSample: (1 + WavPack.getBitAllignedNumber(flags, 0, 2)) * 8,
            isMono: WavPack.isBitSet(flags, 2),
            isHybrid: WavPack.isBitSet(flags, 3),
            isJointStereo: WavPack.isBitSet(flags, 4),
            crossChannel: WavPack.isBitSet(flags, 5),
            hybridNoiseShaping: WavPack.isBitSet(flags, 6),
            floatingPoint: WavPack.isBitSet(flags, 7),
            samplingRate: SampleRates[WavPack.getBitAllignedNumber(flags, 23, 4)],
            isDSD: WavPack.isBitSet(flags, 31)
          },
          crc: new Token2.BufferType(4).get(buf, off + 28)
        };
        if (res.flags.isDSD) {
          res.totalSamples *= 8;
        }
        return res;
      }
    };
    WavPack.MetadataIdToken = {
      len: 1,
      get: (buf, off) => {
        return {
          functionId: WavPack.getBitAllignedNumber(buf[off], 0, 6),
          isOptional: WavPack.isBitSet(buf[off], 5),
          isOddSize: WavPack.isBitSet(buf[off], 6),
          largeBlock: WavPack.isBitSet(buf[off], 7)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/wavpack/WavPackParser.js
var require_WavPackParser = __commonJS({
  "node_modules/music-metadata/lib/wavpack/WavPackParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.WavPackParser = void 0;
    var Token2 = require_lib3();
    var APEv2Parser_1 = require_APEv2Parser();
    var FourCC_1 = require_FourCC();
    var BasicParser_1 = require_BasicParser();
    var WavPackToken_1 = require_WavPackToken();
    var initDebug = require_src();
    var debug = initDebug("music-metadata:parser:WavPack");
    var WavPackParser = class extends BasicParser_1.BasicParser {
      async parse() {
        this.audioDataSize = 0;
        await this.parseWavPackBlocks();
        return APEv2Parser_1.APEv2Parser.tryParseApeHeader(this.metadata, this.tokenizer, this.options);
      }
      async parseWavPackBlocks() {
        do {
          const blockId = await this.tokenizer.peekToken(FourCC_1.FourCcToken);
          if (blockId !== "wvpk")
            break;
          const header = await this.tokenizer.readToken(WavPackToken_1.WavPack.BlockHeaderToken);
          if (header.BlockID !== "wvpk")
            throw new Error("Invalid WavPack Block-ID");
          debug(`WavPack header blockIndex=${header.blockIndex}, len=${WavPackToken_1.WavPack.BlockHeaderToken.len}`);
          if (header.blockIndex === 0 && !this.metadata.format.container) {
            this.metadata.setFormat("container", "WavPack");
            this.metadata.setFormat("lossless", !header.flags.isHybrid);
            this.metadata.setFormat("bitsPerSample", header.flags.bitsPerSample);
            if (!header.flags.isDSD) {
              this.metadata.setFormat("sampleRate", header.flags.samplingRate);
              this.metadata.setFormat("duration", header.totalSamples / header.flags.samplingRate);
            }
            this.metadata.setFormat("numberOfChannels", header.flags.isMono ? 1 : 2);
            this.metadata.setFormat("numberOfSamples", header.totalSamples);
            this.metadata.setFormat("codec", header.flags.isDSD ? "DSD" : "PCM");
          }
          const ignoreBytes = header.blockSize - (WavPackToken_1.WavPack.BlockHeaderToken.len - 8);
          if (header.blockIndex === 0) {
            await this.parseMetadataSubBlock(header, ignoreBytes);
          } else {
            await this.tokenizer.ignore(ignoreBytes);
          }
          if (header.blockSamples > 0) {
            this.audioDataSize += header.blockSize;
          }
        } while (!this.tokenizer.fileInfo.size || this.tokenizer.fileInfo.size - this.tokenizer.position >= WavPackToken_1.WavPack.BlockHeaderToken.len);
        this.metadata.setFormat("bitrate", this.audioDataSize * 8 / this.metadata.format.duration);
      }
      async parseMetadataSubBlock(header, remainingLength) {
        while (remainingLength > WavPackToken_1.WavPack.MetadataIdToken.len) {
          const id = await this.tokenizer.readToken(WavPackToken_1.WavPack.MetadataIdToken);
          const dataSizeInWords = await this.tokenizer.readNumber(id.largeBlock ? Token2.UINT24_LE : Token2.UINT8);
          const data = Buffer.alloc(dataSizeInWords * 2 - (id.isOddSize ? 1 : 0));
          await this.tokenizer.readBuffer(data);
          debug(`Metadata Sub-Blocks functionId=0x${id.functionId.toString(16)}, id.largeBlock=${id.largeBlock},data-size=${data.length}`);
          switch (id.functionId) {
            case 0:
              break;
            case 14:
              debug("ID_DSD_BLOCK");
              const mp = 1 << data.readUInt8(0);
              const samplingRate = header.flags.samplingRate * mp * 8;
              if (!header.flags.isDSD)
                throw new Error("Only expect DSD block if DSD-flag is set");
              this.metadata.setFormat("sampleRate", samplingRate);
              this.metadata.setFormat("duration", header.totalSamples / samplingRate);
              break;
            case 36:
              debug("ID_ALT_TRAILER: trailer for non-wav files");
              break;
            case 38:
              this.metadata.setFormat("audioMD5", data);
              break;
            case 47:
              debug(`ID_BLOCK_CHECKSUM: checksum=${data.toString("hex")}`);
              break;
            default:
              debug(`Ignore unsupported meta-sub-block-id functionId=0x${id.functionId.toString(16)}`);
              break;
          }
          remainingLength -= WavPackToken_1.WavPack.MetadataIdToken.len + (id.largeBlock ? Token2.UINT24_LE.len : Token2.UINT8.len) + dataSizeInWords * 2;
          debug(`remainingLength=${remainingLength}`);
          if (id.isOddSize)
            this.tokenizer.ignore(1);
        }
        if (remainingLength !== 0)
          throw new Error("metadata-sub-block should fit it remaining length");
      }
    };
    exports2.WavPackParser = WavPackParser;
  }
});

// node_modules/music-metadata/lib/dsf/DsfChunk.js
var require_DsfChunk = __commonJS({
  "node_modules/music-metadata/lib/dsf/DsfChunk.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.FormatChunk = exports2.ChannelType = exports2.DsdChunk = exports2.ChunkHeader = void 0;
    var Token2 = require_lib3();
    var FourCC_1 = require_FourCC();
    exports2.ChunkHeader = {
      len: 12,
      get: (buf, off) => {
        return {id: FourCC_1.FourCcToken.get(buf, off), size: Token2.UINT64_LE.get(buf, off + 4)};
      }
    };
    exports2.DsdChunk = {
      len: 16,
      get: (buf, off) => {
        return {
          fileSize: Token2.INT64_LE.get(buf, off),
          metadataPointer: Token2.INT64_LE.get(buf, off + 8)
        };
      }
    };
    var ChannelType;
    (function(ChannelType2) {
      ChannelType2[ChannelType2["mono"] = 1] = "mono";
      ChannelType2[ChannelType2["stereo"] = 2] = "stereo";
      ChannelType2[ChannelType2["channels"] = 3] = "channels";
      ChannelType2[ChannelType2["quad"] = 4] = "quad";
      ChannelType2[ChannelType2["4 channels"] = 5] = "4 channels";
      ChannelType2[ChannelType2["5 channels"] = 6] = "5 channels";
      ChannelType2[ChannelType2["5.1 channels"] = 7] = "5.1 channels";
    })(ChannelType = exports2.ChannelType || (exports2.ChannelType = {}));
    exports2.FormatChunk = {
      len: 40,
      get: (buf, off) => {
        return {
          formatVersion: Token2.INT32_LE.get(buf, off),
          formatID: Token2.INT32_LE.get(buf, off + 4),
          channelType: Token2.INT32_LE.get(buf, off + 8),
          channelNum: Token2.INT32_LE.get(buf, off + 12),
          samplingFrequency: Token2.INT32_LE.get(buf, off + 16),
          bitsPerSample: Token2.INT32_LE.get(buf, off + 20),
          sampleCount: Token2.INT64_LE.get(buf, off + 24),
          blockSizePerChannel: Token2.INT32_LE.get(buf, off + 32)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/dsf/DsfParser.js
var require_DsfParser = __commonJS({
  "node_modules/music-metadata/lib/dsf/DsfParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.DsfParser = void 0;
    var AbstractID3Parser_1 = require_AbstractID3Parser();
    var _debug = require_src();
    var DsfChunk_1 = require_DsfChunk();
    var ID3v2Parser_1 = require_ID3v2Parser();
    var debug = _debug("music-metadata:parser:DSF");
    var DsfParser = class extends AbstractID3Parser_1.AbstractID3Parser {
      async _parse() {
        const p0 = this.tokenizer.position;
        const chunkHeader = await this.tokenizer.readToken(DsfChunk_1.ChunkHeader);
        if (chunkHeader.id !== "DSD ")
          throw new Error("Invalid chunk signature");
        this.metadata.setFormat("container", "DSF");
        this.metadata.setFormat("lossless", true);
        const dsdChunk = await this.tokenizer.readToken(DsfChunk_1.DsdChunk);
        if (dsdChunk.metadataPointer === 0) {
          debug(`No ID3v2 tag present`);
        } else {
          debug(`expect ID3v2 at offset=${dsdChunk.metadataPointer}`);
          await this.parseChunks(dsdChunk.fileSize - chunkHeader.size);
          await this.tokenizer.ignore(dsdChunk.metadataPointer - this.tokenizer.position - p0);
          return new ID3v2Parser_1.ID3v2Parser().parse(this.metadata, this.tokenizer, this.options);
        }
      }
      async parseChunks(bytesRemaining) {
        while (bytesRemaining >= DsfChunk_1.ChunkHeader.len) {
          const chunkHeader = await this.tokenizer.readToken(DsfChunk_1.ChunkHeader);
          debug(`Parsing chunk name=${chunkHeader.id} size=${chunkHeader.size}`);
          switch (chunkHeader.id) {
            case "fmt ":
              const formatChunk = await this.tokenizer.readToken(DsfChunk_1.FormatChunk);
              this.metadata.setFormat("numberOfChannels", formatChunk.channelNum);
              this.metadata.setFormat("sampleRate", formatChunk.samplingFrequency);
              this.metadata.setFormat("bitsPerSample", formatChunk.bitsPerSample);
              this.metadata.setFormat("numberOfSamples", formatChunk.sampleCount);
              this.metadata.setFormat("duration", formatChunk.sampleCount / formatChunk.samplingFrequency);
              const bitrate = formatChunk.bitsPerSample * formatChunk.samplingFrequency * formatChunk.channelNum;
              this.metadata.setFormat("bitrate", bitrate);
              return;
            default:
              this.tokenizer.ignore(chunkHeader.size - DsfChunk_1.ChunkHeader.len);
              break;
          }
          bytesRemaining -= chunkHeader.size;
        }
      }
    };
    exports2.DsfParser = DsfParser;
  }
});

// node_modules/music-metadata/lib/dsdiff/DsdiffToken.js
var require_DsdiffToken = __commonJS({
  "node_modules/music-metadata/lib/dsdiff/DsdiffToken.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ChunkHeader = void 0;
    var Token2 = require_lib3();
    var FourCC_1 = require_FourCC();
    exports2.ChunkHeader = {
      len: 12,
      get: (buf, off) => {
        return {
          chunkID: FourCC_1.FourCcToken.get(buf, off),
          chunkSize: Token2.INT64_BE.get(buf, off + 4)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/dsdiff/DsdiffParser.js
var require_DsdiffParser = __commonJS({
  "node_modules/music-metadata/lib/dsdiff/DsdiffParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.DsdiffParser = void 0;
    var Token2 = require_lib3();
    var initDebug = require_src();
    var FourCC_1 = require_FourCC();
    var BasicParser_1 = require_BasicParser();
    var DsdiffToken_1 = require_DsdiffToken();
    var strtok32 = require_core();
    var ID3v2Parser_1 = require_ID3v2Parser();
    var debug = initDebug("music-metadata:parser:aiff");
    var DsdiffParser = class extends BasicParser_1.BasicParser {
      async parse() {
        const header = await this.tokenizer.readToken(DsdiffToken_1.ChunkHeader);
        if (header.chunkID !== "FRM8")
          throw new Error("Unexpected chunk-ID");
        const type = (await this.tokenizer.readToken(FourCC_1.FourCcToken)).trim();
        switch (type) {
          case "DSD":
            this.metadata.setFormat("container", `DSDIFF/${type}`);
            this.metadata.setFormat("lossless", true);
            return this.readFmt8Chunks(header.chunkSize - FourCC_1.FourCcToken.len);
          default:
            throw Error(`Unsupported DSDIFF type: ${type}`);
        }
      }
      async readFmt8Chunks(remainingSize) {
        while (remainingSize >= DsdiffToken_1.ChunkHeader.len) {
          const chunkHeader = await this.tokenizer.readToken(DsdiffToken_1.ChunkHeader);
          debug(`Chunk id=${chunkHeader.chunkID}`);
          await this.readData(chunkHeader);
          remainingSize -= DsdiffToken_1.ChunkHeader.len + chunkHeader.chunkSize;
        }
      }
      async readData(header) {
        debug(`Reading data of chunk[ID=${header.chunkID}, size=${header.chunkSize}]`);
        const p0 = this.tokenizer.position;
        switch (header.chunkID.trim()) {
          case "FVER":
            const version = await this.tokenizer.readToken(Token2.UINT32_LE);
            debug(`DSDIFF version=${version}`);
            break;
          case "PROP":
            const propType = await this.tokenizer.readToken(FourCC_1.FourCcToken);
            if (propType !== "SND ")
              throw new Error("Unexpected PROP-chunk ID");
            await this.handleSoundPropertyChunks(header.chunkSize - FourCC_1.FourCcToken.len);
            break;
          case "ID3":
            const id3_data = await this.tokenizer.readToken(new Token2.BufferType(header.chunkSize));
            const rst = strtok32.fromBuffer(id3_data);
            await new ID3v2Parser_1.ID3v2Parser().parse(this.metadata, rst, this.options);
            break;
          default:
            debug(`Ignore chunk[ID=${header.chunkID}, size=${header.chunkSize}]`);
            break;
          case "DSD":
            this.metadata.setFormat("numberOfSamples", header.chunkSize * 8 / this.metadata.format.numberOfChannels);
            this.metadata.setFormat("duration", this.metadata.format.numberOfSamples / this.metadata.format.sampleRate);
            break;
        }
        const remaining = header.chunkSize - (this.tokenizer.position - p0);
        if (remaining > 0) {
          debug(`After Parsing chunk, remaining ${remaining} bytes`);
          await this.tokenizer.ignore(remaining);
        }
      }
      async handleSoundPropertyChunks(remainingSize) {
        debug(`Parsing sound-property-chunks, remainingSize=${remainingSize}`);
        while (remainingSize > 0) {
          const sndPropHeader = await this.tokenizer.readToken(DsdiffToken_1.ChunkHeader);
          debug(`Sound-property-chunk[ID=${sndPropHeader.chunkID}, size=${sndPropHeader.chunkSize}]`);
          const p0 = this.tokenizer.position;
          switch (sndPropHeader.chunkID.trim()) {
            case "FS":
              const sampleRate = await this.tokenizer.readToken(Token2.UINT32_BE);
              this.metadata.setFormat("sampleRate", sampleRate);
              break;
            case "CHNL":
              const numChannels = await this.tokenizer.readToken(Token2.UINT16_BE);
              this.metadata.setFormat("numberOfChannels", numChannels);
              await this.handleChannelChunks(sndPropHeader.chunkSize - Token2.UINT16_BE.len);
              break;
            case "CMPR":
              const compressionIdCode = (await this.tokenizer.readToken(FourCC_1.FourCcToken)).trim();
              const count = await this.tokenizer.readToken(Token2.UINT8);
              const compressionName = await this.tokenizer.readToken(new Token2.StringType(count, "ascii"));
              if (compressionIdCode === "DSD") {
                this.metadata.setFormat("lossless", true);
                this.metadata.setFormat("bitsPerSample", 1);
              }
              this.metadata.setFormat("codec", `${compressionIdCode} (${compressionName})`);
              break;
            case "ABSS":
              const hours = await this.tokenizer.readToken(Token2.UINT16_BE);
              const minutes = await this.tokenizer.readToken(Token2.UINT8);
              const seconds = await this.tokenizer.readToken(Token2.UINT8);
              const samples = await this.tokenizer.readToken(Token2.UINT32_BE);
              debug(`ABSS ${hours}:${minutes}:${seconds}.${samples}`);
              break;
            case "LSCO":
              const lsConfig = await this.tokenizer.readToken(Token2.UINT16_BE);
              debug(`LSCO lsConfig=${lsConfig}`);
              break;
            case "COMT":
            default:
              debug(`Unknown sound-property-chunk[ID=${sndPropHeader.chunkID}, size=${sndPropHeader.chunkSize}]`);
              await this.tokenizer.ignore(sndPropHeader.chunkSize);
          }
          const remaining = sndPropHeader.chunkSize - (this.tokenizer.position - p0);
          if (remaining > 0) {
            debug(`After Parsing sound-property-chunk ${sndPropHeader.chunkSize}, remaining ${remaining} bytes`);
            await this.tokenizer.ignore(remaining);
          }
          remainingSize -= DsdiffToken_1.ChunkHeader.len + sndPropHeader.chunkSize;
          debug(`Parsing sound-property-chunks, remainingSize=${remainingSize}`);
        }
        if (this.metadata.format.lossless && this.metadata.format.sampleRate && this.metadata.format.numberOfChannels && this.metadata.format.bitsPerSample) {
          const bitrate = this.metadata.format.sampleRate * this.metadata.format.numberOfChannels * this.metadata.format.bitsPerSample;
          this.metadata.setFormat("bitrate", bitrate);
        }
      }
      async handleChannelChunks(remainingSize) {
        debug(`Parsing channel-chunks, remainingSize=${remainingSize}`);
        const channels = [];
        while (remainingSize >= FourCC_1.FourCcToken.len) {
          const channelId = await this.tokenizer.readToken(FourCC_1.FourCcToken);
          debug(`Channel[ID=${channelId}]`);
          channels.push(channelId);
          remainingSize -= FourCC_1.FourCcToken.len;
        }
        debug(`Channels: ${channels.join(", ")}`);
        return channels;
      }
    };
    exports2.DsdiffParser = DsdiffParser;
  }
});

// node_modules/music-metadata/lib/matroska/types.js
var require_types = __commonJS({
  "node_modules/music-metadata/lib/matroska/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.TrackType = exports2.TargetType = exports2.DataType = void 0;
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["string"] = 0] = "string";
      DataType2[DataType2["uint"] = 1] = "uint";
      DataType2[DataType2["uid"] = 2] = "uid";
      DataType2[DataType2["bool"] = 3] = "bool";
      DataType2[DataType2["binary"] = 4] = "binary";
      DataType2[DataType2["float"] = 5] = "float";
    })(DataType = exports2.DataType || (exports2.DataType = {}));
    var TargetType;
    (function(TargetType2) {
      TargetType2[TargetType2["shot"] = 10] = "shot";
      TargetType2[TargetType2["scene"] = 20] = "scene";
      TargetType2[TargetType2["track"] = 30] = "track";
      TargetType2[TargetType2["part"] = 40] = "part";
      TargetType2[TargetType2["album"] = 50] = "album";
      TargetType2[TargetType2["edition"] = 60] = "edition";
      TargetType2[TargetType2["collection"] = 70] = "collection";
    })(TargetType = exports2.TargetType || (exports2.TargetType = {}));
    var TrackType;
    (function(TrackType2) {
      TrackType2[TrackType2["video"] = 1] = "video";
      TrackType2[TrackType2["audio"] = 2] = "audio";
      TrackType2[TrackType2["complex"] = 3] = "complex";
      TrackType2[TrackType2["logo"] = 4] = "logo";
      TrackType2[TrackType2["subtitle"] = 17] = "subtitle";
      TrackType2[TrackType2["button"] = 18] = "button";
      TrackType2[TrackType2["control"] = 32] = "control";
    })(TrackType = exports2.TrackType || (exports2.TrackType = {}));
  }
});

// node_modules/music-metadata/lib/matroska/MatroskaDtd.js
var require_MatroskaDtd = __commonJS({
  "node_modules/music-metadata/lib/matroska/MatroskaDtd.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.elements = void 0;
    var types_1 = require_types();
    exports2.elements = {
      440786851: {
        name: "ebml",
        container: {
          17030: {name: "ebmlVersion", value: types_1.DataType.uint},
          17143: {name: "ebmlReadVersion", value: types_1.DataType.uint},
          17138: {name: "ebmlMaxIDWidth", value: types_1.DataType.uint},
          17139: {name: "ebmlMaxSizeWidth", value: types_1.DataType.uint},
          17026: {name: "docType", value: types_1.DataType.string},
          17031: {name: "docTypeVersion", value: types_1.DataType.uint},
          17029: {name: "docTypeReadVersion", value: types_1.DataType.uint}
        }
      },
      408125543: {
        name: "segment",
        container: {
          290298740: {
            name: "seekHead",
            container: {
              19899: {
                name: "seek",
                container: {
                  21419: {name: "seekId", value: types_1.DataType.binary},
                  21420: {name: "seekPosition", value: types_1.DataType.uint}
                }
              }
            }
          },
          357149030: {
            name: "info",
            container: {
              29604: {name: "uid", value: types_1.DataType.uid},
              29572: {name: "filename", value: types_1.DataType.string},
              3979555: {name: "prevUID", value: types_1.DataType.uid},
              3965867: {name: "prevFilename", value: types_1.DataType.string},
              4110627: {name: "nextUID", value: types_1.DataType.uid},
              4096955: {name: "nextFilename", value: types_1.DataType.string},
              2807729: {name: "timecodeScale", value: types_1.DataType.uint},
              17545: {name: "duration", value: types_1.DataType.float},
              17505: {name: "dateUTC", value: types_1.DataType.uint},
              31657: {name: "title", value: types_1.DataType.string},
              19840: {name: "muxingApp", value: types_1.DataType.string},
              22337: {name: "writingApp", value: types_1.DataType.string}
            }
          },
          524531317: {
            name: "cluster",
            multiple: true,
            container: {
              231: {name: "timecode", value: types_1.DataType.uid},
              163: {name: "unknown", value: types_1.DataType.binary},
              167: {name: "position", value: types_1.DataType.uid},
              171: {name: "prevSize", value: types_1.DataType.uid}
            }
          },
          374648427: {
            name: "tracks",
            container: {
              174: {
                name: "entries",
                multiple: true,
                container: {
                  215: {name: "trackNumber", value: types_1.DataType.uint},
                  29637: {name: "uid", value: types_1.DataType.uid},
                  131: {name: "trackType", value: types_1.DataType.uint},
                  185: {name: "flagEnabled", value: types_1.DataType.bool},
                  136: {name: "flagDefault", value: types_1.DataType.bool},
                  21930: {name: "flagForced", value: types_1.DataType.bool},
                  156: {name: "flagLacing", value: types_1.DataType.bool},
                  28135: {name: "minCache", value: types_1.DataType.uint},
                  28136: {name: "maxCache", value: types_1.DataType.uint},
                  2352003: {name: "defaultDuration", value: types_1.DataType.uint},
                  2306383: {name: "timecodeScale", value: types_1.DataType.float},
                  21358: {name: "name", value: types_1.DataType.string},
                  2274716: {name: "language", value: types_1.DataType.string},
                  134: {name: "codecID", value: types_1.DataType.string},
                  25506: {name: "codecPrivate", value: types_1.DataType.binary},
                  2459272: {name: "codecName", value: types_1.DataType.string},
                  3839639: {name: "codecSettings", value: types_1.DataType.string},
                  3883072: {name: "codecInfoUrl", value: types_1.DataType.string},
                  2536e3: {name: "codecDownloadUrl", value: types_1.DataType.string},
                  170: {name: "codecDecodeAll", value: types_1.DataType.bool},
                  28587: {name: "trackOverlay", value: types_1.DataType.uint},
                  224: {
                    name: "video",
                    container: {
                      154: {name: "flagInterlaced", value: types_1.DataType.bool},
                      21432: {name: "stereoMode", value: types_1.DataType.uint},
                      176: {name: "pixelWidth", value: types_1.DataType.uint},
                      186: {name: "pixelHeight", value: types_1.DataType.uint},
                      21680: {name: "displayWidth", value: types_1.DataType.uint},
                      21690: {name: "displayHeight", value: types_1.DataType.uint},
                      21683: {name: "aspectRatioType", value: types_1.DataType.uint},
                      3061028: {name: "colourSpace", value: types_1.DataType.uint},
                      3126563: {name: "gammaValue", value: types_1.DataType.float}
                    }
                  },
                  225: {
                    name: "audio",
                    container: {
                      181: {name: "samplingFrequency", value: types_1.DataType.float},
                      30901: {name: "outputSamplingFrequency", value: types_1.DataType.float},
                      159: {name: "channels", value: types_1.DataType.uint},
                      148: {name: "channels", value: types_1.DataType.uint},
                      32123: {name: "channelPositions", value: types_1.DataType.binary},
                      25188: {name: "bitDepth", value: types_1.DataType.uint}
                    }
                  },
                  28032: {
                    name: "contentEncodings",
                    container: {
                      25152: {
                        name: "contentEncoding",
                        container: {
                          20529: {name: "order", value: types_1.DataType.uint},
                          20530: {name: "scope", value: types_1.DataType.bool},
                          20531: {name: "type", value: types_1.DataType.uint},
                          20532: {
                            name: "contentEncoding",
                            container: {
                              16980: {name: "contentCompAlgo", value: types_1.DataType.uint},
                              16981: {name: "contentCompSettings", value: types_1.DataType.binary}
                            }
                          },
                          20533: {
                            name: "contentEncoding",
                            container: {
                              18401: {name: "contentEncAlgo", value: types_1.DataType.uint},
                              18402: {name: "contentEncKeyID", value: types_1.DataType.binary},
                              18403: {name: "contentSignature ", value: types_1.DataType.binary},
                              18404: {name: "ContentSigKeyID  ", value: types_1.DataType.binary},
                              18405: {name: "contentSigAlgo ", value: types_1.DataType.uint},
                              18406: {name: "contentSigHashAlgo ", value: types_1.DataType.uint}
                            }
                          },
                          25188: {name: "bitDepth", value: types_1.DataType.uint}
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          475249515: {
            name: "cues",
            container: {
              187: {
                name: "cuePoint",
                container: {
                  179: {name: "cueTime", value: types_1.DataType.uid},
                  183: {
                    name: "positions",
                    container: {
                      247: {name: "track", value: types_1.DataType.uint},
                      241: {name: "clusterPosition", value: types_1.DataType.uint},
                      21368: {name: "blockNumber", value: types_1.DataType.uint},
                      234: {name: "codecState", value: types_1.DataType.uint},
                      219: {
                        name: "reference",
                        container: {
                          150: {name: "time", value: types_1.DataType.uint},
                          151: {name: "cluster", value: types_1.DataType.uint},
                          21343: {name: "number", value: types_1.DataType.uint},
                          235: {name: "codecState", value: types_1.DataType.uint}
                        }
                      },
                      240: {name: "relativePosition", value: types_1.DataType.uint}
                    }
                  }
                }
              }
            }
          },
          423732329: {
            name: "attachments",
            container: {
              24999: {
                name: "attachedFiles",
                multiple: true,
                container: {
                  18046: {name: "description", value: types_1.DataType.string},
                  18030: {name: "name", value: types_1.DataType.string},
                  18016: {name: "mimeType", value: types_1.DataType.string},
                  18012: {name: "data", value: types_1.DataType.binary},
                  18094: {name: "uid", value: types_1.DataType.uid}
                }
              }
            }
          },
          272869232: {
            name: "chapters",
            container: {
              17849: {
                name: "editionEntry",
                container: {
                  182: {
                    name: "chapterAtom",
                    container: {
                      29636: {name: "uid", value: types_1.DataType.uid},
                      145: {name: "timeStart", value: types_1.DataType.uint},
                      146: {name: "timeEnd", value: types_1.DataType.uid},
                      152: {name: "hidden", value: types_1.DataType.bool},
                      17816: {name: "enabled", value: types_1.DataType.uid},
                      143: {
                        name: "track",
                        container: {
                          137: {name: "trackNumber", value: types_1.DataType.uid},
                          128: {
                            name: "display",
                            container: {
                              133: {name: "string", value: types_1.DataType.string},
                              17276: {name: "language ", value: types_1.DataType.string},
                              17278: {name: "country ", value: types_1.DataType.string}
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          307544935: {
            name: "tags",
            container: {
              29555: {
                name: "tag",
                multiple: true,
                container: {
                  25536: {
                    name: "target",
                    container: {
                      25541: {name: "tagTrackUID", value: types_1.DataType.uid},
                      25540: {name: "tagChapterUID", value: types_1.DataType.uint},
                      25542: {name: "tagAttachmentUID", value: types_1.DataType.uid},
                      25546: {name: "targetType", value: types_1.DataType.string},
                      26826: {name: "targetTypeValue", value: types_1.DataType.uint},
                      25545: {name: "tagEditionUID", value: types_1.DataType.uid}
                    }
                  },
                  26568: {
                    name: "simpleTags",
                    multiple: true,
                    container: {
                      17827: {name: "name", value: types_1.DataType.string},
                      17543: {name: "string", value: types_1.DataType.string},
                      17541: {name: "binary", value: types_1.DataType.binary},
                      17530: {name: "language", value: types_1.DataType.string},
                      17531: {name: "languageIETF", value: types_1.DataType.string},
                      17540: {name: "default", value: types_1.DataType.bool}
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/matroska/MatroskaParser.js
var require_MatroskaParser = __commonJS({
  "node_modules/music-metadata/lib/matroska/MatroskaParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.MatroskaParser = void 0;
    var Token2 = require_lib3();
    var _debug = require_src();
    var BasicParser_1 = require_BasicParser();
    var types_1 = require_types();
    var matroskaDtd = require_MatroskaDtd();
    var debug = _debug("music-metadata:parser:matroska");
    var MatroskaParser = class extends BasicParser_1.BasicParser {
      constructor() {
        super();
        this.padding = 0;
        this.parserMap = new Map();
        this.ebmlMaxIDLength = 4;
        this.ebmlMaxSizeLength = 8;
        this.parserMap.set(types_1.DataType.uint, (e) => this.readUint(e));
        this.parserMap.set(types_1.DataType.string, (e) => this.readString(e));
        this.parserMap.set(types_1.DataType.binary, (e) => this.readBuffer(e));
        this.parserMap.set(types_1.DataType.uid, async (e) => await this.readUint(e) === 1);
        this.parserMap.set(types_1.DataType.bool, (e) => this.readFlag(e));
        this.parserMap.set(types_1.DataType.float, (e) => this.readFloat(e));
      }
      init(metadata, tokenizer, options) {
        super.init(metadata, tokenizer, options);
        return this;
      }
      async parse() {
        const matroska = await this.parseContainer(matroskaDtd.elements, this.tokenizer.fileInfo.size, []);
        this.metadata.setFormat("container", `EBML/${matroska.ebml.docType}`);
        if (matroska.segment) {
          const info = matroska.segment.info;
          if (info) {
            const timecodeScale = info.timecodeScale ? info.timecodeScale : 1e6;
            const duration = info.duration * timecodeScale / 1e9;
            this.addTag("segment:title", info.title);
            this.metadata.setFormat("duration", duration);
          }
          const audioTracks = matroska.segment.tracks;
          if (audioTracks && audioTracks.entries) {
            audioTracks.entries.forEach((entry) => {
              const stream2 = {
                codecName: entry.codecID.replace("A_", "").replace("V_", ""),
                codecSettings: entry.codecSettings,
                flagDefault: entry.flagDefault,
                flagLacing: entry.flagLacing,
                flagEnabled: entry.flagEnabled,
                language: entry.language,
                name: entry.name,
                type: entry.trackType,
                audio: entry.audio,
                video: entry.video
              };
              this.metadata.addStreamInfo(stream2);
            });
            const audioTrack = audioTracks.entries.filter((entry) => {
              return entry.trackType === types_1.TrackType.audio.valueOf();
            }).reduce((acc, cur) => {
              if (!acc) {
                return cur;
              }
              if (!acc.flagDefault && cur.flagDefault) {
                return cur;
              }
              if (cur.trackNumber && cur.trackNumber < acc.trackNumber) {
                return cur;
              }
              return acc;
            }, null);
            if (audioTrack) {
              this.metadata.setFormat("codec", audioTrack.codecID.replace("A_", ""));
              this.metadata.setFormat("sampleRate", audioTrack.audio.samplingFrequency);
              this.metadata.setFormat("numberOfChannels", audioTrack.audio.channels);
            }
            if (matroska.segment.tags) {
              matroska.segment.tags.tag.forEach((tag) => {
                const target = tag.target;
                const targetType = target.targetTypeValue ? types_1.TargetType[target.targetTypeValue] : target.targetType ? target.targetType : types_1.TargetType.album;
                tag.simpleTags.forEach((simpleTag) => {
                  const value = simpleTag.string ? simpleTag.string : simpleTag.binary;
                  this.addTag(`${targetType}:${simpleTag.name}`, value);
                });
              });
            }
            if (matroska.segment.attachments) {
              matroska.segment.attachments.attachedFiles.filter((file) => file.mimeType.startsWith("image/")).map((file) => {
                return {
                  data: file.data,
                  format: file.mimeType,
                  description: file.description,
                  name: file.name
                };
              }).forEach((picture) => {
                this.addTag("picture", picture);
              });
            }
          }
        }
      }
      async parseContainer(container, posDone, path) {
        const tree = {};
        while (this.tokenizer.position < posDone) {
          let element;
          try {
            element = await this.readElement();
          } catch (error) {
            if (error.message === "End-Of-Stream") {
              break;
            }
            throw error;
          }
          const type = container[element.id];
          if (type) {
            debug(`Element: name=${type.name}, container=${!!type.container}`);
            if (type.container) {
              const res = await this.parseContainer(type.container, element.len >= 0 ? this.tokenizer.position + element.len : -1, path.concat([type.name]));
              if (type.multiple) {
                if (!tree[type.name]) {
                  tree[type.name] = [];
                }
                tree[type.name].push(res);
              } else {
                tree[type.name] = res;
              }
            } else {
              tree[type.name] = await this.parserMap.get(type.value)(element);
            }
          } else {
            switch (element.id) {
              case 236:
                this.padding += element.len;
                await this.tokenizer.ignore(element.len);
                break;
              default:
                debug(`parseEbml: path=${path.join("/")}, unknown element: id=${element.id.toString(16)}`);
                this.padding += element.len;
                await this.tokenizer.ignore(element.len);
            }
          }
        }
        return tree;
      }
      async readVintData(maxLength) {
        const msb = await this.tokenizer.peekNumber(Token2.UINT8);
        let mask = 128;
        let oc = 1;
        while ((msb & mask) === 0) {
          if (oc > maxLength) {
            throw new Error("VINT value exceeding maximum size");
          }
          ++oc;
          mask >>= 1;
        }
        const id = Buffer.alloc(oc);
        await this.tokenizer.readBuffer(id);
        return id;
      }
      async readElement() {
        const id = await this.readVintData(this.ebmlMaxIDLength);
        const lenField = await this.readVintData(this.ebmlMaxSizeLength);
        lenField[0] ^= 128 >> lenField.length - 1;
        const nrLen = Math.min(6, lenField.length);
        return {
          id: id.readUIntBE(0, id.length),
          len: lenField.readUIntBE(lenField.length - nrLen, nrLen)
        };
      }
      isMaxValue(vintData) {
        if (vintData.length === this.ebmlMaxSizeLength) {
          for (let n = 1; n < this.ebmlMaxSizeLength; ++n) {
            if (vintData[n] !== 255)
              return false;
          }
          return true;
        }
        return false;
      }
      async readFloat(e) {
        switch (e.len) {
          case 0:
            return 0;
          case 4:
            return this.tokenizer.readNumber(Token2.Float32_BE);
          case 8:
            return this.tokenizer.readNumber(Token2.Float64_BE);
          case 10:
            return this.tokenizer.readNumber(Token2.Float64_BE);
          default:
            throw new Error(`Invalid IEEE-754 float length: ${e.len}`);
        }
      }
      async readFlag(e) {
        return await this.readUint(e) === 1;
      }
      async readUint(e) {
        const buf = await this.readBuffer(e);
        const nrLen = Math.min(6, e.len);
        return buf.readUIntBE(e.len - nrLen, nrLen);
      }
      async readString(e) {
        return this.tokenizer.readToken(new Token2.StringType(e.len, "utf-8"));
      }
      async readBuffer(e) {
        const buf = Buffer.alloc(e.len);
        await this.tokenizer.readBuffer(buf);
        return buf;
      }
      addTag(tagId, value) {
        this.metadata.addTag("matroska", tagId, value);
      }
    };
    exports2.MatroskaParser = MatroskaParser;
  }
});

// node_modules/music-metadata/lib/ParserFactory.js
var require_ParserFactory = __commonJS({
  "node_modules/music-metadata/lib/ParserFactory.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ParserFactory = exports2.parseHttpContentType = void 0;
    var FileType = require_core2();
    var ContentType = require_content_type();
    var MimeType = require_media_typer();
    var _debug = require_src();
    var MetadataCollector_1 = require_MetadataCollector();
    var AiffParser_1 = require_AiffParser();
    var APEv2Parser_1 = require_APEv2Parser();
    var AsfParser_1 = require_AsfParser();
    var FlacParser_1 = require_FlacParser();
    var MP4Parser_1 = require_MP4Parser();
    var MpegParser_1 = require_MpegParser();
    var musepack_1 = require_musepack();
    var OggParser_1 = require_OggParser();
    var WaveParser_1 = require_WaveParser();
    var WavPackParser_1 = require_WavPackParser();
    var DsfParser_1 = require_DsfParser();
    var DsdiffParser_1 = require_DsdiffParser();
    var MatroskaParser_1 = require_MatroskaParser();
    var debug = _debug("music-metadata:parser:factory");
    function parseHttpContentType(contentType) {
      const type = ContentType.parse(contentType);
      const mime = MimeType.parse(type.type);
      return {
        type: mime.type,
        subtype: mime.subtype,
        suffix: mime.suffix,
        parameters: type.parameters
      };
    }
    exports2.parseHttpContentType = parseHttpContentType;
    var ParserFactory = class {
      static async parseOnContentType(tokenizer, opts) {
        const {mimeType, path, url} = await tokenizer.fileInfo;
        const parserId = ParserFactory.getParserIdForMimeType(mimeType) || ParserFactory.getParserIdForExtension(path) || ParserFactory.getParserIdForExtension(url);
        if (!parserId) {
          debug("No parser found for MIME-type / extension: " + mimeType);
        }
        return this.parse(tokenizer, parserId, opts);
      }
      static async parse(tokenizer, parserId, opts) {
        if (!parserId) {
          debug("Guess parser on content...");
          const buf = Buffer.alloc(4100);
          await tokenizer.peekBuffer(buf, {mayBeLess: true});
          if (tokenizer.fileInfo.path) {
            parserId = this.getParserIdForExtension(tokenizer.fileInfo.path);
          }
          if (!parserId) {
            const guessedType = await FileType.fromBuffer(buf);
            if (!guessedType) {
              throw new Error("Failed to determine audio format");
            }
            debug(`Guessed file type is mime=${guessedType.mime}, extension=${guessedType.ext}`);
            parserId = ParserFactory.getParserIdForMimeType(guessedType.mime);
            if (!parserId) {
              throw new Error("Guessed MIME-type not supported: " + guessedType.mime);
            }
          }
        }
        return this._parse(tokenizer, parserId, opts);
      }
      static getParserIdForExtension(filePath) {
        if (!filePath)
          return;
        const extension = this.getExtension(filePath).toLocaleLowerCase() || filePath;
        switch (extension) {
          case ".mp2":
          case ".mp3":
          case ".m2a":
          case ".aac":
            return "mpeg";
          case ".ape":
            return "apev2";
          case ".mp4":
          case ".m4a":
          case ".m4b":
          case ".m4pa":
          case ".m4v":
          case ".m4r":
          case ".3gp":
            return "mp4";
          case ".wma":
          case ".wmv":
          case ".asf":
            return "asf";
          case ".flac":
            return "flac";
          case ".ogg":
          case ".ogv":
          case ".oga":
          case ".ogm":
          case ".ogx":
          case ".opus":
          case ".spx":
            return "ogg";
          case ".aif":
          case ".aiff":
          case ".aifc":
            return "aiff";
          case ".wav":
            return "riff";
          case ".wv":
          case ".wvp":
            return "wavpack";
          case ".mpc":
            return "musepack";
          case ".dsf":
            return "dsf";
          case ".dff":
            return "dsdiff";
          case ".mka":
          case ".mkv":
          case ".mk3d":
          case ".mks":
          case ".webm":
            return "matroska";
        }
      }
      static async loadParser(moduleName) {
        switch (moduleName) {
          case "aiff":
            return new AiffParser_1.AIFFParser();
          case "adts":
          case "mpeg":
            return new MpegParser_1.MpegParser();
          case "apev2":
            return new APEv2Parser_1.APEv2Parser();
          case "asf":
            return new AsfParser_1.AsfParser();
          case "dsf":
            return new DsfParser_1.DsfParser();
          case "dsdiff":
            return new DsdiffParser_1.DsdiffParser();
          case "flac":
            return new FlacParser_1.FlacParser();
          case "mp4":
            return new MP4Parser_1.MP4Parser();
          case "musepack":
            return new musepack_1.default();
          case "ogg":
            return new OggParser_1.OggParser();
          case "riff":
            return new WaveParser_1.WaveParser();
          case "wavpack":
            return new WavPackParser_1.WavPackParser();
          case "matroska":
            return new MatroskaParser_1.MatroskaParser();
          default:
            throw new Error(`Unknown parser type: ${moduleName}`);
        }
      }
      static async _parse(tokenizer, parserId, opts = {}) {
        const parser = await ParserFactory.loadParser(parserId);
        const metadata = new MetadataCollector_1.MetadataCollector(opts);
        await parser.init(metadata, tokenizer, opts).parse();
        return metadata.toCommonMetadata();
      }
      static getExtension(fname) {
        const i = fname.lastIndexOf(".");
        return i === -1 ? "" : fname.slice(i);
      }
      static getParserIdForMimeType(httpContentType) {
        let mime;
        try {
          mime = parseHttpContentType(httpContentType);
        } catch (err) {
          debug(`Invalid HTTP Content-Type header value: ${httpContentType}`);
          return;
        }
        const subType = mime.subtype.indexOf("x-") === 0 ? mime.subtype.substring(2) : mime.subtype;
        switch (mime.type) {
          case "audio":
            switch (subType) {
              case "mp3":
              case "mpeg":
                return "mpeg";
              case "aac":
              case "aacp":
                return "adts";
              case "flac":
                return "flac";
              case "ape":
              case "monkeys-audio":
                return "apev2";
              case "mp4":
              case "m4a":
                return "mp4";
              case "ogg":
              case "opus":
              case "speex":
                return "ogg";
              case "ms-wma":
              case "ms-wmv":
              case "ms-asf":
                return "asf";
              case "aiff":
              case "aif":
              case "aifc":
                return "aiff";
              case "vnd.wave":
              case "wav":
              case "wave":
                return "riff";
              case "wavpack":
                return "wavpack";
              case "musepack":
                return "musepack";
              case "matroska":
              case "webm":
                return "matroska";
              case "dsf":
                return "dsf";
            }
            break;
          case "video":
            switch (subType) {
              case "ms-asf":
              case "ms-wmv":
                return "asf";
              case "m4v":
              case "mp4":
                return "mp4";
              case "ogg":
                return "ogg";
              case "matroska":
              case "webm":
                return "matroska";
            }
            break;
          case "application":
            switch (subType) {
              case "vnd.ms-asf":
                return "asf";
              case "ogg":
                return "ogg";
            }
            break;
        }
      }
    };
    exports2.ParserFactory = ParserFactory;
  }
});

// node_modules/music-metadata/lib/common/RandomBufferReader.js
var require_RandomBufferReader = __commonJS({
  "node_modules/music-metadata/lib/common/RandomBufferReader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.RandomBufferReader = void 0;
    var RandomBufferReader = class {
      constructor(buf) {
        this.buf = buf;
        this.fileSize = buf.length;
      }
      async randomRead(buffer, offset, length, position) {
        return this.buf.copy(buffer, offset, position, position + length);
      }
    };
    exports2.RandomBufferReader = RandomBufferReader;
  }
});

// node_modules/music-metadata/lib/lyrics3/Lyrics3.js
var require_Lyrics3 = __commonJS({
  "node_modules/music-metadata/lib/lyrics3/Lyrics3.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.getLyricsHeaderLength = exports2.endTag2 = void 0;
    exports2.endTag2 = "LYRICS200";
    async function getLyricsHeaderLength(reader) {
      if (reader.fileSize >= 143) {
        const buf = Buffer.alloc(15);
        await reader.randomRead(buf, 0, buf.length, reader.fileSize - 143);
        const txt = buf.toString("binary");
        const tag = txt.substr(6);
        if (tag === exports2.endTag2) {
          return parseInt(txt.substr(0, 6), 10) + 15;
        }
      }
      return 0;
    }
    exports2.getLyricsHeaderLength = getLyricsHeaderLength;
  }
});

// node_modules/music-metadata/lib/core.js
var require_core3 = __commonJS({
  "node_modules/music-metadata/lib/core.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.scanAppendingHeaders = exports2.selectCover = exports2.ratingToStars = exports2.orderTags = exports2.parseFromTokenizer = exports2.parseBuffer = exports2.parseStream = void 0;
    var strtok32 = require_core();
    var ParserFactory_1 = require_ParserFactory();
    var RandomBufferReader_1 = require_RandomBufferReader();
    var APEv2Parser_1 = require_APEv2Parser();
    var ID3v1Parser_1 = require_ID3v1Parser();
    var Lyrics3_1 = require_Lyrics3();
    function parseStream(stream2, fileInfo, options = {}) {
      return parseFromTokenizer(strtok32.fromStream(stream2, typeof fileInfo === "string" ? {mimeType: fileInfo} : fileInfo), options);
    }
    exports2.parseStream = parseStream;
    async function parseBuffer(buf, fileInfo, options = {}) {
      const bufferReader = new RandomBufferReader_1.RandomBufferReader(buf);
      await scanAppendingHeaders(bufferReader, options);
      const tokenizer = strtok32.fromBuffer(buf, typeof fileInfo === "string" ? {mimeType: fileInfo} : fileInfo);
      return parseFromTokenizer(tokenizer, options);
    }
    exports2.parseBuffer = parseBuffer;
    function parseFromTokenizer(tokenizer, options) {
      return ParserFactory_1.ParserFactory.parseOnContentType(tokenizer, options);
    }
    exports2.parseFromTokenizer = parseFromTokenizer;
    function orderTags(nativeTags) {
      const tags = {};
      for (const tag of nativeTags) {
        (tags[tag.id] = tags[tag.id] || []).push(tag.value);
      }
      return tags;
    }
    exports2.orderTags = orderTags;
    function ratingToStars(rating) {
      return rating === void 0 ? 0 : 1 + Math.round(rating * 4);
    }
    exports2.ratingToStars = ratingToStars;
    function selectCover(pictures) {
      return pictures ? pictures.reduce((acc, cur) => {
        if (cur.name && cur.name.toLowerCase() in ["front", "cover", "cover (front)"])
          return cur;
        return acc;
      }) : null;
    }
    exports2.selectCover = selectCover;
    async function scanAppendingHeaders(randomReader, options = {}) {
      let apeOffset = randomReader.fileSize;
      if (await ID3v1Parser_1.hasID3v1Header(randomReader)) {
        apeOffset -= 128;
        const lyricsLen = await Lyrics3_1.getLyricsHeaderLength(randomReader);
        apeOffset -= lyricsLen;
      }
      options.apeHeader = await APEv2Parser_1.APEv2Parser.findApeFooterOffset(randomReader, apeOffset);
    }
    exports2.scanAppendingHeaders = scanAppendingHeaders;
  }
});

// node_modules/music-metadata/lib/common/RandomFileReader.js
var require_RandomFileReader = __commonJS({
  "node_modules/music-metadata/lib/common/RandomFileReader.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.RandomFileReader = void 0;
    var fs2 = require("fs");
    var RandomFileReader = class {
      constructor(filePath, fileSize) {
        this.fileSize = fileSize;
        this.fd = fs2.openSync(filePath, "r");
      }
      randomRead(buffer, offset, length, position) {
        return new Promise((resolve, reject) => {
          fs2.read(this.fd, buffer, offset, length, position, (err, bytesRead) => {
            if (err) {
              reject(err);
            } else {
              resolve(bytesRead);
            }
          });
        });
      }
      close() {
        fs2.closeSync(this.fd);
      }
    };
    exports2.RandomFileReader = RandomFileReader;
  }
});

// node_modules/music-metadata/lib/index.js
var require_lib4 = __commonJS({
  "node_modules/music-metadata/lib/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {value: true});
    exports2.ratingToStars = exports2.orderTags = exports2.parseFile = exports2.parseStream = exports2.selectCover = exports2.parseBuffer = exports2.parseFromTokenizer = void 0;
    var strtok32 = require_lib2();
    var Core = require_core3();
    var ParserFactory_1 = require_ParserFactory();
    var _debug = require_src();
    var RandomFileReader_1 = require_RandomFileReader();
    var debug = _debug("music-metadata:parser");
    var core_1 = require_core3();
    Object.defineProperty(exports2, "parseFromTokenizer", {enumerable: true, get: function() {
      return core_1.parseFromTokenizer;
    }});
    Object.defineProperty(exports2, "parseBuffer", {enumerable: true, get: function() {
      return core_1.parseBuffer;
    }});
    Object.defineProperty(exports2, "selectCover", {enumerable: true, get: function() {
      return core_1.selectCover;
    }});
    async function parseStream(stream2, fileInfo, options = {}) {
      const tokenizer = await strtok32.fromStream(stream2, typeof fileInfo === "string" ? {mimeType: fileInfo} : fileInfo);
      return Core.parseFromTokenizer(tokenizer, options);
    }
    exports2.parseStream = parseStream;
    async function parseFile2(filePath, options = {}) {
      debug(`parseFile: ${filePath}`);
      const fileTokenizer = await strtok32.fromFile(filePath);
      const fileReader = new RandomFileReader_1.RandomFileReader(filePath, fileTokenizer.fileInfo.size);
      try {
        await Core.scanAppendingHeaders(fileReader, options);
      } finally {
        fileReader.close();
      }
      try {
        const parserName = ParserFactory_1.ParserFactory.getParserIdForExtension(filePath);
        if (!parserName)
          debug(" Parser could not be determined by file extension");
        return await ParserFactory_1.ParserFactory.parse(fileTokenizer, parserName, options);
      } finally {
        await fileTokenizer.close();
      }
    }
    exports2.parseFile = parseFile2;
    exports2.orderTags = Core.orderTags;
    exports2.ratingToStars = Core.ratingToStars;
  }
});

// extractWarpMarkers.js
__markAsModule(exports);
__export(exports, {
  default: () => extractWarpMarkers
});
var import_fs = __toModule(require("fs"));

// node_modules/lodash-es/last.js
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
var last_default = last;

// extractWarpMarkers.js
var import_music_metadata = __toModule(require_lib4());
var post = () => null;
function getMarkersArrayFromBuffer({buffer, filename, duration}) {
  var markersArr = [];
  var offset = 0;
  var index = 0;
  while ((index = buffer.indexOf("WarpMarker", index)) >= 0) {
    if (index >= 0) {
      offset += index;
      index = index + "WarpMarker".length + 4;
      post("pos", index);
      var pos = [buffer.readDoubleLE(index), buffer.readDoubleLE(index + 8)];
      post("found warp marker at", index + " " + pos[0] + "," + pos[1] + ",\n");
      if (pos[0] < duration)
        markersArr.push({
          beats: pos[1],
          ms: pos[0] * 1e3
        });
      else
        console.error("bad marker position (larger than duration encountered)", pos[0], pos[1], filename);
    }
  }
  if (markersArr.length > 2)
    markersArr.shift();
  return markersArr;
}
function extractFromBuffer({
  buffer,
  filename,
  duration,
  samprate,
  resolve
}) {
  var markersArr = getMarkersArrayFromBuffer({buffer, filename, duration});
  console.log("markersAfter", JSON.stringify(markersArr));
  const noMarkersFound = markersArr.length == 0;
  if (noMarkersFound) {
    console.error("No markers found. Press save! next to the live clip.");
  }
  var fm = markersArr[0];
  var lm = markersArr[markersArr.length - 1];
  var lastToFirstSpeed = (lm.beats - fm.beats) / (lm.ms - fm.ms);
  var refBpm = lastToFirstSpeed * 6e4;
  var newMarkers = [];
  for (var i = 0; i < markersArr.length - 1; i++) {
    var bpmNow = (markersArr[i + 1].beats - markersArr[i].beats) / (markersArr[i + 1].ms - markersArr[i].ms) * 1e3 * 60;
    var info = {
      sourcetime: markersArr[i].ms,
      bpm: bpmNow,
      beats: markersArr[i].beats
    };
    newMarkers.push(info);
  }
  var firstm = newMarkers[0];
  if (firstm.sourcetime > 0) {
    console.log("FirstMarker", JSON.stringify(firstm), "\n");
    var firstSpeed = firstm.bpm / 6e4;
    var info2 = {
      sourcetime: 0,
      bpm: firstm.bpm,
      beats: firstm.beats - firstm.sourcetime * firstSpeed
    };
    newMarkers.unshift(info2);
  }
  newMarkers[0].desttime = newMarkers[0].beats / refBpm * 60 * 1e3;
  var lm2 = newMarkers[newMarkers.length - 1];
  var lastBpm = newMarkers[newMarkers.length - 1].bpm;
  if (lm2.sourcetime < duration)
    newMarkers.push({
      sourcetime: duration,
      bpm: lastBpm,
      beats: lm2.beats + (duration - lm2.sourcetime) * lastBpm / 6e4
    });
  for (var i = 1; i < newMarkers.length; i++) {
    var relSpeed = newMarkers[i - 1].bpm / refBpm;
    newMarkers[i].desttime = newMarkers[i - 1].desttime + (newMarkers[i].sourcetime - newMarkers[i - 1].sourcetime) * relSpeed;
  }
  var lastSourceTime = -999999999;
  var lastDestTime = -999999999;
  var destTimes = [];
  var sourceTimes = [];
  var beatss = -1;
  var warpMarkers = newMarkers.map((marker) => {
    if (marker.desttime < lastDestTime || marker.sourcetime < lastSourceTime)
      return null;
    lastDestTime = Math.max(lastDestTime, marker.desttime);
    lastSourceTime = Math.max(lastSourceTime, marker.sourcetime);
    beatss = marker.desttime * refBpm / 6e4;
    var markerObj = {
      "desttime": marker.desttime,
      "sourcetime": marker.sourcetime,
      "beats": beatss,
      "playSpeed": refBpm / marker.bpm,
      "sourceBpm": marker.bpm,
      "desttimesample": Math.floor(marker.desttime * samprate / 1e3),
      "sourcetimesample": Math.floor(marker.sourcetime * samprate / 1e3),
      "samplesPerBeat": 1 / (marker.bpm / 60) * samprate
    };
    sourceTimes.push(marker.sourcetime / duration);
    destTimes.push(marker.desttime / duration);
    return markerObj;
  }).filter((w) => w !== null);
  const fileStat = import_fs.default.existsSync(filename) ? import_fs.default.statSync(filename) : {mtime: 0};
  var res = {
    error: null,
    path: filename,
    pathStat: JSON.parse(JSON.stringify(fileStat)),
    warpMarkers,
    baseBpm: refBpm,
    durationBeats: last_default(warpMarkers).beats - warpMarkers[0].beats,
    markersSaved: !noMarkersFound
  };
  resolve(res);
}
function extractWarpMarkers(path, duration, samprate) {
  return new Promise((resolveMe, reject) => {
    var filename = path + ".asd";
    import_fs.default.readFile(filename, (err, buffer) => extractFromBuffer({
      buffer,
      filename,
      duration,
      samprate,
      resolve: resolveMe
    }));
  });
}
var analyseAudio = async (path) => {
  const {format} = await (0, import_music_metadata.parseFile)(path);
  const {sampleRate, duration} = format;
  console.log(await extractWarpMarkers(path, duration, sampleRate));
};
analyseAudio(process.argv[2]);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
/*!
 * media-typer
 * Copyright(c) 2014-2017 Douglas Christopher Wilson
 * MIT Licensed
 */
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
