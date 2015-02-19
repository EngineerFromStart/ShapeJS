(function(){
	function setStrokeToolbar(shapejs){
		var canvas = shapejs.canvas;



		//stroke width

		//stroke color

		//
	};

	function setShapeToolbar(shapejs){


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
		shapesBtn = shapejs.createToolboxButton(shapesBtn);

		shapesBtn.activate = function(){
			shapejs.clearSubToolbarActions();
			setShapeToolbar(shapejs);
		}

		shapesBtn.deactivate = function(){
			shapejs.clearSubToolbarActions;
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
		strokeBtn = shapejs.createToolboxButton(strokeBtn);//creates an element wrapped in <li>	

		//Stroke button handlers
		strokeBtn.activate = function(){
			shapejs.clearSubToolbarActions();
			setStrokeToolbar(shapejs);
		}

		strokeBtn.deactivate = function(){
			shapejs.clearSubToolbarActions();
		}

		shapejs.addToolboxButton(shapesBtn, 'shape');
		shapejs.addToolboxButton(strokeBtn, 'stroke');
	};
}())