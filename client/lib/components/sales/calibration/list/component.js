var component = FlowComponents.define("salesCalibratedList", function(props) {  
  this.renderCaliberatedList();
});

component.state.dateRange = function() {
  var range = this.get("range");
  if(range) {
    return range;
  } else {
    return 0;
  }
};

component.state.totalRevenue = function() {
  var revenue = this.get("revenue");
  if(revenue) {
    return revenue;
  } else {
    return 0;
  }
};

component.state.itemsList = function() {
  var list = this.get("list");
  if(list) {
    return list;
  }
};

component.prototype.renderCaliberatedList = function() {
  var list = SalesCalibration.findOne();
  var category = Session.get("category");
  var menuItems;
  var items = [];
  
  if(list) {
    var ids = [];
    var menus = {};
    
    list.menus.forEach(function(item, key) {
      ids[key] = item._id;
      menus[item._id] = item.qty;
    });

    if (!category || category === "all") {
      menuItems = MenuItems.find({_id: {$in: ids}}).fetch();
    } else {
      menuItems = MenuItems.find({_id: {$in: ids}, category: category}).fetch();
    }
    
    if(menuItems.length > 0) {
      menuItems.forEach(function(item) {
        var obj = {
          "_id": item._id,
          "qty": menus[item._id]
        }
        items.push(obj);
      });
    }
    
    this.set("list", items);
    this.set("range", list.range);
    this.set("revenue", list.revenue);
  } else {    
    if (!category || category === "all") {
      menuItems = MenuItems.find({"status": "active"}).fetch();
    } else {
      menuItems = MenuItems.find({"status": "active", category: category}).fetch();
    }   
    
    if(menuItems.length > 0) {
      menuItems.forEach(function(item) {
        var obj = {
          "_id": item._id,
          "qty": 0
        };
        items.push(obj);
      });
    }
    this.set("list", items);
    this.set("range", 0);
    this.set("revenue", 0);
  }
};

component.action.keyup = function(value) {
  this.set("range", value);
};

