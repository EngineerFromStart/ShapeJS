(function(){

	/**/
	ShapeJS.plugins['text'] = function(shapejs, options){
		var canvas = shapejs.canvas;

		var selectedEl = null;
		//=============================================================
		//==================Helper Functions===========================
		//=============================================================

		function setToolbar(shapejs){
			/*Text Align Code*/
			var align = document.createElement('li');
			var alignLeft = ShapeJS.util.createHTMLElement('<a><i class="fa fa-align-left"></i></a>');
			var alignRight = ShapeJS.util.createHTMLElement('<a><i class="fa fa-align-right"></i></a>');
			var alignCenter = ShapeJS.util.createHTMLElement('<a><i class="fa fa-align-center"></i></a>');
			var alignJust = ShapeJS.util.createHTMLElement('<a><i class="fa fa-align-justify"></i></a>');

			ShapeJS.util.appendMultipleChildren(align, [
				alignLeft, alignCenter, alignRight
			]);

			alignLeft.value = 'left';
			alignCenter.value = 'center';
			alignRight.value = 'right';
			alignJust.value = 'justify';

			function setTextAlign(){
				shapejs.setActiveObjectProp('textAlign', this.value);
			}

			alignLeft = ShapeJS.util.createButton(alignLeft);
			alignLeft.addEventListener('click', setTextAlign);

			alignRight = ShapeJS.util.createButton(alignRight);
			alignRight.addEventListener('click', setTextAlign);

			alignCenter = ShapeJS.util.createButton(alignCenter);
			alignCenter.addEventListener('click', setTextAlign);

			alignJust = ShapeJS.util.createButton(alignJust);
			alignJust.addEventListener('click', setTextAlign);

			/* font styles */
			var fontStyle = document.createElement('li')
			var bold = ShapeJS.util.createHTMLElement('<a><i class="fa fa-bold"></i></a>');
			var italic = ShapeJS.util.createHTMLElement('<a><i class="fa fa-italic"></i></a>');
			var underline = ShapeJS.util.createHTMLElement('<a><i class="fa fa-underline"></i></a>');
			var strike = ShapeJS.util.createHTMLElement('<a><i class="fa fa-strikethrough"></i></a>'); 

			ShapeJS.util.appendMultipleChildren(fontStyle, [
				bold, italic, underline, strike
			]);

			bold.value = 'bold';
			italic.value = 'italic';
			underline.value = 'underline';
			strike.value = 'strike';

			bold.addEventListener('click', function setTextStyle(){
				var curVal = shapejs.getActiveObjectProp('fontWeight') || 'normal';
				if (curVal != 'bold'){
					this.value = 'bold'
				}else{
					this.value = 'normal'
				}
				shapejs.setActiveObjectProp('fontWeight', this.value);
			});
			italic.addEventListener('click', function setTextStyle(){
				var curVal = shapejs.getActiveObjectProp('fontStyle') || 'normal';
				if (curVal != 'italic'){
					this.value = 'italic'
				}else{
					this.value = 'normal'
				}
				shapejs.setActiveObjectProp('fontStyle', this.value);
			});
			underline.addEventListener('click', function setTextStyle(){
				var curVal = shapejs.getActiveObjectProp('textDecoration') || '';
				if (curVal != 'underline'){
					this.value = 'underline'
				}else{
					this.value = 'normal'
				}
				shapejs.setActiveObjectProp('textDecoration', this.value);
			});
			strike.addEventListener('click', function setTextStyle(){
				var curVal = shapejs.getActiveObjectProp('textDecoration') || '';
				if (curVal != 'line-through'){
					this.value = 'line-through'
				}else{
					this.value = 'normal'
				}
				shapejs.setActiveObjectProp('textDecoration', this.value);
			});

			/* Font Sizes */
			var fontSize = document.createElement('li')
			var smallSize = ShapeJS.util.createHTMLElement('<a><i class="fa fa-font"></i></a>');
			smallSize.style.fontSize = "10px";
			var bigSize = ShapeJS.util.createHTMLElement('<a><i class="fa fa-font"></i></a>');
			bigSize.style.fontSize = "15px";
			var size = ShapeJS.util.createHTMLElement('<select></select>');
			for (var x = 16; x <= 60; x++){
				size.appendChild(ShapeJS.util.createHTMLElement('<option value="'+x+'">'+x+'</option>'));
			}
			
			ShapeJS.util.appendMultipleChildren(fontSize, [
				smallSize, bigSize, size
			]);

			smallSize = ShapeJS.util.createButton(smallSize);
			smallSize.addEventListener('click', function setTextStyle(){
				this.value = parseInt(shapejs.getActiveObjectProp('fontSize')) - 1;
				shapejs.setActiveObjectProp('fontSize', this.value);
				size.value = this.value;
			});

			bigSize = ShapeJS.util.createButton(bigSize);
			bigSize.addEventListener('click', function setTextStyle(){
				this.value = parseInt(shapejs.getActiveObjectProp('fontSize')) + 1;
				shapejs.setActiveObjectProp('fontSize', this.value);
				size.value = this.value;
			});
			size.addEventListener('change', function setTextStyle(){
				shapejs.setActiveObjectProp('fontSize', this.value);
			});


			/* Font family*/
			var font = ShapeJS.util.createHTMLElement('<li>Font:</li>');
			var fontFamily = ShapeJS.util.createHTMLElement('<select></select>');
			var fontFamilies = ['Times New Roman', 'Arial', 'Verdana', 'Courier New', 'Georgia'];
			for (var x = 0; x <= fontFamilies.length - 1; x++){
				fontFamily.appendChild(ShapeJS.util.createHTMLElement('<option value="'+fontFamilies[x]+'">'+fontFamilies[x]+'</option>'));
			}
			font.appendChild(fontFamily);
			fontFamily.addEventListener('change', function(e){
				shapejs.setActiveObjectProp('fontFamily', this.value);
			});

			/* Text Change and Text Object */
			var text = ShapeJS.util.createHTMLElement('<li></li>');
			var textArea = ShapeJS.util.createHTMLElement('<textarea></textarea>');
			canvas.on('object:selected', function(options){
				if (options.target.type == 'text'){
					textArea.value = options.target.get('text');
				}
			});
			textArea.addEventListener('change', function(e){
				shapejs.setActiveObjectProp('text', this.value);
			});
			var textAdd = ShapeJS.util.createHTMLElement('<a><i class="fa fa-plus"></i></a>');
			text.appendChild(textArea);
			text.appendChild(textAdd);
			textAdd = ShapeJS.util.createButton(textAdd);
			function getTextSpecs(){
				return {
					fontFamily: fontFamily.value,
					fontSize: size.value
				}
			}
			textAdd.addEventListener('click', function(event){
				var txt = textArea.value;
				var textSpecs = getTextSpecs();
				canvas.add(new fabric.Text(txt, textSpecs));
			});

			shapejs.addSubToolbarActions(font, 'fontFamily');
			shapejs.addSubToolbarActions(align, 'align');
			shapejs.addSubToolbarActions(fontStyle, 'fontStyle');
			shapejs.addSubToolbarActions(fontSize, 'fontSize');
			shapejs.addSubToolbarActions(text, 'text');

			//var lineHeight = ShapeJS.util.createHTMLElement('<a><i class="fa fa-arrows-v"></i><i style="font-size:10px" class="fa fa-font"></i></a>');

		}

		/*
			Make the drop down and dropdown button
		*/
		var textBtn = '<i class="fa fa-font"></i>';
		textBtn = ShapeJS.util.createHTMLElement(textBtn);
		textBtn = shapejs.createToolboxButton(textBtn);//creates an element wrapped in <li>	

		textBtn.activate = function(){
			canvas.isTextMode = true;
			shapejs.clearSubToolbarActions();
			setToolbar(shapejs);
		}

		textBtn.deactivate = function(){
			canvas.isTextMode = false;
			shapejs.clearSubToolbarActions();
		}

		shapejs.addToolboxButton(textBtn, 'text');

		canvas.on('object:selected', function(options){
			if (options.target.type == 'text'){
				if (!canvas.isTextMode){
					textBtn.trigger('click');
				}
			}
		});
	}
}());