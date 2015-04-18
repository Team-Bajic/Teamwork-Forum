var Forum = Forum || {};

Forum.views = (function() {
	var MainView = function(categories, questions, userData) {
		this.headerHtml = Forum.templates.HeaderTemplate.template(userData);
		this.categoriesHtml = Forum.templates.CategoriesTemplate.template({
			categories: categories
		});
		this.questionsHtml = Forum.templates.QuestionsTemplate.template({
			questions: questions
		});
	}

	MainView.prototype.render = function() {
		$('.header').html(this.headerHtml);
		$('.section-container').html(this.categoriesHtml);
		$('.large-9').html(this.questionsHtml);

		Forum.templates.HeaderTemplate.addEventHandlers();
	}

	return {
		MainView: MainView
	};
})();