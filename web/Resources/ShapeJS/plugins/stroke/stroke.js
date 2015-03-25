(function(){
    'use strict';
    
    function getInputColor(value){
		return new fabric.Color(value);
	}
    
    function setToolbar(shapejs){
    	var canvas = shapejs.canvas;
    	
    	function strokePick(e){
        	shapejs.strokepicking = !shapejs.strokepicking;
        	if (shapejs.strokepicking){
        		shapejs.strokeCanvasCont.style.display = 'block';
        	}else{
        		shapejs.strokeCanvasCont.style.display = 'none';
        	}
        }
    	
    	//add the eye dropper to toggle canvas
    	var strokePickerCont = shapejs.strokePickerCont = document.createElement('li');
    	strokePickerCont.style.position = 'relative';
    	var strokePicker = shapejs.strokePicker = ShapeJS.util.createHTMLElement('<a><i class="fa fa-eyedropper"></i></a>');
    	strokePickerCont.appendChild(strokePicker);
    	
    	//add the canvas container
    	var strokeCanvasCont = shapejs.strokeCanvasCont = document.createElement('div');
    	strokeCanvasCont.style.position= 'absolute';
    	strokeCanvasCont.style.bottom= '100%';
    	strokeCanvasCont.style.left= '0';
    	strokeCanvasCont.style.zIndex= '9999';
    	strokeCanvasCont.style.display= 'none';
    	strokeCanvasCont.style.marginBottom= '5px';
		
    	//add canvas to container
    	var strokeCanvas = shapejs.strokeCanvas = document.createElement('Canvas');
		strokeCanvas.style.cursor = 'crosshair';
		
		strokeCanvasCont.appendChild(strokeCanvas);
		strokePickerCont.appendChild(strokeCanvasCont);
    	shapejs.addSubToolbarActions(strokePickerCont, 'strokePicker');
    	strokePicker = ShapeJS.util.createButton(strokePicker);
    	shapejs.strokepicking = false;
    	strokePicker.addEventListener('click', strokePick);
    	
		//make canvas into fabric type
    	//and set the picture to use gradients
		strokeCanvas = new fabric.Canvas(strokeCanvas, {
			backgroundColor: "#ff",
		});
		var rect = new fabric.Rect({
			left:0,
			top:0,
			width: strokeCanvas.width,
			height: strokeCanvas.height,
			selectable: false,
			opacity: 1
		})
		
		rect.setGradient('fill', {
			  x1: 0,
			  y1: 0,
			  x2: strokeCanvas.width,
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
			width: strokeCanvas.width,
			height: strokeCanvas.height,
			selectable: false,
			opacity: 1
		})
		
		rect2.setGradient('fill', {
			  x1: 0,
			  y1: 0,
			  x2: 0,
			  y2: strokeCanvas.height,
			  colorStops: {
			    0: "rgba(255, 255, 255, 1)",
				0.509: "rgba(255, 255, 255, 0)",
				0.51: "rgba(0, 0, 0, 0)",
				1: "rgba(0, 0, 0, 1)"
			  }
		})
		strokeCanvas.add(rect);
		strokeCanvas.add(rect2);
		strokeCanvas.ctx = strokeCanvas.getContext("2d");
        
		//event for picking the color on click
    	strokeCanvas.on('mouse:up', function(options){
    		var point = strokeCanvas.getPointer(options.event);
    		var data = strokeCanvas.ctx.getImageData(point.x, point.y, 1, 1).data;
    		
    		canvas.getActiveObject().setStroke('rgba(0,0,0,0)');
    		
    		shapejs.toolbox.strokeInput.value = '#'+to_hex(data[0])+to_hex(data[1])+to_hex(data[2]);
    		shapejs.toolbox.strokeInput.onchange();
    		shapejs.strokepicking = true;//gets negated later
    		strokePick();
    	})
    	//helper
    	function to_hex(dec) {
	        var hex = dec.toString(16);
	        return hex.length == 2 ? hex : '0' + hex;
	    }
    	
		//add all the containers
		shapejs.addSubToolbarActions(shapejs.srgba, 'srgba');
		shapejs.addSubToolbarActions(shapejs.strokeParamsCont, 'strokeParams');
    }

    ShapeJS.plugins['stroke'] = function(shapejs, options){
    	var canvas = shapejs.canvas;
    	
    	//Hidden input that holds the stroke color
    	//onchange() is defined below 
    	shapejs.toolbox.strokeInput = '<input type="hidden" value="" />';
		shapejs.toolbox.strokeInput = ShapeJS.util.createHTMLElement(shapejs.toolbox.strokeInput);
		shapejs.toolbox.strokeInput.value = 'rgba(0,0,0,0)';
    	
    	//=======================================================
		//=============add stroke color box to toolbox==========
		//=======================================================
		shapejs.toolbox.strokeBox = '<div style="width:26px; height:26px; padding:3.5px;"></div>';
		shapejs.toolbox.strokeBox = ShapeJS.util.createHTMLElement(shapejs.toolbox.strokeBox);
		shapejs.toolbox.strokeBox.appendChild(
				ShapeJS.util.createHTMLElement(
						'<div style="width:19px; height:19px; background-color:#EEE">S</div>'));
		shapejs.toolbox.strokeBox.style.backgroundColor = shapejs.toolbox.strokeInput.value;

		var primaryColor = shapejs.createToolboxButton(shapejs.toolbox.strokeBox, {
			alt:"Object Stroke"
		});
		
		primaryColor.activate = function(){
			shapejs.clearSubToolbarActions();
			setToolbar(shapejs);
		}
		primaryColor.deactivate = function(){
			shapejs.clearSubToolbarActions();
		}
		
		shapejs.addToolboxButton(primaryColor, 'strokeColor');
		
		
		//============================================================
		//================create the GUI for the toolbar=============
		//============================================================
		
		//=========create the rgba inputs for the toolbar=============
		//============================================================
		function buildColor(){
			var a = shapejs.srgba.a;
			var r = shapejs.srgba.r;
			var g = shapejs.srgba.g;
			var b = shapejs.srgba.b;
			if (a.value.indexOf(".") != -1 && a.value.substring(0) != "0") a.value = "0"+a.value.substring(0);
			shapejs.toolbox.strokeInput.value = 'rgba('+r.value+','+g.value+','+b.value+','+a.value+')';
			canvas.getActiveObject().stroke = shapejs.toolbox.strokeInput.value;
			
			shapejs.toolbox.strokeInput.onchange();//defined below
		}
		
		var rgbaSrc = getInputColor(shapejs.toolbox.strokeInput.value).getSource();
		shapejs.srgba = ShapeJS.util.createHTMLElement('<li></li>');
		shapejs.srgba.r = ShapeJS.util.createHTMLElement('<input type="number" value="'+rgbaSrc[0]+'" min="0" max="255" step="1"/>');
		shapejs.srgba.g = ShapeJS.util.createHTMLElement('<input type="number" value="'+rgbaSrc[1]+'" min="0" max="255" step="1"/>');
		shapejs.srgba.b = ShapeJS.util.createHTMLElement('<input type="number" value="'+rgbaSrc[2]+'" min="0" max="255" step="1"/>');
		shapejs.srgba.a = ShapeJS.util.createHTMLElement('<input type="number" value="'+rgbaSrc[3]+'" min="0" max="1" step=".05"/>');

		shapejs.srgba.r.addEventListener('change', buildColor);
		shapejs.srgba.g.addEventListener('change', buildColor);
		shapejs.srgba.b.addEventListener('change', buildColor);
		shapejs.srgba.a.addEventListener('change', buildColor);
		
		//add the inputs to the div	
		var rDiv = ShapeJS.util.createHTMLElement('<span>R </span>');
		rDiv.appendChild(shapejs.srgba.r);
		var gDiv = ShapeJS.util.createHTMLElement('<span>G </span>');
		gDiv.appendChild(shapejs.srgba.g);
		var bDiv = ShapeJS.util.createHTMLElement('<span>B </span>');
		bDiv.appendChild(shapejs.srgba.b);
		var aDiv = ShapeJS.util.createHTMLElement('<span>A </span>');
		aDiv.appendChild(shapejs.srgba.a);
		
		ShapeJS.util.appendMultipleChildren(shapejs.srgba, [
			rDiv, gDiv, bDiv, aDiv
		]);
		
		//=========create the Stroke Params for the toolbar===========
		//============================================================
		function setStrokeParams(){			
			//run the single input change
			shapejs.toolbox.strokeInput.onchange();//defined below
		}
		
		shapejs.strokeWidth = ShapeJS.util.createHTMLElement('<input type="number" value="1" min="0" max="15" step="1"/>');
		shapejs.strokeDashArray = document.createElement('select');
		
		shapejs.strokeDashArray.appendChild(ShapeJS.util.createHTMLElement('<option value=",">Solid</option>'))
		shapejs.strokeDashArray.appendChild(ShapeJS.util.createHTMLElement('<option value="4,4">Dash</option>'))
		
		shapejs.strokeWidth.addEventListener('change', setStrokeParams);
		shapejs.strokeDashArray.addEventListener('change', setStrokeParams);
		
		shapejs.strokeParamsCont = ShapeJS.util.createHTMLElement('<li></li>');
				
		var widthDiv = ShapeJS.util.createHTMLElement('<span> Width <i class="fa fa-arrows-v"></i> </span>');
		widthDiv.appendChild(shapejs.strokeWidth);//defined during init of plugin
		var dashDiv = ShapeJS.util.createHTMLElement('<span> StrokeDash </span>');
		dashDiv.appendChild(shapejs.strokeDashArray);//defined during init of plugin
				
		ShapeJS.util.appendMultipleChildren(shapejs.strokeParamsCont, [
   			widthDiv, dashDiv
   		]);
			
		//on item selected, setup the inputs properly
		canvas.on('object:selected', function(options){
			if (options.target.stroke){
				shapejs.toolbox.strokeInput.value = new fabric.Color(options.target.get('stroke')).toRgba();
				
				shapejs.strokeWidth.value = options.target.get('strokeWidth');
				shapejs.strokeDashArray.value = options.target.get('strokeDashArray');
				
				shapejs.toolbox.strokeInput.onchange();
			}
		});
		
		shapejs.toolbox.strokeInput.onchange = function(event){
			var colorVal = getInputColor(this.value);
			var rgbaSrc = colorVal.getSource();
			shapejs.toolbox.strokeBox.style.backgroundColor = colorVal.toRgba();
			
			shapejs.srgba.r.value = rgbaSrc[0];
			shapejs.srgba.g.value = rgbaSrc[1];
			shapejs.srgba.b.value = rgbaSrc[2];
			shapejs.srgba.a.value = rgbaSrc[3];
			
			if (canvas.getActiveObject() && canvas.getActiveObject().stroke){
				canvas.getActiveObject().stroke = colorVal.toRgba();
				
				canvas.getActiveObject().strokeWidth = parseInt(shapejs.strokeWidth.value);
				canvas.getActiveObject().strokeDashArray = shapejs.strokeDashArray.value.split(',');
				canvas.renderAll();
			}
		};
		
		
    };
}());