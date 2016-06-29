(function() {
  var Emitter;

  Emitter = require('atom').Emitter;

  module.exports = {
    openPath: function(path, callback) {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.workspace.open(path);
      });
      return runs(function() {
        return callback(atom.views.getView(atom.workspace.getActivePaneItem()));
      });
    },
    rowRangeFrom: function(marker) {
      return [marker.getTailBufferPosition().row, marker.getHeadBufferPosition().row];
    },
    pkgEmitter: function() {
      var emitter;
      emitter = new Emitter;
      return {
        onDidResolveConflict: function(callback) {
          return emitter.on('did-resolve-conflict', callback);
        },
        didResolveConflict: function(event) {
          return emitter.emit('did-resolve-conflict', event);
        },
        onDidResolveFile: function(callback) {
          return emitter.on('did-resolve-file', callback);
        },
        didResolveFile: function(event) {
          return emitter.emit('did-resolve-file', event);
        },
        onDidQuitConflictResolution: function(callback) {
          return emitter.on('did-quit-conflict-resolution', callback);
        },
        didQuitConflictResolution: function() {
          return emitter.emit('did-quit-conflict-resolution');
        },
        onDidCompleteConflictResolution: function(callback) {
          return emitter.on('did-complete-conflict-resolution', callback);
        },
        didCompleteConflictResolution: function() {
          return emitter.emit('did-complete-conflict-resolution');
        },
        dispose: function() {
          return emitter.dispose();
        }
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9zcGVjL3V0aWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE9BQUE7O0FBQUEsRUFBQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtBQUNSLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBREEsQ0FBQTtBQUFBLE1BR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBcEIsRUFBSDtNQUFBLENBQWhCLENBSEEsQ0FBQTthQUtBLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxRQUFBLENBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWYsQ0FBQSxDQUFuQixDQUFULEVBREc7TUFBQSxDQUFMLEVBTlE7SUFBQSxDQUFWO0FBQUEsSUFTQSxZQUFBLEVBQWMsU0FBQyxNQUFELEdBQUE7YUFDWixDQUFDLE1BQU0sQ0FBQyxxQkFBUCxDQUFBLENBQThCLENBQUMsR0FBaEMsRUFBcUMsTUFBTSxDQUFDLHFCQUFQLENBQUEsQ0FBOEIsQ0FBQyxHQUFwRSxFQURZO0lBQUEsQ0FUZDtBQUFBLElBWUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEdBQUEsQ0FBQSxPQUFWLENBQUE7QUFFQSxhQUFPO0FBQUEsUUFDTCxvQkFBQSxFQUFzQixTQUFDLFFBQUQsR0FBQTtpQkFBYyxPQUFPLENBQUMsRUFBUixDQUFXLHNCQUFYLEVBQW1DLFFBQW5DLEVBQWQ7UUFBQSxDQURqQjtBQUFBLFFBRUwsa0JBQUEsRUFBb0IsU0FBQyxLQUFELEdBQUE7aUJBQVcsT0FBTyxDQUFDLElBQVIsQ0FBYSxzQkFBYixFQUFxQyxLQUFyQyxFQUFYO1FBQUEsQ0FGZjtBQUFBLFFBR0wsZ0JBQUEsRUFBa0IsU0FBQyxRQUFELEdBQUE7aUJBQWMsT0FBTyxDQUFDLEVBQVIsQ0FBVyxrQkFBWCxFQUErQixRQUEvQixFQUFkO1FBQUEsQ0FIYjtBQUFBLFFBSUwsY0FBQSxFQUFnQixTQUFDLEtBQUQsR0FBQTtpQkFBVyxPQUFPLENBQUMsSUFBUixDQUFhLGtCQUFiLEVBQWlDLEtBQWpDLEVBQVg7UUFBQSxDQUpYO0FBQUEsUUFLTCwyQkFBQSxFQUE2QixTQUFDLFFBQUQsR0FBQTtpQkFBYyxPQUFPLENBQUMsRUFBUixDQUFXLDhCQUFYLEVBQTJDLFFBQTNDLEVBQWQ7UUFBQSxDQUx4QjtBQUFBLFFBTUwseUJBQUEsRUFBMkIsU0FBQSxHQUFBO2lCQUFHLE9BQU8sQ0FBQyxJQUFSLENBQWEsOEJBQWIsRUFBSDtRQUFBLENBTnRCO0FBQUEsUUFPTCwrQkFBQSxFQUFpQyxTQUFDLFFBQUQsR0FBQTtpQkFBYyxPQUFPLENBQUMsRUFBUixDQUFXLGtDQUFYLEVBQStDLFFBQS9DLEVBQWQ7UUFBQSxDQVA1QjtBQUFBLFFBUUwsNkJBQUEsRUFBK0IsU0FBQSxHQUFBO2lCQUFHLE9BQU8sQ0FBQyxJQUFSLENBQWEsa0NBQWIsRUFBSDtRQUFBLENBUjFCO0FBQUEsUUFTTCxPQUFBLEVBQVMsU0FBQSxHQUFBO2lCQUFHLE9BQU8sQ0FBQyxPQUFSLENBQUEsRUFBSDtRQUFBLENBVEo7T0FBUCxDQUhVO0lBQUEsQ0FaWjtHQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/merge-conflicts/spec/util.coffee
