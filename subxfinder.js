var xray = require('x-ray')(),
	_ = require('lodash');

var subxfinder = function(){
	this.configs = {
		rootUrl: 'http://www.subdivx.com/index.php?accion=5&buscar=',
		timeout: 20000
	};

	return this;
};

subxfinder.prototype.search = function(title, callback){
	var _this = this,
		toSearch = this.prepareParameter(title);

	xray.timeout(_this.configs.timeout);

	try{
		if (title.length <= 3) throw new Error('The search title must have at least 3 letters');

		console.log('Searching subtitles for: %s', title);

		xray(_this.configs.rootUrl + toSearch, '#contenedor_interno #contenedor_izq', {
			result: 'span.result_busc',
			pages: xray('.pagination a', ['']),
			subs: {
				title: xray('#menu_detalle_buscador a', [{title: ''}]),
				description: xray('#buscador_detalle_sub', [{description: ''}]),
				link: xray('#buscador_detalle_sub_datos', [{link: 'a:last-child@href'}])
			}
		})(function(err, data){
			if (!data.result) throw new Error('No results available');
			if (err) throw new Error(err);

			var totalPages = 1;

			if(data.pages.length != 0){
				totalPages = (data.pages[data.pages.length - 1] != 'Siguiente »') ? data.pages[data.pages.length - 1] : data.pages[data.pages.length - 2];
			}

			var subtitles = _.merge(_.merge(data.subs.title, data.subs.description), data.subs.link);

			if(totalPages > 1){
				var i = 2;
				searchRecursive(_this.configs, toSearch, subtitles, totalPages, i, callback);
			}
		});
	}catch(error){
		callback.apply(null, [error, null]);
	}
};

subxfinder.prototype.searchAndFilter = function(title, description_filter, strict, callback){
	var _this = this,
		descFilters = (strict) ? [description_filter] : description_filter.split(" ");

	try{
		var subtitles = _this.search(title, function(err, subtitles){
			if(err){
				throw new Error(err);
			}else{
				//Filter by description
				subtitles = _.filter(subtitles, function(sub){
					var found = false;

					if(sub.description){
						_(descFilters).forEach(function(str){
							if( sub.description.toLowerCase().indexOf(str.toLowerCase()) !== -1 ){
								found = true;
								return;
							}
						}).value();
					}

					return found;
				});
			}
		});

		callback.apply(null, [null, subtitles]);
	}catch(error){
		callback.apply(null, [error, null]);
	}
};

/**
 * Search on page recursive
 * @param configs
 * @param toSearch
 * @param subtitles
 * @param totalPages
 * @param i
 * @param callback
 */
function searchRecursive(configs, toSearch, subtitles, totalPages, i, callback){
	console.log('Querying page: %s', i);

	xray(configs.rootUrl + toSearch + '&pg=' + i, '#contenedor_interno #contenedor_izq', {
		subs: {
			title: xray('#menu_detalle_buscador a', [{title: ''}]),
			description: xray('#buscador_detalle_sub', [{description: ''}]),
			link: xray('#buscador_detalle_sub_datos', [{link: 'a:last-child@href'}])
		}
	})(function(err, data){
		subtitles = subtitles.concat(_.merge(_.merge(data.subs.title, data.subs.description), data.subs.link));
		i = i + 1;

		if(i == totalPages){
			callback.apply(null, [null, subtitles]);
		}else{
			searchRecursive(configs, toSearch, subtitles, totalPages, i, callback);
		}
	});
}

subxfinder.prototype.setConfigs = function(configs){
	this.configs = _.merge(this.configs, configs);
};

subxfinder.prototype.prepareParameter = function(param){
	return encodeURIComponent(param)
};

module.exports = new subxfinder();