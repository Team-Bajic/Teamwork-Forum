var Forum = Forum || {};

$(document).ready(function() {
	Forum.data.User.logIn('test', 'test')
		.then(function(result) {
			console.log(result);
		}, function(error){
			console.log('login error');
		})

});