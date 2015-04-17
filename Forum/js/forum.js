var Forum = Forum || {};

$(document).ready(function() {
	Forum.data.User.logIn('test', 'test')
		.then(function(result) {
			return Forum.data.Question.getAll();
		}, function(error) {
			console.log('login error');
		}).then(function(result) {
			console.log(result);
		})
});