
/*
 * GET home page.
 */

exports.index = function(req, res){
  var hotArray = [];
  getHots().then(function(body) {
    hotArray = body.hits.hits;
    res.locals({ 'hots': hotArray });
    res.render('index');
  }).catch(function(error) {
    res.status(500).end();
  });
};

exports.search = function(req, res) {
  var q = req.query.q;
  var result = search(q);
  result.then(function(body) {
    var hits = body.hits;
    res.json(hits);
  }).catch(function(error) {
    console.trace(error.message);
    res.status(500).end();
  });
};

var elasticsearch = require('elasticsearch');
var host = 'ehu-gewu.rhcloud.com';
var client = new elasticsearch.Client({
  host: host,
  log: 'trace'
  });

function search(q) {
  return client.search({
    body: {
      "query": {
        'match': { '_all': q }
      }
    }}); // a promise
}

// returns hot searched entities.
function getHots() {
  return client.search({
    index: 'entity',
    type: 'profile',
    body: {
      "query": {
      "match_all": {}
      }
    }
  });
}