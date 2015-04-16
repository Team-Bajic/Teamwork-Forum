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

  LoginView.prototype.render = function(element) {
    $(element).html(this.template({}));
  };

  CategoryView.prototype.render = function(element, categories) {
    $(element).append(this.template({
      categories: categories
    }));
  };

  QuestionView.prototype.render = function(element, questions) {
    $(element).html(this.template({questions: questions}));
  };

  return {
    CategoryView: CategoryView,
    LoginView: LoginView,
    QuestionView: QuestionView
  };
})();