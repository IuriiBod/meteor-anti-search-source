Meteor.startup(function () {
  var insertDefaultData = function (collection, data) {
    if (!collection.findOne()) {
      data.forEach(function (dataEntry) {
        collection.insert({"name": dataEntry});
      });
    }
  };

  var defaultDataMap = [
    {
      collection: JobTypes,
      data: ['Prep', 'Recurring']
    },
    {
      collection: Categories,
      data: ['Main Menu', 'Kids Menu']
    },
    {
      collection: Statuses,
      data: ['active', 'ideas', 'archived']
    },
    {
      collection: Sections,
      data: ["Kitchen hand", "Larder", "Hot section", "Baking", "Pass"]
    }
  ];

  defaultDataMap.forEach(function (defaultDataEntry) {
    insertDefaultData(defaultDataEntry.collection, defaultDataEntry.data);
  });
});
