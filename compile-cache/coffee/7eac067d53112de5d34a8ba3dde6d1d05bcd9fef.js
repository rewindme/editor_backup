(function() {
  var CompositeDisposable, Emitter, InterProcessData, InterProcessDataWatcher, Q, fs, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  Q = require('q');

  fs = require('fs-plus');

  InterProcessData = null;

  module.exports = InterProcessDataWatcher = (function() {
    function InterProcessDataWatcher(filePath) {
      this.filePath = filePath;
      this.justCommittedData = false;
      this.emitter = new Emitter;
      this.disposables = new CompositeDisposable;
      this.promisedData = Q.defer().promise;
      this.fsTimeout = void 0;
      fs.open(this.filePath, 'a', "0644", (function(_this) {
        return function() {
          _this.promisedData = _this.load();
          return _this.watcher();
        };
      })(this));
    }

    InterProcessDataWatcher.prototype.watcher = function() {
      return fs.watch(this.filePath, ((function(_this) {
        return function(event, filename) {
          if (_this.fsTimeout === void 0 && (event === 'changed' || event === 'rename')) {
            return _this.fsTimeout = setTimeout((function() {
              _this.fsTimeout = void 0;
              _this.reloadIfNecessary();
              return _this.watcher();
            }), 2000);
          }
        };
      })(this)));
    };

    InterProcessDataWatcher.prototype.reloadIfNecessary = function() {
      var _ref1;
      if (this.justCommittedData !== true) {
        if ((_ref1 = this.data) != null) {
          _ref1.destroy();
        }
        this.data = void 0;
        return this.promisedData = this.load();
      } else if (this.justCommittedData === true) {
        return this.justCommittedData = false;
      }
    };

    InterProcessDataWatcher.prototype.getData = function() {
      var deferred;
      deferred = Q.defer();
      if (this.data === void 0) {
        this.promisedData.then((function(_this) {
          return function(resolvedData) {
            _this.data = resolvedData;
            _this.disposables.add(_this.data.onDidChange(function() {
              return _this.commit();
            }));
            return deferred.resolve(_this.data);
          };
        })(this));
      } else {
        deferred.resolve(this.data);
      }
      return deferred.promise;
    };

    InterProcessDataWatcher.prototype.destroy = function() {
      var _ref1;
      this.disposables.dispose();
      this.emitter.dispose();
      return (_ref1 = this.data) != null ? _ref1.destroy() : void 0;
    };

    InterProcessDataWatcher.prototype.load = function() {
      var deferred;
      deferred = Q.defer();
      fs.readFile(this.filePath, 'utf8', ((function(_this) {
        return function(err, data) {
          if (InterProcessData == null) {
            InterProcessData = require('./inter-process-data');
          }
          if (err != null) {
            throw err;
          }
          if (data.length > 0) {
            data = InterProcessData.deserialize(JSON.parse(data));
            _this.emitter.emit('did-change');
            return deferred.resolve(data);
          } else {
            data = new InterProcessData([]);
            _this.emitter.emit('did-change');
            return deferred.resolve(data);
          }
        };
      })(this)));
      return deferred.promise;
    };

    InterProcessDataWatcher.prototype.commit = function() {
      this.justCommittedData = true;
      fs.writeFile(this.filePath, JSON.stringify(this.data.serialize()), function(err) {
        if (err != null) {
          throw err;
        }
      });
      return this.emitter.emit('did-change');
    };

    InterProcessDataWatcher.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    return InterProcessDataWatcher;

  })();

}).call(this);
