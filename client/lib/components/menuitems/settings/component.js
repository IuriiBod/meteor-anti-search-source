var component = FlowComponents.define('settingsMenuItem', function(props) {
  this.id = Session.get("thisMenuItem");
});

component.state.menu = function() {
  this.item = MenuItems.findOne(this.id);
  if(this.item) {
    return this.item;
  }
}

component.state.myCategory = function(categoryId) {
  this.item = MenuItems.findOne(this.id);
  if(this.item) {
    var myCategory = this.item.category;
    if(myCategory) {
      return Categories.findOne(myCategory);
    }
  }
}


component.state.categoriesList = function() {
  if(this.item) {
    var myCategory = this.item.category;
    if(myCategory) {
      return Categories.find().fetch();
    }
  }
}

component.state.statusList = function() {
  if(this.item) {
    var myStatus = this.item.status;
    var list = null;
    if(myStatus) {
      list = Statuses.find().fetch();
    }
    return list;
  }
}

component.state.isArchived = function() {
  var menu = MenuItems.findOne(this.id);
  if(menu.status == "archived") {
    return true;
  } else {
    return false;
  }
}