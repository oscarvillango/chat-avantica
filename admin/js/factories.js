'use strict';
angular.module("chatAvanticaAdmin")
	.factory("firebaseFactory", ["$firebaseArray", "$firebaseObject",function(a, o){

		var firebaseFactory = {};

		firebaseFactory.refBase = new Firebase("https://avantica-chat-test.firebaseio.com");

		firebaseFactory.getChatsRef = function(){
			return firebaseFactory.refBase.child("chats");
		}

		firebaseFactory.getMessagesRef = function(){
			return firebaseFactory.refBase.child("mensages");
		}

		firebaseFactory.getUsersRef = function(){
			return firebaseFactory.refBase.child("users");
		}

		firebaseFactory.getChatArray = function(){
			var chatRef = firebaseFactory.getChatsRef();

			return a(chatRef);
		}

		firebaseFactory.getMessagesArray = function(){
			var messageRef = firebaseFactory.getMessagesRef();

			return a(messageRef);
		}

		firebaseFactory.getUsersArray = function(){
			var usersRef = firebaseFactory.getUsersRef();

			return a(usersRef);
		}

		firebaseFactory.getChatObject = function(pChatRef, newChild){

			pChatRef = pChatRef || firebaseFactory.getChatsRef();
			newChild = newChild || "";


			if("" != newChild){
				var chatRef = pChatRef.child(newChild);
			}else{
				var chatRef = pChatRef;
			}

			return o(chatRef);
		}

		firebaseFactory.getMessagesObject = function(messRef, newChild){

			messRef = messRef || firebaseFactory.getMessagesRef();
			newChild = newChild || "";

			if("" != newChild){
				var messageRef = messRef.child(newChild);
			}else{
				var messageRef = messRef;
			}

			return o(messageRef);
		}

		firebaseFactory.getUsersObject = function(pUserRef, newChild){

			pUserRef = pUserRef || firebaseFactory.getUsersRef();
			newChild = newChild || "";

			if("" != newChild){
				var usersRef = pUserRef.child(newChild);
			}else{
				var usersRef = pUserRef;
			}

			return o(usersRef);
		}

		return firebaseFactory;
	}]);