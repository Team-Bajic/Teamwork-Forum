var Forum = Forum || {};

Forum.data = (function() {
    var Category = {
        create: function(title) {
            return Forum.Requester.postRequest(null, Forum.baseUrl + 'Category/', {
                title: title
            }, '', function(result) {
                return result;
            }, null);
        },
        getById: function(id) {
            return Forum.Requester.getRequest(null, Forum.baseUrl + 'Category/' + id, null, '', function(result) {
                return result;
            }, null);
        },
        deleteById: function(id) {
            return Forum.Requester.deleteRequest(null, Forum.baseUrl + 'Category/' + id, '', function(result) {
                return result;
            }, null);
        },
        getAll: function() {
            return Forum.Requester.getRequest(null, Forum.baseUrl + 'Category/', null, '', function(result) {
                return result;
            }, null);
        }
    };

    var Tag = {
        create: function(title) {
            return Forum.Requester.postRequest(null, Forum.baseUrl + 'Tag/', {
                title: title
            }, '', function(result) {
                return result;
            }, null);
        },
        getById: function(id) {
            return Forum.Requester.getRequest(null, Forum.baseUrl + 'Tag/' + id, null, '', function(result) {
                return result;
            }, null);
        },
        deleteById: function(id) {
            return Forum.Requester.deleteRequest(null, Forum.baseUrl + 'Tag/' + id, '', function(result) {
                return result;
            }, null);
        },
        getAll: function() {
            return Forum.Requester.getRequest(null, Forum.baseUrl + 'Tag/', null, '', function(result) {
                return result;
            }, null);
        }
    };

    var Question = {
        create: function(title, postedByID, categoryID, questionText) {
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

            return Forum.Requester.postRequest(null, Forum.baseUrl + 'Question/', dataToSave, '', function(result) {
                return result;
            }, null);
        },
        getById: function(id) {
            return Forum.Requester.getRequest(null, Forum.baseUrl + 'Question/' + id, null, '', function(result) {
                return result;
            }, null);
        },
        deleteById: function(id) {
            return Forum.Requester.deleteRequest(null, Forum.baseUrl + 'Question/' + id, '', function(result) {
                return result;
            }, null);
        },
        getAll: function() {
            return Forum.Requester.getRequest(null, Forum.baseUrl + 'Question/', null, '', function(result) {
                return result;
            }, null);
        }
    };
    var Answer = {
        createByUser: function(postedByID, questionID, answerText) {
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

            return Forum.Requester.postRequest(null, Forum.baseUrl + 'Answer/', dataToSave, '', function(result) {
                return result;
            }, null);
        },
        createByGuest: function(author, questionId, answerText) {
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

            return Forum.Requester.postRequest(null, Forum.baseUrl + 'Answer/', dataToSave, '', function(result) {
                return result;
            }, null);
        },
        getById: function(id) {
            return Forum.Requester.getRequest(null, Forum.baseUrl + 'Answer/' + id, null, '', function(result) {
                return result;
            }, null);
        },
        deleteById: function(id) {
            return Forum.Requester.deleteRequest(null, Forum.baseUrl + 'Answer/' + id, '', function(result) {
                return result;
            }, null);
        },
        getAll: function() {
            return Forum.Requester.getRequest(null, Forum.baseUrl + 'Answer/', null, '', function(result) {
                return result;
            }, null);
        }
    };
    
    var User = {
        logIn: function(username, password) {
            return Forum.Requester.getRequest(null, 'https://api.parse.com/1/login', {
                username: username,
                password: password
            }, '', function(result) {
                window.sessionStorage.sessionToken = result.sessionToken;
                console.log(result.sessionToken);
            }, null)
        },
        logOut: function() {
            return Forum.Requester.postRequest({
                'X-Parse-Session-Token': window.sessionStorage.sessionToken
            }, 'https://api.parse.com/1/logout', null, '', function() {
                delete window.sessionStorage.sessionToken;
            }, null)
        },
        signUp: function(username, password, email) {
            return Forum.Requester.postRequest(null, 'https://api.parse.com/1/users', {
                username: username,
                password: password,
                email: email
            }, '', function(result) {
                console.log(result);
            }, null)
        },
        currentUser: function() {
            return Forum.Requester.getRequest({
                'X-Parse-Session-Token': window.sessionStorage.sessionToken
            }, 'https://api.parse.com/1/users/me', null, '', function(result) {
                console.log(result);
            }, null)
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