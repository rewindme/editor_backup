(function() {
  var e, foo;

  sourceMapSupport.install();

  foo = function() {
    throw new Error('foo');
  };

  try {
    foo();
  } catch (_error) {
    e = _error;
    if (/\bscript\.coffee\b/.test(e.stack)) {
      document.body.appendChild(document.createTextNode('Test passed'));
    } else {
      document.body.appendChild(document.createTextNode('Test failed'));
      console.log(e.stack);
    }
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkLWd1bHAvc3BlYy9maXh0dXJlL25vZGVfbW9kdWxlc19iYWJlbC9zb3VyY2UtbWFwLXN1cHBvcnQvYnJvd3Nlci10ZXN0L3NjcmlwdC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLGdCQUFnQixDQUFDLE9BQWpCLENBQUEsQ0FBQSxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLFNBQUEsR0FBQTtBQUFHLFVBQVUsSUFBQSxLQUFBLENBQU0sS0FBTixDQUFWLENBQUg7RUFBQSxDQUZOLENBQUE7O0FBSUE7QUFDRSxJQUFBLEdBQUEsQ0FBQSxDQUFBLENBREY7R0FBQSxjQUFBO0FBR0UsSUFESSxVQUNKLENBQUE7QUFBQSxJQUFBLElBQUcsb0JBQW9CLENBQUMsSUFBckIsQ0FBMEIsQ0FBQyxDQUFDLEtBQTVCLENBQUg7QUFDRSxNQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEwQixRQUFRLENBQUMsY0FBVCxDQUF3QixhQUF4QixDQUExQixDQUFBLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQWQsQ0FBMEIsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBMUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLENBQUMsQ0FBQyxLQUFkLENBREEsQ0FIRjtLQUhGO0dBSkE7QUFBQSIKfQ==

//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/source-map-support/browser-test/script.coffee
