(function() {
  var CompositeDisposable, ConfigSchema, isOpeningTagLikePattern,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isOpeningTagLikePattern = /<(?![\!\/])([a-z]{1}[^>\s=\'\"]*)[^>]*>$/i;

  ConfigSchema = require('./configuration.coffee');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: ConfigSchema.config,
    neverClose: [],
    forceInline: [],
    forceBlock: [],
    makeNeverCloseSelfClosing: false,
    ignoreGrammar: false,
    legacyMode: false,
    activate: function() {
      this.autocloseHTMLEvents = new CompositeDisposable;
      atom.commands.add('atom-text-editor', {
        'autoclose-html:close-and-complete': (function(_this) {
          return function(e) {
            if (_this.legacyMode) {
              console.log(e);
              return e.abortKeyBinding();
            } else {
              atom.workspace.getActiveTextEditor().insertText(">");
              return _this.execAutoclose();
            }
          };
        })(this)
      });
      atom.config.observe('autoclose-html.neverClose', (function(_this) {
        return function(value) {
          return _this.neverClose = value;
        };
      })(this));
      atom.config.observe('autoclose-html.forceInline', (function(_this) {
        return function(value) {
          return _this.forceInline = value;
        };
      })(this));
      atom.config.observe('autoclose-html.forceBlock', (function(_this) {
        return function(value) {
          return _this.forceBlock = value;
        };
      })(this));
      atom.config.observe('autoclose-html.makeNeverCloseSelfClosing', (function(_this) {
        return function(value) {
          return _this.makeNeverCloseSelfClosing = value;
        };
      })(this));
      return atom.config.observe('autoclose-html.legacyMode', (function(_this) {
        return function(value) {
          _this.legacyMode = value;
          if (_this.legacyMode) {
            return _this._events();
          } else {
            return _this._unbindEvents();
          }
        };
      })(this));
    },
    deactivate: function() {
      if (this.legacyMode) {
        return this._unbindEvents();
      }
    },
    isInline: function(eleTag) {
      var ele, ret, _ref, _ref1, _ref2;
      if (this.forceInline.indexOf("*") > -1) {
        return true;
      }
      try {
        ele = document.createElement(eleTag);
      } catch (_error) {
        return false;
      }
      if (_ref = eleTag.toLowerCase(), __indexOf.call(this.forceBlock, _ref) >= 0) {
        return false;
      } else if (_ref1 = eleTag.toLowerCase(), __indexOf.call(this.forceInline, _ref1) >= 0) {
        return true;
      }
      document.body.appendChild(ele);
      ret = (_ref2 = window.getComputedStyle(ele).getPropertyValue('display')) === 'inline' || _ref2 === 'inline-block' || _ref2 === 'none';
      document.body.removeChild(ele);
      return ret;
    },
    isNeverClosed: function(eleTag) {
      var _ref;
      return _ref = eleTag.toLowerCase(), __indexOf.call(this.neverClose, _ref) >= 0;
    },
    execAutoclose: function() {
      var doubleQuotes, editor, eleTag, index, isInline, line, matches, oddDoubleQuotes, oddSingleQuotes, partial, range, singleQuotes, tag;
      editor = atom.workspace.getActiveTextEditor();
      range = editor.selections[0].getBufferRange();
      line = editor.buffer.getLines()[range.end.row];
      partial = line.substr(0, range.start.column);
      partial = partial.substr(partial.lastIndexOf('<'));
      if (partial.substr(partial.length - 1, 1) === '/') {
        return;
      }
      singleQuotes = partial.match(/\'/g);
      doubleQuotes = partial.match(/\"/g);
      oddSingleQuotes = singleQuotes && (singleQuotes.length % 2);
      oddDoubleQuotes = doubleQuotes && (doubleQuotes.length % 2);
      if (oddSingleQuotes || oddDoubleQuotes) {
        return;
      }
      index = -1;
      while ((index = partial.indexOf('"')) !== -1) {
        partial = partial.slice(0, index) + partial.slice(partial.indexOf('"', index + 1) + 1);
      }
      while ((index = partial.indexOf("'")) !== -1) {
        partial = partial.slice(0, index) + partial.slice(partial.indexOf("'", index + 1) + 1);
      }
      if ((matches = partial.match(isOpeningTagLikePattern)) == null) {
        return;
      }
      eleTag = matches[matches.length - 1];
      if (this.isNeverClosed(eleTag)) {
        if (this.makeNeverCloseSelfClosing) {
          tag = '/>';
          if (partial.substr(partial.length - 1, 1 !== ' ')) {
            tag = ' ' + tag;
          }
          editor.backspace();
          editor.insertText(tag);
        }
        return;
      }
      isInline = this.isInline(eleTag);
      if (!isInline) {
        editor.insertNewline();
        editor.insertNewline();
      }
      editor.insertText('</' + eleTag + '>');
      if (isInline) {
        return editor.setCursorBufferPosition(range.end);
      } else {
        editor.autoIndentBufferRow(range.end.row + 1);
        return editor.setCursorBufferPosition([range.end.row + 1, atom.workspace.getActivePaneItem().getTabText().length * atom.workspace.getActivePaneItem().indentationForBufferRow(range.end.row + 1)]);
      }
    },
    _events: function() {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          return textEditor.observeGrammar(function(grammar) {
            if (textEditor.autocloseHTMLbufferEvent != null) {
              textEditor.autocloseHTMLbufferEvent.dispose();
            }
            if (atom.views.getView(textEditor).getAttribute('data-grammar').split(' ').indexOf('html') > -1) {
              textEditor.autocloseHTMLbufferEvent = textEditor.buffer.onDidChange(function(e) {
                if ((e != null ? e.newText : void 0) === '>' && textEditor === atom.workspace.getActiveTextEditor()) {
                  return setTimeout(function() {
                    return _this.execAutoclose();
                  });
                }
              });
              return _this.autocloseHTMLEvents.add(textEditor.autocloseHTMLbufferEvent);
            }
          });
        };
      })(this));
    },
    _unbindEvents: function() {
      return this.autocloseHTMLEvents.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2F1dG9jbG9zZS1odG1sL2xpYi9hdXRvY2xvc2UtaHRtbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMERBQUE7SUFBQSxxSkFBQTs7QUFBQSxFQUFBLHVCQUFBLEdBQTBCLDJDQUExQixDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUixDQUZmLENBQUE7O0FBQUEsRUFHQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBSEQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLE1BQUEsRUFBUSxZQUFZLENBQUMsTUFBckI7QUFBQSxJQUVBLFVBQUEsRUFBVyxFQUZYO0FBQUEsSUFHQSxXQUFBLEVBQWEsRUFIYjtBQUFBLElBSUEsVUFBQSxFQUFZLEVBSlo7QUFBQSxJQUtBLHlCQUFBLEVBQTJCLEtBTDNCO0FBQUEsSUFNQSxhQUFBLEVBQWUsS0FOZjtBQUFBLElBT0EsVUFBQSxFQUFZLEtBUFo7QUFBQSxJQVNBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFFTixNQUFBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixHQUFBLENBQUEsbUJBQXZCLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFDSTtBQUFBLFFBQUEsbUNBQUEsRUFBcUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLENBQUQsR0FBQTtBQUNqQyxZQUFBLElBQUcsS0FBQyxDQUFBLFVBQUo7QUFDSSxjQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBWixDQUFBLENBQUE7cUJBQ0EsQ0FBQyxDQUFDLGVBQUYsQ0FBQSxFQUZKO2FBQUEsTUFBQTtBQUlJLGNBQUEsSUFBSSxDQUFDLFNB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

//# sourceURL=/Users/naver/.atom/packages/autoclose-html/lib/autoclose-html.coffee
