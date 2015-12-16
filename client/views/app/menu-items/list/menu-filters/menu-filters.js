//context: category (string), status (string)
Template.menuFilters.helpers({
  categories: function () {
    var selectedCategory = this.category;

    var categories = Categories.find({
      "_id": {$ne: selectedCategory},
      "relations.areaId": HospoHero.getCurrentAreaId()
    }).fetch();

    if (selectedCategory !== "all") {
      categories.push({"name": "All", "_id": "all"});
    }

    return categories;
  },

  statuses: function () {
    var selectedStatus = this.status;
    var statuses = HospoHero.misc.getMenuItemsStatuses();

    if (selectedStatus !== 'all') {
      statuses.push('all');
    }

    return statuses;
  },

  selectedCategory: function () {
    var selectedCategoryName = Template.currentData().category;
    if (selectedCategoryName != 'all') {
      return Categories.findOne({_id: selectedCategoryName});
    } else {
      return {name: 'All', _id: 'all'};
    }
  },

  isArchived: function () {
    return this.status === 'archived';
  }
});