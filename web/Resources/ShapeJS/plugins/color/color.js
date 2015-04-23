(function(){
    'use strict';
    
    function getInputColor(value){
		return new fabric.Color(value);
	}
    
    function setToolbar(shapejs){
    	var canvas = shapejs.canvas;
    	    	
    	function colorPick(e){
        	shapejs.colorpicking = !shapejs.colorpicking;
        	if (shapejs.colorpicking){
        		shapejs.colorCanvasCont.style.display = 'block';
        	}else{
        		shapejs.colorCanvasCont.style.display = 'none';
        	}
        }
    	
    	function setObjectColor(colorVal){
			if (canvas.getActiveObject() && event.target){
				if (canvas.getActiveObject().type == "path"){
					canvas.getActiveObject().setStroke(colorVal.toRgba());
				}else{
					canvas.getActiveObject().setFill(colorVal.toRgba());
				}
				canvas.trigger('object:modified');
			}
    	}
    	
    	//add the eye dropper to toggle canvas
    	var colorPickerCont = shapejs.colorPickerCont = document.createElement('li');
    	colorPickerCont.style.position = 'relative';
    	var colorPicker = shapejs.colorPicker = ShapeJS.util.createHTMLElement('<a><i class="fa fa-eyedropper"></i></a>');
    	colorPickerCont.appendChild(colorPicker);
    	
    	//add the canvas container
    	var colorCanvasCont = shapejs.colorCanvasCont = document.createElement('div');
    	colorCanvasCont.style.position= 'absolute';
    	colorCanvasCont.style.bottom= '100%';
    	colorCanvasCont.style.left= '0';
    	colorCanvasCont.style.zIndex= '9999';
    	colorCanvasCont.style.display= 'none';
    	colorCanvasCont.style.marginBottom= '5px';
		
    	//add canvas to container
    	var colorCanvas = shapejs.colorCanvas = document.createElement('Canvas');
		colorCanvas.style.cursor = 'crosshair';
		
		colorCanvasCont.appendChild(colorCanvas);
		colorPickerCont.appendChild(colorCanvasCont);
    	shapejs.addSubToolbarActions(colorPickerCont, 'colorPicker');
    	colorPicker = ShapeJS.util.createButton(colorPicker);
    	shapejs.colorpicking = false;
    	colorPicker.addEventListener('click', colorPick);
    	
		//make canvas into fabric type
		colorCanvas = new fabric.Canvas(colorCanvas, {
			backgroundColor: "#ff",
		});
		var rect = new fabric.Rect({
			left:0,
			top:0,
			width: colorCanvas.width,
			height: colorCanvas.height,
			selectable: false,
			opacity: 1
		})
		
		rect.setGradient('fill', {
			  x1: 0,
			  y1: 0,
			  x2: colorCanvas.width,
			  y2: 0,
			  colorStops: {
			    0: "rgb(255,  0,   0)",
				0.15: "rgb(255,   0, 255)",
				0.33: "rgb(0,     0, 255)",
				0.49: "rgb(0,   255, 255)",
				0.67: "rgb(0,   255,   0)",
				0.84: "rgb(255, 255,   0)",
				1: "rgb(255,   0,   0)"
			  }
		})
		
		var rect2 = new fabric.Rect({
			left:0,
			top:0,
			width: colorCanvas.width,
			height: colorCanvas.height,
			selectable: false,
			opacity: 1
		})
		
		rect2.setGradient('fill', {
			  x1: 0,
			  y1: 0,
			  x2: 0,
			  y2: colorCanvas.height,
			  colorStops: {
			    0: "rgba(255, 255, 255, 1)",
				0.509: "rgba(255, 255, 255, 0)",
				0.51: "rgba(0, 0, 0, 0)",
				1: "rgba(0, 0, 0, 1)"
			  }
		})
		colorCanvas.add(rect);
		colorCanvas.add(rect2);
		colorCanvas.ctx = colorCanvas.getContext("2d");
                
    	colorCanvas.on('mouse:up', function(options){
    		var point = colorCanvas.getPointer(options.event);
    		var data = colorCanvas.ctx.getImageData(point.x, point.y, 1, 1).data;
    		
    		shapejs.toolbox.colorInput.value = '#'+to_hex(data[0])+to_hex(data[1])+to_hex(data[2]);
    		setObjectColor(shapejs.toolbox.colorInput.onchange());//set input and change object color
    		shapejs.colorpicking = true;//gets negated later
    		colorPick();//hides the colorpick canvas
    	})
    	
    	function to_hex(dec) {
	        var hex = dec.toString(16);
	        return hex.length == 2 ? hex : '0' + hex;
	    }
    	
    	var picker = document.createElement('li');
		//var alignLeft = ShapeJS.util.createHTMLElement('<div style="width:25px; height:25px;"></div>');
		var rgbaSrc = getInputColor(shapejs.toolbox.colorInput.value).getSource();
		var rgba = shapejs.rgba = ShapeJS.util.createHTMLElement('<li></li>');
		var r  = shapejs.rgba.r = ShapeJS.util.createHTMLElement('<input type="number" value="'+rgbaSrc[0]+'" min="0" max="255"/>');
		var rDiv = ShapeJS.util.createHTMLElement('<span>R </span>');
		rDiv.appendChild(r);
		var g  = shapejs.rgba.g = ShapeJS.util.createHTMLElement('<input type="number" value="'+rgbaSrc[1]+'" min="0" max="255"/>');
		var gDiv = ShapeJS.util.createHTMLElement('<span>G </span>');
		gDiv.appendChild(g);
		var b  = shapejs.rgba.b = ShapeJS.util.createHTMLElement('<input type="number" value="'+rgbaSrc[2]+'" min="0" max="255"/>');
		var bDiv = ShapeJS.util.createHTMLElement('<span>B </span>');
		bDiv.appendChild(b);
		var a  = shapejs.rgba.a = ShapeJS.util.createHTMLElement('<input type="number" value="'+rgbaSrc[3]+'" min="0" max="1" step=".05"/>');
		var aDiv = ShapeJS.util.createHTMLElement('<span>A </span>');
		aDiv.appendChild(a);
				
		function buildColor(){
			if (a.value.indexOf(".") != -1 && a.value.substring(0) != "0") a.value = "0"+a.value.substring(0);
			shapejs.toolbox.colorInput.value = 'rgba('+r.value+','+g.value+','+b.value+','+a.value+')';
			setObjectColor(shapejs.toolbox.colorInput.onchange());//set input and change object color
		}
		
		ShapeJS.util.appendMultipleChildren(rgba, [
			rDiv, gDiv, bDiv, aDiv
		]);
		
		r.addEventListener('change', buildColor);
		g.addEventListener('change', buildColor);
		b.addEventListener('change', buildColor);
		a.addEventListener('change', buildColor);
		
		shapejs.addSubToolbarActions(rgba, 'rgba');
    }

    ShapeJS.plugins['color'] = function(shapejs, options){
    	var canvas = shapejs.canvas;
    	
    	//=======================================================
		//================add color input to toolbox=============
		//=======================================================
		shapejs.toolbox.colorBox = '<div style="width:26px; height:26px;"></div>';
		shapejs.toolbox.colorBox = ShapeJS.util.createHTMLElement(shapejs.toolbox.colorBox);
		shapejs.toolbox.colorInput = '<input type="hidden" value="" />';
		shapejs.toolbox.colorInput = ShapeJS.util.createHTMLElement(shapejs.toolbox.colorInput);
		
		shapejs.toolbox.colorInput.value = 'rgba(0,0,0,1)';
		shapejs.toolbox.colorBox.style.backgroundColor = shapejs.toolbox.colorInput.value;
		
		canvas.on('object:selected', function(options){
			if (options.target.type == "path"){
				shapejs.toolbox.colorInput.value = new fabric.Color(options.target.get('stroke')).toRgba();
			}else{
				shapejs.toolbox.colorInput.value = new fabric.Color(options.target.get('fill')).toRgba();
			}
			shapejs.toolbox.colorInput.onchange();
		});
		
		shapejs.toolbox.colorInput.onchange =  function(event){
			var colorVal = getInputColor(this.value);
			var rgbaSrc = colorVal.getSource();
			shapejs.toolbox.colorBox.style.backgroundColor = colorVal.toRgba();
			
			//set rgba if there, exists when toolbar is setup
			if (shapejs.rgba){
				shapejs.rgba.r.value = rgbaSrc[0];
				shapejs.rgba.g.value = rgbaSrc[1];
				shapejs.rgba.b.value = rgbaSrc[2];
				shapejs.rgba.a.value = rgbaSrc[3];
			}
			return colorVal;
		};
		
		
		
		var primaryColor = shapejs.createToolboxButton(shapejs.toolbox.colorBox, {
			alt:"Object Color"
		});
				
		primaryColor.activate = function(){
			shapejs.clearSubToolbarActions();
			setToolbar(shapejs);
		}
		primaryColor.deactivate = function(){
			shapejs.clearSubToolbarActions();
		}
		shapejs.addToolboxButton(primaryColor, 'primaryColor');
    };
}());