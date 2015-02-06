(function(){
	//=============================================================
	//==================Helper Functions===========================
	//=============================================================
	function onActivateText(shapejs){
		var canvas = shapejs.canvas;
		if (canvas.isTextMode){
			shapejs.clearSubToolbarActions();
			setToolbar(shapejs);
			canvas.on('mouse:down', function(options) {
				var underlineText = new fabric.Text("I'm an underlined text", {
					textDecoration: 'underline'
				});
				canvas.add(underlineText);
				canvas.off('mouse:down');
			});
		}else{
			canvas.off('mouse:down');
			shapejs.clearSubToolbarActions();
		}
	}

	function setToolbar(shapejs){
		var canvas = shapejs.canvas;
		var align = document.createElement('li')
		var alignLeft = ShapeJS.util.createHTMLElement('<span><i class="fa fa-align-left"></i></span>');
		var alignRight = ShapeJS.util.createHTMLElement('<span><i class="fa fa-align-right"></i></span>');
		var alignCenter = ShapeJS.util.createHTMLElement('<span><i class="fa fa-align-center"></i></span>');
		var alignJust = ShapeJS.util.createHTMLElement('<span><i class="fa fa-align-justify"></i></span>');

		ShapeJS.util.appendMultipleChildren(align, [
			alignLeft, alignCenter, alignRight, alignJust
		]);

		var fontStyle = document.createElement('li')
		var bold = ShapeJS.util.createHTMLElement('<span><i class="fa fa-bold"></i></span>');
		var italic = ShapeJS.util.createHTMLElement('<span><i class="fa fa-italic"></i></span>');
		var underline = ShapeJS.util.createHTMLElement('<span><i class="fa fa-underline"></i></span>');
		var strike = ShapeJS.util.createHTMLElement('<span><i class="fa fa-strikethrough"></i></span>'); 

		ShapeJS.util.appendMultipleChildren(fontStyle, [
			bold, italic, underline, strike
		]);

		var fontSize = document.createElement('li')
		var smallSize = ShapeJS.util.createHTMLElement('<span><i class="fa fa-font"></i></span>');
		smallSize.style.fontSize = "10px";
		var bigSize = ShapeJS.util.createHTMLElement('<span><i class="fa fa-font"></i></span>');
		bigSize.style.fontSize = "15px";
		var size = ShapeJS.util.createHTMLElement('<select></select>');
		for (var x = 1; x <= 100; x++){
			size.appendChild(ShapeJS.util.createHTMLElement('<option value="'+x+'">'+x+'</option>'));
		}
		var lineHeight = ShapeJS.util.createHTMLElement('<span><i class="fa fa-arrows-v"></i><i style="font-size:10px" class="fa fa-font"></i></span>');
		
		ShapeJS.util.appendMultipleChildren(fontSize, [
			smallSize, bigSize, size, lineHeight
		]);


		var font = ShapeJS.util.createHTMLElement('<li><span>Font:</span></li>');
		var fontFamily = ShapeJS.util.createHTMLElement('<select></select>');
		var fontFamilies = ['Ariel', 'Verdana', 'Courier New', 'Georgia'];
		for (var x = 0; x <= fontFamilies.length; x++){
			fontFamily.appendChild(ShapeJS.util.createHTMLElement('<option value="'+fontFamilies[x]+'">'+fontFamilies[x]+'</option>'));
		}
		font.appendChild(fontFamily);

		var text = ShapeJS.util.createHTMLElement('<li><span><textarea></textarea></span></li>');
		var textAdd = ShapeJS.util.createHTMLElement('<span><i class="fa fa-plus"></i></span>');
		text.appendChild(textAdd);
		//COLOR

		shapejs.addSubToolbarActions(font, 'fontFamily');
		shapejs.addSubToolbarActions(align, 'align');
		shapejs.addSubToolbarActions(fontStyle, 'fontStyle');
		shapejs.addSubToolbarActions(fontSize, 'fontSize');
		shapejs.addSubToolbarActions(text, 'text');


	}

	/**/
	ShapeJS.plugins['text'] = function(shapejs, options){
		var canvas = shapejs.canvas;
		canvas.isTextMode = false;

		/*
			Make the drop down and dropdown button
		*/
		var textBtn = '<i class="fa fa-font"></i>';
		textBtn = ShapeJS.util.createHTMLElement(textBtn);
		textBtn = shapejs.createToolboxButton(textBtn);//creates an element wrapped in <li>	

		textBtn.activate = function(){
			canvas.isTextMode = true;
			onActivateText(shapejs);
		}

		textBtn.deactivate = function(){
			canvas.isTextMode = false;
			onActivateText(shapejs);
		}

		shapejs.addToolboxButton(textBtn, 'text');
	}
}());