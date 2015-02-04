(function(){
	//Brushes for annotation
	function createBrushes(canvas){
		if (fabric.PatternBrush) {
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
	  	}
	}

	ShapeJS.plugins['annotation'] = function(shapejs, options){
		var canvas = shapejs.canvas;
		//Construct and modify dom as needed DOM

		//=============================================================
		//==================Make Brushes and its events================
		//=============================================================
		
		//create the brushes and its handler
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
		createBrushes(canvas, brushes);

		//Make the drop down
		var brushDrop = document.createElement('ul');
		brushDrop.style.display = 'none';
		var dropTimeout;

		for (var name in brushes){
			var btnStr = '<li id="'+name+'"><i class="fa '+brushes[name].cls+'"></i></li>';
			var btn = shapejs.createHTMLElement(btnStr);
			shapejs.createShapeJSButton(btn);
			btn.addEventListener('click', function(){
				brushDrop.style.display = 'none';
			})
			brushDrop.appendChild(btn);
		}

		// make the main brush button
		var brushBtn = '<i class="fa fa-pencil"></i>';
		brushBtn = shapejs.createHTMLElement(brushBtn);
		brushBtn = shapejs.createToolboxActions(brushBtn, brushDrop);
		
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
			}, 500)
		});
		brushBtn.addEventListener('mouseup', function(){
			clearTimeout(dropTimeout);
		});


		var brush = shapejs.createToolboxActions(brushBtn, brushDrop);
		shapejs.addToolboxActions(brush);

		//=====================================================================
		//=====================================================================
		//=====================================================================

		/*
		  var canvas = this.__canvas = new fabric.Canvas('c', {
		    isDrawingMode: true
		  });

		  fabric.Object.prototype.transparentCorners = false;

		  var drawingModeEl = $('drawing-mode'),
		      drawingOptionsEl = $('drawing-mode-options'),
		      drawingColorEl = $('drawing-color'),
		      drawingShadowColorEl = $('drawing-shadow-color'),
		      drawingLineWidthEl = $('drawing-line-width'),
		      drawingShadowWidth = $('drawing-shadow-width'),
		      drawingShadowOffset = $('drawing-shadow-offset'),
		      clearEl = $('clear-canvas');

		  clearEl.onclick = function() { canvas.clear() };

		  drawingModeEl.onclick = function() {
		    canvas.isDrawingMode = !canvas.isDrawingMode;
		    if (canvas.isDrawingMode) {
		      drawingModeEl.innerHTML = 'Cancel drawing mode';
		      drawingOptionsEl.style.display = '';
		    }
		    else {
		      drawingModeEl.innerHTML = 'Enter drawing mode';
		      drawingOptionsEl.style.display = 'none';
		    }
		  };

		  if (fabric.PatternBrush) {
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

		    var img = new Image();
		    img.src = '../assets/honey_im_subtle.png';

		    var texturePatternBrush = new fabric.PatternBrush(canvas);
		    texturePatternBrush.source = img;
		  }

		  $('drawing-mode-selector').onchange = function() {

		    if (this.value === 'hline') {
		      canvas.freeDrawingBrush = vLinePatternBrush;
		    }
		    else if (this.value === 'vline') {
		      canvas.freeDrawingBrush = hLinePatternBrush;
		    }
		    else if (this.value === 'square') {
		      canvas.freeDrawingBrush = squarePatternBrush;
		    }
		    else if (this.value === 'diamond') {
		      canvas.freeDrawingBrush = diamondPatternBrush;
		    }
		    else if (this.value === 'texture') {
		      canvas.freeDrawingBrush = texturePatternBrush;
		    }
		    else {
		      canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
		    }

		    if (canvas.freeDrawingBrush) {
		      canvas.freeDrawingBrush.color = drawingColorEl.value;
		      canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
		      canvas.freeDrawingBrush.shadowBlur = parseInt(drawingShadowWidth.value, 10) || 0;
		    }
		  };

		  drawingColorEl.onchange = function() {
		    canvas.freeDrawingBrush.color = this.value;
		  };
		  drawingShadowColorEl.onchange = function() {
		    canvas.freeDrawingBrush.shadowColor = this.value;
		  };
		  drawingLineWidthEl.onchange = function() {
		    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
		    this.previousSibling.innerHTML = this.value;
		  };
		  drawingShadowWidth.onchange = function() {
		    canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 0;
		    this.previousSibling.innerHTML = this.value;
		  };
		  drawingShadowOffset.onchange = function() {
		    canvas.freeDrawingBrush.shadowOffsetX =
		    canvas.freeDrawingBrush.shadowOffsetY = parseInt(this.value, 10) || 0;
		    this.previousSibling.innerHTML = this.value;
		  };

		  if (canvas.freeDrawingBrush) {
		    canvas.freeDrawingBrush.color = drawingColorEl.value;
		    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
		    canvas.freeDrawingBrush.shadowBlur = 0;
		  }
		  */
	}
}());