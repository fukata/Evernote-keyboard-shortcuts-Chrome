$(function() {
	// shortcuts
	var shortcuts = {};
	var _s = shortcuts;
	_s.KEYCODE = {
		"ENTER": 13,
		"DELETE": 46
	};
	_s.SELECTOR = {
		"NOTE_LIST": "div#list_view > div > div > table > tbody > tr",
		"NOTE_CHECKBOX": "span.gwt-CheckBox > input[type=checkbox]",
		"NOTE_LIST_VIEW": "div#list_view",
		"NOTE_SINGLE_VIEW": "div#single_view",
		"NOTE_EDIT_VIEW": "div#edit_view",
		"TOOLBAR_CREATE": "div#toolbar_new",
		"TOOLBAR_EDIT": "div#toolbar_edit",
		"TOOLBAR_DELETE": "div#toolbar_delete",
		"TOOLBAR_RESTORE": "div#toolbar_restore",
		"TOOLBAR_SAVE": "div#toolbar_buttons > div.Done"
	};
	_s.CLASS = {
		"SELECTED": "selected",
		"EKS_SELECTED": "eks-selected"
	};
	_s.click = function(target) {
                var evt = document.createEvent( "MouseEvents" );
                evt.initEvent( "click", false, true );
                target.dispatchEvent( evt );
	}
	_s.keyinfo = function(e) {
                var key = {};
                key.shift = event.shiftKey;
                key.ctrl = e.ctrlKey;
                key.keyCode = e.which;
                key.keyChar = String.fromCharCode(key.keyCode).toUpperCase();
                console.log("keyCode="+key.keyCode+", keyChar="+key.keyChar+", shift="+key.shift+", ctrl="+key.ctrl);
                return key;
	};
	_s.bind = function() {
	        $('body').bind('keypress', function(e){
	                var key = _s.keyinfo(e);
	                switch (key.keyChar) {
	                        case "C":
					_s.create_item();
	                                break;
	                        case "E":
					_s.edit_item();
	                                break;
                                case "S":
					_s.sort();
                                        break;
	                        case "J":
					_s.nav_new_item();
	                                break;
	                        case "K":
					_s.nav_old_item();
	                                break;
                                case "X":
					_s.select_item();
                                        break;
                                case "/":
					_s.search();
                                        break;
				case ":":
					_s.search_notes();
					break;
                                case "?":
					_s.show_help();
                                        break;
	                        default:
	                                break;
	                }
	        });
	        $('body').bind('keyup', function(e){
	                var key = _s.keyinfo(e);
			switch (key.keyCode) {
				case _s.KEYCODE.ENTER:
					_s.open_item();
					break;
				case _s.KEYCODE.DELETE:
					if (key.shift) {
						if (_s._single_view() || _s._edit_view()) {
							_s.delete_item();
						} else if (_s._list_view()) {
							_s.delete_item();
						}
					}
					break;
				default:
					break;
			}
			switch (key.keyChar) {
				case "S":
					if (key.shift && key.ctrl) {
						_s.save_item();
					}
					break;
				case "O":
					_s.open_item();
					break;
				default:
					break;
			}
	        });
	};
	_s.create_item = function() {
		console.log("create_item");
		if (_s._edit_view()) return;
		_s.click($(_s.SELECTOR.TOOLBAR_CREATE).get(0)); 
	};
	_s.edit_item = function() {
		console.log("edit_item");
		if (!_s._single_view()) return;
		_s.click($(_s.SELECTOR.TOOLBAR_EDIT).get(0));
	};
	_s.open_item = function() {
		console.log("open_item");
		var selected = $(_s.SELECTOR.NOTE_LIST+"."+_s.CLASS.SELECTED);
		if (selected) {
			$(_s.SELECTOR.NOTE_CHECKBOX, selected).trigger("click");
		}
	}
	_s.delete_item = function() {
		console.log("delete_item");
		if (_s._edit_view()) return;
                _s.click($(_s.SELECTOR.TOOLBAR_DELETE).get(0));
	};
	_s.save_item = function() {
		console.log("save_item");
		if (!_s._edit_view()) return;
                _s.click($(_s.SELECTOR.TOOLBAR_SAVE).get(0));
	};
	_s._list_view = function() {
		return $(_s.SELECTOR.NOTE_LIST_VIEW).css("display")!="none";
	};
	_s._single_view = function() {
		return $(_s.SELECTOR.NOTE_SINGLE_VIEW).css("display")!="none";
	};
	_s._edit_view = function() {
		return $(_s.SELECTOR.NOTE_EDIT_VIEW).css("display")!="none";
	}
	_s._nav_item_select = function(callback) {
                var items = $(_s.SELECTOR.NOTE_LIST);
                var selected = _s._selected();
                console.log("items.size="+items.size()+", selected.selector="+selected.selector);
                if (items.size()==0) return;

                console.log("items.first="+items.first());
		var new_selected = null;
                if (selected) {
                        selected.removeClass(_s.CLASS.EKS_SELECTED);
			//$(_s.SELECTOR.NOTE_CHECKBOX, selected).attr("checked", false);

                        var index = items.index(selected);
                        console.log("selected.index="+index);
                        if (!(index>-1 && index<items.size())) {
                                new_selected = items.first();
                        } else {
				new_selected = callback(items,selected,index);
			}
                } else {
                        new_selected = items.first();
                }

		if (new_selected) {
			new_selected.addClass(_s.CLASS.EKS_SELECTED);
			//$(_s.SELECTOR.NOTE_CHECKBOX, new_selected).attr("checked", true);
			if (_s._single_view()) {
				$(_s.SELECTOR.NOTE_CHECKBOX, new_selected).trigger("click");
			}
			//$(_s.SELECTOR.NOTE_CHECKBOX, new_selected).trigger("change");
		}
	}
	_s.nav_new_item = function() {
		console.log("nav_new_item");
		_s._nav_item_select(function(items,selected,index){
                        if (index+1<items.size()) {
                                return items.eq(index+1);
                        } else {
                                return items.last();
                        }
		});
	};
	_s.nav_old_item = function() {
		console.log("nav_old_item");
                _s._nav_item_select(function(items,selected,index){
                        if (index-1>0) {
                                return items.eq(index-1);
                        } else {
                                return items.first();
                        }
                });
	};
	_s._selected = function() {
		var selected = $(_s.SELECTOR.NOTE_LIST+"."+_s.CLASS.EKS_SELECTED);
		if (selected.size()==0) selected = $(_s.SELECTOR.NOTE_LIST+"."+_s.CLASS.SELECTED).last();
		return selected;
	}
	_s.select_item = function() {
		console.log("select_item");
		var selected = _s._selected();
		if (selected) {
			_s.click($(_s.SELECTOR.NOTE_CHECKBOX, selected).get(0));
		}
	};
	_s.sort = function() {
		console.log("sort");
	};
	_s.search = function() {
		console.log("search");
	};
	_s.search_notes = function() {
		console.log("search_notes");
	};
	_s.show_help = function() {
		console.log("show_help");
	};

	// bind shortcuts
	shortcuts.bind();
});
