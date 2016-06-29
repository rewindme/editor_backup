(function() {
  var Emitter, Host, Serializable, async, hash, osenv, _;

  Serializable = require('serializable');

  async = require('async');

  Emitter = require('atom').Emitter;

  hash = require('string-hash');

  _ = require('underscore-plus');

  osenv = require('osenv');

  module.exports = Host = (function() {
    Serializable.includeInto(Host);

    atom.deserializers.add(Host);

    function Host(alias, hostname, directory, username, port, localFiles, usePassword) {
      this.alias = alias != null ? alias : null;
      this.hostname = hostname;
      this.directory = directory != null ? directory : "/";
      this.username = username != null ? username : osenv.user();
      this.port = port;
      this.localFiles = localFiles != null ? localFiles : [];
      this.usePassword = usePassword;
      this.emitter = new Emitter;
    }

    Host.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    Host.prototype.getConnectionString = function() {
      throw new Error("Function getConnectionString() needs to be implemented by subclasses!");
    };

    Host.prototype.connect = function(callback, connectionOptions) {
      if (connectionOptions == null) {
        connectionOptions = {};
      }
      throw new Error("Function connect(callback) needs to be implemented by subclasses!");
    };

    Host.prototype.close = function(callback) {
      throw new Error("Needs to be implemented by subclasses!");
    };

    Host.prototype.getFilesMetadata = function(path, callback) {
      throw new Error("Function getFiles(Callback) needs to be implemented by subclasses!");
    };

    Host.prototype.getFileData = function(file, callback) {
      throw new Error("see subclass");
    };

    Host.prototype.serializeParams = function() {
      throw new Error("Must be implemented in subclass!");
    };

    Host.prototype.writeFile = function(file, text, callback) {
      throw new Error("Must be implemented in subclass!");
    };

    Host.prototype.isConnected = function() {
      throw new Error("Must be implemented in subclass!");
    };

    Host.prototype.hashCode = function() {
      return hash(this.hostname + this.directory + this.username + this.port);
    };

    Host.prototype.addLocalFile = function(localFile) {
      this.localFiles.push(localFile);
      return this.emitter.emit('did-change', localFile);
    };

    Host.prototype.removeLocalFile = function(localFile) {
      this.localFiles = _.reject(this.localFiles, (function(val) {
        return val === localFile;
      }));
      return this.emitter.emit('did-change', localFile);
    };

    Host.prototype["delete"] = function() {
      var file, _i, _len, _ref;
      _ref = this.localFiles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        file["delete"]();
      }
      return this.emitter.emit('did-delete', this);
    };

    Host.prototype.invalidate = function() {
      return this.emitter.emit('did-change');
    };

    Host.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    Host.prototype.onDidDelete = function(callback) {
      return this.emitter.on('did-delete', callback);
    };

    Host.prototype.onInfo = function(callback) {
      return this.emitter.on('info', callback);
    };

    return Host;

  })();

}).call(this);
