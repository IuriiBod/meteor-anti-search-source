Meteor.methods({
    createSupplier: function (doc) {
        if (!HospoHero.canUser('edit stocks', this.userId)) {
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
        if (!HospoHero.canUser('edit stocks', Meteor.userId())) {
            logger.error("User not permitted to create ingredients");
            throw new Meteor.Error(403, "User not permitted to create ingredients");
        }

        check(updatedSupplier, HospoHero.checkers.SupplierChecker);

        Suppliers.update({'_id': updatedSupplier._id}, {$set: updatedSupplier});
        logger.info("Suppliers details updated", {"supplierId": updatedSupplier._id});
    },

    updateSupplier: function (id, info) {
        if (!HospoHero.canUser('edit stocks', Meteor.userId())) {
            logger.error("User not permitted to create ingredients");
            throw new Meteor.Error(403, "User not permitted to create ingredients");
        }

        check(id, HospoHero.checkers.MongoId);

        if (!Suppliers.findOne(id)) {
            logger.error("Supplier does not exist", id);
            throw new Meteor.Error(404, "Supplier does not exist");
        }
        var updateQuery = {};
        if (info.hasOwnProperty('name')) {
            if (info.name && info.name.trim()) {
                updateQuery['name'] = info.name;
            }
        }
        if (info.hasOwnProperty('email')) {
            if (info.email && info.email.trim()) {
                updateQuery['email'] = info.email;
            }
        }
        if (info.hasOwnProperty("phone")) {
            if (info.phone && info.phone.trim()) {
                updateQuery['phone'] = info.phone;
            }
        }
        if (info.hasOwnProperty("priceList")) {
            if (info.priceList && info.priceList.trim()) {
                updateQuery['priceList'] = info.priceList;
            }
        }
        Suppliers.update({"_id": id}, {$set: updateQuery});
        logger.info("Supplier information updated", id);
    },

    activateReactivateSuppliers: function (id) {
        if (!HospoHero.canUser('edit stocks', Meteor.userId())) {
            logger.error("User not permitted to create ingredients");
            throw new Meteor.Error(403, "User not permitted to create ingredients");
        }

        check(id, HospoHero.checkers.MongoId);

        var supplier = Suppliers.findOne(id);
        if (!supplier) {
            logger.error("Supplier does not exist", id);
            throw new Meteor.Error(404, "Supplier does not exist");
        }
        var status = supplier.active;
        if (status) {
            var ingsExist = Ingredients.findOne({"suppliers": id});
            var receipts = OrderReceipts.findOne({"supplier": id});
            var orders = StockOrders.findOne({"supplier": id});
            if (ingsExist || receipts || orders) {
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
    }
});