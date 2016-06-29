var __hasProp = ({}).hasOwnProperty,
    __extends = function __extends(child, parent) {
	for (var key in parent) {
		if (__hasProp.call(parent, key)) child[key] = parent[key];
	}function ctor() {
		this.constructor = child;
	}ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
},
    $ = require('atom').$,
    Dialog = require('./dialog');

module.exports = AddDialog = (function (parent) {

	__extends(AddDialog, parent);

	function AddDialog(initialPath, isFile) {
		this.isCreatingFile = isFile;

		AddDialog.__super__.constructor.call(this, {
			'prompt': isFile ? 'Enter the path for the new file.' : 'Enter the path for the new folder.',
			'initialPath': initialPath,
			'select': false,
			'iconClass': isFile ? 'icon-file-add' : 'icon-file-directory-create'
		});
	}

	AddDialog.prototype.onConfirm = function (relativePath) {
		this.trigger('new-path', [relativePath]);
	};

	return AddDialog;
})(Dialog);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi9kaWFsb2dzL2FkZC1kaWFsb2cuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxTQUFTLEdBQUcsQ0FBQSxHQUFFLENBQUMsY0FBYztJQUNoQyxTQUFTLEdBQUcsU0FBWixTQUFTLENBQVksS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUFFLE1BQUssSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO0FBQUUsTUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQUUsQUFBQyxTQUFTLElBQUksR0FBRztBQUFFLE1BQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0VBQUUsQUFBQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQUFBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsQUFBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQUFBQyxPQUFPLEtBQUssQ0FBQztDQUFFO0lBQy9SLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNyQixNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUU5QixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxDQUFDLFVBQVUsTUFBTSxFQUFFOztBQUUvQyxVQUFTLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUU3QixVQUFTLFNBQVMsQ0FBRSxXQUFXLEVBQUUsTUFBTSxFQUFFO0FBQ3hDLE1BQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDOztBQUU3QixXQUFTLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQzFDLFdBQVEsRUFBRSxNQUFNLEdBQUcsa0NBQWtDLEdBQUcsb0NBQW9DO0FBQzVGLGdCQUFhLEVBQUUsV0FBVztBQUMxQixXQUFRLEVBQUUsS0FBSztBQUNmLGNBQVcsRUFBRSxNQUFNLEdBQUcsZUFBZSxHQUFHLDRCQUE0QjtHQUNwRSxDQUFDLENBQUM7RUFDSDs7QUFFRCxVQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxVQUFVLFlBQVksRUFBRTtBQUN2RCxNQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7RUFDekMsQ0FBQTs7QUFFRCxRQUFPLFNBQVMsQ0FBQztDQUVqQixDQUFBLENBQUUsTUFBTSxDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL2RpYWxvZ3MvYWRkLWRpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eSxcblx0X19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG5cdCQgPSByZXF1aXJlKCdhdG9tJykuJCxcblx0RGlhbG9nID0gcmVxdWlyZSgnLi9kaWFsb2cnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBBZGREaWFsb2cgPSAoZnVuY3Rpb24gKHBhcmVudCkge1xuXG5cdF9fZXh0ZW5kcyhBZGREaWFsb2csIHBhcmVudCk7XG5cblx0ZnVuY3Rpb24gQWRkRGlhbG9nIChpbml0aWFsUGF0aCwgaXNGaWxlKSB7XG5cdFx0dGhpcy5pc0NyZWF0aW5nRmlsZSA9IGlzRmlsZTtcblxuXHRcdEFkZERpYWxvZy5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCB7XG5cdFx0XHQncHJvbXB0JzogaXNGaWxlID8gXCJFbnRlciB0aGUgcGF0aCBmb3IgdGhlIG5ldyBmaWxlLlwiIDogXCJFbnRlciB0aGUgcGF0aCBmb3IgdGhlIG5ldyBmb2xkZXIuXCIsXG5cdFx0XHQnaW5pdGlhbFBhdGgnOiBpbml0aWFsUGF0aCxcblx0XHRcdCdzZWxlY3QnOiBmYWxzZSxcblx0XHRcdCdpY29uQ2xhc3MnOiBpc0ZpbGUgPyAnaWNvbi1maWxlLWFkZCcgOiAnaWNvbi1maWxlLWRpcmVjdG9yeS1jcmVhdGUnXG5cdFx0fSk7XG5cdH1cblxuXHRBZGREaWFsb2cucHJvdG90eXBlLm9uQ29uZmlybSA9IGZ1bmN0aW9uIChyZWxhdGl2ZVBhdGgpIHtcblx0XHR0aGlzLnRyaWdnZXIoJ25ldy1wYXRoJywgW3JlbGF0aXZlUGF0aF0pO1xuXHR9XG5cblx0cmV0dXJuIEFkZERpYWxvZztcblxufSkoRGlhbG9nKTtcbiJdfQ==