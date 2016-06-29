(function() {
  var $, $$$, AsciiDocPreviewView, CompositeDisposable, Disposable, Emitter, File, ScrollView, fs, markdownDirectory, mustache, path, renderer, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  _ref = require('atom'), Emitter = _ref.Emitter, Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, $$$ = _ref1.$$$, ScrollView = _ref1.ScrollView;

  _ = require('underscore-plus');

  fs = require('fs-plus');

  mustache = require('mustache');

  renderer = require('./renderer');

  markdownDirectory = atom.packages.resolvePackagePath('markdown-preview');

  File = require(path.join(markdownDirectory, '..', 'pathwatcher')).File;

  module.exports = AsciiDocPreviewView = (function(_super) {
    __extends(AsciiDocPreviewView, _super);

    atom.deserializers.add(AsciiDocPreviewView);

    AsciiDocPreviewView.deserialize = function(state) {
      return new AsciiDocPreviewView(state);
    };

    AsciiDocPreviewView.content = function() {
      return this.div({
        "class": 'asciidoc-preview native-key-bindings',
        tabindex: -1
      });
    };

    function AsciiDocPreviewView(_arg) {
      var filePath;
      this.editorId = _arg.editorId, filePath = _arg.filePath;
      AsciiDocPreviewView.__super__.constructor.apply(this, arguments);
      this.emitter = new Emitter;
      this.disposables = new CompositeDisposable;
    }

    AsciiDocPreviewView.prototype.attached = function() {
      if (this.editorId != null) {
        return this.resolveEditor(this.editorId);
      } else {
        if (atom.workspace != null) {
          return this.subscribeToFilePath(this.filePath);
        } else {
          return this.disposables.add(atom.packages.onDidActivateInitialPackages((function(_this) {
            return function() {
              return _this.subscribeToFilePath(_this.filePath);
            };
          })(this)));
        }
      }
    };

    AsciiDocPreviewView.prototype.serialize = function() {
      return {
        deserializer: 'AsciiDocPreviewView',
        filePath: this.getPath(),
        editorId: this.editorId
      };
    };

    AsciiDocPreviewView.prototype.destroy = function() {
      return this.disposables.dispose();
    };

    AsciiDocPreviewView.prototype.onDidChangeTitle = function(callback) {
      return this.emitter.on('did-change-title', callback);
    };

    AsciiDocPreviewView.prototype.onDidChangeModified = function(callback) {
      return new Disposable;
    };

    AsciiDocPreviewView.prototype.onDidChangeAsciidoc = function(callback) {
      return this.emitter.on('did-change-asciidoc', callback);
    };

    AsciiDocPreviewView.prototype.subscribeToFilePath = function(filePath) {
      this.file = new File(filePath);
      this.emitter.emit('did-change-title');
      this.handleEvents();
      return this.renderAsciiDoc();
    };

    AsciiDocPreviewView.prototype.resolveEditor = function(editorId) {
      var resolve;
      resolve = (function(_this) {
        return function() {
          var _ref2, _ref3;
          _this.editor = _this.editorForId(editorId);
          if (_this.editor != null) {
            if (_this.editor != null) {
              _this.emitter.emit('did-change-title');
            }
            _this.handleEvents();
            return _this.renderAsciiDoc();
          } else {
            return (_ref2 = atom.workspace) != null ? (_ref3 = _ref2.paneForItem(_this)) != null ? _ref3.destroyItem(_this) : void 0 : void 0;
          }
        };
      })(this);
      if (atom.workspace != null) {
        return resolve();
      } else {
        return this.disposables.add(atom.packages.onDidActivateInitialPackages(resolve));
      }
    };

    AsciiDocPreviewView.prototype.editorForId = function(editorId) {
      var editor, _i, _len, _ref2, _ref3;
      _ref2 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        editor = _ref2[_i];
        if (((_ref3 = editor.id) != null ? _ref3.toString() : void 0) === editorId.toString()) {
          return editor;
        }
      }
      return null;
    };

    AsciiDocPreviewView.prototype.handleEvents = function() {
      var changeHandler, renderOnChange;
      this.disposables.add(atom.grammars.onDidAddGrammar((function(_this) {
        return function() {
          return _.debounce((function() {
            return _this.renderAsciiDoc();
          }), 250);
        };
      })(this)));
      this.disposables.add(atom.grammars.onDidUpdateGrammar(_.debounce(((function(_this) {
        return function() {
          return _this.renderAsciiDoc();
        };
      })(this)), 250)));
      atom.commands.add(this.element, {
        'core:move-up': (function(_this) {
          return function() {
            return _this.scrollUp();
          };
        })(this),
        'core:move-down': (function(_this) {
          return function() {
            return _this.scrollDown();
          };
        })(this),
        'core:save-as': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.saveAs();
          };
        })(this),
        'core:copy': (function(_this) {
          return function(event) {
            if (_this.copyToClipboard()) {
              return event.stopPropagation();
            }
          };
        })(this),
        'asciidoc-preview:zoom-in': (function(_this) {
          return function() {
            var zoomLevel;
            zoomLevel = parseFloat(_this.css('zoom')) || 1;
            return _this.css('zoom', zoomLevel + .1);
          };
        })(this),
        'asciidoc-preview:zoom-out': (function(_this) {
          return function() {
            var zoomLevel;
            zoomLevel = parseFloat(_this.css('zoom')) || 1;
            return _this.css('zoom', zoomLevel - .1);
          };
        })(this),
        'asciidoc-preview:reset-zoom': (function(_this) {
          return function() {
            return _this.css('zoom', 1);
          };
        })(this)
      });
      changeHandler = (function(_this) {
        return function() {
          var pane, _base, _ref2;
          _this.renderAsciiDoc();
          pane = (_ref2 = typeof (_base = atom.workspace).paneForItem === "function" ? _base.paneForItem(_this) : void 0) != null ? _ref2 : atom.workspace.paneForURI(_this.getURI());
          if ((pane != null) && pane !== atom.workspace.getActivePane()) {
            return pane.activateItem(_this);
          }
        };
      })(this);
      renderOnChange = (function(_this) {
        return function() {
          var saveOnly;
          saveOnly = atom.config.get('asciidoc-preview.renderOnSaveOnly');
          if (!saveOnly) {
            return changeHandler();
          }
        };
      })(this);
      if (this.file != null) {
        this.disposables.add(this.file.onDidChange(changeHandler));
      } else if (this.editor != null) {
        this.disposables.add(this.editor.getBuffer().onDidStopChanging((function(_this) {
          return function() {
            return renderOnChange();
          };
        })(this)));
        this.disposables.add(this.editor.onDidChangePath((function(_this) {
          return function() {
            return _this.emitter.emit('did-change-title');
          };
        })(this)));
        this.disposables.add(this.editor.getBuffer().onDidSave((function(_this) {
          return function() {
            return renderOnChange();
          };
        })(this)));
        this.disposables.add(this.editor.getBuffer().onDidReload((function(_this) {
          return function() {
            return renderOnChange();
          };
        })(this)));
      }
      this.disposables.add(atom.config.onDidChange('asciidoc-preview.showTitle', changeHandler));
      this.disposables.add(atom.config.onDidChange('asciidoc-preview.compatMode', changeHandler));
      this.disposables.add(atom.config.onDidChange('asciidoc-preview.safeMode', changeHandler));
      this.disposables.add(atom.config.onDidChange('asciidoc-preview.defaultAttributes', changeHandler));
      this.disposables.add(atom.config.onDidChange('asciidoc-preview.showToc', changeHandler));
      return this.disposables.add(atom.config.onDidChange('asciidoc-preview.showNumberedHeadings', changeHandler));
    };

    AsciiDocPreviewView.prototype.renderAsciiDoc = function() {
      this.showLoading();
      if (this.file != null) {
        return this.file.read().then((function(_this) {
          return function(contents) {
            return _this.renderAsciiDocText(contents);
          };
        })(this));
      } else if (this.editor != null) {
        return this.renderAsciiDocText(this.editor.getText());
      }
    };

    AsciiDocPreviewView.prototype.renderAsciiDocText = function(text) {
      return renderer.toHtml(text, this.getPath(), (function(_this) {
        return function(html) {
          _this.loading = false;
          _this.html(html);
          _this.enableAnchorScroll(html, function(top) {
            return _this.scrollTop(top);
          });
          _this.emitter.emit('did-change-asciidoc');
          return _this.originalTrigger('asciidoc-preview:asciidoc-changed');
        };
      })(this));
    };

    AsciiDocPreviewView.prototype.enableAnchorScroll = function(html, callback) {
      var divLink, hrefLink, link, linkElement, statusBar, target, top, _i, _len, _ref2, _ref3, _results;
      if ((_ref2 = document.querySelector('#asciidoc-linkUrl')) != null) {
        _ref2.remove();
      }
      statusBar = document.querySelector('status-bar');
      divLink = document.createElement("div");
      divLink.setAttribute('id', 'asciidoc-linkUrl');
      divLink.classList.add('inline-block');
      if (statusBar != null) {
        statusBar.addRightTile({
          item: divLink,
          priority: 300
        });
      }
      html = $(html);
      _ref3 = html.find("a");
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        linkElement = _ref3[_i];
        link = $(linkElement);
        if (hrefLink = link.attr('href')) {
          (function(hrefLink) {
            link.on('mouseover', function(e) {
              var cropUrl;
              cropUrl = hrefLink.length > 100 ? hrefLink.substr(0, 97).concat('...') : hrefLink;
              return divLink.appendChild(document.createTextNode(cropUrl));
            });
            return link.on('mouseleave', function(e) {
              return $(divLink).empty();
            });
          })(hrefLink);
          if (!hrefLink.match(/^#/)) {
            continue;
          }
          if (target = $(hrefLink)) {
            if (!target.offset()) {
              continue;
            }
            top = target.offset().top - 43;
            _results.push((function(top) {
              return link.on('click', function(e) {
                top = top;
                return callback(top);
              });
            })(top));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AsciiDocPreviewView.prototype.getTitle = function() {
      if (this.file != null) {
        return "" + (path.basename(this.getPath())) + " Preview";
      } else if (this.editor != null) {
        return "" + (this.editor.getTitle()) + " Preview";
      } else {
        return "AsciiDoc Preview";
      }
    };

    AsciiDocPreviewView.prototype.getIconName = function() {
      return "eye";
    };

    AsciiDocPreviewView.prototype.getURI = function() {
      if (this.file != null) {
        return "asciidoc-preview://" + (this.getPath());
      } else {
        return "asciidoc-preview://editor/" + this.editorId;
      }
    };

    AsciiDocPreviewView.prototype.getPath = function() {
      if (this.file != null) {
        return this.file.getPath();
      } else if (this.editor != null) {
        return this.editor.getPath();
      }
    };

    AsciiDocPreviewView.prototype.showError = function(result) {
      var failureMessage;
      failureMessage = result != null ? result.message : void 0;
      return this.html($$$(function() {
        this.h2('Previewing AsciiDoc Failed');
        if (failureMessage != null) {
          return this.h3(failureMessage);
        }
      }));
    };

    AsciiDocPreviewView.prototype.showLoading = function() {
      this.loading = true;
      if (this.firstloadingdone == null) {
        this.firstloadingdone = true;
        return this.html($$$(function() {
          return this.div({
            "class": 'asciidoc-spinner'
          }, 'Loading AsciiDoc\u2026');
        }));
      }
    };

    AsciiDocPreviewView.prototype.copyToClipboard = function() {
      var selectedNode, selectedText, selection;
      if (this.loading) {
        return false;
      }
      selection = window.getSelection();
      selectedText = selection.toString();
      selectedNode = selection.baseNode;
      if (selectedText && (selectedNode != null) && $.contains(this[0], selectedNode)) {
        return false;
      }
      atom.clipboard.write(this[0].innerHTML);
      return true;
    };

    AsciiDocPreviewView.prototype.saveAs = function() {
      var filePath, htmlContent, htmlFilePath, mustacheObject, page, projectPath, templatePath;
      if (this.loading) {
        return;
      }
      filePath = this.getPath();
      if (filePath) {
        filePath += '.html';
      } else {
        filePath = 'untitled.adoc.html';
        if (projectPath = atom.project.getPath()) {
          filePath = path.join(projectPath, filePath);
        }
      }
      if (htmlFilePath = atom.showSaveDialogSync(filePath)) {
        mustacheObject = {
          title: 'test',
          content: this[0].innerHTML
        };
        templatePath = path.join(atom.packages.resolvePackagePath('asciidoc-preview'), 'templates', 'default.html');
        page = fs.readFileSync(templatePath, 'utf8');
        htmlContent = mustache.to_html(page, mustacheObject);
        fs.writeFileSync(htmlFilePath, htmlContent);
        return atom.workspace.open(htmlFilePath);
      }
    };

    return AsciiDocPreviewView;

  })(ScrollView);

}).call(this);
