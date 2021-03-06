var __hasProp = ({}).hasOwnProperty,
    __extends = function __extends(child, parent) {
	for (var key in parent) {
		if (__hasProp.call(parent, key)) child[key] = parent[key];
	}function ctor() {
		this.constructor = child;
	}ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
},
    $ = require('atom-space-pen-views').$,
    View = require('atom-space-pen-views').View;

module.exports = FileView = (function (parent) {

	__extends(FileView, parent);

	function FileView(file) {
		FileView.__super__.constructor.apply(this, arguments);
	}

	FileView.content = function () {
		return this.li({
			'class': 'file entry list-item'
		}, (function () {
			return this.span({
				'class': 'name icon',
				'outlet': 'name'
			});
		}).bind(this));
	};

	FileView.prototype.initialize = function (file) {
		//FileView.__super__.initialize.apply(this, arguments);

		var self = this;

		self.item = file;
		self.name.text(self.item.name);
		self.name.attr('data-name', self.item.name);
		self.name.attr('data-path', self.item.remote);

		switch (self.item.type) {
			case 'binary':
				self.name.addClass('icon-file-binary');break;
			case 'compressed':
				self.name.addClass('icon-file-zip');break;
			case 'image':
				self.name.addClass('icon-file-media');break;
			case 'pdf':
				self.name.addClass('icon-file-pdf');break;
			case 'readme':
				self.name.addClass('icon-book');break;
			case 'text':
				self.name.addClass('icon-file-text');break;
		}

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
			}
		});
		self.on('dblclick', function (e) {
			e.stopPropagation();

			var view = $(this).view();
			if (!view) return;

			view.open();
		});
	};

	FileView.prototype.destroy = function () {
		this.item = null;

		this.remove();
	};

	FileView.prototype.open = function () {
		this.item.open();
	};

	return FileView;
})(View);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9uYXZlci8uYXRvbS9wYWNrYWdlcy9yZW1vdGUtZnRwL2xpYi92aWV3cy9maWxlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxTQUFTLEdBQUcsQ0FBQSxHQUFFLENBQUMsY0FBYztJQUNoQyxTQUFTLEdBQUcsU0FBWixTQUFTLENBQVksS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUFFLE1BQUssSUFBSSxHQUFHLElBQUksTUFBTSxFQUFFO0FBQUUsTUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQUUsQUFBQyxTQUFTLElBQUksR0FBRztBQUFFLE1BQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0VBQUUsQUFBQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQUFBQyxLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsQUFBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQUFBQyxPQUFPLEtBQUssQ0FBQztDQUFFO0lBQy9SLENBQUMsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLElBQUksR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxJQUFJLENBQUM7O0FBRTdDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxHQUFHLENBQUMsVUFBVSxNQUFNLEVBQUU7O0FBRTlDLFVBQVMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRTVCLFVBQVMsUUFBUSxDQUFFLElBQUksRUFBRTtBQUN4QixVQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0VBQ3REOztBQUVELFNBQVEsQ0FBQyxPQUFPLEdBQUcsWUFBWTtBQUM5QixTQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDZCxVQUFPLEVBQUUsc0JBQXNCO0dBQy9CLEVBQUUsQ0FBQSxZQUFZO0FBQ2QsVUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2hCLFdBQU8sRUFBRSxXQUFXO0FBQ3BCLFlBQVEsRUFBRSxNQUFNO0lBQ2hCLENBQUMsQ0FBQztHQUNILENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztFQUNkLENBQUM7O0FBRUYsU0FBUSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxJQUFJLEVBQUU7OztBQUcvQyxNQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLE1BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLE1BQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsTUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsTUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTlDLFVBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO0FBQ3JCLFFBQUssUUFBUTtBQUFHLFFBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQUFBQyxNQUFNO0FBQUEsQUFDOUQsUUFBSyxZQUFZO0FBQUUsUUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQUFBQyxNQUFNO0FBQUEsQUFDOUQsUUFBSyxPQUFPO0FBQUcsUUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxBQUFDLE1BQU07QUFBQSxBQUM1RCxRQUFLLEtBQUs7QUFBSSxRQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxBQUFDLE1BQU07QUFBQSxBQUN6RCxRQUFLLFFBQVE7QUFBRyxRQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxBQUFDLE1BQU07QUFBQSxBQUN2RCxRQUFLLE1BQU07QUFBRyxRQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEFBQUMsTUFBTTtBQUFBLEdBQzFEOzs7QUFHRCxNQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsRUFBRTtBQUNqQyxJQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7O0FBRXBCLE9BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUU7T0FDeEIsTUFBTSxHQUFHLENBQUMsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUV2RCxPQUFJLENBQUMsSUFBSSxFQUNSLE9BQU87O0FBRVIsV0FBUSxNQUFNO0FBQ2IsU0FBSyxDQUFDO0FBQ0wsU0FBSSxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUN2QixPQUFPO0FBQUEsQUFDVDtBQUNDLFNBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUNiLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN6RCxTQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQUEsSUFDOUI7R0FDRCxDQUFDLENBQUM7QUFDSCxNQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRTtBQUNoQyxJQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7O0FBRXBCLE9BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMxQixPQUFJLENBQUMsSUFBSSxFQUNSLE9BQU87O0FBRVIsT0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ1osQ0FBQyxDQUFDO0VBQ0gsQ0FBQTs7QUFFRCxTQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxZQUFZO0FBQ3hDLE1BQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztBQUVqQixNQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7RUFDZCxDQUFBOztBQUVELFNBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFlBQVk7QUFDckMsTUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztFQUNqQixDQUFBOztBQUVELFFBQU8sUUFBUSxDQUFDO0NBRWhCLENBQUEsQ0FBRSxJQUFJLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbmF2ZXIvLmF0b20vcGFja2FnZXMvcmVtb3RlLWZ0cC9saWIvdmlld3MvZmlsZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuXHRfX2V4dGVuZHMgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKF9faGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcblx0JCA9IHJlcXVpcmUoJ2F0b20tc3BhY2UtcGVuLXZpZXdzJykuJCxcblx0VmlldyA9IHJlcXVpcmUoJ2F0b20tc3BhY2UtcGVuLXZpZXdzJykuVmlldztcblxubW9kdWxlLmV4cG9ydHMgPSBGaWxlVmlldyA9IChmdW5jdGlvbiAocGFyZW50KSB7XG5cblx0X19leHRlbmRzKEZpbGVWaWV3LCBwYXJlbnQpO1xuXG5cdGZ1bmN0aW9uIEZpbGVWaWV3IChmaWxlKSB7XG5cdFx0RmlsZVZpZXcuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdH1cblxuXHRGaWxlVmlldy5jb250ZW50ID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLmxpKHtcblx0XHRcdCdjbGFzcyc6ICdmaWxlIGVudHJ5IGxpc3QtaXRlbSdcblx0XHR9LCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5zcGFuKHtcblx0XHRcdFx0J2NsYXNzJzogJ25hbWUgaWNvbicsXG5cdFx0XHRcdCdvdXRsZXQnOiAnbmFtZSdcblx0XHRcdH0pO1xuXHRcdH0uYmluZCh0aGlzKSk7XG5cdH07XG5cblx0RmlsZVZpZXcucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoZmlsZSkge1xuXHRcdC8vRmlsZVZpZXcuX19zdXBlcl9fLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuXHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdHNlbGYuaXRlbSA9IGZpbGU7XG5cdFx0c2VsZi5uYW1lLnRleHQoc2VsZi5pdGVtLm5hbWUpO1xuXHRcdHNlbGYubmFtZS5hdHRyKCdkYXRhLW5hbWUnLCBzZWxmLml0ZW0ubmFtZSk7XG5cdFx0c2VsZi5uYW1lLmF0dHIoJ2RhdGEtcGF0aCcsIHNlbGYuaXRlbS5yZW1vdGUpO1xuXG5cdFx0c3dpdGNoIChzZWxmLml0ZW0udHlwZSkge1xuXHRcdFx0Y2FzZSAnYmluYXJ5JzpcdFx0c2VsZi5uYW1lLmFkZENsYXNzKCdpY29uLWZpbGUtYmluYXJ5Jyk7IGJyZWFrO1xuXHRcdFx0Y2FzZSAnY29tcHJlc3NlZCc6XHRzZWxmLm5hbWUuYWRkQ2xhc3MoJ2ljb24tZmlsZS16aXAnKTsgYnJlYWs7XG5cdFx0XHRjYXNlICdpbWFnZSc6XHRcdHNlbGYubmFtZS5hZGRDbGFzcygnaWNvbi1maWxlLW1lZGlhJyk7IGJyZWFrO1xuXHRcdFx0Y2FzZSAncGRmJzpcdFx0XHRzZWxmLm5hbWUuYWRkQ2xhc3MoJ2ljb24tZmlsZS1wZGYnKTsgYnJlYWs7XG5cdFx0XHRjYXNlICdyZWFkbWUnOlx0XHRzZWxmLm5hbWUuYWRkQ2xhc3MoJ2ljb24tYm9vaycpOyBicmVhaztcblx0XHRcdGNhc2UgJ3RleHQnOlx0XHRzZWxmLm5hbWUuYWRkQ2xhc3MoJ2ljb24tZmlsZS10ZXh0Jyk7IGJyZWFrO1xuXHRcdH1cblxuXHRcdC8vIEV2ZW50c1xuXHRcdHNlbGYub24oJ21vdXNlZG93bicsIGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHR2YXIgdmlldyA9ICQodGhpcykudmlldygpLFxuXHRcdFx0XHRidXR0b24gPSBlLm9yaWdpbmFsRXZlbnQgPyBlLm9yaWdpbmFsRXZlbnQuYnV0dG9uIDogMDtcblxuXHRcdFx0aWYgKCF2aWV3KVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdHN3aXRjaCAoYnV0dG9uKSB7XG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRpZiAodmlldy5pcygnLnNlbGVjdGVkJykpXG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0aWYgKCFlLmN0cmxLZXkpXG5cdFx0XHRcdFx0XHQkKCcucmVtb3RlLWZ0cC12aWV3IC5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuXHRcdFx0XHRcdHZpZXcudG9nZ2xlQ2xhc3MoJ3NlbGVjdGVkJyk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0c2VsZi5vbignZGJsY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0dmFyIHZpZXcgPSAkKHRoaXMpLnZpZXcoKTtcblx0XHRcdGlmICghdmlldylcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHR2aWV3Lm9wZW4oKTtcblx0XHR9KTtcblx0fVxuXG5cdEZpbGVWaWV3LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuaXRlbSA9IG51bGw7XG5cblx0XHR0aGlzLnJlbW92ZSgpO1xuXHR9XG5cblx0RmlsZVZpZXcucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5pdGVtLm9wZW4oKTtcblx0fVxuXG5cdHJldHVybiBGaWxlVmlldztcblxufSkoVmlldyk7XG4iXX0=