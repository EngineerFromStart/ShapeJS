/**
 * ShapeJS
 * 
 * (C) 2015 Karandeep Singh.
 * ShapeJS may be freely distributed under the MIT license
 */

//wrapping braces is a coding convention
(function(){//changes the scope of the ShapeJS;
	'use strict'; // forces you to instantiate variables by using 'var'

	//==============================================================================
	//==========================Helper functions====================================
	//==============================================================================

	/*
	used to add/ovverride objB's property into the objA
	*/
	function extend(objA, objB){
		var prop;
		for (prop in objB){
			if (objB.hasOwnProperty(prop)){
				objA[prop] = objB[prop];
			};
		}
		return objA;
	}

	/*
	used to create a element using a string and return it
	//TODO
	*/
	function createHTMLElement(str){
		var element = document.createElement('div');
		if (str.indexOf("<") != -1 && str.indexOf(">") != -1 && str.indexOf("/") != -1){
			element.innerHTML = str;
		}else{
			return document.createElement('str');
		}
		return element.firstChild;
	}

	/*
	load a js or css file dynamically and call a callback
	*/
	function loadJSFile(filePath, callback){
		var fileRef;
		if (!filePath) throw "No file to load";
		fileRef = document.createElement('script');
		fileRef.type = 'text/javascript';
		if (typeof callback === 'function'){
			if(fileRef.readyState) {  //IE
				script.onreadystatechange = function() {
					if ( fileRef.readyState === "loaded" || fileRef.readyState === "complete" ) {
						fileRef.onreadystatechange = null;
						callback();
					}
				};
			} else {  //Others
				fileRef.onload = function() {
					callback();
				};
			}
		};

		fileRef.src = filePath;
		document.getElementsByTagName("head")[0].appendChild(fileRef);
	}

	/*
	Creates coordinates for the objects added to the canvas on object init
	*/
	function getCoords(offset, limit){
		var off = offset || 50;
		var lim = limit || off/2;
		var left = Math.floor(Math.random() * off) - lim;
		var top = Math.floor(Math.random() * off) - lim;
		return {
			left: (left <  0) ? 0: left,
			top: (top < 0 )? 0 : top
		}
	}

	/*
	Helper methods to get current script paths and folder
	*/
	var scriptFullPath = function(){
		var scripts = document.getElementsByTagName('script');
		var index = scripts.length - 1;
		return scripts[index].src;
	}();
	var scriptJSPath = function(){
		return scriptFullPath.substring(0,scriptFullPath.lastIndexOf("/")+1);
	}();

	//==============================================================================
	//==========================The core library====================================
	//==============================================================================
	

	function ShapeJS(options, replaceEl){

		if (typeof fabric === "undefined"){
			throw "Fabric.js is required for this library";
		}
		return this.init(options, replaceEl); //'this' is referred to the object invoking the function, in this case the ShapeJS object
	}

	//SO it can be instantiated from outside
	window.ShapeJS = ShapeJS;
	
	ShapeJS.plugins = {};
	
	ShapeJS.prototype = {
		defaults: {
			initObjects: [],
			canvas:{
				width: 150,
				height: 150,
				rescale: 'auto'
			},
			pluginPath:scriptJSPath+'plugins',
			debug: false,
			defaultPlugins: {
				'base':{
					'ok':'ok'
				}
			},
		},

		
		/*
		Init for the Core ShapeJS Object
		- Set the options by combining the defaults and passing in new ones.
		- Setup the Canvas DOM structure by replacing an element, 
		and if its an image, it is added to the canvas,
		and instatiating multiple elements from the options initObjects
		- Init the Plugins after the core creation
		*/
		init: function(options, replaceEl){
			this.options = extend(this.defaults, options);
			var _this = this;
			if (replaceEl && typeof replaceEl === "string"){
				this.replaceEl = document.querySelector(replaceEl);
				if (this.replaceEl.nodeName.toLowerCase() == "img"){
					var img = new Image();
					//canvas must load after the image is loaded, else canvas gets blank image
					img.onload = function(){
						_this.options.initObjects.unshift(new fabric.Image(img));
						_this.initDOM().initPlugins();
					};
					img.src = this.replaceEl.src;//load the image
				}else{
					this.initDOM().initPlugins();
				}
			}else{
				throw "Must provide replacement element String"
			}
		},

		/*
		Sets the DOM structure required for proper functioning and tools
		
		Init the fabric objects and init objects
		*/
		initDOM: function(){
			this.initPage();

			this.initFabricCanvasAndInitObjects();
			return this;
		},

		/*
		Sets the initial DOM structure for plugin support
		*/
		initPage: function(){
			var _this = this;
			var container = document.createElement('div');
			container.className = "shapejs-container";

			var toolbar = document.createElement('div');
			var toolbarActions = createHTMLElement('<ul class="shapejs-toolbar-actions"></ul>');
			toolbar.className = "shapejs-toolbar";
			toolbar.appendChild(toolbarActions);
			container.appendChild(toolbar);

			var toolbox = document.createElement('div');
			toolbox.className = "shapejs-toolbox";
			container.appendChild(toolbox);

			var subToolbar = document.createElement('div');
			subToolbar.className = "shapejs-sub-toolbar";
			container.appendChild(subToolbar);

			var canvasContainer = document.createElement('div');
			canvasContainer.className = "shapejs-canvas-container";
			container.appendChild(canvasContainer);

			this.canvasDOM = document.createElement('Canvas');
			canvasContainer.appendChild(this.canvasDOM);
			this.canvasDOM.width = this.options.canvas.width;
			this.canvasDOM.height = this.options.canvas.height;
			//canvas has to exist on page before fabric canvas object creation
			this.replaceEl.parentNode.replaceChild(container, this.replaceEl);
		},

		/*
		Creates the fabric canvas, its context and adds the fabric init Objects
		
		Sets the canvas properties as needed upon object creation
		*/
		initFabricCanvasAndInitObjects: function(){
			this.canvas = new fabric.Canvas(this.canvasDOM, {});			

			this.ctx = this.canvas.getContext("2d");

			var initObjects = this.options.initObjects;
			for (var i = 0; i < initObjects.length; i++){
				var coords = getCoords(this.canvas.width, initObjects[i].getWidth());
				initObjects[i].set({
					left: coords.left,
					top: coords.top
				});


				if (this.options.canvas.rescale){
					if (this.canvas.width < initObjects[i].width){
						this.canvas.setWidth(initObjects[i].getWidth());
					}
					if (this.canvas.height < initObjects[i].height){
						this.canvas.setHeight(initObjects[i].getHeight());
					}
				}

				this.canvas.add(initObjects[i]);
			}
			return this;

		},

		//==============================================================================
		//==========================The plugin support==================================
		//==============================================================================
		/*

		*/
		addPlugins: function(){
			
			return this;
		},

		/*

		*/
		removePlugins: function(){

		},

		/*
		Instantiate the plugins synchronasly after putting them together

		Sets the shapejs object and the options in the plugin
		*/
		initPlugins: function(){
			var _this = this;
			var pluginFolder = this.options.pluginPath+'/';
			var all_plugins_objs = extend(this.options.defaultPlugins, this.options.plugins);
			var all_plugins_arr = Object.keys(all_plugins_objs);

			var index = 0;
			function loadJS(index){
				var name = all_plugins_arr[index];
				loadJSFile(pluginFolder+name+"/"+name+'.js', function(){
					ShapeJS.plugins[name](_this, all_plugins_objs[name]);
					if (index < all_plugins_arr.length - 1){
						index++;
						loadJS(index);
					}
				});
			}

			loadJS(index);

			return this;
		},
		
		/*

		*/
		Plugin: function(options){
			function plugin(){
				return this.init();
			};
			plugin.prototype = {
				defaults: {

				},
				options:{

				},
				init: function(){
					this.options = extend(this.defaults, options);
				}
			}
			return new plugin();//causes the function to become a object type
		}
	}
	
}())