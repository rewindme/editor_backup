

"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

exports.__esModule = true;
exports.getBindingIdentifiers = getBindingIdentifiers;
exports.getOuterBindingIdentifiers = getOuterBindingIdentifiers;

var _index = require("./index");

var t = _interopRequireWildcard(_index);

/**
 * Return a list of binding identifiers associated with the input `node`.
 */

function getBindingIdentifiers(node, /*: Object*/duplicates, /*:: ?: boolean*/outerOnly /*:: ?: boolean*/) /*: Object*/{
  var search = [].concat(node);
  var ids = _Object$create(null);

  while (search.length) {
    var id = search.shift();
    if (!id) continue;

    var keys = t.getBindingIdentifiers.keys[id.type];

    if (t.isIdentifier(id)) {
      if (duplicates) {
        var _ids = ids[id.name] = ids[id.name] || [];
        _ids.push(id);
      } else {
        ids[id.name] = id;
      }
      continue;
    }

    if (t.isExportDeclaration(id)) {
      if (t.isDeclaration(node.declaration)) {
        search.push(node.declaration);
      }
      continue;
    }

    if (outerOnly) {
      if (t.isFunctionDeclaration(id)) {
        search.push(id.id);
        continue;
      }

      if (t.isFunctionExpression(id)) {
        continue;
      }
    }

    if (keys) {
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (id[key]) {
          search = search.concat(id[key]);
        }
      }
    }
  }

  return ids;
}

/**
 * Mapping of types to their identifier keys.
 */

getBindingIdentifiers.keys = {
  DeclareClass: ["id"],
  DeclareFunction: ["id"],
  DeclareModule: ["id"],
  DeclareVariable: ["id"],
  InterfaceDeclaration: ["id"],
  TypeAlias: ["id"],

  CatchClause: ["param"],
  LabeledStatement: ["label"],
  UnaryExpression: ["argument"],
  AssignmentExpression: ["left"],

  ImportSpecifier: ["local"],
  ImportNamespaceSpecifier: ["local"],
  ImportDefaultSpecifier: ["local"],
  ImportDeclaration: ["specifiers"],

  ExportSpecifier: ["exported"],
  ExportNamespaceSpecifier: ["exported"],
  ExportDefaultSpecifier: ["exported"],

  FunctionDeclaration: ["id", "params"],
  FunctionExpression: ["id", "params"],

  ClassDeclaration: ["id"],
  ClassExpression: ["id"],

  RestElement: ["argument"],
  UpdateExpression: ["argument"],

  SpreadProperty: ["argument"],
  ObjectProperty: ["value"],

  AssignmentPattern: ["left"],
  ArrayPattern: ["elements"],
  ObjectPattern: ["properties"],

  VariableDeclaration: ["declarations"],
  VariableDeclarator: ["id"]
};

function getOuterBindingIdentifiers(node, /*: Object*/duplicates /*:: ?: boolean*/) /*: Object*/{
  return getBindingIdentifiers(node, duplicates, true);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFiZWwtdHlwZXMvbGliL3JldHJpZXZlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRS9FLElBQUksdUJBQXVCLEdBQUcsT0FBTyxDQUFDLGdEQUFnRCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRW5HLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxxQkFBcUIsR0FBRyxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLENBQUMsMEJBQTBCLEdBQUcsMEJBQTBCLENBQUM7O0FBRWhFLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFaEMsSUFBSSxDQUFDLEdBQUcsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7OztBQU14QyxTQUFTLHFCQUFxQixDQUFDLElBQUksY0FBZSxVQUFVLG1CQUFvQixTQUFTLGdDQUFpQztBQUN4SCxNQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLE1BQUksR0FBRyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFL0IsU0FBTyxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ3BCLFFBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUN4QixRQUFJLENBQUMsRUFBRSxFQUFFLFNBQVM7O0FBRWxCLFFBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVqRCxRQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxD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ekIsbUJBQWlCLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDM0IsY0FBWSxFQUFFLENBQUMsVUFBVSxDQUFDO0FBQzFCLGVBQWEsRUFBRSxDQUFDLFlBQVksQ0FBQzs7QUFFN0IscUJBQW1CLEVBQUUsQ0FBQyxjQUFjLENBQUM7QUFDckMsb0JBQWtCLEVBQUUsQ0FBQyxJQUFJLENBQUM7Q0FDM0IsQ0FBQzs7QUFFRixTQUFTLDBCQUEwQixDQUFDLElBQUksY0FBZSxVQUFVLGdDQUFpQztBQUNoRyxTQUFPLHFCQUFxQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7Q0FDdEQiLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkLWd1bHAvc3BlYy9maXh0dXJlL25vZGVfbW9kdWxlc19iYWJlbC9iYWJlbC10eXBlcy9saWIvcmV0cmlldmVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX09iamVjdCRjcmVhdGUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGVcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2ludGVyb3AtcmVxdWlyZS13aWxkY2FyZFwiKVtcImRlZmF1bHRcIl07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmdldEJpbmRpbmdJZGVudGlmaWVycyA9IGdldEJpbmRpbmdJZGVudGlmaWVycztcbmV4cG9ydHMuZ2V0T3V0ZXJCaW5kaW5nSWRlbnRpZmllcnMgPSBnZXRPdXRlckJpbmRpbmdJZGVudGlmaWVycztcblxudmFyIF9pbmRleCA9IHJlcXVpcmUoXCIuL2luZGV4XCIpO1xuXG52YXIgdCA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9pbmRleCk7XG5cbi8qKlxuICogUmV0dXJuIGEgbGlzdCBvZiBiaW5kaW5nIGlkZW50aWZpZXJzIGFzc29jaWF0ZWQgd2l0aCB0aGUgaW5wdXQgYG5vZGVgLlxuICovXG5cbmZ1bmN0aW9uIGdldEJpbmRpbmdJZGVudGlmaWVycyhub2RlIC8qOiBPYmplY3QqLywgZHVwbGljYXRlcyAvKjo6ID86IGJvb2xlYW4qLywgb3V0ZXJPbmx5IC8qOjogPzogYm9vbGVhbiovKSAvKjogT2JqZWN0Ki8ge1xuICB2YXIgc2VhcmNoID0gW10uY29uY2F0KG5vZGUpO1xuICB2YXIgaWRzID0gX09iamVjdCRjcmVhdGUobnVsbCk7XG5cbiAgd2hpbGUgKHNlYXJjaC5sZW5ndGgpIHtcbiAgICB2YXIgaWQgPSBzZWFyY2guc2hpZnQoKTtcbiAgICBpZiAoIWlkKSBjb250aW51ZTtcblxuICAgIHZhciBrZXlzID0gdC5nZXRCaW5kaW5nSWRlbnRpZmllcnMua2V5c1tpZC50eXBlXTtcblxuICAgIGlmICh0LmlzSWRlbnRpZmllcihpZCkpIHtcbiAgICAgIGlmIChkdXBsaWNhdGVzKSB7XG4gICAgICAgIHZhciBfaWRzID0gaWRzW2lkLm5hbWVdID0gaWRzW2lkLm5hbWVdIHx8IFtdO1xuICAgICAgICBfaWRzLnB1c2goaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWRzW2lkLm5hbWVdID0gaWQ7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodC5pc0V4cG9ydERlY2xhcmF0aW9uKGlkKSkge1xuICAgICAgaWYgKHQuaXNEZWNsYXJhdGlvbihub2RlLmRlY2xhcmF0aW9uKSkge1xuICAgICAgICBzZWFyY2gucHVzaChub2RlLmRlY2xhcmF0aW9uKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChvdXRlck9ubHkpIHtcbiAgICAgIGlmICh0LmlzRnVuY3Rpb25EZWNsYXJhdGlvbihpZCkpIHtcbiAgICAgICAgc2VhcmNoLnB1c2goaWQuaWQpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHQuaXNGdW5jdGlvbkV4cHJlc3Npb24oaWQpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChrZXlzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICAgIGlmIChpZFtrZXldKSB7XG4gICAgICAgICAgc2VhcmNoID0gc2VhcmNoLmNvbmNhdChpZFtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpZHM7XG59XG5cbi8qKlxuICogTWFwcGluZyBvZiB0eXBlcyB0byB0aGVpciBpZGVudGlmaWVyIGtleXMuXG4gKi9cblxuZ2V0QmluZGluZ0lkZW50aWZpZXJzLmtleXMgPSB7XG4gIERlY2xhcmVDbGFzczogW1wiaWRcIl0sXG4gIERlY2xhcmVGdW5jdGlvbjogW1wiaWRcIl0sXG4gIERlY2xhcmVNb2R1bGU6IFtcImlkXCJdLFxuICBEZWNsYXJlVmFyaWFibGU6IFtcImlkXCJdLFxuICBJbnRlcmZhY2VEZWNsYXJhdGlvbjogW1wiaWRcIl0sXG4gIFR5cGVBbGlhczogW1wiaWRcIl0sXG5cbiAgQ2F0Y2hDbGF1c2U6IFtcInBhcmFtXCJdLFxuICBMYWJlbGVkU3RhdGVtZW50OiBbXCJsYWJlbFwiXSxcbiAgVW5hcnlFeHByZXNzaW9uOiBbXCJhcmd1bWVudFwiXSxcbiAgQXNzaWdubWVudEV4cHJlc3Npb246IFtcImxlZnRcIl0sXG5cbiAgSW1wb3J0U3BlY2lmaWVyOiBbXCJsb2NhbFwiXSxcbiAgSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyOiBbXCJsb2NhbFwiXSxcbiAgSW1wb3J0RGVmYXVsdFNwZWNpZmllcjogW1wibG9jYWxcIl0sXG4gIEltcG9ydERlY2xhcmF0aW9uOiBbXCJzcGVjaWZpZXJzXCJdLFxuXG4gIEV4cG9ydFNwZWNpZmllcjogW1wiZXhwb3J0ZWRcIl0sXG4gIEV4cG9ydE5hbWVzcGFjZVNwZWNpZmllcjogW1wiZXhwb3J0ZWRcIl0sXG4gIEV4cG9ydERlZmF1bHRTcGVjaWZpZXI6IFtcImV4cG9ydGVkXCJdLFxuXG4gIEZ1bmN0aW9uRGVjbGFyYXRpb246IFtcImlkXCIsIFwicGFyYW1zXCJdLFxuICBGdW5jdGlvbkV4cHJlc3Npb246IFtcImlkXCIsIFwicGFyYW1zXCJdLFxuXG4gIENsYXNzRGVjbGFyYXRpb246IFtcImlkXCJdLFxuICBDbGFzc0V4cHJlc3Npb246IFtcImlkXCJdLFxuXG4gIFJlc3RFbGVtZW50OiBbXCJhcmd1bWVudFwiXSxcbiAgVXBkYXRlRXhwcmVzc2lvbjogW1wiYXJndW1lbnRcIl0sXG5cbiAgU3ByZWFkUHJvcGVydHk6IFtcImFyZ3VtZW50XCJdLFxuICBPYmplY3RQcm9wZXJ0eTogW1widmFsdWVcIl0sXG5cbiAgQXNzaWdubWVudFBhdHRlcm46IFtcImxlZnRcIl0sXG4gIEFycmF5UGF0dGVybjogW1wiZWxlbWVudHNcIl0sXG4gIE9iamVjdFBhdHRlcm46IFtcInByb3BlcnRpZXNcIl0sXG5cbiAgVmFyaWFibGVEZWNsYXJhdGlvbjogW1wiZGVjbGFyYXRpb25zXCJdLFxuICBWYXJpYWJsZURlY2xhcmF0b3I6IFtcImlkXCJdXG59O1xuXG5mdW5jdGlvbiBnZXRPdXRlckJpbmRpbmdJZGVudGlmaWVycyhub2RlIC8qOiBPYmplY3QqLywgZHVwbGljYXRlcyAvKjo6ID86IGJvb2xlYW4qLykgLyo6IE9iamVjdCovIHtcbiAgcmV0dXJuIGdldEJpbmRpbmdJZGVudGlmaWVycyhub2RlLCBkdXBsaWNhdGVzLCB0cnVlKTtcbn0iXX0=
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babel-types/lib/retrievers.js