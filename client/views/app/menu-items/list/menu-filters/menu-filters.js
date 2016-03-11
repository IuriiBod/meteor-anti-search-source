//context: category (string), status (string)
Template.menuFilters.helpers({
  categories: function () {
    var selectedCategoryId = this.category;

    var categories = Categories.find({
      _id: {$ne: selectedCategoryId},
      'relations.areaId': HospoHero.getCurrentAreaId()
    }).fetch();

    if (selectedCategoryId !== 'all') {
      categories.push({name: 'All', _id: 'all'});
    }

    return categories;
  },

  statuses: function () {
    var selectedStatus = this.status;
    var statuses = HospoHero.misc.getMenuItemsStatuses(true);

    if (selectedStatus !== 'all') {
      statuses.push('all');
    }

    return statuses;
  },

  selectedCategory: function () {
    var selectedCategoryId = this.category;
    if (selectedCategoryId !== 'all') {
      return Categories.findOne({_id: selectedCategoryId});
    } else {
      return {name: 'All', _id: 'all'};
    }
  },

  isArchived: function () {
    return this.status === 'archived';
  }
});