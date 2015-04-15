var Forum = Forum || {};

Forum.ApplicationID = 'OHLDDw4fScOBF6B9rRO40p4urKuEoNXpakX2UvXX';
Forum.RestApiKey = 'K9J7vXfCWIvDiC0VwMxF2wzdo0ktzMjMcsLCsFZH';
Forum.baseUrl = 'https://api.parse.com/1/classes/';

$(document).ready(function() {
    Forum.data.Question.getById('0i3XiNVmko')
        .then(function(result){
            console.log(result);
        });

    var temp = new Forum.views.CategoryView();
    temp.render($('.section-container'), {title: 'test'});

    Forum.data.User.logIn('test', 'test');
    Forum.data.User.currentUser();
});