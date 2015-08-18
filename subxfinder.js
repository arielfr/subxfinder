var xray = require('x-ray')(),
	sync = require('synchronize'),
	_ = require('lodash');

var subxfinder = function(){
	this.configs = {
		rootUrl: 'http://www.subdivx.com/index.php?accion=5&buscar=',
		timeout: 20000
	};

	return this;
}

subxfinder.prototype.search = function(title, callback){
	var _this = this,
		toSearch = this.prepareParameter(title);

	sync.fiber(function(){
		xray.timeout(_this.configs.timeout);

		try{
			if (title.length <= 3) throw new Error('The search title must have at least 3 letters');

			var data = sync.await(xray(_this.configs.rootUrl + toSearch, '#contenedor_interno #contenedor_izq', {
				result: 'span.result_busc',
				pages: xray('.pagination a', ['']),
				subs: {
					title: xray('#menu_detalle_buscador a', [{title: ''}]),
					description: xray('#buscador_detalle_sub', [{description: ''}]),
					link: xray('#buscador_detalle_sub_datos', [{link: 'a.link1@href'}])
				}
			})(sync.defer()));

			if (!data.result) throw new Error('No results available');

			var totalPages = 1;

			if(data.pages.length != 0){
				totalPages = (data.pages[data.pages.length - 1] != 'Siguiente »') ? data.pages[data.pages.length - 1] : data.pages[data.pages.length - 2];
			}

			var subtitles = _.merge(_.merge(data.subs.title, data.subs.description), data.subs.link);
			
			if(totalPages > 1){
				for( var i = 2; i < totalPages; i++ ){
					console.log('Querying page: %s', i)

					var data = sync.await(xray(_this.configs.rootUrl + toSearch + '&pg=' + i, '#contenedor_interno #contenedor_izq', {
						subs: {
							title: xray('#menu_detalle_buscador a', [{title: ''}]),
							description: xray('#buscador_detalle_sub', [{description: ''}]),
							link: xray('#buscador_detalle_sub_datos', [{link: 'a.link1@href'}])
						}
					})(sync.defer()));

					subtitles.push(_.merge(_.merge(data.subs.title, data.subs.description), data.subs.link));
				}
			}

			callback(null, subtitles);
		}catch(error){
			callback(error);
		}	
	});
}

subxfinder.prototype.setConfigs = function(configs){
	this.configs = _.merge(this.configs, configs);
}

subxfinder.prototype.prepareParameter = function(param){
	return encodeURIComponent(param)
}

module.exports = new subxfinder();