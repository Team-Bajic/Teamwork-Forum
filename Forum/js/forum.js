var Forum = Forum || {};

$(document).ready(function() {
	Forum.data.Question.getCount().then(function(result){
		console.log(result);
	});
});