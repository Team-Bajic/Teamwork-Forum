var Forum = Forum || {};

Forum.classesUrl = '/classes';

Forum.data = (function() {
    var Category = {
        create: function(title) {
            return Forum.Requester.postRequest(null, Forum.classesUrl + '/Category/', {
                title: title
            }, '', function(result) {
                return result;
            }, null);
        },
        getById: function(id) {
            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Category/' + id, null, '', function(result) {
                return result;
            }, null);
        },
        deleteById: function(id) {
            return Forum.Requester.deleteRequest(null, Forum.classesUrl + '/Category/' + id, '', function(result) {
                return result;
            }, null);
        },
        getAll: function() {
            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Category/', null, '', function(result) {
                return result;
            }, null);
        }
    };

    var Tag = {
        create: function(title) {
            return Forum.Requester.postRequest(null, Forum.classesUrl + '/Tag/', {
                title: title
            }, '', function(result) {
                return result;
            }, null);
        },
        getById: function(id) {
            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Tag/' + id, null, '', function(result) {
                return result;
            }, null);
        },
        deleteById: function(id) {
            return Forum.Requester.deleteRequest(null, Forum.classesUrl + '/Tag/' + id, '', function(result) {
                return result;
            }, null);
        },
        getAll: function() {
            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Tag/', null, '', function(result) {
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

            return Forum.Requester.postRequest(null, Forum.classesUrl + '/Question/', dataToSave, '', function(result) {
                return result;
            }, null);
        },
        getById: function(id) {
            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/' + id, null, '', function(result) {
                return result;
            }, null);
        },
        deleteById: function(id) {
            return Forum.Requester.deleteRequest(null, Forum.classesUrl + '/Question/' + id, '', function(result) {
                return result;
            }, null);
        },
        getAll: function() {
            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/', null, '', function(result) {
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

            return Forum.Requester.postRequest(null, Forum.classesUrl + '/Answer/', dataToSave, '', function(result) {
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

            return Forum.Requester.postRequest(null, Forum.classesUrl + '/Answer/', dataToSave, '', function(result) {
                return result;
            }, null);
        },
        getById: function(id) {
            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Answer/' + id, null, '', function(result) {
                return result;
            }, null);
        },
        deleteById: function(id) {
            return Forum.Requester.deleteRequest(null, Forum.classesUrl + '/Answer/' + id, '', function(result) {
                return result;
            }, null);
        },
        getAll: function() {
            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Answer/', null, '', function(result) {
                return result;
            }, null);
        }
    };

    var User = {
        logIn: function(username, password) {
            return Forum.Requester.getRequest(null, '/login', {
                username: username,
                password: password
            }, '', function(result) {
                window.sessionStorage.sessionToken = result.sessionToken;
            }, null)
        },
        logOut: function() {
            return Forum.Requester.postRequest({
                'X-Parse-Session-Token': window.sessionStorage.sessionToken
            }, '/logout', null, '', function() {
                delete window.sessionStorage.sessionToken;
            }, null)
        },
        signUp: function(username, password, email) {
            return Forum.Requester.postRequest(null, '/users', {
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
            }, '/users/me', null, '', function(result) {
                
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