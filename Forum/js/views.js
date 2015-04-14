var Forum = Forum || {};

Forum.views = (function(){
  var LoginView = Parse.View.extend({
    template: Handlebars.compile($('#login-template').html()),

    render: function(element) {
      $(element).html(this.template({}));
    }
  });

  var CategoryView = Parse.View.extend({
    template: Handlebars.compile($('#category-template').html()),

    render: function(element) {
      $(element).html(this.template({categoryTitle: 'test'}));
    }
  });

  return {
    CategoryView: CategoryView,
    LoginView: LoginView
  };
})();
