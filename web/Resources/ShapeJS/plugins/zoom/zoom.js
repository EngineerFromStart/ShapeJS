(function(){
	ShapeJS.plugins['zoom'] = function(shapejs, options){
		
		
		
		fabric.Cropzoomimage = fabric.util.createClass(fabric.Image, 
				{
					type: 'cropzoomimage',
					zoomedXY: false,
					initialize: function(element, options) 
					{
						options || (options = {});
						this.callSuper('initialize', element, options);
						this.set({
							orgSrc: element.src,
							cx: 0, // clip-x
							cy: 0, // clip-y
							cw: element.width, // clip-width
							ch: element.height // clip-height
						});
					},

					zoomBy: function(x, y, z, callback) 
					{
						if (x || y) { this.zoomedXY = true; }
						this.cx += x;
						this.cy += y;

						if (z) {
							this.cw -= z;
							this.ch -= z/(this.width/this.height);
						}

						if (z && !this.zoomedXY) { 
							// Zoom to center of image initially
							this.cx = this.width / 2 - (this.cw / 2);
							this.cy = this.height / 2 - (this.ch / 2);
						}

						if (this.cw > this.width) { this.cw = this.width; }
						if (this.ch > this.height) { this.ch = this.height; }
						if (this.cw < 1) { this.cw = 1; }
						if (this.ch < 1) { this.ch = 1; }
						if (this.cx < 0) { this.cx = 0; }
						if (this.cy < 0) { this.cy = 0; }
						if (this.cx > this.width - this.cw) { this.cx = this.width - this.cw; }
						if (this.cy > this.height - this.ch) { this.cy = this.height - this.ch; }

						this.rerender(callback);
					},

					rerender: function(callback) 
					{
						var img = new Image(), obj = this;
						img.onload = function() {
							var canvas = fabric.util.createCanvasElement();
							canvas.width = obj.width;
							canvas.height = obj.height;
							canvas.getContext('2d').drawImage(this, obj.cx, obj.cy, obj.cw, obj.ch, 0, 0, obj.width, obj.height);

							img.onload = function() {
								obj.setElement(this);
								obj.applyFilters(demo.canvas.renderAll.bind(demo.canvas));
								obj.set({
									left: obj.left,
									top: obj.top,
									angle: obj.angle
								});
								obj.setCoords();
								if (callback) { callback(obj); }
							};
							img.src = canvas.toDataURL('image/png');
						};
						img.src = this.orgSrc;
					},

					toObject: function()
					{
						return fabric.util.object.extend(this.callSuper('toObject'), {
							orgSrc: this.orgSrc,
							cx: this.cx,
							cy: this.cy,
							cw: this.cw,
							ch: this.ch
						});
					}
				});

				fabric.Cropzoomimage.async = true;
				fabric.Cropzoomimage.fromObject = function(object, callback) {
					fabric.util.loadImage(object.src, function(img) {
						fabric.Image.prototype._initFilters.call(object, object, function(filters) {
							object.filters = filters || [];
							var instance = new fabric.Cropzoomimage(img, object);
							if (callback) { callback(instance); }
						});
					}, null, object.crossOrigin);
				};

				var demo = {
					canvas: null,

					zoomBy: function(x, y, z) {
						var activeObject = demo.canvas.getActiveObject();
						if (activeObject) {
							activeObject.zoomBy(x, y, z, function(){demo.canvas.renderAll()});
						}
					},

					objManip: function(prop, value) {
						var obj = demo.canvas.getActiveObject();
						if (!obj) { return true; }
						
						switch(prop) {
							case 'zoomBy-x':
								obj.zoomBy(value, 0, 0, function(){demo.canvas.renderAll()});
								break;
							case 'zoomBy-y':
								obj.zoomBy(0, value, 0, function(){demo.canvas.renderAll()});
								break;
							case 'zoomBy-z':
								obj.zoomBy(0, 0, value, function(){demo.canvas.renderAll()});
								break;
							default:
								obj.set(prop, obj.get(prop) + value);
								break;
						}

						if ('left' === prop || 'top' === prop) { obj.setCoords(); }
						demo.canvas.renderAll();
						return false;
					},

					init: function() {
						// Init canvas:
						demo.canvas = new fabric.Canvas('c');

						var img = new Image(); 
						img.onload = function() {
							var fImg = new fabric.Cropzoomimage(this, {
								originX: 'center',
								originY: 'center',
								left: demo.canvas.getWidth()/2,
								top: demo.canvas.getHeight()/2
							});
							//fImg.setCrossOrigin('anonymous');
							demo.canvas.add(fImg);
							demo.canvas.setActiveObject(fImg);
						};
						//img.src = 'http://www.webgear.nl/pics/tulips.jpg';
						img.src = document.getElementById('base64').textContent;

						this.initKeyboard();
					},

					initKeyboard: function() {
						document.onkeydown = function(event) {
							var key = window.event ? window.event.keyCode : event.keyCode;

							switch(key) {
								case 173: case 109: // -
									if (event.ctrlKey || event.metaKey) {
										return demo.objManip('zoomBy-z', -10);
									}
									return true;
								case 61: case 107: // +
									if (event.ctrlKey || event.metaKey) {
										return demo.objManip('zoomBy-z', 10);
									}
									return true;
								case 37: // left
									if (event.shiftKey) {
										return demo.objManip('zoomBy-x',-1); return false;
									}
									if (event.ctrlKey || event.metaKey) {
										return demo.objManip('angle', -1);
									}
									return demo.objManip('left', -1);
								case 39: // right
									if (event.shiftKey) {
										return demo.objManip('zoomBy-x',1); return false;
									}
									if (event.ctrlKey || event.metaKey) {
										return demo.objManip('angle', 1);
									}
									return demo.objManip('left', 1);
								case 38: // up
									if (event.shiftKey) {
										return demo.objManip('zoomBy-y', -1);
									}
									if (!event.ctrlKey && !event.metaKey) {
										return demo.objManip('top', -1);
									}
									return true;
								case 40: // down
									if (event.shiftKey) {
										return demo.objManip('zoomBy-y', 1);
									}
									if (!event.ctrlKey && !event.metaKey) {
										return demo.objManip('top', 1);
									}
									return true;
							}
						};
					}
				};

				window.onload = function() { demo.init(); };
				
				
				/*
				 
				 body {
						font: 11pt Arial, Helvetica;
					}
					
					#canvasContainer {
						background-image: url(data:image/gif;base64,R0lGODlhCgAKAIAAAOLi4v///yH5BAAHAP8ALAAAAAAKAAoAAAIRhB2ZhxoM3GMSykqd1VltzxQAOw==);
						display: inline-block;
						border: 2px solid #ccc;
					}
					
					.key>span {
						background: #428bca;
						border-radius: 3px;
						color: white;
						font-size: 9pt;
						padding: 2px;
					}

				 */
	}
}());