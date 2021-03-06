// Generated by CoffeeScript 1.6.3
(function() {
  define(['require', 'jquery', 'aloha', 'aloha/plugin', 'ui/ui', 'PubSub', 'jquery19', 'underscore', 'booktype'], 
    function(require, jQuery, Aloha, Plugin, Ui, PubSub, jQuery19, _, booktype) {

    var $ROOT, adoptedActions, makeItemRelay, squirreledEditable;
    var $ = jQuery;
    squirreledEditable = null;
 //   $ROOT = jQuery('body');
     $ROOT = jQuery('DIV.contentHeader');

    makeItemRelay = function(slot) {
      var ItemRelay;
      ItemRelay = (function() {
        function ItemRelay() {}

        ItemRelay.prototype.show = function() {
          return $ROOT.find(".action." + slot).removeClass('hidden');
        };

        ItemRelay.prototype.hide = function() {};

        ItemRelay.prototype.setActive = function(bool) {
          if (!bool) {
            $ROOT.find(".action." + slot).removeClass('active');
          }
          if (bool) {
            return $ROOT.find(".action." + slot).addClass('active');
          }
        };

        ItemRelay.prototype.setState = function(bool) {
          return this.setActive(bool);
        };

        ItemRelay.prototype.enable = function(bool) {
          if (bool == null) {
            bool = true;
          }
          if ($ROOT.find(".action." + slot).is('.btn')) {
            if (!bool) {
              $ROOT.find(".action." + slot).attr('disabled', 'disabled');
            }
            if (bool) {
              return $ROOT.find(".action." + slot).removeAttr('disabled');
            }
          } else {
            if (!bool) {
              $ROOT.find(".action." + slot).parent().addClass('disabled');
            }
            if (bool) {
              return $ROOT.find(".action." + slot).parent().removeClass('disabled');
            }
          }
        };

        ItemRelay.prototype.disable = function() {
          return this.enable(false);
        };

        ItemRelay.prototype.setActiveButton = function(a, b) {
          return;
          return console && console.log("" + slot + " TODO:SETACTIVEBUTTON:", a, b);
        };

        ItemRelay.prototype.focus = function(a) {
          return;
          return console && console.log("" + slot + " TODO:FOCUS:", a);
        };

        ItemRelay.prototype.foreground = function(a) {
          return;
          return console && console.log("" + slot + " TODO:FOREGROUND:", a);
        };

        return ItemRelay;

      })();
      return new ItemRelay();
    };

    var _previousTag = null;

    var disableOptions = function(tag) {
      var toolbar = require('toolbar/toolbar-plugin');

      // This list should be somehow configurable
      var _buttons = booktype.editor.data.settings.config.edit.toolbar;
      var _menus = booktype.editor.data.settings.config.edit.menu;
      
      // This creates problems with book heading block
      // if(_previousTag === tag) return;
      // _previousTag = tag;

      toolbar.enableToolbarAll();
      toolbar.enableMenuAll();

      // When focus is in headings
      if(_.indexOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], tag.toLowerCase()) != -1) {
        _.each(_buttons['H'], function(btn) {      
            toolbar.disableToolbar(btn);
        });

        _.each(_menus['H'], function(btn) {      
            toolbar.disableMenu(btn);
        });
      }

      // When focus is in preformated text
      if(_.indexOf(['pre'], tag.toLowerCase()) != -1) {
        _.each(_buttons['PRE'], function(btn) {      
            toolbar.disableToolbar(btn);
        });

        _.each(_menus['PRE'], function(btn) {      
            toolbar.disableMenu(btn);
        });
      }
    }


    adoptedActions = {};

    Ui.adopt = function(slot, type, settings) {
      var evt;
      evt = $.Event('aloha.toolbar.adopt');
      $.extend(evt, {
        params: {
          slot: slot,
          type: type,
          settings: settings
        },
        component: null
      });
      PubSub.pub(evt.type, evt);
      if (evt.isDefaultPrevented()) {
        evt.component.adoptParent(toolbar);
        return evt.component;
      }
      adoptedActions[slot] = settings;
      return makeItemRelay(slot);
    };

    var fireOnToolbar = function(editable) {
        var $ROOT2 = jQuery('DIV.contentHeader');

        var changeHeading = function(evt) {
          var $el, hTag, rangeObject;

          //evt.preventDefault();

          $el = jQuery(this);
          hTag = $el.attr('data-tagname');

          rangeObject = Aloha.Selection.getRangeObject();
          rangeObject.select();
          
          Aloha.execCommand('FormatBlock', false, hTag);

          jQuery('.currentHeading')[0].innerHTML = $el[0].innerHTML;

          disableOptions(hTag);

          return true;
        };
// bio 2
        $ROOT2.find(".action.changeHeading").on('click', changeHeading);
//        $ROOT.on('click', '.action.changeHeading', changeHeading);
        // $ROOT2.on('mousedown', ".action", function(evt) {
        //   return evt.stopPropagation();
        // });


      return jQuery.each(adoptedActions, function(slot, settings) {
        var selector;
        selector = ".action." + slot;
// bio 2
        jQuery(selector, $ROOT2).on('click', function(evt) {
          var $target;
          evt.preventDefault();
          Aloha.activeEditable = Aloha.activeEditable || squirreledEditable;
          $target = jQuery(evt.target);
          if (!($target.is(':disabled') || $target.parent().is('.disabled'))) {
            this.element = this;
            return settings.click.bind(this)(evt);
          }
        });

        if (settings.preview) {
          jQuery(selector, $ROOT).on('mouseenter', function(evt) {
            var $target;
            $target = jQuery(evt.target);
            if (!($target.is(':disabled') || $target.parent().is('.disabled'))) {
              return settings.preview.bind(this)(evt);
            }
          });
        }
        if (settings.unpreview) {
          return jQuery(selector, $ROOT).on('mouseleave', function(evt) {

            var $target;
            $target = jQuery(evt.target);
            if (!($target.is(':disabled') || $target.parent().is('.disabled'))) {
              return settings.unpreview.bind(this)(evt);
            }
          });
        }
      });      
    }
/*
    IE9 has problems with this
    Aloha.bind('aloha-ready', function(event, editable) {
      fireOnToolbar(editable);
    });
*/

   // This is needed because of IE9

   jQuery19(document).on('booktype-ui-panel-active', function($evt, name, panel) {
        if(name == 'edit') {
          var editable = Aloha.getEditableById('contenteditor');
          fireOnToolbar(editable);
        }

   });

    /*
     register the plugin with unique name
    */

    return Plugin.create("toolbar", {
      init: function() {
        var toolbar;
        toolbar = this;

        Aloha.bind('aloha-editable-activated', function(event, data) {
          return squirreledEditable = data.editable;
        });

        var $ROOT3 = jQuery('DIV.contentHeader');
        
        return PubSub.sub('aloha.selection.context-change', function(data) {
          var active, button, currentHeading, el, h, headings, tagnames;

          el = data.range.commonAncestorContainer;

          button = $ROOT3.find('.headings button').first();
          currentHeading = $ROOT3.find('.headings .currentHeading');
          headings = $ROOT3.find('.action.changeHeading');
          tagnames = [];
          headings.each(function() {
            return tagnames.push($(this).attr('data-tagname').toUpperCase());
          });
          h = $(el).parentsUntil('.aloha-editable').andSelf();
          h = h.filter(tagnames.join(',')).first();

          if (!h.length) {
            button.prop('disabled', true);
            return currentHeading.html(headings.first().text());
          } else {
            button.prop('disabled', false);
            active = $.grep(headings, function(elem, i) {
              return $(elem).attr('data-tagname').toUpperCase() === h[0].tagName;
            });
            if (active.length) {
              disableOptions($(active[0]).attr('data-tagname'));

              return currentHeading.html($(active[0]).html());
            } else {
              return currentHeading.html(headings.first().text());
            }
          }
        });
      },
      childVisible: function(childComponent, visible) {
        var evt;
        evt = $.Event('aloha.toolbar.childvisible');
        evt.component = childComponent;
        evt.visible = visible;
        return PubSub.pub(evt.type, evt);
      },
      childFocus: function(childComponent) {
        var evt;
        evt = $.Event('aloha.toolbar.childfocus');
        evt.component = childComponent;
        return PubSub.pub(evt.type, evt);
      },
      childForeground: function(childComponent) {
        var evt;
        evt = $.Event('aloha.toolbar.childforeground');
        evt.component = childComponent;
        return PubSub.pub(evt.type, evt);
      },
      disableToolbar: function(action) {
        jQuery('DIV.contentHeader button.'+action).prop('disabled', true);
      },
      enableToolbar: function(action) {
        jQuery('DIV.contentHeader button.'+action).prop('disabled', false);
      },
      enableToolbarAll: function() {
        var _buttons = booktype.editor.data.settings.config.edit.toolbar['ALL'];
        var $this = this;

        _.each(_buttons, function(btn) {      
            $this.enableToolbar(btn);
        });
      },
      disableMenu: function(action) {

         var $item = jQuery('DIV.contentHeader .action.'+action).parent();

         if(!$item.hasClass('disabled'))
            $item.addClass('disabled');
      },
      enableMenu: function(action) {
         var $item = jQuery('DIV.contentHeader .action.'+action).parent();

         if($item.hasClass('disabled'))
            $item.removeClass('disabled');        
      },
      enableMenuAll: function() {
        var _menus = booktype.editor.data.settings.config.edit.menu['ALL'];
        var $this = this;

        _.each(_menus, function(btn) {      
            $this.enableMenu(btn);
        });        
      },

      /*
       toString method
      */

      toString: function() {
        return "toolbar";
      }
    });
  });

}).call(this);
