/*
 * Remove Crop objects when:
 * - main crop button is clicked
 * - crop is completed
 * - objects to crop are changed 
 * 
 */

//used to recreate the full fabric objects from minified versions

fabric.CropRect = fabric.util.createClass(fabric.Rect, {
  type: 'cropRect',
  initialize: function(options) {
    options || (options = { });

    this.callSuper('initialize', options);
  },
  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
    	cropLeft: this.get('cropLeft'),
    	cropTop: this.get('cropTop')
    });
  }
});

fabric.CropCircle = fabric.util.createClass(fabric.Circle, {
  type: 'cropCircle',
  initialize: function(options) {
    options || (options = { });

    this.callSuper('initialize', options);
  },
  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
    	cropLeft: this.get('cropLeft'),
    	cropTop: this.get('cropTop')
    });
  }
});

(function(){
    'use strict';
    
    function addCropEl(shapejs){
		//add new one
    	shapejs.disableHistoryStackChange = true;
		shapejs.canvas.add(shapejs.tempCropEl);
		shapejs.canvas.setActiveObject(shapejs.tempCropEl);
    }
	
	function removeCropEl(shapejs){
		shapejs.canvas.remove(shapejs.tempCropEl);
		shapejs.tempCropEl = null;
		shapejs.disableHistoryStackChange = false;
	}
	
	function getSelectedEl(shapejs){
		var selectedEl;
		//remove previous el
		if (shapejs.tempCropEl){
			removeCropEl(shapejs);
		}
		//so the selected el is the elemnent that was last selected and not Crop type
		if (shapejs.canvas.getActiveObject().type.indexOf('crop') == -1){
			selectedEl = shapejs.canvas.getActiveObject();
		}
		return selectedEl;
	}
	
	function cropClicked(shapejs){
		console.log(shapejs.cropSelectedEl)
		if (!shapejs.tempCropEl || !shapejs.cropSelectedEl) return;
		
		console.info('Modifying Object: '+selectedEl+' for crop');
		
		var selectedEl = shapejs.cropSelectedEl;
		console.log(selectedEl);
		
		var cropEl = fabric.util.object.clone(shapejs.tempCropEl);

		shapejs.cropBtn.trigger('click');
		
    	cropEl.opacity = 0;
    	//because all the clip objects also get scaled, you have to inverse the scales first
    	cropEl.scaleX = cropEl.scaleX/selectedEl.scaleX;
    	cropEl.scaleY = cropEl.scaleY/selectedEl.scaleY;

    	//set permanent left and top values, else clipTo would also move around when object moves
    	cropEl.cropLeft = (cropEl.left - selectedEl.left)/selectedEl.scaleX;
    	cropEl.cropTop = (cropEl.top - selectedEl.top)/selectedEl.scaleY;
    	
    	cropEl.angle = 0;
    	        	
    	//we want to only have the current object hold the minified version of the cropEl.
    	//this can used to recreate the crop later. Look above
    	cropEl = cropEl.toObject();
    	
    	selectedEl.toObject = (function(toObject){
            return function() {
                return fabric.util.object.extend(toObject.call(this), {
                    cropEl: cropEl
                });
            };
        })(selectedEl.toObject);
    	
    	selectedEl.cropEl = cropEl;
    	        	        	
    	//create full version from minified stored cropEl and then clip using its render

		selectedEl.clipTo = function(ctx){
			var cropEl;
            if (this.cropEl.type == 'cropRect') {
            	cropEl = new fabric.CropRect(this.cropEl);
            }else if (this.cropEl.type == 'cropCircle') {
            	cropEl = new fabric.CropCircle(this.cropEl);
            }

        	cropEl.left = -this.width/2 + cropEl.cropLeft;
        	cropEl.top = -this.height/2 + cropEl.cropTop;
        	
        	cropEl.render(ctx, false);
        };
        //render and disable crop (also removes cropEl)
                	
        shapejs.canvas.renderAll();            
		
        shapejs.historyStack = shapejs.historyStack.slice(0, shapejs.historyIndex+1);
        shapejs.historyStack.push(JSON.stringify(shapejs.canvas));
        shapejs.historyIndex += 1;
	}
	
    function setToolbar(shapejs){
    	var canvas = shapejs.canvas;
		
		//Create the Proper Crop Shapes
		var shapes = document.createElement('li');
		var square = ShapeJS.util.createHTMLElement('<a><i class="fa fa-square"></i></a>');
		var circle = ShapeJS.util.createHTMLElement('<a><i class="fa fa-circle"></i></a>');
		
		ShapeJS.util.appendMultipleChildren(shapes, [
			square, circle
		]);
 		square = ShapeJS.util.createButton(square);
 		square.addEventListener('click', function(e){
 			var selectedEl = shapejs.cropSelectedEl = getSelectedEl(shapejs);
 			
 			if (!selectedEl) return;
 			
 			shapejs.tempCropEl = new fabric.CropRect({
 				left: selectedEl.left,
 	            top: selectedEl.top,
 	            width: selectedEl.width,
 	            height: selectedEl.height,
 	            scaleX: selectedEl.scaleX,
 	            scaleY: selectedEl.scaleY,
 	            angle: selectedEl.angle,
 	            fill: 'rgba(0,0,0,0.3)',
 	            stroke: '#ccc',
 	            strokeDashArray: [2, 2],
 	            borderColor: '#36fd00',
 	            cornerColor: 'green',
 	            hasRotatingPoint: false,
 	            lockScalingFlip : true
 			});
 			
 			addCropEl(shapejs);
 		});

 		circle = ShapeJS.util.createButton(circle);
 		circle.addEventListener('click', function(e){
 			var selectedEl = shapejs.cropSelectedEl = getSelectedEl(shapejs);
 			
 			if (!selectedEl) return;
 			
 			var radius = selectedEl.width < selectedEl.height ? selectedEl.width*selectedEl.scaleX/2 : selectedEl.height*selectedEl.scaleY/2;
 			var scaleX = selectedEl.width < selectedEl.height ? 1 : selectedEl.width/selectedEl.height;
 			var scaleY = selectedEl.width < selectedEl.height ? selectedEl.height/selectedEl.width : 1;
 			shapejs.tempCropEl = new fabric.CropCircle({
 				radius: radius,
 				scaleX: scaleX,
 				scaleY: scaleY,
 	            angle: selectedEl.angle,
 				left: selectedEl.left,
 				top: selectedEl.top,
 				fill: 'rgba(0,0,0,0.3)',
 	            stroke: '#ccc',
 	            strokeDashArray: [2, 2],
 	            borderColor: '#36fd00',
 	            cornerColor: 'green',
 	            hasRotatingPoint: false,
 	            lockScalingFlip : true
 			});
 			
 			addCropEl(shapejs);
 		});
 		
 		//if a non crop object is selected, must remove crop El 
 		canvas.on('object:selected', function(options){
 			if (options.target.type.indexOf('crop') == -1){
 				removeCropEl(shapejs);
 			};
 		});
    	
 		//Add other functions
    	var invertContainer = document.createElement('li');
    	var invert = ShapeJS.util.createHTMLElement('<span>Invert <input type="checkbox" value="invert"/> </span>');
    	invertContainer.appendChild(invert);
        
    	
    	//Add main crop button
    	var cropContainer = document.createElement('li');
        var crop = ShapeJS.util.createHTMLElement('<a> <i class="fa fa-crop"></i> Crop</a>');
        cropContainer.appendChild(crop);
        crop = ShapeJS.util.createButton(crop)
        crop.addEventListener('click', function(e){
        	cropClicked(shapejs);
        });

        shapejs.addSubToolbarActions(shapes, 'cropShapes');
        //shapejs.addSubToolbarActions(invertContainer, 'invert');
        shapejs.addSubToolbarActions(cropContainer, 'crop');
    }

    ShapeJS.plugins['cropV2'] = function(shapejs, options){
    	var canvas = shapejs.canvas;
    	
    	var cropBtn = ShapeJS.util.createHTMLElement('<i class="fa fa-crop"></i>');
        cropBtn = shapejs.createToolboxButton(cropBtn, {
			alt:"Crop Object"
		});
        shapejs.addToolboxButton(cropBtn, 'crop');
        
        //requires adding the cropEl back to the toObject, else update (saving) will break.
        //also initial object undo/redo breaks because toObject isnt properly set with the cropEl
        var totalObjs = canvas.getObjects();
        canvas.on('object:added', function(options){
        	if (options.target.cropEl){
        		console.warn('Adding Cropped Object "'+options.target.type+'" after render');
        		options.target.toObject = (function(toObject){
        			var cropEl = options.target.cropEl;
                    return function() {
                        return fabric.util.object.extend(toObject.call(this), {
                            cropEl: cropEl
                        });
                    };
                })(options.target.toObject);
        	}
        });
        
        cropBtn.activate = function(){
            canvas.isCropMode = true;
            shapejs.clearSubToolbarActions();
            setToolbar(shapejs);
        }

        cropBtn.deactivate = function(){
            removeCropEl(shapejs);
            canvas.isCropMode = false;
            shapejs.clearSubToolbarActions();
        }
        
        shapejs.cropBtn = cropBtn;
    };
}());