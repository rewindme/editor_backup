(function() {
  var AsciiDocPreviewView, CompositeDisposable, fs, isAsciiDocPreviewView, path, pdfconverter, renderer, url,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  url = require('url');

  path = require('path');

  fs = require('fs-plus');

  pdfconverter = require('./pdf-converter');

  AsciiDocPreviewView = null;

  renderer = null;

  isAsciiDocPreviewView = function(object) {
    if (AsciiDocPreviewView == null) {
      AsciiDocPreviewView = require('./asciidoc-preview-view');
    }
    return object instanceof AsciiDocPreviewView;
  };

  module.exports = {
    subscriptions: null,
    activate: function() {
      var extension, fileExtensions, previewFile, _i, _len;
      this.subscriptions = new CompositeDisposable;
      if (parseFloat(atom.getVersion()) < 1.7) {
        atom.deserializers.add({
          name: 'AsciiDocPreviewView',
          deserialize: module.exports.createAsciiDocPreviewView.bind(module.exports)
        });
      }
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'asciidoc-preview:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'asciidoc-preview:toggle-show-title': function() {
          var keyPath;
          keyPath = 'asciidoc-preview.showTitle';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        },
        'asciidoc-preview:toggle-compat-mode': function() {
          var keyPath;
          keyPath = 'asciidoc-preview.compatMode';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        },
        'asciidoc-preview:set-toc-none': function() {
          return atom.config.set('asciidoc-preview.tocType', 'none');
        },
        'asciidoc-preview:set-toc-preamble': function() {
          return atom.config.set('asciidoc-preview.tocType', 'preamble');
        },
        'asciidoc-preview:set-toc-macro': function() {
          return atom.config.set('asciidoc-preview.tocType', 'macro');
        },
        'asciidoc-preview:set-section-numbering-enabled-by-default': function() {
          return atom.config.set('asciidoc-preview.sectionNumbering', 'enabled-by-default');
        },
        'asciidoc-preview:set-section-numbering-always-enabled': function() {
          return atom.config.set('asciidoc-preview.sectionNumbering', 'always-enabled');
        },
        'asciidoc-preview:set-section-numbering-always-disabled': function() {
          return atom.config.set('asciidoc-preview.sectionNumbering', 'always-disabled');
        },
        'asciidoc-preview:set-section-numbering-not-specified': function() {
          return atom.config.set('asciidoc-preview.sectionNumbering', 'not-specified');
        },
        'asciidoc-preview:toggle-skip-front-matter': function() {
          var keyPath;
          keyPath = 'asciidoc-preview.skipFrontMatter';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        },
        'asciidoc-preview:toggle-render-on-save-only': function() {
          var keyPath;
          keyPath = 'asciidoc-preview.renderOnSaveOnly';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        }
      }));
      previewFile = this.previewFile.bind(this);
      fileExtensions = ['adoc', 'asciidoc', 'ad', 'asc', 'txt'];
      for (_i = 0, _len = fileExtensions.length; _i < _len; _i++) {
        extension = fileExtensions[_i];
        this.subscriptions.add(atom.commands.add(".tree-view .file .name[data-name$=\\." + extension + "]", 'asciidoc-preview:preview-file', previewFile));
        this.subscriptions.add(atom.commands.add(".tree-view .file .name[data-name$=\\." + extension + "]", 'asciidoc-preview:export-pdf', pdfconverter.convert));
      }
      return atom.workspace.addOpener((function(_this) {
        return function(uriToOpen) {
          var error, host, pathname, protocol, _ref;
          try {
            _ref = url.parse(uriToOpen), protocol = _ref.protocol, host = _ref.host, pathname = _ref.pathname;
          } catch (_error) {
            error = _error;
            return;
          }
          if (protocol !== 'asciidoc-preview:') {
            return;
          }
          try {
            if (pathname) {
              pathname = decodeURI(pathname);
            }
          } catch (_error) {
            error = _error;
            return;
          }
          if (host === 'editor') {
            return _this.createAsciiDocPreviewView({
              editorId: pathname.substring(1)
            });
          } else {
            return _this.createAsciiDocPreviewView({
              filePath: pathname
            });
          }
        };
      })(this));
    },
    createAsciiDocPreviewView: function(state) {
      if (state.editorId || fs.isFileSync(state.filePath)) {
        if (AsciiDocPreviewView == null) {
          AsciiDocPreviewView = require('./asciidoc-preview-view');
        }
        return new AsciiDocPreviewView(state);
      }
    },
    toggle: function() {
      var editor, grammars, _ref, _ref1;
      if (isAsciiDocPreviewView(atom.workspace.getActivePaneItem())) {
        atom.workspace.destroyActivePaneItem();
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      grammars = (_ref = atom.config.get('asciidoc-preview.grammars')) != null ? _ref : [];
      if (_ref1 = editor.getGrammar().scopeName, __indexOf.call(grammars, _ref1) < 0) {
        return;
      }
      if (!this.removePreviewForEditor(editor)) {
        return this.addPreviewForEditor(editor);
      }
    },
    uriForEditor: function(editor) {
      return "asciidoc-preview://editor/" + editor.id;
    },
    removePreviewForEditor: function(editor) {
      var previewPane, uri;
      uri = this.uriForEditor(editor);
      previewPane = atom.workspace.paneForURI(uri);
      if (previewPane != null) {
        previewPane.destroyItem(previewPane.itemForURI(uri));
        return true;
      } else {
        return false;
      }
    },
    addPreviewForEditor: function(editor) {
      var options, previousActivePane, uri;
      uri = this.uriForEditor(editor);
      previousActivePane = atom.workspace.getActivePane();
      options = {
        searchAllPanes: true,
        split: atom.config.get('asciidoc-preview.openInPane')
      };
      return atom.workspace.open(uri, options).then(function(asciidocPreviewView) {
        if (isAsciiDocPreviewView(asciidocPreviewView)) {
          return previousActivePane.activate();
        }
      });
    },
    previewFile: function(_arg) {
      var editor, filePath, target, _i, _len, _ref;
      target = _arg.target;
      filePath = target.dataset.path;
      if (!filePath) {
        return;
      }
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        if (!(editor.getPath() === filePath)) {
          continue;
        }
        this.addPreviewForEditor(editor);
        return;
      }
      return atom.workspace.open("asciidoc-preview://" + (encodeURI(filePath)), {
        searchAllPanes: true
      });
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNHQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUROLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUlBLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVIsQ0FKZixDQUFBOztBQUFBLEVBTUEsbUJBQUEsR0FBc0IsSUFOdEIsQ0FBQTs7QUFBQSxFQU9BLFFBQUEsR0FBVyxJQVBYLENBQUE7O0FBQUEsRUFTQSxxQkFBQSxHQUF3QixTQUFDLE1BQUQsR0FBQTs7TUFDdEIsc0JBQXVCLE9BQUEsQ0FBUSx5QkFBUjtLQUF2QjtXQUNBLE1BQUEsWUFBa0Isb0JBRkk7RUFBQSxDQVR4QixDQUFBOztBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsYUFBQSxFQUFlLElBQWY7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixVQUFBLGdEQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFFQSxNQUFBLElBQUcsVUFBQSxDQUFXLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBWCxDQUFBLEdBQWdDLEdBQW5DO0FBQ0UsUUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxxQkFB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

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/main.coffee
