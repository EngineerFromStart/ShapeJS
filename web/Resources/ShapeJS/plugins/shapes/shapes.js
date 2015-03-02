(function(){
	function setStrokeToolbar(shapejs){
		var canvas = shapejs.canvas;



		//stroke width

		//stroke color

		//
	};

	function setShapeToolbar(shapejs){
		var canvas = shapejs.canvas;

		var shapes = document.createElement('li');
		var square = ShapeJS.util.createHTMLElement('<a><i class="fa fa-square"></i></a>');
		var circle = ShapeJS.util.createHTMLElement('<a><i class="fa fa-circle"></i></a>');
		var arrow = ShapeJS.util.createHTMLElement('<a><i class="fa fa-long-arrow-left"></i></a>');

		ShapeJS.util.appendMultipleChildren(shapes, [
			square, circle, arrow
		]);

		square = ShapeJS.util.createButton(square);
		square.addEventListener('click', function(e){
			canvas.add(new fabric.Rect({
				width: 50,
				height: 50,
				left: canvas.width/2,
				top: canvas.height/2,
				fill: shapejs.toolbox.colorInput.value
			}));
		});

		circle = ShapeJS.util.createButton(circle);
		circle.addEventListener('click', function(e){
			canvas.add(new fabric.Circle({
				radius: 30,
				left: canvas.width/2,
				top: canvas.height/2,
				fill: shapejs.toolbox.colorInput.value
			}));
		});

		arrow = ShapeJS.util.createButton(arrow);
		arrow.addEventListener('click', function(){
			canvas.add(new fabric.Polygon([
				{x: 20, y: 0},
				{x: 20, y: 15},
				{x: 60, y: 15},
				{x: 60, y: 30},
				{x: 20, y: 30},
				{x: 20, y: 45},
				{x: 0, y: 23},
				{x: 20, y: 0}], {
				left: canvas.width/2,
				top: canvas.height/2,
				fill: shapejs.toolbox.colorInput.value
			}));
		});

		shapejs.addSubToolbarActions(shapes, 'shapes');		
	}

	ShapeJS.plugins['shapes'] = function(shapejs, options){
		var canvas = shapejs.canvas;

		/* SHAPES */
		var shapesBtn = '<i class="fa fa-square-o"></i>';
		shapesBtn = ShapeJS.util.createHTMLElement(shapesBtn);
		shapesBtn.style.position = 'relative';
		shapesBtn.style.fontSize = '18px';
		shapesBtn.style.left = '-10%';
		shapesCirc = ShapeJS.util.createHTMLElement('<i class="fa fa-circle-o"></i>');
		shapesCirc.style.position = 'absolute';
		shapesCirc.style.top = '40%';
		shapesCirc.style.left = '40%';
		shapesCirc.style.fontSize = '16px';
		shapesBtn.appendChild(shapesCirc);
		shapesBtn = shapejs.createToolboxButton(shapesBtn, {
			alt:"Add Shapes"
		});

		shapesBtn.activate = function(){
			shapejs.clearSubToolbarActions();
			setShapeToolbar(shapejs);
		}

		shapesBtn.deactivate = function(){
			shapejs.clearSubToolbarActions();
		}

		/* STROKE */
		var strokeBtn = '<i class="fa fa-square-o"></i>';
		strokeBtn = ShapeJS.util.createHTMLElement(strokeBtn);
		strokeBtn.style.position = 'relative';
		strokeBtn.style.fontSize = '26px';
		var strokeBtnObj = ShapeJS.util.createHTMLElement('<i class="fa fa-square"></i>');
		strokeBtnObj.style.position = 'absolute';
		strokeBtnObj.style.top = '20%';
		strokeBtnObj.style.left = '21%';
		strokeBtnObj.style.fontSize = '14px';
		strokeBtn.appendChild(strokeBtnObj);
		strokeBtn = shapejs.createToolboxButton(strokeBtn, {
			alt:"Add Stroke"
		});//creates an element wrapped in <li>	

		//Stroke button handlers
		strokeBtn.activate = function(){
			shapejs.clearSubToolbarActions();
			setStrokeToolbar(shapejs);
		}

		strokeBtn.deactivate = function(){
			shapejs.clearSubToolbarActions();
		}

		shapejs.addToolboxButton(shapesBtn, 'shape');
		//shapejs.addToolboxButton(strokeBtn, 'stroke');
	};
}())