var Forum = Forum || {};

$(document).ready(function() {
	Forum.data.Question.getById('0i3XiNVmko')
		.then(function(result) {
			console.log(result);
		});

	var temp = new Forum.views.CategoryView();
	temp.render($('.section-container'), {
		title: 'test'
	});

	Forum.data.User.logIn('test', 'test')
		.then(function(result) {
			return Forum.data.User.currentUser();
		}).then(function(result) {
			console.log(result);
		})

});