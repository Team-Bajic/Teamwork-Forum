var Forum = Forum || {};

Forum.classesUrl = '/classes';

Forum.data = (function() {
	var Category = {
		create: function(title) {
			return Forum.Requester.postRequest(null, Forum.classesUrl + '/Category/', {
				title: title
			}, '').then(function(result) {
				return result;
			}, null);
		},
		getById: function(id) {
			var queryParams = '?include=questions.postedBy';

			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Category/' + id, null, queryParams)
			.then(function(result) {
				return result;
			}, null);
		},
		deleteById: function(id) {
			var headerAddition = {'X-Parse-Session-Token': window.sessionStorage.sessionToken};

			return Forum.Requester.deleteRequest(headerAddition, Forum.classesUrl + '/Category/' + id, '')
			.then(function(result) {
				return result;
			}, null);
		},
		editById: function (id, title) {
			var headerAddition = {'X-Parse-Session-Token': window.sessionStorage.sessionToken},
				dataToUpdate = {
					title: title
				};

			return Forum.Requester.putRequest(headerAddition, Forum.classesUrl + '/Category/' + id,
                JSON.stringify(dataToUpdate), '').then(function(result) {
                	return result;
            }, null);
		},
		getAll: function() {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Category/', null, '')
			.then(function(result) {
				return result;
			}, null);
		},
		addQuestion: function(categoryId, questionId) {
			var dataToUpdate = {
				"questions": {
					"__op": "AddUnique",
					"objects": [{
						"__type": "Pointer",
						"className": "Question",
						"objectId": questionId
					}]
				}
			}
            
            var headerAddition = {'X-Parse-Session-Token': window.sessionStorage.sessionToken};
            
			return Forum.Requester.putRequest(headerAddition, Forum.classesUrl + '/Category/' + categoryId,
				JSON.stringify(dataToUpdate), '').then(function(result) {
				return result;
			}, null);
		}
	};

	var Tag = {
		create: function(title) {
			return Forum.Requester.postRequest(null, Forum.classesUrl + '/Tag/', {
				title: title
			}, '').then(function(result) {
				return result;
			}, null);
		},
		getById: function(id) {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Tag/' + id, null, '')
			.then(function(result) {
				return result;
			}, null);
		},
		deleteById: function(id) {
			var headerAddition = {'X-Parse-Session-Token': window.sessionStorage.sessionToken};

			return Forum.Requester.deleteRequest(headerAddition, Forum.classesUrl + '/Tag/' + id, '')
			.then(function(result) {
				return result;
			}, null);
		},
		editById: function (id, title) {
			var headerAddition = {'X-Parse-Session-Token': window.sessionStorage.sessionToken},
				dataToUpdate = {
					title: title
				};

			return Forum.Requester.putRequest(headerAddition, Forum.classesUrl + '/Tag/' + id,
                JSON.stringify(dataToUpdate), '').then(function(result) {
                	return result;
            }, null);
		},
		getAll: function() {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Tag/', null, '');
		},

	};

	var Question = {
		create: function(title, postedByID, questionText, categoryID, tags) {
			var user = Forum.data.User.currentUser(),
				headerAddition,
                questionId,
                userData;

			if (user !== null) {
				return user.then(function(result) {
                    userData = result;
                    
					var dataToSave = {
						title: title,
						questionText: questionText,
						postedBy: {
							__type: 'Pointer',
							className: '_User',
							objectId: result.objectId
						},
						category: {
							__type: 'Pointer',
							className: 'Category',
							objectId: categoryID
						},
                        tags: tags,
                        visits: 0
					};

					headerAddition = {
						'X-Parse-Session-Token': result.sessionToken
					};

					return Forum.Requester.postRequest(headerAddition, Forum.classesUrl + '/Question/', JSON.stringify(dataToSave), '')
					.then(function(result) {
						return result;
					}, function(error){
						console.log(error);
					});
				}).then(function(result){
                    questionId = result.objectId;
                    
                    return Forum.data.Category.addQuestion(categoryID, questionId);
                }).then(function(){
                    return Forum.data.User.addQuestion(questionId, userData);
                });
			}
		},
		getById: function(id) {
			var queryParams = '?include=answers.postedBy,postedBy';

			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/' + id, null, queryParams);
		},
		deleteById: function(id) {
			var headerAddition = {'X-Parse-Session-Token': window.sessionStorage.sessionToken};

			return Forum.Requester.deleteRequest(headerAddition, Forum.classesUrl + '/Question/' + id, '')
			.then(function(result) {
				return result;
			}, function(error){
				console.log(error);
			});
		},
		editById: function (id, questionData, userData) {
			var headerAddition = {'X-Parse-Session-Token': window.sessionStorage.sessionToken},
				dataToUpdate = {
					question: {
						newTitle: questionData.questionTitle,
						newText: questionData.questionText,
						objectId: id,
						tags: questionData.tags
					},
					userData: userData
				};

			return Forum.Requester.postRequest(headerAddition, '/functions/editQuestion',
                JSON.stringify(dataToUpdate), '').then(function(result) {
                	return result;
            }, function(error){
            	console.log(error);
            });
		},
		getAll: function() {
			var queryParams = '?include=postedBy';

			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/', null, queryParams)
			.then(function(result) {
				return result;
			}, function(error){
				console.log(error);
			});
		},
		getInRange: function(skipNum, limitNum) {
			var queryParams = "?skip=" + skipNum + "&limit=" + limitNum + '&include=postedBy';

			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/', null, queryParams)
			.then(function(result) {
				return result;
			}, function(error){
				console.log(error);
			});
		},
		getInRangeByCategory: function(questionId, skipNum, limitNum) {
			var queryParams = '?where={"category":{"__type":"Pointer","className":"Category","objectId":"' + questionId + '"}}&include=postedBy' + "&skip=" + skipNum + "&limit=" + limitNum;

			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/', null, queryParams)
			.then(function(result) {
				return result;
			}, function(error){
				console.log(error);
			});
		},
		getCount: function() {
			var queryParams = "?count=1&limit=0";

			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/', null, queryParams)
			.then(function(result) {
				return result;
			}, function(error){
				console.log(error);
			});
		},
		addAnswer: function(questionId, answerId) {
			var dataToUpdate = {
				"answers": {
					"__op": "AddUnique",
					"objects": [{
						"__type": "Pointer",
						"className": "Answer",
						"objectId": answerId
					}]
				}
			};

			return Forum.Requester.putRequest(null, Forum.classesUrl + '/Question/' + questionId, JSON.stringify(dataToUpdate), '')
			.then(function(result) {
				return result;
			}, function(error){
				console.log(error);
			});
		}
	};
    
	var Answer = {
		createByUser: function(userData, questionId, answerText) {
			var dataToSave = {
				answerText: answerText,
				postedBy: {
					__type: 'Pointer',
					className: '_User',
					objectId: userData.objectId
				},
				author: '',
				answerType: 'user',
				question: {
					__type: 'Pointer',
					className: 'Question',
					objectId: questionId
				}
			};
            
            var answerId = null;
            
			return Forum.Requester.postRequest(null, Forum.classesUrl + '/Answer/', JSON.stringify(dataToSave), '')
            .then(function(result){
                answerId = result.objectId;
                
                return Forum.data.Question.addAnswer(questionId, answerId);
            }).then(function(){
                return Forum.data.User.addAnswer(answerId, userData);
            });
		},
		createByGuest: function(author, questionId, answerText) {
			var dataToSave = {
				answerText: answerText,
				postedBy: null,
				author: author,
				answerType: 'guest',
				question: {
					__type: 'Pointer',
					className: 'Question',
					objectId: questionId
				}
			};

			return Forum.Requester.postRequest(null, Forum.classesUrl + '/Answer/', JSON.stringify(dataToSave), '')
                .then(function(result){
                    return Forum.data.Question.addAnswer(questionId, result.objectId);
                }, function(error){
                	console.log(error);
                });
		},
		getById: function(id) {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Answer/' + id, null, '')
			.then(function(result) {
				return result;
			}, function(error){
				console.log(error);
			});
		},
		deleteById: function(id) {
			var headerAddition = {'X-Parse-Session-Token': window.sessionStorage.sessionToken};
			
			return Forum.Requester.deleteRequest(headerAddition, Forum.classesUrl + '/Answer/' + id, '')
			.then(function(result) {
				return result;
			}, function(error){
				console.log(error);
			});
		},
		editById: function (id, answerText, userData) {
			var headerAddition = {'X-Parse-Session-Token': window.sessionStorage.sessionToken},
				dataToUpdate = {
					answer: {
						newText: answerText,
						objectId: id
					},
					userData: userData
				};

			return Forum.Requester.postRequest(headerAddition, '/functions/editAnswer',
                JSON.stringify(dataToUpdate), '').then(function(result) {
                	return result;
            }, function(error){
            	console.log(error);
            });
		},
		getAll: function() {
			var urlParams = '?include=question,postedBy';
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Answer/', null, urlParams)
			.then(function(result) {
				return result;
			}, function(error){
				console.log(error);
			});
		}
	};

	var User = {
		logIn: function(username, password) {
			if (window.sessionStorage.sessionToken) {
				return this.currentUser();
			} else {
				return Forum.Requester.getRequest(null, '/login', {
					username: username,
					password: password
				}, '').then(function(result) {
					window.sessionStorage.sessionToken = result.sessionToken;
				}, function(error) {
					console.log(error);
				});
			}
		},
		logOut: function() {
			if (window.sessionStorage.sessionToken) {
				return Forum.Requester.postRequest({
					'X-Parse-Session-Token': window.sessionStorage.sessionToken
				}, '/logout', null)
				.then(function(result) {
					delete window.sessionStorage.sessionToken;
				}, function(error){
					console.log(error);
				});
			} else {
				return null;
			}
		},
		signUp: function(username, password, email) {
			return Forum.Requester.postRequest(null, '/users', JSON.stringify({
				username: username,
				password: password,
				email: email,
				role: {
					"__type": "Pointer",
					"className": "_Role",
					"objectId": "Yt4OgikFDX"
				}
			}), '').then(function(result) {
				return result;
			}, function(error){
				console.log(error);
			});
		},
        getAll: function(){
            return Forum.Requester.getRequest(null, '/users', null, '');
        },
        getById: function(objectId){
            return Forum.Requester.getRequest(null, '/users/' + objectId, null, '');
        },
        addAnswer: function(answerId, currentUser){
            var dataToUpdate = {
				"answers": {
					"__op": "AddUnique",
					"objects": [{
						"__type": "Pointer",
						"className": "Answer",
						"objectId": answerId
					}]
				}
			};
            
            var headerAddition = {'X-Parse-Session-Token': window.sessionStorage.sessionToken};
            
			return Forum.Requester.putRequest(headerAddition, '/users/' + currentUser.objectId,
				JSON.stringify(dataToUpdate), '').then(function(result) {
				return result;
			}, null);
        },
        addQuestion: function(questionId, currentUser){
            var dataToUpdate = {
				"questions": {
					"__op": "AddUnique",
					"objects": [{
						"__type": "Pointer",
						"className": "Question",
						"objectId": questionId
					}]
				}
			};
            
            var headerAddition = {'X-Parse-Session-Token': currentUser.sessionToken};
            
			return Forum.Requester.putRequest(headerAddition, '/users/' + currentUser.objectId,
				JSON.stringify(dataToUpdate), '').then(function(result) {
				return result;
			}, null);
        },
		updateRole: function(roleId, userId) {
			return Forum.Requester.putRequest(null, '/roles/' + roleId, JSON.stringify({
				"users": {
					"__op": "AddRelation",
					"objects": [{
						"__type": "Pointer",
						"className": "_User",
						"objectId": userId
					}]
				}
			}), '').then(function(result) {
				return result;
			}, null);
		},
		getUsersRole: function() {
			var queryParams = '?where={"name":"users"}';

			return Forum.Requester.getRequest(null, '/roles', '', queryParams)
			.then(function(result) {
				return result;
			}, null);
		},
		currentUser: function() {
			if (window.sessionStorage.sessionToken) {
				return Forum.Requester.getRequest({
					'X-Parse-Session-Token': window.sessionStorage.sessionToken
				}, '/users/me', null, '')
				.then(function(result) {
					return result;
				}, function(error) {
					return null;
				});
			} else {
				return null;
			}
		}
	};

    var Role = {
        getById: function(objectId){
            return Forum.Requester.getRequest(null, "/roles/" + objectId, null, '')
            .then(function(result){
            	return result;
            }, null);
        }
    };
    
	return {
		Category: Category,
		Tag: Tag,
		Question: Question,
		Answer: Answer,
		User: User,
        Role: Role
	};
})();