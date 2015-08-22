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
    }
    var id = Suppliers.insert(doc);
    logger.info("New supplier inserted ", id);
    return id;
  },

});