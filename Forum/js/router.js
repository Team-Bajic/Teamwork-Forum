var Forum = Forum || {};

(function() {
	Forum.Router = new Sammy(function() {
		this.get('#/', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategories();
			Forum.controllers.QuestionController.showAllQuestions(0);
		});

		//for questions pagination
		this.get('#/page=:pageNumber', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategories();	
			Forum.controllers.QuestionController.showAllQuestions(parseInt(this.params['pageNumber']));
		});

		this.get('#/question/:objectId', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategories();
			Forum.controllers.QuestionController.showQuestion(this.params['objectId']);
		});

		//for answer pagination
		this.get('#/question/:objectId/page=:pageNumber', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategories();
			Forum.controllers.QuestionController.showQuestion(this.params['objectId'], parseInt(this.params['pageNumber']));
		});

		this.get('#/category/:objectId', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategory(this.params['objectId'], 0);
			Forum.controllers.CategoryController.showCategories();	
		});

		//for questions pagination
		this.get('#/category/:objectId/page=:pageNumber', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategory(this.params['objectId'], parseInt(this.params['pageNumber']));
			Forum.controllers.CategoryController.showCategories();	
		});

		this.get('#/createQuestion', function() {
			console.log('My Page');
		});

	});

	Forum.Router.run('#/');
})();