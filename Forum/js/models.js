var Forum = Forum || {};

Forum.models = (function() {
  Parse.initialize(Forum.ApplicationID, Forum.JavaScriptKey);

  var Category = Parse.Object.extend('Category', {
    create: function(title) {
      this.title = title;

      return this;
    },
    getAll: function() {
      var query = new Parse.Query(Category);

      query.find({
        success: function(categories) {
          categories.forEach(function(cat) {
            var categoryView = new Forum.views.CategoryView();
            categoryView.render('.section-container', cat);
          })
        },
        error: function(error) {
          console.log(error)
        }
      })
    },
    saveToParse: function(onSuccess, onError) {
      this.save({
        title: this.title
      }, {
        success: onSuccess,
        error: onError
      })
    }
  });

  var Tag = Parse.Object.extend('Tag', {
    create: function(title) {
      this.title = title;

      return this;
    },
    saveToParse: function(onSuccess, onError) {
      this.save({
        title: this.title
      }, {
        success: onSuccess,
        error: onError
      })
    }
  });

  var Question = Parse.Object.extend('Question', {
    create: function(title, postedBy, category, questionText) {
      this.title = title;
      this.postedBy = postedBy;
      this.category = category;
      this.questionText = questionText;

      return this;
    },
    saveToParse: function(onSuccess, onError) {
      this.save({
        title: this.title,
        postedBy: this.postedBy,
        category: this.category,
        questionText: this.questionText,
        visits: 0
      }, {
        success: onSuccess,
        error: onError
      });
    }
  });

  var Answer = Parse.Object.extend('Answer', {
    createByUser: function(title, postedBy, question, answerText) {
      this.title = title;
      this.postedBy = postedBy;
      this.author = postedBy.get('username');
      this.question = question;
      this.answerText = answerText;
      this.answerType = 'user';

      return this;
    },
    createByGuest: function(title, author, question, answerText) {
      this.title = title;
      this.postedBy = null;
      this.author = author;
      this.question = question;
      this.answerText = answerText;
      this.answerType = 'guest';

      return this;
    },
    saveToParse: function(onSuccess, onError) {
      this.save({
        title: this.title,
        postedBy: this.postedBy,
        author: this.author,
        question: this.question,
        answerText: this.answerText,
        answerType: this.answerType
      }, {
        success: onSuccess,
        error: onError
      });
    }
  });

  return {
    Category: Category,
    Tag: Tag,
    Question: Question,
    Answer: Answer
  };
})();