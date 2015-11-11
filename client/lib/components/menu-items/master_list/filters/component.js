var component = FlowComponents.define('menuFilters', function(props) {});

component.state.categories = function() {
  var selected = Session.get("category");
  if(selected != "all") {
    var categories = Categories.find({
      "_id": {$nin: [selected]},
      "relations.areaId": HospoHero.getCurrentAreaId()
    }).fetch();
    categories.push({"name": "All", "_id": "all"});
    return categories;
  } else {
    return Categories.find({
      "relations.areaId": HospoHero.getCurrentAreaId()
    }).fetch();
  }
};

component.state.statuses = function() {
  var selected = Session.get("status");
  if(selected != "all") {
    var statuses = Statuses.find({"name": {$nin: [selected, "archived"]}}).fetch();
    statuses.push({"name": "all", "_id": "all"});
    return statuses;
  } else {
    return Statuses.find({"name": {$ne: "archived"}}).fetch();
  }
};

component.state.selectedCategory = function() {
  var selected = Session.get("category");
  if(selected != "all") {
    return Categories.findOne(selected);
  } else {
    return {"name": "All", "_id": "all"};
  }
};

component.state.selectedStatus = function() {
  var selected = Session.get("status");
  if(selected != "all") {
    return Statuses.findOne({"name": selected});
  } else {
    return {"name": "All", "_id": "all"};
  }
};