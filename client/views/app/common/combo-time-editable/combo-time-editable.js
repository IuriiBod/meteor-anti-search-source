Template.comboTimeEditable.onCreated(function () {
  var self = this;

  self.isEditMode = new ReactiveVar(false);

  self.exitFromEditMode = function () {
    self.isEditMode.set(false);
  };

  self.isTimeRangeMode = function () {
    return !!self.data.params.secondTime;
  };

  let checkTimeRange = function (firstTime, secondTime) {
    return moment(secondTime).isAfter(firstTime);
  };

  self.submitTime = function () {
    let firstTime = self.getTimeFromCombodate('first-time');
    let secondTime = self.isTimeRangeMode() ? self.getTimeFromCombodate('second-time') : null;

    if (secondTime && !self.data.params.ignoreDateRangeCheck) {
      let isRangeValid = checkTimeRange(firstTime, secondTime);
      if (!isRangeValid) {
        HospoHero.error('Start time should be less than end time!');
        return;
      }
    }

    if (firstTime) {
      self.data.params.onSubmit(firstTime, secondTime);
      self.exitFromEditMode();
    }
  };

  self.getTimeFromCombodate = function (selector) {
    let tmplParams = self.data.params;
    let $combodate = self.$(`.${selector}`);

    let date = tmplParams.date ? tmplParams.date : selector === 'first-time' ? tmplParams.firstTime : tmplParams.secondTime;

    let hours = $combodate.find('.hours').val();
    let minutes = $combodate.find('.minutes').val();
    let ampm = $combodate.find('.ampm').val();

    return new Date(moment(date).format('YYYY.MM.DD ') + hours + ':' + minutes + ' ' + ampm);
  };
});

Template.comboTimeEditable.helpers({
  isEditMode: function () {
    return Template.instance().isEditMode.get();
  },
  isTimeRangeMode: function () {
    return Template.instance().isTimeRangeMode();
  },
  minuteStepping: function () {
    return this.params.minuteStepping || 1;
  },
  firstTime: function () {
    return getCurrentTime(this.params.firstTime,this.params.considerLocationTime);
  },
  secondTime: function () {
    return getCurrentTime(this.params.secondTime,this.params.considerLocationTime);
  },
  icon: function () {
    return this.params.icon || 'fa-clock-o';
  }
});

Template.comboTimeEditable.events({
  'click .time': function (e, tmpl) {
    tmpl.isEditMode.set(true);
  },
  'click .change-time-button': function (e, tmpl) {
    e.preventDefault();

    tmpl.submitTime();
  },
  'click .cancel-button': function (e, tmpl) {
    tmpl.exitFromEditMode();
  }
});

function  getCurrentTime(dete,considerLocationTime){
  if(_.isDate(dete)){
    if(considerLocationTime ){
      return HospoHero.dateUtils.getDateMomentForLocation(dete).format('h:mm a')
    }else {
      return  HospoHero.dateUtils.timeFormat(dete);
    }
  }
  return dete;
}