(function(){
	var canvas;
	/*
		Helper functions
	*/
	var copiedObjects = [];
	function onKeyDownHandler(event) {
	    //event.preventDefault();
	    var key;
	    if(window.event){
	        key = window.event.keyCode;
	    }
	    else{
	        key = event.keyCode;
	    }
	    
	    switch(key){
	        // Copy (Ctrl+C)
	        case 67: // Ctrl+C
	            if(ableToShortcut()){
	                if(event.ctrlKey){
	                    event.preventDefault();
	                    copy();
	                }
	            }
	            break;
	        // Paste (Ctrl+V)
	        case 86: // Ctrl+V
	            if(ableToShortcut()){
	                if(event.ctrlKey){
	                    event.preventDefault();
	                    paste();
	                }
	            }
	            break;            
	        default:
	            // TODO
	            break;
	    }
	}

	function ableToShortcut(){
	    /*
	    TODO check all cases for this
	    
	    if($("textarea").is(":focus")){
	        return false;
	    }
	    if($(":text").is(":focus")){
	        return false;
	    }
	    */
	    return true;
	}

	function copy(){
		copiedObjects = new Array();
	    if(canvas.getActiveGroup()){
	        for (var i in canvas.getActiveGroup().objects){
	        	copiedObjects.push(canvas.getActiveGroup().objects[i]);
	        }
	    }else if(canvas.getActiveObject()){
        	copiedObjects.push(canvas.getActiveObject());
	    }
	}

	function paste(){
	    if(copiedObjects.length > 0){
	        for(var i in copiedObjects){
	        	var object = copiedObjects[i].clone();
	        	//fabric.util.object.clone()
				object.set('top',object.getTop()+10);
				object.set('left',object.getLeft()+10);
	        	canvas.add(object);
	        }                    
	    }
	    canvas.renderAll();    
	}

	/*
		
	*/
	ShapeJS.plugins['SCCP'] = function(shapejs, options){

		canvas = shapejs.canvas;
		document.onkeydown = onKeyDownHandler;
		/*

		*/

		var file = document.createElement('ul');

		var clearBtn = document.createElement('li');
		clearBtn.innerHTML = "Clear";
		shapejs.createShapeJSButton(clearBtn);
		clearBtn.addEventListener('click', function(){
			canvas.clear().renderAll();
		})
		file.appendChild(clearBtn);


		var importBtn = document.createElement('li');
		importBtn.innerHTML = "Import";
		shapejs.createShapeJSButton(importBtn);
		file.appendChild(importBtn);

		
		var exportBtn = document.createElement('li');
		exportBtn.innerHTML = "Export PNG";
		shapejs.createShapeJSButton(exportBtn);
		if (!fabric.Canvas.supports('toDataURL')) {
      		exportBtn.disable(true);
    	}
		exportBtn.addEventListener('click', function(){
			window.open(canvas.toDataURL('png'));
			// window.open('data:image/svg+xml;utf8,'+encodeURIComponent(canvas.toSVG())); //SVG
		});
		file.appendChild(exportBtn);

		shapejs.addToolbarActions(shapejs.createToolbarActions('File', file));



		/*
			EDIT Sections
		*/

		var edit = document.createElement('ul');

		var copyBtn = shapejs.createHTMLElement('<li>Copy<span class="shapejs-short-cut">Ctrl+C</span></li>');
		shapejs.createShapeJSButton(copyBtn);
		copyBtn.addEventListener('click', function(){
			copy();
		})
		edit.appendChild(copyBtn);


		var pasteBtn = shapejs.createHTMLElement('<li>Paste<span class="shapejs-short-cut">Ctrl+V</span></li>');
		shapejs.createShapeJSButton(pasteBtn);
		pasteBtn.addEventListener('click', function(){
			paste();
		})
		edit.appendChild(pasteBtn);

		shapejs.addToolbarActions(shapejs.createToolbarActions('Edit', edit));
	}
}());