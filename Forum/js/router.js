var Forum = Forum || {};

(function() {
	Forum.Router = new Sammy(function() {
		this.get('#/', Forum.controllers.PageController.ShowMain);

		this.get('#/:objectId', function() {
			return Forum.controllers.QuestionController.showQuestion(this.params['objectId']);
		});

		this.get('#/createQuestion', function() {
			console.log('My Page');
		});
	});

	Forum.Router.run('#/');
})();