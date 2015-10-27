Template.shiftBasicSectionEditable.onRendered(function () {
  this.$('.section').editable(createSectionToAssignEditableConfig(this));
});

var sectionSourceAssignMixin = function (editableConfig) {
  var sourceFn = function () {
    var sections = Sections.find({
      "relations.areaId": HospoHero.getCurrentAreaId()
    }).fetch();

    var sectionOptions = sections.map(function (section) {
      return {"value": section._id, "text": section.name};
    });

    sectionOptions.push({value: "Open", text: "Open"});
    
    return sectionOptions;
  };

  return _.extend(editableConfig, {source: sourceFn});
};


var createSectionToAssignEditableConfig = function (templateInstance) {
  var onSuccess = function (response, newSection) {
    var shift = templateInstance.data;
    newSection = newSection === "Open" ? null : newSection;

    shift.section = newSection;
    Meteor.call('editShift', shift, HospoHero.handleMethodResult());
  };

  var shift = templateInstance.data;
  var editableConfig = {
    type: "select",
    title: "Select section to assign",
    inputclass: "editableWidth",
    showbuttons: false,
    emptytext: 'Open',
    defaultValue: "Open",
    value: shift.section,
    success: onSuccess
  };

  sectionSourceAssignMixin(editableConfig);

  return editableConfig;
};