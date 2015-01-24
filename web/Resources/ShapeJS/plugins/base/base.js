(function(){
	ShapeJS.plugins['base'] = function(shapejs, options){
		str = '<li>Clear</li>'
		str += '<li>Import</li>'
		str += '<li>Export</li>'
		shapejs.addToolbarActions(shapejs.createToolbarActions('File', str));
	}
}());