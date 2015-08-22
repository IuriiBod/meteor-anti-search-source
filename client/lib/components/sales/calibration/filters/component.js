var component = FlowComponents.define('salesCalibratedFilters', function(props) {
});

component.state.categories = function() {
  var selected = Session.get("category");
  if(selected != "all") {
    var categories = Categories.find({"_id": {$nin: [selected]}}).fetch();
    categories.push({"name": "All", "_id": "all"});
    return categories;
  } else {
    return Categories.find().fetch();
  }
}

component.state.selectedCategory = function() {
  var selected = Session.get("category");
  if(selected != "all") {
    return Categories.findOne(selected);
  } else {
    return {"name": "All", "_id": "all"};
  }
}