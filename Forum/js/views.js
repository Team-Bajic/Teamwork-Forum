var Forum = Forum || {};

Forum.views = (function() {
	var CategoryView = function() {
		this.template = Forum.templateLoader('category-template');
	};

	var QuestionView = function() {
		this.template = Forum.templateLoader('question-template');
	};

<<<<<<< HEAD
	var HeaderView = function() {
		this.template = Forum.templateLoader('header-template');
	};
=======
  var HeaderView = function() {
    this.template = Forum.templateLoader('header-template');
  };
  
>>>>>>> 081b269451c097bcd660b5ea942008c187105d1e
  // var AnswerView = function() {
  // this.template = Forum.templateLoader('answertemplate');
  // };

  CategoryView.prototype.render = function(element, categories) {
  	$(element).html(this.template({
  		categories: categories
  	}));
  };
  QuestionView.prototype.render = function(element, questions) {
  	$(element).html(this.template({
  		questions: questions
  	}));
  };
  HeaderView.prototype.render = function(element, content) {

<<<<<<< HEAD
  	var _this = this;
  	$(element).html(this.template(content));
  	$('#logout').on('click', function() {
  		Forum.controllers.UserController.logOutUser().then(function() {
  			_this.render('.header', {});
  		})
  	});

  	assignLoginEvents();
  	assignRegisterEvents();

  	function assignLoginEvents() {
  		$("a[data-reveal-id='login']").on('click', function(event) {
  			$('div#login').foundation('reveal', 'open');
  			$('.closerevealmodal').on('click', function(event) {
  				$('div#login').foundation('reveal', 'close');
  			});
  			$('#loginButton').on('click', function(event) {
  				$('div#login').foundation('reveal', 'close');
  				Forum.controllers.UserController.logInUser($('#loginUsername').val().trim(), $('#loginPassword').val().trim()).then(function() {
  					_this.render('.header', {
  						isLogged: true,
  						isAdmin: false
  					});
  				})
  			});
  		});
  	};

  	function assignRegisterEvents() {
  		function validateUserData() {
  			var username = $('div#register').children('#username').val();
  			var password = $('div#register').children('#password').val();
  			var confirmPassword = $('div#register').children('#confirm-password').val();
  			var email = $('div#register').children('#email').val();

  			if (!($('div#register').children('#notification').length)) {
  				$('div#register').append($('<div id="notification"></div>'));
  			}

  			var isPasswordsMatch = (password == confirmPassword) ? true : false;
  			var isPasswordsProvided = isPasswordsMatch ? (((password.trim() == '') || (confirmPassword == '')) ? false : true) : false;
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
  					})
  					$('div#register').foundation('reveal', 'close');
  				})
  				.fail(function(res) {
  					console.log('failed')
  					var errorCode = JSON.parse(res.responseText).code;
  					var messages = [];
  					messages[125] = "Invalid email address.";
  					messages[200] = "Please, choose your username.";
  					messages[201] = "Please, choose your password.";
  					messages[202] = "This username has been already taken. Choose another one.";
  					messages[203] = "This email has been already taken.";

  					if(messages[errorCode]) {
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
  				errorMessage += isPasswordsProvided ? '' : 'You missed to enter your password.</br>';
  				errorMessage += isEmailProvided ? '' : 'You missed to enter your email.';
  				$('#notification').html(errorMessage);
  			}
  		};

  		$("a[data-reveal-id='register']").on('click', function(event) {
  			$('div#register').foundation('reveal', 'open');

  			$('.closerevealmodal').on('click', function(event) {
  				$('div#register').foundation('reveal', 'close');
  			});
  			$('#registerButton').on('click', function(event) {
=======
    var _this = this;
    $(element).html(this.template(content));
    $('#logout').on('click', function() {
      Forum.controllers.UserController.logOutUser().then(function() {
        _this.render('.header', {});
      })
    });

    assignLoginEvents();
    assignRegisterEvents();

    function assignLoginEvents() {
      $("a[data-reveal-id='login']").on('click', function(event) {
        $('div#login').foundation('reveal', 'open');
        $('.closerevealmodal').on('click', function(event) {
          $('div#login').foundation('reveal', 'close');
        });
        $('#loginButton').on('click', function(event) {
          var username = $('#loginUsername').val().trim(),
              password = $('#loginPassword').val().trim();
          $('div#login').foundation('reveal', 'close');
          Forum.controllers.UserController.logInUser(username, password).then(function() {
            _this.render('.header', {
              isLogged: true,
              isAdmin: false
            });
          })
        });
      });
    };

    function assignRegisterEvents() {
      function checkPoint() {
        var username = $('div#register').children('#username').val();
        var password = $('div#register').children('#password').val();
        var confirmPassword = $('div#register').children('#confirm-password').val();
        var email = $('div#register').children('#email').val();

        if (!($('div#register').children('#notification').length)) {
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
                })
              $('div#register').foundation('reveal', 'close');
            })
            .fail(function(res) {
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
                  message = "This email has been already taken.";
                  break;
                default:
                  message = "Unknown error during registration";
                  break;
              }
              $('#notification').text(message);
            })
            .progress(function() {
              $('#notification').text('Working...');
            })
        }
      }

      $("a[data-reveal-id='register']").on('click', function(event) {
        $('div#register').foundation('reveal', 'open');

        $('.closerevealmodal').on('click', function(event) {
          $('div#register').foundation('reveal', 'close');
        });
        $('#registerButton').on('click', function(event) {
>>>>>>> 081b269451c097bcd660b5ea942008c187105d1e
          // $('div#register').foundation('reveal', 'close');
          validateUserData();
        });
  		});
  	}
  }
  return {
  	CategoryView: CategoryView,
  	QuestionView: QuestionView,
  	HeaderView: HeaderView
  }

})();