Meteor.methods({
  "updateActualSale": function (updateObj) {
    var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);

    if (!haveAccess) {
      throw new Meteor.Error(403, 'Access Denied');
    }

    var weekRange = TimeRangeQueryBuilder.forDay(updateObj.date);



    ImportedActualSales.update(
      {
        date: weekRange,
        menuItemId: updateObj.menuItemId
      },
      updateObj,
      {upsert: true}
    );
  }
});