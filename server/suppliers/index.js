var canUserEditStocks = function() {
  var checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(null, 'edit stocks');
};

Meteor.methods({
  createSupplier: function (doc) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }

    check(doc, HospoHero.checkers.SupplierChecker);

    doc.createdBy = this.userId;
    doc.createdOn = new Date();
    doc.active = true;
    doc.relations = HospoHero.getRelationsObject();

    var id = Suppliers.insert(doc);

    logger.info("New supplier inserted ", id);
    return id;
  },

  editSupplier: function (updatedSupplier) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }

    check(updatedSupplier, HospoHero.checkers.SupplierChecker);

    Suppliers.update({'_id': updatedSupplier._id}, {$set: updatedSupplier});
    logger.info("Suppliers details updated", {"supplierId": updatedSupplier._id});
  },

  addPriceList: function (supplierId, files) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }

    check(files, HospoHero.checkers.PriceListsChecker);
    Suppliers.update({_id: supplierId}, {$push: {priceList: {$each: files}}});

    logger.info("Supplier information updated", supplierId);
  },

  activateReactivateSuppliers: function (id) {
    if (!canUserEditStocks()) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to change supplier status");
    }

    check(id, HospoHero.checkers.MongoId);

    var supplier = Suppliers.findOne(id);
    if (!supplier) {
      logger.error("Supplier does not exist", id);
      throw new Meteor.Error(404, "Supplier does not exist");
    }
    var status = supplier.active;
    if (status) {
      var ingsExist = Ingredients.findOne({suppliers: id});
      var receipts = Orders.findOne({supplierId: id});
      if (ingsExist || receipts) {
        logger.error("Supplier has past records. Can't be deleted. Archiving...");
        Suppliers.update({"_id": id}, {$set: {"active": !status}});
        logger.info("Supplier status updated", id, !status);
      } else {
        Suppliers.remove({"_id": id});
        logger.info("Supplier removed", id);
      }
    } else {
      logger.error("There are no status of supplier ", id);
      throw new Meteor.Error("There are no status of supplier ");
    }
  },

  removePriceList: function (supplierId, priceListObject) {
    check([priceListObject], HospoHero.checkers.PriceListsChecker);

    Suppliers.update({
      _id: supplierId
    }, {
      $pull: {
        priceList: {
          url: priceListObject.url
        }
      }
    });
  }
});