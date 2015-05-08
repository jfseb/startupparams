(function(){ 
var app = angular.module('startupdefaultsedit', [ 'ngRoute' ], ['$routeProvider', '$locationProvider', 
	function(routeProvider, locationProvider ) {
		
	}

]);



 app.controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
 })
 
function getFileSync(sFn) {
var http = new XMLHttpRequest();
http.open("GET",sFn,false);
 http.send();
	return  JSON.parse(http.responseText);
}

var records = getFileSync("/db");

app.controller('StaticData', function($scope) {
	 this.records = records; 
	 $scope.sortType     = 'name'; // set the default sort type
     $scope.sortReverse  = false;  // set the default sort order
     $scope.searchFilter   = '';     // set the default search/filter term
  
});

})();

