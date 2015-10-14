var component = FlowComponents.define("areaList", function (props) {
  this.locationId = props.locationId;
});

component.state.areas = function () {
  var areas = Areas.find({locationId: this.locationId}).fetch();
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
};

