var Forum = Forum || {};

(function() {
	Forum.Router = new Sammy(function() {
		this.get('#/', function() {
			debugger;
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategories();
			Forum.controllers.QuestionController.showAllQuestions();
		});

		this.get('#/question/:objectId', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategories();
			Forum.controllers.QuestionController.showQuestion(this.params['objectId']);
		});

		this.get('#/category/:objectId', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategory(this.params['objectId']);
			Forum.controllers.CategoryController.showCategories();	
		});

		this.get('#/createQuestion', function() {
			console.log('My Page');
		});

	});

	Forum.Router.run('#/');
})();