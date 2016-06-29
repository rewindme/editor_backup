(function() {
  var PreviewView, url;

  url = require('url');

  PreviewView = require('./preview-view');

  module.exports = {
    config: {
      updateOnTabChange: {
        type: 'boolean',
        "default": true
      },
      refreshDebouncePeriod: {
        type: 'integer',
        "default": 100
      },
      liveUpdate: {
        type: 'boolean',
        "default": true
      }
    },
    previewView: null,
    uri: "atom://atom-preview",

    /*
     * This required method is called when your package is activated. It is passed
     * the state data from the last time the window was serialized if your module
     * implements the serialize() method. Use this to do initialization work when
     * your package is started (like setting up DOM elements or binding events).
     */
    activate: function(state) {
      atom.commands.add('atom-workspace', {
        'preview:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'preview:toggle-options': (function(_this) {
          return function() {
            return _this.toggleOptions();
          };
        })(this)
      });
      atom.commands.add('atom-workspace', {
        'preview:select-renderer': (function(_this) {
          return function() {
            return _this.selectRenderer();
          };
        })(this)
      });
      atom.workspace.addOpener((function(_this) {
        return function(uriToOpen) {
          if (uriToOpen !== _this.uri) {
            return;
          }
          return _this.previewView = new PreviewView();
        };
      })(this));
      if (state.isOpen) {
        return this.toggle;
      }
    },

    /*
     * This optional method is called when the window is shutting down, allowing
     * you to return JSON to represent the state of your component. When the
     * window is later restored, the data you returned is passed to your module's
     * activate method so you can restore your view to where the user left off.
     */
    serialize: function() {
      var previewPane;
      previewPane = atom.workspace.paneForURI(this.uri);
      return {
        isOpen: previewPane != null
      };
    },

    /*
     * This optional method is called when the window is shutting down. If your
     * package is watching any files or holding external resources in any other
     * way, release them here. If you're just subscribing to things on window, you
     * don't need to worry because that's getting torn down anyway.
     */
    deactivate: function() {
      var previewPane;
      previewPane = atom.workspace.paneForURI(this.uri);
      if (previewPane) {
        previewPane.destroyItem(previewPane.itemForURI(this.uri));
      }
    },
    toggle: function() {
      var editor, previewPane, previousActivePane;
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      previewPane = atom.workspace.paneForURI(this.uri);
      if (previewPane) {
        previewPane.destroyItem(previewPane.itemForURI(this.uri));
        return;
      }
      previousActivePane = atom.workspace.getActivePane();
      return atom.workspace.open(this.uri, {
        split: 'right',
        searchAllPanes: true
      }).done((function(_this) {
        return function(previewView) {
          if (previewView instanceof PreviewView) {
            return previewView.initialize();
          }
        };
      })(this));
    },
    toggleOptions: function() {
      if (this.previewView != null) {
        return this.previewView.toggleOptions();
      }
    },
    selectRenderer: function() {
      if (this.previewView != null) {
        return this.previewView.selectRenderer();
      }
    }
  };

}).call(this);
