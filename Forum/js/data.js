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

    var Tag = {};
    var Question = {};
    var Answer = {};
    var User = {};

    return {
        Category: Category,
        Tag: Tag,
        Question: Question,
        Answer: Answer,
        User: User
    };
})();