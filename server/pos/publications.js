Meteor.publish('posMenuItems', function () {
  if(this.userId){
    var relationsObj = HospoHero.getRelationsObject(HospoHero.getCurrentAreaId(this.userId));
    return PosMenuItems.find({'relations.locationId':relationsObj.locationId});
  }
});