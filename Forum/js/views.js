var Forum = Forum || {};

Forum.views = (function() {
  var CategoryView = function() {

  };

  var QuestionsView = function() {

  };

  var SingleQuestionView = function() {

  };

  var HeaderView = function() {

  };

  var SingleCategoryView = function(){

  };

  CategoryView.prototype.render = function(element, data) {
    $(element).html(Forum.templateBuilder('category-template', {categories: data}));
  };

  QuestionsView.prototype.render = function(element, data) {
    $(element).html(Forum.templateBuilder('question-template', data));
  };

  SingleQuestionView.prototype.render = function (element, data) {
    $(element).html(Forum.templateBuilder('single-question-template', {data: data}));
  };

  SingleCategoryView.prototype.render = function (element, data) {
    $(element).html(Forum.templateBuilder('single-category-template', {data: data}));

    assignNewQuestionEvents();

    tinymce.init({
    selector: "textarea",
    plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table contextmenu paste"
    ],
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    });


    function assignNewQuestionEvents() {
      $('.reveal-options-block').on('click', function (event) {
        $('div.options-block').removeClass('hide');
        $('.hide-options-block').removeClass('hide');
      });

      $('.dismiss-button').on('click', function (event) {
        $('div.options-block').addClass('hide');
        clearFields();
      });
    }

    function clearFields () {
      $("input[name='new-question-title']").val('');
      $("textarea[name='new-question-content']").val('');
      $("input[name='new-question-tags']").val('');
    }
  };

  HeaderView.prototype.render = function(element, content) {
    var _this = this;

    $(element).html(Forum.templateBuilder('header-template', content));

    $('#logout').on('click', function() {
      Forum.controllers.UserController.logOutUser()
        .then(function() {
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
          var username = $('#loginUsername').val().trim(),
              password = $('#loginPassword').val().trim();

          Forum.controllers.UserController.logInUser(username, password)
            .then(function(result) {
              _this.render('.header', result);
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
          validateUserData();
        });
      });
    }
  }

  return {
    CategoryView: CategoryView,
    QuestionsView: QuestionsView,
    SingleQuestionView: SingleQuestionView,
    HeaderView: HeaderView,
    SingleCategoryView: SingleCategoryView
  };
})();