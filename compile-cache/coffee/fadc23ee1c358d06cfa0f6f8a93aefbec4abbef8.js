(function() {
  var $, CompositeDisposable, FtpHost, Host, HostView, SftpHost, TextEditorView, View, fs, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  Host = require('../model/host');

  SftpHost = require('../model/sftp-host');

  FtpHost = require('../model/ftp-host');

  fs = require('fs-plus');

  module.exports = HostView = (function(_super) {
    __extends(HostView, _super);

    function HostView() {
      return HostView.__super__.constructor.apply(this, arguments);
    }

    HostView.content = function() {
      return this.div({
        "class": 'host-view'
      }, (function(_this) {
        return function() {
          _this.label('Hostname');
          _this.subview('hostname', new TextEditorView({
            mini: true
          }));
          _this.label('Default directory');
          _this.subview('directory', new TextEditorView({
            mini: true
          }));
          _this.label('Username');
          _this.subview('username', new TextEditorView({
            mini: true
          }));
          _this.label('Port');
          _this.subview('port', new TextEditorView({
            mini: true
          }));
          _this.label('Alias (optional)');
          _this.subview('alias', new TextEditorView({
            mini: true
          }));
          _this.div({
            "class": 'block',
            outlet: 'authenticationButtonsBlock'
          }, function() {
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                "class": 'btn selected',
                outlet: 'userAgentButton',
                click: 'userAgentButtonClick'
              }, 'User agent');
              _this.button({
                "class": 'btn',
                outlet: 'privateKeyButton',
                click: 'privateKeyButtonClick'
              }, 'Private key');
              return _this.button({
                "class": 'btn',
                outlet: 'passwordButton',
                click: 'passwordButtonClick'
              }, 'Password');
            });
          });
          _this.div({
            "class": 'block',
            outlet: 'passwordBlock'
          }, function() {
            _this.label('Password (leave empty if you want to be prompted)');
            return _this.subview('password', new TextEditorView({
              mini: true
            }));
          });
          _this.div({
            "class": 'block',
            outlet: 'privateKeyBlock'
          }, function() {
            _this.label('Private key path');
            _this.subview('privateKeyPath', new TextEditorView({
              mini: true
            }));
            _this.label('Private key passphrase (leave blank if unencrypted)');
            return _this.subview('privateKeyPassphrase', new TextEditorView({
              mini: true
            }));
          });
          return _this.div({
            "class": 'block',
            outlet: 'buttonBlock'
          }, function() {
            _this.button({
              "class": 'inline-block btn pull-right',
              outlet: 'cancelButton',
              click: 'cancel'
            }, 'Cancel');
            return _this.button({
              "class": 'inline-block btn pull-right',
              outlet: 'saveButton',
              click: 'confirm'
            }, 'Save');
          });
        };
      })(this));
    };

    HostView.prototype.initialize = function(host, ipdw) {
      var _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      this.host = host;
      this.ipdw = ipdw;
      if (this.host == null) {
        throw new Error("Parameter \"host\" undefined!");
      }
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-workspace', {
        'core:confirm': (function(_this) {
          return function() {
            return _this.confirm();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function(event) {
            _this.cancel();
            return event.stopPropagation();
          };
        })(this)
      }));
      this.alias.setText((_ref1 = this.host.alias) != null ? _ref1 : "");
      this.hostname.setText((_ref2 = this.host.hostname) != null ? _ref2 : "");
      this.directory.setText((_ref3 = this.host.directory) != null ? _ref3 : "/");
      this.username.setText((_ref4 = this.host.username) != null ? _ref4 : "");
      this.port.setText((_ref5 = this.host.port) != null ? _ref5 : "");
      this.password.setText((_ref6 = this.host.password) != null ? _ref6 : "");
      this.privateKeyPath.setText((_ref7 = this.host.privateKeyPath) != null ? _ref7 : atom.config.get('remote-edit.sshPrivateKeyPath'));
      return this.privateKeyPassphrase.setText((_ref8 = this.host.passphrase) != null ? _ref8 : "");
    };

    HostView.prototype.userAgentButtonClick = function() {
      this.privateKeyButton.toggleClass('selected', false);
      this.userAgentButton.toggleClass('selected', true);
      this.passwordButton.toggleClass('selected', false);
      this.passwordBlock.hide();
      return this.privateKeyBlock.hide();
    };

    HostView.prototype.privateKeyButtonClick = function() {
      this.privateKeyButton.toggleClass('selected', true);
      this.userAgentButton.toggleClass('selected', false);
      this.passwordButton.toggleClass('selected', false);
      this.passwordBlock.hide();
      this.privateKeyBlock.show();
      return this.privateKeyPath.focus();
    };

    HostView.prototype.passwordButtonClick = function() {
      this.privateKeyButton.toggleClass('selected', false);
      this.userAgentButton.toggleClass('selected', false);
      this.passwordButton.toggleClass('selected', true);
      this.privateKeyBlock.hide();
      this.passwordBlock.show();
      return this.password.focus();
    };

    HostView.prototype.confirm = function() {
      this.cancel();
      if (this.host instanceof SftpHost) {
        this.host.useAgent = this.userAgentButton.hasClass('selected');
        this.host.usePrivateKey = this.privateKeyButton.hasClass('selected');
        this.host.usePassword = this.passwordButton.hasClass('selected');
        if (this.privateKeyButton.hasClass('selected')) {
          this.host.privateKeyPath = fs.absolute(this.privateKeyPath.getText());
          this.host.passphrase = this.privateKeyPassphrase.getText();
        }
        if (this.passwordButton.hasClass('selected')) {
          this.host.password = this.password.getText();
        }
      } else if (this.host instanceof FtpHost) {
        this.host.usePassword = true;
        this.host.password = this.password.getText();
      } else {
        throw new Error("\"host\" is not valid type!", this.host);
      }
      this.host.alias = this.alias.getText();
      this.host.hostname = this.hostname.getText();
      this.host.directory = this.directory.getText();
      this.host.username = this.username.getText();
      this.host.port = this.port.getText();
      if (this.ipdw != null) {
        return this.ipdw.getData().then((function(_this) {
          return function(data) {
            data.hostList.push(_this.host);
            return _this.ipdw.commit();
          };
        })(this));
      } else {
        return this.host.invalidate();
      }
    };

    HostView.prototype.destroy = function() {
      return this.disposables.dispose();
    };

    HostView.prototype.cancel = function() {
      this.cancelled();
      this.restoreFocus();
      return this.destroy();
    };

    HostView.prototype.cancelled = function() {
      return this.hide();
    };

    HostView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    HostView.prototype.show = function() {
      if (this.host instanceof SftpHost) {
        this.authenticationButtonsBlock.show();
        if (this.host.usePassword) {
          this.passwordButton.click();
        } else if (this.host.usePrivateKey) {
          this.privateKeyButton.click();
        } else if (this.host.useAgent) {
          this.userAgentButton.click();
        }
      } else if (this.host instanceof FtpHost) {
        this.authenticationButtonsBlock.hide();
        this.passwordBlock.show();
        this.privateKeyBlock.hide();
      } else {
        throw new Error("\"host\" is unknown!", this.host);
      }
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      return this.hostname.focus();
    };

    HostView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    HostView.prototype.storeFocusedElement = function() {
      return this.previouslyFocusedElement = $(document.activeElement);
    };

    HostView.prototype.restoreFocus = function() {
      var _ref1;
      return (_ref1 = this.previouslyFocusedElement) != null ? _ref1.focus() : void 0;
    };

    return HostView;

  })(View);

}).call(this);
