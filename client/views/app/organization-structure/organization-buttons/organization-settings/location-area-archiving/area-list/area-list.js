Template.areaList.helpers({
  areas: function () {
    var locationId = this.locationId;
    return Areas.find({locationId: locationId});
  }
});

