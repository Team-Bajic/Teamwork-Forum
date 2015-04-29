var Forum = Forum || {};

Forum.views = (function() {
	var CategoryView = function() {};

	var QuestionsView = function() {};

	var SingleQuestionView = function() {};

	var HeaderView = function() {};

	var SingleCategoryView = function() {};

	var ProfileView = function() {};

	ProfileView.prototype.render = function(element, data) {
		$(element).html(Forum.templateBuilder('user-profile-template', data));
	};

	CategoryView.prototype.render = function(element, data) {
		$(element).html(Forum.templateBuilder('category-template', {
			categories: data
		}));
	};

	QuestionsView.prototype.render = function(element, data) {
		$(element).html(Forum.templateBuilder('question-template', data));
    
		Forum.eventHandlers.deleteQuestionButtonHandler(".deleteQuestionButton");
    Forum.eventHandlers.assignEditQuestionEvents();
	};

	SingleQuestionView.prototype.render = function(element, data) {
		$(element).html(Forum.templateBuilder('single-question-template', data));

    Forum.eventHandlers.deleteQuestionButtonHandler(".deleteQuestionButton", true);
    Forum.eventHandlers.deleteAnswerButtonHandler(".deleteAnswerButton");
    Forum.eventHandlers.revealBlockButtonHandler('.reveal-answer-block', '#createAnswerBox');
    Forum.eventHandlers.dismissButtonHandler('.dismiss-button', '#createAnswerBox');
    Forum.eventHandlers.postButtonHandler('.post-button', '#createAnswerBox', postAnswer);

    Forum.eventHandlers.assignEditQuestionEvents();
    Forum.eventHandlers.assignEditAnswerEvents();

		Forum.editor = CKEDITOR.replace('editor');

		function postAnswer() {
			var postedBy,
				user = Forum.data.User.currentUser(),
				questionId = $('.question').attr('data-id'),
				answerText = Forum.editor.getData();

			if (user != null) {
				user.then(function(result) {
					Forum.controllers.AnswerController.addAnswer('user', questionId, answerText, {
							user: result
						})
						.then(function() {
							Forum.eventHandlers.successNotificationHandler('#answerSuccessfullyPosted');
						});
				});
			} else {
				postedBy = $('.answer-author').val().trim();
				Forum.controllers.AnswerController.addAnswer('guest', questionId, answerText, {
						author: postedBy
					})
					.then(function() {
						Forum.eventHandlers.successNotificationHandler('#answerSuccessfullyPosted');
					});
			}
		}
	};

	SingleCategoryView.prototype.render = function(element, data) {
		$(element).html(Forum.templateBuilder('single-category-template', {
			data: data
		}));

		if (data.user.sessionToken) {
			var tagCounter = 0;
			var tags = [];

			Forum.editor = CKEDITOR.replace('editor');

			Forum.eventHandlers.revealBlockButtonHandler('.reveal-question-block', '#createQuestionBox');
			Forum.eventHandlers.dismissButtonHandler('.dismiss-button', '#createQuestionBox');
			Forum.eventHandlers.postButtonHandler('.post-button', '#createQuestionBox', postQuestion);
			Forum.eventHandlers.newQuestionTagButtonEvents(tags, tagCounter);

			function postQuestion() {
				Forum.data.User.currentUser()
					.then(function(result) {
						var title = $("input[name='new-question-title']").val(),
							questionText = Forum.editor.document.getBody().getText(),
							categoryID = $('.category-container').attr('data-id'),
							postedByID = result.objectId;
              $('#createQuestionBox').find('.tag').each(function() {
                  tags.push($(this).text());
              });

						return Forum.controllers.QuestionController.addQuestion(title, postedByID, questionText, categoryID, tags);
					}).then(function(result) {
						Forum.eventHandlers.successNotificationHandler('#questionSuccessfullyPosted');
					});
			}
		}
	};

	HeaderView.prototype.render = function(element, content) {
		$(element).html(Forum.templateBuilder('header-template', content));

		Forum.eventHandlers.loginLogoutButtonEvents();
		Forum.eventHandlers.registerButtonEvents();
	}

	return {
		CategoryView: CategoryView,
		QuestionsView: QuestionsView,
		SingleQuestionView: SingleQuestionView,
		HeaderView: HeaderView,
		SingleCategoryView: SingleCategoryView,
		ProfileView: ProfileView
	}
})();