var component = FlowComponents.define('settingsMenuItem', function(props) {
  this.id = Session.get("thisMenuItem");
});

component.state.menu = function() {
  this.item = MenuItems.findOne(this.id);
  if(this.item) {
    return this.item;
  }
};

component.state.myCategory = function() {
  this.item = MenuItems.findOne(this.id);
  if(this.item) {
    var myCategory = this.item.category;
    if(myCategory) {
      return Categories.findOne(myCategory);
    }
  }
};


component.state.categoriesList = function() {
  if(this.item) {
    var myCategory = this.item.category;
    if(myCategory) {
      return Categories.find().fetch();
    }
  }
};

component.state.statusList = function() {
  if(this.item) {
    var myStatus = this.item.status;
    var list = null;
    if(myStatus) {
      return Statuses.find({
        name: { $ne: 'archived' }
      }).fetch();
    }
    return list;
  }
};

component.state.isArchived = function() {
  var menu = MenuItems.findOne(this.id);
  return menu && menu.status ? menu.status == "archived" : true;
};