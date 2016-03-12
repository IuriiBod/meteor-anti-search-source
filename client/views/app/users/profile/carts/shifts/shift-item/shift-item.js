Template.rosteredShiftItem.helpers({
  item: function() {
    return this.shift;
  },
  section: function() {
    if (this.shift && this.shift.section) {
      var section = Sections.findOne(this.shift.section);
      if (section) {
        return section.name;
      }
    }
  }
});