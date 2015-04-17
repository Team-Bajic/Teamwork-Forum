var Forum = Forum || {};

(function() {
	Forum.Router = new Sammy(function() {
		this.get('#/', Forum.controllers.PageController.ShowMain);

		this.get('#/login', function() {
			var _this = this;
			Forum.data.User.logIn('test', 'test')
				.then(function() {
					_this.redirect("#/");
					$('div#login').foundation('reveal', 'close');
				});;
		});

		this.get('#/logout', function() {
			var _this = this;
			Forum.data.User.logOut()
				.then(function() {
					_this.redirect("#/");
					$('div#register').foundation('reveal', 'close');
				});
		});

		this.get('#/question/:objectId', function() {
			return Forum.controllers.QuestionController.showQuestion(this.params['objectId']);
		});

		this.get('#/createQuestion', function() {
			console.log('My Page');
		});

		this.get('#/login-modal', function() {
			$('div#login').foundation('reveal', 'open');
		});

		this.get('#/register-modal', function() {
			$('div#register').foundation('reveal', 'open');
		});
	});

	Forum.Router.run('#/');
})();