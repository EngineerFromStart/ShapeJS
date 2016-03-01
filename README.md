# ShapeJS
Extensiable Image Manipulation Library
- Built on top of Fabric JS

## Usage
1. Import fabric.js
2. import shape.js
3. Init a new ShapeJS object

### Example Usage (more ocming)

- plugins can be disabled/configured

```javascript
    var shape1 = new ShapeJS({
    	initObjects: [],
    	plugins: {
    	},
    	pluginPath: JSPDIR+"/javascripts/ShapeJS/plugins",
    	shapejsPath: JSPDIR+"/javascripts/ShapeJS/",
    	canvas:{
    		width: valueObj.canvas.width,
    		height: valueObj.canvas.height,
    		rescale: 'auto'
    	},
    	afterRender: function(shapejs){
    		if (serialize){
    			shapejs.disableHistoryStackChange = true;
    			shapejs.canvas.loadFromJSON(valueObj.canvas.serial, function(){
    				shapejs.canvas.renderAll();
    				shapejs.disableHistoryStackChange = false;
    				
    				console.info('Reseting history for after render' );
    				shapejs.historyStack = [JSON.stringify(shapejs.canvas)];
    				shapejs.historyIndex = 0;
    				
    				shapejs.canvas.setWidth(valueObj.canvas.width)
    				shapejs.canvas.setHeight(valueObj.canvas.height)
    			});
    			
    		}
    		
    		//on submit disable selections
    		//when submit is clicked, update the input	
    		shapejs.container.addEventListener('blur', updateInput);
    		shapejs.canvas.on('object:modified', updateInput);
    		shapejs.canvas.on('object:added', updateInput);
    		shapejs.canvas.on('object:removed', updateInput);
    		shapejs.canvas.on('canvas:cleared', updateInput);
    	}
    }, "#"+shapeId);
```

## TODO - Future (not in specific order)
1. move to commonjs / amd require model
2. rewrite in ES6
3. improve theme
4. write tests
