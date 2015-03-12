(function(){
	function setToolbar(shapejs){
		var canvas = shapejs.canvas;
				
		function setObjectsAlign(){
			var alignTo = this.value;
			var x;
			var y;
			var curObj;
			
			if(canvas.getActiveGroup()){
		        for (var i in canvas.getActiveGroup().objects){
		        	curObj = canvas.getActiveGroup().objects[i];
		        	if (alignTo == 'left'){
		        		if (!x || x > curObj.left) x = curObj.left;
		        	}else if (alignTo == 'right'){
		        		if (!x || x < (curObj.left + curObj.width*curObj.scaleX)) x = curObj.left + curObj.width*curObj.scaleX;
		        	}else if (alignTo == 'top'){
		        		if (!y || y > curObj.top) y = curObj.top;
		        	}else if (alignTo == 'bottom'){
		        		if (!y || y < (curObj.top + curObj.height*curObj.scaleY)) y = curObj.top + curObj.height*curObj.scaleY;
		        	}else if (alignTo == 'center'){
		        		
		        	}
		        }
		        for (var i in canvas.getActiveGroup().objects){
		        	curObj = canvas.getActiveGroup().objects[i];
		        	if (alignTo == 'left' && x){
		        		curObj.left = x;
		        	}else if (alignTo == 'right' && x){
		        		curObj.left = x - curObj.width*curObj.scaleX;
		        	}else if (alignTo == 'top' && y){
		        		curObj.top = y;
		        	}else if (alignTo == 'bottom' && y){
		        		curObj.top = y - curObj.height*curObj.scaleY;
		        	}else if (alignTo == 'center'){
		        		
		        	}else{
		        		throw "no alignment matched";
		        	}
		        }
		    }else if(canvas.getActiveObject()){
		    	curObj = canvas.getActiveObject();
		    	if (alignTo == 'left'){
	        		curObj.left = 0;
	        	}else if (alignTo == 'right'){
	        		curObj.left = canvas.width - curObj.width*curObj.scaleX;
	        	}else if (alignTo == 'top'){
	        		curObj.top = 0;
	        	}else if (alignTo == 'bottom'){
	        		curObj.top = canvas.height - curObj.height*curObj.scaleY;
	        	}else if (alignTo == 'center'){
	        		
	        	}else{
	        		throw "no alignment matched";
	        	}
		    }		
			canvas.renderAll();
		}
		
		/*Text Align Code*/
		var align = document.createElement('li');
		var alignLeft = ShapeJS.util.createHTMLElement('<a><i class="fa fa-align-left"></i></a>');
		var alignRight = ShapeJS.util.createHTMLElement('<a><i class="fa fa-align-right"></i></a>');
		var alignCenter = ShapeJS.util.createHTMLElement('<a><i class="fa fa-align-center"></i></a>');
		var alignTop = ShapeJS.util.createHTMLElement('<a><i class="fa fa-align-left fa-rotate-90"></i></a>');
		var alignBottom = ShapeJS.util.createHTMLElement('<a><i class="fa fa-align-right fa-rotate-90"></i></a>');

		ShapeJS.util.appendMultipleChildren(align, [
			alignLeft, alignTop, alignBottom, alignRight, alignCenter
		]);
		
		alignLeft.value = 'left';
		alignTop.value = 'top';
		alignBottom.value = 'bottom';
		alignRight.value = 'right';
		alignCenter.value = 'center';
		
		alignLeft = ShapeJS.util.createButton(alignLeft);
		alignLeft.addEventListener('click', setObjectsAlign);

		alignTop = ShapeJS.util.createButton(alignTop);
		alignTop.addEventListener('click', setObjectsAlign);
		
		alignBottom = ShapeJS.util.createButton(alignBottom);
		alignBottom.addEventListener('click', setObjectsAlign);
		
		alignRight = ShapeJS.util.createButton(alignRight);
		alignRight.addEventListener('click', setObjectsAlign);
		
		alignCenter = ShapeJS.util.createButton(alignCenter);
		alignCenter.addEventListener('click', alignCenter);
		
		shapejs.addSubToolbarActions(align, 'alignFamily');

		

	}
	/**/
	ShapeJS.plugins['align'] = function(shapejs, options){
		var canvas = shapejs.canvas;

		var selectedEl = null;
		//=============================================================
		//==================Helper Functions===========================
		//=============================================================

		

		/*
			Make the drop down and dropdown button
		*/
		var alignBtn = '<i class="fa fa-align-left"></i>';
		alignBtn = ShapeJS.util.createHTMLElement(alignBtn);
		alignBtn = shapejs.createToolboxButton(alignBtn, {
			alt:"Align Selected Objects"
		});//creates an element wrapped in <li>	

		alignBtn.activate = function(){
			canvas.isTextMode = true;
			shapejs.clearSubToolbarActions();
			setToolbar(shapejs);
		}

		alignBtn.deactivate = function(){
			canvas.isTextMode = false;
			shapejs.clearSubToolbarActions();
		}

		shapejs.addToolboxButton(alignBtn, 'align');

	}
}());