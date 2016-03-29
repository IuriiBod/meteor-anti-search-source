Template.timeSelectFlyout.onCreated(function () {
  this.startTime = new ReactiveVar(new Date());
  this.endTime = new ReactiveVar(moment().add(1, 'hour').toDate());
});

Template.timeSelectFlyout.helpers({
  startTime () {
    return Template.instance().startTime.get();
  },

  endTime () {
    return Template.instance().endTime.get();
  },

  timeComboEditableParams () {
    let tmpl = Template.instance();
    let start = tmpl.startTime.get();
    let end = tmpl.endTime.get();

    return {
      withoutIcon: true,
      minuteStepping: 5,
      firstTime: start,
      secondTime: end,
      onSubmit: function (startTime, endTime) {
        let applyTimeToDate = HospoHero.dateUtils.applyTimeToDate;

        tmpl.startTime.set(applyTimeToDate(start, startTime));
        tmpl.endTime.set(applyTimeToDate(end, endTime));
      }
    };
  },

  onDateChange () {
    let tmpl = Template.instance();
    let startTime = tmpl.startTime.get();
    let endTime = tmpl.endTime.get();

    return (date) => {
      let applyTimeToDate = HospoHero.dateUtils.applyTimeToDate;

      tmpl.startTime.set(applyTimeToDate(date, startTime));
      tmpl.endTime.set(applyTimeToDate(date, endTime));
    }
  }
});

Template.timeSelectFlyout.events({
  'click .create-interview': function (event, tmpl) {
    let createInterview = tmpl.data.onInterviewSubmit;

    if (_.isFunction(createInterview)) {
      createInterview(tmpl.startTime.get(), tmpl.endTime.get());
    }

    let flyout = FlyoutManager.getInstanceByElement(event.target);
    flyout.close();
  }
});