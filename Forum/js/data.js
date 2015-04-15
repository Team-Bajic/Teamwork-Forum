var Forum = Forum || {};

Forum.data = (function(){
    var Category = {
        create: function(title){
            Forum.Requester.postRequest(Forum.baseUrl + 'Category/', {title: title}, '', function(result){
                console.log(result.objectId);
            }, null);
        },
        getById: function(id){
            Forum.Requester.getRequest(Forum.baseUrl + 'Category/' + id, '', function(result){
                console.log(result);
            }, null);
        },
        deleteById: function(id){
            Forum.Requester.deleteRequest(Forum.baseUrl + 'Category/' + id, '', function(result){
                console.log(result);
            }, null);
        },
        getAll: function () {
            Forum.Requester.getRequest(Forum.baseUrl + 'Category/', '', function(result){
                console.log(result);
            }, null);
        }
    };

    var Tag = {
        create: function(title){
            Forum.Requester.postRequest(Forum.baseUrl + 'Tag/', {title: title}, '', function(result){
                console.log(result.objectId);
            }, null);
        },
        getById: function(id){
            Forum.Requester.getRequest(Forum.baseUrl + 'Tag/' + id, '', function(result){
                console.log(result);
            }, null);
        },
        deleteById: function(id){
            Forum.Requester.deleteRequest(Forum.baseUrl + 'Tag/' + id, '', function(result){
                console.log(result);
            }, null);
        },
        getAll: function () {
            Forum.Requester.getRequest(Forum.baseUrl + 'Tag/', '', function(result){
                console.log(result);
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

            Forum.Requester.postRequest(Forum.baseUrl + 'Question/', dataToSave, '', function(result){
                console.log(result.objectId);
            }, null);
        },
        getById: function(id){
            Forum.Requester.getRequest(Forum.baseUrl + 'Question/' + id, '', function(result){
                console.log(result);
            }, null);
        },
        deleteById: function(id){
            Forum.Requester.deleteRequest(Forum.baseUrl + 'Question/' + id, '', function(result){
                console.log(result);
            }, null);
        },
        getAll: function () {
            Forum.Requester.getRequest(Forum.baseUrl + 'Question/', '', function(result){
                console.log(result);
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

            Forum.Requester.postRequest(Forum.baseUrl + 'Answer/', dataToSave, '', function(result){
                console.log(result.objectId);
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

            Forum.Requester.postRequest(Forum.baseUrl + 'Answer/', dataToSave, '', function(result){
                console.log(result.objectId);
            }, null);
        },
        getById: function(id){
            Forum.Requester.getRequest(Forum.baseUrl + 'Answer/' + id, '', function(result){
                console.log(result);
            }, null);
        },
        deleteById: function(id){
            Forum.Requester.deleteRequest(Forum.baseUrl + 'Answer/' + id, '', function(result){
                console.log(result);
            }, null);
        },
        getAll: function () {
            Forum.Requester.getRequest(Forum.baseUrl + 'Answer/', '', function(result){
                console.log(result);
            }, null);
        }
    };
    var User = {};

    return {
        Category: Category,
        Tag: Tag,
        Question: Question,
        Answer: Answer,
        User: User
    };
})();