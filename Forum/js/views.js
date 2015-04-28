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
    assignEditAnswerEvents();
    assignEditQuestionEvents();

    $("#createAnswerBox").hide();

    Forum.editor = CKEDITOR.replace('editor');

    function assignEditAnswerEvents() {
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
        Forum.controllers.AnswerController.editAnswer($(e.target).attr('data-id'), $('#answerText').val())
          .then(function(result) {
            $('#saveAnswerButton').removeAttr('data-id');
            $('#answerText').val('');
            $('div#answerEdit').foundation('reveal', 'close');
            Forum.Router.refresh();
          });
      });
    }

    function assignEditQuestionEvents() {
      $('.question-container').append(Forum.templateBuilder('questionEdit-template', {}));
      var tags = [];

      $('.editQuestionButton').on('click', function(event) {
        $('div#questionEdit').foundation('reveal', 'open');
        $('#questionTitle').val($(event.target).next().text());
        $('#questionText').val($(event.target).next().text());
        $('#saveQuestionButton').attr('data-id', $(event.target).parents('.question-container').last().attr('data-id'));
        $($(event.target).parents('.question-container').last()).find('.label a').each(function() {
          tags.push($(this).text());
          $('#questionEdit .addedTags')
            .append('<span class="secondary radius label tag">' + $(this).text() + '</span><button type="button" class="removeTagButton button tiny alert">X</button>');
        });

        $('.removeTagButton').on('click', function(event) {
          $(event.target).prev().remove();
          $(event.target).remove();
        });

        $('#editTagButton').on('click', function() {
          var tag = $('#tagInput').val().trim();

          if (tag.length === 0) {
            alert("You cannot add empty tag.");
          } else if (tags.indexOf(tag) > -1) {
            alert('Already in added.');
            $('#tagInput').val('');
          } else {
            tags.push(tag);

            $('#questionEdit .addedTags')
            .append('<span class="secondary radius label tag">' + tag 
              + '</span><button type="button" class="removeTagButton button tiny alert">X</button>');

            $('#tagInput').val('');

            $('.removeTagButton').last().on('click', function(event) {
              $(event.target).prev().remove();
              $(event.target).remove();
            });
          }
        });
      });

      $('div#questionEdit').submit(function(e) {
        e.preventDefault();
      });

      $('#saveQuestionButton').on('click', function(e) {
        e.preventDefault();

        var tagsToUpdate = [];
        var dataToPass = {};

        $('#questionEdit').find('.tag').each(function(){
            tagsToUpdate.push($(this).text());
        });        

        dataToPass.tags = tagsToUpdate;
        dataToPass.questionTitle = $('#questionTitle').val();
        dataToPass.questionText = $('#questionText').val();

        Forum.controllers.QuestionController.editQuestion($(e.target).attr('data-id'), dataToPass)
          .then(function(result) {
            $('#saveQuestionButton').removeAttr('data-id');
            $('#questionTitle').val('');
            $('#questionText').val('');
            $('div#questionEdit').foundation('reveal', 'close');
            Forum.Router.refresh();
          });
      });
    }

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
                    $('#answerSuccessfullyPosted').slideDown('fast');
                    setTimeout(function(){
                      $("#createAnswerBox").slideUp();
                      Forum.editor.setData("");
                    },1000)

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
                  $('#questionSuccessfullyPosted').slideDown('fast');
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
                  $('#validLogin').slideDown('fast');
                  setTimeout(function(){
                    Forum.Router.refresh()
                    $('div#login').foundation('reveal', 'close');
                  },1000)

              }, function(error){
                  $('#invalidLogin').slideDown('fast');
                  setTimeout(function(){
                    $('#invalidLogin').slideUp('fast')
                  }, 2000)
                })
          };
        });
      });
    };

    function assignRegisterEvents() {

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