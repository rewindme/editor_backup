(function() {
  var FtpHost, Host, HostView, HostsView, InterProcessDataWatcher, LocalFile, OpenFilesView, Q, RemoteEditEditor, SftpHost, fs, url;

  RemoteEditEditor = require('./model/remote-edit-editor');

  OpenFilesView = null;

  HostView = null;

  HostsView = null;

  Host = null;

  SftpHost = null;

  FtpHost = null;

  LocalFile = null;

  url = null;

  Q = null;

  InterProcessDataWatcher = null;

  fs = null;

  module.exports = {
    config: {
      showHiddenFiles: {
        title: 'Show hidden files',
        type: 'boolean',
        "default": false
      },
      uploadOnSave: {
        title: 'Upload on save',
        description: 'When enabled, remote files will be automatically uploaded when saved',
        type: 'boolean',
        "default": true
      },
      messagePanel: {
        title: 'Display message panel',
        type: 'boolean',
        "default": true
      },
      sshPrivateKeyPath: {
        title: 'Path to private SSH key',
        type: 'string',
        "default": '~/.ssh/id_rsa'
      },
      defaultSerializePath: {
        title: 'Default path to serialize remoteEdit data',
        type: 'string',
        "default": '~/.atom/remoteEdit.json'
      },
      messagePanelTimeout: {
        title: 'Timeout for message panel',
        type: 'integer',
        "default": 6000
      },
      agentToUse: {
        title: 'SSH agent',
        description: 'Overrides default SSH agent. See ssh2 docs for more info.',
        type: 'string',
        "default": 'Default'
      }
    },
    activate: function(state) {
      this.setupOpeners();
      this.initializeIpdwIfNecessary();
      atom.commands.add('atom-workspace', 'remote-edit:show-open-files', (function(_this) {
        return function() {
          return _this.showOpenFiles();
        };
      })(this));
      atom.commands.add('atom-workspace', 'remote-edit:browse', (function(_this) {
        return function() {
          return _this.browse();
        };
      })(this));
      atom.commands.add('atom-workspace', 'remote-edit:new-host-sftp', (function(_this) {
        return function() {
          return _this.newHostSftp();
        };
      })(this));
      return atom.commands.add('atom-workspace', 'remote-edit:new-host-ftp', (function(_this) {
        return function() {
          return _this.newHostFtp();
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.ipdw) != null ? _ref.destroy() : void 0;
    },
    newHostSftp: function() {
      var host, view;
      if (HostView == null) {
        HostView = require('./view/host-view');
      }
      if (SftpHost == null) {
        SftpHost = require('./model/sftp-host');
      }
      host = new SftpHost();
      view = new HostView(host, this.getOrCreateIpdw());
      return view.toggle();
    },
    newHostFtp: function() {
      var host, view;
      if (HostView == null) {
        HostView = require('./view/host-view');
      }
      if (FtpHost == null) {
        FtpHost = require('./model/ftp-host');
      }
      host = new FtpHost();
      view = new HostView(host, this.getOrCreateIpdw());
      return view.toggle();
    },
    browse: function() {
      var view;
      if (HostsView == null) {
        HostsView = require('./view/hosts-view');
      }
      view = new HostsView(this.getOrCreateIpdw());
      return view.toggle();
    },
    showOpenFiles: function() {
      var showOpenFilesView;
      if (OpenFilesView == null) {
        OpenFilesView = require('./view/open-files-view');
      }
      showOpenFilesView = new OpenFilesView(this.getOrCreateIpdw());
      return showOpenFilesView.toggle();
    },
    initializeIpdwIfNecessary: function() {
      var editor, stop, _i, _len, _ref, _results;
      if (atom.config.get('remote-edit.messagePanel')) {
        stop = false;
        _ref = atom.workspace.getTextEditors();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          editor = _ref[_i];
          if (!stop) {
            if (editor instanceof RemoteEditEditor) {
              this.getOrCreateIpdw();
              _results.push(stop = true);
            } else {
              _results.push(void 0);
            }
          }
        }
        return _results;
      }
    },
    getOrCreateIpdw: function() {
      if (this.ipdw === void 0) {
        if (InterProcessDataWatcher == null) {
          InterProcessDataWatcher = require('./model/inter-process-data-watcher');
        }
        fs = require('fs-plus');
        return this.ipdw = new InterProcessDataWatcher(fs.absolute(atom.config.get('remote-edit.defaultSerializePath')));
      } else {
        return this.ipdw;
      }
    },
    setupOpeners: function() {
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, localFile, protocol, query, _ref;
        if (url == null) {
          url = require('url');
        }
        try {
          _ref = url.parse(uriToOpen, true), protocol = _ref.protocol, host = _ref.host, query = _ref.query;
        } catch (_error) {
          error = _error;
          return;
        }
        if (protocol !== 'remote-edit:') {
          return;
        }
        if (host === 'localfile') {
          if (Q == null) {
            Q = require('q');
          }
          if (Host == null) {
            Host = require('./model/host');
          }
          if (FtpHost == null) {
            FtpHost = require('./model/ftp-host');
          }
          if (SftpHost == null) {
            SftpHost = require('./model/sftp-host');
          }
          if (LocalFile == null) {
            LocalFile = require('./model/local-file');
          }
          localFile = LocalFile.deserialize(JSON.parse(decodeURIComponent(query.localFile)));
          host = Host.deserialize(JSON.parse(decodeURIComponent(query.host)));
          return atom.project.bufferForPath(localFile.path).then(function(buffer) {
            var editor;
            return editor = new RemoteEditEditor({
              buffer: buffer,
              registerEditor: true,
              host: host,
              localFile: localFile
            });
          });
        }
      });
    }
  };

}).call(this);
