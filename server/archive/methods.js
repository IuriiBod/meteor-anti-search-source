Meteor.methods({
  switchArchiveLocation: function(location){
    if(HospoHero.isOrganizationOwner()){
      var res = !location.archived;
      Locations.update({_id: location._id}, {$set:{archived: res}});
      var areas = Areas.find({locationId: location._id}).fetch();
      _.each(areas, function (area) {
        Meteor.call("switchArchiveArea", area, res);
      });
    }else{
      throw new Meteor.Error("NOT ORGANIZATION OWNER");
    }
  },
  switchArchiveArea: function(area, toSet){
    if(HospoHero.isOrganizationOwner()){
      var canArchive = !Locations.findOne({_id: area.locationId}).archived;
      if(typeof(toSet)==="undefined" && canArchive){
        var res = !area.archived;
        Areas.update({_id: area._id}, {$set:{archived: res}});
      }else if(typeof(toSet) === "boolean"){
        Areas.update({_id: area._id}, {$set:{archived: toSet}});
      }else{
        throw new Meteor.Error("Failed to switch area archive");
      }
      Meteor.users.update({currentAreaId: area._id}, {$unset: {currentAreaId: ''}})
    }
  }
});