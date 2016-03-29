Template.weeklyRosterTemplateMainView.helpers({
  subtitle() {
    let shift = Shifts.findOne();
    let location = shift && Locations.findOne({_id: shift.relations.locationId});
    return location && `timezone: ${location.timezone}`;
  }
});