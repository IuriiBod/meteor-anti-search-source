let SORTABLE_SCREEN_WIDTH = 1200; //lg screen size

//context: type ("template"/null), currentDate (Date), shiftBuffer (ReactiveVar), onCopyShift (function)
Template.weeklyRosterDay.onCreated(function () {
  this.subscribe('managerNote', this.data.currentDate, HospoHero.getCurrentAreaId());
  this.hasTemplateType = function () {
    return this.data.type === 'template';
  };

  this.hasCopiedShift = function () {
    return this.data.shiftBuffer;
  };

  this.onCopyShift = this.data.onCopyShift;
});

Template.weeklyRosterDay.onRendered(function () {
  var checker = new HospoHero.security.PermissionChecker();

  if (checker.hasPermissionInArea(null, `edit roster`) && document.body.scrollWidth >= SORTABLE_SCREEN_WIDTH) {
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
    let currentArea = HospoHero.getCurrentArea(Meteor.userId());
    let location = currentArea && Locations.findOne({_id: currentArea.locationId});

    return location && Shifts.find({
        startTime: TimeRangeQueryBuilder.forDay(getDateString(this.currentDate), location._id,'YYYY-MM-DD'),
        type: this.type,
        "relations.areaId": currentArea._id
      }, {
        sort: {order: 1}
      });
  },

  managerNotesCount: function () {
    return ManagerNotes.find({
      text: {$exists: true},
      noteDate: this.currentDate,
      'relations.areaId': HospoHero.getCurrentAreaId()
    }).count();
  },
  shiftDateFormat: function (date) {
    return HospoHero.dateUtils.shortDateFormat(moment(date));
  },

  hasCopiedShift: function () {
    return Template.instance().hasCopiedShift();
  },

  onCopyShift: function () {
    return Template.instance().onCopyShift;
  }

});


Template.weeklyRosterDay.events({
  'click .add-shift-button': function (event, tmpl) {

    //copy currentDate and convert to moment
    var zeroMoment =HospoHero.dateUtils.getDateMomentForLocation(getDateString(tmpl.data.currentDate));

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
  },

  'click .paste-shift-button': function (event, tmpl) {

    //copy currentDate and convert to moment
    let zeroMoment = HospoHero.dateUtils.getDateMomentForLocation(getDateString(tmpl.data.currentDate));

    let pastedShift = tmpl.data.shiftBuffer;

    let newShiftDuration = HospoHero.dateUtils.updateTimeInterval(
      zeroMoment, pastedShift.startTime, pastedShift.endTime
    );

    pastedShift.startTime = newShiftDuration.start;
    pastedShift.endTime = newShiftDuration.end;

    Meteor.call("createShift", pastedShift, HospoHero.handleMethodResult());
  }
});

function getDateString (date){
  // need string format to get correct time range in all time zone
  return  moment(date).format('YYYY-MM-DD');
}


class SortableHelper {
  constructor(ui) {
    this._draggedToDate = ui.item.parent().data('current-date');
    this._draggedShift = _.clone(this._getDataByItem(ui.item)); //clone it just in case
    this._previousShift = this._getDataByItem(ui.item.prev());
    this._nextShift = this._getDataByItem(ui.item.next());
  }

  _getDataByItem(item) {
    var element = item[0];
    return element ? Blaze.getData(element) : null;
  }

  _getOrder() {
    var order = 0;

    if (!this._nextShift && this._previousShift) {
      order = this._previousShift.order + 1;
    } else if (!this._previousShift && this._nextShift) {
      order = this._nextShift.order - 1;
    } else if (this._nextShift && this._previousShift) {
      order = (this._nextShift.order + this._previousShift.order) / 2;
    }

    return order;
  }


  getSortedShift() {
    if (this._draggedShift) {
      var shift = this._draggedShift;
      var newShiftDate = _.isDate(this._draggedToDate) ? this._draggedToDate : new Date(this._draggedToDate);

      let newShiftDuration = HospoHero.dateUtils.updateTimeInterval(
        newShiftDate, shift.startTime, shift.endTime
      );

      shift.startTime = newShiftDuration.start;
      shift.endTime = newShiftDuration.end;

      shift.order = this._getOrder();

      check(shift, HospoHero.checkers.ShiftDocument);

      return shift;
    }
  }
}