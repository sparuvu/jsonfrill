jsonFrill v0.1
A jQuery plugin to render the formatted, collapsible and color coded json.

[Demo](http://sparuvu.github.io/jsonfrill)

##Usage
* $(target).jsonFrill();
	* Replaces the contents of `target` with formatted json
* $(target).jsonFrill(sourceJson);
	* Formats the `sourceJson` and replaces the content of the `target`
* $(target).jsonFrill(sourceJson, options);
	* Formats the `sourceJson` and replaces the content of the `target`
	* Consumes the external options.
	* ######Options Defaults
		* Collapse	: false
    * tab : 2
    * toolbar : true

##Dependencies
Depends on jQuery >= 1.10.2
