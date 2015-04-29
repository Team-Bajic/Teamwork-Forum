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

Parse.Cloud.define('incrementQuestionVisits', function(request, response) {
	var query = new Parse.Query("Question");

	query.equalTo("objectId", request.object.id);
	query.find({
		success: function(question) {
			question.increment("visits");
			question.save();
			response.success();
		},
		error: function(error) {
			response.error(error);
		}
	})
});

Parse.Cloud.define('editAnswer', function(request, response) {
	var query = new Parse.Query("Answer");
	var user = request.params.userData;

	if (user) {
		if (request.params.answer.newText.length < 5) {
			response.error("Text too short, minimum 5 characters.");
		} else {
			user = JSON.parse(JSON.stringify(user));

			query.get(request.params.answer.objectId, {
				success: function(answer) {
					if (user.role.objectId === "0cmOiSZe8k" || (answer.get('answerType') === "user" && user.objectId === JSON.parse(JSON.stringify(answer.get('postedBy'))).objectId)) {

						answer.set('answerText', request.params.answer.newText);
						answer.save();
						response.success("Successfully edited");
					} else {
						response.error('Unauthorised');
					}
				},
				error: function(error) {
					response.error(error);
				}
			})
		}
	} else {
		response.error('Unauthorised');
	}
});

Parse.Cloud.define('editQuestion', function(request, response) {
	var query = new Parse.Query("Question");
	var user = request.params.userData;

	if (user) {
		if (request.params.question.newText.length < 10 || request.params.question.newTitle.length < 10) {
			response.error("One of the changed is less than the minimum allowed.");
		} else {
			user = JSON.parse(JSON.stringify(user));
			query.get(request.params.question.objectId, {
				success: function(question) {
					if (user.role.objectId === "0cmOiSZe8k" || user.objectId === JSON.parse(JSON.stringify(question.get('postedBy'))).objectId) {
						question.set('title', request.params.question.newTitle);
						question.set('questionText', request.params.question.newText);
						question.set('tags', request.params.question.tags);
						question.save();
						response.success("Successfully edited");
					} else {
						response.error('Unauthorised');
					}
				},
				error: function(error) {
					response.error(error);
				}
			})
		}
	} else {
		response.error('Unauthorised');
	}
});

Parse.Cloud.define('editCategory', function(request, response) {
	var query = new Parse.Query("Category");
	var user = request.params.userData;

	if (user) {
		if (request.params.category.newTitle.length < 5) {
			response.error("Category title length must be greater than 5.");
		} else {
			user = JSON.parse(JSON.stringify(user));
			query.get(request.params.category.objectId, {
				success: function(category) {
					if (user.role.objectId === "0cmOiSZe8k") {
						category.set('title', request.params.category.newTitle);
						category.save();
						response.success();
					} else {
						response.error('Unauthorised');
					}
				},
				error: function(error) {
					response.error(error);
				}
			})
		}
	}
});

Parse.Cloud.define('editTag', function(request, response) {
	var query = new Parse.Query("Question");
	var user = request.params.userData;

	if (user) {
		if (request.params.tag.newTitle.length < 5) {
			response.error("Tag title length must be greater than 5.");
		} else {
			user = JSON.parse(JSON.stringify(user));

			query.equalTo("tags", request.params.tag.currentTitle);
			query.find({
				success: function(questions) {
					if (user.role.objectId === "0cmOiSZe8k") {
						questions.forEach(function(question) {
							var currentTags = questions.get('tags');
							var index = currentTags.indexOf(request.params.tag.currentTitle);

							currentTags.splice(index, 1);
							question.set('tags', currentTags);
							question.save();
						});

						response.success("Successfully edited the tag.");
					} else {
						response.error('Unauthorised');
					}
				},
				error: function(error) {
					response.error(error);
				}
			})
		}
	}
});

Parse.Cloud.define('registerUser', function(request, response) {
	var query = new Parse.Query("Question");
	var userData = request.params.userData;

	function validateEmail(email) {
		var re = /\S+@\S+\.\S+/;
		return re.test(email);
	}

	if (userData) {
		userData = JSON.parse(JSON.stringify(userData));

		if (userData.username.length < 5) {
			response.error("Username must be must be at least 5 characters long.");
		} else if (userData.password.length < 6) {
			response.error("Password must be at least 6 characters long.");
		} else if (validateEmail(userData.email) === false) {
			response.error("Email is not valid.");
		} else {
			var user = new Parse.User();
			var role = new Parse.Query("_Role");
			role.get(userData.role.objectId, {
				success: function(result) {
					user.set("username", userData.username);
					user.set("password", userData.password);
					user.set("email", userData.email);
					user.set("role", result);

					user.signUp(null, {
						success: function(user) {
							response.success("Successfull registration.");
						},
						error: function(user, error) {
							response.error("Error: " + error.code + " " + error.message);
						}
					});
				},
				error: function(error) {
					response.error("Error: " + error.code + " " + error.message);
				}
			});


		}
	} else {
		response.error("Cannot complete registration.");
	}
});