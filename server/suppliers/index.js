Meteor.methods({
  createSupplier: function(name, email, phone) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }
    if(!name) {
      logger.error("Name field not found");
      throw new Meteor.Error(404, "Name field not found");
    }
    var exist = Suppliers.findOne({"name": name});
    if(exist) {
      logger.error("Supplier's name should be unique");
      throw new Meteor.Error(404, "Supplier's name should be unique");
    }
    var doc = {
      "name": name,
      "email": email,
      "phone": phone,
      "createdBy": user._id,
      "createdOn": Date.now(),
      "active": true
    }
    var id = Suppliers.insert(doc);
    logger.info("New supplier inserted ", id);
    return id;
  },

  updateSupplier: function(id, info) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }
    if(!id) {
      logger.error("Id field not found");
      throw new Meteor.Error(404, "Id field not found");
    }
    var supplier = Suppliers.findOne(id);
    if(!supplier) {
      logger.error("Supplier does not exist", id);
      throw new Meteor.Error(404, "Supplier does not exist");
    }
    var updateQuery = {};
    if(info.hasOwnProperty('name')) {
      if(info.name && info.name.trim()) {
        updateQuery['name'] = info.name;
      }
    }
    if(info.hasOwnProperty('email')) {
      if(info.email && info.email.trim()) {
        updateQuery['email'] = info.email;
      }
    }
    if(info.hasOwnProperty("phone")) {
      if(info.phone && info.phone.trim()) {
        updateQuery['phone'] = info.phone;
      }
    }
    if(info.hasOwnProperty("priceList")) {
      if(info.priceList && info.priceList.trim()) {
        updateQuery['priceList'] = info.priceList;
      }
    }
    Suppliers.update({"_id": id}, {$set: updateQuery});
    logger.info("Supplier information updated", id);
    return;
  },

  activateReactivateSuppliers: function(id) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }
    if(!id) {
      logger.error("Id field not found");
      throw new Meteor.Error(404, "Id field not found");
    }
    var supplier = Suppliers.findOne(id);
    if(!supplier) {
      logger.error("Supplier does not exist", id);
      throw new Meteor.Error(404, "Supplier does not exist");
    }
    var status = supplier.active;
    if(status) {
      var ingsExist = Ingredients.findOne({"suppliers": id});
      var receipts = OrderReceipts.findOne({"supplier": id});
      var orders = StockOrders.findOne({"supplier": id});
      if(ingsExist || receipts || orders) {
        logger.error("Supplier has past records. Can't be deleted. Archiving...");
      } else {
        Suppliers.remove({"_id": id});
        logger.info("Supplier removed", id);
        return;
      }
    }
    Suppliers.update({"_id": id}, {$set: {"active": !status}});
    logger.info("Supplier status updated", id, !status);
    return;
  }
});