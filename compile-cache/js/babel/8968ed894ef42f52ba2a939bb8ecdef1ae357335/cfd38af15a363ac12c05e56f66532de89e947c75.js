var __hasProp = ({}).hasOwnProperty,
    __extends = function __extends(child, parent) {
	for (var key in parent) {
		if (__hasProp.call(parent, key)) child[key] = parent[key];
	}function ctor() {
		this.constructor = child;
	}ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
},
    $ = require('atom-space-pen-views').$,
    FileView = require('./file-view'),
    View = require('atom-space-pen-views').View;

module.exports = DirectoryView = (function (parent) {

	__extends(DirectoryView, parent);

	function DirectoryView() {
		DirectoryView.__super__.constructor.apply(this, arguments);
	}

	DirectoryView.content = function () {
		return this.li({
			'class': 'directory entry list-nested-item collapsed'
		}, (function () {
			this.div({
				'class': 'header list-item',
				'outlet': 'header'
			}, (function () {
				return this.span({
					'class': 'name icon',
					'outlet': 'name'
				});
			}).bind(this));
			this.ol({
				'class': 'entries list-tree',
				'outlet': 'entries'
			});
		}).bind(this));
	};

	DirectoryView.prototype.initialize = function (directory) {
		//DirectoryView.__super__.initialize.apply(this, arguments);

		var self = this;

		self.item = directory;
		self.name.text(self.item.name);
		self.name.attr('data-name', self.item.name);
		self.name.attr('data-path', self.item.remote);
		self.name.addClass(self.item.type && self.item.type == 'l' ? 'icon-file-symlink-directory' : 'icon-file-directory');

		if (self.item.isExpanded || self.item.isRoot) self.expand();

		if (self.item.isRoot) self.addClass('project-root');

		// Trigger repaint
		self.item.$folders.onValue(function () {
			self.repaint();
		});
		self.item.$files.onValue(function () {
			self.repaint();
		});
		self.item.$isExpanded.onValue(function () {
			self.setClasses();
		});
		self.item.on('destroyed', function () {
			self.destroy();
		});
		self.repaint();

		// Events
		self.on('mousedown', function (e) {
			e.stopPropagation();

			var view = $(this).view(),
			    button = e.originalEvent ? e.originalEvent.button : 0;

			if (!view) return;

			switch (button) {
				case 2:
					if (view.is('.selected')) return;
				default:
					if (!e.ctrlKey) $('.remote-ftp-view .selected').removeClass('selected');
					view.toggleClass('selected');

					if (button == 0) {
						if (view.item.status == 0) view.open();

						if (button == 0) view.toggle();else view.expand();
					}
			}
		});
		self.on('dblclick', function (e) {
			e.stopPropagation();

			var view = $(this).view();
			if (!view) return;

			view.open();
		});
	};

	DirectoryView.prototype.destroy = function () {
		this.item = null;

		this.remove();
	};

	DirectoryView.prototype.repaint = function (recursive) {
		var self = this,
		    views = self.entries.children().map(function () {
			return $(this).view();
		}).get(),
		    folders = [],
		    files = [];

		self.entries.children().detach();

		self.item.folders.forEach(function (item) {
			for (var a = 0, b = views.length; a < b; ++a) if (views[a] && views[a] instanceof DirectoryView && views[a].item == item) {
				folders.push(views[a]);
				return;
			}
			folders.push(new DirectoryView(item));
		});
		self.item.files.forEach(function (item) {
			for (var a = 0, b = views.length; a < b; ++a) if (views[a] && views[a] instanceof FileView && views[a].item == item) {
				files.push(views[a]);
				return;
			}
			files.push(new FileView(item));
		});

		// TODO Destroy left over...

		views = folders.concat(files);

		views.sort(function (a, b) {
			if (a.constructor != b.constructor) return a instanceof DirectoryView ? -1 : 1;
			if (a.item.name == b.item.name) return 0;

			return a.item.name.toLowerCase().localeCompare(b.item.name.toLowerCase());
		});

		views.forEach(function (view) {
			self.entries.append(view);
		});
	};

	DirectoryView.prototype.setClasses = function () {
		if (this.item.isExpanded) {
			this.addClass('expanded').removeClass('collapsed');
		} else {
			this.addClass('collapsed').removeClass('expanded');
		}
	};

	DirectoryView.prototype.expand = function (recursive) {
		this.item.isExpanded = true;

		if (recursive) {
			this.entries.children().each(function () {
				var view = $(this).view();
				if (view && view instanceof DirectoryView) view.expand(true);
			});
		}
	};

	DirectoryView.prototype.collapse = function (recursive) {
		this.item.isExpanded = false;

		if (recursive) {
			this.entries.children().each(function () {
				var view = $(this).view();
				if (view && view instanceof DirectoryView) view.collapse(true);
			});
		}
	};

	DirectoryView.prototype.toggle = function (recursive) {
		if (this.item.isExpanded) this.collapse(recursive);else this.expand(recursive);
	};

	DirectoryView.prototype.open = function () {
		this.item.open();
	};

	DirectoryView.prototype.refresh = function () {
		this.item.open();
	};

	return DirectoryView;
})(View);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi92aWV3cy9kaXJlY3Rvcnktdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLFNBQVMsR0FBRyxDQUFBLEdBQUUsQ0FBQyxjQUFjO0lBQ2hDLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBWSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQUUsTUFBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUU7QUFBRSxNQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7RUFBRSxBQUFDLFNBQVMsSUFBSSxHQUFHO0FBQUUsTUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7RUFBRSxBQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxBQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxBQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxBQUFDLE9BQU8sS0FBSyxDQUFDO0NBQUU7SUFDL1IsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7SUFDckMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDakMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLElBQUksQ0FBQzs7QUFFN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLEdBQUcsQ0FBQyxVQUFVLE1BQU0sRUFBRTs7QUFFbkQsVUFBUyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFakMsVUFBUyxhQUFhLEdBQUk7QUFDekIsZUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztFQUMzRDs7QUFFRCxjQUFhLENBQUMsT0FBTyxHQUFHLFlBQVk7QUFDbkMsU0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQ2QsVUFBTyxFQUFFLDRDQUE0QztHQUNyRCxFQUFFLENBQUEsWUFBWTtBQUNkLE9BQUksQ0FBQyxHQUFHLENBQUM7QUFDUixXQUFPLEVBQUUsa0JBQWtCO0FBQzNCLFlBQVEsRUFBRSxRQUFRO0lBQ2xCLEVBQUUsQ0FBQSxZQUFZO0FBQ2QsV0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2hCLFlBQU8sRUFBRSxXQUFXO0FBQ3BCLGFBQVEsRUFBRSxNQUFNO0tBQ2hCLENBQUMsQ0FBQTtJQUNGLENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNkLE9BQUksQ0FBQyxFQUFFLENBQUM7QUFDUCxXQUFPLEVBQUUsbUJBQW1CO0FBQzVCLFlBQVEsRUFBRSxTQUFTO0lBQ25CLENBQUMsQ0FBQztHQUNILENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUNkLENBQUM7O0FBRUYsY0FBYSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxTQUFTLEVBQUU7OztBQUd6RCxNQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLE1BQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLE1BQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsTUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsTUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUMsTUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxHQUFHLDZCQUE2QixHQUFHLHFCQUFxQixDQUFDLENBQUE7O0FBRW5ILE1BQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQzNDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFZixNQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDOzs7QUFHL0IsTUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQVk7QUFBRSxPQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7R0FBRSxDQUFDLENBQUM7QUFDNUQsTUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVk7QUFBRSxPQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7R0FBRSxDQUFDLENBQUM7QUFDMUQsTUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFlBQVk7QUFBRSxPQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FBRSxDQUFDLENBQUM7QUFDbEUsTUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFlBQVk7QUFBRSxPQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7R0FBRSxDQUFDLENBQUM7QUFDM0QsTUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOzs7QUFHZixNQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsRUFBRTtBQUNqQyxJQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7O0FBRXBCLE9BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUU7T0FDeEIsTUFBTSxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUV2RCxPQUFJLENBQUMsSUFBSSxFQUNSLE9BQU87O0FBRVIsV0FBUSxNQUFNO0FBQ2IsU0FBSyxDQUFDO0FBQ0wsU0FBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUN2QixPQUFPO0FBQUEsQUFDVDtBQUNDLFNBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUNiLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN6RCxTQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUU3QixTQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUU7QUFDaEIsVUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQ3hCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFYixVQUFJLE1BQU0sSUFBSSxDQUFDLEVBQ2QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBRWQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO01BQ2Y7QUFBQSxJQUNGO0dBQ0QsQ0FBQyxDQUFDO0FBQ0gsTUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUU7QUFDaEMsSUFBQyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUVwQixPQUFJLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUIsT0FBSSxDQUFDLElBQUksRUFDUixPQUFPOztBQUVSLE9BQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQztFQUNILENBQUE7O0FBRUQsY0FBYSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsWUFBWTtBQUM3QyxNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFakIsTUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0VBQ2QsQ0FBQTs7QUFFRCxjQUFhLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxVQUFVLFNBQVMsRUFBRTtBQUN0RCxNQUFJLElBQUksR0FBRyxJQUFJO01BQ2QsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLFlBQVk7QUFBRSxVQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUU7TUFDakYsT0FBTyxHQUFHLEVBQUU7TUFDWixLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVaLE1BQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRWpDLE1BQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRTtBQUN6QyxRQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUMzQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksYUFBYSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFO0FBQzNFLFdBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsV0FBTztJQUNQO0FBQ0YsVUFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQ3RDLENBQUMsQ0FBQztBQUNILE1BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRTtBQUN2QyxRQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUMzQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLFlBQVksUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFO0FBQ3RFLFNBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsV0FBTztJQUNQO0FBQ0YsUUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0dBQy9CLENBQUMsQ0FBQzs7OztBQUlILE9BQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU5QixPQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMxQixPQUFJLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFDakMsT0FBTyxDQUFDLFlBQVksYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QyxPQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUM3QixPQUFPLENBQUMsQ0FBQzs7QUFFVixVQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0dBQzFFLENBQUMsQ0FBQzs7QUFFSCxPQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQzdCLE9BQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFCLENBQUMsQ0FBQztFQUNILENBQUE7O0FBRUQsY0FBYSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsWUFBWTtBQUNoRCxNQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3pCLE9BQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0dBQ25ELE1BQU07QUFDTixPQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUNuRDtFQUNELENBQUE7O0FBRUQsY0FBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxTQUFTLEVBQUU7QUFDckQsTUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDOztBQUU1QixNQUFJLFNBQVMsRUFBRTtBQUNkLE9BQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVk7QUFDeEMsUUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzFCLFFBQUksSUFBSSxJQUFJLElBQUksWUFBWSxhQUFhLEVBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQyxDQUFDO0dBQ0g7RUFDRCxDQUFBOztBQUVELGNBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsU0FBUyxFQUFFO0FBQ3ZELE1BQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzs7QUFFN0IsTUFBSSxTQUFTLEVBQUU7QUFDZCxPQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZO0FBQ3hDLFFBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMxQixRQUFJLElBQUksSUFBSSxJQUFJLFlBQVksYUFBYSxFQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQztHQUNIO0VBQ0QsQ0FBQTs7QUFFRCxjQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLFNBQVMsRUFBRTtBQUNyRCxNQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBRXpCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDeEIsQ0FBQTs7QUFFRCxjQUFhLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxZQUFZO0FBQzFDLE1BQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDakIsQ0FBQTs7QUFFRCxjQUFhLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxZQUFZO0FBQzdDLE1BQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDakIsQ0FBQTs7QUFFRCxRQUFPLGFBQWEsQ0FBQztDQUVyQixDQUFBLENBQUUsSUFBSSxDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL25hdmVyLy5hdG9tL3BhY2thZ2VzL3JlbW90ZS1mdHAvbGliL3ZpZXdzL2RpcmVjdG9yeS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuXHRfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcblx0JCA9IHJlcXVpcmUoJ2F0b20tc3BhY2UtcGVuLXZpZXdzJykuJCxcblx0RmlsZVZpZXcgPSByZXF1aXJlKCcuL2ZpbGUtdmlldycpLFxuXHRWaWV3ID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKS5WaWV3O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdG9yeVZpZXcgPSAoZnVuY3Rpb24gKHBhcmVudCkge1xuXG5cdF9fZXh0ZW5kcyhEaXJlY3RvcnlWaWV3LCBwYXJlbnQpO1xuXG5cdGZ1bmN0aW9uIERpcmVjdG9yeVZpZXcgKCkge1xuXHRcdERpcmVjdG9yeVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdH1cblxuXHREaXJlY3RvcnlWaWV3LmNvbnRlbnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMubGkoe1xuXHRcdFx0J2NsYXNzJzogJ2RpcmVjdG9yeSBlbnRyeSBsaXN0LW5lc3RlZC1pdGVtIGNvbGxhcHNlZCdcblx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLmRpdih7XG5cdFx0XHRcdCdjbGFzcyc6ICdoZWFkZXIgbGlzdC1pdGVtJyxcblx0XHRcdFx0J291dGxldCc6ICdoZWFkZXInXG5cdFx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnNwYW4oe1xuXHRcdFx0XHRcdCdjbGFzcyc6ICduYW1lIGljb24nLFxuXHRcdFx0XHRcdCdvdXRsZXQnOiAnbmFtZSdcblx0XHRcdFx0fSlcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0XHR0aGlzLm9sKHtcblx0XHRcdFx0J2NsYXNzJzogJ2VudHJpZXMgbGlzdC10cmVlJyxcblx0XHRcdFx0J291dGxldCc6ICdlbnRyaWVzJ1xuXHRcdFx0fSk7XG5cdFx0fS5iaW5kKHRoaXMpKTtcblx0fTtcblxuXHREaXJlY3RvcnlWaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKGRpcmVjdG9yeSkge1xuXHRcdC8vRGlyZWN0b3J5Vmlldy5fX3N1cGVyX18uaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0c2VsZi5pdGVtID0gZGlyZWN0b3J5O1xuXHRcdHNlbGYubmFtZS50ZXh0KHNlbGYuaXRlbS5uYW1lKTtcblx0XHRzZWxmLm5hbWUuYXR0cignZGF0YS1uYW1lJywgc2VsZi5pdGVtLm5hbWUpO1xuXHRcdHNlbGYubmFtZS5hdHRyKCdkYXRhLXBhdGgnLCBzZWxmLml0ZW0ucmVtb3RlKTtcblx0XHRzZWxmLm5hbWUuYWRkQ2xhc3Moc2VsZi5pdGVtLnR5cGUgJiYgc2VsZi5pdGVtLnR5cGUgPT0gJ2wnID8gJ2ljb24tZmlsZS1zeW1saW5rLWRpcmVjdG9yeScgOiAnaWNvbi1maWxlLWRpcmVjdG9yeScpXG5cblx0XHRpZiAoc2VsZi5pdGVtLmlzRXhwYW5kZWQgfHwgc2VsZi5pdGVtLmlzUm9vdClcblx0XHRcdHNlbGYuZXhwYW5kKCk7XG5cblx0XHRpZiAoc2VsZi5pdGVtLmlzUm9vdClcblx0XHRcdHNlbGYuYWRkQ2xhc3MoJ3Byb2plY3Qtcm9vdCcpO1xuXG5cdFx0Ly8gVHJpZ2dlciByZXBhaW50XG5cdFx0c2VsZi5pdGVtLiRmb2xkZXJzLm9uVmFsdWUoZnVuY3Rpb24gKCkgeyBzZWxmLnJlcGFpbnQoKTsgfSk7XG5cdFx0c2VsZi5pdGVtLiRmaWxlcy5vblZhbHVlKGZ1bmN0aW9uICgpIHsgc2VsZi5yZXBhaW50KCk7IH0pO1xuXHRcdHNlbGYuaXRlbS4kaXNFeHBhbmRlZC5vblZhbHVlKGZ1bmN0aW9uICgpIHsgc2VsZi5zZXRDbGFzc2VzKCk7IH0pO1xuXHRcdHNlbGYuaXRlbS5vbignZGVzdHJveWVkJywgZnVuY3Rpb24gKCkgeyBzZWxmLmRlc3Ryb3koKTsgfSk7XG5cdFx0c2VsZi5yZXBhaW50KCk7XG5cblx0XHQvLyBFdmVudHNcblx0XHRzZWxmLm9uKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0dmFyIHZpZXcgPSAkKHRoaXMpLnZpZXcoKSxcblx0XHRcdFx0YnV0dG9uID0gZS5vcmlnaW5hbEV2ZW50ID8gZS5vcmlnaW5hbEV2ZW50LmJ1dHRvbiA6IDA7XG5cblx0XHRcdGlmICghdmlldylcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRzd2l0Y2ggKGJ1dHRvbikge1xuXHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0aWYgKHZpZXcuaXMoJy5zZWxlY3RlZCcpKVxuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGlmICghZS5jdHJsS2V5KVxuXHRcdFx0XHRcdFx0JCgnLnJlbW90ZS1mdHAtdmlldyAuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcblx0XHRcdFx0XHR2aWV3LnRvZ2dsZUNsYXNzKCdzZWxlY3RlZCcpO1xuXG5cdFx0XHRcdFx0aWYgKGJ1dHRvbiA9PSAwKSB7XG5cdFx0XHRcdFx0XHRpZiAodmlldy5pdGVtLnN0YXR1cyA9PSAwKVxuXHRcdFx0XHRcdFx0XHR2aWV3Lm9wZW4oKTtcblxuXHRcdFx0XHRcdFx0aWYgKGJ1dHRvbiA9PSAwKVxuXHRcdFx0XHRcdFx0XHR2aWV3LnRvZ2dsZSgpO1xuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHR2aWV3LmV4cGFuZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0XHRzZWxmLm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHR2YXIgdmlldyA9ICQodGhpcykudmlldygpO1xuXHRcdFx0aWYgKCF2aWV3KVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdHZpZXcub3BlbigpO1xuXHRcdH0pO1xuXHR9XG5cblx0RGlyZWN0b3J5Vmlldy5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLml0ZW0gPSBudWxsO1xuXG5cdFx0dGhpcy5yZW1vdmUoKTtcblx0fVxuXG5cdERpcmVjdG9yeVZpZXcucHJvdG90eXBlLnJlcGFpbnQgPSBmdW5jdGlvbiAocmVjdXJzaXZlKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0dmlld3MgPSBzZWxmLmVudHJpZXMuY2hpbGRyZW4oKS5tYXAoZnVuY3Rpb24gKCkgeyByZXR1cm4gJCh0aGlzKS52aWV3KCk7IH0pLmdldCgpLFxuXHRcdFx0Zm9sZGVycyA9IFtdLFxuXHRcdFx0ZmlsZXMgPSBbXTtcblxuXHRcdHNlbGYuZW50cmllcy5jaGlsZHJlbigpLmRldGFjaCgpO1xuXG5cdFx0c2VsZi5pdGVtLmZvbGRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0Zm9yICh2YXIgYSA9IDAsIGIgPSB2aWV3cy5sZW5ndGg7IGEgPCBiOyArK2EpXG5cdFx0XHRcdGlmICh2aWV3c1thXSAmJiB2aWV3c1thXSBpbnN0YW5jZW9mIERpcmVjdG9yeVZpZXcgJiYgdmlld3NbYV0uaXRlbSA9PSBpdGVtKSB7XG5cdFx0XHRcdFx0Zm9sZGVycy5wdXNoKHZpZXdzW2FdKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdGZvbGRlcnMucHVzaChuZXcgRGlyZWN0b3J5VmlldyhpdGVtKSk7XG5cdFx0fSk7XG5cdFx0c2VsZi5pdGVtLmZpbGVzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdGZvciAodmFyIGEgPSAwLCBiID0gdmlld3MubGVuZ3RoOyBhIDwgYjsgKythKVxuXHRcdFx0XHRpZiAodmlld3NbYV0gJiYgdmlld3NbYV0gaW5zdGFuY2VvZiBGaWxlVmlldyAmJiB2aWV3c1thXS5pdGVtID09IGl0ZW0pIHtcblx0XHRcdFx0XHRmaWxlcy5wdXNoKHZpZXdzW2FdKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdGZpbGVzLnB1c2gobmV3IEZpbGVWaWV3KGl0ZW0pKTtcblx0XHR9KTtcblxuXHRcdC8vIFRPRE8gRGVzdHJveSBsZWZ0IG92ZXIuLi5cblxuXHRcdHZpZXdzID0gZm9sZGVycy5jb25jYXQoZmlsZXMpO1xuXG5cdFx0dmlld3Muc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0aWYgKGEuY29uc3RydWN0b3IgIT0gYi5jb25zdHJ1Y3Rvcilcblx0XHRcdFx0cmV0dXJuIGEgaW5zdGFuY2VvZiBEaXJlY3RvcnlWaWV3ID8gLTEgOiAxO1xuXHRcdFx0aWYgKGEuaXRlbS5uYW1lID09IGIuaXRlbS5uYW1lKVxuXHRcdFx0XHRyZXR1cm4gMDtcblxuXHRcdFx0cmV0dXJuIGEuaXRlbS5uYW1lLnRvTG93ZXJDYXNlKCkubG9jYWxlQ29tcGFyZShiLml0ZW0ubmFtZS50b0xvd2VyQ2FzZSgpKTtcblx0XHR9KTtcblxuXHRcdHZpZXdzLmZvckVhY2goZnVuY3Rpb24gKHZpZXcpIHtcblx0XHRcdHNlbGYuZW50cmllcy5hcHBlbmQodmlldyk7XG5cdFx0fSk7XG5cdH1cblxuXHREaXJlY3RvcnlWaWV3LnByb3RvdHlwZS5zZXRDbGFzc2VzID0gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLml0ZW0uaXNFeHBhbmRlZCkge1xuXHRcdFx0dGhpcy5hZGRDbGFzcygnZXhwYW5kZWQnKS5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuYWRkQ2xhc3MoJ2NvbGxhcHNlZCcpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpO1xuXHRcdH1cblx0fVxuXG5cdERpcmVjdG9yeVZpZXcucHJvdG90eXBlLmV4cGFuZCA9IGZ1bmN0aW9uIChyZWN1cnNpdmUpIHtcblx0XHR0aGlzLml0ZW0uaXNFeHBhbmRlZCA9IHRydWU7XG5cblx0XHRpZiAocmVjdXJzaXZlKSB7XG5cdFx0XHR0aGlzLmVudHJpZXMuY2hpbGRyZW4oKS5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIHZpZXcgPSAkKHRoaXMpLnZpZXcoKTtcblx0XHRcdFx0aWYgKHZpZXcgJiYgdmlldyBpbnN0YW5jZW9mIERpcmVjdG9yeVZpZXcpXG5cdFx0XHRcdFx0dmlldy5leHBhbmQodHJ1ZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHREaXJlY3RvcnlWaWV3LnByb3RvdHlwZS5jb2xsYXBzZSA9IGZ1bmN0aW9uIChyZWN1cnNpdmUpIHtcblx0XHR0aGlzLml0ZW0uaXNFeHBhbmRlZCA9IGZhbHNlO1xuXG5cdFx0aWYgKHJlY3Vyc2l2ZSkge1xuXHRcdFx0dGhpcy5lbnRyaWVzLmNoaWxkcmVuKCkuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciB2aWV3ID0gJCh0aGlzKS52aWV3KCk7XG5cdFx0XHRcdGlmICh2aWV3ICYmIHZpZXcgaW5zdGFuY2VvZiBEaXJlY3RvcnlWaWV3KVxuXHRcdFx0XHRcdHZpZXcuY29sbGFwc2UodHJ1ZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHREaXJlY3RvcnlWaWV3LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAocmVjdXJzaXZlKSB7XG5cdFx0aWYgKHRoaXMuaXRlbS5pc0V4cGFuZGVkKVxuXHRcdFx0dGhpcy5jb2xsYXBzZShyZWN1cnNpdmUpO1xuXHRcdGVsc2Vcblx0XHRcdHRoaXMuZXhwYW5kKHJlY3Vyc2l2ZSk7XG5cdH1cblxuXHREaXJlY3RvcnlWaWV3LnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuaXRlbS5vcGVuKCk7XG5cdH1cblxuXHREaXJlY3RvcnlWaWV3LnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuaXRlbS5vcGVuKCk7XG5cdH1cblxuXHRyZXR1cm4gRGlyZWN0b3J5VmlldztcblxufSkoVmlldyk7XG4iXX0=