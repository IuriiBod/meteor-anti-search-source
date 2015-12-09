Template.rosteredShiftItem.helpers({
  item: function() {
    return Template.instance().data.shift;
  },
  section: function() {
    var shift = Template.instance().data.shift;
    if (shift && shift.section) {
      var section = Sections.findOne(shift.section);
      if (section) {
        return section.name;
      }
    }
  }
});