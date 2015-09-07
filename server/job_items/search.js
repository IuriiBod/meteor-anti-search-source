SearchSource.defineSource('jobItemsSearch', function(searchText, options) {
  var optionFileds = {sort: {'name': 1}};
  var docs = [];
  var selector = {};
  if(options) {
    if(options.endingAt) {
      selector['$or'] = [
        {'name': {$gt: options.endingAt}},
        {'name': {$lte: options.endingAt}}
      ]
    }
    if(options.limit) {
      optionFileds['limit'] = options.limit;
    }
    if(options.ids) {
      selector['_id'] = {$nin: options.ids}
    }
    if(options.type) {
      var type = JobTypes.findOne({"name": options.type});
      if(type) {
        selector["type"] = type._id;
      }
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
      {'name': regExp}
    ];
    docs = JobItems.find(selector, optionFileds).fetch();
  } else {
    docs = JobItems.find(selector, optionFileds).fetch();
  }
  return docs;
});

function buildRegExp(searchText) {
  return new RegExp(searchText, 'i');
}
