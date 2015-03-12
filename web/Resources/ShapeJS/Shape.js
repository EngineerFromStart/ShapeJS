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
(function initShapeJS(){//changes the scope of the ShapeJS;
	'use strict'; // forces you to instantiate variables by using 'var'

	//==============================================================================
	//==========================Helper functions====================================
	//==============================================================================

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
	
	//Holds all the valid plugins, exists without instantiation
	ShapeJS.plugins = {};
	
	//prototype only instantiated when new is called.
	ShapeJS.prototype = {
		defaults: {
			initObjects: [],
			canvas:{
				width: 200,
				height: 200,
				rescale: 'auto'
			},
			shapejsPath: scriptJSPath,
			pluginPath: scriptJSPath+'plugins',
			debug: false,
			defaultPlugins: {
				'base': {
					//'path':"../bla.js" 
				},
				'adjustments':{},
				'history':{},
				'SCCP':{},//Select , Cut, Copy, Paste
				'cropV2':{},
				'align':{},
				'annotation':{},
				'text':{},
				'shapes':{},
				'color':{}
			},
			'font-awesome-path':'default',
			afterRender: function(shapejs){
				
			}
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
			this.options = ShapeJS.util.extend(options, this.defaults);
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

		Also added object support to have better controls
		*/
		initDOM: function(){
			var _this = this;
			var container = this.container = ShapeJS.util.createHTMLElement('<div class="shapejs-container" tabindex="1"></div>');

			this.toolbar = ShapeJS.util.createHTMLElement('<ul class="shapejs-toolbar"></ul>');
			this.toolbar.items = {};
			container.appendChild(this.toolbar);

			this.toolbox = ShapeJS.util.createHTMLElement('<ul class="shapejs-toolbox"></ul>');
			this.toolbox.items = {};
			container.appendChild(this.toolbox);

			this.subToolbar = ShapeJS.util.createHTMLElement('<ul class="shapejs-sub-toolbar"></ul>');
			this.subToolbar.items = {};
			container.appendChild(this.subToolbar);

			this.canvasContainer = ShapeJS.util.createHTMLElement('<div class="shapejs-canvas-container"></div>');
			container.appendChild(this.canvasContainer);

			this.canvasDOM = document.createElement('Canvas');
			this.canvasDOM.width = this.options.canvas.width || 200;//if they forget to pass in width
			this.canvasDOM.height = this.options.canvas.height || 200;//if they forget to pass in height
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
				var coords = ShapeJS.util.getCoords(
						this.canvas.width < this.canvas.height ? this.canvas.width : this.canvas.height,
						initObjects[i].getWidth()
				);
				initObjects[i].set({
					left: coords.left,
					top: coords.top
				});

				if (this.options.canvas.rescale == 'auto'){
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
		//==========================The plugin specific support==================================
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
			this.options.plugins = ShapeJS.util.extend(this.options.plugins, this.options.defaultPlugins);
			var all_plugins_arr = Object.keys(this.options.plugins);//puts the keys into an array

			var index = 0;
			function loadJS(index){
				var name = all_plugins_arr[index];
				var pathToPlugin = pluginFolder+name+"/"+name+'.js';
				if (_this.options.plugins[name].path){
					pathToPlugin = _this.options.plugins[name].path;
				}
				//load js file, once file is loaded, instatiate it and move to next one
				util.loadJSFile(pathToPlugin, function(){
					try{
						ShapeJS.plugins[name](_this,  _this.options.plugins[name]);
					}catch(e){
						console.group("Could not load the plugin: '%s'", name);
						console.error(e.name);
						console.error(e.message);
						console.error(e.stack);
						console.groupEnd();
					}					

					if (index < all_plugins_arr.length - 1){
						index++;
						loadJS(index);
					}else{
						_this.options.afterRender(_this);
					}
				});
			}

			loadJS(index);
		},

		//==============================================================================
		//======================ShapeJS DOM Specific support============================
		//==============================================================================
		
		/*
		
		*/
		createToolbarActions: function(label, dropdown){
			var elStr = '<li>'+label+'</li>';
			var action = ShapeJS.util.createHTMLElement(elStr);
			if (dropdown) {
				action.appendChild(dropdown);
			}
			return action;
		},

		addToolbarActions: function(toolbarAction, context){
			this.toolbar.appendChild(toolbarAction);
			if (context){
				this.toolbar.items[context] = toolbarAction;
			}
		},

		/*
		
		*/
		createToolboxButton: function(element, extras){
			var _this = this;
			var el = document.createElement('li');
			el.appendChild(element);
			
			//make it a button that holds the element
			var btn = ShapeJS.util.createButton(el, extras);

			btn.addEventListener('click', function(event){
				//deactivate all items and change element class
				_this.resetToolbox([this]);

				//activate/deactivate this button
				btn.active = !btn.active;
				if (btn.active){
					this.classList.add('shapejs-button-active');
					btn.activate();
				}else{
					this.classList.remove('shapejs-button-active');
					btn.deactivate();
				}
			});

			return btn;
		},
		
		addToolboxButton: function(toolboxActions, context){
			this.toolbox.appendChild(toolboxActions.element);
			if (context){
				this.toolbox.items[context] = toolboxActions;
			}
		},
		
		resetToolbox: function(exclude){
			for (var itemType in this.toolbox.items){
				var item = this.toolbox.items[itemType];
				for (var bad in exclude){
					if (item.active && exclude[bad] != item.element){
						item.element.classList.remove('shapejs-button-active');
						item.deactivate();
						item.active = false;
					}
				}
			}
		},

		/*
		Subtoolbar stuff
		*/

		addSubToolbarActions: function(subToolbarAction, context){
			this.subToolbar.appendChild(subToolbarAction);
			if (context){
				this.subToolbar.items[context] = subToolbarAction;
			}
		},

		clearSubToolbarActions: function(){
			this.subToolbar.innerHTML = "";
			this.subToolbar.items = {};
		},

		//==============================================================================
		//=================================ShapeJS Support==============================
		//==============================================================================

		setActiveObjectProp: function(name, value){
			var object = this.canvas.getActiveObject();
			if (!object) return;
			object.set(name, value).setCoords();
			this.canvas.renderAll();
		},

		getActiveObjectProp: function(name){
			var object = this.canvas.getActiveObject();
			if (!object) return;
			return object.get(name);
		}
	}

	/*
		The Plugin Object that the plugins must instatiate for increase functionality
	*/
	ShapeJS.Plugin = function(name){
		console.log(this);
		this.name = name;
	}

	ShapeJS.Plugin.prototype = {
		sayName: function(){
			console.log(this.name);
		}
	};	

	var util = {
		/*
		used to add/ovverride objB's property into the objA

		false used to confirm if objA is actually trying to ovverride the properties

		order matters here, because one could be a prototype object, which
		affects all the plugins
		*/
		extend: function (objA, objB){
			var prop;
			for (prop in objB){
				if (objB.hasOwnProperty(prop) && objA.hasOwnProperty(prop) === false){
					objA[prop] = objB[prop];
				};
			}
			return objA;
		},

		//Gets the element by a query selector
		getElement: function(query){
			return document.querySelector(query);
		},

		insertAfter: function(newNode, refNode){
			refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
		},

		/*
		*/
		createButton: function(element, extras){
			function Button(el, extras){
				this.element = el;
				this.active = false;
				this.dropdown = null;
				
				el.classList.add('button');
				if (extras){
					if (extras.alt) {
						var altTag = document.createElement('span');
						altTag.classList.add('button-tooltip');
						altTag.classList.add('right');
						altTag.innerHTML = extras.alt;
						el.appendChild(altTag);
					}
				}
			}

			Button.prototype = {
				addEventListener: function(eventName, callback) {
				    var el = this.element;
				    el.addEventListener(eventName, callback);
		    	},
		    	removeEventListener: function(eventName){
		    		var el = this.element;
		    		el.removeEventListener(eventName);
		    	},
		    	disable: function(value){
		    		this.element.disabled = (value) ? true : false;
		    	},
		    	trigger: function(eventName, callback){
		    		var el = this.element;
		    		var returnVal = el[eventName]();
		    		
		    		//if trigger callback is set, it is run and returned instead
		    		if (callback) return callback();
		    		
				    return returnVal;
		    	},
		    	addDropDown: function(dropdown, direction){
		    		var el = this.element;
		    		var parent = document.createElement('li');
		    		var clickHandler = this.element.onclick;
					var dropTimeout;

					this.dropdown = dropdown;

		    		direction = direction || 'right';
		    		el.parentNode.replaceChild(parent, el);
		    		parent.appendChild(el);
		    		parent.appendChild(dropdown);

		    		parent.style.position = 'relative';

		    		/* Display the DD*/
					this.addEventListener('mousedown', function(){
						dropTimeout = setTimeout(function(){
							this.removeEventListener('click');
							dropdown.style.display = 'block';
						}, 400)
					});

					this.addEventListener('mouseup', function(event){
						clearTimeout(dropTimeout);
						this.addEventListener('click', clickHandler);
					});
		    	},
		    	addItemToDropdown: function(el){
		    		if (!this.dropdown) throw "No dropdown yet";
		    		this.dropdown.appendChild(el);
		    	}
			}
			return new Button(element, extras);
		},
		
		createButtonGroup: function(buttons, options){
			function ButtonGroup(btns, opts){
				this.multiSelect = opts.allowMulti || false;
				this.clickHandler = options.groupClickHandler;
				this.buttonGroup = [];
				this.element = document.createElement('ul');

				for (var x = 0; x < buttons.length; x++){
					var btn = buttons[x];

					this.addButton(btn);
				}
			}
			ButtonGroup.prototype = {
				addButton: function(btn){
					var list = document.createElement('li');
					list.appendChild(btn.element);
					btn.element = list;

					this.buttonGroup.push(btn);
					this.element.appendChild(btn.element);
				}
			}
			return new ButtonGroup(buttons, options);
		},

		/*
			used to create a element using a string and return it
			//TODO
		*/
		createHTMLElement: function(str){
			var element = document.createElement('div');
			if (str.indexOf("<") != -1 && str.indexOf(">") != -1){
				element.innerHTML = str;
			}else{
				return document.createElement('str');
			}
			return element.firstChild;
		},

		/*
			Creates coordinates for the objects added to the canvas on object init

			takes a limit so object doesnt go off;
		*/
		getCoords: function(offset, limit){
			var off = offset || 50;
			var lim = limit || off/2;
			var left = Math.floor(Math.random() * off) - lim;
			var top = Math.floor(Math.random() * off) - lim;
			return {
				left: (left <  0) ? 0: left,
				top: (top < 0 )? 0 : top
			}
		},

		/*
			load a js or css file dynamically and call a callback
		*/
		loadJSFile: function (filePath, callback){
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
		},

		/**
		 * Usage: d = new Detector();
		 *        d.detect('font name');
		 */
		fontDetection: function() {
		    // a font will be compared against all the three default fonts.
		    // and if it doesn't match all 3 then that font is not available.
		    var baseFonts = ['monospace', 'sans-serif', 'serif'];

		    //we use m or w because these two characters take up the maximum width.
		    // And we use a LLi so that the same matching fonts can get separated
		    var testString = "mmmmmmmmmmlli";
		    //we test using 72px font size, we may use any size. I guess larger the better.
		    var testSize = '72px';

		    var h = document.getElementsByTagName("body")[0];

		    // create a SPAN in the document to get the width of the text we use to test
		    var s = document.createElement("span");
		    s.style.fontSize = testSize;
		    s.innerHTML = testString;
		    var defaultWidth = {};
		    var defaultHeight = {};
		    for (var index in baseFonts) {
		        //get the default width for the three base fonts
		        s.style.fontFamily = baseFonts[index];
		        h.appendChild(s);
		        defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
		        defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
		        h.removeChild(s);
		    }

		    function detect(font) {
		        var detected = false;
		        for (var index in baseFonts) {
		            s.style.fontFamily = font + ',' + baseFonts[index]; // name of the font along with the base font for fallback.
		            h.appendChild(s);
		            var matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
		            h.removeChild(s);
		            detected = detected || matched;
		        }
		        return detected;
		    }

		    this.detect = detect;
		},

		appendMultipleChildren: function(parentNode, elements){
			for (var i in elements){
				parentNode.appendChild(elements[i]);
			}
			return parentNode;
		}
	}
	ShapeJS.util = util;
}())