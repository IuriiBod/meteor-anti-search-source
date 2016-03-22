Template.weekSelector.onCreated(function () {
  this.selectedWeek = new ReactiveVar();
  this.showCopyShiftsAlert = (warningMessage, onPromptResult) => {
    let options = {
      title: 'Warning',
      text: `${warningMessage}\nDo you want to remove shifts for this week and copy it from template?`,
      type: "warning",
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      closeOnConfirm: false,
      closeOnCancel: false
    };
    let handleResult = (isConfirmed) => {
      onPromptResult(isConfirmed);
    };
    return sweetAlert(options, handleResult);
  };

  this.closeModalAndShowMsg = (modalInstance, resType, msg) => {
    modalInstance.close();
    HospoHero[resType](msg);
  };
});

Template.weekSelector.onRendered(function () {
  this.$('.i-checks').iCheck({
    radioClass: 'iradio_square-green'
  });
});

Template.weekSelector.helpers({
  futureWeeks: function () {
    var currentMoment = moment().startOf('week');
    var weeks = [];

    for (var i = 0; i < 6; i++) {
      weeks.push(
        moment(currentMoment).toDate()
      );
      currentMoment.add(1, 'week');
    }
    return weeks;
  },

  weekFormat: function (date) {
    return moment(date).week();
  },
  dateFormat: function (date) {
    return moment(date).format("dddd, Do of MMMM YYYY");
  }
});

Template.weekSelector.events({
  'click .saveShifts': function (event, tmpl) {
    event.preventDefault();

    let selectedDayOfWeek = tmpl.selectedWeek.get();

    if (selectedDayOfWeek) {
      let weekSelectorModal = ModalManager.getInstanceByElement(event.target);
      Meteor.call('copyShiftsFromTemplate', selectedDayOfWeek, (error) => {
        if (error) {
          tmpl.showCopyShiftsAlert(error.reason, (isConfirmed) => {
            Meteor.call('copyShiftsFromTemplate', selectedDayOfWeek, isConfirmed, (err) => {
              if (err) {
                tmpl.closeModalAndShowMsg(weekSelectorModal, 'error', err);
              } else {
                tmpl.closeModalAndShowMsg(weekSelectorModal, 'success', 'Template was copied to the selected week');
              }
            });
          });
        } else {
          tmpl.closeModalAndShowMsg(weekSelectorModal, 'success', 'Template was copied to the selected week');
        }
      });
    } else {
      HospoHero.error('You should select week at first');
    }
  },

  'ifChecked [name=week-radio]': function (event, tmpl) {
    tmpl.selectedWeek.set(event.target.value);
  }
});