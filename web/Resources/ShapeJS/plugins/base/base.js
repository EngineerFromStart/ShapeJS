(function(){
	ShapeJS.plugins['base'] = function(shapejs, options){
		var options = shapejs.options;

		//Load font-awesome library 
		var fontLib = options['font-awesome-path'];
		var link = document.createElement('link');
		link.rel = "stylesheet"
		if (fontLib == "default"){
			link.href = shapejs.options.shapejsPath+"../vendor/font-awesome/css/font-awesome.min.css"
		}else{
			link.href = options['font-awesome-path'];
		}
		shapejs.getEl('head').appendChild(link);

		//add color to toolbox
		shapejs.colorInput = '<input style="width:25px" type="color" value="#005E7A">';
		shapejs.colorInput = shapejs.createHTMLElement(shapejs.colorInput);

		//Add the drop downs for type of brush

		var primaryColor = shapejs.createToolboxActions(shapejs.colorInput);
		shapejs.addToolboxActions(primaryColor);
	}
}());
