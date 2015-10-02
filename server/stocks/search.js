SearchSource.defineSource('ingredients', function(searchText, options) {
  var optionFileds = {sort: {'code': 1}};
  var selector = {
    "relations.areaId": HospoHero.getCurrentAreaId()
  };
  if(options) {
    if(options.endingAt) {
      selector['$or'] = [
        {'code': {$gt: options.endingAt}},
        {'code': {$lte: options.endingAt}}
      ]
    }
    if(options.limit) {
      optionFileds['limit'] = options.limit;
    }
    if(options.ids) {
      selector['_id'] = {$nin: options.ids}
    }
    if(options.status) {
      selector['status'] = options.status;
    }
  } else {
    optionFileds['limit'] = 10;
  }
  if(searchText) {
    var regExp = buildRegExp(searchText);
    selector['$or'] = [
      {'code': regExp},
      {'suppliers': regExp},
      {'description': regExp}
    ];
  }
  return Ingredients.find(selector, optionFileds).fetch();
});

function buildRegExp(searchText) {
  return new RegExp(searchText, 'i');
}
