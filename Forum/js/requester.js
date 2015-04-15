var Forum = Forum || {};

Forum.Requester = (function(){

	function makeRequest(url, method, data, urlParams, onSuccess, onError){
		$.ajax({
			url: (url + urlParams).toString(),
			method: method,
			type: method,
			data: JSON.stringify(data),
			success: onSuccess,
			error: onError,
			headers:{
				'X-Parse-Application-Id': Forum.ApplicationID,
				'X-Parse-REST-API-Key': Forum.RestApiKey,
				'Content-Type': 'application/json'
			}
		});
	}

	function getRequest(url, urlParams, onSuccess, onError){
		makeRequest(url, 'GET', null, urlParams, onSuccess,onError);
	}

	function postRequest(url, data, onSuccess, onError){
		makeRequest(url, 'POST', data, '', onSuccess,onError);
	}

	function putRequest(url, data, urlParams, onSuccess, onError){
		makeRequest(url, 'PUT', data, urlParams, onSuccess,onError);
	}

	function deleteRequest(url, urlParams, onSuccess, onError){
		makeRequest(url, 'DELETE', null, urlParams, onSuccess,onError);
	}

	return {
		postRequest: postRequest,
		getRequest: getRequest,
		putRequest: putRequest,
		deleteRequest: deleteRequest
  	};
})();
