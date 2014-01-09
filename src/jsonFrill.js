;(function ( $, window, document, undefined ) {
	$.fn.jsonFrill = function(jsonSource, options) {
		var jf = {}, 
			_indentationLevel = 1, 
			lineBreak = "</br>", 
			seperator = " : ",
			objOpenBrace = $('<span />').addClass('jf-obj-open-brace').text('{')[0].outerHTML
			objCloseBrace = $('<span />').addClass('jf-obj-close-brace').text('}')[0].outerHTML
			arrOpenBrace = $('<span />').addClass('jf-arr-close-brace').text('[')[0].outerHTML
			arrCloseBrace = $('<span />').addClass('jf-arr-close-brace').text(']')[0].outerHTML
			$pre = $('<pre />').css('margin', 0),
			$ellipses = $('<span />').addClass('jf-ellipses jf-hide').text('...');
			
		jf.settings = $.extend({
			'TAB': '..'
        }, options);
        
		function processPrimitive(key, value, type) {
			var value = $('<span />').addClass('jf-value  jf-' + type).text(seperator + value)[0].outerHTML; 
			return $pre.clone().html($('<div />').addClass('jf-prop').html(getKey(key) + value)[0].outerHTML)[0].outerHTML;
		}
		
		function addSpaces() {
			var emptyString = "";
			for(var i = 0; i< _indentationLevel; i++) {
				if(i % 2 == 0) {
					emptyString += "  ";
					continue;					
				}
				emptyString += "| ";
			}
			return $('<span />').addClass('jf-indents').text(emptyString)[0].outerHTML;
		}
		
		function getKey(key, jfClass) {
			jfClass = jfClass || "";
			if(jfClass) {
			    var key = $('<span />').addClass('jf-key').html(key)[0].outerHTML
			    return $('<span />').addClass(jfClass).html(addSpaces() + key)[0].outerHTML
			}
			return $('<span />').addClass('jf-key ' + jfClass).html(addSpaces() + key)[0].outerHTML	
		}
		
		function processNonPrimitive(openBrace, closeBrace, key, value) {
		    var temp = getKey(key, "jf-collapsible-title") 
            _indentationLevel++;                        
            temp += seperator + openBrace + $ellipses.clone()[0].outerHTML + lineBreak + process(value, true);
            _indentationLevel--;
            temp +=  addSpaces() + closeBrace;
            return $pre.clone().addClass('jf-collapsible').html(temp)[0].outerHTML;
		}
		
		function process(obj, flag) {
			var str = "";
			$.each(obj, function(key, value) {				
				switch($.type(value)) {
					case "object":
						str += processNonPrimitive(objOpenBrace, objCloseBrace, key, value);
						break;					
					case "array":
						str += processNonPrimitive(arrOpenBrace, arrCloseBrace, key, value);
						break;
					case "date":						
						str += processPrimitive(key, value, "date"); 
						flag = false;
						break;
					case "boolean": 
						str += processPrimitive(key, value, "boolean");
						flag = false;
						break;
					case "number": 
						str += processPrimitive(key, value, "number");
						flag = false;
						break;
					case "string": 
						str += processPrimitive(key, value, "string");
						flag = false;
						break;
					default: 
						break;		
				}		
			});			
			return str;
		}
		
		function bindings() {
		    $('.jf-collapsible-title').on('click', function(e){
                e.preventDefault();
                $(this).closest('pre.jf-collapsible').children('pre').slideToggle();
                $(this).siblings('.jf-ellipses').fadeToggle('jf-hide');
            });
                
            $('#jf-formattedJSON').find("*").hover(function(e){
                $('pre.jf-highlight').removeClass('jf-highlight');
                  $(this).closest('pre.jf-collapsible').addClass('jf-highlight');
                  e.preventDefault();
                }, function(e){
                  $(this).closest('pre.jf-collapsible').removeClass('jf-highlight');
                  e.preventDefault();
            }); 
		}
		
		return this.each(function() {
			try {
				var json = $.parseJSON(jsonSource) || $.parseJSON($(this).text());
			}catch(ex) {
				if(console && console.log) {
					console.log("Invalid Json "+ex);
				}
				return;
			}
			var str = objOpenBrace + process(json, false);
			_indentationLevel--;
			str += addSpaces() + objCloseBrace;
			$(this).html($pre.clone().addClass('jf-collapsible').attr('id', 'jf-formattedJSON').html(str));
			
			bindings();
		});
	}
})(jQuery, window, document);	
