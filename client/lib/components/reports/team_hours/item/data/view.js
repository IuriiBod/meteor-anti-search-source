Template.reportData.events({
  "mouseenter .editShiftStart": function (event) {
    event.preventDefault();

    var createOnSuccessForProperty = function (propertyName) {
      return function (response, newValue) {
        var self = this;
        var id = $(self).data("shift");

        var shift = Shifts.findOne({_id: id});
        if (shift) {
          shift[propertyName] = newValue;
          HospoHero.dateUtils.adjustShiftTimes(shift);

          Meteor.call("editShift", shift, HospoHero.handleMethodResult(function () {
            $(self).removeClass('editable-unsaved');
          }));
        }
      };
    };


    $('.editShiftStart').editable({
      type: 'combodate',
      title: 'Select time',
      template: "h:mm A",
      viewformat: "h:mm A",
      format: "YYYY-MM-DD h:mm A",
      display: true,
      autotext: 'auto',
      showbuttons: true,
      mode: 'inline',
      success: createOnSuccessForProperty('startedAt')
    });

    $('.editShiftEnd').editable({
      type: 'combodate',
      title: 'Select time',
      template: "h:mm A",
      viewformat: "h:mm A",
      format: "YYYY-MM-DD h:mm A",
      display: false,
      autotext: 'auto',
      showbuttons: true,
      combodate: {
        minuteStep: 5
      },
      mode: 'inline',
      success: createOnSuccessForProperty('finishedAt')
    });
  }
});