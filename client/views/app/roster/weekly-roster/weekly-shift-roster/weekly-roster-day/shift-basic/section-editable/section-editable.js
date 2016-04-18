Template.shiftBasicSectionEditable.helpers({
  sectionSelectConfig(){
    let tmpl = Template.instance();

    let sourceFn = function () {
      var sections = Sections.find({
        'relations.areaId': HospoHero.getCurrentAreaId()
      }).fetch();

      return sections.map(function (section) {
        return {value: section._id, text: section.name};
      });
    };

    let onSectionChange = function (newSection) {
      let shift = Shifts.findOne({_id: tmpl.data._id});
      shift.section = newSection;
      Meteor.call('editShift', shift, Template.shiftBasic.errorHandlerForShiftEdit(shift));
    };

    return {
      values: sourceFn(),
      emptyValue: 'Open',
      selected: this.section,
      onValueChanged: onSectionChange
    };
  }
});