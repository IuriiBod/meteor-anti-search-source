Meteor.methods({
  switchArchiveLocation: function (location) {
    if (HospoHero.isOrganizationOwner()) {
      var res = !location.archived;
      Locations.update({_id: location._id}, {$set: {archived: res}});
      var areas = Areas.find({locationId: location._id}, {fields:{_id: 1}}).fetch();
      areas = _.map(areas, function (area) {
        return area._id;
      });
      Meteor.users.update({currentAreaId: {$in: areas}}, {$unset: {currentAreaId: ''}});
    } else {
      throw new Meteor.Error("NOT ORGANIZATION OWNER");
    }
  },
  "switchArchiveArea": function (area) {
    if (HospoHero.isOrganizationOwner()) {
      var res = !area.archived;
      Areas.update({_id: area._id}, {$set: {archived: res}});
      Meteor.users.update({currentAreaId: area._id}, {$unset: {currentAreaId: ''}})
    } else {
      throw new Meteor.Error("NOT ORGANIZATION OWNER");
    }
  }
});