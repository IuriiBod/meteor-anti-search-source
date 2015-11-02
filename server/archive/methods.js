Meteor.methods({
  switchArchiveLocation: function(location){
    if(HospoHero.isOrganizationOwner()){
      var res = !location.archived;
      Locations.update({_id: location._id}, {$set:{archived: res}});
      var areas = Areas.find({locationId: location._id}).fetch();
      areas = _.map(areas, function (area) {
        return area._id;
      });
      Meteor.users.update({currentAreaId: {$in: areas}}, {$unset: {currentAreaId: ''}});
    }else{
      throw new Meteor.Error("NOT ORGANIZATION OWNER");
    }
  },
  "switchArchiveArea": function(area, archiveStatus){
    if(HospoHero.isOrganizationOwner()){
      if(typeof(archiveStatus)==="undefined"){
        var res = !area.archived;
        Areas.update({_id: area._id}, {$set:{archived: res}});
      }else if(typeof(archiveStatus) === "boolean"){
        Areas.update({_id: area._id}, {$set:{archived: archiveStatus}});
      }else{
        throw new Meteor.Error("Failed to switch area archive");
      }
      Meteor.users.update({currentAreaId: area._id}, {$unset: {currentAreaId: ''}})
    }
  }
});