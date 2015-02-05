(function(){
	'use strict'
	/* Helper functions */

	/*
		cut the objects into an array to be pasted later
	*/
	function cut(shapejs){
		var canvas = shapejs.canvas;
		var copiedObjects = shapejs.copiedObjects = new Array();

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
	}

	/*
		copy the objects into an array to be pasted later
	*/
	function copy(shapejs){
		var canvas = shapejs.canvas;
		var copiedObjects = shapejs.copiedObjects = new Array();
	    if(canvas.getActiveGroup()){
	        for (var i in canvas.getActiveGroup().objects){
	        	copiedObjects.push(canvas.getActiveGroup().objects[i]);
	        }
	    }else if(canvas.getActiveObject()){
        	copiedObjects.push(canvas.getActiveObject());
	    }
	}

	/*
		clone and add the coppied objects onto the canvas
	*/
	function paste(shapejs){
		var canvas = shapejs.canvas;
		var copiedObjects = shapejs.copiedObjects;
	    if(copiedObjects.length > 0){
	        for(var i in copiedObjects){
	        	var object;
	        	//Objects became async since 1.2.2
	        	if (fabric.util.getKlass(copiedObjects[i].type).async) {
					copiedObjects[i].clone(function (clone) {
						clone.set({
							left: clone.getLeft()+10,
							top: clone.getTop()+10
						});
						object = clone;
					});
				}else{
					object = copiedObjects[i].clone();
					object.set('top',object.getTop()+10);
					object.set('left',object.getLeft()+10);
				}
	        	//fabric.util.object.clone()
	        	canvas.add(object);
	        }                    
	    }
	    canvas.renderAll();  
	}

	/*
		Adds the buttons for proper copy and paste
	*/
	ShapeJS.plugins['SCCP'] = function(shapejs, options){
		shapejs.copiedObjects = [];
		var canvas = shapejs.canvas;

		//document.onkeydown = onKeyDownHandler;
		var keyHandles = {
			88: function(event){
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
		var cutBtn = ShapeJS.util.createHTMLElement('<li>Cut<span class="shapejs-short-cut">Ctrl+C</span></li>');
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
	}
}());