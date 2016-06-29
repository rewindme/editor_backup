(function() {
  var $, $$, $$$, CompositeDisposable, Disposable, Emitter, OptionsView, PreviewMessageView, PreviewView, ScrollView, SelectRendererView, TextEditor, TextEditorView, View, allowUnsafeEval, analyticsWriteKey, path, pkg, renderers, util, version, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Emitter = _ref.Emitter, Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable, TextEditor = _ref.TextEditor;

  _ref1 = require('atom-space-pen-views'), $ = _ref1.$, $$ = _ref1.$$, $$$ = _ref1.$$$, View = _ref1.View, ScrollView = _ref1.ScrollView, TextEditorView = _ref1.TextEditorView;

  util = require('util');

  path = require('path');

  _ = require('underscore-plus');

  renderers = require('./renderer');

  PreviewMessageView = require('./preview-message-view');

  OptionsView = require('./options-view');

  SelectRendererView = require('./select-renderer-view.coffee');

  allowUnsafeEval = require('loophole').allowUnsafeEval;

  analyticsWriteKey = "bp0dj6lufc";

  pkg = require("../package");

  version = pkg.version;

  PreviewView = (function(_super) {
    var htmlPreviewContainer, messageView, optionsView, selectRendererView;

    __extends(PreviewView, _super);

    function PreviewView() {
      this.renderPreviewWithRenderer = __bind(this.renderPreviewWithRenderer, this);
      this.renderPreview = __bind(this.renderPreview, this);
      this.hideViewPreview = __bind(this.hideViewPreview, this);
      this.renderViewForPreview = __bind(this.renderViewForPreview, this);
      this.handleTabChanges = __bind(this.handleTabChanges, this);
      this.changeHandler = __bind(this.changeHandler, this);
      return PreviewView.__super__.constructor.apply(this, arguments);
    }

    PreviewView.prototype.textEditor = document.createElement('atom-text-editor');

    messageView = null;

    optionsView = null;

    selectRendererView = null;

    htmlPreviewContainer = null;

    PreviewView.prototype.lastEditor = null;

    PreviewView.prototype.lastRendererName = null;

    PreviewView.prototype.matchedRenderersCache = {};

    PreviewView.prototype.emitter = new Emitter;

    PreviewView.prototype.disposables = new CompositeDisposable;

    PreviewView.prototype.initialize = function() {
      var Analytics, uuid;
      this.classList.add('atom-preview-container');
      this.activeItemSubscription = atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.handleTabChanges();
        };
      })(this));
      atom.config.observe('preview.refreshDebouncePeriod', (function(_this) {
        return function(wait) {
          return _this.debouncedRenderPreview = _.debounce(_this.renderPreview.bind(_this), wait);
        };
      })(this));
      this.self = $(this);
      this.editorContents = $(this.textEditor);
      this.appendChild(this.textEditor);
      this.htmlPreviewContainer = $$(function() {
        return this.div((function(_this) {
          return function() {
            return _this.div("Empty HTML Preview...");
          };
        })(this));
      });
      this.self.append(this.htmlPreviewContainer);
      this.htmlPreviewContainer.hide();
      this.messageView = new PreviewMessageView();
      this.self.append(this.messageView);
      this.optionsView = new OptionsView(this);
      this.selectRendererView = new SelectRendererView(this);
      this.showLoading();
      Analytics = null;
      allowUnsafeEval(function() {
        return Analytics = require('analytics-node');
      });
      this.analytics = new Analytics(analyticsWriteKey);
      if (!atom.config.get('preview._analyticsUserId')) {
        uuid = require('node-uuid');
        atom.config.set('preview._analyticsUserId', uuid.v4());
      }
      atom.config.observe('preview._analyticsUserId', {}, (function(_this) {
        return function(userId) {
          return _this.analytics.identify({
            userId: userId
          });
        };
      })(this));
      this.renderPreview();
      return this;
    };

    PreviewView.prototype.changeHandler = function() {
      return this.debouncedRenderPreview();
    };

    PreviewView.prototype.onDidChangeTitle = function(callback) {
      return this.emitter.on('did-change-title', callback);
    };

    PreviewView.prototype.handleEvents = function() {
      var currEditor;
      currEditor = atom.workspace.getActiveTextEditor();
      if (currEditor != null) {
        this.disposables.add(currEditor.getBuffer().onDidStopChanging((function(_this) {
          return function() {
            if (atom.config.get('preview.liveUpdate')) {
              return _this.changeHandler();
            }
          };
        })(this)));
        this.disposables.add(currEditor.onDidChangePath((function(_this) {
          return function() {
            return _this.emitter.emit('did-change-title');
          };
        })(this)));
        this.disposables.add(currEditor.getBuffer().onDidSave((function(_this) {
          return function() {
            if (!atom.config.get('preview.liveUpdate')) {
              return _this.changeHandler();
            }
          };
        })(this)));
        return this.disposables.add(currEditor.getBuffer().onDidReload((function(_this) {
          return function() {
            if (!atom.config.get('preview.liveUpdate')) {
              return _this.changeHandler();
            }
          };
        })(this)));
      }
    };

    PreviewView.prototype.handleTabChanges = function() {
      var currEditor, updateOnTabChange;
      updateOnTabChange = atom.config.get('preview.updateOnTabChange');
      if (updateOnTabChange) {
        currEditor = atom.workspace.getActiveTextEditor();
        if (currEditor != null) {
          this.disposables.dispose();
          this.handleEvents();
          return this.changeHandler();
        }
      }
    };

    PreviewView.prototype.toggleOptions = function() {
      return this.optionsView.toggle();
    };

    PreviewView.prototype.selectRenderer = function() {
      return this.selectRendererView.attach();
    };

    PreviewView.prototype.showError = function(result) {
      var failureMessage;
      failureMessage = result != null ? result.message : void 0;
      this.showMessage();
      return this.messageView.message.html($$$(function() {
        return this.div({
          "class": 'preview-spinner',
          style: 'text-align: center'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'loading loading-spinner-large inline-block'
            });
            _this.div({
              "class": 'text-highlight'
            }, 'Previewing Failed\u2026', function() {
              return _this.div({
                "class": 'text-error'
              }, failureMessage != null ? failureMessage : void 0);
            });
            return _this.div({
              "class": 'text-warning'
            }, result != null ? result.stack : void 0);
          };
        })(this));
      }));
    };

    PreviewView.prototype.showLoading = function() {
      this.showMessage();
      return this.messageView.message.html($$$(function() {
        return this.div({
          "class": 'preview-spinner',
          style: 'text-align: center'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'loading loading-spinner-large inline-block'
            });
            return _this.div({
              "class": 'text-highlight'
            }, 'Loading Preview\u2026');
          };
        })(this));
      }));
    };

    PreviewView.prototype.showMessage = function() {
      if (!this.messageView.hasParent()) {
        return this.self.append(this.messageView);
      }
    };

    PreviewView.prototype.hideMessage = function() {
      if (this.messageView.hasParent()) {
        return this.messageView.detach();
      }
    };

    PreviewView.prototype.renderViewForPreview = function(view) {
      this.editorContents.hide();
      this.htmlPreviewContainer.show();
      return this.htmlPreviewContainer.html(view);
    };

    PreviewView.prototype.hideViewPreview = function() {
      this.htmlPreviewContainer.hide();
      return this.editorContents.show();
    };

    PreviewView.prototype.getTitle = function() {
      return "Atom Preview";
    };

    PreviewView.prototype.getEditor = function() {
      return this.textEditor.getModel();
    };

    PreviewView.prototype.getPath = function() {
      if (this.getEditor() != null) {
        return this.getEditor().getPath();
      }
    };

    PreviewView.prototype.getURI = function() {
      return "atom://atom-preview";
    };

    PreviewView.prototype.focus = function() {
      return false;
    };

    PreviewView.prototype.destroy = function() {
      this.messageView.detach();
      this.activeItemSubscription.dispose();
      return this.disposables.dispose();
    };

    PreviewView.prototype.renderPreview = function() {
      return this.renderPreviewWithRenderer("Default");
    };

    PreviewView.prototype.renderPreviewWithRenderer = function(rendererName) {
      var cEditor, callback, e, editor, extension, filePath, grammar, renderer, spos, text;
      this.emitter.emit('did-change-title');
      cEditor = atom.workspace.getActiveTextEditor();
      editor = this.getEditor();
      if ((cEditor != null) && cEditor !== editor && cEditor instanceof TextEditor) {
        this.lastEditor = cEditor;
      } else {
        cEditor = this.lastEditor;
      }
      if (cEditor == null) {
        return this.showError({
          message: "Please type a Text Editor to render preview"
        });
      } else {
        text = cEditor.getText();
        spos = editor.getScrollTop();
        this.showLoading();
        this.emitter.emit('did-change-title');
        callback = (function(_this) {
          return function(error, result) {
            var focusOnEditor, grammar, outLang;
            _this.hideMessage();
            focusOnEditor = function() {};
            if (error != null) {
              focusOnEditor();
              return _this.showError(error);
            }
            if (typeof result === "string") {
              outLang = renderer.lang();
              grammar = atom.grammars.selectGrammar("source." + outLang, result);
              editor.setGrammar(grammar);
              editor.setText(result);
              editor.setScrollTop(spos);
              _this.hideViewPreview();
              return focusOnEditor();
            } else if (result instanceof View) {
              _this.renderViewForPreview(result);
              return focusOnEditor();
            } else {
              _this.hideViewPreview();
              focusOnEditor();
              console.log('unsupported result', result);
              return _this.showError(new Error("Unsupported result type."));
            }
          };
        })(this);
        try {
          grammar = cEditor.getGrammar().name;
          filePath = cEditor.getPath();
          extension = path.extname(filePath);
          renderer = null;
          if (rendererName === "Default") {
            renderer = this.matchedRenderersCache[filePath];
            if (renderer == null) {
              renderer = renderers.findRenderer(grammar, extension);
            }
          } else {
            renderer = renderers.grammars[rendererName];
          }
          this.matchedRenderersCache[filePath] = renderer;
          if (text == null) {
            this.analytics.track({
              userId: atom.config.get('preview._analyticsUserId'),
              event: 'Nothing to render',
              properties: {
                grammar: grammar,
                extension: extension,
                version: version,
                label: "" + grammar + "|" + extension
              }
            });
            return this.showError(new Error("Nothing to render."));
          }
          if (renderer != null) {
            this.analytics.track({
              userId: atom.config.get('preview._analyticsUserId'),
              event: 'Preview',
              properties: {
                grammar: grammar,
                extension: extension,
                version: version,
                label: "" + grammar + "|" + extension,
                category: version
              }
            });
            return renderer.render(text, filePath, callback);
          } else {
            this.analytics.track({
              userId: atom.config.get('preview._analyticsUserId'),
              event: 'Renderer not found',
              properties: {
                grammar: grammar,
                extension: extension,
                version: version,
                label: "" + grammar + "|" + extension,
                category: version
              }
            });
            return this.showError(new Error("Can not find renderer for grammar " + grammar + "."));
          }
        } catch (_error) {
          e = _error;
          this.analytics.track({
            userId: atom.config.get('preview._analyticsUserId'),
            event: 'Error',
            properties: {
              error: e,
              vesion: version,
              label: "" + grammar + "|" + extension,
              category: version
            }
          });
          return this.showError(e);
        }
      }
    };

    return PreviewView;

  })(HTMLElement);

  module.exports = document.registerElement('atom-preview-editor', {
    prototype: PreviewView.prototype
  });

}).call(this);
