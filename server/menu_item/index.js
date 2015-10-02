Meteor.methods({
  createMenuItem: function (info) {
    if (!HospoHero.perms.canEditMenu()) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    check(info, Object);

    if (!info.name) {
      logger.error("Menu item should have a name");
      throw new Meteor.Error("Menu item should have a name");
    }
    if (!info.category) {
      logger.error("Menu item should have a category");
      throw new Meteor.Error("Menu item should have a category");
    }

    var exist = MenuItems.findOne({
      "name": info.name,
      "relations.areaId": HospoHero.getDefaultArea()
    });
    if (exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error("Duplicate entry, change name and try again");
    }

    var doc = {
      "name": info.name,
      "category": info.category,
      "instructions": info.instructions,
      "ingredients": info.ingredients,
      "jobItems": info.prepItems,
      "salesPrice": parseFloat(info.salesPrice),
      "image": info.image,
      "createdOn": Date.now(),
      "createdBy": Meteor.userId(),
      relations: HospoHero.getRelationsObject()
    };
    if (info.status) {
      doc.status = info.status
    } else {
      doc.status = "active"
    }

    var menuId = MenuItems.insert(doc);
    logger.info("Menu items added ", menuId);

    var options = {
      "type": "create",
      "title": "New Menu created"
    };
    Meteor.call("sendNotifications", menuId, "menu", options);

    return menuId;
  },

  editMenuItem: function (id, info) {
    if (!HospoHero.perms.canEditMenu()) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    HospoHero.checkMongoId(id);

    var item = MenuItems.findOne(id);
    if (!item) {
      logger.error("Menu item should exist");
      throw new Meteor.Error(404, "Menu item should exist");
    }

    var updateDoc = {};
    if (info.name) {
      if (info.name != item.name) {
        updateDoc.name = info.name;
      }
    }
    if (info.category) {
      if (info.category != item.category) {
        updateDoc.category = info.category;
      }
    }
    if (info.status) {
      if (info.status != item.status) {
        updateDoc.status = info.status;
      }
    }
    if (info.salesPrice || (info.salesPrice >= 0)) {
      if (info.salesPrice != item.salesPrice) {
        updateDoc.salesPrice = info.salesPrice;
      }
    }
    if (info.instructions) {
      if (info.instructions != item.instructions) {
        updateDoc.instructions = info.instructions;
      }
    }

    if (info.ingredients) {
      updateDoc.ingredients = [];
      if (info.ingredients.length > 0) {
        var ingIds = [];
        info.ingredients.forEach(function (item) {
          if (ingIds.indexOf(item._id) < 0) {
            ingIds.push(item._id);
            updateDoc.ingredients.push(item);
          }
        });
      }
    }
    if (info.jobItems) {
      updateDoc.jobItems = [];
      if (info.jobItems.length > 0) {
        var jobIds = [];
        info.jobItems.forEach(function (item) {
          if (jobIds.indexOf(item._id) < 0) {
            jobIds.push(item._id);
            updateDoc.jobItems.push(item);
          }
        });
      }
    }

    if (info.image || info.image == '') {
      updateDoc.image = info.image;
    }
    if (Object.keys(updateDoc).length > 0) {
      updateDoc['editedBy'] = Meteor.userId();
      updateDoc['editedOn'] = Date.now();

      console.log('UPDATE OBJ', updateDoc);

      logger.info("Menu item updated ", id);

      var menu = MenuItems.findOne(id);
      var options = {
        "type": "edit",
        "title": "Instructions on " + menu.name + " has been updated",
        "text": ""
      };
      Meteor.call("sendNotifications", menuId, "menu", options, function(err) {
        if(err) {
          HospoHero.alert(err);
        }
      });

      return MenuItems.update({"_id": id}, {$set: updateDoc});
    }
  },

  deleteMenuItem: function (id) {
    if (!HospoHero.perms.canEditMenu()) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    HospoHero.checkMongoId(id);

    var item = MenuItems.findOne(id);
    if (!item) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }
    //should not remove in case if menu item is used in a menu
    var existOnSales = Sales.findOne({"menuItem": id});
    if (existOnSales) {
      logger.error("Can't delete. Exist on sales. Archiving Menu");
      return MenuItems.update({'_id': id}, {$set: {"status": "archive"}});
    }

    logger.info("Menu item deleted", id);
    return MenuItems.remove(id);
  },

  addItemToMenu: function(menuId, itemObject) {
    if (!HospoHero.perms.canEditMenu()) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    HospoHero.checkMongoId(menuId);
    check(itemObject, Object);

    var menuItem = MenuItems.findOne(menuId);
    if (!menuItem) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }

    MenuItems.update({_id: menuId}, {$addToSet: itemObject});

    logger.info("Items updated for menu item", menuId);
    return true;
  },

  removeItemFromMenu: function (menuId, itemObject) {
    if (!HospoHero.perms.canEditMenu()) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    HospoHero.checkMongoId(menuId);
    check(itemObject, Object);

    var menuItem = MenuItems.findOne(menuId);
    if (!menuItem) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }

    logger.info("Element removed from menu item ", menuId);
    return MenuItems.update({'_id': menuId}, {$pull: itemObject});
  },

  menuItemsCount: function () {
    return MenuItems.find().count();
  },

  // TODO: Copy menu item to another area
  duplicateMenuItem: function (id) {
    if (!HospoHero.perms.canEditMenu()) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    HospoHero.checkMongoId(id);

    var exist = MenuItems.findOne(id);
    if (!exist) {
      logger.error('Menu should exist to be duplicated');
      throw new Meteor.Error(404, "Menu should exist to be duplicated");
    }
    var filter = new RegExp(exist.name, 'i');
    var count = MenuItems.find({"name": filter}).count();
    var result = delete exist['_id'];

    if (result) {
      var duplicate = exist;
      duplicate.name = exist.name + " - copy " + count;
      duplicate.createdBy = user._id;
      duplicate.createdOn = Date.now();

      var newid = MenuItems.insert(duplicate);
      logger.info("Duplicate Menu items added ", {"original": id, "duplicate": newid});
      return newid;
    }
  },

  'archiveMenuItem': function (id) {
    if (!HospoHero.perms.canEditMenu()) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    HospoHero.checkMongoId(id);

    var menu = MenuItems.findOne({_id: id});
    if (menu) {
      var status = menu.status == 'archived' ? 'active' : 'archived';
      return MenuItems.update({_id: id}, {$set: {status: status}});
    }
  }
});