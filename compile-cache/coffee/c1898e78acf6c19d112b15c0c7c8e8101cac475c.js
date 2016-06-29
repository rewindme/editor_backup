(function() {
  var CompositeDisposable, Emitter, FtpHost, Host, InterProcessData, LocalFile, MessagesView, RemoteEditEditor, RemoteFile, Serializable, SftpHost, _, _ref;

  Serializable = require('serializable');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  Host = null;

  FtpHost = null;

  SftpHost = null;

  LocalFile = null;

  RemoteFile = null;

  _ = null;

  MessagesView = null;

  RemoteEditEditor = null;

  module.exports = InterProcessData = (function() {
    Serializable.includeInto(InterProcessData);

    atom.deserializers.add(InterProcessData);

    function InterProcessData(hostList) {
      this.hostList = hostList;
      this.emitter = new Emitter;
      this.disposables = new CompositeDisposable;
      this.load(this.hostList);
    }

    InterProcessData.prototype.destroy = function() {
      var item, _i, _len, _ref1;
      this.disposables.dispose();
      this.emitter.dispose();
      _ref1 = this.hostList;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        item.destroy();
      }
      return this.hostList = [];
    };

    InterProcessData.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    InterProcessData.prototype.load = function(hostList) {
      var host, _i, _len, _ref1;
      this.hostList = hostList != null ? hostList : [];
      _ref1 = this.hostList;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        host = _ref1[_i];
        this.addSubscriptionToHost(host);
      }
      if (atom.config.get('remote-edit.messagePanel')) {
        if (MessagesView == null) {
          MessagesView = require('../view/messages-view');
        }
        if (this.messages == null) {
          this.messages = new MessagesView("Remote edit");
        }
        if (RemoteEditEditor == null) {
          RemoteEditEditor = require('../model/remote-edit-editor');
        }
        return this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            if (editor instanceof RemoteEditEditor) {
              return _this.disposables.add(editor.host.onInfo(function(info) {
                return _this.messages.postMessage(info);
              }));
            }
          };
        })(this)));
      }
    };

    InterProcessData.prototype.serializeParams = function() {
      var host;
      return {
        hostList: JSON.stringify((function() {
          var _i, _len, _ref1, _results;
          _ref1 = this.hostList;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            host = _ref1[_i];
            _results.push(host.serialize());
          }
          return _results;
        }).call(this))
      };
    };

    InterProcessData.prototype.deserializeParams = function(params) {
      var host, tmpArray, _i, _len, _ref1;
      tmpArray = [];
      if (params.hostList != null) {
        if (Host == null) {
          Host = require('./host');
        }
        if (FtpHost == null) {
          FtpHost = require('./ftp-host');
        }
        if (SftpHost == null) {
          SftpHost = require('./sftp-host');
        }
        if (LocalFile == null) {
          LocalFile = require('./local-file');
        }
        if (RemoteFile == null) {
          RemoteFile = require('./remote-file');
        }
        _ref1 = JSON.parse(params.hostList);
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          host = _ref1[_i];
          tmpArray.push(Host.deserialize(host));
        }
      }
      params.hostList = tmpArray;
      return params;
    };

    InterProcessData.prototype.addSubscriptionToHost = function(host) {
      this.disposables.add(host.onDidChange((function(_this) {
        return function() {
          return _this.emitter.emit('did-change');
        };
      })(this)));
      this.disposables.add(host.onDidDelete((function(_this) {
        return function(host) {
          if (_ == null) {
            _ = require('underscore-plus');
          }
          host.destroy();
          _this.hostList = _.reject(_this.hostList, (function(val) {
            return val === host;
          }));
          return _this.emitter.emit('did-change');
        };
      })(this)));
      if (atom.config.get('remote-edit.messagePanel')) {
        return this.disposables.add(host.onInfo((function(_this) {
          return function(info) {
            return _this.messages.postMessage(info);
          };
        })(this)));
      }
    };

    return InterProcessData;

  })();

}).call(this);
