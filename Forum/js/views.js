var Forum = Forum || {};

Forum.views = (function() {
	var LoginView = function() {
		this.template = Handlebars.compile($('#login-template').html());
	};

	var CategoryView = function() {
		this.template = Handlebars.compile($('#category-template').html());
	};

	var QuestionView = function() {
		this.template = Handlebars.compile($('#question-template').html());
	};

	var HeaderView = function() {
		this.template = Handlebars.compile($('#header-template').html());
	};

	// var AnswerView = function() {
	// 	this.template = Handlebars.compile($('#answer-template').html());
	// };

	LoginView.prototype.render = function(element) {
		$(element).html(this.template({}));
	};

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
		var _this = this;
		$(element).html(this.template(content));

		$('#logout').on('click', function() {
			Forum.controllers.UserController.logOutUser().then(function(){
        _this.render('.header', {});
      })
		});

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
					Forum.controllers.UserController.logInUser('test', 'test').then(function(){
            _this.render('.header', {isLogged: true, isAdmin: false});
          })
				});
			});
		};

		function assignRegisterEvents() {
			$("a[data-reveal-id='register']").on('click', function(event) {
				$('div#register').foundation('reveal', 'open');

				$('.close-reveal-modal').on('click', function(event) {
					$('div#register').foundation('reveal', 'close');
				});

				$('#registerButton').on('click', function(event) {
					$('div#register').foundation('reveal', 'close');
					// Forum.controllers.UserController.registerUser('test', 'test');
				});
			});
		};
	}

	// AnswerView.prototype.render = function(element, answers) {
	//   $(element).html(this.template({
	//     answers: answers
	//   }));
	// };

	return {
		CategoryView: CategoryView,
		LoginView: LoginView,
		QuestionView: QuestionView,
		HeaderView: HeaderView
			// AnswerView: AnswerView
	};
})();