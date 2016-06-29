(function() {
  var AutocloseHtml;

  AutocloseHtml = require('../lib/autoclose-html');

  describe("AutocloseHtml", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('autocloseHtml');
    });
    return describe("when the autoclose-html:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.autoclose-html')).not.toExist();
        atom.workspaceView.trigger('autoclose-html:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.autoclose-html')).toExist();
          atom.workspaceView.trigger('autoclose-html:toggle');
          return expect(atom.workspaceView.find('.autoclose-html')).not.toExist();
        });
      });
    });
  });

}).call(this);
