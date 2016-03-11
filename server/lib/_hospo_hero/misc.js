Namespace('HospoHero.misc', {
  omitAndExtend: function (item, blackListFields, areaId) {
    var defaultItemObject = {
      createdBy: Meteor.userId(),
      createdOn: new Date(),
      relations: HospoHero.getRelationsObject(areaId)
    };
    item = _.omit(item, blackListFields);
    return _.extend(item, defaultItemObject);
  },

  copyingItemName: function (oldName, collection, areaId) {
    // Add slashes before special characters (+, ., \)
    var filteredName = oldName.replace(/([\+\\\.\?])/g, '\\$1');
    var filter = new RegExp(filteredName, 'i');
    var count = collection.find({name: filter, 'relations.areaId': areaId}).count();
    oldName += count > 0 ? ' - copy ' + count : '';
    return oldName;
  },

  itemsMapperWithCallback: function (items, callback) {
    if (items && items.length) {
      items = _.map(items, callback);
    } else {
      items = [];
    }
    return items;
  }
});