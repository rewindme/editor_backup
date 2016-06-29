(function() {
  var $, $$, CompositeDisposable, Dialog, FilesView, LocalFile, Q, SelectListView, async, fs, os, path, util, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView;

  CompositeDisposable = require('atom').CompositeDisposable;

  LocalFile = require('../model/local-file');

  Dialog = require('./dialog');

  fs = require('fs');

  os = require('os');

  async = require('async');

  util = require('util');

  path = require('path');

  Q = require('q');

  _ = require('underscore-plus');

  module.exports = FilesView = (function(_super) {
    __extends(FilesView, _super);

    function FilesView() {
      this.openDirectory = __bind(this.openDirectory, this);
      this.openFile = __bind(this.openFile, this);
      this.updatePath = __bind(this.updatePath, this);
      return FilesView.__super__.constructor.apply(this, arguments);
    }

    FilesView.prototype.initialize = function(host) {
      this.host = host;
      FilesView.__super__.initialize.apply(this, arguments);
      this.addClass('filesview');
      this.connect(this.host);
      this.disposables = new CompositeDisposable;
      return this.listenForEvents();
    };

    FilesView.prototype.connect = function(host, connectionOptions) {
      this.host = host;
      if (connectionOptions == null) {
        connectionOptions = {};
      }
      this.path = this.host.directory;
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            if (_this.host.usePassword && (connectionOptions.password == null)) {
              if (_this.host.password === "" || _this.host.password === '' || (_this.host.password == null)) {
                return async.waterfall([
                  function(callback) {
                    var passwordDialog;
                    passwordDialog = new Dialog({
                      prompt: "Enter password"
                    });
                    return passwordDialog.toggle(callback);
                  }
                ], function(err, result) {
                  connectionOptions = _.extend({
                    password: result
                  }, connectionOptions);
                  _this.toggle();
                  return callback(null);
                });
              } else {
                return callback(null);
              }
            } else {
              return callback(null);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            if (!_this.host.isConnected()) {
              _this.setLoading("Connecting...");
              return _this.host.connect(callback, connectionOptions);
            } else {
              return callback(null);
            }
          };
        })(this), (function(_this) {
          return function(callback) {
            return _this.populate(callback);
          };
        })(this)
      ], (function(_this) {
        return function(err, result) {
          if (err != null) {
            console.error(err);
            if (err.code === 450 || err.type === "PERMISSION_DENIED") {
              return _this.setError("You do not have read permission to what you've specified as the default directory! See the console for more info.");
            } else if (_this.host.usePassword && (err.code === 530 || err.level === "connection-ssh")) {
              return async.waterfall([
                function(callback) {
                  var passwordDialog;
                  passwordDialog = new Dialog({
                    prompt: "Enter password"
                  });
                  return passwordDialog.toggle(callback);
                }
              ], function(err, result) {
                _this.connect(_this.host, {
                  password: result
                });
                return _this.toggle();
              });
            } else {
              return _this.setError(err);
            }
          }
        };
      })(this));
    };

    FilesView.prototype.getFilterKey = function() {
      return "name";
    };

    FilesView.prototype.destroy = function() {
      return this.disposables.dispose();
    };

    FilesView.prototype.cancelled = function() {
      var _ref1;
      this.hide();
      if ((_ref1 = this.host) != null) {
        _ref1.close();
      }
      return this.destroy();
    };

    FilesView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    FilesView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      return this.focusFilterEditor();
    };

    FilesView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    FilesView.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            if (item.isFile) {
              _this.div({
                "class": 'primary-line icon icon-file-text'
              }, item.name);
              return _this.div({
                "class": 'secondary-line no-icon text-subtle'
              }, "Size: " + item.size + ", Mtime: " + item.lastModified + ", Permissions: " + item.permissions);
            } else if (item.isDir) {
              _this.div({
                "class": 'primary-line icon icon-file-directory'
              }, item.name);
              return _this.div({
                "class": 'secondary-line no-icon text-subtle'
              }, "Size: " + item.size + ", Mtime: " + item.lastModified + ", Permissions: " + item.permissions);
            } else {

            }
          };
        })(this));
      });
    };

    FilesView.prototype.populate = function(callback) {
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            _this.setLoading("Loading...");
            return _this.host.getFilesMetadata(_this.path, callback);
          };
        })(this), (function(_this) {
          return function(items, callback) {
            _this.setItems(items);
            return callback(void 0, void 0);
          };
        })(this)
      ], (function(_this) {
        return function(err, result) {
          if (err != null) {
            _this.setError(err);
          }
          return typeof callback === "function" ? callback(err, result) : void 0;
        };
      })(this));
    };

    FilesView.prototype.getNewPath = function(next) {
      if (this.path[this.path.length - 1] === "/") {
        return this.path + next;
      } else {
        return this.path + "/" + next;
      }
    };

    FilesView.prototype.updatePath = function(next) {
      return this.path = this.getNewPath(next);
    };

    FilesView.prototype.getDefaultSaveDirForHost = function(callback) {
      return async.waterfall([
        function(callback) {
          return fs.realpath(os.tmpDir(), callback);
        }, function(tmpDir, callback) {
          tmpDir = tmpDir + path.sep + "remote-edit";
          return fs.mkdir(tmpDir, (function(err) {
            if ((err != null) && err.code === 'EEXIST') {
              return callback(null, tmpDir);
            } else {
              return callback(err, tmpDir);
            }
          }));
        }, (function(_this) {
          return function(tmpDir, callback) {
            tmpDir = tmpDir + path.sep + _this.host.hashCode();
            return fs.mkdir(tmpDir, (function(err) {
              if ((err != null) && err.code === 'EEXIST') {
                return callback(null, tmpDir);
              } else {
                return callback(err, tmpDir);
              }
            }));
          };
        })(this)
      ], function(err, savePath) {
        return callback(err, savePath);
      });
    };

    FilesView.prototype.openFile = function(file) {
      this.setLoading("Downloading file...");
      return async.waterfall([
        (function(_this) {
          return function(callback) {
            return _this.getDefaultSaveDirForHost(callback);
          };
        })(this), (function(_this) {
          return function(savePath, callback) {
            savePath = savePath + path.sep + (new Date()).getTime().toString() + "-" + file.name;
            return _this.host.getFileData(file, (function(err, data) {
              return callback(err, data, savePath);
            }));
          };
        })(this), function(data, savePath, callback) {
          return fs.writeFile(savePath, data, function(err) {
            return callback(err, savePath);
          });
        }
      ], (function(_this) {
        return function(err, savePath) {
          var localFile, uri;
          if (err != null) {
            _this.setError(err);
            return console.error(err);
          } else {
            localFile = new LocalFile(savePath, file, _this.host);
            _this.host.addLocalFile(localFile);
            uri = "remote-edit://localFile/?localFile=" + (encodeURIComponent(JSON.stringify(localFile.serialize()))) + "&host=" + (encodeURIComponent(JSON.stringify(localFile.host.serialize())));
            atom.workspace.open(uri, {
              split: 'left'
            });
            _this.host.close();
            return _this.cancel();
          }
        };
      })(this));
    };

    FilesView.prototype.openDirectory = function(dir) {
      this.setLoading("Opening directory...");
      throw new Error("Not implemented yet!");
    };

    FilesView.prototype.confirmed = function(item) {
      if (item.isFile) {
        return this.openFile(item);
      } else if (item.isDir) {
        this.filterEditorView.setText('');
        this.setItems();
        this.updatePath(item.name);
        return this.populate();
      } else {
        return this.setError("Selected item is neither a file nor a directory!");
      }
    };

    FilesView.prototype.listenForEvents = function() {
      return this.disposables.add(atom.commands.add('atom-workspace', 'filesview:open', (function(_this) {
        return function() {
          var item;
          item = _this.getSelectedItem();
          if (item.isFile) {
            return _this.openFile(item);
          } else if (item.isDir) {
            return _this.openDirectory(item);
          }
        };
      })(this)));
    };

    return FilesView;

  })(SelectListView);

}).call(this);
