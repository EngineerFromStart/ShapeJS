(function(){
	'use strict'
	/* Helper functions */

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
				}
	        	//fabric.util.object.clone()
				object.set('top',object.getTop()+10);
				object.set('left',object.getLeft()+10);
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

		//Keys Handler for copy and paste
		function onKeyDownHandler(event) {
		    var key;
		    if(window.event){
		        key = window.event.keyCode;
		    }else{
		        key = event.keyCode;
		    }
		    
		    if (event.ctrlKey){

				console.log('why');
			    switch(key){
			        case 67: // Copy Ctrl+C
	                    event.preventDefault();
	                    copy(shapejs);
			            break;
			        case 86: // Paste Ctrl+V
	                    event.preventDefault();
	                    paste(shapejs);		
			            break;            
			        default:
			            // TODO
			            break;
			    }
			}
		}
		document.onkeydown = onKeyDownHandler;
		
		/* EDIT Sections, button handlers for copy and paste */
		var copyBtn = shapejs.createHTMLElement('<li>Copy<span class="shapejs-short-cut">Ctrl+C</span></li>');
		shapejs.createShapeJSButton(copyBtn);
		copyBtn.addEventListener('click', function(){
			copy(shapejs);
		})
		shapejs.toolbar.editActions.appendChild(copyBtn);


		var pasteBtn = shapejs.createHTMLElement('<li>Paste<span class="shapejs-short-cut">Ctrl+V</span></li>');
		shapejs.createShapeJSButton(pasteBtn);
		pasteBtn.addEventListener('click', function(){
			paste(shapejs);
		})
		shapejs.toolbar.editActions.appendChild(pasteBtn);
	}
}());