

"use strict";

exports.__esModule = true;
exports.File = File;
exports.Program = Program;
exports.BlockStatement = BlockStatement;
exports.Noop = Noop;
exports.Directive = Directive;
exports.DirectiveLiteral = DirectiveLiteral;

function File(node /*: Object*/) {
  this.print(node.program, node);
}

function Program(node /*: Object*/) {
  this.printInnerComments(node, false);

  this.printSequence(node.directives, node);
  if (node.directives && node.directives.length) this.newline();

  this.printSequence(node.body, node);
}

function BlockStatement(node /*: Object*/) {
  this.push("{");
  this.printInnerComments(node);
  if (node.body.length) {
    this.newline();

    this.printSequence(node.directives, node, { indent: true });
    if (node.directives && node.directives.length) this.newline();

    this.printSequence(node.body, node, { indent: true });
    if (!this.format.retainLines) this.removeLast("\n");
    this.rightBrace();
  } else {
    this.push("}");
  }
}

function Noop() {}

function Directive(node /*: Object*/) {
  this.print(node.value, node);
  this.semicolon();
}

function DirectiveLiteral(node /*: Object*/) {
  this.push(this._stringLiteral(node.value));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFiZWwtZ2VuZXJhdG9yL2xpYi9nZW5lcmF0b3JzL2Jhc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxZQUFZLENBQUM7O0FBRWIsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDMUIsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDcEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDMUIsT0FBTyxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7QUFDeEMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDcEIsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDOUIsT0FBTyxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDOztBQUU1QyxTQUFTLElBQUksQ0FBQyxJQUFJLGVBQWU7QUFDL0IsTUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ2hDOztBQUVELFNBQVMsT0FBTyxDQUFDLElBQUksZUFBZTtBQUNsQyxNQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVyQyxNQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUMsTUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFOUQsTUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ3JDOztBQUVELFNBQVMsY0FBYyxDQUFDLElBQUksZUFBZTtBQUN6QyxNQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsTUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLE1BQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDcEIsUUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVmLFFBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUM1RCxRQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUU5RCxRQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDdEQsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEQsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ25CLE1BQU07QUFDTCxRQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ2hCO0NBQ0Y7O0FBRUQsU0FBUyxJQUFJLEdBQUcsRUFBRTs7QUFFbEIsU0FBUyxTQUFTLENBQUMsSUFBSSxlQUFlO0FBQ3BDLE1BQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM3QixNQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Q0FDbEI7O0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFJLGVBQWU7QUFDM0MsTUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0NBQzVDIiwiZmlsZSI6Ii9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFiZWwtZ2VuZXJhdG9yL2xpYi9nZW5lcmF0b3JzL2Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcbmV4cG9ydHMuRmlsZSA9IEZpbGU7XG5leHBvcnRzLlByb2dyYW0gPSBQcm9ncmFtO1xuZXhwb3J0cy5CbG9ja1N0YXRlbWVudCA9IEJsb2NrU3RhdGVtZW50O1xuZXhwb3J0cy5Ob29wID0gTm9vcDtcbmV4cG9ydHMuRGlyZWN0aXZlID0gRGlyZWN0aXZlO1xuZXhwb3J0cy5EaXJlY3RpdmVMaXRlcmFsID0gRGlyZWN0aXZlTGl0ZXJhbDtcblxuZnVuY3Rpb24gRmlsZShub2RlIC8qOiBPYmplY3QqLykge1xuICB0aGlzLnByaW50KG5vZGUucHJvZ3JhbSwgbm9kZSk7XG59XG5cbmZ1bmN0aW9uIFByb2dyYW0obm9kZSAvKjogT2JqZWN0Ki8pIHtcbiAgdGhpcy5wcmludElubmVyQ29tbWVudHMobm9kZSwgZmFsc2UpO1xuXG4gIHRoaXMucHJpbnRTZXF1ZW5jZShub2RlLmRpcmVjdGl2ZXMsIG5vZGUpO1xuICBpZiAobm9kZS5kaXJlY3RpdmVzICYmIG5vZGUuZGlyZWN0aXZlcy5sZW5ndGgpIHRoaXMubmV3bGluZSgpO1xuXG4gIHRoaXMucHJpbnRTZXF1ZW5jZShub2RlLmJvZHksIG5vZGUpO1xufVxuXG5mdW5jdGlvbiBCbG9ja1N0YXRlbWVudChub2RlIC8qOiBPYmplY3QqLykge1xuICB0aGlzLnB1c2goXCJ7XCIpO1xuICB0aGlzLnByaW50SW5uZXJDb21tZW50cyhub2RlKTtcbiAgaWYgKG5vZGUuYm9keS5sZW5ndGgpIHtcbiAgICB0aGlzLm5ld2xpbmUoKTtcblxuICAgIHRoaXMucHJpbnRTZXF1ZW5jZShub2RlLmRpcmVjdGl2ZXMsIG5vZGUsIHsgaW5kZW50OiB0cnVlIH0pO1xuICAgIGlmIChub2RlLmRpcmVjdGl2ZXMgJiYgbm9kZS5kaXJlY3RpdmVzLmxlbmd0aCkgdGhpcy5uZXdsaW5lKCk7XG5cbiAgICB0aGlzLnByaW50U2VxdWVuY2Uobm9kZS5ib2R5LCBub2RlLCB7IGluZGVudDogdHJ1ZSB9KTtcbiAgICBpZiAoIXRoaXMuZm9ybWF0LnJldGFpbkxpbmVzKSB0aGlzLnJlbW92ZUxhc3QoXCJcXG5cIik7XG4gICAgdGhpcy5yaWdodEJyYWNlKCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wdXNoKFwifVwiKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBOb29wKCkge31cblxuZnVuY3Rpb24gRGlyZWN0aXZlKG5vZGUgLyo6IE9iamVjdCovKSB7XG4gIHRoaXMucHJpbnQobm9kZS52YWx1ZSwgbm9kZSk7XG4gIHRoaXMuc2VtaWNvbG9uKCk7XG59XG5cbmZ1bmN0aW9uIERpcmVjdGl2ZUxpdGVyYWwobm9kZSAvKjogT2JqZWN0Ki8pIHtcbiAgdGhpcy5wdXNoKHRoaXMuX3N0cmluZ0xpdGVyYWwobm9kZS52YWx1ZSkpO1xufSJdfQ==
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babel-generator/lib/generators/base.js