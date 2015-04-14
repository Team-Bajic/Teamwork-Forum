var Forum = Forum || {};

Forum.models = (function(){
  Parse.initialize(Forum.ApplicationID, Forum.JavaScriptKey);

  var Category = Parse.Object.extend('Category', {
    create: function(title, onSuccess, onError){
      this.save({
        title: title
      },
      {
          success: function(category){
            console.log(category);
            onSuccess();
          },
          error: function(category, error){
            console.log('Error - ' + error + ', category object - ' + category);
            onError(category, error);
          }
      })
    }
  });

  var Question = Parse.Object.extend('Question', {
    create: function(title, postedBy, category, questionText, onSuccess, onError){
      this.save({
        title: title,
        postedBy: postedBy,
        category: category,
        questionText: questionText,
        visits: 0
      },
      {
          success: function(question){
            console.log(question);
            onSuccess();
          },
          error: function(question, error){
            console.log('Error - ' + error + ', question object - ' + question);
            onError(question, error);
          }
      });
    }
  });

  return {
    Category: Category,
    Question: Question
  };
})();
