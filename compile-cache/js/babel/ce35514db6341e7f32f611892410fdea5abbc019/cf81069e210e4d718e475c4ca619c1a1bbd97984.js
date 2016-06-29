function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _atomBuildSpecHelpers = require('atom-build-spec-helpers');

var _atomBuildSpecHelpers2 = _interopRequireDefault(_atomBuildSpecHelpers);

'use babel';

describe('Hooks', function () {
  var directory = null;
  var workspaceElement = null;
  var succedingCommandName = 'build:hook-test:succeding';
  var failingCommandName = 'build:hook-test:failing';
  var dummyPackageName = 'atom-build-hooks-dummy-package';
  var dummyPackagePath = __dirname + '/fixture/' + dummyPackageName;

  _temp2['default'].track();

  beforeEach(function () {
    directory = _fsExtra2['default'].realpathSync(_temp2['default'].mkdirSync({ prefix: 'atom-build-spec-' }));
    atom.project.setPaths([directory]);

    atom.config.set('build.buildOnSave', false);
    atom.config.set('build.panelVisibility', 'Toggle');
    atom.config.set('build.saveOnBuild', false);
    atom.config.set('build.notificationOnRefresh', true);

    jasmine.unspy(window, 'setTimeout');
    jasmine.unspy(window, 'clearTimeout');

    runs(function () {
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
    });

    waitsForPromise(function () {
      return Promise.resolve().then(function () {
        return atom.packages.activatePackage('build');
      }).then(function () {
        return atom.packages.activatePackage(dummyPackagePath);
      });
    });

    waitsForPromise(function () {
      return _atomBuildSpecHelpers2['default'].refreshAwaitTargets();
    });
  });

  afterEach(function () {
    _fsExtra2['default'].removeSync(directory);
  });

  it('should call preBuild', function () {
    var pkg = undefined;

    runs(function () {
      pkg = atom.packages.getActivePackage(dummyPackageName).mainModule;
      spyOn(pkg.hooks, 'preBuild');

      atom.commands.dispatch(workspaceElement, succedingCommandName);
    });

    waitsFor(function () {
      return workspaceElement.querySelector('.build .title');
    });

    runs(function () {
      expect(pkg.hooks.preBuild).toHaveBeenCalled();
    });
  });

  describe('postBuild', function () {
    it('should be called with `true` as an argument when build succeded', function () {
      var pkg = undefined;

      runs(function () {
        pkg = atom.packages.getActivePackage(dummyPackageName).mainModule;
        spyOn(pkg.hooks, 'postBuild');

        atom.commands.dispatch(workspaceElement, succedingCommandName);
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('success');
      });

      runs(function () {
        expect(pkg.hooks.postBuild).toHaveBeenCalledWith(true);
      });
    });

    it('should be called with `false` as an argument when build failed', function () {
      var pkg = undefined;

      runs(function () {
        pkg = atom.packages.getActivePackage(dummyPackageName).mainModule;
        spyOn(pkg.hooks, 'postBuild');

        atom.commands.dispatch(workspaceElement, failingCommandName);
      });

      waitsFor(function () {
        return workspaceElement.querySelector('.build .title') && workspaceElement.querySelector('.build .title').classList.contains('error');
      });

      runs(function () {
        expect(pkg.hooks.postBuild).toHaveBeenCalledWith(false);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9zcGVjL2J1aWxkLWhvb2tzLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7dUJBRWUsVUFBVTs7OztvQkFDUixNQUFNOzs7O29DQUNDLHlCQUF5Qjs7OztBQUpqRCxXQUFXLENBQUM7O0FBTVosUUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQ3RCLE1BQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixNQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM1QixNQUFNLG9CQUFvQixHQUFHLDJCQUEyQixDQUFDO0FBQ3pELE1BQU0sa0JBQWtCLEdBQUcseUJBQXlCLENBQUM7QUFDckQsTUFBTSxnQkFBZ0IsR0FBRyxnQ0FBZ0MsQ0FBQztBQUMxRCxNQUFNLGdCQUFnQixHQUFHLFNBQVMsR0FBRyxXQUFXLEdBQUcsZ0JBQWdCLENBQUM7O0FBRXBFLG9CQUFLLEtBQUssRUFBRSxDQUFDOztBQUViLFlBQVUsQ0FBQyxZQUFNO0FBQ2YsYUFBUyxHQUFHLHFCQUFHLFlBQVksQ0FBQyxrQkFBSyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUUsUUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBRSxTQUFTLENBQUUsQ0FBQyxDQUFDOztBQUVyQyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRCxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM1QyxRQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFckQsV0FBTyxDQUFDLEtBQUss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Q0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUNsRSxhQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQzs7QUFFOUIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztPQUM5RCxDQUFDLENBQUM7O0FBRUgsY0FBUSxDQUFDLFlBQU07QUFDYixlQUFPLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsSUFDcEQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDL0UsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxZQUFNO0FBQ1QsY0FBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDekQsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9zcGVjL2J1aWxkLWhvb2tzLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnO1xuaW1wb3J0IHNwZWNIZWxwZXJzIGZyb20gJ2F0b20tYnVpbGQtc3BlYy1oZWxwZXJzJztcblxuZGVzY3JpYmUoJ0hvb2tzJywgKCkgPT4ge1xuICBsZXQgZGlyZWN0b3J5ID0gbnVsbDtcbiAgbGV0IHdvcmtzcGFjZUVsZW1lbnQgPSBudWxsO1xuICBjb25zdCBzdWNjZWRpbmdDb21tYW5kTmFtZSA9ICdidWlsZDpob29rLXRlc3Q6c3VjY2VkaW5nJztcbiAgY29uc3QgZmFpbGluZ0NvbW1hbmROYW1lID0gJ2J1aWxkOmhvb2stdGVzdDpmYWlsaW5nJztcbiAgY29uc3QgZHVtbXlQYWNrYWdlTmFtZSA9ICdhdG9tLWJ1aWxkLWhvb2tzLWR1bW15LXBhY2thZ2UnO1xuICBjb25zdCBkdW1teVBhY2thZ2VQYXRoID0gX19kaXJuYW1lICsgJy9maXh0dXJlLycgKyBkdW1teVBhY2thZ2VOYW1lO1xuXG4gIHRlbXAudHJhY2soKTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBkaXJlY3RvcnkgPSBmcy5yZWFscGF0aFN5bmModGVtcC5ta2RpclN5bmMoeyBwcmVmaXg6ICdhdG9tLWJ1aWxkLXNwZWMtJyB9KSk7XG4gICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFsgZGlyZWN0b3J5IF0pO1xuXG4gICAgYXRvbS5jb25maWcuc2V0KCdidWlsZC5idWlsZE9uU2F2ZScsIGZhbHNlKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnBhbmVsVmlzaWJpbGl0eScsICdUb2dnbGUnKTtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2J1aWxkLnNhdmVPbkJ1aWxkJywgZmFsc2UpO1xuICAgIGF0b20uY29uZmlnLnNldCgnYnVpbGQubm90aWZpY2F0aW9uT25SZWZyZXNoJywgdHJ1ZSk7XG5cbiAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ3NldFRpbWVvdXQnKTtcbiAgICBqYXNtaW5lLnVuc3B5KHdpbmRvdywgJ2NsZWFyVGltZW91dCcpO1xuXG4gICAgcnVucygoKSA9PiB7XG4gICAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudCk7XG4gICAgfSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgIC50aGVuKCgpID0+IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdidWlsZCcpKVxuICAgICAgICAudGhlbigoKSA9PiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShkdW1teVBhY2thZ2VQYXRoKSk7XG4gICAgfSk7XG5cbiAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4gc3BlY0hlbHBlcnMucmVmcmVzaEF3YWl0VGFyZ2V0cygpKTtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBmcy5yZW1vdmVTeW5jKGRpcmVjdG9yeSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY2FsbCBwcmVCdWlsZCcsICgpID0+IHtcbiAgICBsZXQgcGtnO1xuXG4gICAgcnVucygoKSA9PiB7XG4gICAgICBwa2cgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoZHVtbXlQYWNrYWdlTmFtZSkubWFpbk1vZHVsZTtcbiAgICAgIHNweU9uKHBrZy5ob29rcywgJ3ByZUJ1aWxkJyk7XG5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgc3VjY2VkaW5nQ29tbWFuZE5hbWUpO1xuICAgIH0pO1xuXG4gICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgcmV0dXJuIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpO1xuICAgIH0pO1xuXG4gICAgcnVucygoKSA9PiB7XG4gICAgICBleHBlY3QocGtnLmhvb2tzLnByZUJ1aWxkKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdwb3N0QnVpbGQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBjYWxsZWQgd2l0aCBgdHJ1ZWAgYXMgYW4gYXJndW1lbnQgd2hlbiBidWlsZCBzdWNjZWRlZCcsICgpID0+IHtcbiAgICAgIGxldCBwa2c7XG5cbiAgICAgIHJ1bnMoKCkgPT4ge1xuICAgICAgICBwa2cgPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoZHVtbXlQYWNrYWdlTmFtZSkubWFpbk1vZHVsZTtcbiAgICAgICAgc3B5T24ocGtnLmhvb2tzLCAncG9zdEJ1aWxkJyk7XG5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCBzdWNjZWRpbmdDb21tYW5kTmFtZSk7XG4gICAgICB9KTtcblxuICAgICAgd2FpdHNGb3IoKCkgPT4ge1xuICAgICAgICByZXR1cm4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYnVpbGQgLnRpdGxlJykgJiZcbiAgICAgICAgICB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKS5jbGFzc0xpc3QuY29udGFpbnMoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHBrZy5ob29rcy5wb3N0QnVpbGQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGNhbGxlZCB3aXRoIGBmYWxzZWAgYXMgYW4gYXJndW1lbnQgd2hlbiBidWlsZCBmYWlsZWQnLCAoKSA9PiB7XG4gICAgICBsZXQgcGtnO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgcGtnID0gYXRvbS5wYWNrYWdlcy5nZXRBY3RpdmVQYWNrYWdlKGR1bW15UGFja2FnZU5hbWUpLm1haW5Nb2R1bGU7XG4gICAgICAgIHNweU9uKHBrZy5ob29rcywgJ3Bvc3RCdWlsZCcpO1xuXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgZmFpbGluZ0NvbW1hbmROYW1lKTtcbiAgICAgIH0pO1xuXG4gICAgICB3YWl0c0ZvcigoKSA9PiB7XG4gICAgICAgIHJldHVybiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idWlsZCAudGl0bGUnKSAmJlxuICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ1aWxkIC50aXRsZScpLmNsYXNzTGlzdC5jb250YWlucygnZXJyb3InKTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHBrZy5ob29rcy5wb3N0QnVpbGQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
//# sourceURL=/Users/naver/.atom/packages/build/spec/build-hooks-spec.js
