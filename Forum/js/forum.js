var Forum = Forum || {};

Forum.ApplicationID = 'OHLDDw4fScOBF6B9rRO40p4urKuEoNXpakX2UvXX';
Forum.JavaScriptKey = 'bybx8TlFj4ekkE8ewBIy9aEvFJbcX26nWbT02yAN';

$(document).ready(function(){
  Parse.initialize(Forum.ApplicationID, Forum.JavaScriptKey);

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

  var test = new CategoryView();

  test.render('.section-container');
});
