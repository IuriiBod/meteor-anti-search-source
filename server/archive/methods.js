const checkOrganizationOwnerByDocument = function (document, userId) {
  let permissionChecker = new HospoHero.security.PermissionChecker(userId);
  return permissionChecker.isOrganizationOwner(document.organizationId);
};


Meteor.methods({
  switchArchiveLocation: function (locationId) {
    check(locationId, HospoHero.checkers.MongoId);

    let location = Locations.findOne({_id: locationId});

    if (!checkOrganizationOwnerByDocument(location, this.userId)) {
      throw new Meteor.Error("Access denied");
    }

    var newStatus = !location.archived;
    Locations.update({_id: location._id}, {$set: {archived: newStatus}});

    let relatedAreasIds = Areas.find({locationId: location._id}, {fields: {_id: 1}}).map(function (area) {
      return area._id;
    });

    Meteor.users.update({currentAreaId: {$in: relatedAreasIds}}, {$unset: {currentAreaId: ''}});
  },


  switchArchiveArea: function (areaId) {
    check(areaId, HospoHero.checkers.MongoId);

    let area = Areas.findOne({_id: areaId});

    if (checkOrganizationOwnerByDocument(area, this.userId)) {
      throw new Meteor.Error("Access denied");
    }

    var newStatus = !area.archived;
    Areas.update({_id: area._id}, {$set: {archived: newStatus}});
    Meteor.users.update({currentAreaId: area._id}, {$unset: {currentAreaId: ''}});
  }
});