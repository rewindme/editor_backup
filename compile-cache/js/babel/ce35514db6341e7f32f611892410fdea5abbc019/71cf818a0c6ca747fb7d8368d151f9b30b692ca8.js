

"use strict";

var _interopRequireWildcard = require("babel-runtime/helpers/interop-require-wildcard")["default"];

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _index = require("../index");

var t = _interopRequireWildcard(_index);

var _constants = require("../constants");

var _index2 = require("./index");

var _index3 = _interopRequireDefault(_index2);

_index3["default"]("ArrayExpression", {
  fields: {
    elements: {
      validate: _index2.assertValueType("array")
    }
  },
  visitor: ["elements"],
  aliases: ["Expression"]
});

_index3["default"]("AssignmentExpression", {
  fields: {
    operator: {
      validate: _index2.assertValueType("string")
    },
    left: {
      validate: _index2.assertNodeType("LVal")
    },
    right: {
      validate: _index2.assertNodeType("Expression")
    }
  },
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Expression"]
});

_index3["default"]("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: _index2.assertOneOf.apply(undefined, _constants.BINARY_OPERATORS)
    },
    left: {
      validate: _index2.assertNodeType("Expression")
    },
    right: {
      validate: _index2.assertNodeType("Expression")
    }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});

_index3["default"]("Directive", {
  visitor: ["value"],
  fields: {
    value: {
      validate: _index2.assertNodeType("DirectiveLiteral")
    }
  }
});

_index3["default"]("DirectiveLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: _index2.assertValueType("string")
    }
  }
});

_index3["default"]("BlockStatement", {
  builder: ["body", "directives"],
  visitor: ["directives", "body"],
  fields: {
    directives: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("Directive"))),
      "default": []
    },
    body: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("Statement")))
    }
  },
  aliases: ["Scopable", "BlockParent", "Block", "Statement"]
});

_index3["default"]("BreakStatement", {
  visitor: ["label"],
  fields: {
    label: {
      validate: _index2.assertNodeType("Identifier"),
      optional: true
    }
  },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
});

_index3["default"]("CallExpression", {
  visitor: ["callee", "arguments"],
  fields: {
    callee: {
      validate: _index2.assertNodeType("Expression")
    },
    arguments: {
      validate: _index2.assertValueType("array")
    }
  },
  aliases: ["Expression"]
});

_index3["default"]("CatchClause", {
  visitor: ["param", "body"],
  fields: {
    param: {
      validate: _index2.assertNodeType("Identifier")
    },
    body: {
      validate: _index2.assertNodeType("BlockStatement")
    }
  },
  aliases: ["Scopable"]
});

_index3["default"]("ConditionalExpression", {
  visitor: ["test", "consequent", "alternate"],
  fields: {
    test: {
      validate: _index2.assertNodeType("Expression")
    },
    consequent: {
      validate: _index2.assertNodeType("Expression")
    },
    alternate: {
      validate: _index2.assertNodeType("Expression")
    }
  },
  aliases: ["Expression", "Conditional"]
});

_index3["default"]("ContinueStatement", {
  visitor: ["label"],
  fields: {
    label: {
      validate: _index2.assertNodeType("Identifier"),
      optional: true
    }
  },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
});

_index3["default"]("DebuggerStatement", {
  aliases: ["Statement"]
});

_index3["default"]("DoWhileStatement", {
  visitor: ["test", "body"],
  fields: {
    test: {
      validate: _index2.assertNodeType("Expression")
    },
    body: {
      validate: _index2.assertNodeType("BlockStatement")
    }
  },
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"]
});

_index3["default"]("EmptyStatement", {
  aliases: ["Statement"]
});

_index3["default"]("ExpressionStatement", {
  visitor: ["expression"],
  fields: {
    expression: {
      validate: _index2.assertNodeType("Expression")
    }
  },
  aliases: ["Statement", "ExpressionWrapper"]
});

_index3["default"]("File", {
  builder: ["program", "comments", "tokens"],
  visitor: ["program"],
  fields: {
    program: {
      validate: _index2.assertNodeType("Program")
    }
  }
});

_index3["default"]("ForInStatement", {
  visitor: ["left", "right", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
  fields: {
    left: {
      validate: _index2.assertNodeType("VariableDeclaration", "LVal")
    },
    right: {
      validate: _index2.assertNodeType("Expression")
    },
    body: {
      validate: _index2.assertNodeType("Statement")
    }
  }
});

_index3["default"]("ForStatement", {
  visitor: ["init", "test", "update", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop"],
  fields: {
    init: {
      validate: _index2.assertNodeType("VariableDeclaration", "Expression"),
      optional: true
    },
    test: {
      validate: _index2.assertNodeType("Expression"),
      optional: true
    },
    update: {
      validate: _index2.assertNodeType("Expression"),
      optional: true
    },
    body: {
      validate: _index2.assertNodeType("Statement")
    }
  }
});

_index3["default"]("FunctionDeclaration", {
  builder: ["id", "params", "body", "generator", "async"],
  visitor: ["id", "params", "body", "returnType", "typeParameters"],
  fields: {
    id: {
      validate: _index2.assertNodeType("Identifier")
    },
    params: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("LVal")))
    },
    body: {
      validate: _index2.assertNodeType("BlockStatement")
    },
    generator: {
      "default": false,
      validate: _index2.assertValueType("boolean")
    },
    async: {
      "default": false,
      validate: _index2.assertValueType("boolean")
    }
  },
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Statement", "Pureish", "Declaration"]
});

_index3["default"]("FunctionExpression", {
  inherits: "FunctionDeclaration",
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
  fields: {
    id: {
      validate: _index2.assertNodeType("Identifier"),
      optional: true
    },
    params: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("LVal")))
    },
    body: {
      validate: _index2.assertNodeType("BlockStatement")
    },
    generator: {
      "default": false,
      validate: _index2.assertValueType("boolean")
    },
    async: {
      "default": false,
      validate: _index2.assertValueType("boolean")
    }
  }
});

_index3["default"]("Identifier", {
  builder: ["name"],
  visitor: ["typeAnnotation"],
  aliases: ["Expression", "LVal"],
  fields: {
    name: {
      validate: function validate(node, key, val) {
        if (!t.isValidIdentifier(val)) {
          // todo
        }
      }
    }
  }
});

_index3["default"]("IfStatement", {
  visitor: ["test", "consequent", "alternate"],
  aliases: ["Statement", "Conditional"],
  fields: {
    test: {
      validate: _index2.assertNodeType("Expression")
    },
    consequent: {
      validate: _index2.assertNodeType("Statement")
    },
    alternate: {
      optional: true,
      validate: _index2.assertNodeType("Statement")
    }
  }
});

_index3["default"]("LabeledStatement", {
  visitor: ["label", "body"],
  aliases: ["Statement"],
  fields: {
    label: {
      validate: _index2.assertNodeType("Identifier")
    },
    body: {
      validate: _index2.assertNodeType("Statement")
    }
  }
});

_index3["default"]("StringLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: _index2.assertValueType("string")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});

_index3["default"]("NumericLiteral", {
  builder: ["value"],
  deprecatedAlias: "NumberLiteral",
  fields: {
    value: {
      validate: _index2.assertValueType("number")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});

_index3["default"]("NullLiteral", {
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});

_index3["default"]("BooleanLiteral", {
  builder: ["value"],
  fields: {
    value: {
      validate: _index2.assertValueType("boolean")
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});

_index3["default"]("RegExpLiteral", {
  builder: ["pattern", "flags"],
  deprecatedAlias: "RegexLiteral",
  aliases: ["Expression", "Literal"],
  fields: {
    pattern: {
      validate: _index2.assertValueType("string")
    },
    flags: {
      validate: _index2.assertValueType("string"),
      "default": ""
    }
  }
});

_index3["default"]("LogicalExpression", {
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"],
  fields: {
    operator: {
      validate: _index2.assertOneOf.apply(undefined, _constants.LOGICAL_OPERATORS)
    },
    left: {
      validate: _index2.assertNodeType("Expression")
    },
    right: {
      validate: _index2.assertNodeType("Expression")
    }
  }
});

_index3["default"]("MemberExpression", {
  builder: ["object", "property", "computed"],
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: {
    object: {
      validate: _index2.assertNodeType("Expression")
    },
    property: {
      validate: function validate(node, key, val) {
        var expectedType = node.computed ? "Expression" : "Identifier";
        _index2.assertNodeType(expectedType)(node, key, val);
      }
    },
    computed: {
      "default": false
    }
  }
});

_index3["default"]("NewExpression", {
  visitor: ["callee", "arguments"],
  aliases: ["Expression"],
  fields: {
    callee: {
      validate: _index2.assertNodeType("Expression")
    },
    arguments: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("Expression")))
    }
  }
});

_index3["default"]("Program", {
  visitor: ["directives", "body"],
  builder: ["body", "directives"],
  fields: {
    directives: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("Directive"))),
      "default": []
    },
    body: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("Statement")))
    }
  },
  aliases: ["Scopable", "BlockParent", "Block", "FunctionParent"]
});

_index3["default"]("ObjectExpression", {
  visitor: ["properties"],
  aliases: ["Expression"],
  fields: {
    properties: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("ObjectMethod", "ObjectProperty", "SpreadProperty")))
    }
  }
});

_index3["default"]("ObjectMethod", {
  builder: ["kind", "key", "params", "body", "computed"],
  fields: {
    kind: {
      validate: _index2.chain(_index2.assertValueType("string"), _index2.assertOneOf("method", "get", "set")),
      "default": "method"
    },
    computed: {
      validate: _index2.assertValueType("boolean"),
      "default": false
    },
    key: {
      validate: function validate(node, key, val) {
        var expectedTypes = node.computed ? ["Expression"] : ["Identifier", "Literal"];
        _index2.assertNodeType.apply(undefined, expectedTypes)(node, key, val);
      }
    },
    decorators: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("Decorator")))
    },
    body: {
      validate: _index2.assertNodeType("BlockStatement")
    },
    generator: {
      "default": false,
      validate: _index2.assertValueType("boolean")
    },
    async: {
      "default": false,
      validate: _index2.assertValueType("boolean")
    }
  },
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  aliases: ["UserWhitespacable", "Function", "Scopable", "BlockParent", "FunctionParent", "Method"]
});

_index3["default"]("ObjectProperty", {
  builder: ["key", "value", "computed", "shorthand", "decorators"],
  fields: {
    computed: {
      validate: _index2.assertValueType("boolean"),
      "default": false
    },
    key: {
      validate: function validate(node, key, val) {
        var expectedTypes = node.computed ? ["Expression"] : ["Identifier", "Literal"];
        _index2.assertNodeType.apply(undefined, expectedTypes)(node, key, val);
      }
    },
    value: {
      validate: _index2.assertNodeType("Expression")
    },
    shorthand: {
      validate: _index2.assertValueType("boolean"),
      "default": false
    },
    decorators: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("Decorator"))),
      optional: true
    }
  },
  visitor: ["key", "value", "decorators"],
  aliases: ["UserWhitespacable", "Property"]
});

_index3["default"]("RestElement", {
  visitor: ["argument", "typeAnnotation"],
  aliases: ["LVal"],
  fields: {
    argument: {
      validate: _index2.assertNodeType("LVal")
    }
  }
});

_index3["default"]("ReturnStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: {
    argument: {
      validate: _index2.assertNodeType("Expression"),
      optional: true
    }
  }
});

_index3["default"]("SequenceExpression", {
  visitor: ["expressions"],
  fields: {
    expressions: { validate: _index2.assertValueType("array") }
  },
  aliases: ["Expression"]
});

_index3["default"]("SwitchCase", {
  visitor: ["test", "consequent"],
  fields: {
    test: {
      validate: _index2.assertNodeType("Expression"),
      optional: true
    },
    consequent: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("Statement")))
    }
  }
});

_index3["default"]("SwitchStatement", {
  visitor: ["discriminant", "cases"],
  aliases: ["Statement", "BlockParent", "Scopable"],
  fields: {
    discriminant: {
      validate: _index2.assertNodeType("Expression")
    },
    cases: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("SwitchCase")))
    }
  }
});

_index3["default"]("ThisExpression", {
  aliases: ["Expression"]
});

_index3["default"]("ThrowStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: {
    argument: {
      validate: _index2.assertNodeType("Expression")
    }
  }
});

// todo: at least handler or finalizer should be set to be valid
_index3["default"]("TryStatement", {
  visitor: ["block", "handler", "finalizer"],
  aliases: ["Statement"],
  fields: {
    body: {
      validate: _index2.assertNodeType("BlockStatement")
    },
    handler: {
      optional: true,
      handler: _index2.assertNodeType("BlockStatement")
    },
    finalizer: {
      optional: true,
      validate: _index2.assertNodeType("BlockStatement")
    }
  }
});

_index3["default"]("UnaryExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: {
      "default": false
    },
    argument: {
      validate: _index2.assertNodeType("Expression")
    },
    operator: {
      validate: _index2.assertOneOf.apply(undefined, _constants.UNARY_OPERATORS)
    }
  },
  visitor: ["argument"],
  aliases: ["UnaryLike", "Expression"]
});

_index3["default"]("UpdateExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: {
      "default": false
    },
    argument: {
      validate: _index2.assertNodeType("Expression")
    },
    operator: {
      validate: _index2.assertOneOf.apply(undefined, _constants.UPDATE_OPERATORS)
    }
  },
  visitor: ["argument"],
  aliases: ["Expression"]
});

_index3["default"]("VariableDeclaration", {
  builder: ["kind", "declarations"],
  visitor: ["declarations"],
  aliases: ["Statement", "Declaration"],
  fields: {
    kind: {
      validate: _index2.chain(_index2.assertValueType("string"), _index2.assertOneOf("var", "let", "const"))
    },
    declarations: {
      validate: _index2.chain(_index2.assertValueType("array"), _index2.assertEach(_index2.assertNodeType("VariableDeclarator")))
    }
  }
});

_index3["default"]("VariableDeclarator", {
  visitor: ["id", "init"],
  fields: {
    id: {
      validate: _index2.assertNodeType("LVal")
    },
    init: {
      optional: true,
      validate: _index2.assertNodeType("Expression")
    }
  }
});

_index3["default"]("WhileStatement", {
  visitor: ["test", "body"],
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"],
  fields: {
    test: {
      validate: _index2.assertNodeType("Expression")
    },
    body: {
      validate: _index2.assertNodeType("BlockStatement", "Statement")
    }
  }
});

_index3["default"]("WithStatement", {
  visitor: ["object", "body"],
  aliases: ["Statement"],
  fields: {
    object: {
      object: _index2.assertNodeType("Expression")
    },
    body: {
      validate: _index2.assertNodeType("BlockStatement")
    }
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFiZWwtdHlwZXMvbGliL2RlZmluaXRpb25zL2NvcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxZQUFZLENBQUM7O0FBRWIsSUFBSSx1QkFBdUIsR0FBRyxPQUFPLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFbkcsSUFBSSxzQkFBc0IsR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFakcsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVqQyxJQUFJLENBQUMsR0FBRyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEMsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUV6QyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWpDLElBQUksT0FBTyxHQUFHLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUU5QyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsaUJBQWlCLEVBQUU7QUFDcEMsUUFBTSxFQUFFO0FBQ04sWUFBUSxFQUFFO0FBQ1IsY0FBUSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO0tBQzNDO0dBQ0Y7QUFDRCxTQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7QUFDckIsU0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO0NBQ3hCLENBQUMsQ0FBQzs7QUFFSCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsc0JBQXNCLEVBQUU7QUFDekMsUUFBTSxFQUFFO0FBQ04sWUFBUSxFQUFFO0FBQ1IsY0FBUSxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO0tBQzVDO0FBQ0QsUUFBSSxFQUFFO0FBQ0osY0FB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QU0sRUFBRTtBQUNOLFVBQU0sRUFBRTtBQUNOLFlBQU0sRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQztLQUM3QztBQUNELFFBQUksRUFBRTtBQUNKLGNBQVEsRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDO0tBQ25EO0dBQ0Y7Q0FDRixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkLWd1bHAvc3BlYy9maXh0dXJlL25vZGVfbW9kdWxlc19iYWJlbC9iYWJlbC10eXBlcy9saWIvZGVmaW5pdGlvbnMvY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9oZWxwZXJzL2ludGVyb3AtcmVxdWlyZS13aWxkY2FyZFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbnRlcm9wLXJlcXVpcmUtZGVmYXVsdFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfaW5kZXggPSByZXF1aXJlKFwiLi4vaW5kZXhcIik7XG5cbnZhciB0ID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQoX2luZGV4KTtcblxudmFyIF9jb25zdGFudHMgPSByZXF1aXJlKFwiLi4vY29uc3RhbnRzXCIpO1xuXG52YXIgX2luZGV4MiA9IHJlcXVpcmUoXCIuL2luZGV4XCIpO1xuXG52YXIgX2luZGV4MyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2luZGV4Mik7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiQXJyYXlFeHByZXNzaW9uXCIsIHtcbiAgZmllbGRzOiB7XG4gICAgZWxlbWVudHM6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydFZhbHVlVHlwZShcImFycmF5XCIpXG4gICAgfVxuICB9LFxuICB2aXNpdG9yOiBbXCJlbGVtZW50c1wiXSxcbiAgYWxpYXNlczogW1wiRXhwcmVzc2lvblwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiQXNzaWdubWVudEV4cHJlc3Npb25cIiwge1xuICBmaWVsZHM6IHtcbiAgICBvcGVyYXRvcjoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwic3RyaW5nXCIpXG4gICAgfSxcbiAgICBsZWZ0OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkxWYWxcIilcbiAgICB9LFxuICAgIHJpZ2h0OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkV4cHJlc3Npb25cIilcbiAgICB9XG4gIH0sXG4gIGJ1aWxkZXI6IFtcIm9wZXJhdG9yXCIsIFwibGVmdFwiLCBcInJpZ2h0XCJdLFxuICB2aXNpdG9yOiBbXCJsZWZ0XCIsIFwicmlnaHRcIl0sXG4gIGFsaWFzZXM6IFtcIkV4cHJlc3Npb25cIl1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIkJpbmFyeUV4cHJlc3Npb25cIiwge1xuICBidWlsZGVyOiBbXCJvcGVyYXRvclwiLCBcImxlZnRcIiwgXCJyaWdodFwiXSxcbiAgZmllbGRzOiB7XG4gICAgb3BlcmF0b3I6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE9uZU9mLmFwcGx5KHVuZGVmaW5lZCwgX2NvbnN0YW50cy5CSU5BUllfT1BFUkFUT1JTKVxuICAgIH0sXG4gICAgbGVmdDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpXG4gICAgfSxcbiAgICByaWdodDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpXG4gICAgfVxuICB9LFxuICB2aXNpdG9yOiBbXCJsZWZ0XCIsIFwicmlnaHRcIl0sXG4gIGFsaWFzZXM6IFtcIkJpbmFyeVwiLCBcIkV4cHJlc3Npb25cIl1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIkRpcmVjdGl2ZVwiLCB7XG4gIHZpc2l0b3I6IFtcInZhbHVlXCJdLFxuICBmaWVsZHM6IHtcbiAgICB2YWx1ZToge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJEaXJlY3RpdmVMaXRlcmFsXCIpXG4gICAgfVxuICB9XG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJEaXJlY3RpdmVMaXRlcmFsXCIsIHtcbiAgYnVpbGRlcjogW1widmFsdWVcIl0sXG4gIGZpZWxkczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJzdHJpbmdcIilcbiAgICB9XG4gIH1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIkJsb2NrU3RhdGVtZW50XCIsIHtcbiAgYnVpbGRlcjogW1wiYm9keVwiLCBcImRpcmVjdGl2ZXNcIl0sXG4gIHZpc2l0b3I6IFtcImRpcmVjdGl2ZXNcIiwgXCJib2R5XCJdLFxuICBmaWVsZHM6IHtcbiAgICBkaXJlY3RpdmVzOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5jaGFpbihfaW5kZXgyLmFzc2VydFZhbHVlVHlwZShcImFycmF5XCIpLCBfaW5kZXgyLmFzc2VydEVhY2goX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkRpcmVjdGl2ZVwiKSkpLFxuICAgICAgXCJkZWZhdWx0XCI6IFtdXG4gICAgfSxcbiAgICBib2R5OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5jaGFpbihfaW5kZXgyLmFzc2VydFZhbHVlVHlwZShcImFycmF5XCIpLCBfaW5kZXgyLmFzc2VydEVhY2goX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIlN0YXRlbWVudFwiKSkpXG4gICAgfVxuICB9LFxuICBhbGlhc2VzOiBbXCJTY29wYWJsZVwiLCBcIkJsb2NrUGFyZW50XCIsIFwiQmxvY2tcIiwgXCJTdGF0ZW1lbnRcIl1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIkJyZWFrU3RhdGVtZW50XCIsIHtcbiAgdmlzaXRvcjogW1wibGFiZWxcIl0sXG4gIGZpZWxkczoge1xuICAgIGxhYmVsOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIklkZW50aWZpZXJcIiksXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgYWxpYXNlczogW1wiU3RhdGVtZW50XCIsIFwiVGVybWluYXRvcmxlc3NcIiwgXCJDb21wbGV0aW9uU3RhdGVtZW50XCJdXG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJDYWxsRXhwcmVzc2lvblwiLCB7XG4gIHZpc2l0b3I6IFtcImNhbGxlZVwiLCBcImFyZ3VtZW50c1wiXSxcbiAgZmllbGRzOiB7XG4gICAgY2FsbGVlOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkV4cHJlc3Npb25cIilcbiAgICB9LFxuICAgIGFyZ3VtZW50czoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwiYXJyYXlcIilcbiAgICB9XG4gIH0sXG4gIGFsaWFzZXM6IFtcIkV4cHJlc3Npb25cIl1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIkNhdGNoQ2xhdXNlXCIsIHtcbiAgdmlzaXRvcjogW1wicGFyYW1cIiwgXCJib2R5XCJdLFxuICBmaWVsZHM6IHtcbiAgICBwYXJhbToge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJJZGVudGlmaWVyXCIpXG4gICAgfSxcbiAgICBib2R5OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkJsb2NrU3RhdGVtZW50XCIpXG4gICAgfVxuICB9LFxuICBhbGlhc2VzOiBbXCJTY29wYWJsZVwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiQ29uZGl0aW9uYWxFeHByZXNzaW9uXCIsIHtcbiAgdmlzaXRvcjogW1widGVzdFwiLCBcImNvbnNlcXVlbnRcIiwgXCJhbHRlcm5hdGVcIl0sXG4gIGZpZWxkczoge1xuICAgIHRlc3Q6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRXhwcmVzc2lvblwiKVxuICAgIH0sXG4gICAgY29uc2VxdWVudDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpXG4gICAgfSxcbiAgICBhbHRlcm5hdGU6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRXhwcmVzc2lvblwiKVxuICAgIH1cbiAgfSxcbiAgYWxpYXNlczogW1wiRXhwcmVzc2lvblwiLCBcIkNvbmRpdGlvbmFsXCJdXG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJDb250aW51ZVN0YXRlbWVudFwiLCB7XG4gIHZpc2l0b3I6IFtcImxhYmVsXCJdLFxuICBmaWVsZHM6IHtcbiAgICBsYWJlbDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJJZGVudGlmaWVyXCIpLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9XG4gIH0sXG4gIGFsaWFzZXM6IFtcIlN0YXRlbWVudFwiLCBcIlRlcm1pbmF0b3JsZXNzXCIsIFwiQ29tcGxldGlvblN0YXRlbWVudFwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiRGVidWdnZXJTdGF0ZW1lbnRcIiwge1xuICBhbGlhc2VzOiBbXCJTdGF0ZW1lbnRcIl1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIkRvV2hpbGVTdGF0ZW1lbnRcIiwge1xuICB2aXNpdG9yOiBbXCJ0ZXN0XCIsIFwiYm9keVwiXSxcbiAgZmllbGRzOiB7XG4gICAgdGVzdDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpXG4gICAgfSxcbiAgICBib2R5OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkJsb2NrU3RhdGVtZW50XCIpXG4gICAgfVxuICB9LFxuICBhbGlhc2VzOiBbXCJTdGF0ZW1lbnRcIiwgXCJCbG9ja1BhcmVudFwiLCBcIkxvb3BcIiwgXCJXaGlsZVwiLCBcIlNjb3BhYmxlXCJdXG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJFbXB0eVN0YXRlbWVudFwiLCB7XG4gIGFsaWFzZXM6IFtcIlN0YXRlbWVudFwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiRXhwcmVzc2lvblN0YXRlbWVudFwiLCB7XG4gIHZpc2l0b3I6IFtcImV4cHJlc3Npb25cIl0sXG4gIGZpZWxkczoge1xuICAgIGV4cHJlc3Npb246IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRXhwcmVzc2lvblwiKVxuICAgIH1cbiAgfSxcbiAgYWxpYXNlczogW1wiU3RhdGVtZW50XCIsIFwiRXhwcmVzc2lvbldyYXBwZXJcIl1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIkZpbGVcIiwge1xuICBidWlsZGVyOiBbXCJwcm9ncmFtXCIsIFwiY29tbWVudHNcIiwgXCJ0b2tlbnNcIl0sXG4gIHZpc2l0b3I6IFtcInByb2dyYW1cIl0sXG4gIGZpZWxkczoge1xuICAgIHByb2dyYW06IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiUHJvZ3JhbVwiKVxuICAgIH1cbiAgfVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiRm9ySW5TdGF0ZW1lbnRcIiwge1xuICB2aXNpdG9yOiBbXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJib2R5XCJdLFxuICBhbGlhc2VzOiBbXCJTY29wYWJsZVwiLCBcIlN0YXRlbWVudFwiLCBcIkZvclwiLCBcIkJsb2NrUGFyZW50XCIsIFwiTG9vcFwiLCBcIkZvclhTdGF0ZW1lbnRcIl0sXG4gIGZpZWxkczoge1xuICAgIGxlZnQ6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiVmFyaWFibGVEZWNsYXJhdGlvblwiLCBcIkxWYWxcIilcbiAgICB9LFxuICAgIHJpZ2h0OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkV4cHJlc3Npb25cIilcbiAgICB9LFxuICAgIGJvZHk6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiU3RhdGVtZW50XCIpXG4gICAgfVxuICB9XG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJGb3JTdGF0ZW1lbnRcIiwge1xuICB2aXNpdG9yOiBbXCJpbml0XCIsIFwidGVzdFwiLCBcInVwZGF0ZVwiLCBcImJvZHlcIl0sXG4gIGFsaWFzZXM6IFtcIlNjb3BhYmxlXCIsIFwiU3RhdGVtZW50XCIsIFwiRm9yXCIsIFwiQmxvY2tQYXJlbnRcIiwgXCJMb29wXCJdLFxuICBmaWVsZHM6IHtcbiAgICBpbml0OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIlZhcmlhYmxlRGVjbGFyYXRpb25cIiwgXCJFeHByZXNzaW9uXCIpLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgICB9LFxuICAgIHRlc3Q6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRXhwcmVzc2lvblwiKSxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfSxcbiAgICB1cGRhdGU6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRXhwcmVzc2lvblwiKSxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gICAgfSxcbiAgICBib2R5OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIlN0YXRlbWVudFwiKVxuICAgIH1cbiAgfVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiRnVuY3Rpb25EZWNsYXJhdGlvblwiLCB7XG4gIGJ1aWxkZXI6IFtcImlkXCIsIFwicGFyYW1zXCIsIFwiYm9keVwiLCBcImdlbmVyYXRvclwiLCBcImFzeW5jXCJdLFxuICB2aXNpdG9yOiBbXCJpZFwiLCBcInBhcmFtc1wiLCBcImJvZHlcIiwgXCJyZXR1cm5UeXBlXCIsIFwidHlwZVBhcmFtZXRlcnNcIl0sXG4gIGZpZWxkczoge1xuICAgIGlkOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIklkZW50aWZpZXJcIilcbiAgICB9LFxuICAgIHBhcmFtczoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuY2hhaW4oX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJhcnJheVwiKSwgX2luZGV4Mi5hc3NlcnRFYWNoKF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJMVmFsXCIpKSlcbiAgICB9LFxuICAgIGJvZHk6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiQmxvY2tTdGF0ZW1lbnRcIilcbiAgICB9LFxuICAgIGdlbmVyYXRvcjoge1xuICAgICAgXCJkZWZhdWx0XCI6IGZhbHNlLFxuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwiYm9vbGVhblwiKVxuICAgIH0sXG4gICAgYXN5bmM6IHtcbiAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZSxcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydFZhbHVlVHlwZShcImJvb2xlYW5cIilcbiAgICB9XG4gIH0sXG4gIGFsaWFzZXM6IFtcIlNjb3BhYmxlXCIsIFwiRnVuY3Rpb25cIiwgXCJCbG9ja1BhcmVudFwiLCBcIkZ1bmN0aW9uUGFyZW50XCIsIFwiU3RhdGVtZW50XCIsIFwiUHVyZWlzaFwiLCBcIkRlY2xhcmF0aW9uXCJdXG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJGdW5jdGlvbkV4cHJlc3Npb25cIiwge1xuICBpbmhlcml0czogXCJGdW5jdGlvbkRlY2xhcmF0aW9uXCIsXG4gIGFsaWFzZXM6IFtcIlNjb3BhYmxlXCIsIFwiRnVuY3Rpb25cIiwgXCJCbG9ja1BhcmVudFwiLCBcIkZ1bmN0aW9uUGFyZW50XCIsIFwiRXhwcmVzc2lvblwiLCBcIlB1cmVpc2hcIl0sXG4gIGZpZWxkczoge1xuICAgIGlkOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIklkZW50aWZpZXJcIiksXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH0sXG4gICAgcGFyYW1zOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5jaGFpbihfaW5kZXgyLmFzc2VydFZhbHVlVHlwZShcImFycmF5XCIpLCBfaW5kZXgyLmFzc2VydEVhY2goX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkxWYWxcIikpKVxuICAgIH0sXG4gICAgYm9keToge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJCbG9ja1N0YXRlbWVudFwiKVxuICAgIH0sXG4gICAgZ2VuZXJhdG9yOiB7XG4gICAgICBcImRlZmF1bHRcIjogZmFsc2UsXG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJib29sZWFuXCIpXG4gICAgfSxcbiAgICBhc3luYzoge1xuICAgICAgXCJkZWZhdWx0XCI6IGZhbHNlLFxuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwiYm9vbGVhblwiKVxuICAgIH1cbiAgfVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiSWRlbnRpZmllclwiLCB7XG4gIGJ1aWxkZXI6IFtcIm5hbWVcIl0sXG4gIHZpc2l0b3I6IFtcInR5cGVBbm5vdGF0aW9uXCJdLFxuICBhbGlhc2VzOiBbXCJFeHByZXNzaW9uXCIsIFwiTFZhbFwiXSxcbiAgZmllbGRzOiB7XG4gICAgbmFtZToge1xuICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uIHZhbGlkYXRlKG5vZGUsIGtleSwgdmFsKSB7XG4gICAgICAgIGlmICghdC5pc1ZhbGlkSWRlbnRpZmllcih2YWwpKSB7XG4gICAgICAgICAgLy8gdG9kb1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJJZlN0YXRlbWVudFwiLCB7XG4gIHZpc2l0b3I6IFtcInRlc3RcIiwgXCJjb25zZXF1ZW50XCIsIFwiYWx0ZXJuYXRlXCJdLFxuICBhbGlhc2VzOiBbXCJTdGF0ZW1lbnRcIiwgXCJDb25kaXRpb25hbFwiXSxcbiAgZmllbGRzOiB7XG4gICAgdGVzdDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpXG4gICAgfSxcbiAgICBjb25zZXF1ZW50OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIlN0YXRlbWVudFwiKVxuICAgIH0sXG4gICAgYWx0ZXJuYXRlOiB7XG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiU3RhdGVtZW50XCIpXG4gICAgfVxuICB9XG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJMYWJlbGVkU3RhdGVtZW50XCIsIHtcbiAgdmlzaXRvcjogW1wibGFiZWxcIiwgXCJib2R5XCJdLFxuICBhbGlhc2VzOiBbXCJTdGF0ZW1lbnRcIl0sXG4gIGZpZWxkczoge1xuICAgIGxhYmVsOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIklkZW50aWZpZXJcIilcbiAgICB9LFxuICAgIGJvZHk6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiU3RhdGVtZW50XCIpXG4gICAgfVxuICB9XG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJTdHJpbmdMaXRlcmFsXCIsIHtcbiAgYnVpbGRlcjogW1widmFsdWVcIl0sXG4gIGZpZWxkczoge1xuICAgIHZhbHVlOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJzdHJpbmdcIilcbiAgICB9XG4gIH0sXG4gIGFsaWFzZXM6IFtcIkV4cHJlc3Npb25cIiwgXCJQdXJlaXNoXCIsIFwiTGl0ZXJhbFwiLCBcIkltbXV0YWJsZVwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiTnVtZXJpY0xpdGVyYWxcIiwge1xuICBidWlsZGVyOiBbXCJ2YWx1ZVwiXSxcbiAgZGVwcmVjYXRlZEFsaWFzOiBcIk51bWJlckxpdGVyYWxcIixcbiAgZmllbGRzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydFZhbHVlVHlwZShcIm51bWJlclwiKVxuICAgIH1cbiAgfSxcbiAgYWxpYXNlczogW1wiRXhwcmVzc2lvblwiLCBcIlB1cmVpc2hcIiwgXCJMaXRlcmFsXCIsIFwiSW1tdXRhYmxlXCJdXG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJOdWxsTGl0ZXJhbFwiLCB7XG4gIGFsaWFzZXM6IFtcIkV4cHJlc3Npb25cIiwgXCJQdXJlaXNoXCIsIFwiTGl0ZXJhbFwiLCBcIkltbXV0YWJsZVwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiQm9vbGVhbkxpdGVyYWxcIiwge1xuICBidWlsZGVyOiBbXCJ2YWx1ZVwiXSxcbiAgZmllbGRzOiB7XG4gICAgdmFsdWU6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydFZhbHVlVHlwZShcImJvb2xlYW5cIilcbiAgICB9XG4gIH0sXG4gIGFsaWFzZXM6IFtcIkV4cHJlc3Npb25cIiwgXCJQdXJlaXNoXCIsIFwiTGl0ZXJhbFwiLCBcIkltbXV0YWJsZVwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiUmVnRXhwTGl0ZXJhbFwiLCB7XG4gIGJ1aWxkZXI6IFtcInBhdHRlcm5cIiwgXCJmbGFnc1wiXSxcbiAgZGVwcmVjYXRlZEFsaWFzOiBcIlJlZ2V4TGl0ZXJhbFwiLFxuICBhbGlhc2VzOiBbXCJFeHByZXNzaW9uXCIsIFwiTGl0ZXJhbFwiXSxcbiAgZmllbGRzOiB7XG4gICAgcGF0dGVybjoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwic3RyaW5nXCIpXG4gICAgfSxcbiAgICBmbGFnczoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwic3RyaW5nXCIpLFxuICAgICAgXCJkZWZhdWx0XCI6IFwiXCJcbiAgICB9XG4gIH1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIkxvZ2ljYWxFeHByZXNzaW9uXCIsIHtcbiAgYnVpbGRlcjogW1wib3BlcmF0b3JcIiwgXCJsZWZ0XCIsIFwicmlnaHRcIl0sXG4gIHZpc2l0b3I6IFtcImxlZnRcIiwgXCJyaWdodFwiXSxcbiAgYWxpYXNlczogW1wiQmluYXJ5XCIsIFwiRXhwcmVzc2lvblwiXSxcbiAgZmllbGRzOiB7XG4gICAgb3BlcmF0b3I6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE9uZU9mLmFwcGx5KHVuZGVmaW5lZCwgX2NvbnN0YW50cy5MT0dJQ0FMX09QRVJBVE9SUylcbiAgICB9LFxuICAgIGxlZnQ6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRXhwcmVzc2lvblwiKVxuICAgIH0sXG4gICAgcmlnaHQ6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRXhwcmVzc2lvblwiKVxuICAgIH1cbiAgfVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiTWVtYmVyRXhwcmVzc2lvblwiLCB7XG4gIGJ1aWxkZXI6IFtcIm9iamVjdFwiLCBcInByb3BlcnR5XCIsIFwiY29tcHV0ZWRcIl0sXG4gIHZpc2l0b3I6IFtcIm9iamVjdFwiLCBcInByb3BlcnR5XCJdLFxuICBhbGlhc2VzOiBbXCJFeHByZXNzaW9uXCIsIFwiTFZhbFwiXSxcbiAgZmllbGRzOiB7XG4gICAgb2JqZWN0OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkV4cHJlc3Npb25cIilcbiAgICB9LFxuICAgIHByb3BlcnR5OiB7XG4gICAgICB2YWxpZGF0ZTogZnVuY3Rpb24gdmFsaWRhdGUobm9kZSwga2V5LCB2YWwpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkVHlwZSA9IG5vZGUuY29tcHV0ZWQgPyBcIkV4cHJlc3Npb25cIiA6IFwiSWRlbnRpZmllclwiO1xuICAgICAgICBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKGV4cGVjdGVkVHlwZSkobm9kZSwga2V5LCB2YWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgY29tcHV0ZWQ6IHtcbiAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZVxuICAgIH1cbiAgfVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiTmV3RXhwcmVzc2lvblwiLCB7XG4gIHZpc2l0b3I6IFtcImNhbGxlZVwiLCBcImFyZ3VtZW50c1wiXSxcbiAgYWxpYXNlczogW1wiRXhwcmVzc2lvblwiXSxcbiAgZmllbGRzOiB7XG4gICAgY2FsbGVlOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkV4cHJlc3Npb25cIilcbiAgICB9LFxuICAgIGFyZ3VtZW50czoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuY2hhaW4oX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJhcnJheVwiKSwgX2luZGV4Mi5hc3NlcnRFYWNoKF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpKSlcbiAgICB9XG4gIH1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIlByb2dyYW1cIiwge1xuICB2aXNpdG9yOiBbXCJkaXJlY3RpdmVzXCIsIFwiYm9keVwiXSxcbiAgYnVpbGRlcjogW1wiYm9keVwiLCBcImRpcmVjdGl2ZXNcIl0sXG4gIGZpZWxkczoge1xuICAgIGRpcmVjdGl2ZXM6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmNoYWluKF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwiYXJyYXlcIiksIF9pbmRleDIuYXNzZXJ0RWFjaChfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRGlyZWN0aXZlXCIpKSksXG4gICAgICBcImRlZmF1bHRcIjogW11cbiAgICB9LFxuICAgIGJvZHk6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmNoYWluKF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwiYXJyYXlcIiksIF9pbmRleDIuYXNzZXJ0RWFjaChfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiU3RhdGVtZW50XCIpKSlcbiAgICB9XG4gIH0sXG4gIGFsaWFzZXM6IFtcIlNjb3BhYmxlXCIsIFwiQmxvY2tQYXJlbnRcIiwgXCJCbG9ja1wiLCBcIkZ1bmN0aW9uUGFyZW50XCJdXG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJPYmplY3RFeHByZXNzaW9uXCIsIHtcbiAgdmlzaXRvcjogW1wicHJvcGVydGllc1wiXSxcbiAgYWxpYXNlczogW1wiRXhwcmVzc2lvblwiXSxcbiAgZmllbGRzOiB7XG4gICAgcHJvcGVydGllczoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuY2hhaW4oX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJhcnJheVwiKSwgX2luZGV4Mi5hc3NlcnRFYWNoKF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJPYmplY3RNZXRob2RcIiwgXCJPYmplY3RQcm9wZXJ0eVwiLCBcIlNwcmVhZFByb3BlcnR5XCIpKSlcbiAgICB9XG4gIH1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIk9iamVjdE1ldGhvZFwiLCB7XG4gIGJ1aWxkZXI6IFtcImtpbmRcIiwgXCJrZXlcIiwgXCJwYXJhbXNcIiwgXCJib2R5XCIsIFwiY29tcHV0ZWRcIl0sXG4gIGZpZWxkczoge1xuICAgIGtpbmQ6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmNoYWluKF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwic3RyaW5nXCIpLCBfaW5kZXgyLmFzc2VydE9uZU9mKFwibWV0aG9kXCIsIFwiZ2V0XCIsIFwic2V0XCIpKSxcbiAgICAgIFwiZGVmYXVsdFwiOiBcIm1ldGhvZFwiXG4gICAgfSxcbiAgICBjb21wdXRlZDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwiYm9vbGVhblwiKSxcbiAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZVxuICAgIH0sXG4gICAga2V5OiB7XG4gICAgICB2YWxpZGF0ZTogZnVuY3Rpb24gdmFsaWRhdGUobm9kZSwga2V5LCB2YWwpIHtcbiAgICAgICAgdmFyIGV4cGVjdGVkVHlwZXMgPSBub2RlLmNvbXB1dGVkID8gW1wiRXhwcmVzc2lvblwiXSA6IFtcIklkZW50aWZpZXJcIiwgXCJMaXRlcmFsXCJdO1xuICAgICAgICBfaW5kZXgyLmFzc2VydE5vZGVUeXBlLmFwcGx5KHVuZGVmaW5lZCwgZXhwZWN0ZWRUeXBlcykobm9kZSwga2V5LCB2YWwpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVjb3JhdG9yczoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuY2hhaW4oX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJhcnJheVwiKSwgX2luZGV4Mi5hc3NlcnRFYWNoKF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJEZWNvcmF0b3JcIikpKVxuICAgIH0sXG4gICAgYm9keToge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJCbG9ja1N0YXRlbWVudFwiKVxuICAgIH0sXG4gICAgZ2VuZXJhdG9yOiB7XG4gICAgICBcImRlZmF1bHRcIjogZmFsc2UsXG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJib29sZWFuXCIpXG4gICAgfSxcbiAgICBhc3luYzoge1xuICAgICAgXCJkZWZhdWx0XCI6IGZhbHNlLFxuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwiYm9vbGVhblwiKVxuICAgIH1cbiAgfSxcbiAgdmlzaXRvcjogW1wia2V5XCIsIFwicGFyYW1zXCIsIFwiYm9keVwiLCBcImRlY29yYXRvcnNcIiwgXCJyZXR1cm5UeXBlXCIsIFwidHlwZVBhcmFtZXRlcnNcIl0sXG4gIGFsaWFzZXM6IFtcIlVzZXJXaGl0ZXNwYWNhYmxlXCIsIFwiRnVuY3Rpb25cIiwgXCJTY29wYWJsZVwiLCBcIkJsb2NrUGFyZW50XCIsIFwiRnVuY3Rpb25QYXJlbnRcIiwgXCJNZXRob2RcIl1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIk9iamVjdFByb3BlcnR5XCIsIHtcbiAgYnVpbGRlcjogW1wia2V5XCIsIFwidmFsdWVcIiwgXCJjb21wdXRlZFwiLCBcInNob3J0aGFuZFwiLCBcImRlY29yYXRvcnNcIl0sXG4gIGZpZWxkczoge1xuICAgIGNvbXB1dGVkOiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJib29sZWFuXCIpLFxuICAgICAgXCJkZWZhdWx0XCI6IGZhbHNlXG4gICAgfSxcbiAgICBrZXk6IHtcbiAgICAgIHZhbGlkYXRlOiBmdW5jdGlvbiB2YWxpZGF0ZShub2RlLCBrZXksIHZhbCkge1xuICAgICAgICB2YXIgZXhwZWN0ZWRUeXBlcyA9IG5vZGUuY29tcHV0ZWQgPyBbXCJFeHByZXNzaW9uXCJdIDogW1wiSWRlbnRpZmllclwiLCBcIkxpdGVyYWxcIl07XG4gICAgICAgIF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUuYXBwbHkodW5kZWZpbmVkLCBleHBlY3RlZFR5cGVzKShub2RlLCBrZXksIHZhbCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB2YWx1ZToge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpXG4gICAgfSxcbiAgICBzaG9ydGhhbmQ6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydFZhbHVlVHlwZShcImJvb2xlYW5cIiksXG4gICAgICBcImRlZmF1bHRcIjogZmFsc2VcbiAgICB9LFxuICAgIGRlY29yYXRvcnM6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmNoYWluKF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwiYXJyYXlcIiksIF9pbmRleDIuYXNzZXJ0RWFjaChfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRGVjb3JhdG9yXCIpKSksXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdmlzaXRvcjogW1wia2V5XCIsIFwidmFsdWVcIiwgXCJkZWNvcmF0b3JzXCJdLFxuICBhbGlhc2VzOiBbXCJVc2VyV2hpdGVzcGFjYWJsZVwiLCBcIlByb3BlcnR5XCJdXG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJSZXN0RWxlbWVudFwiLCB7XG4gIHZpc2l0b3I6IFtcImFyZ3VtZW50XCIsIFwidHlwZUFubm90YXRpb25cIl0sXG4gIGFsaWFzZXM6IFtcIkxWYWxcIl0sXG4gIGZpZWxkczoge1xuICAgIGFyZ3VtZW50OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkxWYWxcIilcbiAgICB9XG4gIH1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIlJldHVyblN0YXRlbWVudFwiLCB7XG4gIHZpc2l0b3I6IFtcImFyZ3VtZW50XCJdLFxuICBhbGlhc2VzOiBbXCJTdGF0ZW1lbnRcIiwgXCJUZXJtaW5hdG9ybGVzc1wiLCBcIkNvbXBsZXRpb25TdGF0ZW1lbnRcIl0sXG4gIGZpZWxkczoge1xuICAgIGFyZ3VtZW50OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkV4cHJlc3Npb25cIiksXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH1cbiAgfVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiU2VxdWVuY2VFeHByZXNzaW9uXCIsIHtcbiAgdmlzaXRvcjogW1wiZXhwcmVzc2lvbnNcIl0sXG4gIGZpZWxkczoge1xuICAgIGV4cHJlc3Npb25zOiB7IHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydFZhbHVlVHlwZShcImFycmF5XCIpIH1cbiAgfSxcbiAgYWxpYXNlczogW1wiRXhwcmVzc2lvblwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiU3dpdGNoQ2FzZVwiLCB7XG4gIHZpc2l0b3I6IFtcInRlc3RcIiwgXCJjb25zZXF1ZW50XCJdLFxuICBmaWVsZHM6IHtcbiAgICB0ZXN0OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkV4cHJlc3Npb25cIiksXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICAgIH0sXG4gICAgY29uc2VxdWVudDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuY2hhaW4oX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJhcnJheVwiKSwgX2luZGV4Mi5hc3NlcnRFYWNoKF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJTdGF0ZW1lbnRcIikpKVxuICAgIH1cbiAgfVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiU3dpdGNoU3RhdGVtZW50XCIsIHtcbiAgdmlzaXRvcjogW1wiZGlzY3JpbWluYW50XCIsIFwiY2FzZXNcIl0sXG4gIGFsaWFzZXM6IFtcIlN0YXRlbWVudFwiLCBcIkJsb2NrUGFyZW50XCIsIFwiU2NvcGFibGVcIl0sXG4gIGZpZWxkczoge1xuICAgIGRpc2NyaW1pbmFudDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpXG4gICAgfSxcbiAgICBjYXNlczoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuY2hhaW4oX2luZGV4Mi5hc3NlcnRWYWx1ZVR5cGUoXCJhcnJheVwiKSwgX2luZGV4Mi5hc3NlcnRFYWNoKF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJTd2l0Y2hDYXNlXCIpKSlcbiAgICB9XG4gIH1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIlRoaXNFeHByZXNzaW9uXCIsIHtcbiAgYWxpYXNlczogW1wiRXhwcmVzc2lvblwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiVGhyb3dTdGF0ZW1lbnRcIiwge1xuICB2aXNpdG9yOiBbXCJhcmd1bWVudFwiXSxcbiAgYWxpYXNlczogW1wiU3RhdGVtZW50XCIsIFwiVGVybWluYXRvcmxlc3NcIiwgXCJDb21wbGV0aW9uU3RhdGVtZW50XCJdLFxuICBmaWVsZHM6IHtcbiAgICBhcmd1bWVudDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpXG4gICAgfVxuICB9XG59KTtcblxuLy8gdG9kbzogYXQgbGVhc3QgaGFuZGxlciBvciBmaW5hbGl6ZXIgc2hvdWxkIGJlIHNldCB0byBiZSB2YWxpZFxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJUcnlTdGF0ZW1lbnRcIiwge1xuICB2aXNpdG9yOiBbXCJibG9ja1wiLCBcImhhbmRsZXJcIiwgXCJmaW5hbGl6ZXJcIl0sXG4gIGFsaWFzZXM6IFtcIlN0YXRlbWVudFwiXSxcbiAgZmllbGRzOiB7XG4gICAgYm9keToge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJCbG9ja1N0YXRlbWVudFwiKVxuICAgIH0sXG4gICAgaGFuZGxlcjoge1xuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICBoYW5kbGVyOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiQmxvY2tTdGF0ZW1lbnRcIilcbiAgICB9LFxuICAgIGZpbmFsaXplcjoge1xuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkJsb2NrU3RhdGVtZW50XCIpXG4gICAgfVxuICB9XG59KTtcblxuX2luZGV4M1tcImRlZmF1bHRcIl0oXCJVbmFyeUV4cHJlc3Npb25cIiwge1xuICBidWlsZGVyOiBbXCJvcGVyYXRvclwiLCBcImFyZ3VtZW50XCIsIFwicHJlZml4XCJdLFxuICBmaWVsZHM6IHtcbiAgICBwcmVmaXg6IHtcbiAgICAgIFwiZGVmYXVsdFwiOiBmYWxzZVxuICAgIH0sXG4gICAgYXJndW1lbnQ6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRXhwcmVzc2lvblwiKVxuICAgIH0sXG4gICAgb3BlcmF0b3I6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE9uZU9mLmFwcGx5KHVuZGVmaW5lZCwgX2NvbnN0YW50cy5VTkFSWV9PUEVSQVRPUlMpXG4gICAgfVxuICB9LFxuICB2aXNpdG9yOiBbXCJhcmd1bWVudFwiXSxcbiAgYWxpYXNlczogW1wiVW5hcnlMaWtlXCIsIFwiRXhwcmVzc2lvblwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiVXBkYXRlRXhwcmVzc2lvblwiLCB7XG4gIGJ1aWxkZXI6IFtcIm9wZXJhdG9yXCIsIFwiYXJndW1lbnRcIiwgXCJwcmVmaXhcIl0sXG4gIGZpZWxkczoge1xuICAgIHByZWZpeDoge1xuICAgICAgXCJkZWZhdWx0XCI6IGZhbHNlXG4gICAgfSxcbiAgICBhcmd1bWVudDoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpXG4gICAgfSxcbiAgICBvcGVyYXRvcjoge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0T25lT2YuYXBwbHkodW5kZWZpbmVkLCBfY29uc3RhbnRzLlVQREFURV9PUEVSQVRPUlMpXG4gICAgfVxuICB9LFxuICB2aXNpdG9yOiBbXCJhcmd1bWVudFwiXSxcbiAgYWxpYXNlczogW1wiRXhwcmVzc2lvblwiXVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiVmFyaWFibGVEZWNsYXJhdGlvblwiLCB7XG4gIGJ1aWxkZXI6IFtcImtpbmRcIiwgXCJkZWNsYXJhdGlvbnNcIl0sXG4gIHZpc2l0b3I6IFtcImRlY2xhcmF0aW9uc1wiXSxcbiAgYWxpYXNlczogW1wiU3RhdGVtZW50XCIsIFwiRGVjbGFyYXRpb25cIl0sXG4gIGZpZWxkczoge1xuICAgIGtpbmQ6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmNoYWluKF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwic3RyaW5nXCIpLCBfaW5kZXgyLmFzc2VydE9uZU9mKFwidmFyXCIsIFwibGV0XCIsIFwiY29uc3RcIikpXG4gICAgfSxcbiAgICBkZWNsYXJhdGlvbnM6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmNoYWluKF9pbmRleDIuYXNzZXJ0VmFsdWVUeXBlKFwiYXJyYXlcIiksIF9pbmRleDIuYXNzZXJ0RWFjaChfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiVmFyaWFibGVEZWNsYXJhdG9yXCIpKSlcbiAgICB9XG4gIH1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIlZhcmlhYmxlRGVjbGFyYXRvclwiLCB7XG4gIHZpc2l0b3I6IFtcImlkXCIsIFwiaW5pdFwiXSxcbiAgZmllbGRzOiB7XG4gICAgaWQ6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiTFZhbFwiKVxuICAgIH0sXG4gICAgaW5pdDoge1xuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkV4cHJlc3Npb25cIilcbiAgICB9XG4gIH1cbn0pO1xuXG5faW5kZXgzW1wiZGVmYXVsdFwiXShcIldoaWxlU3RhdGVtZW50XCIsIHtcbiAgdmlzaXRvcjogW1widGVzdFwiLCBcImJvZHlcIl0sXG4gIGFsaWFzZXM6IFtcIlN0YXRlbWVudFwiLCBcIkJsb2NrUGFyZW50XCIsIFwiTG9vcFwiLCBcIldoaWxlXCIsIFwiU2NvcGFibGVcIl0sXG4gIGZpZWxkczoge1xuICAgIHRlc3Q6IHtcbiAgICAgIHZhbGlkYXRlOiBfaW5kZXgyLmFzc2VydE5vZGVUeXBlKFwiRXhwcmVzc2lvblwiKVxuICAgIH0sXG4gICAgYm9keToge1xuICAgICAgdmFsaWRhdGU6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJCbG9ja1N0YXRlbWVudFwiLCBcIlN0YXRlbWVudFwiKVxuICAgIH1cbiAgfVxufSk7XG5cbl9pbmRleDNbXCJkZWZhdWx0XCJdKFwiV2l0aFN0YXRlbWVudFwiLCB7XG4gIHZpc2l0b3I6IFtcIm9iamVjdFwiLCBcImJvZHlcIl0sXG4gIGFsaWFzZXM6IFtcIlN0YXRlbWVudFwiXSxcbiAgZmllbGRzOiB7XG4gICAgb2JqZWN0OiB7XG4gICAgICBvYmplY3Q6IF9pbmRleDIuYXNzZXJ0Tm9kZVR5cGUoXCJFeHByZXNzaW9uXCIpXG4gICAgfSxcbiAgICBib2R5OiB7XG4gICAgICB2YWxpZGF0ZTogX2luZGV4Mi5hc3NlcnROb2RlVHlwZShcIkJsb2NrU3RhdGVtZW50XCIpXG4gICAgfVxuICB9XG59KTsiXX0=
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babel-types/lib/definitions/core.js
