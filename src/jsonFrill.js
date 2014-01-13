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
        var jf = {}, 
            _indentationLevel = 1, 
            lineBreak = "</br>", 
            seperator = $(document.createElement('span')).text(" : ")[0].outerHTML,
            braces = {
              "object": {                  
                  open: $(document.createElement('span')).addClass('jf-brace').text('{')[0].outerHTML,
                  close: $(document.createElement('span')).addClass('jf-brace').text('}')[0].outerHTML
              },  
              "array": {
                  open: $(document.createElement('span')).addClass('jf-brace').text('[')[0].outerHTML,
                  close: $(document.createElement('span')).addClass('jf-brace').text(']')[0].outerHTML
              }  
            },
            $pre = $(document.createElement('pre')).css('margin', 0),
            $ellipses = $(document.createElement('span')).addClass('jf-ellipses jf-hide').text('...');
            
        jf.settings = $.extend({
            'collapse': false
        }, options);
        
        function processPrimitive(key, value, type) {
            var valueHtml = $(document.createElement('span')).addClass('jf-value  jf-' + type).text(value)[0].outerHTML; 
            return $pre.clone().html($(document.createElement('div')).addClass('jf-prop').html(getKey(key) + seperator + valueHtml)[0].outerHTML)[0].outerHTML;
        }
        
        function addSpaces() {
            var emptyString = "";
            for(var i = 0; i< _indentationLevel; i++) {
                emptyString += "| " ;
            }
            return $(document.createElement('span')).addClass('jf-indents').text(emptyString)[0].outerHTML;
        }
        
        function getKey(key, jfClass) {
            jfClass = jfClass || "";
            if(jfClass) {
                var key = $(document.createElement('span')).addClass('jf-key jf-collapse').html(key)[0].outerHTML;
                return $(document.createElement('span')).addClass(jfClass).html(addSpaces() + key)[0].outerHTML;
            }
            return $(document.createElement('span')).addClass('jf-key ' + jfClass).html(addSpaces() + key)[0].outerHTML;    
        }
        
        function processNonPrimitive(openBrace, closeBrace, key, value) {
            var temp = "";
            _indentationLevel++;
            var str = process(value, true);
            _indentationLevel--;
            if(str) {
                temp = getKey(key, "jf-collapsible-title") + seperator + openBrace + $ellipses.clone()[0].outerHTML + lineBreak + str + addSpaces() + closeBrace;
            } else {
                temp = getKey(key) + seperator + openBrace + " " + closeBrace;
            }            
            return $pre.clone().addClass('jf-collapsible').html(temp)[0].outerHTML;                
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
                    $this.closest('pre.jf-collapsible').children('pre').toggle();
                } else {
                    $this.closest('pre.jf-collapsible').children('pre').slideToggle();
                }
                $this.siblings('.jf-ellipses').fadeToggle();                    
                $this.children('.jf-key').toggleClass('jf-collapse');
            });
        }
        
        function bindings() {
            $("#jf-formattedJSON").on('click', '.jf-collapsible-title, .jf-parent-brace', function(e){
                e.preventDefault();
                toggleObjects($(this));
            });
            
            $('div.jf-prop').hover(function(e) {
                  $(this).closest('pre.jf-collapsible').addClass('jf-highlight');
                  e.preventDefault();
                },
                function(e) {
                  $(this).closest('pre.jf-collapsible').removeClass('jf-highlight');
                  e.preventDefault();
            });
        }
        
        return this.each(function() {
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
                _indentationLevel--;
                str = $(braces[type].open).addClass('jf-parent-brace')[0].outerHTML + $ellipses.clone()[0].outerHTML + str + addSpaces() + braces[type].close;
                $(this).html($pre.clone().addClass('jf-collapsible').attr('id', 'jf-formattedJSON').html(str));                
            } else {
                $(this).html($pre.clone().html(braces[type].open + braces[type].close));                                    
            }            
            bindings();
            if(jf.settings.collapse) {
                toggleObjects($('#jf-formattedJSON .jf-collapsible-title'), true);
            }
        });
    };
})(jQuery, window, document);   
