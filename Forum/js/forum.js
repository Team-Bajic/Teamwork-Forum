var Forum = Forum || {};

Forum.baseUrl = 'https://api.parse.com/1/classes/';

$(document).ready(function() {
	Forum.data.Question.getById('0i3XiNVmko')
		.then(function(result) {
			// console.log(result);
		});

	var temp = new Forum.views.CategoryView();
	temp.render($('.section-container'), {
		title: 'test'
	});

	Forum.data.User.logIn('test', 'test')
		.then(function(argument) {
			console.log('logged in');
			Forum.data.User.logOut();
		}).then(function() {
			console.log('logged out');
		})

});