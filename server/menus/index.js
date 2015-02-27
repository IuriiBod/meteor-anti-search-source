Meteor.methods({
  createMenuItem: function(info) {
    if(!info.name) {
      logger.error("Menu item should have a name");
      throw new Meteor.Error(404, "Menu item should have a name");
    }
    var id = info.name.trim().toLowerCase().replace(/ /g, "");
    var doc = {
      "_id": id,
      "name": info.name,
      "tag": info.tag,
      "prepItems": info.prepItems,
      "shelfLife": info.shelfLife,
      "instructions": info.instructions,
      "ingredients": info.ingredients,
      "salesPrice": info.salesPrice
    };
    var exist = MenuItems.findOne(id);
    if(exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change name and try again");
    }
    // if(!info.tag) {
    //   logger.error("Menu item should have a tag");
    //   throw new Meteor.Error(404, "Menu item should have a tag");
    // }
    var id = MenuItems.insert(doc);
    logger.info("Menu items added ", id);
    return id;
  },

  editMenuItem: function(id, info) {
    if(!id) {
      logger.error("Menu item should provide a id");
      throw new Meteor.Error(404, "Menu item should provide a id");
    }
    var item = MenuItems.findOne(id);
    if(!item) {
      logger.error("Menu item should exist");
      throw new Meteor.Error(404, "Menu item should exist");
    }
    if(Object.keys(info).length < 0) {
      logger.error("Menu item should provide fields to be updated");
      throw new Meteor.Error(404, "Menu item should provide fields to be updated");
    }
    var updateDoc = {};
    if(info.name) {
      if(info.name != item.name) {
        updateDoc.name = info.name;
      }
    }
    if(info.shelfLife) {
      if(info.shelfLife != item.shelfLife) {
        updateDoc.shelfLife = info.shelfLife;
      }
    }
    MenuItems.update({"_id": id}, {$set: updateDoc});
    logger.info("Menu item updated ", id);
    return;
  },

  deleteMenuItem: function(id) {
    if(!id) {
      logger.error("Menu item should provide a id");
      throw new Meteor.Error(404, "Menu item should provide a id");
    }
    var result = MenuItems.update({"_id": id}, {$set: {"status": false}});
    return result;
  }
});