(function() {
  var AsciiDocPreviewView, attributesProvider, renderer, url,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  url = require('url');

  AsciiDocPreviewView = require('./asciidoc-preview-view');

  attributesProvider = require("./attributes-provider");

  renderer = null;

  module.exports = {
    config: {
      compatMode: {
        type: 'boolean',
        "default": true
      },
      showTitle: {
        type: 'boolean',
        "default": true
      },
      safeMode: {
        type: 'string',
        "default": 'safe'
      },
      showToc: {
        type: 'boolean',
        "default": true
      },
      showNumberedHeadings: {
        type: 'boolean',
        "default": true
      },
      renderOnSaveOnly: {
        type: 'boolean',
        "default": false
      },
      defaultAttributes: {
        type: 'string',
        "default": 'platform=opal platform-opal env=browser env-browser source-highlighter=highlight.js'
      },
      grammars: {
        type: 'array',
        "default": ['source.asciidoc', 'text.plain', 'text.plain.null-grammar']
      }
    },
    activate: function() {
      attributesProvider.loadCompletions();
      atom.commands.add('atom-workspace', {
        'asciidoc-preview:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'asciidoc-preview:copy-html': (function(_this) {
          return function() {
            return _this.copyHtml();
          };
        })(this),
        'pane-container:active-pane-item-changed': (function(_this) {
          return function() {
            return _this.changeRenderMode();
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
        'asciidoc-preview:toggle-show-toc': function() {
          var keyPath;
          keyPath = 'asciidoc-preview.showToc';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        },
        'asciidoc-preview:toggle-show-numbered-headings': function() {
          var keyPath;
          keyPath = 'asciidoc-preview.showNumberedHeadings';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        },
        'asciidoc-preview:toggle-render-on-save-only': (function(_this) {
          return function() {
            var keyPath;
            keyPath = 'asciidoc-preview.renderOnSaveOnly';
            atom.config.set(keyPath, !atom.config.get(keyPath));
            return _this.changeRenderMode();
          };
        })(this)
      });
      return atom.workspace.addOpener(function(uriToOpen) {
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
          return new AsciiDocPreviewView({
            editorId: pathname.substring(1)
          });
        } else {
          return new AsciiDocPreviewView({
            filePath: pathname
          });
        }
      });
    },
    provide: function() {
      return attributesProvider;
    },
    checkFile: function() {
      var editor, grammars, _ref, _ref1;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      grammars = (_ref = atom.config.get('asciidoc-preview.grammars')) != null ? _ref : [];
      if (_ref1 = editor.getGrammar().scopeName, __indexOf.call(grammars, _ref1) < 0) {
        return;
      }
      return editor;
    },
    toggle: function() {
      var editor, previewPane, previousActivePane, uri;
      editor = this.checkFile();
      if (editor == null) {
        return;
      }
      uri = "asciidoc-preview://editor/" + editor.id;
      previewPane = atom.workspace.paneForURI(uri);
      if (previewPane) {
        previewPane.destroyItem(previewPane.itemForURI(uri));
        this.changeRenderMode();
        return;
      }
      previousActivePane = atom.workspace.getActivePane();
      return atom.workspace.open(uri, {
        split: 'right',
        searchAllPanes: true
      }).done(function(asciidocPreview) {
        if (asciidocPreview instanceof AsciiDocPreviewView) {
          asciidocPreview.renderAsciiDoc();
          return previousActivePane.activate();
        }
      });
    },
    changeRenderMode: function() {
      var divChangeMode, editor, previewPane, saveOnly, statusBar, uri, _ref;
      if ((_ref = document.querySelector('#asciidoc-changemode')) != null) {
        _ref.remove();
      }
      editor = this.checkFile();
      if (editor == null) {
        return;
      }
      uri = "asciidoc-preview://editor/" + editor.id;
      previewPane = atom.workspace.paneForURI(uri);
      if (previewPane == null) {
        return;
      }
      statusBar = document.querySelector('status-bar');
      divChangeMode = document.createElement("div");
      divChangeMode.setAttribute('id', 'asciidoc-changemode');
      divChangeMode.classList.add('inline-block');
      saveOnly = atom.config.get('asciidoc-preview.renderOnSaveOnly');
      if (saveOnly) {
        divChangeMode.appendChild(document.createTextNode("Render on save"));
      } else {
        divChangeMode.appendChild(document.createTextNode("Render on change"));
      }
      return statusBar != null ? statusBar.addLeftTile({
        item: divChangeMode,
        priority: 100
      }) : void 0;
    },
    copyHtml: function() {
      var editor, text;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      if (renderer == null) {
        renderer = require('./renderer');
      }
      text = editor.getSelectedText() || editor.getText();
      return renderer.toText(text, editor.getPath(), (function(_this) {
        return function(error, html) {
          if (error) {
            return console.warn('Copying AsciiDoc as HTML failed', error);
          } else {
            return atom.clipboard.write(html);
          }
        };
      })(this));
    }
  };

}).call(this);
