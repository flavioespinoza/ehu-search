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

app.factory('Search', function(EsClient) {
    function search(q) {
      var promise = EsClient.search({
                "index": indexName,
                "type": docType,
                "body": {
                    "size": maxResultsSize,
                    "query": {
                        "match": {
                            "_all": q
                        }
                    }
                }
            });
      return promise.catch(function(err) {
        console.error(err);
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