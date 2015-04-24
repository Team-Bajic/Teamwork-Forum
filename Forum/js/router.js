var Forum = Forum || {};

(function() {
	Forum.Router = new Sammy(function() {
        var user = null;
        
		this.get('#/', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(userData){
                    Forum.controllers.HeaderController.showHeader(userData);
                    Forum.controllers.CategoryController.showCategories(userData);
                    Forum.controllers.QuestionController.showAllQuestions(0, userData);
                });
            } else{
                Forum.controllers.HeaderController.showHeader();
                Forum.controllers.CategoryController.showCategories();
                Forum.controllers.QuestionController.showAllQuestions(0);
            }
		});

		//for questions pagination
		this.get('#/page=:pageNumber', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(userData){
                    Forum.controllers.HeaderController.showHeader(userData);
                    Forum.controllers.CategoryController.showCategories(userData);	
                    Forum.controllers.QuestionController.showAllQuestions(parseInt(this.params['pageNumber']), userData);
                });
            } else{
                Forum.controllers.HeaderController.showHeader();
                Forum.controllers.CategoryController.showCategories();	
                Forum.controllers.QuestionController.showAllQuestions(parseInt(this.params['pageNumber']));
            }
		});

		this.get('#/question/:objectId', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(userData){
                    Forum.controllers.HeaderController.showHeader(userData);
                    Forum.controllers.CategoryController.showCategories(userData);
                    Forum.controllers.QuestionController.showQuestion(this.params['objectId'], userData);
                });
            } else{
                Forum.controllers.HeaderController.showHeader();
                Forum.controllers.CategoryController.showCategories();
                Forum.controllers.QuestionController.showQuestion(this.params['objectId']);
            }
		});

		//for answer pagination
		this.get('#/question/:objectId/page=:pageNumber', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(userData){
                    Forum.controllers.HeaderController.showHeader(userData);
                    Forum.controllers.CategoryController.showCategories(userData);
                    Forum.controllers.QuestionController.showQuestion(this.params['objectId'], parseInt(this.params['pageNumber']), userData);
                }
            } else{
                Forum.controllers.HeaderController.showHeader();
                Forum.controllers.CategoryController.showCategories();
                Forum.controllers.QuestionController.showQuestion(this.params['objectId'], parseInt(this.params['pageNumber']));
            }
		});

		this.get('#/category/:objectId', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(userData){
                    Forum.controllers.HeaderController.showHeader(userData);
                    Forum.controllers.CategoryController.showCategories(userData);	
                });
            } else{
                Forum.controllers.HeaderController.showHeader();
                Forum.controllers.CategoryController.showCategories();	
            }
            
			Forum.controllers.CategoryController.showCategory(this.params['objectId'], 0);
		});

		//for questions pagination
		this.get('#/category/:objectId/page=:pageNumber', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(userData){
                    Forum.controllers.HeaderController.showHeader(userData);
                    Forum.controllers.CategoryController.showCategories(userData);
                });
            } else{
                Forum.controllers.HeaderController.showHeader();
                Forum.controllers.CategoryController.showCategories();
            }
            
			Forum.controllers.CategoryController.showCategory(this.params['objectId'], parseInt(this.params['pageNumber']));
		});

		this.get('#/user/:objectId', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.UserController.showProfile(this.params['objectId']);
		});
        
        this.get('#/admin/viewUsers', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategory(this.params['objectId'], parseInt(this.params['pageNumber']));
			Forum.controllers.CategoryController.showCategories();
		});

		this.get('#/admin/viewAnswers', function() {
			Forum.controllers.HeaderController.showHeader();
            Forum.controllers.CategoryController.showCategories();
		});
        
        this.get('#/admin/viewTags', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategory(this.params['objectId'], parseInt(this.params['pageNumber']));
			Forum.controllers.CategoryController.showCategories();
		});
	});

	Forum.Router.run('#/');
})();