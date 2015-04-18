var Forum = Forum || {};

Forum.templates = (function() {
	var HeaderTemplate = {
		template: Forum.templateLoader('header-template'),
		addEventHandlers: function() {
			assignLoginEvents();
			assignRegisterEvents();

			function assignLoginEvents() {
				$("a[data-reveal-id='login']").on('click', function(event) {
					$('div#login').foundation('reveal', 'open');

					$('.close-reveal-modal').on('click', function(event) {
						$('div#login').foundation('reveal', 'close');
					});

					$('#loginButton').on('click', function(event) {
						$('div#login').foundation('reveal', 'close');
					});
				});
			};

			function assignRegisterEvents() {
				$("a[data-reveal-id='register']").on('click', function(event) {
					$('div#register').foundation('reveal', 'open');

					$('.close-reveal-modal').on('click', function(event) {
						$('div#register').foundation('reveal', 'close');
					});

					$('#registerButton').on('click', function(event) {
						$('div#register').foundation('reveal', 'close');
						//Forum.controllers.UserController.registerUser('test', 'test');
					});
				});
			};
		}
	}

	var CategoriesTemplate = {
		template: Forum.templateLoader('category-template')
	}

	var QuestionsTemplate = {
		template: Forum.templateLoader('question-template')
	}

	return {
		HeaderTemplate: HeaderTemplate,
		CategoriesTemplate: CategoriesTemplate,
		QuestionsTemplate: QuestionsTemplate
	}
})();