(function(){
	ShapeJS.plugins['adjustments'] = function(shapejs, options){
		function setUpBrightness(){
			var canvas = shapejs.canvas;
			var slider = document.createElement('ul');
			
			slider.appendChild(ShapeJS.util.createHTMLElement('<span>0 </span>'));
			
			var sliderInput = ShapeJS.util.createHTMLElement('<input type="range" value="100" min="0" max="255">');
			sliderInput.style.verticalAlign = 'middle';
			slider.appendChild(sliderInput);

			slider.appendChild(ShapeJS.util.createHTMLElement('<span> 255</span>'));

			shapejs.addSubToolbarActions(slider, 'brightnessSlider');
			
			//create annotation width
			sliderInput.onchange = function() {
				var selectedEl = shapejs.canvas.getActiveObject();
				if (selectedEl && selectedEl.type == 'image'){
					
					var brightExists = false;
					
					shapejs.historyStack.push(JSON.stringify(shapejs.canvas));
					shapejs.historyIndex += 1;
					
					for (var x = 0; x < selectedEl.filters.length; x++){
						if (selectedEl.filters[x].brightness){
							brightExists = true;
							selectedEl.filters[x] = new fabric.Image.filters.Brightness({brightness: parseInt(this.value)});
						}
					}
					
					if (!brightExists){
						selectedEl.filters.push(
							brightExists = new fabric.Image.filters.Brightness({brightness: parseInt(this.value)})
						);
					}
					
					selectedEl.applyFilters(canvas.renderAll.bind(canvas));
				}
			};
		}
		
		function setToolbar(setting){
			var canvas = shapejs.canvas;
			
			if (setting == 'brightness'){
				setUpBrightness();
			}
		}
		
		var canvas = shapejs.canvas;
		var edit = shapejs.toolbar.editActions;
				
		var adjustmentsDD = ShapeJS.util.createHTMLElement('<li class="dropdown">Adjustments<span class="shapejs-short-cut"><i class="fa fa-angle-right"></i></span></li>');
		
		var adjustmentDrop = ShapeJS.util.createHTMLElement('<ul class="dropbox"></ul>');
		
		var brightnessBtn = ShapeJS.util.createHTMLElement('<li id="brightness">Brightness</li>')
		adjustmentDrop.appendChild(brightnessBtn);
		brightnessBtn = ShapeJS.util.createButton(brightnessBtn);
		brightnessBtn.addEventListener('click', function(e){
			shapejs.clearSubToolbarActions();
			setToolbar('brightness');
		});
			
		var tintBtn = ShapeJS.util.createHTMLElement('<li id="tint">Tint</li>')
		//adjustmentDrop.appendChild(tintBtn);
		tintBtn = ShapeJS.util.createButton(tintBtn);
		tintBtn.addEventListener('click', function(e){
			shapejs.clearSubToolbarActions();
			setToolbar('tint');
		});
		
		adjustmentsDD.appendChild(adjustmentDrop);
		edit.appendChild(adjustmentsDD);
		
	}
}());