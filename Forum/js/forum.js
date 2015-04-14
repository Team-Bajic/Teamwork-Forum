var Forum = Forum || {};

Forum.ApplicationID = 'OHLDDw4fScOBF6B9rRO40p4urKuEoNXpakX2UvXX';
Forum.JavaScriptKey = 'bybx8TlFj4ekkE8ewBIy9aEvFJbcX26nWbT02yAN';

$(document).ready(function(){

    Parse.initialize(Forum.ApplicationID, Forum.JavaScriptKey);

    if(!Parse.User.current()){
      Parse.User.logIn('admin', 'admin', {
        success: function(user){
          console.log(user);
        }
      });
    }

    // admin.set('username', 'admin');
    // admin.set('password', 'admin');
    // admin.set('email', 'admin@gmail.com');
    //
    // admin.signUp(null, {
    //   success: function(user){
    //     returnedValue = user;
    //     console.log(user);
    //   },
    //   error: function(error, user){
    //     console.log(error);
    //     console.log(user);
    //   }
    // });
    var category = new Forum.models.Category().create('test', function(){}, function(){});

    var question = new Forum.models.Question().create('testTitle', Parse.User.current(), category, 'blqblq', function(){}, function(){});

    var categoryView = new Forum.views.CategoryView();

    categoryView.render('.section-container');

});
