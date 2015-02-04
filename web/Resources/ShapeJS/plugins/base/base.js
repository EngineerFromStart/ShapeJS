(function(){
	'use strict';

	// function(ShapeJS instance, Plugin Options as defined during definition)
	// global 'this' is the plugins objects
	ShapeJS.plugins['base'] = function(shapejs, opt){
		var options = shapejs.options;
		var canvas = shapejs.canvas;

		//Load font-awesome library from the path set
		var fontLib = options['font-awesome-path'];
		var link = document.createElement('link');
		link.rel = "stylesheet"
		if (fontLib == "default"){
			link.href = shapejs.options.shapejsPath+"../vendor/font-awesome/css/font-awesome.min.css"
		}else{
			link.href = options['font-awesome-path'];
		}
		shapejs.getEl('head').appendChild(link);

		/* Create File Action */
		var file = shapejs.toolbar.fileActions = document.createElement('ul');
		shapejs.addToolbarActions(shapejs.createToolbarActions('File', file));

		/* Create Edit Actions */
		var edit = shapejs.toolbar.editActions = document.createElement('ul');
		shapejs.addToolbarActions(shapejs.createToolbarActions('Edit', edit));

		/* Base actions for every canvas*/
		var clearBtn = shapejs.createHTMLElement('<li>Clear Canvas</li>');
		shapejs.createShapeJSButton(clearBtn);
		clearBtn.addEventListener('click', function(){
			canvas.clear().renderAll();
		})
		file.appendChild(clearBtn);

		file.appendChild(document.createElement('hr'));

		var importBtn = shapejs.createHTMLElement('<li>Import</li>');
		shapejs.createShapeJSButton(importBtn);
		file.appendChild(importBtn);
		
		var exportBtn = shapejs.createHTMLElement('<li>Export PNG</li>');
		shapejs.createShapeJSButton(exportBtn);
		if (!fabric.Canvas.supports('toDataURL')) {
      		exportBtn.disable(true);
    	}
		exportBtn.addEventListener('click', function(){
			window.open(canvas.toDataURL('png'));
			// window.open('data:image/svg+xml;utf8,'+encodeURIComponent(canvas.toSVG())); //SVG
		});
		file.appendChild(exportBtn);

		//add color input to toolbox
		shapejs.toolbox.colorInput = '<input style="width:25px" type="color" value="#000000">';
		shapejs.toolbox.colorInput = shapejs.createHTMLElement(shapejs.toolbox.colorInput);
		var primaryColor = shapejs.createToolboxActions(shapejs.toolbox.colorInput);
		shapejs.addToolboxActions(primaryColor);
	}
}());
