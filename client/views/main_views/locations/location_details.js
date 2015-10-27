Template.locationDetails.helpers({
  'locationName': function() {
    var loc = Locations.findOne();
    return loc.name;
  }
});