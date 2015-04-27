var Forum = Forum || {};

Forum.config = {
	questionsPerPage: 5,
	answersPerPage: 5
};

Handlebars.registerHelper('ifEquals', function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
    
  return options.inverse(this);
});