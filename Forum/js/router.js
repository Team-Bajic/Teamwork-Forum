var Forum = Forum || {};

(function () {
	Forum.Router = new Sammy(function(){
		this.get('#/', function(){
			console.log('Start Page');
		});

		this.get('#/MyPage', function(){
			console.log('My Page');
		});
	});

	Forum.Router.run('#/');
})(); 