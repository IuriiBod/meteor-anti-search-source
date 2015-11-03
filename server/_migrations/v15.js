Migrations.add({
  version: 15,
  name: "Fixing user relations",
  up: function () {
    Meteor.users.update({"relations.areaIds": null, username:{$ne:"admin"}},{$set:{"relations.areaIds":[], "relations.locationIds":[]}},{multi: true});
  }
});