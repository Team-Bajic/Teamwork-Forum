var Forum = Forum || {};

Forum.ApplicationID = 'OHLDDw4fScOBF6B9rRO40p4urKuEoNXpakX2UvXX';
Forum.RestApiKey = 'K9J7vXfCWIvDiC0VwMxF2wzdo0ktzMjMcsLCsFZH';
Forum.baseUrl = 'https://api.parse.com/1';

Forum.Requester = (function() {
	var headers = {
		'X-Parse-Application-Id': Forum.ApplicationID,
		'X-Parse-REST-API-Key': Forum.RestApiKey,
		'Content-Type': 'application/json'
	};

	function copyHeader(headerAddition) {
		var obj = JSON.parse(JSON.stringify(headers));

		if (headerAddition != null && headerAddition != undefined) {
			Object.keys(headerAddition).forEach(function(key) {
				obj[key] = headerAddition[key];
			});
		}

		return obj;
	}

	function makeRequest(headers, url, method, data, urlParams) {
		var defer = $.Deferred();

		$.ajax({
			url: (Forum.baseUrl + url + urlParams).toString(),
			method: method,
			data: data,
			headers: headers,
			success: function(data){
				defer.resolve(data);
			},
			error: function(error){
				defer.reject(error);
			}
		});

		return defer.promise();
	}

	function getRequest(headerAddition, url, data, urlParams) {

		return makeRequest(copyHeader(headerAddition), url, 'GET', data, urlParams);
	}

	function postRequest(headerAddition, url, data) {
		return makeRequest(copyHeader(headerAddition), url, 'POST', data, '');
	}

	function putRequest(headerAddition, url, data, urlParams) {
		return makeRequest(copyHeader(headerAddition), url, 'PUT', data, urlParams);
	}

	function deleteRequest(headerAddition, url, urlParams) {
		return makeRequest(copyHeader(headerAddition), url, 'DELETE', null, urlParams);
	}

	return {
		postRequest: postRequest,
		getRequest: getRequest,
		putRequest: putRequest,
		deleteRequest: deleteRequest
	};
})();