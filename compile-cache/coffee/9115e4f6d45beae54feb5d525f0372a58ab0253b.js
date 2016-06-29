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
      tocType: {
        title: 'Show Table of Contents',
        type: 'string',
        "default": 'preamble',
        "enum": ['none', 'preamble', 'macro']
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
        "default": 'platform=opal platform-opal env=browser env-browser source-highlighter=highlight.js data-uri!'
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
        'asciidoc-preview:set-toc-none': function() {
          var keyPath;
          keyPath = 'asciidoc-preview.tocType';
          return atom.config.set(keyPath, 'none');
        },
        'asciidoc-preview:set-toc-preamble': function() {
          var keyPath;
          keyPath = 'asciidoc-preview.tocType';
          return atom.config.set(keyPath, 'preamble');
        },
        'asciidoc-preview:set-toc-macro': function() {
          var keyPath;
          keyPath = 'asciidoc-preview.tocType';
          return atom.config.set(keyPath, 'macro');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL2FzY2lpZG9jLXByZXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FBTixDQUFBOztBQUFBLEVBRUEsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLHlCQUFSLENBRnRCLENBQUE7O0FBQUEsRUFHQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsdUJBQVIsQ0FIckIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxJQUpYLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREY7QUFBQSxNQUdBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BSkY7QUFBQSxNQU1BLFFBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxNQURUO09BUEY7QUFBQSxNQVNBLE9BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLHdCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLFFBRUEsU0FBQSxFQUFTLFVBRlQ7QUFBQSxRQUdBLE1BQUEsRUFBTSxDQUFDLE1BQUQsRUFBUSxVQUFSLEVBQW1CLE9BQW5CLENBSE47T0FWRjtBQUFBLE1BY0Esb0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BZkY7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

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/asciidoc-preview.coffee
