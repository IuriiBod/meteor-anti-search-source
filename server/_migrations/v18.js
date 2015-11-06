Migrations.add({
  version: 18,
  name: "revelName -> posNames",
  up: function () {
    var menuItemsToChange = MenuItems.find({revelName: {$ne: undefined}}).fetch();
    _.each(menuItemsToChange, function (item) {
      MenuItems.update({_id:item._id}, {$set:{posNames:[item.revelName]}, $unset:{revelName:1}});
    })
  }
});