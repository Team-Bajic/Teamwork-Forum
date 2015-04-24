var Forum = Forum || {};

Forum.controllers = (function () {
    var controllerData = {};

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
            
        }
    };

    var CategoryController = {
        showCategory: function (categoryId, page) {
            Forum.data.Category.getById(categoryId)
                .then(function (result) {
                    controllerData.categoryData = JSON.parse(JSON.stringify(result));

                    if (!page || page < 0) {
                        page = 0;
                    }

                    return Forum.data.Question.getInRangeByCategory(controllerData.categoryData.objectId, Forum.config.questionsPerPage * page, Forum.config.questionsPerPage);
                }).then(function (result) {
                    controllerData.questionsData = JSON.parse(JSON.stringify(result.results));

                    var categoryView = new Forum.views.SingleCategoryView();
                    var questionsView = new Forum.views.QuestionsView();

                    categoryView.render('.questions-container', controllerData.categoryData);

                    var count = controllerData.questionsData.length;

                    var next = (page + 1 > count / Forum.config.questionsPerPage ? page : page + 1);
                    var previous = (page - 1 <= 0 ? 0 : page - 1);
                    var previousStatus = (page <= 0 ? "unavailable" : "available");
                    var nextStatus = (page + 1 > count / Forum.config.questionsPerPage ? "unavailable" : "available");

                    questionsView.render('.questionsBody', QuestionController.paginate(controllerData.questionsData.length, page,
                        'category/' + controllerData.categoryData.objectId + '/', controllerData.questionsData));
                });
        },
        showCategories: function () {
            Forum.data.Category.getAll()
                .then(function (result) {
                    controllerData.categoriesData = JSON.parse(JSON.stringify(result.results));

                    var categoryView = new Forum.views.CategoryView();
                    categoryView.render('.categories-container', controllerData.categoriesData);

                });
        }
    };

    var TagController = {

    };

    var QuestionController = {
        showQuestion: function (questionId) {
            Forum.data.Question.getById(questionId)
                .then(function (result) {

                    controllerData.questionData = JSON.parse(JSON.stringify(result));

                    return Forum.data.Answer.getAnswersByQuestion(controllerData.questionData.objectId);
                }).then(function (result) {
                    controllerData.answersData = JSON.parse(JSON.stringify(result.results));

                    var singleQuestionView = new Forum.views.SingleQuestionView();

                    singleQuestionView.render('.questions-container', controllerData);
                });
        },
        paginate: function (count, page, url, questions) {
            var next = (page + 1 > count / Forum.config.questionsPerPage ? page : page + 1);
            var previous = (page - 1 <= 0 ? 0 : page - 1);
            var previousStatus = (page <= 0 ? "unavailable" : "available");
            var nextStatus = (page + 1 > count / Forum.config.questionsPerPage ? "unavailable" : "available");

            return {
                questions: controllerData.questionsData,
                next: next,
                previous: previous,
                previousStatus: previousStatus,
                nextStatus: nextStatus,
                url: url
            };
        },
        showAllQuestions: function (page) {

            if (!page || page < 0) {
                page = 0;
            }

            Forum.data.Question.getInRange(Forum.config.questionsPerPage * page, Forum.config.questionsPerPage)
                .then(function (result) {
                    controllerData.questionsData = JSON.parse(JSON.stringify(result.results));

                    return Forum.data.Question.getCount();
                }).then(function (result) {
                    var questionsView = new Forum.views.QuestionsView();

                    questionsView.render('.questions-container', QuestionController.paginate(result.count, page, '', controllerData.questionsData));
                });
        },
        addQuestion: function (title, postedByID, questionText, categoryID) {
            Forum.data.Question.create(title, postedByID, questionText, categoryID);
        }
    };

    var AnswerController = {

    };

    var HeaderController = {
        showHeader: function () {
            var user = Forum.data.User.currentUser();
            controllerData.userData = null;

            var headerView = new Forum.views.HeaderView();

            if (user !== null) {
                user.then(function (result) {
                    controllerData.userData = result;
                    
                    return Forum.data.Role.getById(controllerData.userData.role.objectId);
                }).then(function(result){

                    if(result.name === "users"){
                        controllerData.userData.user = true;
                    } else if(result.name === "admins"){
                        controllerData.userData.admin = true;
                    }
                    
                    headerView.render('.header', controllerData.userData);
                });
            } else {
                headerView.render('.header', controllerData.userData);
            }
        }
    };

    return {
        UserController: UserController,
        CategoryController: CategoryController,
        TagController: TagController,
        QuestionController: QuestionController,
        AnswerController: AnswerController,
        HeaderController: HeaderController
    };
})();