Template.rosteredShiftItem.onCreated(function () {
  this.set('shift', this.data.shift);
})

Template.rosteredShiftItem.helpers({
  item: function() {
    return Template.instance().get('shift');
  },
  section: function() {
    var shift = Template.instance().get("shift");
    if (shift && shift.section) {
      var section = Sections.findOne(shift.section);
      if (section) {
        return section.name;
      }
    }
  }
});