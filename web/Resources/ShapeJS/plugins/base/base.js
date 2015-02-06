(function(){
	'use strict';

	// function(ShapeJS instance, Plugin Options as defined during definition)
	// global 'this' is the plugins objects
	ShapeJS.plugins['base'] = function(shapejs, opt){
		var options = shapejs.options;
		var canvas = shapejs.canvas;

		/*
			Load font-awesome library from the path set
		*/
		var fontLib = options['font-awesome-path'];
		var link = document.createElement('link');
		link.rel = "stylesheet"
		if (fontLib == "default"){
			link.href = shapejs.options.shapejsPath+"../vendor/font-awesome/css/font-awesome.min.css"
		}else{
			link.href = options['font-awesome-path'];
		}
		ShapeJS.util.getElement('head').appendChild(link);

		/*
			add basic actions for the canvas
		*/
		/* Create File Action */
		var file = shapejs.toolbar.fileActions = document.createElement('ul');
		shapejs.addToolbarActions(shapejs.createToolbarActions('File', file));

		/* Create Edit Actions */
		var edit = shapejs.toolbar.editActions = document.createElement('ul');
		shapejs.addToolbarActions(shapejs.createToolbarActions('Edit', edit));

		var view = shapejs.toolbar.viewActions = document.createElement('ul');
		shapejs.addToolbarActions(shapejs.createToolbarActions('View', view));

		/* Base actions for every canvas*/
		var clearBtn = ShapeJS.util.createHTMLElement('<li>Clear Canvas</li>');
		ShapeJS.util.createButton(clearBtn);
		clearBtn.addEventListener('click', function(){
			canvas.clear().renderAll();
		})
		file.appendChild(clearBtn);

		file.appendChild(document.createElement('hr'));

		var importBtn = ShapeJS.util.createHTMLElement('<li>Import</li>');
		ShapeJS.util.createButton(importBtn);
		file.appendChild(importBtn);
		
		var exportBtn = ShapeJS.util.createHTMLElement('<li>Export PNG</li>');
		ShapeJS.util.createButton(exportBtn);
		if (!fabric.Canvas.supports('toDataURL')) {
      		exportBtn.disable(true);
    	}
		exportBtn.addEventListener('click', function(){
			window.open(canvas.toDataURL('png'));
			// window.open('data:image/svg+xml;utf8,'+encodeURIComponent(canvas.toSVG())); //SVG
		});
		file.appendChild(exportBtn);


		
		function removeObj(){
			if(canvas.getActiveGroup()){
	        	canvas.getActiveGroup().forEachObject(function(o){
	        		canvas.remove(o) 
	        	});
	  			canvas.discardActiveGroup().renderAll();
		    }else if(canvas.getActiveObject()){
	        	canvas.remove(canvas.getActiveObject());
		    }
		};

		/*
			Allow key handler features on the shapejs object in focus
		*/
		shapejs.keyHandles = {
			8: removeObj,
			46: removeObj
		}

		shapejs.onKeyDownHandler = function(event){
			var handles = shapejs.keyHandles;
			var key;
		    if(window.event){
		        key = window.event.keyCode;
		    }else{
		        key = event.keyCode;
		    }
			if (handles.hasOwnProperty(key)){
				handles[key](event);
			}else{

			}
		}



		/*
			add color input to toolbox
		*/
		shapejs.toolbox.colorInput = '<input style="width:25px" type="color" value="#000000">';
		shapejs.toolbox.colorInput = ShapeJS.util.createHTMLElement(shapejs.toolbox.colorInput);
		var primaryColor = shapejs.createToolboxButton(shapejs.toolbox.colorInput);
		shapejs.addToolboxButton(primaryColor);
	}
}());
