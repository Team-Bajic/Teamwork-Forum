var Forum = Forum || {};

Forum.templates = (function() {
	var HeaderTemplate = {
		template: Forum.templateLoader('header-template'),
		addEventHandlers: function() {
			assignLoginEvents();
			assignRegisterEvents();

			function assignLoginEvents() {
				$("a[data-reveal-id='login']").on('click', function(event) {
					$('div#login').foundation('reveal', 'open');

					$('.close-reveal-modal').on('click', function(event) {
						$('div#login').foundation('reveal', 'close');
					});

					$('#loginButton').on('click', function(event) {
						$('div#login').foundation('reveal', 'close');
					});
				});
			};

			function assignRegisterEvents() {
				function checkPoint() {
					var username = $('div#register').children('#username').val();
					var password = $('div#register').children('#password').val();
					var confirmPassword = $('div#register').children('#confirm-password').val();
					var email = $('div#register').children('#email').val();
					
					if(!($('div#register').children('#notification').length)) {
						$('div#register').append($('<div id="notification"></div>'));
					}			



					if (password != confirmPassword) {
						$('#notification').text('The passwords don\'t match. Check and re-enter again.');
					} else {

						function response() {
							var deferredObject = $.Deferred();
							deferredObject.resolve();
							deferredObject.notify();
							return Forum.controllers.UserController.registerUser(username, password, email);							
						} 

						$.when(response())
						.done(function(res){
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
							.fail(function(){ console.log('Failed to get the users role') }) 
							$('div#register').foundation('reveal', 'close');
						})
						.fail(function(res){
							console.log('failed')
							var errorCode = JSON.parse(res.responseText).code;
							var message = '';
							switch (errorCode) {
								case 125: 
									message = "Invalid email address";
									break;
								case 200:					
								  message = "Please, choose your username";
									break;
								case 201:					
								  message = "Please, choose your password";
								  break;
							  case 202:					
									message = "This username has been already taken. Choose another one.";
								  break;
								case 203:					
									message = "There's an useralready with this email address.";
									break;
								default:
									message = "Unknown error during registration";
									break;
							}
							$('#notification').text(message);
						})
						.progress(function(){
							$('#notification').text('Working...');
						}) 
					}
				}

				$("a[data-reveal-id='register']").on('click', function(event) {
					$('div#register').foundation('reveal', 'open');

					$('.close-reveal-modal').on('click', function(event) {
						checkPoint();
					});

					$('#registerButton').on('click', function(event) {
						checkPoint();
					});
				});
			};
		}
	}

	var CategoriesTemplate = {
		template: Forum.templateLoader('category-template')
	}

	var QuestionsTemplate = {
		template: Forum.templateLoader('question-template')
	}

	return {
		HeaderTemplate: HeaderTemplate,
		CategoriesTemplate: CategoriesTemplate,
		QuestionsTemplate: QuestionsTemplate
	}
})();