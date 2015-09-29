Meteor.methods({
  'createSalesMenus': function(date) {
    if(!HospoHero.perms.canViewForecast()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }
    if(!date) {
      logger.error("Date field does not exist");
      throw new Meteor.Error("Date field does not exist");
    }
    var existingMenuItems = MenuItems.find({
      "status": "active",
      "relations.areaId": HospoHero.getDefaultArea()
    }).fetch();
    existingMenuItems.forEach(function(menuItem) {
      var exist = Sales.findOne({"menuItem": menuItem._id, "date": new Date(date)});
      if(!exist) {
        var doc = {
          "date": new Date(date),
          "menuItem": menuItem._id,
          "quantity": 0,
          "soldAtPrice": menuItem.salesPrice,
          "createdOn": new Date(),
          "createdBy": this.userId,
          relations: HospoHero.getDefaultArea()
        };
        var id = Sales.insert(doc);
        logger.info("New sales entry created", {"id": id});
      }
    });
  },

  'editSalesMenuQuantity': function(id, menuId, quantity) {
    this.unblock();
    if(!HospoHero.perms.canViewForecast()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }
    if(!Sales.findOne({"_id": id, "menuItem": menuId})) {
      logger.error("Sales Menu does not exist");
      throw new Meteor.Error("Sales Menu does not exist");
    }
    quantity = parseInt(quantity);
    if(!quantity || quantity < 0) {
      quantity = 0;
    }
    logger.info("Sales entry updated", {"id": id});
    return Sales.update({"_id": id}, {$set: {"quantity": quantity}});
  },

  'deleteSalesMenu': function(id) {
    if(!HospoHero.perms.canViewForecast()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }

    HospoHero.checkMongoId(id);

    var salesMenu = Sales.findOne(id);
    if(!salesMenu) {
      logger.error('Sales Menu does not exist');
      throw new Meteor.Error("Sales Menu does not exist");
    }
    Sales.remove({"_id": id});
    logger.info("Sales entry deleted ", {"id": id});
  }
});