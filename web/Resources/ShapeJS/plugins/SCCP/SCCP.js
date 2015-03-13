(function(){
	'use strict'
	/* Helper functions */
	fabric.SelectionRect = fabric.util.createClass(fabric.Rect, {
	  type: 'selectionRect',
	  initialize: function(options) {
	    options || (options = { });

	    this.callSuper('initialize', options);
	  }
	});

	fabric.SelectionCircle = fabric.util.createClass(fabric.Circle, {
	  type: 'selectionCircle',
	  initialize: function(options) {
	    options || (options = { });

	    this.callSuper('initialize', options);
	  }
	});
	
	function addSelectionEl(shapejs){
		//add new one
		shapejs.canvas.add(shapejs.selectionEl);
    }
	
	function removeSelectionEl(shapejs){
		shapejs.canvas.remove(shapejs.selectionEl);
		shapejs.selectionEl = null;
	}
	
	function getSelectedEl(shapejs){
		var selectedEl;
		//remove previous el
		if (shapejs.selectionEl){
			removeSelectionEl(shapejs);
		}
		//so the selected el is the elemnent that was last selected and not Crop type
		if (shapejs.canvas.getActiveObject() && shapejs.canvas.getActiveObject().type.indexOf('selection') == -1){
			selectedEl = shapejs.canvas.getActiveObject();
		}
		return selectedEl;
	}
	
    function setToolbar(shapejs){
    	var canvas = shapejs.canvas;
    	
		shapejs.selectedEl = null;
		
		//Create the Proper Crop Shapes
		var shapes = document.createElement('li');
		var square = ShapeJS.util.createHTMLElement('<a><i class="fa fa-square"></i></a>');
		var circle = ShapeJS.util.createHTMLElement('<a><i class="fa fa-circle"></i></a>');
		
		ShapeJS.util.appendMultipleChildren(shapes, [
			square, circle
		]);
 		square = ShapeJS.util.createButton(square);
 		square.addEventListener('click', function(e){
 			var selectedEl = shapejs.selectedEl = getSelectedEl(shapejs);
 			
 			if (!shapejs.selectedEl) return;
 			
 			shapejs.selectionEl = new fabric.SelectionRect({
 				left: selectedEl.left,
 	            top: selectedEl.top,
 	            width: selectedEl.width,
 	            height: selectedEl.height,
 	            scaleX: selectedEl.scaleX,
 	            scaleY: selectedEl.scaleY,
 	            fill: 'rgba(0,0,0,0.3)',
 	            stroke: '#ccc',
 	            strokeDashArray: [2, 2],
 	            borderColor: '#36fd00',
 	            cornerColor: 'green',
 	            hasRotatingPoint: false,
 	            lockScalingFlip: true
 			});
 			
 			addSelectionEl(shapejs);
 		});

 		circle = ShapeJS.util.createButton(circle);
 		circle.addEventListener('click', function(e){
 			var selectedEl = shapejs.selectedEl = getSelectedEl(shapejs);
 			
 			if (!shapejs.selectedEl) return;
 			
 			shapejs.selectionEl = new fabric.SelectionCircle({
 				radius: selectedEl.width/2,
 				scaleX: selectedEl.scaleX,
 				scaleY: selectedEl.scaleY,
 				left: selectedEl.left,
 				top: selectedEl.top,
 				fill: 'rgba(0,0,0,0.3)',
 	            stroke: '#ccc',
 	            strokeDashArray: [2, 2],
 	            borderColor: '#36fd00',
 	            cornerColor: 'green',
 	            hasRotatingPoint: false,
 	            lockScalingFlip : true
 			});
 			
 			addSelectionEl(shapejs);
 		});
 		
 		//if a non crop object is selected, must remove crop El 
 		canvas.on('object:selected', function(options){
 			if (options.target.type.indexOf('selection') == -1){
 				removeSelectionEl(shapejs);
 			};
 		});   	
 		
 		//add the two shapes
        shapejs.addSubToolbarActions(shapes, 'selectionShapes');
    }
	
	/*
		cut the objects into an array to be pasted later
	*/
	function cut(shapejs){
		var canvas = shapejs.canvas;
		var copiedObjects = shapejs.copiedObjects = new Array();
		
		if (!shapejs.selectionEl){
		    if(canvas.getActiveGroup()){
	        	canvas.getActiveGroup().forEachObject(function(o){
	        		copiedObjects.push(o);
	        		canvas.remove(o) 
	        	});
	  			canvas.discardActiveGroup().renderAll();
		    }else if(canvas.getActiveObject()){
	        	copiedObjects.push(canvas.getActiveObject());
	        	canvas.remove(canvas.getActiveObject());
		    }
		    canvas.renderAll();
		}else{
			canvas.remove(shapejs.selectionEl);
			
			var selEl = shapejs.selectedEl;
			
			//get object wanting to copy and push to copiedObject
			var data = shapejs.selectedEl.toDataURL({
				format: 'png',
				left: shapejs.selectionEl.left-selEl.left,
				top: shapejs.selectionEl.top-selEl.top,
				width: shapejs.selectionEl.width*shapejs.selectionEl.scaleX,
				height: shapejs.selectionEl.height*shapejs.selectionEl.scaleY
			})
			
			var newImg = new fabric.Image.fromURL(data, function(oImg){
				copiedObjects.push(oImg);
			});
			
			
			//now hide all objects, create image from data url and show all objects again
			var tempOpacities = [];
			var canvasObjs = canvas.getObjects();
			for (var x = 0; x < canvasObjs.length; x++){
				tempOpacities.push(canvasObjs[x].getOpacity());
				if (canvasObjs[x] != selEl)
					canvasObjs[x].opacity = 0;
			}
			
			canvas.renderAll();
			
			var context = canvas.getContext();
			context.save();
			context.clearRect (
					shapejs.selectionEl.left,
					shapejs.selectionEl.top,
					shapejs.selectionEl.width*shapejs.selectionEl.scaleX,
					shapejs.selectionEl.height*shapejs.selectionEl.scaleY);
			context.restore();
						
			var origImgData = canvas.getElement().toDataURL();
			
			var newOrigCanvas = new fabric.Image.fromURL(origImgData, function(oImg){
				var newOrigImgData = oImg.toDataURL({
					format: 'png',
					left: shapejs.selectedEl.left,
					top: shapejs.selectedEl.top,
					width: selEl.width*selEl.scaleX + 2*selEl.strokeWidth*selEl.scaleX,
					height: selEl.height*selEl.scaleY + 2*selEl.strokeWidth*selEl.scaleY
				})
				
				var newOrigImg = new fabric.Image.fromURL(newOrigImgData, function(newImg){					
					newImg.left = selEl.left;
					newImg.top = selEl.top;
					
					shapejs.disableHistoryStackChange = false;
					canvas.insertAt(newImg, canvas.getObjects().indexOf(selEl), true);
					shapejs.disableHistoryStackChange = true;
					selEl = newImg;
					
					canvas.renderAll();
				});				
			});

			for (var x = 0; x < canvasObjs.length; x++){
				if (canvasObjs[x] != selEl)
					canvasObjs[x].opacity = tempOpacities[x];
			}
			canvas.renderAll();
			shapejs.disableHistoryStackChange = false;
		}
	}

	/*
		copy the objects into an array to be pasted later
	*/
	function copy(shapejs){
		var canvas = shapejs.canvas;
		var copiedObjects = shapejs.copiedObjects = new Array();
		if (!shapejs.selectionEl){
		    if(canvas.getActiveGroup()){
		        for (var i in canvas.getActiveGroup().objects){
		        	copiedObjects.push(canvas.getActiveGroup().objects[i]);
		        }
		    }else if(canvas.getActiveObject()){
	        	copiedObjects.push(canvas.getActiveObject());
		    }
		}else{
			canvas.remove(shapejs.selectionEl);
			
			//get data url
			var data = shapejs.selectedEl.toDataURL({
				format: 'png',
				left: shapejs.selectionEl.left-shapejs.selectedEl.left,
				top: shapejs.selectionEl.top-shapejs.selectedEl.top,
				width: shapejs.selectionEl.width*shapejs.selectionEl.scaleX,
				height: shapejs.selectionEl.height*shapejs.selectionEl.scaleY
			})
			
			var newImg = new fabric.Image.fromURL(data, function(oImg){
				copiedObjects.push(oImg);
			});
		}
	}

	/*
		clone and add the coppied objects onto the canvas
	*/
	function paste(shapejs){
		var canvas = shapejs.canvas;
		var copiedObjects = shapejs.copiedObjects;
        for(var i in copiedObjects){
        	pasteObject(shapejs, copiedObjects[i])
        }
	    canvas.renderAll();  
	}
	
	function pasteObject(shapejs, canvasObj){
		var canvas = shapejs.canvas;
		var object;
    	//Objects became async since 1.2.2
    	if (fabric.util.getKlass(canvasObj.type).async) {
    		canvasObj.clone(function (clone) {
				clone.set({
					left: clone.getLeft()+10,
					top: clone.getTop()+10
				});
				object = clone;
				canvas.add(clone);
			});
		}else{
			object = canvasObj.clone();
			object.set('top',object.getTop()+10);
			object.set('left',object.getLeft()+10);
			canvas.add(object);
		}
	}
	/*
		Adds the buttons for proper copy and paste
	*/
	ShapeJS.plugins['SCCP'] = function(shapejs, options){
		shapejs.copiedObjects = [];
		var canvas = shapejs.canvas;

		//document.onkeydown = onKeyDownHandler;
		var keyHandles = {
			88: function(event){ // Cut Ctrl+X
				if (event.ctrlKey){
					event.preventDefault();
					cut(shapejs);
				}
			},
			67: function(event){ // Copy Ctrl+C
				if (event.ctrlKey){
					event.preventDefault();
					copy(shapejs);
				}
			},
			86: function(event){ // Paste Ctrl+V
				if (event.ctrlKey){
					event.preventDefault();
					paste(shapejs);
				}
			}
		}
		//key hanler for under/redo
		
		shapejs.keyHandles = ShapeJS.util.extend(shapejs.keyHandles, keyHandles);
		document.onkeydown = shapejs.onKeyDownHandler;
		
		/* EDIT Sections, button handlers for copy and paste */
		var cutBtn = ShapeJS.util.createHTMLElement('<li>Cut<span class="shapejs-short-cut">Ctrl+X</span></li>');
		ShapeJS.util.createButton(cutBtn);
		cutBtn.addEventListener('click', function(){
			cut(shapejs);
		})
		shapejs.toolbar.editActions.appendChild(cutBtn);

		var copyBtn = ShapeJS.util.createHTMLElement('<li>Copy<span class="shapejs-short-cut">Ctrl+C</span></li>');
		ShapeJS.util.createButton(copyBtn);
		copyBtn.addEventListener('click', function(){
			copy(shapejs);
		})
		shapejs.toolbar.editActions.appendChild(copyBtn);


		var pasteBtn = ShapeJS.util.createHTMLElement('<li>Paste<span class="shapejs-short-cut">Ctrl+V</span></li>');
		ShapeJS.util.createButton(pasteBtn);
		pasteBtn.addEventListener('click', function(){
			paste(shapejs);
		})
		shapejs.toolbar.editActions.appendChild(pasteBtn);
		
		
		//add the selection box
		var selection = '<div style="width:25px; height:25px; border: 1px dashed;"></div>';
		selection = ShapeJS.util.createHTMLElement(selection);
		
		selection = shapejs.createToolboxButton(selection, {
			alt:"Selection"
		});
				
		selection.activate = function(){
			canvas.isSelectionMode = true;
			shapejs.clearSubToolbarActions();
			
			shapejs.disableHistoryStackChange = true;
			
			setToolbar(shapejs);
		}
		selection.deactivate = function(){
			removeSelectionEl(shapejs);
			shapejs.disableHistoryStackChange = false;
			shapejs.clearSubToolbarActions();
			canvas.isSelectionMode = false;
		}
		shapejs.addToolboxButton(selection, 'selection');
	}
}());