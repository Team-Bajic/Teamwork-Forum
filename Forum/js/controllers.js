var Forum = Forum || {};

Forum.controllers = (function() {
	var controllerData = {};

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
		showCategory: function(categoryId) {
			Forum.data.Category.getById(categoryId)
				.then(function(result) {
					controllerData.categoryData = JSON.parse(JSON.stringify(result));

					return Forum.data.Question.getQuestionsByCategory(controllerData.categoryData.objectId);
				}).then(function(result) {
					controllerData.questionsData = JSON.parse(JSON.stringify(result.results));

					var categoryView = new Forum.views.SingleCategoryView();
					var questionsView = new Forum.views.QuestionsView();

					categoryView.render('.questions-container', controllerData.categoryData);
					questionsView.render('.questionsBody', {questions: controllerData.questionsData});
				});
		},
		showCategories: function() {
			Forum.data.Category.getAll()
				.then(function(result) {
					controllerData.categoriesData = JSON.parse(JSON.stringify(result.results));

					var categoryView = new Forum.views.CategoryView();
					categoryView.render('.categories-container', controllerData.categoriesData);

				});
		}
	};

	var TagController = {

	};

	var QuestionController = {
		showQuestion: function(questionId) {
			Forum.data.Question.getById(questionId)
				.then(function(result) {

					controllerData.questionData = JSON.parse(JSON.stringify(result));

					return Forum.data.Answer.getAnswersByQuestion(controllerData.questionData.objectId);
				}).then(function(result) {
					controllerData.answersData = JSON.parse(JSON.stringify(result.results));

					var singleQuestionView = new Forum.views.SingleQuestionView();

					singleQuestionView.render('.questions-container', controllerData);
				});
		},
		showAllQuestions: function(page) {
			if(!page || page < 0){
				page = 0;
			}

			Forum.data.Question.getInRange(5 * page, 5)
				.then(function(result) {
					controllerData.questionsData = JSON.parse(JSON.stringify(result.results));

					return Forum.data.Question.getCount();
				}).then(function(result){
					var count = result.count;

					var questionsView = new Forum.views.QuestionsView();
					var next = page + 1;
					var previous = page - 1;
					var previousStatus = (previous < 0 ? "unavailable" : "available");
					var nextStatus = (next * 3 >= count ? "unavailable" : "available");

					questionsView.render('.questions-container', {questions: controllerData.questionsData, next : next, previous : previous, previousStatus: previousStatus, nextStatus: nextStatus});
				});
		}
	};

	var AnswerController = {

	};

	var HeaderController = {
		showHeader: function() {
			var user = Forum.data.User.currentUser();
			controllerData.userData = null;

			var headerView = new Forum.views.HeaderView();

			if (user != null) {
				user.then(function(result) {
					controllerData.userData = result;
					headerView.render('.header', controllerData.userData);
				});
			} else {
				headerView.render('.header', controllerData.userData);
			}
		}
	};

	return {
		UserController: UserController,
		CategoryController: CategoryController,
		TagController: TagController,
		QuestionController: QuestionController,
		AnswerController: AnswerController,
		HeaderController: HeaderController
	};
})();