var Forum = Forum || {};

Forum.eventHandlers = (function() {
	var deleteQuestionButtonHandler = function(buttonSelector, redirect) {
		$(buttonSelector).on('click', function(event) {
			var questionId = $(event.target).parent().attr('data-id');
			Forum.controllers.QuestionController.deleteQuestion(questionId)
				.then(function(result) {
					if (redirect) {
						Forum.Router.setLocation('#/');
					} else {
						$(event.target).parent().remove();
					}
				});
		});
	}

	var deleteAnswerButtonHandler = function(buttonSelector) {
		$(buttonSelector).on('click', function(event) {
			var answerId = $(event.target).parent().attr('data-id');
			Forum.controllers.AnswerController.deleteAnswer(answerId)
				.then(function(result) {
					$(event.target).parent().remove();
				});
		})
	}

	var revealBlockButtonHandler = function(buttonSelector, blockSelector) {
		$(blockSelector).hide();
		$(buttonSelector).on('click', function(event) {
			$(blockSelector).slideDown();
		});
	}

	var dismissButtonHandler = function(buttonSelector, blockSelector) {
		$(buttonSelector).on('click', function(event) {
			if (blockSelector == "#createQuestionBox") {
				$(blockSelector).slideUp().find("input").val('');
				$('.addedTags').find('.tag').remove();
			} else {
				$(blockSelector).slideUp();
			}
			Forum.editor.setData("");
		});
	}

	var postButtonHandler = function(buttonSelector, formSelector, postFunction) {
		$(buttonSelector).on('click', function(event) {
			var form = $(formSelector);
			form.validate();

			if (form.valid()) {
				event.preventDefault();
				postFunction();
			}
		});
	}
	var tags = [];
	var tagCounter;

	var successNotificationHandler = function(selector) {
		$(selector).slideDown('fast');
		setTimeout(function() {
			Forum.Router.refresh();
		}, 1500);
	}

	var assignEditQuestionEvents = function() {
		$('.main-container').append(Forum.templateBuilder('questionEdit-template', {}));

		$('.editQuestionButton').on('click', function(event) {
			tags = [];
			tagCounter = 0;

			$('#questionEdit .addedTags').html('');

			$('div#questionEdit').foundation('reveal', 'open');
			$('#questionTitle').val($(event.target).next().text());
			$('#questionText').val($(event.target).next().next().text());
			$('#saveQuestionButton').attr('data-id', $(event.target).parents('.question').last().attr('data-id'));

			$($(event.target).parents('.question').last()).find('.label').each(function() {
				tags.push($(this).text());
				tagCounter += 1;
				$('#questionEdit .addedTags')
					.append('<span class="secondary radius label tag">' + $(this).text() + '</span><a class="removeTagButton button tiny alert">X</a>');
			});

			$('.removeTagButton').on('click', function(event) {
				$(event.target).prev().remove();
				$(event.target).remove();
			});

			$('#editTagButton').on('click', function() {
				var tag = $('#tagInputEdit').val().trim();

				if (tag.length === 0) {
					alert("You cannot add empty tag.");
				} else if (tags.indexOf(tag) > -1) {
					alert('Already in added.');
					$('#tagInputEdit').val('');
				} else {
					tags.push(tag);

					$('#questionEdit .addedTags')
						.append('<span class="secondary radius label tag">' + tag + '</span><button type="button" class="removeTagButton button tiny alert">X</button>');

					$('#tagInputEdit').val('');

					$('.removeTagButton').last().on('click', function(event) {
						$(event.target).prev().remove();
						$(event.target).remove();
					});
				}
			});
		});

		$('#saveQuestionButton').on('click', function(e) {
			e.preventDefault();

			var tagsToUpdate = [];
			var dataToPass = {};

			$('#questionEdit').find('.tag').each(function() {
				tagsToUpdate.push($(this).text());
			});

			dataToPass.tags = tagsToUpdate;
			dataToPass.questionTitle = $('#questionTitle').val();
			dataToPass.questionText = $('#questionText').val();

			Forum.controllers.QuestionController.editQuestion($(e.target).attr('data-id'), dataToPass)
				.then(function(result) {
					console.log(result);
					$('#saveQuestionButton').removeAttr('data-id');
					$('#questionTitle').val('');
					$('#questionText').val('');
					$('div#questionEdit').foundation('reveal', 'close');
					Forum.Router.refresh();
				});
		});
	}

	var assignCategoryAddEvent = function(){
		$('#categoryAdd').on('click', function(){
			var theData = $('#categoryAdd').next().val().trim();

			if(theData.length <= 0){
				alert('Cannot add category with empty title.');
			} else {
				Forum.controllers.CategoryController.addCategory(theData);
			}
		});
	}

	var assignEditAnswerEvents = function() {
		$('.question-container').append(Forum.templateBuilder('answerEdit-template', {}));

		$('.editAnswerButton').on('click', function(event) {
			$('div#answerEdit').foundation('reveal', 'open');
			$('#answerText').val($(event.target).next().text());
			$('#saveAnswerButton').attr('data-id', $(event.target).parents('.answer').last().attr('data-id'));
		});

		$('div#answerEdit').submit(function(e) {
			e.preventDefault();
		});

		$('#saveAnswerButton').on('click', function(e) {
			e.preventDefault();
			var newValue = "<p>" + $('#answerText').val() + "</p>"
			Forum.controllers.AnswerController.editAnswer($(e.target).attr('data-id'), newValue)
				.then(function(result) {
					$('#questionEditedSuccess').slideDown('fast');

					setTimeout(function(){
						$('#saveAnswerButton').removeAttr('data-id');
						$('#answerText').val('');
						$('div#answerEdit').foundation('reveal', 'close');
						Forum.Router.refresh();
					},1000)

				});
		});
	}

	var newQuestionTagButtonEvents = function() {
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

				$('#createQuestionBox .addedTags').append('<span class="secondary radius label tag">' + tag + '</span><button type="button" class="removeTagButton button tiny alert">X</button>');

				$('#tagInput').val('');

				$('#createQuestionBox .removeTagButton').last().on('click', function(event) {
					$(event.target).prev().remove();
					$(event.target).remove();
				});

				tagCounter += 1;
			}
		});
	}

	var loginLogoutButtonEvents = function() {
		var form = $('#loginForm');
		form.validate();

		$('#logout').on('click', function() {
			Forum.controllers.UserController.logOutUser()
				.then(function(result) {
					Forum.Router.refresh();
				});
		});

		$("a[data-reveal-id='login']").on('click', function(event) {
			$('div#login').foundation('reveal', 'open');

			$('#loginButton').on('click', function(event) {
				if (form.valid()) {
					event.preventDefault();

					var username = $('#loginUsername').val().trim(),
						password = $('#loginPassword').val().trim();

					Forum.controllers.UserController.logInUser(username, password)
						.then(function(result) {
							$('#validLogin').slideDown('fast');
							setTimeout(function() {
								Forum.Router.refresh()
								$('div#login').foundation('reveal', 'close');
							}, 1500)

						}, function(error) {
							$('#invalidLogin').slideDown('fast');
							setTimeout(function() {
								$('#invalidLogin').slideUp('fast')
							}, 1500)
						})
				};
			});
		});
	}

	var registerButtonEvents = function() {
		var form = $('#registerForm');
		form.validate();

		$("a[data-reveal-id='register']").on('click', function(event) {
			$('div#register').foundation('reveal', 'open');

			$('.close-reveal-modal').on('click', function(event) {
				$('div#register').foundation('reveal', 'close');
			});

			$('#registerButton').on('click', function(event) {
				if (form.valid()) {
					event.preventDefault();
					var username = $("#username").val().trim();
					var password = $("#password").val().trim();
					var email = $('#email').val().trim();

					Forum.controllers.UserController.registerUser(username, password, email)
						.then(function(result) {
							$('#validReg').slideDown('fast');
							setTimeout(function() {
								$('#validReg').slideUp('fast')
								$('div#register').foundation('reveal', 'close');
								Forum.Router.refresh();
							}, 1500);
						}, function(error) {
							$('#invalidReg').slideDown('fast');
							setTimeout(function() {
								$('#invalidReg').slideUp('fast')
							}, 1500);
						});
				}
			});
		});
	}

	return {
		deleteQuestionButtonHandler: deleteQuestionButtonHandler,
		deleteAnswerButtonHandler: deleteAnswerButtonHandler,
		revealBlockButtonHandler: revealBlockButtonHandler,
		dismissButtonHandler: dismissButtonHandler,
		successNotificationHandler: successNotificationHandler,
		postButtonHandler: postButtonHandler,
		assignEditQuestionEvents: assignEditQuestionEvents,
		assignEditAnswerEvents: assignEditAnswerEvents,
		newQuestionTagButtonEvents: newQuestionTagButtonEvents,
		loginLogoutButtonEvents: loginLogoutButtonEvents,
		registerButtonEvents: registerButtonEvents
	}
})();