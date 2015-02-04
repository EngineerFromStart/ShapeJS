(function(){

	/*
	-index used to keep track of where you are in history
	-changingHistory used to check if undo/redo is called, 
	 thus historystack doesnt get changed by canvas events
	-history stack holds all the history
	*/
	function undo(shapejs){
		var canvas = shapejs.canvas;

		shapejs.changingHistory = true;
		if (shapejs.historyIndex > 0){
			shapejs.historyIndex -= 1;
			var canvasJSON = shapejs.historyStack[shapejs.historyIndex];
			canvas.clear().renderAll();
			canvas.loadFromJSON(canvasJSON);
			canvas.renderAll();
		}
		shapejs.changingHistory = false;
	}

	function redo(shapejs){
		var canvas = shapejs.canvas;

		shapejs.changingHistory = true;
		if (shapejs.historyIndex < shapejs.historyStack.length - 1){
			shapejs.historyIndex += 1;
			var canvasJSON = shapejs.historyStack[shapejs.historyIndex];
			canvas.clear().renderAll();
			canvas.loadFromJSON(canvasJSON);
			canvas.renderAll();
		}
		shapejs.changingHistory = false;
	}

	//update the stack on object add/change/remove
	//unless its from undo/redo, else the stack will overflow
	function getState(shapejs, options){
		if (!shapejs.changingHistory){
			var canvasJSON = JSON.stringify(shapejs.canvas);
			shapejs.historyStack.push(canvasJSON);
			shapejs.historyIndex += 1;
		}
	}

		

	ShapeJS.plugins['history'] = function(shapejs, options){
		var historyStack = shapejs.historyStack = [];
		var historyIndex = shapejs.historyIndex = -1;

		var changingHistory = shapejs.changingHistory = false;

		var canvas = shapejs.canvas;

		getState(shapejs)

		//key hanler for under/redo
		function onKeyDownHandler(event) {
		    //event.preventDefault();
		    var key;
		    if(window.event){
		        key = window.event.keyCode;
		    }else{
		        key = event.keyCode;
		    }
		    
		    if (event.ctrlKey){
			    switch(key){
			        case 90: // undo Ctrl+C
	                    event.preventDefault();
	                    undo(shapejs);
			            break;
			        case 89: // redo Ctrl+V
	                    event.preventDefault();
	                    redo(shapejs);		
			            break;            
			        default:
			            // TODO
			            break;
			    }
			}
		}
		document.onkeydown = onKeyDownHandler;

		//click handler for undo/redo
		var undoBtn = shapejs.createHTMLElement('<li>Undo<span class="shapejs-short-cut">Ctrl+Z</span></li>');
		shapejs.createShapeJSButton(undoBtn);
		undoBtn.addEventListener('click', function(){
			undo(shapejs);
		})
		shapejs.toolbar.editActions.appendChild(undoBtn);

		var redoBtn = shapejs.createHTMLElement('<li>Redo<span class="shapejs-short-cut">Ctrl+Y</span></li>');
		shapejs.createShapeJSButton(redoBtn);
		redoBtn.addEventListener('click', function(){
			redo(shapejs);
		})

		//add event handler for history
		canvas.on('object:modified', function(options) {
			getState(shapejs, options);
		});

		canvas.on('object:added', function(options) {
			getState(shapejs, options);
		});

		canvas.on('object:removed', function(options) {
			getState(shapejs, options);
		});

		
		shapejs.toolbar.editActions.appendChild(redoBtn);

		shapejs.toolbar.editActions.appendChild(document.createElement('hr'));
	}
}());