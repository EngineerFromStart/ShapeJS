(function(){
	ShapeJS.plugins['move'] = function(shapejs, options){
		var canvas = shapejs.canvas;
		var edit = shapejs.toolbar.editActions;
		
		function bringOrSend(){
			var val = this.id;
			//second param ("true") because some functions have a second option available
			if (canvas.getActiveObject())
				canvas.getActiveObject()[val](true); 
		}
				
		var dropDown = ShapeJS.util.createHTMLElement('<li class="dropdown">Move<span class="shapejs-short-cut"><i class="fa fa-angle-right"></i></span></li>');
		
		var moveDrop = ShapeJS.util.createHTMLElement('<ul class="dropbox"></ul>');
		
		var forwardBtn = ShapeJS.util.createHTMLElement('<li id="bringForward">Bring Forward</li>');
		var backwordBtn = ShapeJS.util.createHTMLElement('<li id="sendBackwards">Send Backwords</li>');
		var hr = ShapeJS.util.createHTMLElement('<hr>');
		var fullForwardBtn = ShapeJS.util.createHTMLElement('<li id="bringToFront">Bring to Front</li>');
		var fullBackwordBtn = ShapeJS.util.createHTMLElement('<li id="sendToBack">Send to Back</li>');
		
		ShapeJS.util.appendMultipleChildren(moveDrop, [
			forwardBtn, backwordBtn, hr, fullForwardBtn, fullBackwordBtn
		]);
				
		brightnessBtn = ShapeJS.util.createButton(forwardBtn);
		forwardBtn.addEventListener('click', bringOrSend);
				
		backwordBtn = ShapeJS.util.createButton(backwordBtn);
		backwordBtn.addEventListener('click', bringOrSend);
					
		fullForwardBtn = ShapeJS.util.createButton(fullForwardBtn);
		fullForwardBtn.addEventListener('click', bringOrSend);
				
		fullBackwordBtn = ShapeJS.util.createButton(fullBackwordBtn);
		fullBackwordBtn.addEventListener('click', bringOrSend);
		
		dropDown.appendChild(moveDrop);
		edit.appendChild(dropDown);
		
	}
}());