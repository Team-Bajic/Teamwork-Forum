var Forum = Forum || {};

Forum.models = (function(){
  Parse.initialize(Forum.ApplicationID, Forum.JavaScriptKey);

  var Category = Parse.Object.extend('Category', {
      create: function(title){
        this.title = title;

        return this;
      },
      saveToParse: function(onSuccess, onError){
        this.save({
          title: this.title
        },
        {
            success: onSuccess,
            error: onError
        })
      }
  });

  var Question = Parse.Object.extend('Question', {
    create: function(title, postedBy, category, questionText){
      this.title = title;
      this.postedBy = postedBy;
      this.category = category;
      this.questionText = questionText;

      return this;
    },
    saveToParse: function(onSuccess, onError){
      this.save({
        title: this.title,
        postedBy: this.postedBy,
        category: this.category,
        questionText: this.questionText,
        visits: 0
      },
      {
          success: onSuccess,
          error: onError
      });
    }
  });

  return {
    Category: Category,
    Question: Question
  };
})();
