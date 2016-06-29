function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _atomBuildSpecHelpers = require('atom-build-spec-helpers');

var _atomBuildSpecHelpers2 = _interopRequireDefault(_atomBuildSpecHelpers);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

'use babel';

describe('Visible', function () {
  var directory = null;
  var workspaceElement = null;
  var waitTime = process.env.CI ? 2400 : 200;
  var originalHomedirFn = _os2['default'].homedir;

  _temp2['default'].track();

  beforeEach(function () {
    atom.config.set('build.buildOnSave', false);
    atom.config.set('build.panelVisibility', 'Toggle');
    atom.config.set('build.saveOnBuild', false);
    atom.config.set('build.stealFocus', true);
    atom.config.set('build.notificationOnRefresh', true);
    atom.notifications.clear();

    workspaceElement = atom.views.getView(atom.workspace);
    workspaceElement.setAttribute('style', 'width:9999px');
    jasmine.attachToDOM(workspaceElement);
    jasmine.unspy(window, 'setTimeout');
    jasmine.unspy(window, 'clearTimeout');

    runs(function () {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
    });

    waitsForPromise(function () {
      return _atomBuildSpecHelpers2['default'].vouch(_temp2['default'].mkdir, { prefix: 'atom-build-spec-' }).then(function (dir) {
        return _atomBuildSpecHelpers2['default'].vouch(_fsExtra2['default'].realpath, dir);
      }).then(function (dir) {
        directory = dir + '/';
        atom.project.setPaths([directory]);
        return _atomBuildSpecHelpers2['default'].vouch(_temp2['default'].mkdir, 'atom-build-spec-home');
      }).then(function (dir) {
        return _atomBuildSpecHelpers2['default'].vouch(_fsExtra2['default'].realpath, dir);
      }).then(function (dir) {
        _os2['default'].homedir = function () {
          return dir;
        };
      });
    });
  });

  afterEach(function () {
    _os2['default'].homedir = originalHomedirFn;
    _fsExtra2['default'].removeSync(directory);
  });

  describe('when package is activated with panel visibility set to Keep Visible', function () {
    beforeEach(function () {
      atom.config.set('build.panelVisibility', 'Keep Visible');
      waitsForPromise(function () {
        return atom.packages.activatePackage('build');
      });
    });

    it('should show build window', function () {
      expect(workspaceElement.querySelector('.build')).toExist();
    });
  });

  describe('when package is activated with panel visibility set to Toggle', function () {
    beforeEach(function () {
      atom.config.set('build.panelVisibility', 'Toggle');
      waitsForPromise(function () {
        return atom.packages.activatePackage('build');
      });
    });

    describe('when build panel is toggled and it is visible', function () {
      beforeEach(function () {
        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
      });

      it('should hide the build panel', function () {
        expect(workspaceElement.querySelector('.build')).toExist();

        atom.commands.dispatch(workspaceElement, 'build:toggle-panel');

        expect(workspaceElement.querySelector('.build')).not.toExist();
      });
    });

    describe('when panel visibility is set to Show on Error', function () {
      it('should only show the build panel if a build fails', function () {
        atom.config.set('build.panelVisibility', 'Show on Error');

        _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
        }));

        waitsForPromise(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });

        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        /* Give it some reasonable time to show itself if there is a bug */
        waits(waitTime);

        runs(function () {
          expect(workspaceElement.querySelector('.build')).not.toExist();
        });

        runs(function () {
          _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
            cmd: 'echo Very bad... && exit 1'
          }));
        });

        // .atom-build.json is updated asynchronously... give it some time
        waits(waitTime);

        runs(function () {
          atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        waitsFor(function () {
          return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('error');
        });

        waits(waitTime);

        runs(function () {
          expect(workspaceElement.querySelector('.terminal').terminal.getContent()).toMatch(/Very bad\.\.\./);
        });
      });
    });

    describe('when panel visibility is set to Hidden', function () {
      it('should not show the build panel if build succeeeds', function () {
        atom.config.set('build.panelVisibility', 'Hidden');

        _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
        }));

        waitsForPromise(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });

        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        /* Give it some reasonable time to show itself if there is a bug */
        waits(waitTime);

        runs(function () {
          expect(workspaceElement.querySelector('.build')).not.toExist();
        });
      });

      it('should not show the build panel if build fails', function () {
        atom.config.set('build.panelVisibility', 'Hidden');

        _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo "Very bad..." && exit 2'
        }));

        waitsForPromise(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });

        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        /* Give it some reasonable time to show itself if there is a bug */
        waits(waitTime);

        runs(function () {
          expect(workspaceElement.querySelector('.build')).not.toExist();
        });
      });

      it('should show the build panel if it is toggled', function () {
        atom.config.set('build.panelVisibility', 'Hidden');

        _fsExtra2['default'].writeFileSync(directory + '.atom-build.json', JSON.stringify({
          cmd: 'echo Surprising is the passing of time but not so, as the time of passing.'
        }));

        waitsForPromise(function () {
          return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
        });

        runs(function () {
          return atom.commands.dispatch(workspaceElement, 'build:trigger');
        });

        waits(waitTime); // Let build finish. Since UI component is not visible yet, there's nothing to poll.

        runs(function () {
          atom.commands.dispatch(workspaceElement, 'build:toggle-panel');
        });

        waitsFor(function () {
          return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
        });

        runs(function () {
          expect(workspaceElement.querySelector('.terminal').terminal.getContent()).toMatch(/Surprising is the passing of time but not so, as the time of passing/);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9zcGVjL2J1aWxkLXZpc2libGUtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzt1QkFFZSxVQUFVOzs7O29CQUNSLE1BQU07Ozs7b0NBQ0MseUJBQXlCOzs7O2tCQUNsQyxJQUFJOzs7O0FBTG5CLFdBQVcsQ0FBQzs7QUFPWixRQUFRLENBQUMsU0FBUyxFQUFFLFlBQU07QUFDeEIsTUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLE1BQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7QUFDN0MsTUFBTSxpQkFBaUIsR0FBRyxnQkFBRyxPQUFPLENBQUM7O0FBRXJDLG9CQUFLLEtBQUssRUFBRSxDQUFDOztBQUViLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbkQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFM0Isb0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RELG9CQUFnQixDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDdkQsV0FBTyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3RDLFdBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLFdBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUV0QyxRQUFJLENBQUMsWUFBTTtBQUNULHNCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0RCxhQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7S0FDdkMsQ0FBQyxDQUFDOztBQUVILG1CQUFlLENBQUMsWUFBTTtBQUNwQixhQUFPLGtDQUFZLEtBQUssQ0FBQyxrQkFBSyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFDLEdBQUcsRUFBSztBQUNsRixlQUFPLGtDQUFZLEtBQUssQ0FBQyxxQkFBRyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7T0FDNUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxVQUFDLEdBQUcsRUFBSztBQUNoQixpQkFBUyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDdEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBRSxTQUFTLENBQUUsQ0FBQyxDQUFDO0FBQ3JDLGVBQU8sa0NBQVksS0FBSyxDQUFDLGtCQUFLLEtBQUssRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO09BQzlELENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQyxHQUFHLEVBQUs7QUFDaEIsZUFBTyxrQ0FBWSxLQUFLLENBQUMscUJBQUcsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO09BQzVDLENBQUMsQ0FBQyxJQUFJLENBQUUsVUFBQyxHQUFHLEVBQUs7QUFDaEIsd0JBQUcsT0FBTyxHQUFHO2lCQUFNLEdBQUc7U0FBQSxDQUFDO09BQ3hCLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQzs7QUFFSCxXQUFTLENBQUMsWUFBTTtBQUNkLG9CQUFHLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQztBQUMvQix5QkFBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDMUIsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxxRUFBcUUsRUFBRSxZQUFNO0FBQ3BGLGNBQVUsQ0FBQyxZQUFNO0FBQ2YsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDekQscUJBQWUsQ0FBQyxZQUFNO0FBQ3BCLGVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDL0MsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQywwQkFBMEIsRUFBRSxZQUFNO0FBQ25DLFlBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM1RCxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLCtEQUErRCxFQUFFLFlBQU07QUFDOUUsY0FBVSxDQUFDLFlBQU07QUFDZixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRCxxQkFBZSxDQUFDLFlBQU07QUFDcEIsZUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUMvQyxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7O0FBRUgsWUFBUSxDQUFDLCtDQUErQyxFQUFFLFlBQU07QUFDOUQsZ0JBQVUsQ0FBQyxZQUFNO0FBQ2YsWUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztPQUNoRSxDQUFDLENBQUM7O0FBRUgsUUFBRSxDQUFDLDZCQUE2QixFQUFFLFlBQU07QUFDdEMsY0FBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUUzRCxZQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDOztBQUUvRCxjQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ2hFLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQzs7QUFFSCxZQUFRLENBQUMsK0NBQStDLEVBQUUsWUFBTTtBQUM5RCxRQUFFLENBQUMsbURBQW1ELEVBQUUsWUFBTTtBQUM1RCxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxlQUFlLENBQUMsQ0FBQzs7QUFFMUQsNkJBQUcsYUFBYSxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQzlELGFBQUcsRUFBRSw0RUFBNEU7U0FDbEYsQ0FBQyxDQUFDLENBQUM7O0FBRUosdUJBQWUsQ0FBQztpQkFBTSxrQ0FBWSxtQkFBbUIsRUFBRTtTQUFBLENBQUMsQ0FBQzs7QUFFekQsWUFBSSxDQUFDO2lCQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQztTQUFBLENBQUMsQ0FBQzs7O0FBR3RFLGFBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFaEIsWUFBSSxDQUFDLFlBQU07QUFDVCxnQkFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoRSxDQUFDLENBQUM7O0FBRUgsWUFBSSxDQUFDLFlBQU07QUFDVCwrQkFBRyxhQUFhLENBQUMsU0FBUyxHQUFHLGtCQUFrQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDOUQsZUFBRyxFQUFFLDRCQUE0QjtXQUNsQyxDQUFDLENBQUMsQ0FBQztTQUNMLENBQUMsQ0FBQzs7O0FBR0gsYUFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVoQixZQUFJLENBQUMsWUFBTTtBQUNULGNBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxDQUFDO1NBQzNELENBQUMsQ0FBQzs7QUFFSCxnQkFBUSxDQUFDLFlBQU07QUFDYixpQkFBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQ3BELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQy9FLENBQUMsQ0FBQzs7QUFFSCxhQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWhCLFlBQUksQ0FBQyxZQUFNO0FBQ1QsZ0JBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDckcsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDOztBQUVILFlBQVEsQ0FBQyx3Q0FBd0MsRUFBRSxZQUFNO0FBQ3ZELFFBQUUsQ0FBQyxvREFBb0QsRUFBRSxZQUFNO0FBQzdELFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUVuRCw2QkFBRyxhQUFhLENBQUMsU0FBUyxHQUFHLGtCQUFrQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDOUQsYUFBRyxFQUFFLDRFQUE0RTtTQUNsRixDQUFDLENBQUMsQ0FBQzs7QUFFSix1QkFBZSxDQUFDO2lCQUFNLGtDQUFZLG1CQUFtQixFQUFFO1NBQUEsQ0FBQyxDQUFDOztBQUV6RCxZQUFJLENBQUM7aUJBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDO1NBQUEsQ0FBQyxDQUFDOzs7QUFHdEUsYUFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVoQixZQUFJLENBQUMsWUFBTTtBQUNULGdCQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hFLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQzs7QUFFSCxRQUFFLENBQUMsZ0RBQWdELEVBQUUsWUFBTTtBQUN6RCxZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFbkQsNkJBQUcsYUFBYSxDQUFDLFNBQVMsR0FBRyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQzlELGFBQUcsRUFBRSw4QkFBOEI7U0FDcEMsQ0FBQyxDQUFDLENBQUM7O0FBRUosdUJBQWUsQ0FBQztpQkFBTSxrQ0FBWSxtQkFBbUIsRUFBRTtTQUFBLENBQUMsQ0FBQzs7QUFFekQsWUFBSSxDQUFDO2lCQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQztTQUFBLENBQUMsQ0FBQzs7O0FBR3RFLGFBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFaEIsWUFBSSxDQUFDLFlBQU07QUFDVCxnQkFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoRSxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7O0FBRUgsUUFBRSxDQUFDLDhDQUE4QyxFQUFFLFlBQU07QUFDdkQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsUUFBUSxDQUFDLENBQUM7O0FBRW5ELDZCQUFHLGFBQWEsQ0FBQyxTQUFTLEdBQUcsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUM5RCxhQUFHLEVBQUUsNEVBQTRFO1NBQ2xGLENBQUMsQ0FBQyxDQUFDOztBQUVKLHVCQUFlLENBQUM7aUJBQU0sa0NBQVksbUJBQW1CLEVBQUU7U0FBQSxDQUFDLENBQUM7O0FBRXpELFlBQUksQ0FBQztpQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUM7U0FBQSxDQUFDLENBQUM7O0FBRXRFLGFBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFaEIsWUFBSSxDQUFDLFlBQU07QUFDVCxjQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1NBQ2hFLENBQUMsQ0FBQzs7QUFFSCxnQkFBUSxDQUFDLFlBQU07QUFDYixpQkFBTyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQ3BELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2pGLENBQUMsQ0FBQzs7QUFFSCxZQUFJLENBQUMsWUFBTTtBQUNULGdCQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO1NBQzNKLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvYnVpbGQvc3BlYy9idWlsZC12aXNpYmxlLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnO1xuaW1wb3J0IHNwZWNIZWxwZXJzIGZyb20gJ2F0b20tYnVpbGQtc3BlYy1oZWxwZXJzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5cbmRlc2NyaWJlKCdWaXNpYmxlJywgKCkgPT4ge1xuICBsZXQgZGlyZWN0b3J5ID0gbnVsbDtcbiAgbGV0IHdvcmtzcGFjZUVsZW1lbnQgPSBudWxsO1xuICBjb25zdCB3YWl0VGltZSA9IHByb2Nlc3MuZW52LkNJID8gMjQwMCA6IDIwMDtcbiAgY29uc3Qgb3JpZ2luYWxIb21lZGlyRm4gPSBvcy5ob21lZGlyO1xuXG4gIHRlbXAudHJhY2soKTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLmJ1aWxkT25TYXZlJywgZmFsc2UpO1xuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JywgJ1RvZ2dsZScpO1xuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQuc2F2ZU9uQnVpbGQnLCBmYWxzZSk7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5zdGVhbEZvY3VzJywgdHJ1ZSk7XG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5ub3RpZmljYXRpb25PblJlZnJlc2gnLCB0cnVlKTtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuY2xlYXIoKTtcblxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgIHdvcmtzcGFjZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICd3aWR0aDo5OTk5cHgnKTtcbiAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpO1xuICAgIGphc21pbmUudW5zcHkod2luZG93LCAnc2V0VGltZW91dCcpO1xuICAgIGphc21pbmUudW5zcHkod2luZG93LCAnY2xlYXJUaW1lb3V0Jyk7XG5cbiAgICBydW5zKCgpID0+IHtcbiAgICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KTtcbiAgICB9KTtcblxuICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICByZXR1cm4gc3BlY0hlbHBlcnMudm91Y2godGVtcC5ta2RpciwgeyBwcmVmaXg6ICdhdG9tLWJ1aWxkLXNwZWMtJyB9KS50aGVuKCAoZGlyKSA9PiB7XG4gICAgICAgIHJldHVybiBzcGVjSGVscGVycy52b3VjaChmcy5yZWFscGF0aCwgZGlyKTtcbiAgICAgIH0pLnRoZW4oIChkaXIpID0+IHtcbiAgICAgICAgZGlyZWN0b3J5ID0gZGlyICsgJy8nO1xuICAgICAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoWyBkaXJlY3RvcnkgXSk7XG4gICAgICAgIHJldHVybiBzcGVjSGVscGVycy52b3VjaCh0ZW1wLm1rZGlyLCAnYXRvbS1idWlsZC1zcGVjLWhvbWUnKTtcbiAgICAgIH0pLnRoZW4oIChkaXIpID0+IHtcbiAgICAgICAgcmV0dXJuIHNwZWNIZWxwZXJzLnZvdWNoKGZzLnJlYWxwYXRoLCBkaXIpO1xuICAgICAgfSkudGhlbiggKGRpcikgPT4ge1xuICAgICAgICBvcy5ob21lZGlyID0gKCkgPT4gZGlyO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgb3MuaG9tZWRpciA9IG9yaWdpbmFsSG9tZWRpckZuO1xuICAgIGZzLnJlbW92ZVN5bmMoZGlyZWN0b3J5KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3doZW4gcGFja2FnZSBpcyBhY3RpdmF0ZWQgd2l0aCBwYW5lbCB2aXNpYmlsaXR5IHNldCB0byBLZWVwIFZpc2libGUnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdLZWVwIFZpc2libGUnKTtcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnYnVpbGQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGJ1aWxkIHdpbmRvdycsICgpID0+IHtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS50b0V4aXN0KCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHBhY2thZ2UgaXMgYWN0aXZhdGVkIHdpdGggcGFuZWwgdmlzaWJpbGl0eSBzZXQgdG8gVG9nZ2xlJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5wYW5lbFZpc2liaWxpdHknLCAnVG9nZ2xlJyk7XG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2J1aWxkJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aGVuIGJ1aWxkIHBhbmVsIGlzIHRvZ2dsZWQgYW5kIGl0IGlzIHZpc2libGUnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dG9nZ2xlLXBhbmVsJyk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBoaWRlIHRoZSBidWlsZCBwYW5lbCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkJykpLnRvRXhpc3QoKTtcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0b2dnbGUtcGFuZWwnKTtcblxuICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3doZW4gcGFuZWwgdmlzaWJpbGl0eSBpcyBzZXQgdG8gU2hvdyBvbiBFcnJvcicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgb25seSBzaG93IHRoZSBidWlsZCBwYW5lbCBpZiBhIGJ1aWxkIGZhaWxzJywgKCkgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdTaG93IG9uIEVycm9yJyk7XG5cbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBjbWQ6ICdlY2hvIFN1cnByaXNpbmcgaXMgdGhlIHBhc3Npbmcgb2YgdGltZSBidXQgbm90IHNvLCBhcyB0aGUgdGltZSBvZiBwYXNzaW5nLidcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBzcGVjSGVscGVycy5yZWZyZXNoQXdhaXRUYXJnZXRzKCkpO1xuXG4gICAgICAgIHJ1bnMoKCkgPT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpKTtcblxuICAgICAgICAvKiBHaXZlIGl0IHNvbWUgcmVhc29uYWJsZSB0aW1lIHRvIHNob3cgaXRzZWxmIGlmIHRoZXJlIGlzIGEgYnVnICovXG4gICAgICAgIHdhaXRzKHdhaXRUaW1lKTtcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGNtZDogJ2VjaG8gVmVyeSBiYWQuLi4gJiYgZXhpdCAxJ1xuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gLmF0b20tYnVpbGQuanNvbiBpcyB1cGRhdGVkIGFzeW5jaHJvbm91c2x5Li4uIGdpdmUgaXQgc29tZSB0aW1lXG4gICAgICAgIHdhaXRzKHdhaXRUaW1lKTtcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdhaXRzRm9yKCgpID0+IHtcbiAgICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnZXJyb3InKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2FpdHMod2FpdFRpbWUpO1xuXG4gICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXJtaW5hbCcpLnRlcm1pbmFsLmdldENvbnRlbnQoKSkudG9NYXRjaCgvVmVyeSBiYWRcXC5cXC5cXC4vKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aGVuIHBhbmVsIHZpc2liaWxpdHkgaXMgc2V0IHRvIEhpZGRlbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgbm90IHNob3cgdGhlIGJ1aWxkIHBhbmVsIGlmIGJ1aWxkIHN1Y2NlZWVkcycsICgpID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5wYW5lbFZpc2liaWxpdHknLCAnSGlkZGVuJyk7XG5cbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhkaXJlY3RvcnkgKyAnLmF0b20tYnVpbGQuanNvbicsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBjbWQ6ICdlY2hvIFN1cnByaXNpbmcgaXMgdGhlIHBhc3Npbmcgb2YgdGltZSBidXQgbm90IHNvLCBhcyB0aGUgdGltZSBvZiBwYXNzaW5nLidcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiBzcGVjSGVscGVycy5yZWZyZXNoQXdhaXRUYXJnZXRzKCkpO1xuXG4gICAgICAgIHJ1bnMoKCkgPT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnYnVpbGQ6dHJpZ2dlcicpKTtcblxuICAgICAgICAvKiBHaXZlIGl0IHNvbWUgcmVhc29uYWJsZSB0aW1lIHRvIHNob3cgaXRzZWxmIGlmIHRoZXJlIGlzIGEgYnVnICovXG4gICAgICAgIHdhaXRzKHdhaXRUaW1lKTtcblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQnKSkubm90LnRvRXhpc3QoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyB0aGUgYnVpbGQgcGFuZWwgaWYgYnVpbGQgZmFpbHMnLCAoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JywgJ0hpZGRlbicpO1xuXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY21kOiAnZWNobyBcIlZlcnkgYmFkLi4uXCIgJiYgZXhpdCAyJ1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlKCgpID0+IHNwZWNIZWxwZXJzLnJlZnJlc2hBd2FpdFRhcmdldHMoKSk7XG5cbiAgICAgICAgcnVucygoKSA9PiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0cmlnZ2VyJykpO1xuXG4gICAgICAgIC8qIEdpdmUgaXQgc29tZSByZWFzb25hYmxlIHRpbWUgdG8gc2hvdyBpdHNlbGYgaWYgdGhlcmUgaXMgYSBidWcgKi9cbiAgICAgICAgd2FpdHMod2FpdFRpbWUpO1xuXG4gICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCcpKS5ub3QudG9FeGlzdCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgdGhlIGJ1aWxkIHBhbmVsIGlmIGl0IGlzIHRvZ2dsZWQnLCAoKSA9PiB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JywgJ0hpZGRlbicpO1xuXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoZGlyZWN0b3J5ICsgJy5hdG9tLWJ1aWxkLmpzb24nLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY21kOiAnZWNobyBTdXJwcmlzaW5nIGlzIHRoZSBwYXNzaW5nIG9mIHRpbWUgYnV0IG5vdCBzbywgYXMgdGhlIHRpbWUgb2YgcGFzc2luZy4nXG4gICAgICAgIH0pKTtcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gc3BlY0hlbHBlcnMucmVmcmVzaEF3YWl0VGFyZ2V0cygpKTtcblxuICAgICAgICBydW5zKCgpID0+IGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2J1aWxkOnRyaWdnZXInKSk7XG5cbiAgICAgICAgd2FpdHMod2FpdFRpbWUpOyAvLyBMZXQgYnVpbGQgZmluaXNoLiBTaW5jZSBVSSBjb21wb25lbnQgaXMgbm90IHZpc2libGUgeWV0LCB0aGVyZSdzIG5vdGhpbmcgdG8gcG9sbC5cblxuICAgICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdidWlsZDp0b2dnbGUtcGFuZWwnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgICAgd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykuY2xhc3NMaXN0LmNvbnRhaW5zKCdzdWNjZXNzJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZXJtaW5hbCcpLnRlcm1pbmFsLmdldENvbnRlbnQoKSkudG9NYXRjaCgvU3VycHJpc2luZyBpcyB0aGUgcGFzc2luZyBvZiB0aW1lIGJ1dCBub3Qgc28sIGFzIHRoZSB0aW1lIG9mIHBhc3NpbmcvKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
//# sourceURL=/Users/naver/.atom/packages/build/spec/build-visible-spec.js
