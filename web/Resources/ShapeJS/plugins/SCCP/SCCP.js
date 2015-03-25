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
		shapejs.disableHistoryStackChange = true;
		shapejs.canvas.add(shapejs.selectionEl);
		shapejs.canvas.setActiveObject(shapejs.selectionEl);
    }
	
	function removeSelectionEl(shapejs){
		shapejs.canvas.remove(shapejs.selectionEl);
		shapejs.disableHistoryStackChange = false;
	}
	
	function getSelectedEl(shapejs){
		var selectedEl;
		//remove previous el
		if (shapejs.selectionEl){
			removeSelectionEl(shapejs);
			shapejs.selectionEl = null;
		}
		//so the selected el is the elemnent that was last selected and not Crop type
		
		return shapejs.canvas.getActiveObject();
	}
	
    function setToolbar(shapejs){
    	var canvas = shapejs.canvas;
    			
		//Create the Proper Crop Shapes
		var shapes = document.createElement('li');
		var square = ShapeJS.util.createHTMLElement('<a><i class="fa fa-square"></i></a>');
		var circle = ShapeJS.util.createHTMLElement('<a><i class="fa fa-circle"></i></a>');
		
		ShapeJS.util.appendMultipleChildren(shapes, [
			square, circle
		]);
 		square = ShapeJS.util.createButton(square);
 		square.addEventListener('click', function(e){
 			var selectedEl = shapejs.selectedEl;

 			if (!selectedEl) return;
 			
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
 			var selectedEl = shapejs.selectedEl;
 			if (!selectedEl) return;
 			
 			var radius = selectedEl.width < selectedEl.height ? selectedEl.width*selectedEl.scaleX/2 : selectedEl.height*selectedEl.scaleY/2;
 			var scaleX = selectedEl.width < selectedEl.height ? 1 : selectedEl.width/selectedEl.height;
 			var scaleY = selectedEl.width < selectedEl.height ? selectedEl.height/selectedEl.width : 1;
 			shapejs.selectionEl = new fabric.SelectionCircle({
 				radius: radius,
 				scaleX: scaleX,
 				scaleY: scaleY,
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
 		
 		//add the two shapes
        shapejs.addSubToolbarActions(shapes, 'selectionShapes');
    }
    
    function cutOrCopyPartOfObj(shapejs, cut){
    	var canvas = shapejs.canvas;
    	var copiedObjects = shapejs.copiedObjects;
    	
    	var selEl = shapejs.selectedEl;
    	
    	var selectionEl = shapejs.selectionEl;
    	
    	removeSelectionEl(shapejs)
		selectionEl.setOpacity(0);
    	
		//hide all els except selected El
    	var tempOpacities = [];
		var canvasObjs = canvas.getObjects();
		for (var x = 0; x < canvasObjs.length; x++){
			tempOpacities.push(canvasObjs[x].getOpacity());
			if (canvasObjs[x] != selEl)
				canvasObjs[x].opacity = 0;
		}
		canvas.renderAll();
		
		var context = canvas.getContext();
		
		//==================================================================
    	//modify context to just show what the SelectionEl overlaps
	    context.save();
	    context.globalCompositeOperation = 'destination-in';
	    context.beginPath();
	    shapejs.selectionEl.render(context);
	    context.fill();
	    context.restore();
    	
		//make image from data of new context
	    //and trim the edges into new image and add to copied object
		new fabric.Image.fromURL(canvas.getElement().toDataURL(), function(canvasImg){
			var canvasImgData = canvasImg.toDataURL({
				format: 'png',
				left: selectionEl.left,
				top: selectionEl.top,
				width: selectionEl.width*selectionEl.scaleX + 2*selectionEl.strokeWidth*selectionEl.scaleX,
				height: selectionEl.height*selectionEl.scaleY+ 2*selectionEl.strokeWidth*selectionEl.scaleY,
			})
			
			new fabric.Image.fromURL(canvasImgData, function(oImg){
				copiedObjects.push(oImg);
			});
		});	
		//==================================================================
		
		
		//==================================================================
		if (cut){
			canvas.renderAll();
			context = canvas.getContext();
			//clear from context
			context.save();
		    context.globalCompositeOperation = 'destination-out';
		    context.beginPath();
		    selectionEl.render(context);
		    context.fill();
		    context.restore();
			
			//get required area of cleared context. Then create and replace new image			
			new fabric.Image.fromURL(canvas.getElement().toDataURL(), function(oImg){
				var newOrigImgData = oImg.toDataURL({
					format: 'png',
					left: selEl.left,
					top: selEl.top,
					width: selEl.width*selEl.scaleX + 2*selEl.strokeWidth*selEl.scaleX,
					height: selEl.height*selEl.scaleY + 2*selEl.strokeWidth*selEl.scaleY
				})
				
				new fabric.Image.fromURL(newOrigImgData, function(newImg){					
					newImg.left = selEl.left;
					newImg.top = selEl.top;
					
					shapejs.disableHistoryStackChange = false;
					canvas.insertAt(newImg, canvas.getObjects().indexOf(selEl), true);
					shapejs.disableHistoryStackChange = true;
					selEl = newImg;
					
					canvas.renderAll();
				});				
			});
		}
		
		//==================================================================
		
		
    	for (var x = 0; x < canvasObjs.length; x++){
			if (canvasObjs[x] != selEl)
				canvasObjs[x].opacity = tempOpacities[x];
		}
		canvas.renderAll();
		shapejs.disableHistoryStackChange = false;
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
			cutOrCopyPartOfObj(shapejs, true);
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
			cutOrCopyPartOfObj(shapejs, false);
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
        //needed to render all obj (check pasteObject)
	    canvas.renderAll();  
	}
	
	function pasteObject(shapejs, canvasObj){
		var canvas = shapejs.canvas;
		var object;
    	//Objects became async since 1.2.2
		canvas.renderOnAddRemove = false;//for performace on rendering many objects
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
    	canvas.renderOnAddRemove = true;
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
		
		canvas.on('object:selected', function(options){
			if (options.target.type.indexOf('selection') == -1){
 				shapejs.selectedEl = getSelectedEl(shapejs);
 			};
		})
				
		selection.activate = function(){
			canvas.isSelectionMode = true;
			shapejs.clearSubToolbarActions();
			
			setToolbar(shapejs);
		}
		selection.deactivate = function(){
			removeSelectionEl(shapejs);
			shapejs.clearSubToolbarActions();
			canvas.isSelectionMode = false;
		}
		shapejs.addToolboxButton(selection, 'selection');
		
	}
}());