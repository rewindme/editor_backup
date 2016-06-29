(function() {
  var $, $$, CompositeDisposable, Emitter, FilesView, FtpHost, HostView, HostsView, SelectListView, SftpHost, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, SelectListView = _ref.SelectListView;

  _ref1 = require('atom'), CompositeDisposable = _ref1.CompositeDisposable, Emitter = _ref1.Emitter;

  _ = require('underscore-plus');

  FilesView = require('./files-view');

  HostView = require('./host-view');

  SftpHost = require('../model/sftp-host');

  FtpHost = require('../model/ftp-host');

  module.exports = HostsView = (function(_super) {
    __extends(HostsView, _super);

    function HostsView() {
      return HostsView.__super__.constructor.apply(this, arguments);
    }

    HostsView.prototype.initialize = function(ipdw) {
      this.ipdw = ipdw;
      HostsView.__super__.initialize.apply(this, arguments);
      this.createItemsFromIpdw();
      this.addClass('hosts-view');
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.ipdw.onDidChange((function(_this) {
        return function() {
          return _this.createItemsFromIpdw();
        };
      })(this)));
      return this.listenForEvents();
    };

    HostsView.prototype.destroy = function() {
      return this.disposables.dispose();
    };

    HostsView.prototype.cancel = function() {
      return this.cancelled();
    };

    HostsView.prototype.cancelled = function() {
      this.hide();
      this.restoreFocus();
      return this.destroy();
    };

    HostsView.prototype.toggle = function() {
      var _ref2;
      if ((_ref2 = this.panel) != null ? _ref2.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    HostsView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      return this.focusFilterEditor();
    };

    HostsView.prototype.hide = function() {
      var _ref2;
      return (_ref2 = this.panel) != null ? _ref2.hide() : void 0;
    };

    HostsView.prototype.getFilterKey = function() {
      return "hostname";
    };

    HostsView.prototype.viewForItem = function(item) {
      var keyBindings;
      keyBindings = this.keyBindings;
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            var authType;
            _this.div({
              "class": 'primary-line'
            }, function() {
              if (item.alias != null) {
                _this.span({
                  "class": 'inline-block highlight'
                }, "" + item.alias);
              }
              return _this.span({
                "class": 'inline-block'
              }, "" + item.username + "@" + item.hostname + ":" + item.port + ":" + item.directory);
            });
            if (item instanceof SftpHost) {
              authType = "not set";
              if (item.usePassword && (item.password === "" || item.password === '' || (item.password == null))) {
                authType = "password (not set)";
              } else if (item.usePassword) {
                authType = "password (set)";
              } else if (item.usePrivateKey) {
                authType = "key";
              } else if (item.useAgent) {
                authType = "agent";
              }
              return _this.div({
                "class": "secondary-line"
              }, ("Type: SFTP, Open files: " + item.localFiles.length + ", Auth: ") + authType);
            } else if (item instanceof FtpHost) {
              authType = "not set";
              if (item.usePassword && (item.password === "" || item.password === '' || (item.password == null))) {
                authType = "password (not set)";
              } else {
                authType = "password (set)";
              }
              return _this.div({
                "class": "secondary-line"
              }, ("Type: FTP, Open files: " + item.localFiles.length + ", Auth: ") + authType);
            } else {
              return _this.div({
                "class": "secondary-line"
              }, "Type: UNDEFINED");
            }
          };
        })(this));
      });
    };

    HostsView.prototype.confirmed = function(item) {
      var filesView;
      this.cancel();
      filesView = new FilesView(item);
      return filesView.toggle();
    };

    HostsView.prototype.listenForEvents = function() {
      this.disposables.add(atom.commands.add('atom-workspace', 'hostview:delete', (function(_this) {
        return function() {
          var item;
          item = _this.getSelectedItem();
          if (item != null) {
            _this.items = _.reject(_this.items, (function(val) {
              return val === item;
            }));
            item["delete"]();
            _this.populateList();
            return _this.setLoading();
          }
        };
      })(this)));
      return this.disposables.add(atom.commands.add('atom-workspace', 'hostview:edit', (function(_this) {
        return function() {
          var hostView, item;
          item = _this.getSelectedItem();
          if (item != null) {
            hostView = new HostView(item);
            hostView.toggle();
            return _this.cancel();
          }
        };
      })(this)));
    };

    HostsView.prototype.createItemsFromIpdw = function() {
      return this.ipdw.getData().then((function(_this) {
        return function(resolved) {
          return _this.setItems(resolved.hostList);
        };
      })(this));
    };

    return HostsView;

  })(SelectListView);

}).call(this);
