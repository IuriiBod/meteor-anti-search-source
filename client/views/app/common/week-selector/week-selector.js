Template.weekSelector.onCreated(function () {
  this.sweetAlertOptions = (warnMsg) => {
    return {
      title: 'Warning',
      text: `${warnMsg}\nDo you want to remove shifts for this week and copy it from template?`,
      type: "warning",
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      closeOnConfirm: false,
      closeOnCancel: false
    };
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

    let selectedDayOfWeek = tmpl.get('selectedWeek');

    if (selectedDayOfWeek) {
      let weekSelectorModal = ModalManager.getInstanceByElement(event.target);
      Meteor.call('copyShiftsFromTemplate', selectedDayOfWeek, (error) => {
        if (error) {
          return sweetAlert(tmpl.sweetAlertOptions(error.reason), (isConfirmed) => {
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
    tmpl.set('selectedWeek', event.target.value);
  }
});