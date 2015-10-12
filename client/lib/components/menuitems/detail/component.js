var component = FlowComponents.define('menuItemDetail', function(props) {
  LocalMenuIngsAndPreps.remove({});
  var id = Session.get("thisMenuItem");
  this.id = id;
  Meteor.subscribe("menuItem", this.id);
  var menu = MenuItems.findOne(this.id);
  if(menu) {
    var prepIds = [];
    if(menu.jobItems.length > 0) {
      menu.jobItems.forEach(function(prep) {
        var doc = prep;
        doc['type'] = "prep";
        doc['menu'] = id;
        LocalMenuIngsAndPreps.insert(doc);
      });
    }
    if(menu.ingredients.length > 0) {
      menu.ingredients.forEach(function(ings) {
        var doc = ings;
        doc['type'] = "ings";
        doc['menu'] = id;
        LocalMenuIngsAndPreps.insert(doc);
      });
    }
  }
  this.onRendered(this.onViewRendered);
});

component.state.menu = function() {
  this.menu = MenuItems.findOne(this.id);
  if(this.menu) {
    return this.menu;
  }
};

component.state.jobItems = function() {
  return LocalMenuIngsAndPreps.find({"type": "prep", "menu": this.id});
};

component.state.ings = function() {
  return LocalMenuIngsAndPreps.find({"type": "ings", "menu": this.id});
};

component.prototype.onViewRendered = function() {
  this.menu = MenuItems.findOne(this.id);
  var ings = this.menu.ingredients;
  var ids = [];
  if(ings.length > 0) {
    ings.forEach(function(ing) {
      if(ids.indexOf(ings._id) < 0) {
        ids.push(ing._id);
      }
    });
  }
  if(ids.length > 0) {
    Meteor.subscribe("ingredients", ids);
  }
  Session.set("goBackMenu", null);
};