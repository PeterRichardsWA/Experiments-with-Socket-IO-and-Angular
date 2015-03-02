// require express
var express = require("express.io");
// path module -- try to figure out where and why we use this
var path = require("path");
var bodyParser = require('body-parser');
var http = require('http');
var io = require('socket.io')
var bodyParser = require("body-parser"); // just in case

// create the express app
var myApp = express();

server = http.createServer(myApp);
io = io.listen(server)
// socket io
server.listen(8000);

// require bodyParser since we need to handle post data for adding a user
myApp.use(bodyParser.urlencoded({ extended: true })); // stops deprication error as exended is false by default in new ver

// 
// ************************************************************************
//
// real routing with angular
// build module. myApp should be same for all references.
var myApp = angular.module('myChat', ['ngRoute']);

 //  use the config method to set up routing:
myApp.config(function ($routeProvider) {
  $routeProvider

    .when('/',{
        templateUrl: 'login'
    })

    .when('/chatroom',{
        templateUrl: 'chatroom'
    })

    .otherwise({
        redirectTo: '/'
    });
});
//


// *************************************************************************

// static content - ALL files not in views go here.
myApp.use(express.static(path.join(__dirname, "./static"))); // all static content
myApp.use(express.static(path.join(__dirname, "./scripts"))); // javascript and externals for out of area stuff.

// setting up ejs and our views folder
myApp.set('views', path.join(__dirname, './views')); // all views
myApp.set('view engine', 'ejs');

// root route to render the index.ejs view
myApp.get('/', function(req, res) {
	res.render("index");
})


// ******************************************************************
console.log('listening on port 8000');
// *******************************************************************



//
// **********************************************************************
//
// a factory is nothing more than a function that returns an object literal
myApp.factory('chatsFactory', function () {

	var chats = $scope.chats;

	io.sockets.on('connection', function(socket) {
		console.log('****** SOCKET LISTENER STARTED ******');
		console.log('* socket: '+socket.id);
		console.log('*************************************');

		// socket code here.
		io.sockets.on('connection', function(socket) {
			io.emit('my_emit_event', {response: 'Welcome to the chat room!'});

		});

		// If you don't know where this code is supposed to go reread the above info 
		socket.on('button_clicked', function (data) {
	    console.log('Someone clicked a button!  Reason: ' + data.reason);
	    socket.emit('server_response', {response: 'Here we go!'});
		
		});
	});

    var factory = {};

    factory.getChats = function(callback) {
        callback(chats);
	}

	// most important step: return the object so it can be used by the rest of our angular code
	//console.log(factory);
	return factory;
});



//
// **********************************************************************

//  Controller for chat
myApp.controller('chatController', ['$scope', '$route', '$rootScope', chatFactory function($scope, $route, $rootScope, chatFactory) {

	$scope.chats = []; // make sure customers blank

	chatFactory.getChats(function(data) {
		$scope.chats = data;

	}); // load current set of customers

	$rootScope.addChat = function() { // add new customer to list
		var d = new Date();
        $scope.newChat.createdDate = d.getTime();
        $scope.chat.push($scope.newChat);
		$scope.newChat = {};
	}
	// not used for now.
    $scope.removeChat = function(customer) {
        $scope.chat.splice($scope.chat.indexOf(chat),1);
    }
});
