(function() {
  var _ref;

  module.exports = {
    cliStatusView: null,
    activate: function(state) {
      return atom.packages.onDidActivateInitialPackages((function(_this) {
        return function() {
          var CliStatusView, createStatusEntry;
          CliStatusView = require('./cli-status-view');
          createStatusEntry = function() {
            return _this.cliStatusView = new CliStatusView(state.cliStatusViewState);
          };
          return createStatusEntry();
        };
      })(this));
    },
    deactivate: function() {
      return this.cliStatusView.destroy();
    },
    config: {
      'windowHeight': {
        type: 'integer',
        "default": 30,
        minimum: 0,
        maximum: 80
      },
      'clearCommandInput': {
        type: 'boolean',
        "default": true
      },
      'logConsole': {
        type: 'boolean',
        "default": false
      },
      'overrideLs': {
        title: 'Override ls',
        type: 'boolean',
        "default": true
      },
      'shell': {
        type: 'string',
        "default": process.platform === 'win32' ? 'cmd.exe' : (_ref = process.env.SHELL) != null ? _ref : '/bin/bash'
      }
    }
  };

}).call(this);
