'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  panelVisibility: {
    title: 'Panel Visibility',
    description: 'Set when the build panel should be visible.',
    type: 'string',
    'default': 'Toggle',
    'enum': ['Toggle', 'Keep Visible', 'Show on Error', 'Hidden'],
    order: 1
  },
  hidePanelHeading: {
    title: 'Hide panel heading',
    description: 'Set whether to hide the build command and control buttons in the build panel',
    type: 'boolean',
    'default': false,
    order: 2
  },
  buildOnSave: {
    title: 'Automatically build on save',
    description: 'Automatically build your project each time an editor is saved.',
    type: 'boolean',
    'default': false,
    order: 3
  },
  saveOnBuild: {
    title: 'Automatically save on build',
    description: 'Automatically save all edited files when triggering a build.',
    type: 'boolean',
    'default': false,
    order: 4
  },
  matchedErrorFailsBuild: {
    title: 'Any matched error will fail the build',
    description: 'Even if the build has a return code of zero it is marked as "failed" if any error is being matched in the output.',
    type: 'boolean',
    'default': true,
    order: 5
  },
  scrollOnError: {
    title: 'Automatically scroll on build error',
    description: 'Automatically scroll to first matched error when a build failed.',
    type: 'boolean',
    'default': false,
    order: 6
  },
  stealFocus: {
    title: 'Steal Focus',
    description: 'Steal focus when opening build panel.',
    type: 'boolean',
    'default': true,
    order: 7
  },
  overrideThemeColors: {
    title: 'Override Theme Colors',
    description: 'Override theme background- and text color inside the terminal',
    type: 'boolean',
    'default': true,
    order: 8
  },
  selectTriggers: {
    title: 'Selecting new target triggers the build',
    description: 'When selecting a new target (through status-bar, cmd-alt-t, etc), the newly selected target will be triggered.',
    type: 'boolean',
    'default': true,
    order: 9
  },
  notificationOnRefresh: {
    title: 'Show notification when targets are refreshed',
    description: 'When targets are refreshed a notification with information about the number of targets will be displayed.',
    type: 'boolean',
    'default': false,
    order: 10
  },
  beepWhenDone: {
    title: 'Beep when the build completes',
    description: 'Make a "beep" notification sound when the build is complete - in success or failure.',
    type: 'boolean',
    'default': false,
    order: 11
  },
  panelOrientation: {
    title: 'Panel Orientation',
    description: 'Where to attach the build panel',
    type: 'string',
    'default': 'Bottom',
    'enum': ['Bottom', 'Top', 'Left', 'Right'],
    order: 12
  },
  statusBar: {
    title: 'Status Bar',
    description: 'Where to place the status bar. Set to `Disable` to disable status bar display.',
    type: 'string',
    'default': 'Left',
    'enum': ['Left', 'Right', 'Disable'],
    order: 13
  },
  statusBarPriority: {
    title: 'Priority on Status Bar',
    description: 'Lower priority tiles are placed further to the left/right, depends on where you choose to place Status Bar.',
    type: 'number',
    'default': -1000,
    order: 14
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7cUJBRUc7QUFDYixpQkFBZSxFQUFFO0FBQ2YsU0FBSyxFQUFFLGtCQUFrQjtBQUN6QixlQUFXLEVBQUUsNkNBQTZDO0FBQzFELFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxRQUFRO0FBQ2pCLFlBQU0sQ0FBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUU7QUFDN0QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELGtCQUFnQixFQUFFO0FBQ2hCLFNBQUssRUFBRSxvQkFBb0I7QUFDM0IsZUFBVyxFQUFFLDhFQUE4RTtBQUMzRixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxhQUFXLEVBQUU7QUFDWCxTQUFLLEVBQUUsNkJBQTZCO0FBQ3BDLGVBQVcsRUFBRSxnRUFBZ0U7QUFDN0UsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsYUFBVyxFQUFFO0FBQ1gsU0FBSyxFQUFFLDZCQUE2QjtBQUNwQyxlQUFXLEVBQUUsOERBQThEO0FBQzNFLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELHdCQUFzQixFQUFFO0FBQ3RCLFNBQUssRUFBRSx1Q0FBdUM7QUFDOUMsZUFBVyxFQUFFLG1IQUFtSDtBQUNoSSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxlQUFhLEVBQUU7QUFDYixTQUFLLEVBQUUscUNBQXFDO0FBQzVDLGVBQVcsRUFBRSxrRUFBa0U7QUFDL0UsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsWUFBVSxFQUFFO0FBQ1YsU0FBSyxFQUFFLGFBQWE7QUFDcEIsZUFBVyxFQUFFLHVDQUF1QztBQUNwRCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxxQkFBbUIsRUFBRTtBQUNuQixTQUFLLEVBQUUsdUJBQXVCO0FBQzlCLGVBQVcsRUFBRSwrREFBK0Q7QUFDNUUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsZ0JBQWMsRUFBRTtBQUNkLFNBQUssRUFBRSx5Q0FBeUM7QUFDaEQsZUFBVyxFQUFFLGdIQUFnSDtBQUM3SCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCx1QkFBcUIsRUFBRTtBQUNyQixTQUFLLEVBQUUsOENBQThDO0FBQ3JELGVBQVcsRUFBRSwyR0FBMkc7QUFDeEgsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsRUFBRTtHQUNWO0FBQ0QsY0FBWSxFQUFFO0FBQ1osU0FBSyxFQUFFLCtCQUErQjtBQUN0QyxlQUFXLEVBQUUsc0ZBQXNGO0FBQ25HLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLEVBQUU7R0FDVjtBQUNELGtCQUFnQixFQUFFO0FBQ2hCLFNBQUssRUFBRSxtQkFBbUI7QUFDMUIsZUFBVyxFQUFFLGlDQUFpQztBQUM5QyxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsUUFBUTtBQUNqQixZQUFNLENBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFFO0FBQzFDLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCxXQUFTLEVBQUU7QUFDVCxTQUFLLEVBQUUsWUFBWTtBQUNuQixlQUFXLEVBQUUsZ0ZBQWdGO0FBQzdGLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxNQUFNO0FBQ2YsWUFBTSxDQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFFO0FBQ3BDLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCxtQkFBaUIsRUFBRTtBQUNqQixTQUFLLEVBQUUsd0JBQXdCO0FBQy9CLGVBQVcsRUFBRSw2R0FBNkc7QUFDMUgsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLENBQUMsSUFBSTtBQUNkLFNBQUssRUFBRSxFQUFFO0dBQ1Y7Q0FDRiIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHBhbmVsVmlzaWJpbGl0eToge1xuICAgIHRpdGxlOiAnUGFuZWwgVmlzaWJpbGl0eScsXG4gICAgZGVzY3JpcHRpb246ICdTZXQgd2hlbiB0aGUgYnVpbGQgcGFuZWwgc2hvdWxkIGJlIHZpc2libGUuJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnVG9nZ2xlJyxcbiAgICBlbnVtOiBbICdUb2dnbGUnLCAnS2VlcCBWaXNpYmxlJywgJ1Nob3cgb24gRXJyb3InLCAnSGlkZGVuJyBdLFxuICAgIG9yZGVyOiAxXG4gIH0sXG4gIGhpZGVQYW5lbEhlYWRpbmc6IHtcbiAgICB0aXRsZTogJ0hpZGUgcGFuZWwgaGVhZGluZycsXG4gICAgZGVzY3JpcHRpb246ICdTZXQgd2hldGhlciB0byBoaWRlIHRoZSBidWlsZCBjb21tYW5kIGFuZCBjb250cm9sIGJ1dHRvbnMgaW4gdGhlIGJ1aWxkIHBhbmVsJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDJcbiAgfSxcbiAgYnVpbGRPblNhdmU6IHtcbiAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgYnVpbGQgb24gc2F2ZScsXG4gICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWNhbGx5IGJ1aWxkIHlvdXIgcHJvamVjdCBlYWNoIHRpbWUgYW4gZWRpdG9yIGlzIHNhdmVkLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiAzXG4gIH0sXG4gIHNhdmVPbkJ1aWxkOiB7XG4gICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IHNhdmUgb24gYnVpbGQnLFxuICAgIGRlc2NyaXB0aW9uOiAnQXV0b21hdGljYWxseSBzYXZlIGFsbCBlZGl0ZWQgZmlsZXMgd2hlbiB0cmlnZ2VyaW5nIGEgYnVpbGQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDRcbiAgfSxcbiAgbWF0Y2hlZEVycm9yRmFpbHNCdWlsZDoge1xuICAgIHRpdGxlOiAnQW55IG1hdGNoZWQgZXJyb3Igd2lsbCBmYWlsIHRoZSBidWlsZCcsXG4gICAgZGVzY3JpcHRpb246ICdFdmVuIGlmIHRoZSBidWlsZCBoYXMgYSByZXR1cm4gY29kZSBvZiB6ZXJvIGl0IGlzIG1hcmtlZCBhcyBcImZhaWxlZFwiIGlmIGFueSBlcnJvciBpcyBiZWluZyBtYXRjaGVkIGluIHRoZSBvdXRwdXQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogNVxuICB9LFxuICBzY3JvbGxPbkVycm9yOiB7XG4gICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IHNjcm9sbCBvbiBidWlsZCBlcnJvcicsXG4gICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWNhbGx5IHNjcm9sbCB0byBmaXJzdCBtYXRjaGVkIGVycm9yIHdoZW4gYSBidWlsZCBmYWlsZWQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDZcbiAgfSxcbiAgc3RlYWxGb2N1czoge1xuICAgIHRpdGxlOiAnU3RlYWwgRm9jdXMnLFxuICAgIGRlc2NyaXB0aW9uOiAnU3RlYWwgZm9jdXMgd2hlbiBvcGVuaW5nIGJ1aWxkIHBhbmVsLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDdcbiAgfSxcbiAgb3ZlcnJpZGVUaGVtZUNvbG9yczoge1xuICAgIHRpdGxlOiAnT3ZlcnJpZGUgVGhlbWUgQ29sb3JzJyxcbiAgICBkZXNjcmlwdGlvbjogJ092ZXJyaWRlIHRoZW1lIGJhY2tncm91bmQtIGFuZCB0ZXh0IGNvbG9yIGluc2lkZSB0aGUgdGVybWluYWwnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiA4XG4gIH0sXG4gIHNlbGVjdFRyaWdnZXJzOiB7XG4gICAgdGl0bGU6ICdTZWxlY3RpbmcgbmV3IHRhcmdldCB0cmlnZ2VycyB0aGUgYnVpbGQnLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBzZWxlY3RpbmcgYSBuZXcgdGFyZ2V0ICh0aHJvdWdoIHN0YXR1cy1iYXIsIGNtZC1hbHQtdCwgZXRjKSwgdGhlIG5ld2x5IHNlbGVjdGVkIHRhcmdldCB3aWxsIGJlIHRyaWdnZXJlZC4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiA5XG4gIH0sXG4gIG5vdGlmaWNhdGlvbk9uUmVmcmVzaDoge1xuICAgIHRpdGxlOiAnU2hvdyBub3RpZmljYXRpb24gd2hlbiB0YXJnZXRzIGFyZSByZWZyZXNoZWQnLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hlbiB0YXJnZXRzIGFyZSByZWZyZXNoZWQgYSBub3RpZmljYXRpb24gd2l0aCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbnVtYmVyIG9mIHRhcmdldHMgd2lsbCBiZSBkaXNwbGF5ZWQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDEwXG4gIH0sXG4gIGJlZXBXaGVuRG9uZToge1xuICAgIHRpdGxlOiAnQmVlcCB3aGVuIHRoZSBidWlsZCBjb21wbGV0ZXMnLFxuICAgIGRlc2NyaXB0aW9uOiAnTWFrZSBhIFwiYmVlcFwiIG5vdGlmaWNhdGlvbiBzb3VuZCB3aGVuIHRoZSBidWlsZCBpcyBjb21wbGV0ZSAtIGluIHN1Y2Nlc3Mgb3IgZmFpbHVyZS4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogMTFcbiAgfSxcbiAgcGFuZWxPcmllbnRhdGlvbjoge1xuICAgIHRpdGxlOiAnUGFuZWwgT3JpZW50YXRpb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hlcmUgdG8gYXR0YWNoIHRoZSBidWlsZCBwYW5lbCcsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ0JvdHRvbScsXG4gICAgZW51bTogWyAnQm90dG9tJywgJ1RvcCcsICdMZWZ0JywgJ1JpZ2h0JyBdLFxuICAgIG9yZGVyOiAxMlxuICB9LFxuICBzdGF0dXNCYXI6IHtcbiAgICB0aXRsZTogJ1N0YXR1cyBCYXInLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hlcmUgdG8gcGxhY2UgdGhlIHN0YXR1cyBiYXIuIFNldCB0byBgRGlzYWJsZWAgdG8gZGlzYWJsZSBzdGF0dXMgYmFyIGRpc3BsYXkuJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnTGVmdCcsXG4gICAgZW51bTogWyAnTGVmdCcsICdSaWdodCcsICdEaXNhYmxlJyBdLFxuICAgIG9yZGVyOiAxM1xuICB9LFxuICBzdGF0dXNCYXJQcmlvcml0eToge1xuICAgIHRpdGxlOiAnUHJpb3JpdHkgb24gU3RhdHVzIEJhcicsXG4gICAgZGVzY3JpcHRpb246ICdMb3dlciBwcmlvcml0eSB0aWxlcyBhcmUgcGxhY2VkIGZ1cnRoZXIgdG8gdGhlIGxlZnQvcmlnaHQsIGRlcGVuZHMgb24gd2hlcmUgeW91IGNob29zZSB0byBwbGFjZSBTdGF0dXMgQmFyLicsXG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVmYXVsdDogLTEwMDAsXG4gICAgb3JkZXI6IDE0XG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/naver/.atom/packages/build/lib/config.js
