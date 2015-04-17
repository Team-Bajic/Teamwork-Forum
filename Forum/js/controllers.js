var Forum = Forum || {};

Forum.controllers = (function() {
	var UserController = {

	};

	var CategoryController = {

	};

	var TagController = {

	};

	var QuestionController = {

	};

	var AnswerController = {

	};

	var PageController = {
		ShowMain: function() {
			var controllerData = {};

			Forum.data.Category.getAll()
				.then(function(result) {
					controllerData.categoriesData = JSON.parse(JSON.stringify(result.results));

					return Forum.data.Question.getAll();
				}).then(function(result) {
					controllerData.questionsData = JSON.parse(JSON.stringify(result.results));

					var categoryView = new Forum.views.CategoryView();
					var questionView = new Forum.views.QuestionView();

					categoryView.render('.section-container', controllerData.categoriesData);
					questionView.render('.large-9', controllerData.questionsData);
				});
		},
		createQuestion: function() {

		}
	};

	return {
		UserController: UserController,
		CategoryController: CategoryController,
		TagController: TagController,
		QuestionController: QuestionController,
		AnswerController: AnswerController,
		PageController: PageController
	};
})();