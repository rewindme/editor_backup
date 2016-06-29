

/**
 * Based on the comment attachment algorithm used in espree and estraverse.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function last(stack) {
  return stack[stack.length - 1];
}

var pp = _index2["default"].prototype;

pp.addComment = function (comment) {
  this.state.trailingComments.push(comment);
  this.state.leadingComments.push(comment);
};

pp.processComment = function (node) {
  if (node.type === "Program" && node.body.length > 0) return;

  var stack = this.state.commentStack;

  var lastChild = undefined,
      trailingComments = undefined,
      i = undefined;

  if (this.state.trailingComments.length > 0) {
    // If the first comment in trailingComments comes after the
    // current node, then we're good - all comments in the array will
    // come after the node and so it's safe to add them as official
    // trailingComments.
    if (this.state.trailingComments[0].start >= node.end) {
      trailingComments = this.state.trailingComments;
      this.state.trailingComments = [];
    } else {
      // Otherwise, if the first comment doesn't come after the
      // current node, that means we have a mix of leading and trailing
      // comments in the array and that leadingComments contains the
      // same items as trailingComments. Reset trailingComments to
      // zero items and we'll handle this by evaluating leadingComments
      // later.
      this.state.trailingComments.length = 0;
    }
  } else {
    var lastInStack = last(stack);
    if (stack.length > 0 && lastInStack.trailingComments && lastInStack.trailingComments[0].start >= node.end) {
      trailingComments = lastInStack.trailingComments;
      lastInStack.trailingComments = null;
    }
  }

  // Eating the stack.
  while (stack.length > 0 && last(stack).start >= node.start) {
    lastChild = stack.pop();
  }

  if (lastChild) {
    if (lastChild.leadingComments) {
      if (lastChild !== node && last(lastChild.leadingComments).end <= node.start) {
        node.leadingComments = lastChild.leadingComments;
        lastChild.leadingComments = null;
      } else {
        // A leading comment for an anonymous class had been stolen by its first ClassMethod,
        // so this takes back the leading comment.
        // See also: https://github.com/eslint/espree/issues/158
        for (i = lastChild.leadingComments.length - 2; i >= 0; --i) {
          if (lastChild.leadingComments[i].end <= node.start) {
            node.leadingComments = lastChild.leadingComments.splice(0, i + 1);
            break;
          }
        }
      }
    }
  } else if (this.state.leadingComments.length > 0) {
    if (last(this.state.leadingComments).end <= node.start) {
      node.leadingComments = this.state.leadingComments;
      this.state.leadingComments = [];
    } else {
      // https://github.com/eslint/espree/issues/2
      //
      // In special cases, such as return (without a value) and
      // debugger, all comments will end up as leadingComments and
      // will otherwise be eliminated. This step runs when the
      // commentStack is empty and there are comments left
      // in leadingComments.
      //
      // This loop figures out the stopping point between the actual
      // leading and trailing comments by finding the location of the
      // first comment that comes after the given node.
      for (i = 0; i < this.state.leadingComments.length; i++) {
        if (this.state.leadingComments[i].end > node.start) {
          break;
        }
      }

      // Split the array based on the location of the first comment
      // that comes after the node. Keep in mind that this could
      // result in an empty array, and if so, the array must be
      // deleted.
      node.leadingComments = this.state.leadingComments.slice(0, i);
      if (node.leadingComments.length === 0) {
        node.leadingComments = null;
      }

      // Similarly, trailing comments are attached later. The variable
      // must be reset to null if there are no trailing comments.
      trailingComments = this.state.leadingComments.slice(i);
      if (trailingComments.length === 0) {
        trailingComments = null;
      }
    }
  }

  if (trailingComments) {
    if (trailingComments.length && trailingComments[0].start >= node.start && last(trailingComments).end <= node.end) {
      node.innerComments = trailingComments;
    } else {
      node.trailingComments = trailingComments;
    }
  }

  stack.push(node);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9idWlsZC1ndWxwL3NwZWMvZml4dHVyZS9ub2RlX21vZHVsZXNfYmFiZWwvYmFieWxvbi9saWIvcGFyc2VyL2NvbW1lbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLFlBQVksQ0FBQzs7QUFFYixJQUFJLHNCQUFzQixHQUFHLE9BQU8sQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVqRyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRWhDLElBQUksT0FBTyxHQUFHLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU3QyxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDbkIsU0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztDQUNoQzs7QUFFRCxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDOztBQUV0QyxFQUFFLENBQUMsVUFBVSxHQUFHLFVBQVUsT0FBTyxFQUFFO0FBQ2pDLE1BQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFDLE1BQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUMxQyxDQUFDOztBQUVGLEVBQUUsQ0FBQyxjQUFjLEdBQUcsVUFBVSxJQUFJLEVBQUU7QUFDbEMsTUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsT0FBTzs7QUFFNUQsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7O0FBRXBDLE1BQUksU0FBUyxHQUFHLFNBQVM7TUFDckIsZ0JBQWdC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UDtPQUNGOzs7Ozs7QUFNRCxVQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUQsVUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDckMsWUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7T0FDN0I7Ozs7QUFJRCxzQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsVUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ2pDLHdCQUFnQixHQUFHLElBQUksQ0FBQztPQUN6QjtLQUNGO0dBQ0Y7O0FBRUQsTUFBSSxnQkFBZ0IsRUFBRTtBQUNwQixRQUFJLGdCQUFnQixDQUFDLE1BQU0sSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNoSCxVQUFJLENBQUMsYUFBYSxHQUFHLGdCQUFnQixDQUFDO0tBQ3ZDLE1BQU07QUFDTCxVQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7S0FDMUM7R0FDRjs7QUFFRCxPQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ2xCLENBQUMiLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL2J1aWxkLWd1bHAvc3BlYy9maXh0dXJlL25vZGVfbW9kdWxlc19iYWJlbC9iYWJ5bG9uL2xpYi9wYXJzZXIvY29tbWVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG4vKipcbiAqIEJhc2VkIG9uIHRoZSBjb21tZW50IGF0dGFjaG1lbnQgYWxnb3JpdGhtIHVzZWQgaW4gZXNwcmVlIGFuZCBlc3RyYXZlcnNlLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICogbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICogICBub3RpY2UsIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0XG4gKiAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAqICAgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIlxuICogQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRVxuICogSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0VcbiAqIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCA8Q09QWVJJR0hUIEhPTERFUj4gQkUgTElBQkxFIEZPUiBBTllcbiAqIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTXG4gKiAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7XG4gKiBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkRcbiAqIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUXG4gKiAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0ZcbiAqIFRISVMgU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvaGVscGVycy9pbnRlcm9wLXJlcXVpcmUtZGVmYXVsdFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfaW5kZXggPSByZXF1aXJlKFwiLi9pbmRleFwiKTtcblxudmFyIF9pbmRleDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pbmRleCk7XG5cbmZ1bmN0aW9uIGxhc3Qoc3RhY2spIHtcbiAgcmV0dXJuIHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xufVxuXG52YXIgcHAgPSBfaW5kZXgyW1wiZGVmYXVsdFwiXS5wcm90b3R5cGU7XG5cbnBwLmFkZENvbW1lbnQgPSBmdW5jdGlvbiAoY29tbWVudCkge1xuICB0aGlzLnN0YXRlLnRyYWlsaW5nQ29tbWVudHMucHVzaChjb21tZW50KTtcbiAgdGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHMucHVzaChjb21tZW50KTtcbn07XG5cbnBwLnByb2Nlc3NDb21tZW50ID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgaWYgKG5vZGUudHlwZSA9PT0gXCJQcm9ncmFtXCIgJiYgbm9kZS5ib2R5Lmxlbmd0aCA+IDApIHJldHVybjtcblxuICB2YXIgc3RhY2sgPSB0aGlzLnN0YXRlLmNvbW1lbnRTdGFjaztcblxuICB2YXIgbGFzdENoaWxkID0gdW5kZWZpbmVkLFxuICAgICAgdHJhaWxpbmdDb21tZW50cyA9IHVuZGVmaW5lZCxcbiAgICAgIGkgPSB1bmRlZmluZWQ7XG5cbiAgaWYgKHRoaXMuc3RhdGUudHJhaWxpbmdDb21tZW50cy5sZW5ndGggPiAwKSB7XG4gICAgLy8gSWYgdGhlIGZpcnN0IGNvbW1lbnQgaW4gdHJhaWxpbmdDb21tZW50cyBjb21lcyBhZnRlciB0aGVcbiAgICAvLyBjdXJyZW50IG5vZGUsIHRoZW4gd2UncmUgZ29vZCAtIGFsbCBjb21tZW50cyBpbiB0aGUgYXJyYXkgd2lsbFxuICAgIC8vIGNvbWUgYWZ0ZXIgdGhlIG5vZGUgYW5kIHNvIGl0J3Mgc2FmZSB0byBhZGQgdGhlbSBhcyBvZmZpY2lhbFxuICAgIC8vIHRyYWlsaW5nQ29tbWVudHMuXG4gICAgaWYgKHRoaXMuc3RhdGUudHJhaWxpbmdDb21tZW50c1swXS5zdGFydCA+PSBub2RlLmVuZCkge1xuICAgICAgdHJhaWxpbmdDb21tZW50cyA9IHRoaXMuc3RhdGUudHJhaWxpbmdDb21tZW50cztcbiAgICAgIHRoaXMuc3RhdGUudHJhaWxpbmdDb21tZW50cyA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIGlmIHRoZSBmaXJzdCBjb21tZW50IGRvZXNuJ3QgY29tZSBhZnRlciB0aGVcbiAgICAgIC8vIGN1cnJlbnQgbm9kZSwgdGhhdCBtZWFucyB3ZSBoYXZlIGEgbWl4IG9mIGxlYWRpbmcgYW5kIHRyYWlsaW5nXG4gICAgICAvLyBjb21tZW50cyBpbiB0aGUgYXJyYXkgYW5kIHRoYXQgbGVhZGluZ0NvbW1lbnRzIGNvbnRhaW5zIHRoZVxuICAgICAgLy8gc2FtZSBpdGVtcyBhcyB0cmFpbGluZ0NvbW1lbnRzLiBSZXNldCB0cmFpbGluZ0NvbW1lbnRzIHRvXG4gICAgICAvLyB6ZXJvIGl0ZW1zIGFuZCB3ZSdsbCBoYW5kbGUgdGhpcyBieSBldmFsdWF0aW5nIGxlYWRpbmdDb21tZW50c1xuICAgICAgLy8gbGF0ZXIuXG4gICAgICB0aGlzLnN0YXRlLnRyYWlsaW5nQ29tbWVudHMubGVuZ3RoID0gMDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxhc3RJblN0YWNrID0gbGFzdChzdGFjayk7XG4gICAgaWYgKHN0YWNrLmxlbmd0aCA+IDAgJiYgbGFzdEluU3RhY2sudHJhaWxpbmdDb21tZW50cyAmJiBsYXN0SW5TdGFjay50cmFpbGluZ0NvbW1lbnRzWzBdLnN0YXJ0ID49IG5vZGUuZW5kKSB7XG4gICAgICB0cmFpbGluZ0NvbW1lbnRzID0gbGFzdEluU3RhY2sudHJhaWxpbmdDb21tZW50cztcbiAgICAgIGxhc3RJblN0YWNrLnRyYWlsaW5nQ29tbWVudHMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8vIEVhdGluZyB0aGUgc3RhY2suXG4gIHdoaWxlIChzdGFjay5sZW5ndGggPiAwICYmIGxhc3Qoc3RhY2spLnN0YXJ0ID49IG5vZGUuc3RhcnQpIHtcbiAgICBsYXN0Q2hpbGQgPSBzdGFjay5wb3AoKTtcbiAgfVxuXG4gIGlmIChsYXN0Q2hpbGQpIHtcbiAgICBpZiAobGFzdENoaWxkLmxlYWRpbmdDb21tZW50cykge1xuICAgICAgaWYgKGxhc3RDaGlsZCAhPT0gbm9kZSAmJiBsYXN0KGxhc3RDaGlsZC5sZWFkaW5nQ29tbWVudHMpLmVuZCA8PSBub2RlLnN0YXJ0KSB7XG4gICAgICAgIG5vZGUubGVhZGluZ0NvbW1lbnRzID0gbGFzdENoaWxkLmxlYWRpbmdDb21tZW50cztcbiAgICAgICAgbGFzdENoaWxkLmxlYWRpbmdDb21tZW50cyA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBIGxlYWRpbmcgY29tbWVudCBmb3IgYW4gYW5vbnltb3VzIGNsYXNzIGhhZCBiZWVuIHN0b2xlbiBieSBpdHMgZmlyc3QgQ2xhc3NNZXRob2QsXG4gICAgICAgIC8vIHNvIHRoaXMgdGFrZXMgYmFjayB0aGUgbGVhZGluZyBjb21tZW50LlxuICAgICAgICAvLyBTZWUgYWxzbzogaHR0cHM6Ly9naXRodWIuY29tL2VzbGludC9lc3ByZWUvaXNzdWVzLzE1OFxuICAgICAgICBmb3IgKGkgPSBsYXN0Q2hpbGQubGVhZGluZ0NvbW1lbnRzLmxlbmd0aCAtIDI7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgaWYgKGxhc3RDaGlsZC5sZWFkaW5nQ29tbWVudHNbaV0uZW5kIDw9IG5vZGUuc3RhcnQpIHtcbiAgICAgICAgICAgIG5vZGUubGVhZGluZ0NvbW1lbnRzID0gbGFzdENoaWxkLmxlYWRpbmdDb21tZW50cy5zcGxpY2UoMCwgaSArIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUubGVhZGluZ0NvbW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBpZiAobGFzdCh0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cykuZW5kIDw9IG5vZGUuc3RhcnQpIHtcbiAgICAgIG5vZGUubGVhZGluZ0NvbW1lbnRzID0gdGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHM7XG4gICAgICB0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cyA9IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzcHJlZS9pc3N1ZXMvMlxuICAgICAgLy9cbiAgICAgIC8vIEluIHNwZWNpYWwgY2FzZXMsIHN1Y2ggYXMgcmV0dXJuICh3aXRob3V0IGEgdmFsdWUpIGFuZFxuICAgICAgLy8gZGVidWdnZXIsIGFsbCBjb21tZW50cyB3aWxsIGVuZCB1cCBhcyBsZWFkaW5nQ29tbWVudHMgYW5kXG4gICAgICAvLyB3aWxsIG90aGVyd2lzZSBiZSBlbGltaW5hdGVkLiBUaGlzIHN0ZXAgcnVucyB3aGVuIHRoZVxuICAgICAgLy8gY29tbWVudFN0YWNrIGlzIGVtcHR5IGFuZCB0aGVyZSBhcmUgY29tbWVudHMgbGVmdFxuICAgICAgLy8gaW4gbGVhZGluZ0NvbW1lbnRzLlxuICAgICAgLy9cbiAgICAgIC8vIFRoaXMgbG9vcCBmaWd1cmVzIG91dCB0aGUgc3RvcHBpbmcgcG9pbnQgYmV0d2VlbiB0aGUgYWN0dWFsXG4gICAgICAvLyBsZWFkaW5nIGFuZCB0cmFpbGluZyBjb21tZW50cyBieSBmaW5kaW5nIHRoZSBsb2NhdGlvbiBvZiB0aGVcbiAgICAgIC8vIGZpcnN0IGNvbW1lbnQgdGhhdCBjb21lcyBhZnRlciB0aGUgZ2l2ZW4gbm9kZS5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHNbaV0uZW5kID4gbm9kZS5zdGFydCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFNwbGl0IHRoZSBhcnJheSBiYXNlZCBvbiB0aGUgbG9jYXRpb24gb2YgdGhlIGZpcnN0IGNvbW1lbnRcbiAgICAgIC8vIHRoYXQgY29tZXMgYWZ0ZXIgdGhlIG5vZGUuIEtlZXAgaW4gbWluZCB0aGF0IHRoaXMgY291bGRcbiAgICAgIC8vIHJlc3VsdCBpbiBhbiBlbXB0eSBhcnJheSwgYW5kIGlmIHNvLCB0aGUgYXJyYXkgbXVzdCBiZVxuICAgICAgLy8gZGVsZXRlZC5cbiAgICAgIG5vZGUubGVhZGluZ0NvbW1lbnRzID0gdGhpcy5zdGF0ZS5sZWFkaW5nQ29tbWVudHMuc2xpY2UoMCwgaSk7XG4gICAgICBpZiAobm9kZS5sZWFkaW5nQ29tbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG5vZGUubGVhZGluZ0NvbW1lbnRzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gU2ltaWxhcmx5LCB0cmFpbGluZyBjb21tZW50cyBhcmUgYXR0YWNoZWQgbGF0ZXIuIFRoZSB2YXJpYWJsZVxuICAgICAgLy8gbXVzdCBiZSByZXNldCB0byBudWxsIGlmIHRoZXJlIGFyZSBubyB0cmFpbGluZyBjb21tZW50cy5cbiAgICAgIHRyYWlsaW5nQ29tbWVudHMgPSB0aGlzLnN0YXRlLmxlYWRpbmdDb21tZW50cy5zbGljZShpKTtcbiAgICAgIGlmICh0cmFpbGluZ0NvbW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0cmFpbGluZ0NvbW1lbnRzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAodHJhaWxpbmdDb21tZW50cykge1xuICAgIGlmICh0cmFpbGluZ0NvbW1lbnRzLmxlbmd0aCAmJiB0cmFpbGluZ0NvbW1lbnRzWzBdLnN0YXJ0ID49IG5vZGUuc3RhcnQgJiYgbGFzdCh0cmFpbGluZ0NvbW1lbnRzKS5lbmQgPD0gbm9kZS5lbmQpIHtcbiAgICAgIG5vZGUuaW5uZXJDb21tZW50cyA9IHRyYWlsaW5nQ29tbWVudHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGUudHJhaWxpbmdDb21tZW50cyA9IHRyYWlsaW5nQ29tbWVudHM7XG4gICAgfVxuICB9XG5cbiAgc3RhY2sucHVzaChub2RlKTtcbn07Il19
//# sourceURL=/Users/naver/.atom/packages/build-gulp/spec/fixture/node_modules_babel/babylon/lib/parser/comments.js
