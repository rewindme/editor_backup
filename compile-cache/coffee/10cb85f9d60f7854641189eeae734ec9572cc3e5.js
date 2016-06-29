(function() {
  var BottomDock;

  BottomDock = require('../lib/bottom-dock');

  describe("BottomDock", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('bottom-dock');
    });
    return describe("when the bottom-dock:toggle event is triggered", function() {
      it("hides and shows the modal panel", function() {
        expect(workspaceElement.querySelector('.bottom-dock')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'bottom-dock:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var bottomDockElement, bottomDockPanel;
          expect(workspaceElement.querySelector('.bottom-dock')).toExist();
          bottomDockElement = workspaceElement.querySelector('.bottom-dock');
          expect(bottomDockElement).toExist();
          bottomDockPanel = atom.workspace.panelForItem(bottomDockElement);
          expect(bottomDockPanel.isVisible()).toBe(true);
          atom.commands.dispatch(workspaceElement, 'bottom-dock:toggle');
          return expect(bottomDockPanel.isVisible()).toBe(false);
        });
      });
      return it("hides and shows the view", function() {
        jasmine.attachToDOM(workspaceElement);
        expect(workspaceElement.querySelector('.bottom-dock')).not.toExist();
        atom.commands.dispatch(workspaceElement, 'bottom-dock:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          var bottomDockElement;
          bottomDockElement = workspaceElement.querySelector('.bottom-dock');
          expect(bottomDockElement).toBeVisible();
          atom.commands.dispatch(workspaceElement, 'bottom-dock:toggle');
          return expect(bottomDockElement).not.toBeVisible();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2JvdHRvbS1kb2NrL3NwZWMvYm90dG9tLWRvY2stc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsb0JBQVIsQ0FBYixDQUFBOztBQUFBLEVBT0EsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFFBQUEseUNBQUE7QUFBQSxJQUFBLE9BQXdDLEVBQXhDLEVBQUMsMEJBQUQsRUFBbUIsMkJBQW5CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FBbkIsQ0FBQTthQUNBLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixhQUE5QixFQUZYO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxRQUFBLENBQVMsZ0RBQVQsRUFBMkQsU0FBQSxHQUFBO0FBQ3pELE1BQUEsRUFBQSxDQUFHLGlDQUFILEVBQXNDLFNBQUEsR0FBQTtBQUdwQyxRQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixjQUEvQixDQUFQLENBQXNELENBQUMsR0FBRyxDQUFDLE9BQTNELENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLG9CQUF6QyxDQUpBLENBQUE7QUFBQSxRQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGtCQURjO1FBQUEsQ0FBaEIsQ0FOQSxDQUFBO2VBU0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsa0NBQUE7QUFBQSxVQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixjQUEvQixDQUFQLENBQXNELENBQUMsT0FBdkQsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUVBLGlCQUFBLEdBQW9CLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLGNBQS9CLENBRnBCLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxpQkFBUCxDQUF5QixDQUFDLE9BQTFCLENBQUEsQ0FIQSxDQUFBO0FBQUEsVUFLQSxlQUFBLEdBQWtCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixpQkFBNUIsQ0FMbEIsQ0FBQTtBQUFBLFVBTUEsTUFBQSxDQUFPLGVBQWUsQ0FBQyxTQUFoQixDQUFBLENBQVAsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxJQUF6QyxDQU5BLENBQUE7QUFBQSxVQU9BLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsRUFBeUMsb0JBQXpDLENBUEEsQ0FBQTtpQkFRQSxNQUFBLENBQU8sZUFBZSxDQUFDLFNBQWhCLENBQUEsQ0FBUCxDQUFtQyxDQUFDLElBQXBDLENBQXlDLEtBQXpDLEVBVEc7UUFBQSxDQUFMLEVBWm9DO01BQUEsQ0FBdEMsQ0FBQSxDQUFBO2FBdUJBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFPN0IsUUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixnQkFBcEIsQ0FBQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsY0FBL0IsQ0FBUCxDQUFzRCxDQUFDLEdBQUcsQ0FBQyxPQUEzRCxDQUFBLENBRkEsQ0FBQTtBQUFBLFFBTUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxvQkFBekMsQ0FOQSxDQUFBO0FBQUEsUUFRQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtpQkFDZCxrQkFEYztRQUFBLENBQWhCLENBUkEsQ0FBQTtlQVdBLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFFSCxjQUFBLGlCQUFBO0FBQUEsVUFBQSxpQkFBQSxHQUFvQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixjQUEvQixDQUFwQixDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8saUJBQVAsQ0FBeUIsQ0FBQyxXQUExQixDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5QyxvQkFBekMsQ0FGQSxDQUFBO2lCQUdBLE1BQUEsQ0FBTyxpQkFBUCxDQUF5QixDQUFDLEdBQUcsQ0FBQyxXQUE5QixDQUFBLEVBTEc7UUFBQSxDQUFMLEVBbEI2QjtNQUFBLENBQS9CLEVBeEJ5RDtJQUFBLENBQTNELEVBUHFCO0VBQUEsQ0FBdkIsQ0FQQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/naver/.atom/packages/bottom-dock/spec/bottom-dock-spec.coffee
