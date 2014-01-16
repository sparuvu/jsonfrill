/*!
 * jQuery jsonFrill plugin v0.1
 * https://github.com/sparuvu/jsonFrill
 *
 * Released under the MIT license
 * https://raw.github.com/sparuvu/jsonFrill/master/LICENSE
 *
 * Date: 2014-1-9
 */

;(function ( $, window, document, undefined ) {
    $.fn.jsonFrill = function(options, jsonSource) {
        var jf = jf || {};
        jf.settings = $.extend({
            collapse: false,
            tabSize: 2
        }, options);

        var _indentationLevel = 1,
            lineBreak = "</br>",
            seperator = " : ",
            braces = {
              "object": {
                  open: '<span class="jf-open-brace">{</span>',
                  close: '<span class="jf-close-brace">}</span>'
              },
              "array": {
                  open: '<span class="jf-open-brace">[</span>',
                  close: '<span class="jf-close-brace">]</span>'
              }
            },
            $ellipses = '<span class="jf-ellipses jf-hide">...</span>',
            TAB_SIZE = (function(){var tab = "";for(i = 1;i < jf.settings.tabSize; i++){tab += " ";} return tab;}()),
            SPACES = addSpaces();

        function processPrimitive(key, value, type) {
            return '<div class="jf-prop">' + getKey(key) + seperator + '<span class="jf-value jf-' + type +'">' + value + '</span></div>';
        }

        function addSpaces() {
            var emptyString = "";
            for(var i = 0; i< _indentationLevel; i++) {
                emptyString += "| " + TAB_SIZE;
            }
            return emptyString;
        }

        function getKey(key, jfClass) {
            if(jfClass) {
                return '<span class="'+jfClass+'">'+SPACES + '<span class="jf-key jf-collapse">' + key + '</span></span>';
            }
            return '<span class="jf-key">' + SPACES + key + '</span>';            
        }

        function processNonPrimitive(openBrace, closeBrace, key, value) {
            var temp = "";
            SPACES = addSpaces(++_indentationLevel);
            var str = process(value, true);
            SPACES = addSpaces(--_indentationLevel);
            if(str) {
                temp = getKey(key, "jf-collapsible-title") + seperator + openBrace + $ellipses + lineBreak + str + SPACES + closeBrace;
            } else {
                temp = getKey(key) + seperator + openBrace + " " + closeBrace;
            }
            return '<div class="jf-collapsible">'+temp+'</div>';
        }

        function process(obj, flag) {
            var str = "";
            if($.isEmptyObject(obj)) {
                return false;
            }
            for (var key in obj) {
                var type = $.type(obj[key]);
                if(type == "object" || type == "array") {
                    str += processNonPrimitive(braces[type].open, braces[type].close, key, obj[key]);
                } else {
                    str += processPrimitive(key, obj[key], type);
                    flag = false;
                }
            }
            return str;
        }

        function toggleObjects($obj, collapse) {
            $obj.each(function() {
                var $this = $(this);
                 if(collapse) {
                    $this.closest('div.jf-collapsible').children('div').toggle();
                } else {
                    $this.closest('div.jf-collapsible').children('div').slideToggle(100);
                }
                $this.siblings('.jf-ellipses').fadeToggle('fast');
                $this.children('.jf-key').toggleClass('jf-collapse');
            });
        }

        function bindings() {
            $("#jf-formattedJSON").on('click', '.jf-collapsible-title, .jf-parent-brace', function(e){
                e.preventDefault();
                toggleObjects($(this));
            });

            $('div.jf-prop').hover(function(e) {
                  $(this).closest('.jf-collapsible').addClass('jf-highlight');
                  e.preventDefault();
                },
                function(e) {
                  $(this).closest('.jf-collapsible').removeClass('jf-highlight');
                  e.preventDefault();
            });
        }

        return this.each(function() {
            console.time("Frill");
            try {
                if(jsonSource) {
                    if($.type(jsonSource) == "object" || $.type(jsonSource) == "array") {
                        json = jsonSource;
                    } else {
                        jsonSource = jsonSource.trim();
                        json = jsonSource.length > 0 ? $.parseJSON(jsonSource) : {} ;
                    }
                } else {
                    json = $(this).text().trim();
                    json = json.length > 0 ? $.parseJSON(json) : {} ;
                }
            } catch(ex) {
                if(console && console.log) {
                    console.log("Invalid Json "+ex);
                }
                return;
            }
            var str = process(json, false), type = $.type(json);
            if(str) {
                SPACES = addSpaces(--_indentationLevel);
                str = $(braces[type].open).addClass('jf-parent-brace')[0].outerHTML + $ellipses + str + SPACES + braces[type].close;
                $(this).html('<div id="jf-formattedJSON" class="jf-collapsible">'+ str +'</div>');
            } else {
                $(this).html(braces[type].open + braces[type].close);
            }
            bindings();
            if(jf.settings.collapse) {
                toggleObjects($('#jf-formattedJSON .jf-collapsible-title'), true);
            }
            console.timeEnd("Frill");
        });
    };
})(jQuery, window, document);
