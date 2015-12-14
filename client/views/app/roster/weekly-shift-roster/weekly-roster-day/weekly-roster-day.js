//context: type ("template"/null), currentDate (Date)

Template.weeklyRosterDay.onCreated(function () {
  this.hasTemplateType = function () {
    return this.data.type === 'template';
  }
});

Template.weeklyRosterDay.onRendered(function () {
  if (HospoHero.canUser('edit roster', Meteor.userId())) {
    this.$(".sortable-list").sortable({
      connectWith: ".sortable-list",
      revert: true,
      stop: function (event, ui) {
        try {
          var sortedShift = new SortableHelper(ui).getSortedShift();

          if (sortedShift) {
            Meteor.call("editShift", sortedShift, HospoHero.handleMethodResult());
          }
        } catch (err) {
          //cancel drop if shift isn't valid
          $(this).sortable('cancel');

          HospoHero.error(err);
        }
      }
    });
  }
});

Template.weeklyRosterDay.helpers({
  hasTemplateType: function () {
    return Template.instance().hasTemplateType();
  },

  shifts: function () {
    var isTemplate = Template.instance().hasTemplateType();
    var shiftDate = HospoHero.dateUtils.shiftDate(this.currentDate, isTemplate);

    return Shifts.find({
      startTime: TimeRangeQueryBuilder.forDay(shiftDate),
      type: this.type,
      "relations.areaId": HospoHero.getCurrentAreaId()
    }, {
      sort: {order: 1}
    });
  },

  managerNotesCount: function () {
    return ManagerNotes.find({
      noteDate: this.currentDate,
      'relations.areaId': HospoHero.getCurrentAreaId()
    }).count();
  },
  shiftDateFormat: function (date) {
    return moment(date).format('YYYY-MM-DD');
  }
});


Template.weeklyRosterDay.events({
  'click .add-shift-button': function (event, tmpl) {
    var zeroMoment = moment(HospoHero.dateUtils.shiftDate(tmpl.data.currentDate, tmpl.hasTemplateType()));

    var startHour = new Date(zeroMoment.hours(8));
    var endHour = new Date(zeroMoment.hours(17));

    var newShiftInfo = {
      startTime: startHour,
      endTime: endHour,
      type: this.type
    };

    Meteor.call("createShift", newShiftInfo, HospoHero.handleMethodResult());
  },

  'click .manager-note-flyout': function (event, tmpl) {
    FlyoutManager.open('managerNotes', {date: tmpl.data.currentDate});
  }
});


var SortableHelper = function (ui) {
  this._draggedToDate = new Date(ui.item.parent().data('current-date'));
  this._draggedShift = _.clone(this._getDataByItem(ui.item)); //clone it just in case
  this._previousShift = this._getDataByItem(ui.item.prev());
  this._nextShift = this._getDataByItem(ui.item.next());
};


SortableHelper.prototype._getDataByItem = function (item) {
  var element = item[0];
  return element ? Blaze.getData(element) : null;
};

SortableHelper.prototype._getOrder = function () {
  var order = 0;

  if (!this._nextShift && this._previousShift) {
    order = this._previousShift.order + 1;
  } else if (!this._previousShift && this._nextShift) {
    order = this._nextShift.order - 1;
  } else if (this._nextShift && this._previousShift) {
    order = (this._nextShift.order + this._previousShift.order) / 2;
  }

  return order;
};


SortableHelper.prototype.getSortedShift = function () {
  if (this._draggedShift) {
    var shift = this._draggedShift;
    var oldStartTimeMoment = moment(shift.startTime);
    var newStartMoment = moment(this._draggedToDate);

    newStartMoment.hours(oldStartTimeMoment.hours());
    newStartMoment.minutes(oldStartTimeMoment.minutes());

    shift.order = this._getOrder();
    shift.startTime = newStartMoment.toDate();

    //apply new date to end time
    HospoHero.dateUtils.adjustShiftTime(shift, 'endTime', shift.endTime);

    check(shift, HospoHero.checkers.ShiftDocument);

    return shift;
  }
};