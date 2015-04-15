var Forum = Forum || {};

Forum.models = (function() {
  Parse.initialize(Forum.ApplicationID, Forum.JavaScriptKey);

  var Category = Parse.Object.extend('Category', {
    categoryData: [],
    create: function(title) {
      this.title = title;

      return this;
    },
    getAll: function() {
      var query = new Parse.Query(Category);

      return query.find({
        success: function(categories) {
          categories.forEach(function(category) {
            Forum.models.Category().categoryData.push(category.toJSON());
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
    getCategoryQuestions: function(category) {
      var query = new Parse.Query(Question);
      query.equalTo('category', category);
      query.find({
        success: function(questions) {
          console.log(questions);
        },
        error: function(error) {
          console.log(error);
        }
      });
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
    Category: function() {
      return new Category();
    },
    Tag: function () {
      return new Tag();
    },
    Question: function () {
      return new Question();
    },
    Answer: function () {
      return new Answer(); 
    }
  };
})();