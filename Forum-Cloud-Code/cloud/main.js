Parse.Cloud.define("test", function(request, response) {
	var user = Parse.User.current();
	if (user) {
		response.success(user);
	} else {
		response.error();
	}

})

Parse.Cloud.beforeDelete("Answer", function(request, response) {
	var user = request.user;
	if (user.get('role').id === "0cmOiSZe8k" || user.id === request.object.get('postedBy').id) {
		var questionQuery = new Parse.Query("Question");
		var userQuery = new Parse.Query(Parse.User);

		questionQuery.equalTo("answers", request.object);
		questionQuery.include("answers");

		userQuery.equalTo("answers", request.object);
		userQuery.include("answers");

		questionQuery.each(function(question) {
			question.remove("answers", request.object);
			question.save();
		}, {
			success: function() {
				userQuery.each(function(user) {
					user.remove("answers", request.object);
					user.save();
				}, {
					success: function() {
						response.success();
					},
					error: function(error) {
						response.error(error);
					}
				});
			},
			error: function(error) {
				response.error(error);
			}
		});
	} else {
		response.error("Login first!");
	}
});

Parse.Cloud.beforeDelete("Question", function(request, response) {
	var user = request.user;
	if (user.get('role').id === "0cmOiSZe8k" || user.id === request.object.get('postedBy').id) {
		var categoryQuery = new Parse.Query("Category");
		var userQuery = new Parse.Query(Parse.User);

		categoryQuery.equalTo("questions", request.object);
		categoryQuery.include("questions");

		userQuery.equalTo("questions", request.object);
		userQuery.include("questions");

		categoryQuery.each(function(category) {
			category.remove("questions", request.object);
			category.save();
		}, {
			success: function() {
				userQuery.each(function(user) {
					user.remove("questions", request.object);
					user.save();
				}, {
					success: function() {
						response.success();
					},
					error: function(err) {
						response.error(err);
					}
				});
			},
			error: function(err) {
				response.error(err);
			}
		});
	} else {
		response.error("Login first!");
	}
});

Parse.Cloud.afterDelete("Question", function(request, response) {
	var user = request.user;
	if (user.get('role').id === "0cmOiSZe8k" || user.id === request.object.get('postedBy').id) {
		var query = new Parse.Query("Answer");

		query.equalTo('question', request.object);

		query.find({
			success: function(answers) {
				Parse.Object.destroyAll(answers, {
					success: function() {},
					error: function(error) {
						response.error(error);
					}
				});
			},
			error: function(error) {
				response.error(error);
			}
		});
	} else {
		response.error("Login first!");
	}
});

Parse.Cloud.beforeDelete("Category", function(request, response) {
	var user = request.user;
	if (user.get('role').id === "0cmOiSZe8k") {
		var query = new Parse.Query("Question");

		query.equalTo('category', request.object);

		query.find({
			success: function(questions) {
				Parse.Object.destroyAll(questions, {
					success: function() {
						response.success();
					},
					error: function(error) {
						response.error(error);
					}
				});
			},
			error: function(error) {
				response.error(error);
			}
		});
	} else {
		response.error("Login first!");
	}
});

Parse.Cloud.beforeSave("Category", function(request, response) {
	var user = request.user;
	if (user && (user.get('role').id === "0cmOiSZe8k")) {
		if (!request.object.get("title")) {
			response.error("Title is required for creating a category!");
		} else if (request.object.get("title").length <= 10) {
			response.error("Category title must be longer than 10 character.");
		} else {
			response.success();
		}
	} else {
		response.error("Unauthorized");
	}
});

Parse.Cloud.beforeSave("Question", function(request, response) {
	var user = request.user;
	if (user && (user.get('role').id === "0cmOiSZe8k" || user.id === request.object.get('postedBy').id)) {
		if (!request.object.get("title")) {
			response.error("Title is required for creating a question!");
		} else if (request.object.get("title").length <= 10) {
			response.error("Question title must be longer than 10 character.");
		} else if (!request.object.get("questionText")) {
			response.error("Question text is required!")
		} else if (request.object.get("questionText").length < 20) {
			response.error("Question text must be longer than 20 characters.")
		} else {
			response.success();
		}
	} else {
		response.error("Unauthorized");
	}
});

Parse.Cloud.beforeSave("Answer", function(request, response) {
	var user = request.user;
	if (user && (user.get('role').id === "0cmOiSZe8k" || user.id === request.object.get('postedBy').id)) {
		if (!request.object.get("answerText")) {
			response.error("Answer text is required!")
		} else if (request.object.get("answerText").length < 20) {
			response.error("Answer text must be longer than 20 characters.")
		} else {
			response.success();
		}
	} else {
		response.error("Unauthorized");
	}
});

Parse.Cloud.define('incrementQuestionVisits', function (request, response) {
	var query = new Parse.Query("Question");

	query.equalTo("objectId", request.object.id);
	query.find({
		success: function (question) {
			question.increment("visits");
			question.save();
			response.success();
		},
		error: function (error) {
			response.error(error);
		}
	})
});