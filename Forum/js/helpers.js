var Forum = Forum || {};

Forum.helpers = (function () {
	var htmlBuilder = function(templateName, data) {
		var template = templateLoader(templateName);
		return template(data);
	};

	var templateLoader = function render(tmpl_name) {
		if (!render.tmpl_cache) {
			render.tmpl_cache = {};
		}
		if (!render.tmpl_cache[tmpl_name]) {
			var tmpl_dir = 'templates';
			var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';
			var tmpl_string;
			$.ajax({
				url: tmpl_url,
				method: 'GET',
				async: false,
				success: function(data) {
					tmpl_string = data;
				}
			});
			render.tmpl_cache[tmpl_name] = Handlebars.compile(tmpl_string);
		}
		return render.tmpl_cache[tmpl_name];
	};

	return{
		templateLoader: templateLoader,
		htmlBuilder: htmlBuilder
	};
})(); 