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

		assignDeleteButtonEvents();

		function assignDeleteButtonEvents() {
			$('.deleteQuestionButton').on('click', function(event) {
				var questionId = $(event.target).parent().parent().attr('data-id');

				Forum.controllers.QuestionController.deleteQuestion(questionId)
					.then(function(result) {
						$(event.target).parent().parent().remove();
					});
			})
		}

	};

	SingleQuestionView.prototype.render = function(element, data) {
		$(element).html(Forum.templateBuilder('single-question-template', data));

		assignNewAnswerEvents();
		assignDeleteButtonEvents();

		$("#createAnswerBox").hide();

		Forum.editor = CKEDITOR.replace('editor');

		function assignDeleteButtonEvents() {
			$('.deleteQuestionButton').on('click', function(event) {
				var questionId = $(event.target).parent().parent().attr('data-id');

				Forum.controllers.QuestionController.deleteQuestion(questionId)
					.then(function(result) {
						Forum.Router.setLocation('#/');
					});
			})

			$('.deleteAnswerButton').on('click', function(event) {
				var answerId = $(event.target).parent().attr('data-id');

				Forum.controllers.AnswerController.deleteAnswer(answerId)
					.then(function(result) {
						$(event.target).parent().remove();
					});
			})
		}

		function assignNewAnswerEvents() {
			$('.reveal-answer-block').on('click', function(event) {
				$("#createAnswerBox").slideDown();
			});

			$('.dismiss-button').on('click', function(event) {
				$("#createAnswerBox").slideUp();
				Forum.editor.setData("");
			});

			$('.post-button').on('click', function(event) {
				var form = $('#createAnswerBox');
				form.validate();

				if (form.valid()) {
					event.preventDefault();
					var postedBy,
						user = Forum.data.User.currentUser(),
						questionId = $('.question-container').attr('data-id'),
						answerText = Forum.editor.getData();

					if (user != null) {
						user.then(function(result) {
							Forum.controllers.AnswerController.addAnswer('user', questionId, answerText, {
									user: result
								})
								.then(function() {
									$("#createAnswerBox").slideUp();
									Forum.editor.setData("");
								});
						});
					} else {
						postedBy = $('.answer-author').val().trim(); //|| $('.answer-email').val().trim();

						Forum.controllers.AnswerController.addAnswer('guest', questionId, answerText, {
								author: postedBy
							})
							.then(function() {
								$("#createAnswerBox").slideUp().find("input").val('');
								Forum.editor.setData("");
								Forum.Router.refresh();
							});
					}
				}
			});
		}
	};

	SingleCategoryView.prototype.render = function(element, data) {
		$(element).html(Forum.templateBuilder('single-category-template', {
			data: data
		}));

		if (data.user.sessionToken) {
			assignNewQuestionEvents();

			$('#createQuestionBox').hide();

			Forum.editor = CKEDITOR.replace('editor');

			function assignNewQuestionEvents() {
				var form = $('#createQuestionBox');
				form.validate();

				var tagCounter = 0;
				var tags = [];

				$('#tagRemove').on('click', function() {
					if (tagCounter > 0) {
						$('.addedTags').find('span').last().remove();
						tagCounter -= 1;
					} else {
						alert('There are no tags to delete.');
					}
				});

				$('#tagButton').on('click', function() {
					var tag = $('#tagInput').val().trim();

					if (tag.length === 0) {
						alert("You cannot add empty tag.");
					} else if (tags.indexOf(tag) > -1) {
						alert('Already in added.');
						$('#tagInput').val('');
					} else {
						tags.push(tag);

						if (tagCounter > 0) {
							tag = ', ' + tag;
						}

						$('.addedTags').append("<span class='tag'>" + tag + "</span>");
						$('#tagInput').val('');

						tagCounter += 1;
					}
				});

				$('.reveal-options-block').on('click', function(event) {
					$('#createQuestionBox').slideDown();
				});

				$('.dismiss-button').on('click', function(event) {
					$('#createQuestionBox').slideUp().find("input").val('');
					$('.addedTags').find('.tag').remove();
					Forum.editor.setData("");
				});

				$('.post-button').on('click', function(event) {
					if (form.valid()) {
						event.preventDefault();
						Forum.data.User.currentUser()
							.then(function(result) {
								var title = $("input[name='new-question-title']").val(),
									questionText = Forum.editor.getData(),
									categoryID = $(event.target).parents('.category-container').last().attr('data-id'),
									postedByID = result.objectId;

								return Forum.controllers.QuestionController.addQuestion(title, postedByID, questionText, categoryID, tags);
							}).then(function(result) {
								$('#createQuestionBox').slideUp().find("input").val('');
								$('.addedTags').find('.tag').remove();
								Forum.editor.setData("");
							});
					}
				});
			}
		}
	};

	HeaderView.prototype.render = function(element, content) {
		$(element).html(Forum.templateBuilder('header-template', content));

		$('#logout').on('click', function() {
			Forum.controllers.UserController.logOutUser()
				.then(function(result) {
					Forum.Router.setLocation('#/');
					Forum.Router.refresh();
				});
		});

		assignLoginEvents();
		assignRegisterEvents();

		function assignLoginEvents() {
			var form = $('#loginForm');
			form.validate();

			$("a[data-reveal-id='login']").on('click', function(event) {
				$('div#login').foundation('reveal', 'open');

				$('#loginButton').on('click', function(event) {
					if (form.valid()) {
						event.preventDefault();

						var username = $('#loginUsername').val().trim(),
							password = $('#loginPassword').val().trim();

						Forum.controllers.UserController.logInUser(username, password)
							.then(function(result) {
								Forum.Router.refresh()
								$('div#login').foundation('reveal', 'close');
							})
					};
				});
			});
		};

		function assignRegisterEvents() {
			function validateUserData() {
				var username = $('div#register').children('#username').val();
				var password = $('div#register').children('#password').val();
				var confirmPassword = $('div#register').children('#confirm-password').val();
				var email = $('div#register').children('#email').val();

				$('#registerForm').validate();
				if (!($('div#register').children('#notification').length)) {
					$('div#register').append($('<div id="notification"></div>'));
				}

				var isPasswordsProvided = (password.trim() != '') && (confirmPassword.trim() != '') ? true : false;
				var isPasswordsMatch = (password == confirmPassword) ? true : false;
				var isEmailProvided = (email.trim() != '') ? true : false;

				if (isPasswordsMatch && isPasswordsProvided && isEmailProvided) {
					function response() {
						var deferredObject = $.Deferred();
						deferredObject.resolve();
						deferredObject.notify();
						return Forum.controllers.UserController.registerUser(username, password, email);
					}

					$.when(response())
						.done(function(res) {
							$('#notification').text('Account succesfully created');

							function getRole() {
								var deferredObject = $.Deferred();
								deferredObject.resolve();

								return Forum.data.User.getUsersRole();
							}

							$.when(getRole()).done(function(role) {
									console.log(role);

									Forum.data.User.updateRole(role.results[0].objectId, res.objectId);
								})
								.fail(function() {
									console.log('Failed to get the users role')
								});
							$('div#register').foundation('reveal', 'close');
						})
						.fail(function(res) {
							console.log('failed');

							var errorCode = JSON.parse(res.responseText).code;
							var messages = [];

							messages[125] = "Invalid email address.";
							messages[200] = "Please, choose your username.";
							messages[201] = "Please, choose your password.";
							messages[202] = "This username has been already taken. Choose another one.";
							messages[203] = "This email has been already taken.";

							if (messages[errorCode]) {
								$('#notification').text(messages[errorCode]);
							} else {
								$('#notification').text("Unknown error during registration.");
							}
						})
						.progress(function() {
							$('#notification').text('Working...');
						})
				} else {
					var errorMessage = isPasswordsMatch ? '' : 'The passwords don\'t match. Check and re-enter again.<br/>';
					errorMessage += isPasswordsProvided ? '' : 'Enter your password in both password fields.</br>';
					errorMessage += isEmailProvided ? '' : 'You missed to enter your email.';

					$('#notification').html(errorMessage);
				}
			};

			var form = $('#registerForm');
			form.validate();

			$("a[data-reveal-id='register']").on('click', function(event) {
				$('div#register').foundation('reveal', 'open');

				$('.closerevealmodal').on('click', function(event) {
					$('div#register').foundation('reveal', 'close');
				});

				$('#registerButton').on('click', function(event) {
					if (form.valid()) {
						event.preventDefault();
					}
					// validateUserData();
				});
			});
		}
	}

	return {
		CategoryView: CategoryView,
		QuestionsView: QuestionsView,
		SingleQuestionView: SingleQuestionView,
		HeaderView: HeaderView,
		SingleCategoryView: SingleCategoryView,
		ProfileView: ProfileView
	};
})();