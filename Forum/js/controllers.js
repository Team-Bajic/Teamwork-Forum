var Forum = Forum || {};

Forum.controllers = (function() {
	var UserController = {
		logInUser: function(username, password) {
			return Forum.data.User.logIn(username, password);
		},
		logOutUser: function() {
			return Forum.data.User.logOut();
		},
		registerUser: function(username, password, email) {
			return Forum.data.User.signUp(username, password, email);
		}
	};

	var CategoryController = {

	};

	var TagController = {

	};

	var QuestionController = {
		showQuestion: function(questionId) {
			var controllerData = {};

			Forum.data.Question.getById(questionId)
				.then(function(result) {

					controllerData.questionData = JSON.parse(JSON.stringify(result));

					return Forum.data.Answer.getAnswersByQuestion(controllerData.questionData.objectId);
				}).then(function(result) {
					controllerData.answersData = JSON.parse(JSON.stringify(result.results));

					var singleQuestionView = new Forum.views.SingleQuestionView();

					singleQuestionView.render('.large-9', controllerData);
				});
		}
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

					return Forum.data.User.currentUser();
				}).then(function(result) {
					var categoryView = new Forum.views.CategoryView();
					var questionView = new Forum.views.QuestionsView();
					var headerView = new Forum.views.HeaderView();

					categoryView.render('.section-container', controllerData.categoriesData);
					questionView.render('.large-9', controllerData.questionsData);
					headerView.render('.header', result);
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