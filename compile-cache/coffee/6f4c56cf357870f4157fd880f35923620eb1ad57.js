(function() {
  define(['browser-source-map-support'], function(sourceMapSupport) {
    var e, foo;
    sourceMapSupport.install();
    foo = function() {
      throw new Error('foo');
    };
    try {
      return foo();
    } catch (_error) {
      e = _error;
      if (/\bscript\.coffee\b/.test(e.stack)) {
        return document.body.appendChild(document.createTextNode('Test passed'));
      } else {
        document.body.appendChild(document.createTextNode('Test failed'));
        return console.log(e.stack);
      }
    }
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkLWd1bHAvc3BlYy9maXh0dXJlL25vZGVfbW9kdWxlc19iYWJlbC9zb3VyY2UtbWFwLXN1cHBvcnQvYW1kLXRlc3Qvc2NyaXB0LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFBLENBQU8sQ0FBQyw0QkFBRCxDQUFQLEVBQXVDLFNBQUMsZ0JBQUQsR0FBQTtBQUNyQyxRQUFBLE1BQUE7QUFBQSxJQUFBLGdCQUFnQixDQUFDLE9BQWpCLENBQUEsQ0FBQSxDQUFBO0FBQUEsSUFFQSxHQUFBLEdBQU0sU0FBQSxHQUFBO0FBQUcsWUFBVSxJQUFBLEtBQUEsQ0FBTSxLQUFOLENBQVYsQ0FBSDtJQUFBLENBRk4sQ0FBQTtBQUlBO2FBQ0UsR0FBQSxDQUFBLEVBREY7S0FBQSxjQUFBO0FBR0UsTUFESSxVQUNKLENBQUE7QUFBQSxNQUFBLElBQUcsb0JBQW9CLENBQUMsSUFBckIsQ0FBMEIsQ0FBQyxDQUFDLEtBQTVCLENBQUg7ZUFDRSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQWQsQ0FBMEIsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBMUIsRUFERjtPQUFBLE1BQUE7QUFHRSxRQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEwQixRQUFRLENBQUMsY0FBVCxDQUF3QixhQUF4QixDQUExQixDQUFBLENBQUE7ZUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLENBQUMsQ0FBQyxLQUFkLEVBSkY7T0FIRjtLQUxxQztFQUFBLENBQXZDLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/source-map-support/amd-test/script.coffee
