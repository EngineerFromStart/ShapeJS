//fabric object creator

this.options.initObjects.unshift({
						"type":"Image",
						"args": [this.replaceEl]
					});

/*
		Object Query based on a String Split
	*/
	function accessObjectBySplit(obj, str, splitString){
		var explodedArr = str.split(splitString);
		while (explodedArr.length){
			obj = obj[explodedArr.shift()];
		}

		return obj;

	}

var initObjects = this.options.initObjects;
			var addedToCanvasOnCallback;
			var param1;
			var param2;
			var param3;
			var callback;
			for (var i = 0; i < initObjects.length; i++){
				//allways Use param one
				param1 = initObjects[i].args[0];

				//set param2 by type
				addedToCanvasOnCallback = false;
				if (typeof initObjects[i].args[1] == "function"){
					var callback = initObjects[i].args[1];
					param2 = function(obj){
						_this.canvas.add(obj);
						callback();
					}
					addedToCanvasOnCallback = true;
				}else if (typeof initObjects[i].args[1] == "Object"){
					param2 = initObjects[i].args[1];
				}

				//set param3 if needed
				if (typeof initObjects[i].args[2] == "function"){
					var callback = initObjects[i].args[2];
					param3 = function(obj){
						_this.canvas.add(obj);
						callback();
					}
					addedToCanvasOnCallback = true;
				}else if (typeof initObjects[i].args[2] == "Object"){
					param3 = initObjects[i].args[2];
				}

				//fabric functions to call
				var objectConstructor = accessObjectBySplit(fabric, initObjects[i].type, ".");
				console.log(objectConstructor);
				console.log(param1);
				console.log(param2);
				console.log(param3);
				var fabricObj = new objectConstructor(param1, param2, param3);

				if (!addedToCanvasOnCallback){
					this.canvas.add(fabricObj);
				}

				if (this.options.canvas.width == 'auto'){
					if (this.canvas.width < fabricObj.width){
						this.canvas.setWidth(fabricObj.width);
					}
				}
				if (this.options.canvas.height == 'auto'){
					if (this.canvas.height < fabricObj.height){
						this.canvas.setHeight(fabricObj.getHeight());
					}
				}
			}