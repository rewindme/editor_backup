(function() {
  module.exports = {
    oldStdoutWrite: process.stdout.write,
    oldStderrWrite: process.stderr.write,
    hook: function() {
      if (process.platform === 'win32') {
        process.stdout.write = function(string, encoding, fd) {
          return console.log(string);
        };
        return process.stderr.write = function(string, encoding, fd) {
          return console.error(string);
        };
      }
    },
    restore: function() {
      if (process.platform === 'win32') {
        process.stdout.write = this.oldStdoutWrite;
        return process.stderr.write = this.oldStderrWrite;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2FzY2lpZG9jLXByZXZpZXcvbGliL3N0ZC1zdHJlYW0taG9vay5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFHQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUFnQixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQS9CO0FBQUEsSUFDQSxjQUFBLEVBQWdCLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FEL0I7QUFBQSxJQUdBLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFDSixNQUFBLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBdkI7QUFDRSxRQUFBLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBZixHQUF1QixTQUFDLE1BQUQsRUFBUyxRQUFULEVBQW1CLEVBQW5CLEdBQUE7aUJBQTBCLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWixFQUExQjtRQUFBLENBQXZCLENBQUE7ZUFDQSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQWYsR0FBdUIsU0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixFQUFuQixHQUFBO2lCQUEwQixPQUFPLENBQUMsS0FBUixDQUFjLE1BQWQsRUFBMUI7UUFBQSxFQUZ6QjtPQURJO0lBQUEsQ0FITjtBQUFBLElBUUEsT0FBQSxFQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QjtBQUNFLFFBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLEdBQXVCLElBQUMsQ0FBQSxjQUF4QixDQUFBO2VBQ0EsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFmLEdBQXVCLElBQUMsQ0FBQSxlQUYxQjtPQURPO0lBQUEsQ0FSVDtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/asciidoc-preview/lib/std-stream-hook.coffee
