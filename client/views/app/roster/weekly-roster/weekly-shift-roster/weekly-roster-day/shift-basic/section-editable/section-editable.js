Template.shiftBasicSectionEditable.onRendered(function () {
  this.$('.section').editable(createSectionToAssignEditableConfig(this.data._id));
});

Template.shiftBasicSectionEditable.helpers({
  sectionName: function (sectionId) {
    if (sectionId !== "Open") {
      var section = Sections.findOne({_id: sectionId});
      return section && section.name;
    } else {
      return sectionId;
    }
  }
});

var onEditError = function (shift) {
  return function (err) {
    if (err) {
      if (err.reason === 'User not trained for this section') {
        return sweetAlert({
          title: 'Error!',
          text: `${err.reason}\nDo you want to mark user as trained for this section?`,
          type: "error",
          showCancelButton: true,
          cancelButtonText: 'No',
          confirmButtonText: 'Yes',
          closeOnConfirm: true
        }, () => {
          Meteor.call(
            'toggleUserTrainingSection',
            shift.assignedTo,
            shift.section,
            true,
            HospoHero.handleMethodResult()
          );

          Meteor.call('editShift', shift, HospoHero.handleMethodResult());
        });
      } else {
        HospoHero.error(err);
      }
    }
  };
};

var sectionSourceAssignMixin = function (editableConfig) {
  var sourceFn = function () {
    var sections = Sections.find({
      "relations.areaId": HospoHero.getCurrentAreaId()
    }).fetch();

    return sections.map(function (section) {
      return {"value": section._id, "text": section.name};
    });
  };

  return _.extend(editableConfig, {source: sourceFn});
};


var createSectionToAssignEditableConfig = function (shiftId) {
  var onSuccess = function (response, newSection) {
    var shift = Shifts.findOne({_id: shiftId});
    newSection = newSection === "Open" ? null : newSection;

    shift.section = newSection;
    Meteor.call('editShift', shift, onEditError(shift));
  };

  var editableConfig = {
    type: "select",
    title: "Select section to assign",
    prepend: [{value: "Open", text: "Open"}],
    inputclass: "editableWidth",
    showbuttons: false,
    emptytext: 'Open',
    defaultValue: "Open",
    //block internal x-editable displaying because we are using blaze for it
    display: function () {
      return '';
    },
    success: onSuccess
  };

  sectionSourceAssignMixin(editableConfig);

  return editableConfig;
};