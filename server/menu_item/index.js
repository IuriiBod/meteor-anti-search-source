Meteor.methods({
  createMenuItem: function (info) {
    if (!HospoHero.canUser('edit menu', Meteor.userId())) {
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
      "relations.areaId": HospoHero.getCurrentAreaId()
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
      type: 'menu',
      actionType: 'create',
      title: doc.name + ' menu created',
      ref: menuId
    };
    HospoHero.sendNotification(options);
    return menuId;
  },

  editMenuItem: function (id, info) {
    if (!HospoHero.canUser('edit menu', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    check(id, HospoHero.checkers.MongoId);

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

      logger.info("Menu item updated ", id);

      var menu = MenuItems.findOne(id);
      var options = {
        title: 'Instructions on ' + menu.name + ' has been updated',
        type: 'menu',
        ref: id
      };
      HospoHero.sendNotification(options);

      return MenuItems.update({"_id": id}, {$set: updateDoc});
    }
  },

  deleteMenuItem: function (id) {
    if (!HospoHero.canUser('edit menu', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    check(id, HospoHero.checkers.MongoId);

    var item = MenuItems.findOne(id);
    if (!item) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }

    logger.info("Menu item deleted", id);
    MenuItems.remove(id);

    var options = {
      type: 'menu',
      actionType: 'delete',
      title: 'Menu ' + item.name + ' has been deleted',
      ref: id
    };
    HospoHero.sendNotification(options);
  },

  addItemToMenu: function(menuId, itemObject) {
    if (!HospoHero.canUser('edit menu', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    check(menuId, HospoHero.checkers.MongoId);
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
    if (!HospoHero.canUser('edit menu', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    check(menuId, HospoHero.checkers.MongoId);
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

  duplicateMenuItem: function (menuItemId, areaId) {
    if (!HospoHero.canUser('edit menu', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    check(menuItemId, HospoHero.checkers.MongoId);
    check(areaId, HospoHero.checkers.MongoId);

    if(!Areas.findOne(areaId)) {
      logger.error("Area not found!");
      throw new Meteor.Error("Area not found!");
    }

    var menuItem = MenuItems.findOne({ _id: menuItemId });
    menuItem = HospoHero.misc.omitAndExtend(menuItem, ['_id', 'relations'], areaId);

    menuItem.jobItems = HospoHero.misc.itemsMapperWithCallback(menuItem.jobItems, function(item) {
      return Meteor.call('duplicateJobItem', item._id, areaId, item.quantity);
    });

    menuItem.ingredients = HospoHero.misc.itemsMapperWithCallback(menuItem.ingredients, function (item) {
      return Meteor.call('duplicateIngredient', item._id, areaId, item.quantity);
    });

    menuItem.name = HospoHero.misc.copyingItemName(menuItem.name, MenuItems, areaId);
    menuItem.category = duplicateMenuCategory(menuItem.category, areaId);

    var newId = MenuItems.insert(menuItem);

    logger.info("Duplicate Menu items added ", {"original": menuItemId, "duplicate": newId});
  },

  'archiveMenuItem': function (id) {
    if (!HospoHero.canUser('edit menu', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    check(id, HospoHero.checkers.MongoId);

    var menu = MenuItems.findOne({_id: id});
    if (menu) {
      var status = menu.status == 'archived' ? 'active' : 'archived';
      MenuItems.update({_id: id}, {$set: {status: status}});
      return status;
    }
  },

  'editMenuIngredientsOrJobItems': function(menuItemId, itemProps, type){
    var items = MenuItems.findOne({_id: menuItemId})[type];

    _.each(items, function (item, index) {
      if(item._id == itemProps._id){
        items[index].quantity = itemProps.quantity;
      }
    });

    var query ={};
    query[type] = items;
    MenuItems.update({_id: menuItemId}, {$set: query});
  },

  'updateMenuItemRevelName': function (menuItemId, newRevelName) {
    Meteor.call('editMenuItem', menuItemId, {name: newRevelName});
  }
});

var duplicateMenuCategory = function(menuCategoryId, areaId) {
  var category = Categories.findOne({ _id: menuCategoryId });
  if(category.relations.areaId != areaId) {
    var existsCategory = Categories.findOne({'relations.areaId': areaId, name: category.name});
    if (existsCategory) {
      menuCategoryId = existsCategory._id;
    } else {
      category = HospoHero.misc.omitAndExtend(category, ['_id', 'relations'], areaId);
      menuCategoryId = Categories.insert(category);
    }
  }
  return menuCategoryId;
};