Meteor.methods({
  "updateActualSale": function (updateObj) {
    var haveAccess = HospoHero.perms.canUser('viewForecast')(this.userId);
    if (!haveAccess) {
      throw new Meteor.Error(403, 'Access Denied');
    }

    ImportedActualSales.update(
      {
        date: TimeRangeQueryBuilder.forDay(updateObj.date),
        menuItemId: updateObj.menuItemId
      },
      updateObj,
      {upsert: true}
    );
  }
});