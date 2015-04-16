var Forum = Forum || {};

Forum.ApplicationID = 'OHLDDw4fScOBF6B9rRO40p4urKuEoNXpakX2UvXX';
Forum.RestApiKey = 'K9J7vXfCWIvDiC0VwMxF2wzdo0ktzMjMcsLCsFZH';

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

	function makeRequest(headers, url, method, data, urlParams, onSuccess, onError) {
		return $.ajax({
			url: (url + urlParams).toString(),
			method: method,
			type: method,
			data: data,
			success: onSuccess,
			error: onError,
			headers: headers
		});
	}

	function getRequest(headerAddition, url, data, urlParams, onSuccess, onError) {

		return makeRequest(copyHeader(headerAddition), url, 'GET', data, urlParams, onSuccess, onError);
	}

	function postRequest(headerAddition, url, data, onSuccess, onError) {
		return makeRequest(copyHeader(headerAddition), url, 'POST', data, '', onSuccess, onError);
	}

	function putRequest(headerAddition, url, data, urlParams, onSuccess, onError) {
		return makeRequest(copyHeader(headerAddition), url, 'PUT', data, urlParams, onSuccess, onError);
	}

	function deleteRequest(headerAddition, url, urlParams, onSuccess, onError) {
		return makeRequest(copyHeader(headerAddition), url, 'DELETE', null, urlParams, onSuccess, onError);
	}

	return {
		postRequest: postRequest,
		getRequest: getRequest,
		putRequest: putRequest,
		deleteRequest: deleteRequest
	};
})();