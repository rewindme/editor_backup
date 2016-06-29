(function() {
  var Host, LocalFile, RemoteFile, Serializable, fs;

  Serializable = require('serializable');

  RemoteFile = require('./remote-file');

  Host = require('./host');

  fs = require('fs-plus');

  module.exports = LocalFile = (function() {
    Serializable.includeInto(LocalFile);

    atom.deserializers.add(LocalFile);

    function LocalFile(path, remoteFile, host) {
      this.path = path;
      this.remoteFile = remoteFile;
      this.host = host != null ? host : null;
      this.name = this.remoteFile.name;
    }

    LocalFile.prototype.serializeParams = function() {
      return {
        path: this.path,
        remoteFile: this.remoteFile.serialize()
      };
    };

    LocalFile.prototype.deserializeParams = function(params) {
      params.remoteFile = RemoteFile.deserialize(params.remoteFile);
      return params;
    };

    LocalFile.prototype["delete"] = function() {
      var _ref;
      fs.unlink(this.path, function() {
        if (typeof err !== "undefined" && err !== null) {
          return console.error(err);
        }
      });
      return (_ref = this.host) != null ? _ref.removeLocalFile(this) : void 0;
    };

    return LocalFile;

  })();

}).call(this);
