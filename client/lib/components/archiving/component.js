var component = FlowComponents.define("locationAreaArchiving", function () {

});

component.state.locations = function () {
  var locations = Locations.find().fetch();
  locations = _.map(locations, function (location) {
    if (!location.archived || location.archived == false) {
      location.settings = {
        panel: "primary",
        btn_class: "btn-default",
        btn_text: "archive"
      }
    } else {
      location.settings = {
        panel: "default",
        btn_class: "btn-danger",
        btn_text: "unarchive"
      }
    }
    return location;
  });

  return locations;
};