(function(){
	'use strict';

	// function(ShapeJS instance, Plugin Options as defined during definition)
	// global 'this' is the plugins objects
	ShapeJS.plugins['base'] = function(shapejs, opt){
		var options = shapejs.options;
		var canvas = shapejs.canvas;

		//=======================================================
		//======Load font-awesome library from the path set======
		//=======================================================
		var fontLib = options['font-awesome-path'];
		var link = document.createElement('link');
		link.rel = "stylesheet"
		if (fontLib == "default"){
			link.href = shapejs.options.shapejsPath+"../vendor/font-awesome/css/font-awesome.min.css"
		}else{
			link.href = options['font-awesome-path'];
		}
		ShapeJS.util.getElement('head').appendChild(link);

		
		//
		//auto select newly added objects, causes some issues with other events that may occur
		/*canvas.on('object:added', function(options){
			canvas.setActiveObject(options.target);
		});*/
		
		//=======================================================
		//=============add basic actions for the canvas==========
		//=======================================================
		/* Create File Action */
		var file = shapejs.toolbar.fileActions = document.createElement('ul');
		shapejs.addToolbarActions(shapejs.createToolbarActions('File', file));

		var clearBtn = ShapeJS.util.createHTMLElement('<li>Clear Canvas</li>');
		ShapeJS.util.createButton(clearBtn);
		clearBtn.addEventListener('click', function(){
			canvas.clear().renderAll();
		})
		file.appendChild(clearBtn);

		file.appendChild(document.createElement('hr'));

		var importBtn = ShapeJS.util.createHTMLElement('<li>Import</li>');
		//file.appendChild(importBtn);
		importBtn = ShapeJS.util.createButton(importBtn);
		importBtn.disable(true);
		
		var exportBtn = ShapeJS.util.createHTMLElement('<li>Export PNG</li>');
		file.appendChild(exportBtn);
		exportBtn = ShapeJS.util.createButton(exportBtn);
		if (!fabric.Canvas.supports('toDataURL')) {
      		exportBtn.disable(true);
    	}
		exportBtn.addEventListener('click', function(){
			window.open(canvas.toDataURL('png'));
			// window.open('data:image/svg+xml;utf8,'+encodeURIComponent(canvas.toSVG())); //SVG
		});

		/* Create Edit Actions */
		var edit = shapejs.toolbar.editActions = document.createElement('ul');
		shapejs.addToolbarActions(shapejs.createToolbarActions('Edit', edit));

		var removeBtn = ShapeJS.util.createHTMLElement('<li>Remove object<span class="shapejs-short-cut">Del</span></li>');
		edit.appendChild(removeBtn);
		removeBtn = ShapeJS.util.createButton(removeBtn);
		removeBtn.addEventListener('click', function(){
			removeObj();
		})
		edit.appendChild(document.createElement('hr'));

		/* Create View Actions */
		var view = shapejs.toolbar.viewActions = document.createElement('ul');
		//shapejs.addToolbarActions(shapejs.createToolbarActions('View', view));
		
		
		function removeObj(e){
			if(canvas.getActiveGroup()){
	        	canvas.getActiveGroup().forEachObject(function(o){
	        		canvas.remove(o) 
	        	});
	  			canvas.discardActiveGroup().renderAll();
		    }else if(canvas.getActiveObject()){
	        	canvas.remove(canvas.getActiveObject());
		    }
		};
		
		function disableBack(e){
			var target = (e.target) ? e.target : e.srcElement;
			if (e.keyCode === 8){
		        if ((target.tagName.toLowerCase() != "input" && target.tagName.toLowerCase() != "textarea") && target !== undefined) {
					e.preventDefault();
		        }
			}
		};

		//============================================================
		//=Allow key handler features on the shapejs object in focus==
		//============================================================
		shapejs.keyHandles = {
			8: disableBack,//backspace
			46: removeObj//delete
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

		//=======================================================
		//================add Canvas Resize Handler==============
		//=======================================================
		var isResizing = false;
		var resizeContext;
		function enableHandling(e){
			isResizing = true;
			resizeContext = this.value;
		}
		function resizeCanvas(e){
			if (!isResizing){
				return
			}
			
			var element = shapejs.canvasDOM;			
			var elemRect = element.getBoundingClientRect();
		    var width = e.clientX - elemRect.left;
		    var height = e.clientY - elemRect.top;
		    		    
		    
		    if (resizeContext == "dragW"){
		    	shapejs.canvas.setWidth(width);
		    }else if(resizeContext == "dragH"){
		    	shapejs.canvas.setHeight(height);
		    }else{
			    shapejs.canvas.setWidth(width);
			    shapejs.canvas.setHeight(height);
		    }

			canvas.renderAll();
		}	

		function disableHandling(e){
			isResizing = false;
			resizeContext = null;
		}
		if (shapejs.options.canvas.rescale){
			//add DOM for resize
			var dragH = ShapeJS.util.createHTMLElement('<div class="dragH"></div>');
			dragH.value = "dragH";
			shapejs.canvas.wrapperEl.appendChild(dragH);
			
			var dragW = ShapeJS.util.createHTMLElement('<div class="dragW"></div>');
			dragW.value = "dragW";
			shapejs.canvas.wrapperEl.appendChild(dragW);
			
			var dragHW = ShapeJS.util.createHTMLElement('<div class="dragHW"></div>');
			dragHW.value = "dragHW";
			shapejs.canvas.wrapperEl.appendChild(dragHW);			
			
			dragH.addEventListener('mousedown', enableHandling);
			dragW.addEventListener('mousedown', enableHandling);
			dragHW.addEventListener('mousedown', enableHandling);
			
			document.addEventListener('mousemove', resizeCanvas);
			document.addEventListener('mousemove', resizeCanvas);
			document.addEventListener('mousemove', resizeCanvas);
			
			dragH.addEventListener('mouseup', disableHandling);
			dragW.addEventListener('mouseup', disableHandling);
			dragHW.addEventListener('mouseup', disableHandling);
		}
	}
}());
