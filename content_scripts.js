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
		"NOTE_GRID_VIEW": "div#grid_view",
		"NOTE_SINGLE_VIEW": "div#single_view",
		"NOTE_EDIT_VIEW": "div#edit_view",
		"TOOLBAR_CREATE": "div#toolbar_new",
		"TOOLBAR_EDIT": "div#toolbar_edit",
		"TOOLBAR_DELETE": "div#toolbar_delete",
		"TOOLBAR_RESTORE": "div#toolbar_restore",
		"TOOLBAR_SAVE": "div#toolbar_buttons > div.Done",
		"EDITOR": "iframe#entinymce_585_ifr",
		"VIEW_LINKS": "div#view_buttons > div.a",
		"NOTEBOOKS": "table.Notebooks > tbody > tr"
	};
	_s.CLASS = {
		"SELECTED": "selected",
		"EKS_SELECTED": "eks-selected",
		"NOTE_SELECTED": "selected",
		"EKS_NOTE_SELECTED": "eks-note-selected"
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
					if (key.shift) {
						_s.next_book();
					} else {
						_s.next_item();
					}
	                                break;
	                        case "K":
					if (key.shift) {
						_s.prev_book();
					} else {
						_s.prev_item();
					}
	                                break;
                                case "U":
					_s.display_list_view();
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
		var bind_keyup = function(e){
                        var key = _s.keyinfo(e);
                        switch (key.keyCode) {
                                case _s.KEYCODE.ENTER:
                                        if (!_s._edit_view()) {
                                                _s.open_item();
                                        }
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
					if (key.shift) {
						if (_s._list_view()) {
							_s.open_book();
						}
					} else {
	                                        if (!_s._edit_view()) {
	                                                _s.open_item();
	                                        }
					}
                                        break;
                                default:
                                        break;
                        }
                };
	        $('body').bind('keyup', bind_keyup);
		var editor = $($(_s.SELECTOR.EDITOR).get(0).contentDocument.getElementById('tinymce'));
	        editor.bind('keyup', bind_keyup);
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
		var selected = _s._selected();
		if (selected) {
			$(_s.SELECTOR.NOTE_CHECKBOX, selected).trigger("click");
		}
	};
	_s.display_list_view = function() {
		console.log("display_list_view");
		if (!_s._single_view()) return;
		_s.click($(_s.SELECTOR.VIEW_LINKS+":eq(1) > img").get(0));
	};
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
	_s._grid_view = function() {
		return $(_s.SELECTOR.NOTE_GRID_VIEW).css("display")!="none";
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
			if (_s._single_view()) {
				$(_s.SELECTOR.NOTE_CHECKBOX, new_selected).trigger("click");
			}
		}
	}
	_s.next_item = function() {
		console.log("next_item");
		_s._nav_item_select(function(items,selected,index){
                        if (index+1<items.size()) {
                                return items.eq(index+1);
                        } else {
                                return items.last();
                        }
		});
	};
	_s.prev_item = function() {
		console.log("prev_item");
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
	_s._selected_book = function() {
		var selected = $(_s.SELECTOR.NOTEBOOKS+" > td."+_s.CLASS.EKS_NOTE_SELECTED);
		if (selected.size()==0) selected = $(_s.SELECTOR.NOTEBOOKS+" > td."+_s.CLASS.NOTE_SELECTED).last();
		return selected.parent('tr').eq(0);
	};
	_s._nav_book_select = function(callback) {
                var books = $(_s.SELECTOR.NOTEBOOKS);
                var selected = _s._selected_book();
                console.log("books.size="+books.size()+", selected.selector="+selected.selector);
                if (books.size()==0) return;

                console.log("books.first="+books.first());
		var new_selected = null;
                if (selected) {
                        selected.children('td').eq(0).removeClass(_s.CLASS.EKS_NOTE_SELECTED);

                        var index = books.index(selected);
                        console.log("selected.index="+index);
                        if (!(index>-1 && index<books.size())) {
                                new_selected = books.first();
                        } else {
				new_selected = callback(books,selected,index);
			}
                } else {
                        new_selected = books.first();
                }

		if (new_selected) {
			new_selected.children('td').eq(0).addClass(_s.CLASS.EKS_NOTE_SELECTED);
		}
	};
	_s.next_book = function() {
		console.log("next_book");
		_s._nav_book_select(function(books,selected,index){
                        if (index+1<books.size()) {
                                return books.eq(index+1);
                        } else {
                                return books.last();
                        }
		});
	};
	_s.prev_book = function() {
		console.log("prev_book");
		_s._nav_book_select(function(books,selected,index){
                        if (index-1>0) {
                                return books.eq(index-1);
                        } else {
                                return books.first();
                        }
		});
	};
	_s.open_book = function() {
		console.log("open_book");
		var selected = _s._selected_book();
		if (selected) {
			//_s.click(selected.find('div.Notebook').get(0));
			selected.click();
		}
	}
	_s.show_help = function() {
		console.log("show_help");
	};

	// bind shortcuts
	shortcuts.bind();
});
