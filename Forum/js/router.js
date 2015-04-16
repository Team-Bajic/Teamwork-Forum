var Forum = Forum || {};

(function () {
	Forum.Router = new Sammy(function(){
		this.get('#/', Forum.controllers.PageController.ShowMain);

		this.get('#/MyPage', function(){
			console.log('My Page');
		});

		this.get('#/createQuestion', function(){
			console.log('My Page');
		});
	});

	Forum.Router.run('#/');
})(); 