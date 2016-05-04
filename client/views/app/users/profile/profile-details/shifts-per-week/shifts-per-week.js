Template.profileShiftsPerWeek.helpers({
  shiftsPerWeek: function () {
    var user = this;
    var shifts = [1, 2, 3, 4, 5, 6, 7];
    var formattedShifts = [];

    shifts.forEach(function (shift) {
      var doc = {
        shift: shift
      };
      doc.selected = user && user.profile.shiftsPerWeek === shift;
      formattedShifts.push(doc);
    });
    return formattedShifts;
  }
});

Template.profileShiftsPerWeek.events({
  'change .shiftsPerWeek': function (event, tmpl) {
    var id = tmpl.data._id;
    var value = $(event.target).val();
    Meteor.call('editBasicDetails', id, {shiftsPerWeek: value}, HospoHero.handleMethodResult());
  }
});