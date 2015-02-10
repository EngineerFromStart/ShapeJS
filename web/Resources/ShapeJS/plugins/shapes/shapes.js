(function(){
	ShapeJS.plugins['shapes'] = function(shapejs, options){
		var canvas = shapejs.canvas;

		var strokeBtn = '<i class="fa fa-square-o"></i>';
		strokeBtn = ShapeJS.util.createHTMLElement(strokeBtn);
		strokeBtn.style.position = 'relative';
		strokeBtn.style.fontSize = '26px';
		var strokeBtnObj = ShapeJS.util.createHTMLElement('<i class="fa fa-square"></i>');
		strokeBtnObj.style.position = 'absolute';
		strokeBtnObj.style.top = '28%';
		strokeBtnObj.style.left = '28%';
		strokeBtnObj.style.fontSize = '11px';
		strokeBtn.appendChild(strokeBtnObj);
		strokeBtn = shapejs.createToolboxButton(strokeBtn);//creates an element wrapped in <li>	

		/*
			Add an text object if non is selected
		*/
		strokeBtn.activate = function(){
			shapejs.clearSubToolbarActions();
		}

		strokeBtn.deactivate = function(){
			shapejs.clearSubToolbarActions();
		}

		shapejs.addToolboxButton(strokeBtn, 'stroke');
	};
}())