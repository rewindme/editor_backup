(function() {
  var Path, RemoteFile, Serializable;

  Serializable = require('serializable');

  Path = require('path');

  module.exports = RemoteFile = (function() {
    Serializable.includeInto(RemoteFile);

    atom.deserializers.add(RemoteFile);

    function RemoteFile(path, isFile, isDir, size, permissions, lastModified) {
      this.path = path;
      this.isFile = isFile;
      this.isDir = isDir;
      this.size = size;
      this.permissions = permissions;
      this.lastModified = lastModified;
      this.name = Path.basename(this.path);
    }

    RemoteFile.prototype.isHidden = function(callback) {
      return callback(!(this.name[0] === "." && this.name.length > 2));
    };

    RemoteFile.prototype.serializeParams = function() {
      return {
        path: this.path,
        isFile: this.isFile,
        isDir: this.isDir,
        size: this.size,
        permissions: this.permissions,
        lastModified: this.lastModified
      };
    };

    return RemoteFile;

  })();

}).call(this);
