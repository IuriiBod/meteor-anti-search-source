var subs = new SubsManager();

var component = FlowComponents.define('settingsMenuItem', function(props) {
  this.id = Router.current().params._id;
  this.onRendered(this.onMenuRendered);
});

component.state.initialHTML = function() {
  var id = Session.get("thisMenuItem");
  var item = MenuItems.findOne(id);
  if(item) {
    if(item.instructions) {
      return item.instructions;
    } else {
      return "Add instructions here"
    }
  }
};

component.prototype.onMenuRendered = function() {
  this.item = MenuItems.findOne(this.id);
}

component.state.menu = function() {
  this.item = MenuItems.findOne(this.id);
  if(this.item) {
    return this.item;
  }
}

component.state.myCategory = function(categoryId) {
  this.item = MenuItems.findOne(this.id);
  var myCategory = this.item.category;
  if(myCategory) {
    return Categories.findOne(myCategory);
  }
}


component.state.categoriesList = function() {
  var myCategory = this.item.category;
  if(myCategory) {
    return Categories.find().fetch();
  }
}

component.state.statusList = function() {
  var myStatus = this.item.status;
  var list = null;
  if(myStatus) {
    list = Statuses.find().fetch();
  }
  return list;
}

component.state.isArchived = function() {
  var menu = MenuItems.findOne(this.id);
  if(menu.status == "archived") {
    return true;
  } else {
    return false;
  }
}