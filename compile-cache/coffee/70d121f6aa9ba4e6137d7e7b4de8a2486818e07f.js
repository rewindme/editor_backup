(function() {
  var Host, LocalFile, Path, RemoteFile, Serializable, SftpHost, async, filesize, fs, moment, osenv, ssh2, util, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Host = require('./host');

  RemoteFile = require('./remote-file');

  LocalFile = require('./local-file');

  fs = require('fs-plus');

  ssh2 = require('ssh2');

  async = require('async');

  util = require('util');

  filesize = require('file-size');

  moment = require('moment');

  Serializable = require('serializable');

  Path = require('path');

  osenv = require('osenv');

  _ = require('underscore-plus');

  module.exports = SftpHost = (function(_super) {
    __extends(SftpHost, _super);

    Serializable.includeInto(SftpHost);

    atom.deserializers.add(SftpHost);

    Host.registerDeserializers(SftpHost);

    SftpHost.prototype.connection = void 0;

    SftpHost.prototype.protocol = "sftp";

    function SftpHost(alias, hostname, directory, username, port, localFiles, usePassword, useAgent, usePrivateKey, password, passphrase, privateKeyPath) {
      this.alias = alias != null ? alias : null;
      this.hostname = hostname;
      this.directory = directory;
      this.username = username;
      this.port = port != null ? port : "22";
      this.localFiles = localFiles != null ? localFiles : [];
      this.usePassword = usePassword != null ? usePassword : false;
      this.useAgent = useAgent != null ? useAgent : true;
      this.usePrivateKey = usePrivateKey != null ? usePrivateKey : false;
      this.password = password;
      this.passphrase = passphrase;
      this.privateKeyPath = privateKeyPath;
      SftpHost.__super__.constructor.call(this, this.alias, this.hostname, this.directory, this.username, this.port, this.localFiles, this.usePassword);
    }

    SftpHost.prototype.getConnectionStringUsingAgent = function() {
      var connectionString;
      connectionString = {
        host: this.hostname,
        port: this.port,
        username: this.username
      };
      if (atom.config.get('remote-edit.agentToUse') !== 'Default') {
        _.extend(connectionString, {
          agent: atom.config.get('remote-edit.agentToUse')
        });
      } else if (process.platform === "win32") {
        _.extend(connectionString, {
          agent: 'pageant'
        });
      } else {
        _.extend(connectionString, {
          agent: process.env['SSH_AUTH_SOCK']
        });
      }
      return connectionString;
    };

    SftpHost.prototype.getConnectionStringUsingKey = function() {
      return {
        host: this.hostname,
        port: this.port,
        username: this.username,
        privateKey: this.getPrivateKey(this.privateKeyPath),
        passphrase: this.passphrase
      };
    };

    SftpHost.prototype.getConnectionStringUsingPassword = function() {
      return {
        host: this.hostname,
        port: this.port,
        username: this.username,
        password: this.password
      };
    };

    SftpHost.prototype.getPrivateKey = function(path) {
      if (path[0] === "~") {
        path = Path.normalize(osenv.home() + path.substring(1, path.length));
      }
      return fs.readFileSync(path, 'ascii', function(err, data) {
        if (err != null) {
          throw err;
        }
        return data.trim();
      });
    };

    SftpHost.prototype.createRemoteFileFromFile = function(path, file) {
      var remoteFile;
      remoteFile = new RemoteFile(Path.normalize("" + path + "/" + file.filename).split(Path.sep).join('/'), file.longname[0] !== 'd', file.longname[0] === 'd', filesize(file.attrs.size).human(), parseInt(file.attrs.mode, 10).toString(8).substr(2, 4), moment(file.attrs.mtime * 1000).format("HH:MM DD/MM/YYYY"));
      return remoteFile;
    };

    SftpHost.prototype.getConnectionString = function(connectionOptions) {
      if (this.useAgent) {
        return _.extend(this.getConnectionStringUsingAgent(), connectionOptions);
      } else if (this.usePrivateKey) {
        return _.extend(this.getConnectionStringUsingKey(), connectionOptions);
      } else if (this.usePassword) {
        return _.extend(this.getConnectionStringUsingPassword(), connectionOptions);
      } else {
        throw new Error("No valid connection method is set for SftpHost!");
      }
    };

    SftpHost.prototype.close = function(callback) {
      var _ref;
      if ((_ref = this.connection) != null) {
        _ref.end();
      }
      return typeof callback === "function" ? callback(null) : void 0;
    };

    SftpHost.prototype.connect = function(callback, connectionOptions) {
      if (connectionOptions == null) {
        connectionOptions = {};
      }
      this.emitter.emit('info', {
        message: "Connecting to sftp://" + this.username + "@" + this.hostname + ":" + this.port,
        className: 'text-info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            if (_this.usePrivateKey) {
              return fs.exists(_this.privateKeyPath, (function(exists) {
                if (exists) {
                  return callback(null);
                } else {
                  _this.emitter.emit('info', {
                    message: "Private key does not exist!",
                    className: 'text-error'
                  });
                  return callback(new Error("Private key does not exist"));
                }
              }));
            } else {
              return callback(null);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            _this.connection = new ssh2();
            _this.connection.on('error', function(err) {
              _this.emitter.emit('info', {
                message: "Error occured when connecting to sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port,
                className: 'text-error'
              });
              _this.connection.end();
              return callback(err);
            });
            _this.connection.on('ready', function() {
              _this.emitter.emit('info', {
                message: "Successfully connected to sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port,
                className: 'text-success'
              });
              return callback(null);
            });
            return _this.connection.connect(_this.getConnectionString(connectionOptions));
          };
        })(this)
      ], function(err) {
        return typeof callback === "function" ? callback(err) : void 0;
      });
    };

    SftpHost.prototype.isConnected = function() {
      return (this.connection != null) && this.connection._state === 'authenticated';
    };

    SftpHost.prototype.writeFile = function(file, text, callback) {
      this.emitter.emit('info', {
        message: "Writing remote file sftp://" + this.username + "@" + this.hostname + ":" + this.port + file.remoteFile.path,
        className: 'text-info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.sftp(callback);
          };
        })(this), function(sftp, callback) {
          return sftp.fastPut(file.path, file.remoteFile.path, callback);
        }
      ], (function(_this) {
        return function(err) {
          if (err != null) {
            _this.emitter.emit('info', {
              message: "Error occured when writing remote file sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + file.remoteFile.path,
              className: 'text-error'
            });
            if (err != null) {
              console.error(err);
            }
          } else {
            _this.emitter.emit('info', {
              message: "Successfully wrote remote file sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + file.remoteFile.path,
              className: 'text-success'
            });
          }
          _this.close();
          return typeof callback === "function" ? callback(err) : void 0;
        };
      })(this));
    };

    SftpHost.prototype.getFilesMetadata = function(path, callback) {
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.sftp(callback);
          };
        })(this), function(sftp, callback) {
          return sftp.readdir(path, callback);
        }, (function(_this) {
          return function(files, callback) {
            return async.map(files, (function(file, callback) {
              return callback(null, _this.createRemoteFileFromFile(path, file));
            }), callback);
          };
        })(this), function(objects, callback) {
          objects.push(new RemoteFile(path + "/..", false, true, null, null, null));
          objects.push(new RemoteFile(path + "/.", false, true, null, null, null));
          if (atom.config.get('remote-edit.showHiddenFiles')) {
            return callback(null, objects);
          } else {
            return async.filter(objects, (function(item, callback) {
              return item.isHidden(callback);
            }), (function(result) {
              return callback(null, result);
            }));
          }
        }
      ], (function(_this) {
        return function(err, result) {
          if (err != null) {
            _this.emitter.emit('info', {
              message: "Error occured when reading remote directory sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + ":" + path,
              className: 'text-error'
            });
            if (err != null) {
              console.error(err);
            }
            return typeof callback === "function" ? callback(err) : void 0;
          } else {
            return typeof callback === "function" ? callback(err, result.sort(function(a, b) {
              if (a.name.toLowerCase() >= b.name.toLowerCase()) {
                return 1;
              } else {
                return -1;
              }
            })) : void 0;
          }
        };
      })(this));
    };

    SftpHost.prototype.getFileData = function(file, callback) {
      this.emitter.emit('info', {
        message: "Getting remote file sftp://" + this.username + "@" + this.hostname + ":" + this.port + file.path,
        className: 'text-info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.sftp(callback);
          };
        })(this), function(sftp, callback) {
          var data, s;
          s = sftp.createReadStream(file.path);
          data = [];
          s.on('data', (function(d) {
            return data.push(d.toString());
          }));
          s.on('error', (function(error) {
            var e;
            e = new Error("ENOENT, open " + file.path);
            return typeof callback === "function" ? callback(e) : void 0;
          }));
          return s.on('close', (function() {
            return callback(null, data.join(''));
          }));
        }
      ], (function(_this) {
        return function(err, result) {
          if (err != null) {
            _this.emitter.emit('info', {
              message: "Error when reading remote file sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + file.path,
              className: 'text-error'
            });
          }
          if (err == null) {
            _this.emitter.emit('info', {
              message: "Successfully read remote file sftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + file.path,
              className: 'text-success'
            });
          }
          return typeof callback === "function" ? callback(err, result) : void 0;
        };
      })(this));
    };

    SftpHost.prototype.serializeParams = function() {
      var localFile;
      return {
        alias: this.alias,
        hostname: this.hostname,
        directory: this.directory,
        username: this.username,
        port: this.port,
        localFiles: JSON.stringify((function() {
          var _i, _len, _ref, _results;
          _ref = this.localFiles;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            localFile = _ref[_i];
            _results.push(localFile.serialize());
          }
          return _results;
        }).call(this)),
        useAgent: this.useAgent,
        usePrivateKey: this.usePrivateKey,
        usePassword: this.usePassword,
        password: this.password,
        passphrase: this.passphrase,
        privateKeyPath: this.privateKeyPath
      };
    };

    SftpHost.prototype.deserializeParams = function(params) {
      var localFile, localFileDeserialized, tmpArray, _i, _len, _ref;
      tmpArray = [];
      _ref = JSON.parse(params.localFiles);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        localFile = _ref[_i];
        localFileDeserialized = LocalFile.deserialize(localFile);
        tmpArray.push(localFileDeserialized);
      }
      params.localFiles = tmpArray;
      return params;
    };

    return SftpHost;

  })(Host);

}).call(this);
