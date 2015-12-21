Template.areaList.helpers({
  areas: function () {
    var locationId = Template.instance().data.locationId;
    var areas = Areas.find({locationId: locationId}).fetch();
    areas = _.map(areas, function (area) {
      if (!area.archived || area.archived == false) {
        area.settings = {
          text_class: "text-success",
          btn_class: "btn-default",
          btn_text: "archive"
        }
      } else {
        area.settings = {
          text_class: "text-muted",
          btn_class: "btn-danger",
          btn_text: "unarchive"
        }
      }
      return area;
    });
    return areas;
  }
});

