Namespace('HospoHero', {
  sendNotification: function (notification) {
    if (!notification.title) {
      throw new Meteor.Error('Notification must have a title');
    }

    var notificationOptions = {
      to: [],
      type: '',
      read: false,
      createtedBy: null,
      ref: '',
      text: '',
      createdOn: Date.now()
    };

    _.extend(notificationOptions, notification);

    if (!notificationOptions.createdBy) {
      notificationOptions.createdBy = Meteor.userId() || null;
    }

    var sendNotificationToId = [];
    sendNotificationToId = sendNotificationToId.concat(notificationOptions.to);

    if (notificationOptions.type == 'menu' || notificationOptions.type == 'job') {
      var subscriptionsQuery = {
        type: notificationOptions.type,
        'relations.areaId': HospoHero.getCurrentAreaId()
      };

      if (notificationOptions.ref == '') {
        subscriptionsQuery.itemIds = 'all';
      } else {
        subscriptionsQuery.$or = [
          {itemIds: notificationOptions.ref},
          {itemIds: 'all'}
        ];
      }

      var subscriberIds = Subscriptions.find(subscriptionsQuery).map(function (subscription) {
        return subscription.subscriber;
      });

      sendNotificationToId = sendNotificationToId.concat(subscriberIds);
    }

    var userIdIndex = sendNotificationToId.indexOf(notificationOptions.createtedBy);
    if (userIdIndex > -1) {
      sendNotificationToId.splice(userIdIndex, 1);
    }

    if (sendNotificationToId.length) {
      sendNotificationToId.forEach(function (to) {
        notificationOptions.to = to;
        Notifications.insert(notificationOptions);
      });
    }
  },

  duplicateMenuItem: function(menuItemId, areaId) {
    var menuItem = MenuItems.findOne({ _id: menuItemId });
    menuItem = omitAndExtend(menuItem, ['_id', 'relations'], areaId);

    menuItem.jobItems = itemsMapperWithCallback(menuItem.jobItems, function(item) {
      return HospoHero.duplicateJobItem(item._id, areaId, item.quantity);
    });

    menuItem.name = copyingItemName(menuItem.name, MenuItems, areaId);
    menuItem.category = duplicateMenuCategory(menuItem.category, areaId);

    return MenuItems.insert(menuItem);
  },

  duplicateJobItem: function (jobItemId, areaId, quantity) {
    var jobItem = JobItems.findOne({ _id: jobItemId });

    if(!quantity || jobItem.relations.areaId != areaId) {
      jobItem = omitAndExtend(jobItem, ['_id', 'editedOn', 'editedBy', 'relations'], areaId);

      jobItem.ingredients = itemsMapperWithCallback(jobItem.ingredients, function(item) {
        return duplicateIngredient(item._id, areaId, item.quantity);
      });

      jobItem.name = copyingItemName(jobItem.name, JobItems, areaId);
      jobItemId = JobItems.insert(jobItem);
    }
    return quantity === false ? jobItemId : { _id: jobItemId, quantity: quantity };
  }
});

var omitAndExtend = function(item, blackListFields, areaId) {
  var defaultItemObject = {
    createdBy: Meteor.userId(),
    createdOn: Date.now(),
    relations: HospoHero.getRelationsObject(areaId)
  };
  item = _.omit(item, blackListFields);
  return _.extend(item, defaultItemObject);
};

var copyingItemName = function (oldName, collection, areaId) {
  // Add slashes before special characters (+, ., \)
  var filteredName = oldName.replace(/([\+\\\.\?])/g, '\\$1');
  var filter = new RegExp(filteredName, 'i');
  var count = collection.find({ name: filter, 'relations.areaId': areaId }).count();
  oldName += count > 0 ? ' - copy ' + count : '';
  return oldName;
};

var duplicateIngredient = function(ingredientId, areaId, quantity) {
  var ingredient = Ingredients.findOne({ _id: ingredientId });

  if(ingredient.relations.areaId != areaId) {
    ingredient = omitAndExtend(ingredient, ['_id', 'relations', 'specialAreas', 'generalAreas'], areaId);

    if(ingredient.suppliers) {
      ingredient.suppliers = duplicateSupplier(ingredient.suppliers, areaId);
    }
    ingredientId = Ingredients.insert(ingredient);
  }

  return quantity === false ? ingredientId : { _id: ingredientId, quantity: quantity };
};

var duplicateSupplier = function(supplierId, areaId) {
  var supplier = Suppliers.findOne({ _id: supplierId });
  if(supplier.relations.areaId != areaId) {
    supplier = omitAndExtend(supplier, ['_id', 'relations'], areaId);
    supplierId = Suppliers.insert(supplier);
  }
  return supplierId;
};

var duplicateMenuCategory = function(menuCategoryId, areaId) {
  var category = Categories.findOne({ _id: menuCategoryId });
  if(category.relations.areaId != areaId) {
    category = omitAndExtend(category, ['_id', 'relations'], areaId);
    menuCategoryId = Categories.insert(category);
  }
  return menuCategoryId;
};

var itemsMapperWithCallback = function(items, callback) {
  if(items && items.length) {
    items = _.map(items, callback);
  } else {
    items = [];
  }
  return items;
};