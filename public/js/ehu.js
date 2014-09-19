var app = angular.module('ehu', ['elasticsearch']);

/* Configs */
var indexName = "entity";
var docType = "profile";
var maxResultsSize = 10;

app.value('HOST', 'ehu-gewu.rhcloud.com');
app.value('PORT', 80);

app.factory('EsClient', function (esFactory, HOST, PORT) {
  return esFactory({
    host: HOST + ':' + PORT,
  });
});

app.factory('Search', function($http) {
    function search(q) {
      var promise = $http({method: 'POST', url: '/', params: {'q': q}});
      return promise.error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.error(data);
      }).then(function(response) {
        return response.data;
      });
    }
    return search;
});

app.controller('SearchCtrl', function($scope, $location, Search) {
    $scope.results = [];
    $scope.q = $location.search().q || '';
    
    $scope.search = function() {
        Search($scope.q).then(function(results) {
            $scope.results = results.hits || [];
        });
        $location.search('q', $scope.q);
    }
});