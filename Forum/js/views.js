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
    $(element).html(this.template(content));
  };

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