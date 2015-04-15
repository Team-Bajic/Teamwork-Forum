var Forum = Forum || {};

Forum.views = (function() {
  var LoginView = function (){
    this.template = Handlebars.compile($('#login-template').html());
  };

  var CategoryView = function(){
      this.template = Handlebars.compile($('#category-template').html());
  };

  LoginView.prototype.render = function(element) {
    $(element).html(this.template({}));
  };

  CategoryView.prototype.render = function(element, content) {
      $(element).append(this.template({
        categoryTitle: content.title
      }));
  };

  return {
    CategoryView: CategoryView,
    LoginView: LoginView
  };
})();