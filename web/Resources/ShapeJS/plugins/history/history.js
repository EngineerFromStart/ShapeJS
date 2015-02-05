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
		//undo only if you are in the middle of the stack
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
		//redo only if there are more items in stack
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
			//so the stack gets cleaned when changes are made after an undo
			shapejs.historyStack = shapejs.historyStack.slice(0, shapejs.historyIndex+1);
			
			var canvasJSON = JSON.stringify(shapejs.canvas);
			shapejs.historyStack.push(canvasJSON);
			shapejs.historyIndex += 1;
		}
	}

	ShapeJS.plugins['history'] = function(shapejs, options){
		var historyStack = shapejs.historyStack = [];
		var historyIndex = shapejs.historyIndex = -1;//no indexed items yet

		var changingHistory = shapejs.changingHistory = false;

		var canvas = shapejs.canvas;

		getState(shapejs)//add the very first state

		var keyHandles = {
			90: function(event){
				if (event.ctrlKey){
					event.preventDefault();
					undo(shapejs);
				}
			},
			89: function(event){
				if (event.ctrlKey){
					event.preventDefault();
					redo(shapejs);
				}
			}
		}
		//key hanler for under/redo
		
		shapejs.keyHandles = ShapeJS.util.extend(shapejs.keyHandles, keyHandles);
		shapejs.onkeydown = shapejs.onKeyDownHandler;

		//click handler for undo
		var undoBtn = ShapeJS.util.createHTMLElement('<li>Undo<span class="shapejs-short-cut">Ctrl+Z</span></li>');
		ShapeJS.util.createButton(undoBtn);
		undoBtn.addEventListener('click', function(){
			undo(shapejs);
		})
		shapejs.toolbar.editActions.appendChild(undoBtn);

		//click handler for undo
		var redoBtn = ShapeJS.util.createHTMLElement('<li>Redo<span class="shapejs-short-cut">Ctrl+Y</span></li>');
		ShapeJS.util.createButton(redoBtn);
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