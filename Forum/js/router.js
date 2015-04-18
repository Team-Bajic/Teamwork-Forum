var Forum = Forum || {};

(function() {
	Forum.Router = new Sammy(function() {
		this.get('#/', Forum.controllers.PageController.ShowMain);

		this.get('#/question/:objectId', function() {
			return Forum.controllers.QuestionController.showQuestion(this.params['objectId']);
		});

		this.get('#/createQuestion', function() {
			console.log('My Page');
		});

		this.get('#/logout', function(){
			var _this = this;
			Forum.data.User.logOut()
			.then(function(){
				_this.redirect('#/');
			});
		});
	});

	Forum.Router.run('#/');
})();