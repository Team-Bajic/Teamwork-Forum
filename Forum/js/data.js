var Forum = Forum || {};

Forum.data = (function(){
    var Category = {
        create: function(title){
            return Forum.Requester.postRequest(Forum.baseUrl + 'Category/', {title: title}, '', function(result){
                return result;
            }, null);
        },
        getById: function(id){
            return Forum.Requester.getRequest(Forum.baseUrl + 'Category/' + id, '', function(result){
                return result;
            }, null);
        },
        deleteById: function(id){
            return Forum.Requester.deleteRequest(Forum.baseUrl + 'Category/' + id, '', function(result){
                return result;
            }, null);
        },
        getAll: function () {
            return Forum.Requester.getRequest(Forum.baseUrl + 'Category/', '', function(result){
                return result;
            }, null);
        }
    };

    var Tag = {
        create: function(title){
            return Forum.Requester.postRequest(Forum.baseUrl + 'Tag/', {title: title}, '', function(result){
                return result;
            }, null);
        },
        getById: function(id){
            return Forum.Requester.getRequest(Forum.baseUrl + 'Tag/' + id, '', function(result){
                return result;
            }, null);
        },
        deleteById: function(id){
            return Forum.Requester.deleteRequest(Forum.baseUrl + 'Tag/' + id, '', function(result){
                return result;
            }, null);
        },
        getAll: function () {
            return Forum.Requester.getRequest(Forum.baseUrl + 'Tag/', '', function(result){
                return result;
            }, null);
        }
    };

    var Question = {
        create: function(title, postedByID, categoryID, questionText){
            var dataToSave = {
                title: title,
                questionText: questionText,
                postedBy: {
                    __type: 'Pointer',
                    className: '_User',
                    objectId: postedByID
                },
                category: {
                    __type: 'Pointer',
                    className: 'Category',
                    objectId: categoryID
                }
            };

            return Forum.Requester.postRequest(Forum.baseUrl + 'Question/', dataToSave, '', function(result){
                return result;
            }, null);
        },
        getById: function(id){
            return Forum.Requester.getRequest(Forum.baseUrl + 'Question/' + id, '', function(result){
                return result;
            }, null);
        },
        deleteById: function(id){
            return Forum.Requester.deleteRequest(Forum.baseUrl + 'Question/' + id, '', function(result){
                return result;
            }, null);
        },
        getAll: function () {
            return Forum.Requester.getRequest(Forum.baseUrl + 'Question/', '', function(result){
                return result;
            }, null);
        }
    };
    var Answer = {
        createByUser: function(postedByID, questionID, answerText){
            var dataToSave = {
                answerText: questionText,
                postedBy: {
                    __type: 'Pointer',
                    className: '_User',
                    objectId: postedByID
                },
                author: '',
                answerType: 'user',
                question: {
                    __type: 'Pointer',
                    className: 'Question',
                    objectId: questionID
                }
            };

            return Forum.Requester.postRequest(Forum.baseUrl + 'Answer/', dataToSave, '', function(result){
                return result;
            }, null);
        },
        createByGuest: function(author, questionId, answerText){
            var dataToSave = {
                answerText: questionText,
                postedBy: null,
                author: author,
                answerType: 'guest',
                question: {
                    __type: 'Pointer',
                    className: 'Question',
                    objectId: questionID
                }
            };

            return Forum.Requester.postRequest(Forum.baseUrl + 'Answer/', dataToSave, '', function(result){
                return result;
            }, null);
        },
        getById: function(id){
            return Forum.Requester.getRequest(Forum.baseUrl + 'Answer/' + id, '', function(result){
                return result;
            }, null);
        },
        deleteById: function(id){
            return Forum.Requester.deleteRequest(Forum.baseUrl + 'Answer/' + id, '', function(result){
                return result;
            }, null);
        },
        getAll: function () {
            return Forum.Requester.getRequest(Forum.baseUrl + 'Answer/', '', function(result){
                return result;
            }, null);
        }
    };
    var User = {
        logIn: function (username, password) {
            $.ajax({
                url: 'https://api.parse.com/1/login',
                method: 'GET',
                data: {username: username, password: password},
                success: function(result){
                    window.sessionStorage.sessionToken = result.sessionToken;
                },
                error: null,
                headers:{
                    'X-Parse-Application-Id': Forum.ApplicationID,
                    'X-Parse-REST-API-Key': Forum.RestApiKey,
                    'Content-Type': 'application/json'
                }
            });
        },
        logOut: function(){

        },
        signUp: function(username, password, email){
            $.ajax({
                url: 'https://api.parse.com/1/users',
                method: 'POST',
                data: JSON.stringify({username: username, password: password, email: email}),
                success: function(result){
                    console.log(result);
                },
                error: null,
                headers:{
                    'X-Parse-Application-Id': Forum.ApplicationID,
                    'X-Parse-REST-API-Key': Forum.RestApiKey,

                    'Content-Type': 'application/json'
                }
            });
        },
        currentUser: function () {
            $.ajax({
                url: 'https://api.parse.com/1/users/me',
                method: 'GET',
                data: null,
                success: function(result){
                    console.log(result);
                },
                error: null,
                headers:{
                    'X-Parse-Application-Id': Forum.ApplicationID,
                    'X-Parse-REST-API-Key': Forum.RestApiKey,
                    'X-Parse-Session-Token': window.sessionStorage.sessionToken,
                    'Content-Type': 'application/json'
                }
            });
        }
    };

    return {
        Category: Category,
        Tag: Tag,
        Question: Question,
        Answer: Answer,
        User: User
    };
})();