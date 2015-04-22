var Forum = Forum || {};

Forum.classesUrl = '/classes';

Forum.data = (function() {
	var Category = {
		create: function(title) {
			return Forum.Requester.postRequest(null, Forum.classesUrl + '/Category/', {
				title: title
			}, '', function(result) {
				return result;
			}, null);
		},
		getById: function(id) {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Category/' + id, null, '', function(result) {
				return result;
			}, null);
		},
		deleteById: function(id) {
			return Forum.Requester.deleteRequest(null, Forum.classesUrl + '/Category/' + id, '', function(result) {
				return result;
			}, null);
		},
		getAll: function() {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Category/', null, '', function(result) {
				return result;
			}, null);
		}
	};

	var Tag = {
		create: function(title) {
			return Forum.Requester.postRequest(null, Forum.classesUrl + '/Tag/', {
				title: title
			}, '', function(result) {
				return result;
			}, null);
		},
		getById: function(id) {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Tag/' + id, null, '', function(result) {
				return result;
			}, null);
		},
		deleteById: function(id) {
			return Forum.Requester.deleteRequest(null, Forum.classesUrl + '/Tag/' + id, '', function(result) {
				return result;
			}, null);
		},
		getAll: function() {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Tag/', null, '', function(result) {
				return result;
			}, null);
		}
	};

	var Question = {
		create: function(title, postedByID, categoryID, questionText) {
			var dataToSave = {
				title: title,
				questionText: questionText,
				postedBy: {
					__type: 'Pointer',
					className: '_User',
					objectId: postedByID
				},
				category: {
					__type: 'Pointer',
					className: 'Category',
					objectId: categoryID
				}
			};

			return Forum.Requester.postRequest(null, Forum.classesUrl + '/Question/', dataToSave, '', function(result) {
				return result;
			}, null);
		},
		getById: function(id) {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/' + id, null, '?include=postedBy', function(result) {
				return result;
			}, null);
		},
		deleteById: function(id) {
			return Forum.Requester.deleteRequest(null, Forum.classesUrl + '/Question/' + id, '', function(result) {
				return result;
			}, null);
		},
		getAll: function() {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/', null, '?include=postedBy', function(result) {
				return result;
			}, null);
		},
        getInRange: function(skipNum, limitNum){
            var queryParams = "?skip=" + skipNum + "&limit=" + limitNum + '&include=postedBy';

            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/', null, queryParams, function(result){
                return result;
            }, null);
        },
        getCount: function(){
            var queryParams = "?count=1&limit=0";

            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/', null, queryParams, function(result){
                return result;
            }, null);
        },
        getQuestionsByCategory: function(questionId) {
            var queryParams = '?where={"category":{"__type":"Pointer","className":"Category","objectId":"' + questionId + '"}}&include=postedBy';

            return Forum.Requester.getRequest(null, Forum.classesUrl + '/Question/', null, queryParams, function(result) {
                return result;
            }, null);
        }
	};
	var Answer = {
		createByUser: function(postedByID, questionID, answerText) {
			var dataToSave = {
				answerText: questionText,
				postedBy: {
					__type: 'Pointer',
					className: '_User',
					objectId: postedByID
				},
				author: '',
				answerType: 'user',
				question: {
					__type: 'Pointer',
					className: 'Question',
					objectId: questionID
				}
			};

			return Forum.Requester.postRequest(null, Forum.classesUrl + '/Answer/', dataToSave, '', function(result) {
				return result;
			}, null);
		},
		createByGuest: function(author, questionId, answerText) {
			var dataToSave = {
				answerText: questionText,
				postedBy: null,
				author: author,
				answerType: 'guest',
				question: {
					__type: 'Pointer',
					className: 'Question',
					objectId: questionID
				}
			};

			return Forum.Requester.postRequest(null, Forum.classesUrl + '/Answer/', dataToSave, '', function(result) {
				return result;
			}, null);
		},
		getById: function(id) {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Answer/' + id, null, '', function(result) {
				return result;
			}, null);
		},
		deleteById: function(id) {
			return Forum.Requester.deleteRequest(null, Forum.classesUrl + '/Answer/' + id, '', function(result) {
				return result;
			}, null);
		},
		getAll: function() {
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Answer/', null, queryParams, function(result) {
				return result;
			}, null);
		},
		getAnswersByQuestion: function(questionId) {
			var queryParams = '?where={"question":{"__type":"Pointer","className":"Question","objectId":"' + questionId + '"}}';
			return Forum.Requester.getRequest(null, Forum.classesUrl + '/Answer/', null, queryParams, function(result) {
				return result;
			}, null);
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
				}, '', function(result) {
					window.sessionStorage.sessionToken = result.sessionToken;
				}, function(error) {
					console.log(error);
				})
			}
		},
		logOut: function() {
			if (window.sessionStorage.sessionToken) {
				return Forum.Requester.postRequest({
					'X-Parse-Session-Token': window.sessionStorage.sessionToken
				}, '/logout', null, function() {
					delete window.sessionStorage.sessionToken;
				}, null)
			} else {
				return null;
			}
		},
		signUp: function(username, password, email) {
			return Forum.Requester.postRequest(null, '/users', JSON.stringify({
				username: username,
				password: password,
				email: email
			}), '', function(result) {
				console.log(result);
				return result;				
			}, null)
		},
		updateRole : function(roleId, userId) {
			return Forum.Requester.putRequest(null, '/roles/' + roleId, JSON.stringify({ 
				"users" : {
					"__op": "AddRelation",
					"objects": [{
						"__type": "Pointer",
						"className": "_User",
						"objectId": userId
					}]
				}
			}), '', function(result) {
				console.log(result)}, null);
		},
		getUsersRole : function() { 
			return Forum.Requester.getRequest(null, '/roles', '', '?where={"name":"users"}', function() {}, null);
		},
		currentUser: function() {
			if (window.sessionStorage.sessionToken) {
				return Forum.Requester.getRequest({
					'X-Parse-Session-Token': window.sessionStorage.sessionToken
				}, '/users/me', null, '', function(result) {

				}, function(error) {
					return null;
				})
			} else {
				return null;
			}
		}
	};

	return {
		Category: Category,
		Tag: Tag,
		Question: Question,
		Answer: Answer,
		User: User
	};
})();