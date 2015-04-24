var Forum = Forum || {};

(function() {
	Forum.Router = new Sammy(function() {
        var user = null;
        var passedData = {};
        
		this.get('#/', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(result){
                    passedData.userData = result;
                    
                    return Forum.data.Role.getById(passedData.userData.role.objectId);
                }).then(function(result){
                    passedData.userData.role = result;
                    
                    Forum.controllers.HeaderController.showHeader(passedData.userData);
                    Forum.controllers.CategoryController.showCategories(passedData.userData);
                    Forum.controllers.QuestionController.showAllQuestions(0, passedData.userData);
                });
            } else{
                Forum.controllers.HeaderController.showHeader();
                Forum.controllers.CategoryController.showCategories();
                Forum.controllers.QuestionController.showAllQuestions(0);
            }
		});
        
        this.route('get', 'any', function(){
            console.log('any');
        });
        
		//for questions pagination
		this.get('#/page=:pageNumber', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(result){
                    passedData.userData = result;
                    
                    return Forum.data.Role.getById(passedData.userData.role.objectId);
                }).then(function(result){
                    passedData.userData.role = result;
                    
                    Forum.controllers.HeaderController.showHeader(passedData.userData);
                    Forum.controllers.CategoryController.showCategories(passedData.userData);	
                    Forum.controllers.QuestionController.showAllQuestions(parseInt(this.params['pageNumber']), passedData.userData);
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
                user.then(function(result){
                    passedData.userData = result;
                    
                    return Forum.data.Role.getById(passedData.userData.role.objectId);
                }).then(function(result){
                    passedData.userData.role = result;
                    
                    Forum.controllers.HeaderController.showHeader(passedData.userData);
                    Forum.controllers.CategoryController.showCategories(passedData.userData);
                    Forum.controllers.QuestionController.showQuestion(this.params['objectId'], passedData.userData);
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
                user.then(function(result){
                    passedData.userData = result;
                    
                    return Forum.data.Role.getById(passedData.userData.role.objectId);
                }).then(function(result){
                    passedData.userData.role = result;
                    
                    Forum.controllers.HeaderController.showHeader(passedData.userData);
                    Forum.controllers.CategoryController.showCategories(passedData.userData);
                    Forum.controllers.QuestionController.showQuestion(this.params['objectId'], parseInt(this.params['pageNumber']), passedData.userData);
                });
            } else{
                Forum.controllers.HeaderController.showHeader();
                Forum.controllers.CategoryController.showCategories();
                Forum.controllers.QuestionController.showQuestion(this.params['objectId'], parseInt(this.params['pageNumber']));
            }
		});

		this.get('#/category/:objectId', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(result){
                    passedData.userData = result;
                    
                    return Forum.data.Role.getById(passedData.userData.role.objectId);
                }).then(function(result){
                    passedData.userData.role = result;
                    
                    Forum.controllers.HeaderController.showHeader(passedData.userData);
                    Forum.controllers.CategoryController.showCategories(passedData.userData);	
                    Forum.controllers.CategoryController.showCategory(this.params['objectId'], 0, passedData.userData);
                });
            } else{
                Forum.controllers.HeaderController.showHeader();
                Forum.controllers.CategoryController.showCategories();	
                Forum.controllers.CategoryController.showCategory(this.params['objectId'], 0);
            }
		});

		//for questions pagination
		this.get('#/category/:objectId/page=:pageNumber', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(result){
                    passedData.userData = result;
                    
                    return Forum.data.Role.getById(passedData.userData.role.objectId);
                }).then(function(result){
                    passedData.userData.role = result;
                    
                    Forum.controllers.HeaderController.showHeader(passedData.userData);
                    Forum.controllers.CategoryController.showCategories(passedData.userData);	
                    Forum.controllers.CategoryController.showCategory(this.params['objectId'], parseInt(this.params['pageNumber']), passedData.userData);
                });
            } else{
                Forum.controllers.HeaderController.showHeader();
                Forum.controllers.CategoryController.showCategories();
                Forum.controllers.CategoryController.showCategory(this.params['objectId'], parseInt(this.params['pageNumber']));
            }
		});

		this.get('#/user/:objectId', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategories();
			Forum.controllers.UserController.showProfile(this.params['objectId']);
		});
        
        this.get('#/admin/viewUsers', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategory(this.params['objectId'], parseInt(this.params['pageNumber']));
			Forum.controllers.CategoryController.showCategories();
		});

		this.get('#/admin/viewAnswers', function() {
            user = Forum.data.User.currentUser();
            
            if(user !== null){
                user.then(function(result){
                    passedData.userData = result;
                    
                    return Forum.data.Role.getById(passedData.userData.role.objectId);
                }).then(function(result){
                    passedData.userData.role = result;
                    
                    if(passedData.userData.role.name === "admins"){
                        Forum.controllers.HeaderController.showHeader(passedData.userData);
                        Forum.controllers.CategoryController.showCategories();
                    } else{
                        Forum.Router.setLocation('#/');
                    }
                });
            } else{
                Forum.Router.setLocation('#/');
            }
		});
        
        this.get('#/admin/viewTags', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategory(this.params['objectId'], parseInt(this.params['pageNumber']));
			Forum.controllers.CategoryController.showCategories();
		});
	});

	Forum.Router.run('#/');
})();