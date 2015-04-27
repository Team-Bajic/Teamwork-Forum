var Forum = Forum || {};

Forum.controllers = (function () {
    var controllerData = {};

    function paginate(count, page, url, propertyNames, data, perPage){
    	var next = (page + 1 > count / perPage ? page : page + 1);
        var previous = (page - 1 <= 0 ? 0 : page - 1);
        var previousStatus = (page <= 0 ? "unavailable" : "available");
        var nextStatus = (page + 1 > count / perPage ? "unavailable" : "available");
        var i = 0;
        var objToReturn = {};
        
        for(i; i < propertyNames.length; i += 1){
            objToReturn[propertyNames[i]] = data[i];    
        }
        
        objToReturn.next = next;
        objToReturn.previous = previous;
        objToReturn.previousStatus = previousStatus;
        objToReturn.nextStatus = nextStatus;
        objToReturn.url = url;
        
        return objToReturn;
    }

    var UserController = {
        logInUser: function (username, password) {
            return Forum.data.User.logIn(username, password);
        },
        logOutUser: function () {
            return Forum.data.User.logOut();
        },
        registerUser: function (username, password, email) {
            return Forum.data.User.signUp(username, password, email);
        },
        showProfile: function (objectId) {
            controllerData.userData = null;
            
            Forum.data.User.getById(objectId).then(function(result){
                controllerData.userData = result;
                
                var currentUser = Forum.data.User.currentUser();
                
                if (currentUser !== null) {
                    return currentUser.then(function (result) {
                        if(result.objectId === objectId){
                            controllerData.userData.canEdit = true;
                        }
                    });
                }
            }).done(function(){
                var profileView = new Forum.views.ProfileView();

                profileView.render('.main-container', controllerData.userData);
            });
        }
    };

    var SearchController = {
    	getParams: function(option, searched, page){
    		switch(option){
    			case 'tag':
    				this.searchByTag(searched, page);
    				break;
    			case 'question':
    				this.searchByQuestion(searched, page);
    				break;
    			case 'answer':
    				this.searchByAnswer(searched, page);
    				break;
    			default:
    				this.showInvalidOption();
    				break;
    		}
    	},
    	searchByTag: function(searched, page){
    		Forum.data.Question.getAll().then(function(result){
    			var questions = [];

    			result.results.forEach(function(question){
    				if(question['tags'] != undefined){
    					question.tags.forEach(function(tag){
    						if(tag.toLowerCase().indexOf(searched.toLowerCase()) > -1 && questions.indexOf(questions) < 0){
    							questions.push(question);
    						}
    					});
    				}
    			});

    			var questionsView = new Forum.views.QuestionsView();

    			questions = questions.slice(page * Forum.config.questionsPerPage, page * Forum.config.questionsPerPage + Forum.config.questionsPerPage);

    			questionsView.render('.main-container', 
    				paginate(questions.length, page,
    				 '#/search/by=tag/text=' + searched + '/', ['questions'], [questions],
    				 Forum.config.questionsPerPage));	
    		});
    	},
    	searchByQuestion: function(searched, page){
    		Forum.data.Question.getAll().then(function(result){
    			var questions = [];

    			result.results.forEach(function(question){
    				if(question.title.toLowerCase().indexOf(searched.toLowerCase()) > -1){
    					questions.push(question);
    				}
    			});

    			var questionsView = new Forum.views.QuestionsView();

    			questions = questions.slice(page * Forum.config.questionsPerPage, page * Forum.config.questionsPerPage + Forum.config.questionsPerPage);
    			
    			questionsView.render('.main-container', 
    				paginate(questions.length, page, 
    					'#/search/by=question/text=' + searched + '/', ['questions'], [questions],
    					Forum.config.questionsPerPage));	
    		});
    	},
    	searchByAnswer: function(searched, page){
    		Forum.data.Answer.getAll().then(function(result){
    			var answers = [];

    			result.results.forEach(function(answer){
    				if(answer.answerText.toLowerCase().indexOf(searched.toLowerCase()) > -1){
    					answers.push(answer);
    				}
    			});

    			answers = answers.slice(page * Forum.config.questionsPerPage, page * Forum.config.questionsPerPage + Forum.config.questionsPerPage);

    			$('.main-container').html(Forum.templateBuilder('answers-template',
    			 paginate(answers.length, page, '#/search/by=answer/text=' + searched + '/',
    			 	['answers'], [answers], Forum.config.questionsPerPage)));
    		});
    	},
    	showInvalidOption: function(){
    		$('.main-container').append('<h1>Wrong option selected</h1>');
    	}
    }

    var CategoryController = {
        showCategory: function (categoryId, page, userData) {
            Forum.data.Category.getById(categoryId)
                .then(function (result) {
                    controllerData.categoryData = result;
                    controllerData.categoryData.user = {}; 
                
                    if(userData){
                        controllerData.categoryData.user = userData;
                    }
                     
					if (!page || page < 0) {
			        	page = 0;
					}

                    var start = Forum.config.questionsPerPage * page;
                    var end = Forum.config.questionsPerPage * page + Forum.config.questionsPerPage;
                    var count;

                    if (controllerData.categoryData.questions) {
                        controllerData.questionsData = controllerData.categoryData.questions.slice(start, end);
                        count = controllerData.questionsData.length;
                    } else {
                        controllerData.questionsData = [];
                        count = 0;
                    }

                    var categoryView = new Forum.views.SingleCategoryView();
                    var questionsView = new Forum.views.QuestionsView();

                    categoryView.render('.main-container', controllerData.categoryData);
                    questionsView.render('.questionsBody', paginate(controllerData.questionsData.length, page,
                        'category/' + controllerData.categoryData.objectId + '/', ['questions', 'userData'], 
                        [controllerData.questionsData, userData], Forum.config.questionsPerPage));
                });
        },
        showCategories: function (userData) {
            Forum.data.Category.getAll()
                .then(function (result) {
                    controllerData.categoriesData = result.results;

                    var categoryView = new Forum.views.CategoryView();
                    categoryView.render('.side-container', controllerData.categoriesData);
                });
        }
    };

    var TagController = {

    };

    var QuestionController = {
        showQuestion: function (questionId, page, userData) {
            Forum.data.Question.getById(questionId)
                .then(function (result) {
                    var dataToUpdate = {
                    	visits: parseInt(result.visits) + 1
                    };

					if (!page || page < 0) {
			        	page = 0;
					}

					var start = Forum.config.answersPerPage * page;
                    var end = Forum.config.answersPerPage * page + Forum.config.answersPerPage;
                    var count;

                    if (result.answers) {
                        result.answers = result.answers.slice(start, end);
                    } else {
                        result.answers = [];
                    }

                    Forum.Requester.putRequest(null, Forum.classesUrl + /Question/ + result.objectId, JSON.stringify(dataToUpdate), '');
                	

                    controllerData = paginate(result.answers.length, page, 'question/' + questionId + '/',
                    	['answersData'], [result.answers], Forum.config.answersPerPage);



                    controllerData.userData = {};
                    controllerData.questionData = result;

                    if(userData){
                        controllerData.userData = userData; 
                    }

                    var singleQuestionView = new Forum.views.SingleQuestionView();
                    console.log(controllerData);
                    singleQuestionView.render('.main-container', controllerData);
                });
        },
        showAllQuestions: function (page, userData) {
            if(userData) {
                controllerData.userData = userData;
            }

            Forum.data.Question.getInRange(Forum.config.questionsPerPage * page, Forum.config.questionsPerPage)
                .then(function (result) {
                    controllerData.questionsData = result.results;

                    return Forum.data.Question.getCount();
                }).then(function (result) {
                    var questionsView = new Forum.views.QuestionsView();

                    questionsView.render('.main-container', paginate(result.count,
                     page, '', ['questions', 'userData'], [controllerData.questionsData, userData], Forum.config.questionsPerPage));
                });
        },
        addQuestion: function (title, postedByID, questionText, categoryID, tags) {
            return Forum.data.Question.create(title, postedByID, questionText, categoryID, tags);
        }
    };

    var AnswerController = {
        addAnswer: function (typeAnswer, questionId, answerText, additionalData) {
            switch(typeAnswer){
                case "user":
                    return Forum.data.Answer.createByUser(additionalData.user, questionId, answerText);
                    break;
                case "guest":
                    return Forum.data.Answer.createByGuest(additionalData.author, questionId, answerText);
                    break;
                default:
                    var temp = $.Deferred();
                    
                    temp.resolve();
                    break;
            }
        }
    };

    var HeaderController = {
        showHeader: function (userData) {
            if(userData === undefined){
                userData = null;
            } else{
                if(userData.role.name === "users"){
                    userData.user = true;
                } else if(userData.role.name === "admins"){
                    userData.admin = true;
                }
            }
            
            var headerView = new Forum.views.HeaderView();

            headerView.render('.header', userData);
            
            $('#searchBarButton').on('click', function(){
                if($('#searchBar').val().trim().length === 0){
                    alert("You cannot search for empty string.");
                } else{
                    var selectedOption = $('#searchFilter').val().toLowerCase();
                
                    Forum.Router.setLocation('#/search/by=' + selectedOption + '/text=' + $('#searchBar').val()); 
                }
            });
        }
    };

    return {
        UserController: UserController,
        CategoryController: CategoryController,
        TagController: TagController,
        QuestionController: QuestionController,
        AnswerController: AnswerController,
        HeaderController: HeaderController,
        SearchController: SearchController
    };
})();