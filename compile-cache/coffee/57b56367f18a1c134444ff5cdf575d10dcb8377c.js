(function() {
  var FtpHost, Host, LocalFile, Path, RemoteFile, Serializable, async, filesize, ftp, moment, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Host = require('./host');

  RemoteFile = require('./remote-file');

  LocalFile = require('./local-file');

  async = require('async');

  filesize = require('file-size');

  moment = require('moment');

  ftp = require('ftp');

  Serializable = require('serializable');

  Path = require('path');

  _ = require('underscore-plus');

  module.exports = FtpHost = (function(_super) {
    __extends(FtpHost, _super);

    Serializable.includeInto(FtpHost);

    atom.deserializers.add(FtpHost);

    Host.registerDeserializers(FtpHost);

    FtpHost.prototype.connection = void 0;

    FtpHost.prototype.protocol = "ftp";

    function FtpHost(alias, hostname, directory, username, port, localFiles, usePassword, password) {
      this.alias = alias != null ? alias : null;
      this.hostname = hostname;
      this.directory = directory;
      this.username = username;
      this.port = port != null ? port : "21";
      this.localFiles = localFiles != null ? localFiles : [];
      this.usePassword = usePassword != null ? usePassword : true;
      this.password = password;
      FtpHost.__super__.constructor.call(this, this.alias, this.hostname, this.directory, this.username, this.port, this.localFiles, this.usePassword);
    }

    FtpHost.prototype.createRemoteFileFromListObj = function(name, item) {
      var remoteFile;
      if (item.name == null) {
        return void 0;
      }
      remoteFile = new RemoteFile(Path.normalize(name + '/' + item.name).split(Path.sep).join('/'), false, false, filesize(item.size).human(), null, null);
      if (item.type === "d") {
        remoteFile.isDir = true;
      } else if (item.type === "-") {
        remoteFile.isFile = true;
      } else if (item.type === 'l') {
        remoteFile.isFile = true;
      }
      if (item.rights != null) {
        remoteFile.permissions = this.convertRWXToNumber(item.rights.user) + this.convertRWXToNumber(item.rights.group) + this.convertRWXToNumber(item.rights.other);
      }
      if (item.date != null) {
        remoteFile.lastModified = moment(item.date).format("HH:MM DD/MM/YYYY");
      }
      return remoteFile;
    };

    FtpHost.prototype.convertRWXToNumber = function(str) {
      var i, toreturn, _i, _len;
      toreturn = 0;
      for (_i = 0, _len = str.length; _i < _len; _i++) {
        i = str[_i];
        if (i === 'r') {
          toreturn += 4;
        } else if (i === 'w') {
          toreturn += 2;
        } else if (i === 'x') {
          toreturn += 1;
        }
      }
      return toreturn.toString();
    };

    FtpHost.prototype.getConnectionString = function(connectionOptions) {
      return _.extend({
        host: this.hostname,
        port: this.port,
        user: this.username,
        password: this.password
      }, connectionOptions);
    };

    FtpHost.prototype.close = function(callback) {
      var _ref;
      if ((_ref = this.connection) != null) {
        _ref.end();
      }
      return typeof callback === "function" ? callback(null) : void 0;
    };

    FtpHost.prototype.connect = function(callback, connectionOptions) {
      if (connectionOptions == null) {
        connectionOptions = {};
      }
      this.emitter.emit('info', {
        message: "Connecting to ftp://" + this.username + "@" + this.hostname + ":" + this.port,
        className: 'text-info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            _this.connection = new ftp();
            _this.connection.on('error', function(err) {
              _this.connection.end();
              _this.emitter.emit('info', {
                message: "Error occured when connecting to ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port,
                className: 'text-error'
              });
              return typeof callback === "function" ? callback(err) : void 0;
            });
            _this.connection.on('ready', function() {
              _this.emitter.emit('info', {
                message: "Successfully connected to ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port,
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

    FtpHost.prototype.isConnected = function() {
      return (this.connection != null) && this.connection.connected;
    };

    FtpHost.prototype.writeFile = function(file, text, callback) {
      this.emitter.emit('info', {
        message: "Writing remote file ftp://" + this.username + "@" + this.hostname + ":" + this.port + file.remoteFile.path,
        className: 'text-info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.put(new Buffer(text), file.remoteFile.path, callback);
          };
        })(this)
      ], (function(_this) {
        return function(err) {
          if (err != null) {
            _this.emitter.emit('info', {
              message: "Error occured when writing remote file ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + file.remoteFile.path,
              className: 'text-error'
            });
            if (err != null) {
              console.error(err);
            }
          } else {
            _this.emitter.emit('info', {
              message: "Successfully wrote remote file ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + file.remoteFile.path,
              className: 'text-success'
            });
          }
          _this.close();
          return typeof callback === "function" ? callback(err) : void 0;
        };
      })(this));
    };

    FtpHost.prototype.getFilesMetadata = function(path, callback) {
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.list(path, callback);
          };
        })(this), (function(_this) {
          return function(files, callback) {
            return async.map(files, (function(item, callback) {
              return callback(null, _this.createRemoteFileFromListObj(path, item));
            }), callback);
          };
        })(this), function(objects, callback) {
          return async.filter(objects, (function(item, callback) {
            return callback(item != null);
          }), (function(result) {
            return callback(null, result);
          }));
        }, function(objects, callback) {
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
              message: "Error occured when reading remote directory ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + ":" + path,
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

    FtpHost.prototype.getFileData = function(file, callback) {
      this.emitter.emit('info', {
        message: "Getting remote file ftp://" + this.username + "@" + this.hostname + ":" + this.port + file.path,
        className: 'text-info'
      });
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.connection.get(file.path, callback);
          };
        })(this), (function(_this) {
          return function(stream, callback) {
            var data;
            data = [];
            stream.on('data', function(chunk) {
              return data.push(chunk.toString());
            });
            stream.on('error', function(error) {
              return callback(error);
            });
            return stream.on('close', function() {
              return callback(null, data.join(''));
            });
          };
        })(this)
      ], (function(_this) {
        return function(err, result) {
          if (err != null) {
            _this.emitter.emit('info', {
              message: "Error when reading remote file ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + file.path,
              className: 'text-error'
            });
            return callback(err, null);
          } else {
            _this.emitter.emit('info', {
              message: "Successfully read remote file ftp://" + _this.username + "@" + _this.hostname + ":" + _this.port + file.path,
              className: 'text-success'
            });
            return typeof callback === "function" ? callback(err, result) : void 0;
          }
        };
      })(this));
    };

    FtpHost.prototype.serializeParams = function() {
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
        usePassword: this.usePassword,
        password: this.password
      };
    };

    FtpHost.prototype.deserializeParams = function(params) {
      var localFile, tmpArray, _i, _len, _ref;
      tmpArray = [];
      _ref = JSON.parse(params.localFiles);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        localFile = _ref[_i];
        tmpArray.push(LocalFile.deserialize(localFile, {
          host: this
        }));
      }
      params.localFiles = tmpArray;
      return params;
    };

    return FtpHost;

  })(Host);

}).call(this);
