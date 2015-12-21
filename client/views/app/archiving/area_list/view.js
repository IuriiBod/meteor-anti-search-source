Template.areaList.helpers({
  areas: function () {
    var locationId = Template.instance().data.locationId;
    return Areas.find({locationId: locationId})
  }
});

