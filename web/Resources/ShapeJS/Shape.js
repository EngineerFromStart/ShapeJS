/**
 * ShapeJS
 * 
 * (C) 2015 Karandeep Singh.
 * ShapeJS may be freely distributed under the MIT license
 */


 /*
	- instantiates ShapeJS object (contructure function)
	- new objects combines the defaults and options supplied
	- replaces element (or image) with its own DOM
	- inits the fabric objects and canvas
	- inits the plugins (from options and defaults) by loading them via JS
 */

//wrapping braces is a coding convention
(function(){//changes the scope of the ShapeJS;
	'use strict'; // forces you to instantiate variables by using 'var'

	//==============================================================================
	//==========================Helper functions====================================
	//==============================================================================

	/*

	*/
	function $(query){
		return document.querySelector(query);
	};

	/*
	used to add/ovverride objB's property into the objA

	false used to confirm if objA is actually trying to ovverride the properties

	order matters here, because one could be a prototype object, which
	affects all the plugins
	*/
	function extend(objA, objB){
		var prop;
		for (prop in objB){
			if (objB.hasOwnProperty(prop) && objA.hasOwnProperty(prop) === false){
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
		if (str.indexOf("<") != -1 && str.indexOf(">") != -1){
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

	takes a limit so object doesnt go off;
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

	/*
	Creating a Generic Button
	*/
	function Button(element){
		this.element = element;
	}

	Button.prototype = {
		addEventListener: function(eventName, callback) {
		    var el = this.element;
		    if (el.addEventListener){
		    	el.addEventListener(eventName, callback);
		    } else if (el.attachEvent) {
		    	el.attachEvent('on' + eventName, callback);
		    }
    	},
    	disable: function(value){
    		this.element.disabled = (value) ? true : false
    	}
	}

	//==============================================================================
	//==========================The core library and DOM============================
	//==============================================================================
	

	function ShapeJS(options, replaceEl){

		if (typeof fabric === "undefined"){
			throw "Fabric.js is required for this library";
		}
		return this.init(options, replaceEl); //'this' is referred to the object invoking the function, in this case the ShapeJS object
	}

	//SO it can be instantiated from outside
	window.ShapeJS = ShapeJS;
	
	//Holds all the valid plugins
	ShapeJS.plugins = {};
	
	ShapeJS.prototype = {
		defaults: {
			initObjects: [],
			canvas:{
				width: 150,
				height: 150,
				rescale: 'auto'
			},
			shapejsPath: scriptJSPath,
			pluginPath:scriptJSPath+'plugins',
			debug: false,
			defaultPlugins: {
				'base': {
					//'path':"../bla.js" 
				},
				'history':{

				},
				'SCCP':{//Select , Cut, Copy, Paste
					
				},
				'annotation':{

				}
			},
			'font-awesome-path':'default'
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
			var _this = this;
			this.options = extend(options, this.defaults);

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
			var _this = this;
			var container = this.container = createHTMLElement('<div class="shapejs-container"></div>');

			this.toolbar = createHTMLElement('<ul class="shapejs-toolbar"></ul>');
			container.appendChild(this.toolbar);

			this.toolbox = createHTMLElement('<ul class="shapejs-toolbox"></ul>');
			container.appendChild(this.toolbox);

			this.subToolbar = createHTMLElement('<ul class="shapejs-sub-toolbar"></ul>');
			container.appendChild(this.subToolbar);

			this.canvasContainer = createHTMLElement('<div class="shapejs-canvas-container"></div>');
			container.appendChild(this.canvasContainer);

			this.canvasDOM = document.createElement('Canvas');
			this.canvasDOM.width = this.options.canvas.width;
			this.canvasDOM.height = this.options.canvas.height;
			this.canvasContainer.appendChild(this.canvasDOM);
			//canvas has to exist on page before fabric canvas object creation
			this.replaceEl.parentNode.replaceChild(container, this.replaceEl);

			//init fabric stuff
			this.initFabricCanvasAndInitObjects();

			return this;
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
		Instantiate the plugins synchronasly after putting them in an array
		*Async seems to run into issues where plugins load out of orders
		*folder, file and plugins object names must match, unless 'path' is defined

		Sets the shapejs object and the options in the plugin
		*/
		initPlugins: function(){
			var _this = this;
			var pluginFolder = this.options.pluginPath+'/';
			this.options.plugins = extend(this.options.plugins, this.options.defaultPlugins);
			var all_plugins_arr = Object.keys(this.options.plugins);//puts the keys into an array

			var index = 0;
			function loadJS(index){
				var name = all_plugins_arr[index];
				var pathToPlugin = pluginFolder+name+"/"+name+'.js';
				if (_this.options.plugins[name].path){
					pathToPlugin = _this.options.plugins[name].path;
				}
				//load js file, once file is loaded, instatiate it and move to next one
				loadJSFile(pathToPlugin, function(){
					//all_plugins_arr[index] = new _this.Plugin(ShapeJS.plugins[name]);
					//all_plugins_arr[index].init(_this,  _this.options.plugins[name]);
					ShapeJS.plugins[name](_this,  _this.options.plugins[name]);

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
		The Plugin Object that the plugins must instatiate for increase functionality
		*/
		Plugin: function(callback){
			function plugin(){
			};
			plugin.prototype = {
				init: callback
			}
			return new plugin();//causes the function to become a object type
		},

		//==============================================================================
		//============================The DOM support===================================
		//==============================================================================
		/*
		*/
		createElement: function(str){
			return document.createElement(str);
		},

		/*
		*/
		getEl: function(query){
			return $(query)
		},

		/*
		*/
		createShapeJSButton: function(element){
			return new Button(element);
		},

		/*
		*/
		createHTMLElement: function(str){
			return createHTMLElement(str);
		},

		/*
		
		*/
		createToolbarActions: function(label, dropdown){
			var elStr = '<li>'+label+'</li>';
			var action = createHTMLElement(elStr);
			if (dropdown) {
				action.appendChild(dropdown);
			}
			return action;
		},

		addToolbarActions: function(toolbarAction){
			this.toolbar.appendChild(toolbarAction);
		},

		/*
		
		*/
		createToolboxActions: function(element, dropdown){
			var action = document.createElement('li');
			action.appendChild(element);
			if (dropdown){
				action.appendChild(dropdown);
			}
			return action;
		},

		/*
		
		*/
		addToolboxActions: function(toolboxActions){
			this.toolbox.appendChild(toolboxActions);
		},

		/*
		
		*/
		addSubToolbarActions: function(subToolbarAction){
			this.subToolbar.appendChild(subToolbarAction);
		}
	}

}())