(function() {
  var $, $$, CreateFixtures, Q, WorkspaceView, _ref;

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$, WorkspaceView = _ref.WorkspaceView;

  Q = require('q');

  CreateFixtures = require('./create-fixtures');

  describe("remote-edit:", function() {
    var editorElement, workspaceElement, _ref1;
    _ref1 = [], workspaceElement = _ref1[0], editorElement = _ref1[1];
    return beforeEach(function() {
      var activationPromise, fixture;
      fixture = new CreateFixtures();
      workspaceElement = atom.views.getView(atom.workspace);
      activationPromise = null;
      atom.config.set('remote-edit.defaultSerializePath', "" + (fixture.getSerializePath()));
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      runs(function() {
        editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
        activationPromise = atom.packages.activatePackage("remote-edit");
        return jasmine.attachToDOM(workspaceElement);
      });
      return waitsForPromise(function() {
        return activationPromise;
      });
    });
  });

}).call(this);
