(function(){
	'use strict'
	//Brushes used for annotation in the canvas
	function setBrush(shapejs, value){
		var canvas = shapejs.canvas;
		if (!fabric.PatternBrush) {
			return;
		}
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


		if (canvas.freeDrawingBrush) {
			canvas.freeDrawingBrush.color = shapejs.toolbox.colorInput.value;
		}
	}

	ShapeJS.plugins['annotation'] = function(shapejs, options){
		var canvas = shapejs.canvas;
		//Construct and modify dom as needed DOM

		//=============================================================
		//==================Make Brushes and its events================
		//=============================================================
		
		//Type of brushes
		var brushes = {
			"Pencil":{
				cls: 'fa-pencil'
			}, 
			"Circle": {
				cls: 'fa-circle'
			},
			"Spray": {
				cls: 'fa-magic'
			}, 
			"Pattern": {
				cls: 'fa-leaf'
			},
			"hline":{
				cls: 'fa-bars'
			},
			"vline":{
				cls: 'fa-bars fa-rotate-90'
			},
			"square":{
				cls: 'fa-square'
			},
			"diamond":{
				cls: 'fa-square fa-rotate-45'
			}
		};

		//Make the drop down and its handlers for the brushes
		var brushDrop = document.createElement('ul');
		brushDrop.style.display = 'none';
		var dropTimeout;

		for (var name in brushes){
			var btnStr = '<li id="'+name+'"><i class="fa '+brushes[name].cls+'"></i></li>';
			var btn = shapejs.createHTMLElement(btnStr);
			shapejs.createShapeJSButton(btn);
			btn.addEventListener('click', function(){
				canvas.isDrawingMode = true;
				setBrush(shapejs, this.id);
				brushDrop.style.display = 'none';
			})
			brushDrop.appendChild(btn);
		}

		// make the main dropdown button with proper events
		var brushBtn = '<i class="fa fa-pencil"></i>';
		brushBtn = shapejs.createHTMLElement(brushBtn);
		brushBtn = shapejs.createToolboxActions(brushBtn);//creates an element wrapped in <li>
		
		shapejs.createShapeJSButton(brushBtn);

		brushBtn.addEventListener('click', function(){
			canvas.isDrawingMode = !canvas.isDrawingMode;
			if (canvas.isDrawingMode){
				brushBtn.classList.add('shapejs-toolbox-active');
			}else{
				brushBtn.classList.remove('shapejs-toolbox-active');
			}
		});

		brushBtn.addEventListener('mousedown', function(){
			dropTimeout = setTimeout(function(){
				brushDrop.style.display = 'block';
			}, 400)
		});

		brushBtn.addEventListener('mouseup', function(){
			clearTimeout(dropTimeout);
		});

		//add them all
		var brush = shapejs.createToolboxActions(brushBtn, brushDrop);
		shapejs.addToolboxActions(brush);

		//set other annotation color
		shapejs.toolbox.colorInput.onchange = function(){
			canvas.freeDrawingBrush.color = this.value;
		}

		var slider = document.createElement('span');
		slider.appendChild(shapejs.createHTMLElement('<i class="fa fa-arrows-v"></i>'));
		var sliderInput = shapejs.createHTMLElement('<input type="range" value="5" min="0" max="150">')
		slider.appendChild(sliderInput);
		slider.appendChild(document.createElement('span'));
		//create annotation width
		sliderInput.onchange = function() {
			canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
			this.nextSibling.innerHTML = this.value;
		};
		shapejs.addSubToolbarActions(slider);
	}
}());