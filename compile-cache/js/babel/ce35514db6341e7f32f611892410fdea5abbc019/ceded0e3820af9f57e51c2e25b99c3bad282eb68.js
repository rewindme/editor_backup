

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

exports.__esModule = true;

var _plugin = require("../plugin");

var _plugin2 = _interopRequireDefault(_plugin);

var _lodashCollectionSortBy = require("lodash/collection/sortBy");

var _lodashCollectionSortBy2 = _interopRequireDefault(_lodashCollectionSortBy);

exports["default"] = new _plugin2["default"]({
  /**
   * [Please add a description.]
   *
   * Priority:
   *
   *  - 0 We want this to be at the **very** bottom
   *  - 1 Default node position
   *  - 2 Priority over normal nodes
   *  - 3 We want this to be at the **very** top
   */

  visitor: {
    Block: {
      exit: function exit(_ref) {
        var node = _ref.node;

        var hasChange = false;
        for (var i = 0; i < node.body.length; i++) {
          var bodyNode = node.body[i];
          if (bodyNode && bodyNode._blockHoist != null) {
            hasChange = true;
            break;
          }
        }
        if (!hasChange) return;

        node.body = _lodashCollectionSortBy2["default"](node.body, function (bodyNode) {
          var priority = bodyNode && bodyNode._blockHoist;
          if (priority == null) priority = 1;
          if (priority === true) priority = 2;

          // Higher priorities should move toward the top.
          return -1 * priority;
        });
      }
    }
  }
});
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFiZWwtY29yZS9saWIvdHJhbnNmb3JtYXRpb24vaW50ZXJuYWwtcGx1Z2lucy9ibG9jay1ob2lzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLFlBQVksQ0FBQzs7QUFFYixJQUFJLHNCQUFzQixHQUFHLE9BQU8sQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVqRyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFMUIsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVuQyxJQUFJLFFBQVEsR0FBRyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFL0MsSUFBSSx1QkFBdUIsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFbEUsSUFBSSx3QkFBd0IsR0FBRyxzQkFBc0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDOztBQUUvRSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Ozs7Ozs7Ozs7OztBQVkzQyxTQUFPLEVBQUU7QUFDUCxTQUFLLEVBQUU7QUFDTCxVQUFJLEVBQUUsU0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ3hCLFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7O0FBRXJCLFlBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN0QixhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDekMsY0FBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixjQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTtBQUM1QyxxQkFBUyxHQUFHLElBQUksQ0FBQztBQUNqQixrQkFBTTtXQUNQO1NBQ0Y7QUFDRCxZQUFJLENBQUMsU0FBUyxFQUFFLE9BQU87O0FBRXZCLFlBQUksQ0FBQyxJQUFJLEdBQUcsd0JBQXdCLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLFFBQVEsRUFBRTtBQUM3RSxjQUFJLFFBQVEsR0FBRyxRQUFRLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQztBQUNoRCxjQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUUsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNuQyxjQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUUsUUFBUSxHQUFHLENBQUMsQ0FBQzs7O0FBR3BDLGlCQUFPLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztTQUN0QixDQUFDLENBQUM7T0FDSjtLQUNGO0dBQ0Y7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvYnVpbGQtZ3VscC9zcGVjL2ZpeHR1cmUvbm9kZV9tb2R1bGVzX2JhYmVsL2JhYmVsLWNvcmUvbGliL3RyYW5zZm9ybWF0aW9uL2ludGVybmFsLXBsdWdpbnMvYmxvY2staG9pc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2ludGVyb3AtcmVxdWlyZS1kZWZhdWx0XCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9wbHVnaW4gPSByZXF1aXJlKFwiLi4vcGx1Z2luXCIpO1xuXG52YXIgX3BsdWdpbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wbHVnaW4pO1xuXG52YXIgX2xvZGFzaENvbGxlY3Rpb25Tb3J0QnkgPSByZXF1aXJlKFwibG9kYXNoL2NvbGxlY3Rpb24vc29ydEJ5XCIpO1xuXG52YXIgX2xvZGFzaENvbGxlY3Rpb25Tb3J0QnkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoQ29sbGVjdGlvblNvcnRCeSk7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gbmV3IF9wbHVnaW4yW1wiZGVmYXVsdFwiXSh7XG4gIC8qKlxuICAgKiBbUGxlYXNlIGFkZCBhIGRlc2NyaXB0aW9uLl1cbiAgICpcbiAgICogUHJpb3JpdHk6XG4gICAqXG4gICAqICAtIDAgV2Ugd2FudCB0aGlzIHRvIGJlIGF0IHRoZSAqKnZlcnkqKiBib3R0b21cbiAgICogIC0gMSBEZWZhdWx0IG5vZGUgcG9zaXRpb25cbiAgICogIC0gMiBQcmlvcml0eSBvdmVyIG5vcm1hbCBub2Rlc1xuICAgKiAgLSAzIFdlIHdhbnQgdGhpcyB0byBiZSBhdCB0aGUgKip2ZXJ5KiogdG9wXG4gICAqL1xuXG4gIHZpc2l0b3I6IHtcbiAgICBCbG9jazoge1xuICAgICAgZXhpdDogZnVuY3Rpb24gZXhpdChfcmVmKSB7XG4gICAgICAgIHZhciBub2RlID0gX3JlZi5ub2RlO1xuXG4gICAgICAgIHZhciBoYXNDaGFuZ2UgPSBmYWxzZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmJvZHkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgYm9keU5vZGUgPSBub2RlLmJvZHlbaV07XG4gICAgICAgICAgaWYgKGJvZHlOb2RlICYmIGJvZHlOb2RlLl9ibG9ja0hvaXN0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGhhc0NoYW5nZSA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoYXNDaGFuZ2UpIHJldHVybjtcblxuICAgICAgICBub2RlLmJvZHkgPSBfbG9kYXNoQ29sbGVjdGlvblNvcnRCeTJbXCJkZWZhdWx0XCJdKG5vZGUuYm9keSwgZnVuY3Rpb24gKGJvZHlOb2RlKSB7XG4gICAgICAgICAgdmFyIHByaW9yaXR5ID0gYm9keU5vZGUgJiYgYm9keU5vZGUuX2Jsb2NrSG9pc3Q7XG4gICAgICAgICAgaWYgKHByaW9yaXR5ID09IG51bGwpIHByaW9yaXR5ID0gMTtcbiAgICAgICAgICBpZiAocHJpb3JpdHkgPT09IHRydWUpIHByaW9yaXR5ID0gMjtcblxuICAgICAgICAgIC8vIEhpZ2hlciBwcmlvcml0aWVzIHNob3VsZCBtb3ZlIHRvd2FyZCB0aGUgdG9wLlxuICAgICAgICAgIHJldHVybiAtMSAqIHByaW9yaXR5O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzW1wiZGVmYXVsdFwiXTsiXX0=
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babel-core/lib/transformation/internal-plugins/block-hoist.js
