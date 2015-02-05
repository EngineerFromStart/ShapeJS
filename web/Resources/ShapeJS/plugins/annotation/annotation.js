(function(){
	'use strict'
	ShapeJS.plugins['annotation'] = function(shapejs, options){
		var canvas = shapejs.canvas;
		//=============================================================
		//==================Helper Functions===========================
		//=============================================================

		/*
			Types of brushes
		*/
		var brushes = {
			"Pencil":{cls: 'fa-pencil'}, 
			"Circle": {cls: 'fa-circle'},
			"Spray": {cls: 'fa-magic'}, 
			"Pattern": {cls: 'fa-leaf'},
			"hline":{cls: 'fa-bars'},
			"vline":{cls: 'fa-bars fa-rotate-90'},
			"square":{cls: 'fa-square'},
			"diamond":{cls: 'fa-square fa-rotate-45'}
		};

		/*
			Brushes used for annotation in the canvas
		*/
		function setBrush(value){
			if (!fabric.PatternBrush) {
				return;
			}

			brushDrop.style.display = 'block';

			if (value === 'vline') {
		    	var vLinePatternBrush = new fabric.PatternBrush(canvas);
			    vLinePatternBrush.getPatternSrc = function() {

					var patternCanvas = fabric.document.createElement('canvas');
					patternCanvas.width = patternCanvas.height = 10;
					var ctx = patternCanvas.getContext('2d');

					ctx.strokeStyle = this.color;
					ctx.lineWidth = 5;
					ctx.beginPath();
					ctx.moveTo(0, 5);
					ctx.lineTo(10, 5);
					ctx.closePath();
					ctx.stroke();

					return patternCanvas;
			    };
		      	canvas.freeDrawingBrush = vLinePatternBrush;
		    }else if (value === 'hline') {
		    	var hLinePatternBrush = new fabric.PatternBrush(canvas);
			    hLinePatternBrush.getPatternSrc = function() {

					var patternCanvas = fabric.document.createElement('canvas');
					patternCanvas.width = patternCanvas.height = 10;
					var ctx = patternCanvas.getContext('2d');

					ctx.strokeStyle = this.color;
					ctx.lineWidth = 5;
					ctx.beginPath();
					ctx.moveTo(5, 0);
					ctx.lineTo(5, 10);
					ctx.closePath();
					ctx.stroke();

					return patternCanvas;
			    };
		      	canvas.freeDrawingBrush = hLinePatternBrush;
		    }else if (value === 'square') {
		    	var squarePatternBrush = new fabric.PatternBrush(canvas);
			    squarePatternBrush.getPatternSrc = function() {
					var squareWidth = 10, squareDistance = 2;

					var patternCanvas = fabric.document.createElement('canvas');
					patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
					var ctx = patternCanvas.getContext('2d');

					ctx.fillStyle = this.color;
					ctx.fillRect(0, 0, squareWidth, squareWidth);

					return patternCanvas;
			    };
		      	canvas.freeDrawingBrush = squarePatternBrush;
		    }else if (value === 'diamond') {
		      	var diamondPatternBrush = new fabric.PatternBrush(canvas);
			    diamondPatternBrush.getPatternSrc = function() {

					var squareWidth = 10, squareDistance = 5;
					var patternCanvas = fabric.document.createElement('canvas');
					var rect = new fabric.Rect({
					width: squareWidth,
					height: squareWidth,
					angle: 45,
					fill: this.color
					});

					var canvasWidth = rect.getBoundingRectWidth();

					patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
					rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

					var ctx = patternCanvas.getContext('2d');
					rect.render(ctx);

					return patternCanvas;
				};
				canvas.freeDrawingBrush = diamondPatternBrush;
		    }else {
		      canvas.freeDrawingBrush = new fabric[value + 'Brush'](canvas);
		    }

		    /*
				Set props again for new brush
		    */
			if (canvas.freeDrawingBrush) {
				canvas.freeDrawingBrush.color = shapejs.toolbox.colorInput.value;
			}

		};

		/*
			
		*/
		function onActivateBrush(){
			if (canvas.isDrawingMode){
				brushBtn.classList.add('shapejs-toolbox-active');
				shapejs.clearSubToonbarActions();
				setToolbar();
			}else{
				brushBtn.classList.remove('shapejs-toolbox-active');
				shapejs.clearSubToonbarActions();
			}
		}

		/*
			the Toolbar to set when button is invoked
		*/
		function setToolbar(){
			var slider = document.createElement('span');
			slider.innerHTML = "W ";
			slider.appendChild(ShapeJS.util.createHTMLElement('<i class="fa fa-arrows-v"></i>'));
			
			var sliderVal = 5;
			var sliderInput = ShapeJS.util.createHTMLElement('<input type="range" value="'+sliderVal+'" min="0" max="150">')
			sliderInput.style.verticalAlign = 'middle';
			slider.appendChild(sliderInput);

			var inputDisplay = document.createElement('span');
			inputDisplay.innerHTML = sliderVal;
			slider.appendChild(inputDisplay);

			//create annotation width
			sliderInput.onchange = function() {
				canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
				this.nextSibling.innerHTML = this.value;
			};
			shapejs.addSubToolbarActions(slider);
		}

		/*
			function to create the dropdown buttons
			inits the brush and closes the dropdown menu
		*/
		function createDropDownButton(name){
			var btnStr = '<li id="'+name+'"><i class="fa '+brushes[name].cls+'"></i></li>';
			var btn = ShapeJS.util.createHTMLElement(btnStr);
			ShapeJS.util.createButton(btn);
			btn.addEventListener('click', function(){
				canvas.isDrawingMode = true;
				setBrush(name);
				onActivateBrush();
				brushDrop.style.display = 'none';
			})
			return btn;
		}

		//=============================================================
		//==================Make Brushes and its events================
		//=============================================================

		/*
			Make the drop down and dropdown button
		*/
		var brushDrop = document.createElement('ul');
		brushDrop.style.display = 'none';

		var brushBtn = '<i class="fa fa-pencil"></i>';
		brushBtn = ShapeJS.util.createHTMLElement(brushBtn);
		brushBtn = shapejs.createToolboxActions(brushBtn);//creates an element wrapped in <li>	

		var dropTimeout;

		//add brushes to DD, Set their button handlers
		for (var name in brushes){
			brushDrop.appendChild(createDropDownButton(name));
		}
		
		//set main buttons handlers
		ShapeJS.util.createButton(brushBtn);

		brushBtn.addEventListener('click', function(){
			canvas.isDrawingMode = !canvas.isDrawingMode;
			onActivateBrush();
		});

		/* Display the DD*/
		brushBtn.addEventListener('mousedown', function(){
			dropTimeout = setTimeout(function(){
				brushDrop.style.display = 'block';
			}, 400)
		});

		brushBtn.addEventListener('mouseup', function(){
			clearTimeout(dropTimeout);
		});

		var brush = shapejs.createToolboxActions(brushBtn, brushDrop);
		shapejs.addToolboxActions(brush);

		//==============================================================
		//===============set other annotation properties=================
		//==============================================================

		shapejs.toolbox.colorInput.onchange = function(){
			canvas.freeDrawingBrush.color = this.value;
		}
	}
}());