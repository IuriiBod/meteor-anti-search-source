Meteor.methods({
    //todo: add security check after merging with add_new_roles branch
   "updateActualSale": function (updateObj){
       ImportedActualSales.update(
           {date: TimeRangeQueryBuilder.forDay(updateObj.date), menuItemId: updateObj.menuItemId},
           updateObj,
           {upsert: true}
       );
   }
});