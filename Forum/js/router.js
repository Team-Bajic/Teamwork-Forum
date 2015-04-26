var Forum = Forum || {};

(function() {
	Forum.Router = new Sammy(function() {
        var user = null;
        var passedData = {};
        
        function HeaderInclude(onSucces){
            user = Forum.data.User.currentUser();
            
            var temp = $.Deferred();
            
            if(user !== null){
                return user.then(function(result){
                    passedData.userData = result;
                    
                    return Forum.data.Role.getById(passedData.userData.role.objectId);
                }).then(function(result){
                    passedData.userData.role = result;
                });
            } else{
                passedData.userData = undefined;
                
                temp.resolve();
            }
        }
        
		this.get('#/', function() {
            $.when(HeaderInclude()).done(function(){
                Forum.controllers.HeaderController.showHeader(passedData.userData);
                Forum.controllers.CategoryController.showCategories(passedData.userData);
                Forum.controllers.QuestionController.showAllQuestions(0, passedData.userData);
            });
		});
        
        this.route('get', 'any', function(){
            console.log('any');
        });
        
		//for questions pagination
		this.get('#/page=:pageNumber', function() {
            var _this = this;
            
            $.when(HeaderInclude()).done(function(){
                Forum.controllers.HeaderController.showHeader(passedData.userData);
                Forum.controllers.CategoryController.showCategories(passedData.userData);	
                Forum.controllers.QuestionController.showAllQuestions(parseInt(_this.params['pageNumber']), passedData.userData);
            });
		});

		this.get('#/question/:objectId', function() {
            var _this = this;
            
            $.when(HeaderInclude()).done(function(){
                    Forum.controllers.HeaderController.showHeader(passedData.userData);
                    Forum.controllers.CategoryController.showCategories(passedData.userData);
                    Forum.controllers.QuestionController.showQuestion(_this.params['objectId'], passedData.userData);
            });
		});

		//for answer pagination
		this.get('#/question/:objectId/page=:pageNumber', function() {
            var _this = this;
            $.when(HeaderInclude()).done(function(){
                    Forum.controllers.HeaderController.showHeader(passedData.userData);
                    Forum.controllers.CategoryController.showCategories(passedData.userData);
                    Forum.controllers.QuestionController.showQuestion(_this.params['objectId'], parseInt(_this.params['pageNumber']), passedData.userData);
            });
		});

		this.get('#/category/:objectId', function() {
            var _this = this;
            
            $.when(HeaderInclude()).done(function(){
                    Forum.controllers.HeaderController.showHeader(passedData.userData);
                    Forum.controllers.CategoryController.showCategories(passedData.userData);	
                    Forum.controllers.CategoryController.showCategory(_this.params['objectId'], 0, passedData.userData);
            });
		});

		//for questions pagination
		this.get('#/category/:objectId/page=:pageNumber', function() {
            var _this = this;
            
            $.when(HeaderInclude()).done(function(){
                Forum.controllers.HeaderController.showHeader(passedData.userData);
                Forum.controllers.CategoryController.showCategories(passedData.userData);	
                Forum.controllers.CategoryController.showCategory(_this.params['objectId'], parseInt(_this.params['pageNumber']), passedData.userData);
            });
		});

		this.get('#/user/:objectId', function() {
            var _this = this;
            
            $.when(HeaderInclude()).done(function(){
                Forum.controllers.HeaderController.showHeader(passedData.userData);
                Forum.controllers.CategoryController.showCategories(passedData.userData);
                Forum.controllers.UserController.showProfile(_this.params['objectId'], passedData.userData);
            });
		});
        
        this.get('#/admin/viewUsers', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategory(this.params['objectId'], parseInt(this.params['pageNumber']));
			Forum.controllers.CategoryController.showCategories();
		});

        this.get('#/search/by=:option/text=:searched', function(){
            var _this = this;
            
            $.when(HeaderInclude()).done(function(){
                Forum.controllers.HeaderController.showHeader(passedData.userData);
                Forum.controllers.CategoryController.showCategories(passedData.userData);
                Forum.controllers.SearchController.getParams(_this.params['option'], _this.params['searched'], 0);
            });
        });

        this.get('#/search/by=:option/text=:searched/page=:pageNumber', function(){
            $.when(HeaderInclude()).done(function(){
                Forum.controllers.HeaderController.showHeader(passedData.userData);
                Forum.controllers.CategoryController.showCategories(passedData.userData);
                Forum.controllers.SearchController
                .getParams(this.params['option'], this.params['searched'], parseInt(this.params['pageNumber']));
            });
        });

		this.get('#/admin/viewAnswers', function() {
            $.when(HeaderInclude()).done(function(){
                if(passedData.userData){
                    if(passedData.userData.role.name === "admins"){
                        Forum.controllers.HeaderController.showHeader(passedData.userData);
                        Forum.controllers.CategoryController.showCategories(passedData.userData);
                    } else{
                        Forum.Router.setLocation('#/');
                    }
                } else {
                    Forum.Router.setLocation('#/');
                }
            });
		});
        
        this.get('#/admin/viewTags', function() {
			Forum.controllers.HeaderController.showHeader();
			Forum.controllers.CategoryController.showCategory(this.params['objectId'], parseInt(this.params['pageNumber']));
			Forum.controllers.CategoryController.showCategories();
		});
	});

	Forum.Router.run('#/');
})();