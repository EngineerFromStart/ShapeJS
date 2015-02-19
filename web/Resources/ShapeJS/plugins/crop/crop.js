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

        var widthContainer = document.createElement('li');
        var widthIcon = ShapeJS.util.createHTMLElement('<span>W <i class="fa fa-arrows-h"></i></span>');
        var width = ShapeJS.util.createHTMLElement('<input style="width:60px" type="number"/>');
        var heightContainer = document.createElement('li');
        var heightIcon = ShapeJS.util.createHTMLElement('<span>H <i class="fa fa-arrows-v"></i></span>');
        var height = ShapeJS.util.createHTMLElement('<input style="width:60px" type="number"/>');

        var cropContainer = document.createElement('li');
        crop = ShapeJS.util.createHTMLElement('<a><i class="fa fa-crop"></i>Crop</a>');
        cropContainer.appendChild(crop);
        crop = ShapeJS.util.createButton(crop);

        widthContainer.appendChild(widthIcon);
        widthContainer.appendChild(width);

        heightContainer.appendChild(heightIcon);
        heightContainer.appendChild(height);


        shapejs.addSubToolbarActions(widthContainer, 'width');
        shapejs.addSubToolbarActions(heightContainer, 'height');
        shapejs.addSubToolbarActions(cropContainer, 'width');
    }

    ShapeJS.plugins['crop'] = function(shapejs, options){
        var canvas = shapejs.canvas;
        var cropEl = null;
        var objectsOnScreen = null;

        var cropBtn = ShapeJS.util.createHTMLElement('<i class="fa fa-crop"></i>');
        cropBtn = shapejs.createToolboxButton(cropBtn);
        shapejs.addToolboxButton(cropBtn, 'crop');
        
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
        }

        function endObjectCrop(){
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
            //remove previous event listener, else it crop all objects
            if (crop.eventListener){
                crop.removeEventListener('click', crop.eventListener);
            }
            
            //Set the scale of crop el to the selected element
            function setScalesForCrop(){
                selectedElScaleX = selectedEl.scaleX;
                selectedElScaleY = selectedEl.scaleY;
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

        //TODO add crop canvas functionality to edit drop down
        /*

        else {
            if (confirm("Crop Canvas?")){
                canvas.toObject = (function(toObject){
                    return function() {
                        return fabric.util.object.extend(toObject.call(this), {
                            rectCrop: getRectCrop()
                        });
                    };
                })(canvas.toObject);

                canvas.rectCrop = getRectCrop();
                
                canvas.clipTo = function(ctx){
                    var rectCrop = this.rectCrop;
                    ctx.rect(rectCrop.left, rectCrop.top, rectCrop.width, rectCrop.height);
                }
            };
        }
        */
    };
}());