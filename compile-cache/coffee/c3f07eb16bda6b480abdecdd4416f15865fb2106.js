(function() {
  var AsciiDocPreviewView, fs, isAsciiDocPreviewView, path, renderer, url,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  url = require('url');

  path = require('path');

  fs = require('fs-plus');

  AsciiDocPreviewView = null;

  renderer = null;

  isAsciiDocPreviewView = function(object) {
    if (AsciiDocPreviewView == null) {
      AsciiDocPreviewView = require('./asciidoc-preview-view');
    }
    return object instanceof AsciiDocPreviewView;
  };

  module.exports = {
    activate: function() {
      var extension, fileExtensions, previewFile, _i, _j, _len, _len1;
      if (parseFloat(atom.getVersion()) < 1.7) {
        atom.deserializers.add({
          name: 'AsciiDocPreviewView',
          deserialize: module.exports.createAsciiDocPreviewView.bind(module.exports)
        });
      }
      atom.commands.add('atom-workspace', {
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
      });
      fileExtensions = ['adoc', 'asciidoc', 'ad', 'asc', 'txt'];
      previewFile = this.previewFile.bind(this);
      for (_i = 0, _len = fileExtensions.length; _i < _len; _i++) {
        extension = fileExtensions[_i];
        atom.commands.add(".tree-view .file .name[data-name$=\\." + extension + "]", 'asciidoc-preview:preview-file', previewFile);
      }
      for (_j = 0, _len1 = fileExtensions.length; _j < _len1; _j++) {
        extension = fileExtensions[_j];
        atom.commands.add(".tree-view .file .name[data-name$=\\." + extension + "]", 'asciidoc-preview:export-pdf', this.exportAsPdf);
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
      return atom.workspace.open(uri, options).then(function(markdownPreviewView) {
        if (isAsciiDocPreviewView(markdownPreviewView)) {
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
    exportAsPdf: function(_arg) {
      var cmd, message, shell, sourceFilePath, spawn, target;
      target = _arg.target;
      if (atom.config.get('asciidoc-preview.experimental.exportAsPdf')) {
        spawn = require('child_process').spawn;
        sourceFilePath = target.dataset.path;
        if (process.platform === 'win32') {
          shell = process.env['SHELL'] || 'cmd.exe';
          cmd = spawn('asciidoctor-pdf.bat', [sourceFilePath], {
            shell: "" + shell + " -i -l"
          });
        } else {
          shell = process.env['SHELL'] || 'bash';
          cmd = spawn('asciidoctor-pdf', [sourceFilePath], {
            shell: "" + shell + " -i -l"
          });
        }
        cmd.stdout.on('data', function(data) {
          return atom.notifications.addInfo('Export as PDF:', {
            detail: data.toString() || '',
            dismissable: true
          });
        });
        cmd.stderr.on('data', function(data) {
          console.error("stderr: " + data);
          return atom.notifications.addError('Error:', {
            detail: data.toString() || '',
            dismissable: true
          });
        });
        return cmd.on('close', function(code) {
          var basename, pdfFilePath;
          basename = path.basename(sourceFilePath, path.extname(sourceFilePath));
          pdfFilePath = path.join(path.dirname(sourceFilePath), basename) + '.pdf';
          if (code === 0) {
            return atom.notifications.addSuccess('Export as PDF completed!', {
              detail: pdfFilePath || '',
              dismissable: false
            });
          } else {
            return atom.notifications.addWarning('Export as PDF completed with errors.', {
              detail: pdfFilePath || '',
              dismissable: false
            });
          }
        });
      } else {
        message = 'This feature is experimental.\nYou must manually activate this feature in the package settings.\n`asciidoctor-pdf` must be installed in you computer.';
        return atom.notifications.addWarning('Export as PDF:', {
          detail: message || '',
          dismissable: true
        });
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1FQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVIsQ0FBTixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxtQkFBQSxHQUFzQixJQUp0QixDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFXLElBTFgsQ0FBQTs7QUFBQSxFQU9BLHFCQUFBLEdBQXdCLFNBQUMsTUFBRCxHQUFBOztNQUN0QixzQkFBdUIsT0FBQSxDQUFRLHlCQUFSO0tBQXZCO1dBQ0EsTUFBQSxZQUFrQixvQkFGSTtFQUFBLENBUHhCLENBQUE7O0FBQUEsRUFXQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSwyREFBQTtBQUFBLE1BQUEsSUFBRyxVQUFBLENBQVcsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFYLENBQUEsR0FBZ0MsR0FBbkM7QUFDRSxRQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLHFCQUFOO0FBQUEsVUFDQSxXQUFBLEVBQWEsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxJQUF6QyxDQUE4QyxNQUFNLENBQUMsT0FBckQsQ0FEYjtTQURGLENBQUEsQ0FERjtPQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLHlCQUFB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

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/main.coffee
