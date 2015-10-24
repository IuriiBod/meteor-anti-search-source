Template.shiftBasicSectionEditable.onRendered(function () {
  this.$('.section').editable(createSectionToAssignEditableConfig(this.data));
});

var sectionSourceAssignMixin = function (editableConfig, shift) {
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


var createSectionToAssignEditableConfig = function (shift) {
  var onSuccess = function (response, newSection) {
    newSection = newSection === "Open" ? null : newSection;

    var obj = {"_id": shift._id, "section": newSection};
    var shift = Shifts.findOne(shiftId);
  };

  var editableConfig = {
    type: "select",
    title: "Select section to assign",
    inputclass: "editableWidth",
    showbuttons: false,
    emptytext: 'Open',
    defaultValue: "Open",
    success: onSuccess
  };

  sectionSourceAssignMixin(editableConfig, shift);

  return editableConfig;
};