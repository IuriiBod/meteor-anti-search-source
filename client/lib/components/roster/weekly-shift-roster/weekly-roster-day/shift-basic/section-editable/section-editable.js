Template.shiftBasicSectionEditable.onRendered(function () {
  this.$('.section').editable(createSectionToAssignEditableConfig(this));
});

var sectionSourceAssignMixin = function (editableConfig, templateInstance) {
  var sourceFn = function () {
    var sections = Sections.find({
      "relations.areaId": HospoHero.getCurrentAreaId()
    }).fetch();
    var sectionsObj = [];
    sectionsObj.push({value: "Open", text: "Open"});
    sections.forEach(function (section) {
      sectionsObj.push({"value": section._id, "text": section.name});
    });
    return sectionsObj;
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

  sectionSourceAssignMixin(editableConfig, templateInstance);

  return editableConfig;
};