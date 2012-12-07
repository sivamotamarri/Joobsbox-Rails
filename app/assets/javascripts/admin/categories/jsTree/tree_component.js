/*
 * jsTree 0.9.7
 * http://jstree.com/
 *
 * Copyright (c) 2009 Ivan Bozhanov (vakata.com)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: 2009-04-08
 *
 */
 (function($) {
    $.fn.tree = function(opts) {
        return this.each(function() {
            var conf = $.extend({}, opts);
            if (tree_component.inst && tree_component.inst[$(this).attr('id')])
                tree_component.inst[$(this).attr('id')].destroy();
            if (conf !== false)
                new tree_component().init(this, conf)
            })
        };
    $.tree_create = function() {
        return new tree_component()
        };
    $.tree_focused = function() {
        return tree_component.inst[tree_component.focused]
        };
    $.tree_reference = function(id) {
        return tree_component.inst[id] || null
    };
    $.tree_rollback = function(data) {
        for (var i in data) {
            var tmp = tree_component.inst[i];
            var lock = !tmp.locked;
            if (lock)
                tmp.lock(true);
            if (tmp.inp)
                tmp.inp.val("").blur();
            tmp.context.append = false;
            tmp.container.html(data[i].html).find(".dragged").removeClass("dragged").end().find("div.context").remove();
            if (data[i].selected) {
                tmp.selected = $("#" + data[i].selected);
                tmp.selected_arr = [];
                tmp.container.find("a.clicked").each(function() {
                    tmp.selected_arr.push(tmp.get_node(this))
                    })
                }
            if (lock)
                tmp.lock(false);
            delete lock;
            delete tmp
        }
    };
    function tree_component() {
        if (typeof tree_component.inst == "undefined") {
            tree_component.cntr = 0;
            tree_component.inst = {};
            tree_component.drag_drop = {
                isdown: false,
                drag_node: false,
                drag_help: false,
                init_x: false,
                init_y: false,
                moving: false,
                origin_tree: false,
                marker: false,
                move_type: false,
                ref_node: false,
                appended: false,
                foreign: false,
                droppable: [],
                open_time: false,
                scroll_time: false
            };
            tree_component.mousedown = function(event) {
                var tmp = $(event.target);
                if (tree_component.drag_drop.droppable.length && tmp.is("." + tree_component.drag_drop.droppable.join(", ."))) {
                    tree_component.drag_drop.drag_help = $("<li id='dragged' class='dragged foreign " + event.target.className + "'><a href='#'>" + tmp.text() + "</a></li>");
                    tree_component.drag_drop.drag_node = tree_component.drag_drop.drag_help;
                    tree_component.drag_drop.isdown = true;
                    tree_component.drag_drop.foreign = tmp;
                    tmp.blur();
                    event.preventDefault();
                    event.stopPropagation();
                    return false
                }
                event.stopPropagation();
                return true
            };
            tree_component.mouseup = function(event) {
                var tmp = tree_component.drag_drop;
                if (tmp.open_time)
                    clearTimeout(tmp.open_time);
                if (tmp.scroll_time)
                    clearTimeout(tmp.scroll_time);
                if (tmp.foreign === false && tmp.drag_node && tmp.drag_node.size()) {
                    tmp.drag_help.remove();
                    if (tmp.move_type) {
                        var tree1 = tree_component.inst[tmp.ref_node.parents(".tree:eq(0)").attr("id")];
                        if (tree1)
                            tree1.moved(tmp.origin_tree.container.find("li.dragged"), tmp.ref_node, tmp.move_type, false, (tmp.origin_tree.settings.rules.drag_copy == "on" || (tmp.origin_tree.settings.rules.drag_copy == "ctrl" && event.ctrlKey)))
                        }
                    tmp.move_type = false;
                    tmp.ref_node = false
                }
                if (tmp.drag_node && tmp.foreign !== false) {
                    tmp.drag_help.remove();
                    if (tmp.move_type) {
                        var tree1 = tree_component.inst[tmp.ref_node.parents(".tree:eq(0)").attr("id")];
                        if (tree1)
                            tree1.settings.callback.ondrop.call(null, tmp.foreign.get(0), tree1.get_node(tmp.ref_node).get(0), tmp.move_type, tree1)
                        }
                    tmp.foreign = false;
                    tmp.move_type = false;
                    tmp.ref_node = false
                }
                tree_component.drag_drop.marker.hide();
                tmp.drag_help = false;
                tmp.drag_node = false;
                tmp.isdown = false;
                tmp.init_x = false;
                tmp.init_y = false;
                tmp.moving = false;
                tmp.appended = false;
                if (tmp.origin_tree)
                    tmp.origin_tree.container.find("li.dragged").removeClass("dragged");
                tmp.origin_tree = false;
                event.preventDefault();
                event.stopPropagation();
                return false
            };
            tree_component.mousemove = function(event) {
                var tmp = tree_component.drag_drop;
                if (tmp.isdown) {
                    if (!tmp.moving && Math.abs(tmp.init_x - event.pageX) < 5 && Math.abs(tmp.init_y - event.pageY) < 5) {
                        event.preventDefault();
                        event.stopPropagation();
                        return false
                    } else
                        tree_component.drag_drop.moving = true;
                    if (tmp.open_time)
                        clearTimeout(tmp.open_time);
                    if (!tmp.appended) {
                        if (tmp.foreign !== false)
                            tmp.origin_tree = $.tree_focused();
                        tmp.origin_tree.container.children("ul:eq(0)").append(tmp.drag_help);
                        var temp = $(tmp.drag_help).offsetParent();
                        if (temp.is("html"))
                            temp = $("body");
                        tmp.po = temp.offset();
                        tmp.po.top -= (temp.is("body")) ? 0: temp.scrollTop();
                        tmp.po.left -= (temp.is("body")) ? 0: temp.scrollLeft();
                        tmp.w = tmp.drag_help.width();
                        tmp.appended = true
                    }
                    tmp.drag_help.css({
                        "left": (event.pageX - tmp.po.left - (tmp.origin_tree.settings.ui.rtl ? tmp.w: -5)),
                        "top": (event.pageY - tmp.po.top + 15)
                        });
                    if (event.target.tagName == "IMG" && event.target.id == "marker")
                        return false;
                    var cnt = $(event.target).parents(".tree:eq(0)");
                    if (cnt.size() == 0) {
                        if (tmp.scroll_time)
                            clearTimeout(tmp.scroll_time);
                        if (tmp.drag_help.children("IMG").size() == 0) {
                            tmp.drag_help.append("<img style='position:absolute; " + (tmp.origin_tree.settings.ui.rtl ? "right": "left") + ":4px; top:0px; background:white; padding:2px;' src='" + tmp.origin_tree.settings.ui.theme_path + "remove.png' />")
                            }
                        tmp.move_type = false;
                        tmp.ref_node = false;
                        tree_component.drag_drop.marker.hide();
                        return false
                    }
                    var tree2 = tree_component.inst[cnt.attr("id")];
                    tree2.off_height();
                    if (tmp.foreign === false && tmp.origin_tree.container.get(0) != tree2.container.get(0) && (!tmp.origin_tree.settings.rules.multitree || !tree2.settings.rules.multitree)) {
                        if (tmp.drag_help.children("IMG").size() == 0) {
                            tmp.drag_help.append("<img style='position:absolute; " + (tmp.origin_tree.settings.ui.rtl ? "right": "left") + ":4px; top:0px; background:white; padding:2px;' src='" + tmp.origin_tree.settings.ui.theme_path + "remove.png' />")
                            }
                        tmp.move_type = false;
                        tmp.ref_node = false;
                        tree_component.drag_drop.marker.hide();
                        return false
                    }
                    if (tmp.scroll_time)
                        clearTimeout(tmp.scroll_time);
                    tmp.scroll_time = setTimeout(function() {
                        tree2.scrollCheck(event.pageX, event.pageY)
                        }, 50);
                    var mov = false;
                    var st = cnt.scrollTop();
                    var et = $(event.target);
                    if (event.target.tagName == "A") {
                        if (et.is("#dragged"))
                            return false;
                        if (tree2.get_node(event.target).hasClass("closed")) {
                            tmp.open_time = setTimeout(function() {
                                tree2.open_branch(et)
                                }, 500)
                            }
                        var atmp = 0;
                        var btmp = parseInt($.curCSS(tree2.container.get(0), "borderTopWidth", true), 10);
                        if (btmp)
                            atmp += btmp;
                        var ptmp = parseInt($.curCSS(tree2.container.get(0), "paddingTop", true), 10);
                        if (ptmp)
                            atmp += ptmp;
                        var et_off = et.offset();
                        var goTo = {
                            x: (et_off.left - 1),
                            y: (event.pageY - et_off.top)
                            };
                        if (cnt.hasClass("rtl"))
                            goTo.x += et.width() - 8;
                        var arr = [];
                        if (goTo.y < tree2.li_height / 3 + 1)
                            arr = ["before", "inside", "after"];
                        else if (goTo.y > tree2.li_height * 2 / 3 - 1)
                            arr = ["after", "inside", "before"];
                        else {
                            if (goTo.y < tree2.li_height / 2)
                                arr = ["inside", "before", "after"];
                            else
                                arr = ["inside", "after", "before"]
                            }
                        var ok = false;
                        $.each(arr, function(i, val) {
                            if (tree2.checkMove(tmp.origin_tree.container.find("li.dragged"), et, val)) {
                                mov = val;
                                ok = true;
                                return false
                            }
                        });
                        if (ok) {
                            switch (mov) {
                            case "before":
                                goTo.y = et_off.top - 2;
                                if (cnt.hasClass("rtl")) {
                                    tree_component.drag_drop.marker.attr("src", tree2.settings.ui.theme_path + "marker_rtl.gif").width(40)
                                    } else {
                                    tree_component.drag_drop.marker.attr("src", tree2.settings.ui.theme_path + "marker.gif").width(40)
                                    }
                                break;
                            case "after":
                                goTo.y = et_off.top - 2 + tree2.li_height;
                                if (cnt.hasClass("rtl")) {
                                    tree_component.drag_drop.marker.attr("src", tree2.settings.ui.theme_path + "marker_rtl.gif").width(40)
                                    } else {
                                    tree_component.drag_drop.marker.attr("src", tree2.settings.ui.theme_path + "marker.gif").width(40)
                                    }
                                break;
                            case "inside":
                                goTo.x -= 2;
                                if (cnt.hasClass("rtl")) {
                                    goTo.x += 36
                                }
                                goTo.y = et_off.top - 2 + tree2.li_height / 2;
                                tree_component.drag_drop.marker.attr("src", tree2.settings.ui.theme_path + "plus.gif").width(11);
                                break
                            }
                            tmp.move_type = mov;
                            tmp.ref_node = $(event.target);
                            tmp.drag_help.children("IMG").remove();
                            tree_component.drag_drop.marker.css({
                                "left": goTo.x,
                                "top": goTo.y
                            }).show()
                            }
                    }
                    if (event.target.tagName != "A" || !ok) {
                        if (tmp.drag_help.children("IMG").size() == 0) {
                            tmp.drag_help.append("<img style='position:absolute; " + (tmp.origin_tree.settings.ui.rtl ? "right": "left") + ":4px; top:0px; background:white; padding:2px;' src='" + tmp.origin_tree.settings.ui.theme_path + "remove.png' />")
                            }
                        tmp.move_type = false;
                        tmp.ref_node = false;
                        tree_component.drag_drop.marker.hide()
                        }
                    event.preventDefault();
                    event.stopPropagation();
                    return false
                }
                return true
            }
        };
        return {
            cntr: ++tree_component.cntr,
            settings: {
                data: {
                    type: "predefined",
                    method: "GET",
                    async: false,
                    async_data: function(NODE) {
                        return {
                            id: $(NODE).attr("id") || 0
                        }
                    },
                    url: false,
                    json: false,
                    xml: false
                },
                selected: false,
                opened: [],
                languages: [],
                path: false,
                cookies: false,
                ui: {
                    dots: true,
                    rtl: false,
                    animation: 0,
                    hover_mode: true,
                    scroll_spd: 4,
                    theme_path: false,
                    theme_name: "default",
                    context: [{
                        id: "create",
                        label: "Create",
                        icon: "create.png",
                        visible: function(NODE, TREE_OBJ) {
                            if (NODE.length != 1)
                                return false;
                            return TREE_OBJ.check("creatable", NODE)
                            },
                        action: function(NODE, TREE_OBJ) {
                            TREE_OBJ.create(false, TREE_OBJ.get_node(NODE))
                            }
                    }, "separator", {
                        id: "rename",
                        label: "Rename",
                        icon: "rename.png",
                        visible: function(NODE, TREE_OBJ) {
                            if (NODE.length != 1)
                                return false;
                            return TREE_OBJ.check("renameable", NODE)
                            },
                        action: function(NODE, TREE_OBJ) {
                            TREE_OBJ.rename(NODE)
                            }
                    }, {
                        id: "delete",
                        label: "Delete",
                        icon: "remove.png",
                        visible: function(NODE, TREE_OBJ) {
                            var ok = true;
                            $.each(NODE, function() {
                                if (TREE_OBJ.check("deletable", this) == false)
                                    ok = false;
                                return false
                            });
                            return ok
                        },
                        action: function(NODE, TREE_OBJ) {
                            $.each(NODE, function() {
                                TREE_OBJ.remove(this)
                                })
                            }
                    }]
                    },
                rules: {
                    multiple: false,
                    metadata: false,
                    type_attr: "rel",
                    multitree: false,
                    createat: "bottom",
                    use_inline: false,
                    clickable: "all",
                    renameable: "all",
                    deletable: "all",
                    creatable: "all",
                    draggable: "none",
                    dragrules: "all",
                    drag_copy: false,
                    droppable: [],
                    drag_button: "left"
                },
                lang: {
                    new_node: "New folder",
                    loading: "Loading ..."
                },
                callback: {
                    beforechange: function(NODE, TREE_OBJ) {
                        return true
                    },
                    beforeopen: function(NODE, TREE_OBJ) {
                        return true
                    },
                    beforeclose: function(NODE, TREE_OBJ) {
                        return true
                    },
                    beforemove: function(NODE, REF_NODE, TYPE, TREE_OBJ) {
                        return true
                    },
                    beforecreate: function(NODE, REF_NODE, TYPE, TREE_OBJ) {
                        return true
                    },
                    beforerename: function(NODE, LANG, TREE_OBJ) {
                        return true
                    },
                    beforedelete: function(NODE, TREE_OBJ) {
                        return true
                    },
                    onselect: function(NODE, TREE_OBJ) {},
                    ondeselect: function(NODE, TREE_OBJ) {},
                    onchange: function(NODE, TREE_OBJ) {},
                    onrename: function(NODE, LANG, TREE_OBJ, RB) {},
                    onmove: function(NODE, REF_NODE, TYPE, TREE_OBJ, RB) {},
                    oncopy: function(NODE, REF_NODE, TYPE, TREE_OBJ, RB) {},
                    oncreate: function(NODE, REF_NODE, TYPE, TREE_OBJ, RB) {},
                    ondelete: function(NODE, TREE_OBJ, RB) {},
                    onopen: function(NODE, TREE_OBJ) {},
                    onopen_all: function(TREE_OBJ) {},
                    onclose: function(NODE, TREE_OBJ) {},
                    error: function(TEXT, TREE_OBJ) {},
                    ondblclk: function(NODE, TREE_OBJ) {
                        TREE_OBJ.toggle_branch.call(TREE_OBJ, NODE);
                        TREE_OBJ.select_branch.call(TREE_OBJ, NODE)
                        },
                    onrgtclk: function(NODE, TREE_OBJ, EV) {},
                    onload: function(TREE_OBJ) {},
                    onfocus: function(TREE_OBJ) {},
                    ondrop: function(NODE, REF_NODE, TYPE, TREE_OBJ) {}
                }
            },
            init: function(elem, opts) {
                var _this = this;
                this.container = $(elem);
                if (this.container.size == 0) {
                    alert("Invalid container node!");
                    return
                }
                tree_component.inst[this.cntr] = this;
                if (!this.container.attr("id"))
                    this.container.attr("id", "jstree_" + this.cntr);
                tree_component.inst[this.container.attr("id")] = tree_component.inst[this.cntr];
                tree_component.focused = this.cntr;
                if (opts && opts.cookies) {
                    this.settings.cookies = $.extend({}, this.settings.cookies, opts.cookies);
                    delete opts.cookies;
                    if (!this.settings.cookies.opts)
                        this.settings.cookies.opts = {}
                }
                if (opts && opts.callback) {
                    this.settings.callback = $.extend({}, this.settings.callback, opts.callback);
                    delete opts.callback
                }
                if (opts && opts.data) {
                    this.settings.data = $.extend({}, this.settings.data, opts.data);
                    delete opts.data
                }
                if (opts && opts.ui) {
                    this.settings.ui = $.extend({}, this.settings.ui, opts.ui);
                    delete opts.ui
                }
                if (opts && opts.rules) {
                    this.settings.rules = $.extend({}, this.settings.rules, opts.rules);
                    delete opts.rules
                }
                if (opts && opts.lang) {
                    this.settings.lang = $.extend({}, this.settings.lang, opts.lang);
                    delete opts.lang
                }
                this.settings = $.extend({}, this.settings, opts);
                if (this.settings.path == false) {
                    this.path = "";
                    $("script").each(function() {
                        if (this.src.toString().match(/tree_component.*?js$/)) {
                            _this.path = this.src.toString().replace(/tree_component.*?js$/, "")
                            }
                    })
                    } else
                    this.path = this.settings.path;
                this.current_lang = this.settings.languages && this.settings.languages.length ? this.settings.languages[0] : false;
                if (this.settings.languages && this.settings.languages.length) {
                    this.sn = get_sheet_num("tree_component.css");
                    if (this.sn === false && document.styleSheets.length)
                        this.sn = document.styleSheets.length;
                    var st = false;
                    var id = this.container.attr("id") ? "#" + this.container.attr("id") : ".tree";
                    for (var ln = 0; ln < this.settings.languages.length; ln++) {
                        st = add_css(id + " ." + this.settings.languages[ln], this.sn);
                        if (st !== false) {
                            if (this.settings.languages[ln] == this.current_lang)
                                st.style.display = "";
                            else
                                st.style.display = "none"
                        }
                    }
                }
                if (this.settings.rules.droppable.length) {
                    for (var i in this.settings.rules.droppable) {
                        tree_component.drag_drop.droppable.push(this.settings.rules.droppable[i])
                        }
                    tree_component.drag_drop.droppable = $.unique(tree_component.drag_drop.droppable)
                    }
                if (this.settings.ui.theme_path === false)
                    this.settings.ui.theme_path = this.path + "/assets/admin/categories/jsTree/themes/";
                this.theme = this.settings.ui.theme_path;
                if (_this.settings.ui.theme_name) {
                    this.theme += _this.settings.ui.theme_name + "/";
                    if (_this.settings.ui.theme_name != "themeroller" && !tree_component.def_style) {
                        add_sheet(_this.settings.ui.theme_path + "default/style.css");
                        tree_component.def_style = true
                    }
                    add_sheet(_this.theme + "style.css")
                    }
                this.container.addClass("tree");
                if (this.settings.ui.theme_name == "themeroller")
                    this.container.addClass("ui-widget ui-widget-content");
                if (this.settings.ui.rtl)
                    this.container.addClass("rtl");
                if (this.settings.rules.multiple)
                    this.selected_arr = [];
                this.offset = false;
                if (this.settings.ui.dots == false)
                    this.container.addClass("no_dots");
                this.context_menu();
                this.hovered = false;
                this.locked = false;
                if (this.settings.rules.draggable != "none" && tree_component.drag_drop.marker === false) {
                    var _this = this;
                    tree_component.drag_drop.marker = $("<img>").attr({
                        id: "marker",
                        src: _this.settings.ui.theme_path + "marker.gif"
                    }).css({
                        height: "5px",
                        width: "40px",
                        display: "block",
                        position: "absolute",
                        left: "30px",
                        top: "30px",
                        zIndex: "1000"
                    }).hide().appendTo("body")
                    }
                this.refresh();
                this.attachEvents();
                this.focus()
                },
            off_height: function() {
                if (this.offset === false) {
                    this.container.css({
                        position: "relative"
                    });
                    this.offset = this.container.offset();
                    var tmp = 0;
                    tmp = parseInt($.curCSS(this.container.get(0), "paddingTop", true), 10);
                    if (tmp)
                        this.offset.top += tmp;
                    tmp = parseInt($.curCSS(this.container.get(0), "borderTopWidth", true), 10);
                    if (tmp)
                        this.offset.top += tmp;
                    this.container.css({
                        position: ""
                    })
                    }
                if (!this.li_height) {
                    var tmp = this.container.find("ul li.closed, ul li.leaf").eq(0);
                    this.li_height = tmp.height();
                    if (tmp.children("ul:eq(0)").size())
                        this.li_height -= tmp.children("ul:eq(0)").height();
                    if (!this.li_height)
                        this.li_height = 18
                }
            },
            context_menu: function() {
                this.context = false;
                if (this.settings.ui.context != false) {
                    var str = '<div class="tree-default-context tree-' + this.settings.ui.theme_name + '-context">';
                    for (var i in this.settings.ui.context) {
                        if (this.settings.ui.context[i] == "separator") {
                            str += "<span class='separator'>&nbsp;</span>";
                            continue
                        }
                        var icn = "";
                        if (this.settings.ui.context[i].icon)
                            icn = 'background-image:url(\'' + (this.settings.ui.context[i].icon.indexOf("/") == -1 ? this.theme + this.settings.ui.context[i].icon: this.settings.ui.context[i].icon) + '\');';
                        str += '<a rel="' + this.settings.ui.context[i].id + '" href="#" style="' + icn + '">' + this.settings.ui.context[i].label + '</a>'
                    }
                    str += '</div>';
                    this.context = $(str);
                    this.context.hide();
                    this.context.append = false
                }
            },
            refresh: function(obj) {
                if (this.locked)
                    return this.error("LOCKED");
                var _this = this;
                this.opened = Array();
                if (this.settings.cookies && $.cookie(this.settings.cookies.prefix + '_open')) {
                    var str = $.cookie(this.settings.cookies.prefix + '_open');
                    var tmp = str.split(",");
                    $.each(tmp, function() {
                        _this.opened.push("#" + this.replace(/^#/, ""))
                        });
                    this.settings.opened = false
                } else if (this.settings.opened != false) {
                    $.each(this.settings.opened, function(i, item) {
                        _this.opened.push("#" + this.replace(/^#/, ""))
                        });
                    this.settings.opened = false
                } else {
                    this.container.find("li.open").each(function(i) {
                        _this.opened.push("#" + this.id)
                        })
                    }
                if (this.selected) {
                    this.settings.selected = Array();
                    if (this.selected_arr) {
                        $.each(this.selected_arr, function() {
                            if (this.attr("id"))
                                _this.settings.selected.push("#" + this.attr("id"))
                            })
                        } else {
                        if (this.selected.attr("id"))
                            this.settings.selected.push("#" + this.selected.attr("id"))
                        }
                } else if (this.settings.cookies && $.cookie(this.settings.cookies.prefix + '_selected')) {
                    this.settings.selected = Array();
                    var str = $.cookie(this.settings.cookies.prefix + '_selected');
                    var tmp = str.split(",");
                    $.each(tmp, function() {
                        _this.settings.selected.push("#" + this.replace(/^#/, ""))
                        })
                    } else if (this.settings.selected !== false) {
                    var tmp = Array();
                    if ((typeof this.settings.selected).toLowerCase() == "object") {
                        $.each(this.settings.selected, function() {
                            if (this.replace(/^#/, "").length > 0)
                                tmp.push("#" + this.replace(/^#/, ""))
                            })
                        } else {
                        if (this.settings.selected.replace(/^#/, "").length > 0)
                            tmp.push("#" + this.settings.selected.replace(/^#/, ""))
                        }
                    this.settings.selected = tmp
                }
                if (obj && this.settings.data.async) {
                    this.opened = Array();
                    obj = this.get_node(obj);
                    obj.find("li.open").each(function(i) {
                        _this.opened.push("#" + this.id)
                        });
                    if (obj.hasClass("open"))
                        this.close_branch(obj, true);
                    if (obj.hasClass("leaf"))
                        obj.removeClass("leaf");
                    obj.children("ul:eq(0)").html("");
                    return this.open_branch(obj, true, function() {
                        _this.reselect.apply(_this)
                        })
                    }
                var cls = "tree-default";
                if (this.settings.ui.theme_name != "default")
                    cls += " tree-" + _this.settings.ui.theme_name;
                if (this.settings.ui.theme_name == "themeroller")
                    cls = "tree-themeroller";
                if (this.settings.data.type == "xml_flat" || this.settings.data.type == "xml_nested") {
                    this.scrtop = this.container.get(0).scrollTop;
                    var xsl = (this.settings.data.type == "xml_flat") ? "flat.xsl": "nested.xsl";
                    if (this.settings.data.xml)
                        this.container.getTransform(this.path + xsl, this.settings.data.xml, {
                        params: {
                            theme_name: cls,
                            theme_path: _this.theme
                        },
                        meth: _this.settings.data.method,
                        dat: _this.settings.data.async_data.apply(_this, [obj]),
                        callback: function() {
                            _this.context_menu.apply(_this);
                            _this.reselect.apply(_this)
                            }
                    });
                    else
                        this.container.getTransform(this.path + xsl, this.settings.data.url, {
                        params: {
                            theme_name: cls,
                            theme_path: _this.theme
                        },
                        meth: _this.settings.data.method,
                        dat: _this.settings.data.async_data.apply(_this, [obj]),
                        callback: function() {
                            _this.context_menu.apply(_this);
                            _this.reselect.apply(_this)
                            }
                    });
                    return
                } else if (this.settings.data.type == "json") {
                    if (this.settings.data.json) {
                        var str = "";
                        if (this.settings.data.json.length) {
                            for (var i = 0; i < this.settings.data.json.length; i++) {
                                str += this.parseJSON(this.settings.data.json[i])
                                }
                        } else
                            str = this.parseJSON(this.settings.data.json);
                        this.container.html("<ul class='" + cls + "'>" + str + "</ul>");
                        this.container.find("li:last-child").addClass("last").end().find("li:has(ul)").not(".open").addClass("closed");
                        this.container.find("li").not(".open").not(".closed").addClass("leaf");
                        this.context_menu();
                        this.reselect()
                        } else {
                        var _this = this;
                        $.ajax({
                            type: this.settings.data.method,
                            url: this.settings.data.url,
                            data: this.settings.data.async_data(false),
                            dataType: "json",
                            success: function(data) {
                                var str = "";
                                if (data.length) {
                                    for (var i = 0; i < data.length; i++) {
                                        str += _this.parseJSON(data[i])
                                        }
                                } else
                                    str = _this.parseJSON(data);
                                _this.container.html("<ul class='" + cls + "'>" + str + "</ul>");
                                _this.container.find("li:last-child").addClass("last").end().find("li:has(ul)").not(".open").addClass("closed");
                                _this.container.find("li").not(".open").not(".closed").addClass("leaf");
                                _this.context_menu.apply(_this);
                                _this.reselect.apply(_this)
                                },
                            error: function(xhttp, textStatus, errorThrown) {
                                _this.error(errorThrown + " " + textStatus)
                                }
                        })
                        }
                } else {
                    this.container.children("ul:eq(0)").attr("class", cls);
                    this.container.find("li:last-child").addClass("last").end().find("li:has(ul)").not(".open").addClass("closed");
                    this.container.find("li").not(".open").not(".closed").addClass("leaf");
                    this.reselect()
                    }
            },
            parseJSON: function(data) {
                if (!data || !data.data)
                    return "";
                var str = "";
                str += "<li ";
                var cls = false;
                if (data.attributes) {
                    for (var i in data.attributes) {
                        if (i == "class") {
                            str += " class='" + data.attributes[i] + " ";
                            if (data.state == "closed" || data.state == "open")
                                str += " " + data.state + " ";
                            str += "' ";
                            cls = true
                        } else
                            str += " " + i + "='" + data.attributes[i] + "' "
                    }
                }
                if (!cls && (data.state == "closed" || data.state == "open"))
                    str += " class='" + data.state + "' ";
                str += ">";
                if (this.settings.languages.length) {
                    for (var i = 0; i < this.settings.languages.length; i++) {
                        var attr = {};
                        attr["href"] = "#";
                        attr["style"] = "";
                        attr["class"] = this.settings.languages[i];
                        if (data.data[this.settings.languages[i]] && (typeof data.data[this.settings.languages[i]].attributes).toLowerCase() != "undefined") {
                            for (var j in data.data[this.settings.languages[i]].attributes) {
                                if (j == "style" || j == "class")
                                    attr[j] += " " + data.data[this.settings.languages[i]].attributes[j];
                                else
                                    attr[j] = data.data[this.settings.languages[i]].attributes[j]
                                }
                        }
                        if (data.data[this.settings.languages[i]] && data.data[this.settings.languages[i]].icon && this.settings.theme_name != "themeroller") {
                            var icn = data.data[this.settings.languages[i]].icon.indexOf("/") == -1 ? this.theme + data.data[this.settings.languages[i]].icon: data.data[this.settings.languages[i]].icon;
                            attr["style"] += " ; background-image:url('" + icn + "'); "
                        }
                        str += "<a";
                        for (var j in attr)
                            str += ' ' + j + '="' + attr[j] + '" ';
                        str += ">";
                        if (data.data[this.settings.languages[i]] && data.data[this.settings.languages[i]].icon && this.settings.theme_name == "themeroller") {
                            str += "<ins class='ui-icon " + data.data[this.settings.languages[i]].icon + "'>&nbsp;</ins>"
                        }
                        str += ((typeof data.data[this.settings.languages[i]].title).toLowerCase() != "undefined" ? data.data[this.settings.languages[i]].title: data.data[this.settings.languages[i]]) + "</a>"
                    }
                } else {
                    var attr = {};
                    attr["href"] = "#";
                    attr["style"] = "";
                    attr["class"] = "";
                    if ((typeof data.data.attributes).toLowerCase() != "undefined") {
                        for (var i in data.data.attributes) {
                            if (i == "style" || i == "class")
                                attr[i] += " " + data.data.attributes[i];
                            else
                                attr[i] = data.data.attributes[i]
                            }
                    }
                    if (data.data.icon && this.settings.ui.theme_name != "themeroller") {
                        var icn = data.data.icon.indexOf("/") == -1 ? this.theme + data.data.icon: data.data.icon;
                        attr["style"] += " ; background-image:url('" + icn + "');"
                    }
                    str += "<a";
                    for (var i in attr)
                        str += ' ' + i + '="' + attr[i] + '" ';
                    str += ">";
                    if (data.data.icon && this.settings.ui.theme_name == "themeroller") {
                        str += "<ins class='ui-icon " + data.data.icon + "'>&nbsp;</ins>"
                    }
                    str += ((typeof data.data.title).toLowerCase() != "undefined" ? data.data.title: data.data) + "</a>"
                }
                if (data.children && data.children.length) {
                    str += '<ul>';
                    for (var i = 0; i < data.children.length; i++) {
                        str += this.parseJSON(data.children[i])
                        }
                    str += '</ul>'
                }
                str += "</li>";
                return str
            },
            getJSON: function(nod, outer_attrib, inner_attrib, force) {
                var _this = this;
                if (!nod || $(nod).size() == 0) {
                    nod = this.container.children("ul").children("li")
                    } else
                    nod = $(nod);
                if (nod.size() > 1) {
                    var arr = [];
                    nod.each(function() {
                        arr.push(_this.getJSON(this, outer_attrib, inner_attrib, force))
                        });
                    return arr
                }
                if (!outer_attrib)
                    outer_attrib = ["id", "rel", "class"];
                if (!inner_attrib)
                    inner_attrib = [];
                var obj = {
                    attributes: {},
                    data: false
                };
                for (var i in outer_attrib) {
                    var val = (outer_attrib[i] == "class") ? nod.attr(outer_attrib[i]).replace("last", "").replace("leaf", "").replace("closed", "").replace("open", "") : nod.attr(outer_attrib[i]);
                    if (typeof val != "undefined" && val.replace(" ", "").length > 0)
                        obj.attributes[outer_attrib[i]] = val;
                    delete val
                }
                if (this.settings.languages.length) {
                    obj.data = {};
                    for (var i in this.settings.languages) {
                        var a = nod.children("a." + this.settings.languages[i]);
                        if (force || inner_attrib.length || a.get(0).style.backgroundImage.toString().length) {
                            obj.data[this.settings.languages[i]] = {};
                            obj.data[this.settings.languages[i]].title = a.text();
                            if (a.get(0).style.backgroundImage.length) {
                                obj.data[this.settings.languages[i]].icon = a.get(0).style.backgroundImage.replace("url(", "").replace(")", "")
                                }
                            if (this.settings.ui.theme_name == "themeroller" && a.children("ins").size()) {
                                var tmp = a.children("ins").attr("class");
                                var cls = false;
                                $.each(tmp.split(" "), function(i, val) {
                                    if (val.indexOf("ui-icon-") == 0) {
                                        cls = val;
                                        return false
                                    }
                                });
                                if (cls)
                                    obj.data[this.settings.languages[i]].icon = cls
                            }
                            if (inner_attrib.length) {
                                obj.data[this.settings.languages[i]].attributes = {};
                                for (var j in inner_attrib) {
                                    var val = a.attr(inner_attrib[j]);
                                    if (typeof val != "undefined" && val.replace(" ", "").length > 0)
                                        obj.data[this.settings.languages[i]].attributes[inner_attrib[j]] = val;
                                    delete val
                                }
                            }
                        } else {
                            obj.data[this.settings.languages[i]] = a.text()
                            }
                    }
                } else {
                    var a = nod.children("a");
                    if (force || inner_attrib.length || a.get(0).style.backgroundImage.toString().length) {
                        obj.data = {};
                        obj.data.title = a.text();
                        if (a.get(0).style.backgroundImage.length) {
                            obj.data.icon = a.get(0).style.backgroundImage.replace("url(", "").replace(")", "")
                            }
                        if (this.settings.ui.theme_name == "themeroller" && a.children("ins").size()) {
                            var tmp = a.children("ins").attr("class");
                            var cls = false;
                            $.each(tmp.split(" "), function(i, val) {
                                if (val.indexOf("ui-icon-") == 0) {
                                    cls = val;
                                    return false
                                }
                            });
                            if (cls)
                                obj.data[this.settings.languages[i]].icon = cls
                        }
                        if (inner_attrib.length) {
                            obj.data.attributes = {};
                            for (var j in inner_attrib) {
                                var val = a.attr(inner_attrib[j]);
                                if (typeof val != "undefined" && val.replace(" ", "").length > 0)
                                    obj.data.attributes[inner_attrib[j]] = val;
                                delete val
                            }
                        }
                    } else {
                        obj.data = a.text()
                        }
                }
                if (nod.children("ul").size() > 0) {
                    obj.children = [];
                    nod.children("ul").children("li").each(function() {
                        obj.children.push(_this.getJSON(this, outer_attrib, inner_attrib, force))
                        })
                    }
                return obj
            },
            getXML: function(tp, nod, outer_attrib, inner_attrib, cb) {
                var _this = this;
                if (tp != "flat")
                    tp = "nested";
                if (!nod || $(nod).size() == 0) {
                    nod = this.container.children("ul").children("li")
                    } else
                    nod = $(nod);
                if (nod.size() > 1) {
                    var obj = '<root>';
                    nod.each(function() {
                        obj += _this.getXML(tp, this, outer_attrib, inner_attrib, true)
                        });
                    obj += '</root>';
                    return obj
                }
                if (!outer_attrib)
                    outer_attrib = ["id", "rel", "class"];
                if (!inner_attrib)
                    inner_attrib = [];
                var obj = '';
                if (!cb)
                    obj = '<root>';
                obj += '<item ';
                if (tp == "flat") {
                    var tmp_id = nod.parents("li:eq(0)").size() ? nod.parents("li:eq(0)").attr("id") : 0;
                    obj += ' parent_id="' + tmp_id + '" ';
                    delete tmp_id
                }
                for (var i in outer_attrib) {
                    var val = (outer_attrib[i] == "class") ? nod.attr(outer_attrib[i]).replace("last", "").replace("leaf", "").replace("closed", "").replace("open", "") : nod.attr(outer_attrib[i]);
                    if (typeof val != "undefined" && val.replace(" ", "").length > 0)
                        obj += ' ' + outer_attrib[i] + '="' + val + '" ';
                    delete val
                }
                obj += '>';
                obj += '<content>';
                if (this.settings.languages.length) {
                    for (var i in this.settings.languages) {
                        var a = nod.children("a." + this.settings.languages[i]);
                        obj += '<name ';
                        if (inner_attrib.length || a.get(0).style.backgroundImage.toString().length || this.settings.ui.theme_name == "themeroller") {
                            if (a.get(0).style.backgroundImage.length) {
                                obj += ' icon="' + a.get(0).style.backgroundImage.replace("url(", "").replace(")", "") + '" '
                            }
                            if (this.settings.ui.theme_name == "themeroller" && a.children("ins").size()) {
                                var tmp = a.children("ins").attr("class");
                                var cls = false;
                                $.each(tmp.split(" "), function(i, val) {
                                    if (val.indexOf("ui-icon-") == 0) {
                                        cls = val;
                                        return false
                                    }
                                });
                                if (cls)
                                    obj += ' icon="' + cls + '" '
                            }
                            if (inner_attrib.length) {
                                for (var j in inner_attrib) {
                                    var val = a.attr(inner_attrib[j]);
                                    if (typeof val != "undefined" && val.replace(" ", "").length > 0)
                                        obj += ' ' + inner_attrib[j] + '="' + val + '" ';
                                    delete val
                                }
                            }
                        }
                        obj += '><![CDATA[' + a.text() + ']]></name>'
                    }
                } else {
                    var a = nod.children("a");
                    obj += '<name ';
                    if (inner_attrib.length || a.get(0).style.backgroundImage.toString().length || this.settings.ui.theme_name == "themeroller") {
                        if (a.get(0).style.backgroundImage.length) {
                            obj += ' icon="' + a.get(0).style.backgroundImage.replace("url(", "").replace(")", "") + '" '
                        }
                        if (this.settings.ui.theme_name == "themeroller" && a.children("ins").size()) {
                            var tmp = a.children("ins").attr("class");
                            var cls = false;
                            $.each(tmp.split(" "), function(i, val) {
                                if (val.indexOf("ui-icon-") == 0) {
                                    cls = val;
                                    return false
                                }
                            });
                            if (cls)
                                obj += ' icon="' + cls + '" '
                        }
                        if (inner_attrib.length) {
                            for (var j in inner_attrib) {
                                var val = a.attr(inner_attrib[j]);
                                if (typeof val != "undefined" && val.replace(" ", "").length > 0)
                                    obj += ' ' + inner_attrib[j] + '="' + val + '" ';
                                delete val
                            }
                        }
                    }
                    obj += '><![CDATA[' + a.text() + ']]></name>'
                }
                obj += '</content>';
                if (tp == "flat")
                    obj += '</item>';
                if (nod.children("ul").size() > 0) {
                    nod.children("ul").children("li").each(function() {
                        obj += _this.getXML(tp, this, outer_attrib, inner_attrib, true)
                        })
                    }
                if (tp == "nested")
                    obj += '</item>';
                if (!cb)
                    obj += '</root>';
                return obj
            },
            focus: function() {
                if (this.locked)
                    return false;
                if (tree_component.focused != this.cntr) {
                    tree_component.focused = this.cntr;
                    this.settings.callback.onfocus.call(null, this)
                    }
            },
            show_context: function(obj, x, y) {
                var tmp = this.context.show().offsetParent();
                if (tmp.is("html"))
                    tmp = $("body");
                tmp = tmp.offset();
                this.context.css({
                    "left": (x - tmp.left - (this.settings.ui.rtl ? $(this.context).width() : 0)),
                    "top": (y - tmp.top + ($.browser.opera ? this.container.scrollTop() : 0) + 0)
                    })
                },
            hide_context: function() {
                if (this.context.remove && this.context.apply_to)
                    this.context.apply_to.children("a").removeClass("clicked");
                this.context.apply_to = false;
                this.context.hide()
                },
            attachEvents: function() {
                var _this = this;
                this.container.bind("mousedown", function(event) {
                    if (tree_component.drag_drop.isdown) {
                        tree_component.drag_drop.move_type = false;
                        event.preventDefault();
                        event.stopPropagation();
                        event.stopImmediatePropagation();
                        return false
                    }
                }).bind("mouseup", function(event) {
                    setTimeout(function() {
                        _this.focus.apply(_this)
                        }, 5)
                    }).bind("click", function(event) {
                    return true
                });
                $("#" + this.container.attr("id") + " li").live("click", function(event) {
                    if (event.target.tagName != "LI")
                        return true;
                    _this.off_height();
                    if (event.pageY - $(event.target).offset().top > _this.li_height)
                        return true;
                    _this.toggle_branch.apply(_this, [event.target]);
                    event.stopPropagation();
                    return false
                });
                $("#" + this.container.attr("id") + " li a").live("click", function(event) {
                    if (event.which && event.which == 3)
                        return true;
                    if (_this.locked) {
                        event.preventDefault();
                        event.target.blur();
                        return _this.error("LOCKED")
                        }
                    _this.select_branch.apply(_this, [event.target, event.ctrlKey || _this.settings.rules.multiple == "on"]);
                    if (_this.inp) {
                        _this.inp.blur()
                        }
                    event.preventDefault();
                    event.target.blur();
                    return false
                }).live("dblclick", function(event) {
                    if (_this.locked) {
                        event.preventDefault();
                        event.stopPropagation();
                        event.target.blur();
                        return _this.error("LOCKED")
                        }
                    _this.settings.callback.ondblclk.call(null, _this.get_node(event.target).get(0), _this);
                    event.preventDefault();
                    event.stopPropagation();
                    event.target.blur()
                    }).live("contextmenu", function(event) {
                    if (_this.locked) {
                        event.target.blur();
                        return _this.error("LOCKED")
                        }
                    var val = _this.settings.callback.onrgtclk.call(null, _this.get_node(event.target).get(0), _this, event);
                    if (_this.context) {
                        if (_this.context.append == false) {
                            $("body").append(_this.context);
                            _this.context.append = true;
                            for (var i in _this.settings.ui.context) {
                                if (_this.settings.ui.context[i] == "separator")
                                    continue; (function() {
                                    var func = _this.settings.ui.context[i].action;
                                    _this.context.children("[rel=" + _this.settings.ui.context[i].id + "]").bind("click", function(event) {
                                        if (!$(this).hasClass("disabled")) {
                                            func.call(null, _this.context.apply_to || null, _this);
                                            _this.hide_context()
                                            }
                                        event.stopPropagation();
                                        event.preventDefault();
                                        return false
                                    }).bind("mouseup", function(event) {
                                        this.blur();
                                        if ($(this).hasClass("disabled")) {
                                            event.stopPropagation();
                                            event.preventDefault();
                                            return false
                                        }
                                    }).bind("mousedown", function(event) {
                                        event.stopPropagation();
                                        event.preventDefault()
                                        })
                                    })()
                                }
                        }
                        var obj = _this.get_node(event.target);
                        if (_this.inp) {
                            _this.inp.blur()
                            }
                        if (obj) {
                            if (!obj.children("a:eq(0)").hasClass("clicked")) {
                                _this.context.apply_to = obj;
                                _this.context.remove = true;
                                _this.context.apply_to.children("a").addClass("clicked");
                                event.target.blur()
                                } else {
                                _this.context.remove = false;
                                _this.context.apply_to = _this.selected_arr || _this.selected
                            }
                            _this.context.children("a").removeClass("disabled").show();
                            var go = false;
                            for (var i in _this.settings.ui.context) {
                                if (_this.settings.ui.context[i] == "separator")
                                    continue;
                                var state = _this.settings.ui.context[i].visible.call(null, _this.context.apply_to, _this);
                                if (state === false)
                                    _this.context.children("[rel=" + _this.settings.ui.context[i].id + "]").addClass("disabled");
                                if (state === -1)
                                    _this.context.children("[rel=" + _this.settings.ui.context[i].id + "]").hide();
                                else
                                    go = true
                            }
                            if (go == true)
                                _this.show_context(obj, event.pageX, event.pageY);
                            event.preventDefault();
                            event.stopPropagation();
                            return false
                        }
                    }
                    return val
                }).live("mouseover", function(event) {
                    if (_this.locked) {
                        event.preventDefault();
                        event.stopPropagation();
                        return _this.error("LOCKED")
                        }
                    if ((_this.settings.ui.hover_mode || _this.settings.ui.theme_name == "themeroller") && _this.hovered !== false && event.target.tagName == "A") {
                        _this.hovered.children("a").removeClass("hover ui-state-hover");
                        _this.hovered = false
                    }
                    if (_this.settings.ui.theme_name == "themeroller") {
                        _this.hover_branch.apply(_this, [event.target])
                        }
                });
                if (_this.settings.ui.theme_name == "themeroller") {
                    $("#" + this.container.attr("id") + " li a").live("mouseout", function(event) {
                        if (_this.hovered)
                            _this.hovered.children("a").removeClass("hover ui-state-hover")
                        })
                    }
                if (this.settings.rules.draggable != "none") {
                    $("#" + this.container.attr("id") + " li a").live("mousedown", function(event) {
                        if (_this.settings.rules.drag_button == "left" && event.which && event.which != 1)
                            return false;
                        if (_this.settings.rules.drag_button == "right" && event.which && event.which != 3)
                            return false;
                        _this.focus.apply(_this);
                        if (_this.locked)
                            return _this.error("LOCKED");
                        var obj = _this.get_node(event.target);
                        if (_this.settings.rules.multiple != false && _this.selected_arr.length > 1 && obj.children("a:eq(0)").hasClass("clicked")) {
                            var counter = 0;
                            for (var i in _this.selected_arr) {
                                if (_this.check("draggable", _this.selected_arr[i])) {
                                    _this.selected_arr[i].addClass("dragged");
                                    tree_component.drag_drop.origin_tree = _this;
                                    counter++
                                }
                            }
                            if (counter > 0) {
                                if (_this.check("draggable", obj))
                                    tree_component.drag_drop.drag_node = obj;
                                else
                                    tree_component.drag_drop.drag_node = _this.container.find("li.dragged:eq(0)");
                                tree_component.drag_drop.isdown = true;
                                tree_component.drag_drop.drag_help = $(tree_component.drag_drop.drag_node.get(0).cloneNode(true));
                                tree_component.drag_drop.drag_help.attr("id", "dragged");
                                tree_component.drag_drop.drag_help.children("a").html("Multiple selection").end().children("ul").remove()
                                }
                        } else {
                            if (_this.check("draggable", obj)) {
                                tree_component.drag_drop.drag_node = obj;
                                tree_component.drag_drop.drag_help = $(obj.get(0).cloneNode(true));
                                tree_component.drag_drop.drag_help.attr("id", "dragged");
                                tree_component.drag_drop.isdown = true;
                                tree_component.drag_drop.foreign = false;
                                tree_component.drag_drop.origin_tree = _this;
                                obj.addClass("dragged")
                                }
                        }
                        tree_component.drag_drop.init_x = event.pageX;
                        tree_component.drag_drop.init_y = event.pageY;
                        obj.blur();
                        event.preventDefault();
                        event.stopPropagation();
                        return false
                    });
                    $(document).bind("mousedown", tree_component.mousedown).bind("mouseup", tree_component.mouseup).bind("mousemove", tree_component.mousemove)
                    }
                if (_this.context)
                    $(document).bind("mousedown", function() {
                    _this.hide_context()
                    })
                },
            checkMove: function(NODES, REF_NODE, TYPE) {
                if (this.locked)
                    return this.error("LOCKED");
                var _this = this;
                if (REF_NODE.parents("li.dragged").size() > 0 || REF_NODE.is(".dragged"))
                    return this.error("MOVE: NODE OVER SELF");
                if (NODES.size() == 1) {
                    var NODE = NODES.eq(0);
                    if (tree_component.drag_drop.foreign) {
                        if (this.settings.rules.droppable.length == 0)
                            return false;
                        if (!NODE.is("." + this.settings.rules.droppable.join(", .")))
                            return false;
                        var ok = false;
                        for (var i in this.settings.rules.droppable) {
                            if (NODE.is("." + this.settings.rules.droppable[i])) {
                                if (this.settings.rules.metadata) {
                                    $.metadata.setType("attr", this.settings.rules.metadata);
                                    NODE.attr(this.settings.rules.metadata, "type: '" + this.settings.rules.droppable[i] + "'")
                                    } else {
                                    NODE.attr(this.settings.rules.type_attr, this.settings.rules.droppable[i])
                                    }
                                ok = true;
                                break
                            }
                        }
                        if (!ok)
                            return false
                    }
                    if (!this.check("dragrules", [NODE, TYPE, REF_NODE.parents("li:eq(0)")]))
                        return this.error("MOVE: AGAINST DRAG RULES")
                    } else {
                    var ok = true;
                    NODES.each(function(i) {
                        if (ok == false)
                            return false;
                        var ref = REF_NODE;
                        var mv = TYPE;
                        if (!_this.check.apply(_this, ["dragrules", [$(this), mv, ref]]))
                            ok = false
                    });
                    if (ok == false)
                        return this.error("MOVE: AGAINST DRAG RULES")
                    }
                if (this.settings.rules.use_inline && this.settings.rules.metadata) {
                    var nd = false;
                    if (TYPE == "inside")
                        nd = REF_NODE.parents("li:eq(0)");
                    else
                        nd = REF_NODE.parents("li:eq(1)");
                    if (nd.size()) {
                        if (typeof nd.metadata()["valid_children"] != "undefined") {
                            var tmp = nd.metadata()["valid_children"];
                            var ok = true;
                            NODES.each(function(i) {
                                if (ok == false)
                                    return false;
                                if ($.inArray(_this.get_type(this), tmp) == -1)
                                    ok = false
                            });
                            if (ok == false)
                                return this.error("MOVE: NOT A VALID CHILD")
                            }
                        if (typeof nd.metadata()["max_children"] != "undefined") {
                            if ((nd.children("ul:eq(0)").children("li").not(".dragged").size() + NODES.size()) > nd.metadata().max_children)
                                return this.error("MOVE: MAX CHILDREN REACHED")
                            }
                        var incr = 0;
                        NODES.each(function(j) {
                            var i = 1;
                            var t = $(this);
                            while (i < 100) {
                                t = t.children("ul").children("li");
                                if (t.size() == 0)
                                    break;
                                i++
                            }
                            incr = Math.max(i, incr)
                            });
                        var ok = true;
                        if ((typeof $(nd).metadata().max_depth).toLowerCase() != "undefined" && $(nd).metadata().max_depth < incr)
                            ok = false;
                        else {
                            nd.parents("li").each(function(i) {
                                if (ok == false)
                                    return false;
                                if ((typeof $(this).metadata().max_depth).toLowerCase() != "undefined") {
                                    if ((i + incr) >= $(this).metadata().max_depth)
                                        ok = false
                                }
                            })
                            }
                        if (ok == false)
                            return this.error("MOVE: MAX_DEPTH REACHED")
                        }
                }
                return true
            },
            reselect: function() {
                var _this = this;
                if (this.opened && this.opened.length) {
                    var opn = false;
                    for (var j = 0; j < this.opened.length; j++) {
                        if (this.settings.data.async) {
                            if (this.get_node(this.opened[j]).size() > 0) {
                                opn = true;
                                var tmp = this.opened[j];
                                delete this.opened[j];
                                this.open_branch(tmp, true, function() {
                                    _this.reselect.apply(_this)
                                    })
                                }
                        } else
                            this.open_branch(this.opened[j], true)
                        }
                    if (this.settings.data.async && opn)
                        return;
                    delete this.opened
                }
                if (this.scrtop) {
                    this.container.scrollTop(_this.scrtop);
                    delete this.scrtop
                }
                if (this.settings.selected !== false) {
                    $.each(this.settings.selected, function(i) {
                        _this.select_branch($(_this.settings.selected[i], _this.container), (_this.settings.rules.multiple !== false && i > 0))
                        });
                    this.settings.selected = false
                }
                if (this.settings.ui.theme_name == "themeroller")
                    this.container.find("a").addClass("ui-state-default");
                this.settings.callback.onload.call(null, _this)
                },
            get_node: function(obj) {
                var obj = $(obj);
                return obj.is("li") ? obj: obj.parents("li:eq(0)")
                },
            get_type: function(obj) {
                obj = !obj ? this.selected: this.get_node(obj);
                if (!obj)
                    return;
                if (this.settings.rules.metadata) {
                    $.metadata.setType("attr", this.settings.rules.metadata);
                    var tmp = obj.metadata().type;
                    if (tmp)
                        return tmp
                }
                return obj.attr(this.settings.rules.type_attr)
                },
            scrollCheck: function(x, y) {
                var _this = this;
                var cnt = _this.container;
                var off = _this.container.offset();
                var st = cnt.scrollTop();
                var sl = cnt.scrollLeft();
                var h_cor = (cnt.get(0).scrollWidth > cnt.width()) ? 40: 20;
                if (y - off.top < 20)
                    cnt.scrollTop(Math.max((st - _this.settings.ui.scroll_spd), 0));
                if (cnt.height() - (y - off.top) < h_cor)
                    cnt.scrollTop(st + _this.settings.ui.scroll_spd);
                if (x - off.left < 20)
                    cnt.scrollLeft(Math.max((sl - _this.settings.ui.scroll_spd), 0));
                if (cnt.width() - (x - off.left) < 40)
                    cnt.scrollLeft(sl + _this.settings.ui.scroll_spd);
                if (cnt.scrollLeft() != sl || cnt.scrollTop() != st) {
                    _this.moveType = false;
                    _this.moveRef = false;
                    tree_component.drag_drop.marker.hide()
                    }
                tree_component.drag_drop.scroll_time = setTimeout(function() {
                    _this.scrollCheck(x, y)
                    }, 50)
                },
            check: function(rule, nodes) {
                if (this.locked)
                    return this.error("LOCKED");
                if (rule != "dragrules" && this.settings.rules.use_inline && this.settings.rules.metadata) {
                    $.metadata.setType("attr", this.settings.rules.metadata);
                    if (typeof this.get_node(nodes).metadata()[rule] != "undefined")
                        return this.get_node(nodes).metadata()[rule]
                    }
                if (!this.settings.rules[rule])
                    return false;
                if (this.settings.rules[rule] == "none")
                    return false;
                if (this.settings.rules[rule] == "all")
                    return true;
                if (rule == "dragrules") {
                    var nds = new Array();
                    nds[0] = this.get_type(nodes[0]);
                    nds[1] = nodes[1];
                    nds[2] = this.get_type(nodes[2]);
                    for (var i = 0; i < this.settings.rules.dragrules.length; i++) {
                        var r = this.settings.rules.dragrules[i];
                        var n = (r.indexOf("!") === 0) ? false: true;
                        if (!n)
                            r = r.replace("!", "");
                        var tmp = r.split(" ");
                        for (var j = 0; j < 3; j++) {
                            if (tmp[j] == nds[j] || tmp[j] == "*")
                                tmp[j] = true
                        }
                        if (tmp[0] === true && tmp[1] === true && tmp[2] === true)
                            return n
                    }
                    return false
                } else
                    return ($.inArray(this.get_type(nodes), this.settings.rules[rule]) != -1) ? true: false
            },
            hover_branch: function(obj) {
                if (this.locked)
                    return this.error("LOCKED");
                if (this.settings.ui.hover_mode == false && this.settings.theme_name != "themeroller")
                    return this.select_branch(obj);
                var _this = this;
                var obj = _this.get_node(obj);
                if (!obj.size())
                    return this.error("HOVER: NOT A VALID NODE");
                if (!_this.check("clickable", obj))
                    return this.error("SELECT: NODE NOT SELECTABLE");
                if (this.hovered)
                    this.hovered.children("A").removeClass("hover ui-state-hover");
                this.hovered = obj;
                this.hovered.children("a").removeClass("hover ui-state-hover").addClass(this.settings.ui.theme_name == "themeroller" ? "hover ui-state-hover": "hover");
                var off_t = this.hovered.offset().top;
                var beg_t = this.container.offset().top;
                var end_t = beg_t + this.container.height();
                var h_cor = (this.container.get(0).scrollWidth > this.container.width()) ? 40: 20;
                if (off_t + 5 < beg_t)
                    this.container.scrollTop(this.container.scrollTop() - (beg_t - off_t + 5));
                if (off_t + h_cor > end_t)
                    this.container.scrollTop(this.container.scrollTop() + (off_t + h_cor - end_t))
                },
            select_branch: function(obj, multiple) {
                if (this.locked)
                    return this.error("LOCKED");
                if (!obj && this.hovered !== false)
                    obj = this.hovered;
                var _this = this;
                obj = _this.get_node(obj);
                if (!obj.size())
                    return this.error("SELECT: NOT A VALID NODE");
                obj.children("a").removeClass("hover ui-state-hover");
                if (!_this.check("clickable", obj))
                    return this.error("SELECT: NODE NOT SELECTABLE");
                if (_this.settings.callback.beforechange.call(null, obj.get(0), _this) === false)
                    return this.error("SELECT: STOPPED BY USER");
                if (this.settings.rules.multiple != false && multiple && obj.children("a.clicked").size() > 0) {
                    return this.deselect_branch(obj)
                    }
                if (this.settings.rules.multiple != false && multiple) {
                    this.selected_arr.push(obj)
                    }
                if (this.settings.rules.multiple != false && !multiple) {
                    for (var i in this.selected_arr) {
                        this.selected_arr[i].children("A").removeClass("clicked ui-state-active");
                        this.settings.callback.ondeselect.call(null, this.selected_arr[i].get(0), _this)
                        }
                    this.selected_arr = [];
                    this.selected_arr.push(obj);
                    if (this.selected && this.selected.children("A").hasClass("clicked")) {
                        this.selected.children("A").removeClass("clicked ui-state-active");
                        this.settings.callback.ondeselect.call(null, this.selected.get(0), _this)
                        }
                }
                if (!this.settings.rules.multiple) {
                    if (this.selected) {
                        this.selected.children("A").removeClass("clicked ui-state-active");
                        this.settings.callback.ondeselect.call(null, this.selected.get(0), _this)
                        }
                }
                this.selected = obj;
                if ((this.settings.ui.hover_mode || this.settings.ui.theme_name == "themeroller") && this.hovered !== false) {
                    this.hovered.children("A").removeClass("hover ui-state-hover");
                    this.hovered = obj
                }
                this.selected.children("a").removeClass("clicked ui-state-active").addClass(this.settings.ui.theme_name == "themeroller" ? "clicked ui-state-active": "clicked").end().parents("li.closed").each(function() {
                    _this.open_branch(this, true)
                    });
                var off_t = this.selected.offset().top;
                var beg_t = this.container.offset().top;
                var end_t = beg_t + this.container.height();
                var h_cor = (this.container.get(0).scrollWidth > this.container.width()) ? 40: 20;
                if (off_t + 5 < beg_t)
                    this.container.scrollTop(this.container.scrollTop() - (beg_t - off_t + 5));
                if (off_t + h_cor > end_t)
                    this.container.scrollTop(this.container.scrollTop() + (off_t + h_cor - end_t));
                this.set_cookie("selected");
                this.settings.callback.onselect.call(null, this.selected.get(0), _this);
                this.settings.callback.onchange.call(null, this.selected.get(0), _this)
                },
            deselect_branch: function(obj) {
                if (this.locked)
                    return this.error("LOCKED");
                var _this = this;
                var obj = this.get_node(obj);
                obj.children("a").removeClass("clicked ui-state-active");
                this.settings.callback.ondeselect.call(null, obj.get(0), _this);
                if (this.settings.rules.multiple != false && this.selected_arr.length > 1) {
                    this.selected_arr = [];
                    this.container.find("a.clicked").filter(":first-child").parent().each(function() {
                        _this.selected_arr.push($(this))
                        });
                    if (obj.get(0) == this.selected.get(0)) {
                        this.selected = this.selected_arr[0];
                        this.set_cookie("selected")
                        }
                } else {
                    if (this.settings.rules.multiple != false)
                        this.selected_arr = [];
                    this.selected = false;
                    this.set_cookie("selected")
                    }
                if (this.selected)
                    this.settings.callback.onchange.call(null, this.selected.get(0), _this);
                else
                    this.settings.callback.onchange.call(null, false, _this)
                },
            toggle_branch: function(obj) {
                if (this.locked)
                    return this.error("LOCKED");
                var obj = this.get_node(obj);
                if (obj.hasClass("closed"))
                    return this.open_branch(obj);
                if (obj.hasClass("open"))
                    return this.close_branch(obj)
                },
            open_branch: function(obj, disable_animation, callback) {
                if (this.locked)
                    return this.error("LOCKED");
                var obj = this.get_node(obj);
                if (!obj.size())
                    return this.error("OPEN: NO SUCH NODE");
                if (obj.hasClass("leaf"))
                    return this.error("OPEN: OPENING LEAF NODE");
                if (this.settings.data.async && obj.find("li").size() == 0) {
                    if (this.settings.callback.beforeopen.call(null, obj.get(0), this) === false)
                        return this.error("OPEN: STOPPED BY USER");
                    var _this = this;
                    obj.children("ul:eq(0)").remove().end().append("<ul><li class='last'><a class='loading' href='#'>" + (_this.settings.lang.loading || "Loading ...") + "</a></li></ul>");
                    obj.removeClass("closed").addClass("open");
                    if (this.settings.data.type == "xml_flat" || this.settings.data.type == "xml_nested") {
                        var xsl = (this.settings.data.type == "xml_flat") ? "flat.xsl": "nested.xsl";
                        obj.children("ul:eq(0)").getTransform(this.path + xsl, this.settings.data.url, {
                            params: {
                                theme_path: _this.theme
                            },
                            meth: this.settings.data.method,
                            dat: this.settings.data.async_data(obj),
                            repl: true,
                            callback: function(str, json) {
                                if (str.length < 15) {
                                    obj.removeClass("closed").removeClass("open").addClass("leaf").children("ul").remove();
                                    if (callback)
                                        callback.call();
                                    return
                                }
                                _this.open_branch.apply(_this, [obj]);
                                if (callback)
                                    callback.call()
                                }
                        })
                        } else {
                        $.ajax({
                            type: this.settings.data.method,
                            url: this.settings.data.url,
                            data: this.settings.data.async_data(obj),
                            dataType: "json",
                            success: function(data, textStatus) {
                                if (!data || data.length == 0) {
                                    obj.removeClass("closed").removeClass("open").addClass("leaf").children("ul").remove();
                                    if (callback)
                                        callback.call();
                                    return
                                }
                                var str = "";
                                if (data.length) {
                                    for (var i = 0; i < data.length; i++) {
                                        str += _this.parseJSON(data[i])
                                        }
                                } else
                                    str = _this.parseJSON(data);
                                if (str.length > 0) {
                                    obj.children("ul:eq(0)").replaceWith("<ul>" + str + "</ul>");
                                    obj.find("li:last-child").addClass("last").end().find("li:has(ul)").not(".open").addClass("closed");
                                    obj.find("li").not(".open").not(".closed").addClass("leaf");
                                    _this.open_branch.apply(_this, [obj])
                                    } else
                                    obj.removeClass("closed").removeClass("open").addClass("leaf").children("ul").remove();
                                if (callback)
                                    callback.call()
                                }
                        })
                        }
                    return true
                } else {
                    if (!this.settings.data.async) {
                        if (this.settings.callback.beforeopen.call(null, obj.get(0), this) === false)
                            return this.error("OPEN: STOPPED BY USER")
                        }
                    if (this.settings.ui.theme_name == "themeroller")
                        obj.find("a").not(".ui-state-default").addClass("ui-state-default");
                    if (parseInt(this.settings.ui.animation) > 0 && !disable_animation) {
                        obj.children("ul:eq(0)").css("display", "none");
                        obj.removeClass("closed").addClass("open");
                        obj.children("ul:eq(0)").slideDown(parseInt(this.settings.ui.animation), function() {
                            $(this).css("display", "");
                            if (callback)
                                callback.call()
                            })
                        } else {
                        obj.removeClass("closed").addClass("open");
                        if (callback)
                            callback.call()
                        }
                    this.set_cookie("open");
                    this.settings.callback.onopen.call(null, obj.get(0), this);
                    return true
                }
            },
            close_branch: function(obj, disable_animation) {
                if (this.locked)
                    return this.error("LOCKED");
                var _this = this;
                var obj = this.get_node(obj);
                if (!obj.size())
                    return this.error("CLOSE: NO SUCH NODE");
                if (_this.settings.callback.beforeclose.call(null, obj.get(0), _this) === false)
                    return this.error("CLOSE: STOPPED BY USER");
                if (parseInt(this.settings.ui.animation) > 0 && !disable_animation && obj.children("ul:eq(0)").size() == 1) {
                    obj.children("ul:eq(0)").slideUp(parseInt(this.settings.ui.animation), function() {
                        if (obj.hasClass("open"))
                            obj.removeClass("open").addClass("closed");
                        _this.set_cookie("open");
                        $(this).css("display", "")
                        })
                    } else {
                    if (obj.hasClass("open"))
                        obj.removeClass("open").addClass("closed");
                    this.set_cookie("open")
                    }
                if (this.selected && obj.children("ul:eq(0)").find("a.clicked").size() > 0) {
                    obj.find("li:has(a.clicked)").each(function() {
                        _this.deselect_branch(this)
                        });
                    if (obj.children("a.clicked").size() == 0)
                        this.select_branch(obj, (this.settings.rules.multiple != false && this.selected_arr.length > 0))
                    }
                this.settings.callback.onclose.call(null, obj.get(0), this)
                },
            open_all: function(obj, callback) {
                if (this.locked)
                    return this.error("LOCKED");
                var _this = this;
                obj = obj ? $(obj) : this.container;
                var s = obj.find("li.closed").size();
                if (!callback)
                    this.cl_count = 0;
                else
                    this.cl_count--;
                if (s > 0) {
                    this.cl_count += s;
                    obj.find("li.closed").each(function() {
                        var __this = this;
                        _this.open_branch.apply(_this, [this, true, function() {
                            _this.open_all.apply(_this, [__this, true])
                            }])
                        })
                    } else if (this.cl_count == 0)
                    this.settings.callback.onopen_all.call(null, this)
                },
            close_all: function() {
                if (this.locked)
                    return this.error("LOCKED");
                var _this = this;
                this.container.find("li.open").each(function() {
                    _this.close_branch(this, true)
                    })
                },
            show_lang: function(i) {
                if (this.locked)
                    return this.error("LOCKED");
                if (this.settings.languages[i] == this.current_lang)
                    return true;
                var st = false;
                var id = this.container.attr("id") ? "#" + this.container.attr("id") : ".tree";
                st = get_css(id + " ." + this.current_lang, this.sn);
                if (st !== false)
                    st.style.display = "none";
                st = get_css(id + " ." + this.settings.languages[i], this.sn);
                if (st !== false)
                    st.style.display = "";
                this.current_lang = this.settings.languages[i];
                return true
            },
            cycle_lang: function() {
                if (this.locked)
                    return this.error("LOCKED");
                var i = $.inArray(this.current_lang, this.settings.languages);
                i++;
                if (i > this.settings.languages.length - 1)
                    i = 0;
                this.show_lang(i)
                },
            create: function(obj, ref_node, position) {
                if (this.locked)
                    return this.error("LOCKED");
                var root = false;
                if (ref_node == -1) {
                    root = true;
                    ref_node = this.container
                } else
                    ref_node = ref_node ? this.get_node(ref_node) : this.selected;
                if (!root && (!ref_node || !ref_node.size()))
                    return this.error("CREATE: NO NODE SELECTED");
                var tmp = ref_node;
                if (position == "before") {
                    position = ref_node.parent().children().index(ref_node);
                    ref_node = ref_node.parents("li:eq(0)")
                    }
                if (position == "after") {
                    position = ref_node.parent().children().index(ref_node) + 1;
                    ref_node = ref_node.parents("li:eq(0)")
                    }
                if (!root && ref_node.size() == 0) {
                    root = true;
                    ref_node = this.container
                }
                if (!root) {
                    if (!this.check("creatable", ref_node))
                        return this.error("CREATE: CANNOT CREATE IN NODE");
                    if (ref_node.hasClass("closed")) {
                        if (this.settings.data.async && ref_node.children("ul").size() == 0) {
                            var _this = this;
                            return this.open_branch(ref_node, true, function() {
                                _this.create.apply(_this, [obj, ref_node, position])
                                })
                            } else
                            this.open_branch(ref_node, true)
                        }
                }
                var torename = false;
                if (!obj)
                    obj = {};
                if (!obj.attributes)
                    obj.attributes = {};
                if (this.settings.rules.metadata) {
                    if (!obj.attributes[this.settings.rules.metadata])
                        obj.attributes[this.settings.rules.metadata] = '{ "type" : "' + (this.get_type(tmp) || "") + '" }'
                } else {
                    if (!obj.attributes[this.settings.rules.type_attr])
                        obj.attributes[this.settings.rules.type_attr] = this.get_type(tmp) || ""
                }
                if (this.settings.languages.length) {
                    if (!obj.data) {
                        obj.data = {};
                        torename = true
                    }
                    for (var i = 0; i < this.settings.languages.length; i++) {
                        if (!obj.data[this.settings.languages[i]])
                            obj.data[this.settings.languages[i]] = ((typeof this.settings.lang.new_node).toLowerCase() != "string" && this.settings.lang.new_node[i]) ? this.settings.lang.new_node[i] : this.settings.lang.new_node
                    }
                } else {
                    if (!obj.data) {
                        obj.data = this.settings.lang.new_node;
                        torename = true
                    }
                }
                var $li = $(this.parseJSON(obj));
                $li.addClass("leaf");
                if (!root && this.settings.rules.use_inline && this.settings.rules.metadata) {
                    var t = this.get_type($li) || "";
                    $.metadata.setType("attr", this.settings.rules.metadata);
                    if (typeof ref_node.metadata()["valid_children"] != "undefined") {
                        if ($.inArray(t, ref_node.metadata()["valid_children"]) == -1)
                            return this.error("CREATE: NODE NOT A VALID CHILD")
                        }
                    if (typeof ref_node.metadata()["max_children"] != "undefined") {
                        if ((ref_node.children("ul:eq(0)").children("li").size() + 1) > ref_node.metadata().max_children)
                            return this.error("CREATE: MAX_CHILDREN REACHED")
                        }
                    var ok = true;
                    if ((typeof $(ref_node).metadata().max_depth).toLowerCase() != "undefined" && $(ref_node).metadata().max_depth === 0)
                        ok = false;
                    else {
                        ref_node.parents("li").each(function(i) {
                            if ($(this).metadata().max_depth) {
                                if ((i + 1) >= $(this).metadata().max_depth) {
                                    ok = false;
                                    return false
                                }
                            }
                        })
                        }
                    if (!ok)
                        return this.error("CREATE: MAX_DEPTH REACHED")
                    }
                if ((typeof position).toLowerCase() == "undefined" || position == "inside")
                    position = (this.settings.rules.createat == "top") ? 0: ref_node.children("ul:eq(0)").children("li").size();
                if (ref_node.children("ul").size() == 0 || (root == true && ref_node.children("ul").children("li").size() == 0)) {
                    if (!root)
                        var a = this.moved($li, ref_node.children("a:eq(0)"), "inside", true);
                    else
                        var a = this.moved($li, this.container.children("ul:eq(0)"), "inside", true)
                    } else if (ref_node.children("ul:eq(0)").children("li:nth-child(" + (position + 1) + ")").size())
                    var a = this.moved($li, ref_node.children("ul:eq(0)").children("li:nth-child(" + (position + 1) + ")").children("a:eq(0)"), "before", true);
                else
                    var a = this.moved($li, ref_node.children("ul:eq(0)").children("li:last").children("a:eq(0)"), "after", true);
                if (a === false)
                    return this.error("CREATE: ABORTED");
                this.select_branch($li.children("a:eq(0)"));
                if (torename)
                    this.rename();
                return $li
            },
            rename: function(obj) {
                if (this.locked)
                    return this.error("LOCKED");
                obj = obj ? this.get_node(obj) : this.selected;
                var _this = this;
                if (!obj || !obj.size())
                    return this.error("RENAME: NO NODE SELECTED");
                if (!this.check("renameable", obj))
                    return this.error("RENAME: NODE NOT RENAMABLE");
                if (!this.settings.callback.beforerename.call(null, obj.get(0), _this.current_lang, _this))
                    return this.error("RENAME: STOPPED BY USER");
                obj.parents("li.closed").each(function() {
                    _this.open_branch(this)
                    });
                if (this.current_lang)
                    obj = obj.find("a." + this.current_lang).get(0);
                else
                    obj = obj.find("a:first").get(0);
                last_value = obj.innerHTML;
                _this.inp = $("<input type='text' autocomplete='off' />");
                _this.inp.val(last_value.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<")).bind("mousedown", function(event) {
                    event.stopPropagation()
                    }).bind("mouseup", function(event) {
                    event.stopPropagation()
                    }).bind("click", function(event) {
                    event.stopPropagation()
                    }).bind("keyup", function(event) {
                    var key = event.keyCode || event.which;
                    if (key == 27) {
                        this.value = last_value;
                        this.blur();
                        return
                    }
                    if (key == 13) {
                        this.blur();
                        return
                    }
                });
                var rb = {};
                rb[this.container.attr("id")] = this.get_rollback();
                _this.inp.blur(function(event) {
                    if (this.value == "")
                        this.value = last_value;
                    $(obj).text($(obj).parent().find("input").eq(0).attr("value")).get(0).style.display = "";
                    $(obj).prevAll("span").remove();
                    _this.settings.callback.onrename.call(null, _this.get_node(obj).get(0), _this.current_lang, _this, rb);
                    _this.inp = false
                });
                var spn = $("<span />").addClass(obj.className).append(_this.inp);
                spn.attr("style", $(obj).attr("style"));
                obj.style.display = "none";
                $(obj).parent().prepend(spn);
                _this.inp.get(0).focus();
                _this.inp.get(0).select()
                },
            remove: function(obj) {
                if (this.locked)
                    return this.error("LOCKED");
                var rb = {};
                rb[this.container.attr("id")] = this.get_rollback();
                if (obj && (!this.selected || this.get_node(obj).get(0) != this.selected.get(0))) {
                    obj = this.get_node(obj);
                    if (obj.size()) {
                        if (!this.check("deletable", obj))
                            return this.error("DELETE: NODE NOT DELETABLE");
                        if (!this.settings.callback.beforedelete.call(null, obj.get(0), _this))
                            return this.error("DELETE: STOPPED BY USER");
                        $parent = obj.parent();
                        obj = obj.remove();
                        $parent.children("li:last").addClass("last");
                        if ($parent.children("li").size() == 0) {
                            $li = $parent.parents("li:eq(0)");
                            $li.removeClass("open").removeClass("closed").addClass("leaf").children("ul").remove();
                            this.set_cookie("open")
                            }
                        this.settings.callback.ondelete.call(null, obj.get(0), this, rb)
                        }
                } else if (this.selected) {
                    if (!this.check("deletable", this.selected))
                        return this.error("DELETE: NODE NOT DELETABLE");
                    if (!this.settings.callback.beforedelete.call(null, this.selected.get(0), _this))
                        return this.error("DELETE: STOPPED BY USER");
                    $parent = this.selected.parent();
                    var obj = this.selected;
                    if (this.settings.rules.multiple == false || this.selected_arr.length == 1) {
                        var stop = true;
                        var tmp = (this.selected.prev("li:eq(0)").size()) ? this.selected.prev("li:eq(0)") : this.selected.parents("li:eq(0)")
                        }
                    obj = obj.remove();
                    $parent.children("li:last").addClass("last");
                    if ($parent.children("li").size() == 0) {
                        $li = $parent.parents("li:eq(0)");
                        $li.removeClass("open").removeClass("closed").addClass("leaf").children("ul").remove();
                        this.set_cookie("open")
                        }
                    this.settings.callback.ondelete.call(null, obj.get(0), this, rb);
                    if (stop && tmp)
                        this.select_branch(tmp);
                    if (this.settings.rules.multiple != false && !stop) {
                        var _this = this;
                        this.selected_arr = [];
                        this.container.find("a.clicked").filter(":first-child").parent().each(function() {
                            _this.selected_arr.push($(this))
                            });
                        if (this.selected_arr.length > 0) {
                            this.selected = this.selected_arr[0];
                            this.remove()
                            }
                    }
                } else
                    return this.error("DELETE: NO NODE SELECTED")
                },
            get_next: function(force) {
                var obj = this.hovered || this.selected;
                if (obj) {
                    if (obj.hasClass("open"))
                        return force ? this.select_branch(obj.find("li:eq(0)")) : this.hover_branch(obj.find("li:eq(0)"));
                    else if ($(obj).nextAll("li").size() > 0)
                        return force ? this.select_branch(obj.nextAll("li:eq(0)")) : this.hover_branch(obj.nextAll("li:eq(0)"));
                    else
                        return force ? this.select_branch(obj.parents("li").next("li").eq(0)) : this.hover_branch(obj.parents("li").next("li").eq(0))
                    }
            },
            get_prev: function(force) {
                var obj = this.hovered || this.selected;
                if (obj) {
                    if (obj.prev("li").size()) {
                        var obj = obj.prev("li").eq(0);
                        while (obj.hasClass("open"))
                            obj = obj.children("ul:eq(0)").children("li:last");
                        return force ? this.select_branch(obj) : this.hover_branch(obj)
                        } else {
                        return force ? this.select_branch(obj.parents("li:eq(0)")) : this.hover_branch(obj.parents("li:eq(0)"))
                        }
                }
            },
            get_left: function(force, rtl) {
                if (this.settings.ui.rtl && !rtl)
                    return this.get_right(force, true);
                var obj = this.hovered || this.selected;
                if (obj) {
                    if (obj.hasClass("open"))
                        this.close_branch(obj);
                    else {
                        return force ? this.select_branch(obj.parents("li:eq(0)")) : this.hover_branch(obj.parents("li:eq(0)"))
                        }
                }
            },
            get_right: function(force, rtl) {
                if (this.settings.ui.rtl && !rtl)
                    return this.get_left(force, true);
                var obj = this.hovered || this.selected;
                if (obj) {
                    if (obj.hasClass("closed"))
                        this.open_branch(obj);
                    else {
                        return force ? this.select_branch(obj.find("li:eq(0)")) : this.hover_branch(obj.find("li:eq(0)"))
                        }
                }
            },
            toggleDots: function() {
                this.container.toggleClass("no_dots")
                },
            set_cookie: function(type) {
                if (this.settings.cookies === false)
                    return false;
                if (this.settings.cookies[type] === false)
                    return false;
                switch (type) {
                case "selected":
                    if (this.settings.rules.multiple != false && this.selected_arr.length > 1) {
                        var val = Array();
                        $.each(this.selected_arr, function() {
                            val.push(this.attr("id"))
                            });
                        val = val.join(",")
                        } else
                        var val = this.selected ? this.selected.attr("id") : false;
                    $.cookie(this.settings.cookies.prefix + '_selected', val, this.settings.cookies.opts);
                    break;
                case "open":
                    var str = "";
                    this.container.find("li.open").each(function(i) {
                        str += this.id + ","
                    });
                    $.cookie(this.settings.cookies.prefix + '_open', str.replace(/,$/ig, ""), this.settings.cookies.opts);
                    break
                }
            },
            get_rollback: function() {
                var rb = {};
                if (this.context.remove && this.context.apply_to)
                    this.context.apply_to.children("a").removeClass("clicked");
                rb.html = this.container.html();
                if (this.context.remove && this.context.apply_to)
                    this.context.apply_to.children("a").addClass("clicked");
                rb.selected = this.selected ? this.selected.attr("id") : false;
                return rb
            },
            moved: function(what, where, how, is_new, is_copy, rb) {
                var what = $(what);
                var $parent = $(what).parents("ul:eq(0)");
                var $where = $(where);
                if (!rb) {
                    var rb = {};
                    rb[this.container.attr("id")] = this.get_rollback();
                    if (!is_new) {
                        var tmp = what.size() > 1 ? what.eq(0).parents(".tree:eq(0)") : what.parents(".tree:eq(0)");
                        if (tmp.get(0) != this.container.get(0)) {
                            tmp = tree_component.inst[tmp.attr("id")];
                            rb[tmp.container.attr("id")] = tmp.get_rollback()
                            }
                        delete tmp
                    }
                }
                if (how == "inside" && this.settings.data.async && this.get_node($where).hasClass("closed")) {
                    var _this = this;
                    return this.open_branch(this.get_node($where), true, function() {
                        _this.moved.apply(_this, [what, where, how, is_new, is_copy, rb])
                        })
                    }
                if (what.size() > 1) {
                    var _this = this;
                    var tmp = this.moved(what.eq(0), where, how, false, is_copy, rb);
                    what.each(function(i) {
                        if (i == 0)
                            return;
                        if (tmp) {
                            tmp = _this.moved(this, tmp.children("a:eq(0)"), "after", false, is_copy, rb)
                            }
                    });
                    return
                }
                if (is_copy) {
                    _what = what.clone();
                    _what.each(function(i) {
                        this.id = this.id + "_copy";
                        $(this).find("li").each(function() {
                            this.id = this.id + "_copy"
                        });
                        $(this).removeClass("dragged").find("a.clicked").removeClass("clicked ui-state-active").end().find("li.dragged").removeClass("dragged")
                        })
                    } else
                    _what = what;
                if (is_new) {
                    if (!this.settings.callback.beforecreate.call(null, this.get_node(what).get(0), this.get_node(where).get(0), how, this))
                        return false
                } else {
                    if (!this.settings.callback.beforemove.call(null, this.get_node(what).get(0), this.get_node(where).get(0), how, this))
                        return false
                }
                if (!is_new) {
                    var tmp = what.parents(".tree:eq(0)");
                    if (tmp.get(0) != this.container.get(0)) {
                        tmp = tree_component.inst[tmp.attr("id")];
                        if (tmp.settings.languages.length) {
                            var res = [];
                            if (this.settings.languages.length == 0)
                                res.push("." + tmp.current_lang);
                            else {
                                for (var i in this.settings.languages) {
                                    for (var j in tmp.settings.languages) {
                                        if (this.settings.languages[i] == tmp.settings.languages[j])
                                            res.push("." + this.settings.languages[i])
                                        }
                                }
                            }
                            if (res.length == 0)
                                return this.error("MOVE: NO COMMON LANGUAGES");
                            what.find("a").not(res.join(",")).remove()
                            }
                        what.find("a.clicked").removeClass("clicked ui-state-active")
                        }
                }
                what = _what;
                switch (how) {
                case "before":
                    $where.parents("ul:eq(0)").children("li.last").removeClass("last");
                    $where.parent().before(what.removeClass("last"));
                    $where.parents("ul:eq(0)").children("li:last").addClass("last");
                    break;
                case "after":
                    $where.parents("ul:eq(0)").children("li.last").removeClass("last");
                    $where.parent().after(what.removeClass("last"));
                    $where.parents("ul:eq(0)").children("li:last").addClass("last");
                    break;
                case "inside":
                    if ($where.parent().children("ul:first").size()) {
                        if (this.settings.rules.createat == "top")
                            $where.parent().children("ul:first").prepend(what.removeClass("last")).children("li:last").addClass("last");
                        else
                            $where.parent().children("ul:first").children(".last").removeClass("last").end().append(what.removeClass("last")).children("li:last").addClass("last")
                        } else {
                        what.addClass("last");
                        $where.parent().append("<ul/>").removeClass("leaf").addClass("closed");
                        $where.parent().children("ul:first").prepend(what)
                        }
                    if ($where.parent().hasClass("closed")) {
                        this.open_branch($where)
                        }
                    break;
                default:
                    break
                }
                if ($parent.find("li").size() == 0) {
                    var $li = $parent.parent();
                    $li.removeClass("open").removeClass("closed").addClass("leaf").children("ul").remove();
                    $li.parents("ul:eq(0)").children("li.last").removeClass("last").end().children("li:last").addClass("last");
                    this.set_cookie("open")
                    } else {
                    $parent.children("li.last").removeClass("last");
                    $parent.children("li:last").addClass("last")
                    }
                if (is_copy)
                    this.settings.callback.oncopy.call(null, this.get_node(what).get(0), this.get_node(where).get(0), how, this, rb);
                else if (is_new)
                    this.settings.callback.oncreate.call(null, this.get_node(what).get(0), ($where.is("ul") ? -1: this.get_node(where).get(0)), how, this, rb);
                else
                    this.settings.callback.onmove.call(null, this.get_node(what).get(0), this.get_node(where).get(0), how, this, rb);
                return what
            },
            error: function(code) {
                this.settings.callback.error.call(null, code, this);
                return false
            },
            lock: function(state) {
                this.locked = state;
                if (this.locked)
                    this.container.addClass("locked");
                else
                    this.container.removeClass("locked")
                },
            cut: function(obj) {
                if (this.locked)
                    return this.error("LOCKED");
                obj = obj ? this.get_node(obj) : this.container.find("a.clicked").filter(":first-child").parent();
                if (!obj || !obj.size())
                    return this.error("CUT: NO NODE SELECTED");
                this.copy_nodes = false;
                this.cut_nodes = obj
            },
            copy: function(obj) {
                if (this.locked)
                    return this.error("LOCKED");
                obj = obj ? this.get_node(obj) : this.container.find("a.clicked").filter(":first-child").parent();
                if (!obj || !obj.size())
                    return this.error("COPY: NO NODE SELECTED");
                this.copy_nodes = obj;
                this.cut_nodes = false
            },
            paste: function(obj, position) {
                if (this.locked)
                    return this.error("LOCKED");
                obj = obj ? this.get_node(obj) : this.selected;
                if (!obj || !obj.size())
                    return this.error("PASTE: NO NODE SELECTED");
                if (!this.copy_nodes && !this.cut_nodes)
                    return this.error("PASTE: NOTHING TO DO");
                var _this = this;
                if (position == "before") {
                    position = ref_node.parent().children().index(obj);
                    obj = obj.parents("li:eq(0)")
                    } else if (position == "after") {
                    position = obj.parent().children().index(obj) + 1;
                    obj = obj.parents("li:eq(0)")
                    } else if ((typeof position).toLowerCase() == "undefined" || position == "inside") {
                    position = (this.settings.rules.createat == "top") ? 0: obj.children("ul:eq(0)").children("li").size()
                    }
                if (this.copy_nodes && this.copy_nodes.size()) {
                    var ok = true;
                    obj.parents().andSelf().each(function() {
                        if (_this.copy_nodes.index(this) != -1) {
                            ok = false;
                            return false
                        }
                    });
                    if (!ok)
                        return this.error("Invalid paste");
                    if (!this.checkMove(this.copy_nodes, obj.children("a:eq(0)"), "inside"))
                        return false;
                    if (obj.children("ul").size() == 0)
                        var a = this.moved(this.copy_nodes, obj.children("a:eq(0)"), "inside", false, true);
                    else if (obj.children("ul:eq(0)").children("li:nth-child(" + (position + 1) + ")").size())
                        var a = this.moved(this.copy_nodes, obj.children("ul:eq(0)").children("li:nth-child(" + (position + 1) + ")").children("a:eq(0)"), "before", false, true);
                    else
                        var a = this.moved(this.copy_nodes, obj.children("ul:eq(0)").children("li:last").children("a:eq(0)"), "after", false, true);
                    this.copy_nodes = false
                }
                if (this.cut_nodes && this.cut_nodes.size()) {
                    var ok = true;
                    obj.parents().andSelf().each(function() {
                        if (_this.cut_nodes.index(this) != -1) {
                            ok = false;
                            return false
                        }
                    });
                    if (!ok)
                        return this.error("Invalid paste");
                    if (!this.checkMove(this.cut_nodes, obj.children("a:eq(0)"), "inside"))
                        return false;
                    if (obj.children("ul").size() == 0)
                        var a = this.moved(this.cut_nodes, obj.children("a:eq(0)"), "inside");
                    else if (obj.children("ul:eq(0)").children("li:nth-child(" + (position + 1) + ")").size())
                        var a = this.moved(this.cut_nodes, obj.children("ul:eq(0)").children("li:nth-child(" + (position + 1) + ")").children("a:eq(0)"), "before");
                    else
                        var a = this.moved(this.cut_nodes, obj.children("ul:eq(0)").children("li:last").children("a:eq(0)"), "after");
                    this.cut_nodes = false
                }
            },
            search: function(str) {
                var _this = this;
                if (!str || (this.srch && str != this.srch)) {
                    this.srch = "";
                    this.srch_opn = false;
                    this.container.find("a.search").removeClass("search ui-state-highlight")
                    }
                this.srch = str;
                if (!str)
                    return;
                if (this.settings.data.async) {
                    if (!this.srch_opn) {
                        var dd = $.extend({
                            "search": str
                        }, this.settings.data.async_data(false));
                        $.ajax({
                            type: this.settings.data.method,
                            url: this.settings.data.url,
                            data: dd,
                            dataType: "text",
                            success: function(data) {
                                _this.srch_opn = $.unique(data.split(","));
                                _this.search.apply(_this, [str])
                                }
                        })
                        } else if (this.srch_opn.length) {
                        if (this.srch_opn && this.srch_opn.length) {
                            var opn = false;
                            for (var j = 0; j < this.srch_opn.length; j++) {
                                if (this.get_node("#" + this.srch_opn[j]).size() > 0) {
                                    opn = true;
                                    var tmp = "#" + this.srch_opn[j];
                                    delete this.srch_opn[j];
                                    this.open_branch(tmp, true, function() {
                                        _this.search.apply(_this, [str])
                                        })
                                    }
                            }
                            if (!opn) {
                                this.srch_opn = [];
                                _this.search.apply(_this, [str])
                                }
                        }
                    } else {
                        var selector = "a";
                        if (this.settings.languages.length)
                            selector += "." + this.current_lang;
                        this.container.find(selector + ":contains('" + str + "')").addClass(this.settings.ui.theme_name == "themeroller" ? "search ui-state-highlight": "search");
                        this.srch_opn = false
                    }
                } else {
                    var selector = "a";
                    if (this.settings.languages.length)
                        selector += "." + this.current_lang;
                    this.container.find(selector + ":contains('" + str + "')").addClass(this.settings.ui.theme_name == "themeroller" ? "search ui-state-highlight": "search").parents("li.closed").each(function() {
                        _this.open_branch(this, true)
                        })
                    }
            },
            destroy: function() {
                this.container.unbind().find("li").die().find("a").die();
                this.container.removeClass("tree ui-widget ui-widget-content").children("ul").removeClass("tree-" + this.settings.ui.theme_name).find("li").removeClass("leaf").removeClass("open").removeClass("closed").removeClass("last").children("a").removeClass("clicked hover search ui-state-active ui-state-hover ui-state-highlight ui-state-default");
                if (this.cntr == tree_component.focused) {
                    for (var i in tree_component.inst) {
                        if (i != this.cntr && i != this.container.attr("id")) {
                            tree_component.inst[i].focus();
                            break
                        }
                    }
                }
                delete tree_component.inst[this.cntr];
                delete tree_component.inst[this.container.attr("id")];
                tree_component.cntr--
            }
        }
    }
})(jQuery);