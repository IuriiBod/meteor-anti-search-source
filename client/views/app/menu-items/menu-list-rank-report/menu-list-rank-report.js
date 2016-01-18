Template.menuListRankReport.helpers({
  menuItems: function() {
    var items = MenuItems.find({}, {sort: {rank: 1}}).fetch();
    _.map(items, function(item) {
      if (!item.rank) {
        item.rank = 0;
      }
    });

    return items;
  }
});