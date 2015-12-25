Meteor.methods({
  togglePosNameToMenuItem: function (menuItemId, posMenuItemNameOrId, action) {
    if (!HospoHero.canUser('edit menus', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }
    check(menuItemId, HospoHero.checkers.MongoId);

    var query = {
      $set: {
        isNotSyncedWithPos: true
      }
    };

    if (action === 'add') {
      var posItem = PosMenuItems.findOne({_id: posMenuItemNameOrId});
      query.$addToSet = {posNames: posItem.name};
      query.$set.salesPrice = posItem.price;
    } else {
      query.$pull = {posNames: posMenuItemNameOrId};
    }

    MenuItems.update({_id: menuItemId}, query);
  },

  createMenuItem: function (menuItem) {
    if (!HospoHero.canUser('edit menus', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    check(menuItem, HospoHero.checkers.MenuItemDocument);

    var menuItemInfo = {
      createdOn: Date.now(),
      createdBy: Meteor.userId()
    };

    menuItem = _.extend(menuItem, menuItemInfo);

    var menuId = MenuItems.insert(menuItem);
    logger.info("Menu items added ", menuId);

    var notificationSender = new NotificationSender(
      'Menu item created',
      'menu-item-created',
      {
        itemName: doc.name,
        username: HospoHero.username(Meteor.userId()),
        linkToItem: Router.url('menuItemDetail', {_id: menuId})
      }
    );

    var subscriberIds = HospoHero.databaseUtils.getSubscriberIds('menu');
    subscriberIds.forEach(function (subscription) {
      if (subscription.subscriber != Meteor.userId()) {
        notificationSender.sendNotification(subscription.subscriber);
      }
    });
    return menuId;
  },

  editMenuItem: function (menuItem) {
    if (!HospoHero.canUser('edit menus', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }

    check(menuItem, HospoHero.checkers.MenuItemDocument);

    var id = menuItem._id;

    var notificationSender = new NotificationSender(
      'Menu item updated',
      'menu-item-updated',
      {
        itemName: menuItem.name,
        username: HospoHero.username(Meteor.userId()),
        linkToItem: Router.url('menuItemDetail', {_id: id})
      }
    );

    var subscriberIds = HospoHero.databaseUtils.getSubscriberIds('menu', id);
    subscriberIds.forEach(function (subscription) {
      if (subscription.subscriber != Meteor.userId()) {
        notificationSender.sendNotification(subscription.subscriber);
      }
    });

    logger.info("Menu item updated ", id);
    return MenuItems.update({"_id": id}, {$set: menuItem});
  },

  deleteMenuItem: function (menuItem) {
    if (!HospoHero.canUser('edit menus', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }
    check(menuItem, HospoHero.checkers.MenuItemDocument);

    var notificationSender = new NotificationSender(
      'Menu item deleted',
      'menu-item-deleted',
      {
        itemName: menuItem.name,
        username: HospoHero.username(Meteor.userId())
      }
    );

    var subscriberIds = HospoHero.databaseUtils.getSubscriberIds('menu', menuItem._id);
    subscriberIds.forEach(function (subscription) {
      if (subscription.subscriber != Meteor.userId()) {
        notificationSender.sendNotification(subscription.subscriber);
      }
      subscription.itemIds = menuItem._id;
      Meteor.call('subscribe', subscription, true);
    });

    logger.info("Menu item deleted", menuItem._id);
    MenuItems.remove({_id: menuItem._id});
  },

  editItemOfMenu: function (menuId, itemObject, action, type) {
    if (!HospoHero.canUser('edit menus', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }
    check(menuId, HospoHero.checkers.MongoId);

    var query = {};
    if (action === 'add') {
      query.$addToSet = itemObject;
    } else if (action === 'remove') {
      query.$pull = itemObject;
    } else if (action === 'updateQuantity') {
      var items = MenuItems.findOne({_id: menuId})[type];

      query.$set = {};
      query.$set[type] = _.map(items, function(item) {
        return item._id === itemObject._id ? itemObject : item;
      });
    } else {
    }
    MenuItems.update({_id: menuId}, query);
  },

  duplicateMenuItem: function (menuItem, areaId) {
    if (!HospoHero.canUser('edit menus', Meteor.userId())) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }
    check(menuItem, HospoHero.checkers.MenuItemDocument);
    check(areaId, HospoHero.checkers.MongoId);

    if (!Areas.findOne(areaId)) {
      logger.error("Area not found!");
      throw new Meteor.Error("Area not found!");
    }

    menuItem = HospoHero.misc.omitAndExtend(menuItem, ['_id', 'relations'], areaId);

    menuItem.jobItems = HospoHero.misc.itemsMapperWithCallback(menuItem.jobItems, function (item) {
      return Meteor.call('duplicateJobItem', item._id, areaId, item.quantity);
    });

    menuItem.ingredients = HospoHero.misc.itemsMapperWithCallback(menuItem.ingredients, function (item) {
      return Meteor.call('duplicateIngredient', item._id, areaId, item.quantity);
    });

    menuItem.name = HospoHero.misc.copyingItemName(menuItem.name, MenuItems, areaId);
    menuItem.category = duplicateMenuCategory(menuItem.category, areaId);

    var newId = MenuItems.insert(menuItem);
    logger.info("Duplicate Menu items added ", {"original": menuItem._id, "duplicate": newId});
  }
});

var duplicateMenuCategory = function (menuCategoryId, areaId) {
  var category = Categories.findOne({_id: menuCategoryId});
  if (category.relations.areaId != areaId) {
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