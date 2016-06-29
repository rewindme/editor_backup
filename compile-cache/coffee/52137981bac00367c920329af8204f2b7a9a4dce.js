(function() {
  var $$, CompositeDisposable, LocalFile, OpenFilesView, Q, SelectListView, async, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, SelectListView = _ref.SelectListView;

  CompositeDisposable = require('atom').CompositeDisposable;

  async = require('async');

  Q = require('q');

  _ = require('underscore-plus');

  LocalFile = require('../model/local-file');

  module.exports = OpenFilesView = (function(_super) {
    __extends(OpenFilesView, _super);

    function OpenFilesView() {
      return OpenFilesView.__super__.constructor.apply(this, arguments);
    }

    OpenFilesView.prototype.initialize = function(ipdw) {
      this.ipdw = ipdw;
      OpenFilesView.__super__.initialize.apply(this, arguments);
      this.addClass('open-files-view');
      this.createItemsFromIpdw();
      this.disposables = new CompositeDisposable;
      this.disposables.add(this.ipdw.onDidChange((function(_this) {
        return function() {
          return _this.createItemsFromIpdw();
        };
      })(this)));
      return this.listenForEvents();
    };

    OpenFilesView.prototype.destroy = function() {
      return this.disposables.dispose();
    };

    OpenFilesView.prototype.cancelled = function() {
      return this.hide();
    };

    OpenFilesView.prototype.cancel = function() {
      this.cancelled();
      this.restoreFocus();
      return this.destroy();
    };

    OpenFilesView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    OpenFilesView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.storeFocusedElement();
      return this.focusFilterEditor();
    };

    OpenFilesView.prototype.hide = function() {
      var _ref1;
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    OpenFilesView.prototype.getFilterKey = function() {
      return "name";
    };

    OpenFilesView.prototype.viewForItem = function(localFile) {
      return $$(function() {
        return this.li({
          "class": 'local-file'
        }, "" + localFile.host.protocol + "://" + localFile.host.username + "@" + localFile.host.hostname + ":" + localFile.host.port + localFile.remoteFile.path);
      });
    };

    OpenFilesView.prototype.confirmed = function(localFile) {
      var uri;
      uri = "remote-edit://localFile/?localFile=" + (encodeURIComponent(JSON.stringify(localFile.serialize()))) + "&host=" + (encodeURIComponent(JSON.stringify(localFile.host.serialize())));
      atom.workspace.open(uri, {
        split: 'left'
      });
      return this.cancel();
    };

    OpenFilesView.prototype.listenForEvents = function() {
      return this.disposables.add(atom.commands.add('atom-workspace', 'openfilesview:delete', (function(_this) {
        return function() {
          var item;
          item = _this.getSelectedItem();
          if (item != null) {
            _this.items = _.reject(_this.items, (function(val) {
              return val === item;
            }));
            item["delete"]();
            return _this.setLoading();
          }
        };
      })(this)));
    };

    OpenFilesView.prototype.createItemsFromIpdw = function() {
      return this.ipdw.getData().then((function(_this) {
        return function(data) {
          var localFiles;
          localFiles = [];
          async.each(data.hostList, (function(host, callback) {
            return async.each(host.localFiles, (function(file, callback) {
              file.host = host;
              return localFiles.push(file);
            }), (function(err) {
              if (err != null) {
                return console.error(err);
              }
            }));
          }), (function(err) {
            if (err != null) {
              return console.error(err);
            }
          }));
          return _this.setItems(localFiles);
        };
      })(this));
    };

    return OpenFilesView;

  })(SelectListView);

}).call(this);
