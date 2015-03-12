(function(){
    'use strict';

    var crop; // the crop (subtoolbar) button
    function getCropElement(){
        return new fabric.Rect({
            fill: 'rgba(0,0,0,0.3)',
            originX: 'left',
            originY: 'top',
            stroke: '#ccc',
            strokeDashArray: [2, 2],
            opacity: 1,
            width: 100,
            height: 100,
            borderColor: '#36fd00',
            cornerColor: 'green',
            hasRotatingPoint: false
        });
    }

    function degToRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    function setToolbar(shapejs){
        var canvas = shapejs.canvas;

        var cropContainer = document.createElement('li');
        crop = ShapeJS.util.createHTMLElement('<a><i class="fa fa-crop"></i>Crop</a>');
        cropContainer.appendChild(crop);
        crop = ShapeJS.util.createButton(crop)

        shapejs.addSubToolbarActions(cropContainer, 'crop');
    }

    ShapeJS.plugins['crop'] = function(shapejs, options){
        var canvas = shapejs.canvas;
        var cropEl = null;
        var objectsOnScreen = null;

        var cropBtn = ShapeJS.util.createHTMLElement('<i class="fa fa-crop"></i>');
        cropBtn = shapejs.createToolboxButton(cropBtn, {
			alt:"Crop Object"
		});
        shapejs.addToolboxButton(cropBtn, 'crop');
        
        //requireds adding the rectCrop back to the element because toObject breaks if not crop is made during an edit.
        var totalObjs = canvas.getObjects();
        for (var x = 0; x < totalObjs.length; x++){
        	if (totalObjs[x].rectCrop){
        		totalObjs[x].toObject = (function(toObject){
        			var rectObject = totalObjs[x].rectCrop;
                    return function() {
                        return fabric.util.object.extend(toObject.call(this), {
                            rectCrop: rectObject
                        });
                    };
                })(totalObjs[x].toObject);
        		
        	}
        }
        
        //Set toolbar and add function handler
        cropBtn.activate = function(){
            canvas.isCropMode = true;
            shapejs.clearSubToolbarActions();
            setToolbar(shapejs);

            startObjectCrop();
        }

        cropBtn.deactivate = function(){
            canvas.isCropMode = false;
            shapejs.clearSubToolbarActions();
            endObjectCrop();
        }
        
        
        function startObjectCrop(){
            objectsOnScreen = canvas.getObjects().length;            
            for (var i = 0; i < objectsOnScreen; i++){
                canvas.item(i).on('selected', cropFn);
            }
            
            if (canvas.getActiveObject()){
            	cropFn.apply(canvas.getActiveObject());
            }
        }

        function endObjectCrop(){
        	//remove the add cropEl function
            for (var i = 0; i < objectsOnScreen; i++){
                canvas.item(i).off('selected', cropFn);
            }

            shapejs.disableHistoryStackChange = true;
            canvas.remove(cropEl);
            shapejs.disableHistoryStackChange = false;
        }
        
        function cropFn(){
            //resets and remove previous cropEls
            if (cropEl != null){
                canvas.remove(cropEl);
            };
            var selectedEl = this;
            var selectedElScaleX = null;
            var selectedElScaleY = null;
            var selectedElAngle = null;
            //remove previous event listener, else it crop all objects
            if (crop.eventListener){
                crop.removeEventListener('click', crop.eventListener);
            }
            
            //Set the scale of crop el to the selected element
            function setScalesForCrop(){
                selectedElScaleX = selectedEl.scaleX;
                selectedElScaleY = selectedEl.scaleY;
                selectedElAngle = selectedEl.getAngle();

                selectedEl.setAngle(0);

                /*
                set and scale the Left and width to original 
                creation event of selected object, also match crop element
                */
                var objectWidth = selectedEl.width * selectedEl.scaleX;
                var cropOffsetX =  (cropEl.width + cropEl.left) 
                                - (objectWidth + selectedEl.left);
                var offsetFracX = cropOffsetX/objectWidth;
                cropEl.left = selectedEl.left + (offsetFracX*selectedEl.width);
                selectedEl.scaleX = 1;
                cropEl.width = cropEl.width/selectedElScaleX;

                /*
                set and scale the Top and Height to original 
                creation event of selected object, also match crop element
                */
                var objectHeight = selectedEl.height * selectedEl.scaleY;
                var cropOffsetY =  (cropEl.height + cropEl.top) 
                                - (objectHeight + selectedEl.top);
                var offsetFracY = cropOffsetY/objectHeight;
                cropEl.top = selectedEl.top + (offsetFracY*selectedEl.height);
                selectedEl.scaleY = 1;
                cropEl.height = cropEl.height/selectedElScaleY;

            }

            //scale the image back, cropEl not needed (removed later)
            function inverseScalesFromCrop(){
                selectedEl.scaleX = selectedElScaleX;
                selectedEl.scaleY = selectedElScaleY;
                selectedEl.setAngle(selectedElAngle);
            }

            function cropClick(event){
                setScalesForCrop();
                
                var left = cropEl.get('left') - selectedEl.get('left');
                var top = cropEl.get('top') - selectedEl.get('top');
                var eWidth = cropEl.get('width');
                var eHeight = cropEl.get('height');

                left = -(eWidth / 2) + left;
                top = -(eHeight / 2) + top;

                eWidth = eWidth * cropEl.scaleX;
                eHeight = eHeight * cropEl.scaleY;
                
                shapejs.disableHistoryStackChange = false;

                
                //modify the toObject behaviour for proper clipping on reading from JSON
                selectedEl.toObject = (function(toObject){
                    return function() {
                        return fabric.util.object.extend(toObject.call(this), {
                            rectCrop: {
                                left: left,
                                top: top,
                                width: eWidth,
                                height: eHeight
                            }
                        });
                    };
                })(selectedEl.toObject);

                //set for the clip functions
                selectedEl.rectCrop = {
                    left: left,
                    top: top,
                    width: eWidth,
                    height: eHeight
                };
                
                selectedEl.clipTo = function(ctx){
                    try{
                        var rectCrop = this.rectCrop;
                        ctx.rect(rectCrop.left, rectCrop.top, rectCrop.width, rectCrop.height);
                    }catch(e){
                        console.error(e);
                        return;
                    }
                };

                inverseScalesFromCrop();
                canvas.renderAll();
                
                //turn crop off
                cropBtn.trigger('click');                
            };

            cropEl = getCropElement();
            //set the crop model to the object selected
            cropEl.left = selectedEl.left;
            cropEl.top = selectedEl.top;
            cropEl.width = selectedEl.width * selectedEl.scaleX;
            cropEl.height = selectedEl.height * selectedEl.scaleY;
            cropEl.angle = selectedEl.angle;

            //add crop model
            shapejs.disableHistoryStackChange = true;
            canvas.add(cropEl);
            canvas.setActiveObject(cropEl);
            
            //on crop click, crop the object and exit crop plugin
            crop.addEventListener('click', cropClick);
            crop.eventListener = cropClick;
        };
    };
}());