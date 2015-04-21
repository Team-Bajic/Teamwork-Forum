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
		showCategory: function(categoryId){
			Forum.data.Category.getById(categoryId)
			.then(function(result){
				controllerData.categoryData = JSON.parse(JSON.stringify(result));

				return Forum.data.Question.getQuestionsByCategory(controllerData.categoryData.objectId);
			}).then(function(result){
				controllerData.questionsData = JSON.parse(JSON.stringify(result.results));
				console.log(result);
				var categoryView = new Forum.views.SingleCategoryView();
				var questionsView = new Forum.views.QuestionsView();

				categoryView.render('main', controllerData.categoryData);
				questionsView.render('.questionsBody', controllerData.questionsData);
			});
		},
		showCategories: function(){
			Forum.data.Category.getAll()
				.then(function(result) {
					controllerData.categoriesData = JSON.parse(JSON.stringify(result.results));

					var categoryView = new Forum.views.CategoryView();
					categoryView.render('aside', controllerData.categoriesData);

				});
		}
	};

	var TagController = {

	};

	var QuestionController = {
		showQuestion: function(questionId) {
			//var controllerData = {};

			Forum.data.Question.getById(questionId)
				.then(function(result) {

					controllerData.questionData = JSON.parse(JSON.stringify(result));

					return Forum.data.Answer.getAnswersByQuestion(controllerData.questionData.objectId);
				}).then(function(result) {
					controllerData.answersData = JSON.parse(JSON.stringify(result.results));

					var singleQuestionView = new Forum.views.SingleQuestionView();

					singleQuestionView.render('main', controllerData);
				});
		},
		showAllQuestions: function(){
			Forum.data.Question.getAll()
			.then(function(result){
				controllerData.questionsData = JSON.parse(JSON.stringify(result.results));
				var questionsView = new Forum.views.QuestionsView();

				questionsView.render('main', controllerData.questionsData);
			});
		}
	};

	var AnswerController = {

	};

	var HeaderController = {
		showHeader: function(){
			var user = Forum.data.User.currentUser();
			controllerData.userData = null;

			if(user != null){
				user.then(function(result){
					controllerData.userData = result;
					var headerView = new Forum.views.HeaderView();

					headerView.render('.header', controllerData.userData);
				});
			}
		}
	};

	/*var PageController = {
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

					categoryView.render('aside', controllerData.categoriesData);
					questionView.render('main', controllerData.questionsData);
					headerView.render('.header', result);
				});
		},
		createQuestion: function() {

		}
	};*/

	return {
		UserController: UserController,
		CategoryController: CategoryController,
		TagController: TagController,
		QuestionController: QuestionController,
		AnswerController: AnswerController,
		//PageController: PageController,
		HeaderController: HeaderController
	};
})();