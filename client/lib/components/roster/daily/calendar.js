var Calendar = function (tpl, options) {
  this.tpl = tpl;
  this.$calendar = tpl.$("#calendar");
  this.options = options || {};
};


Calendar.prototype.convertDate = function (date) {
  date = moment(date);
  var hours = date.get('hour');
  var minutes = date.get('minute');
  var seconds = date.get('second');
  date = [seconds, minutes, hours];
  date = _.map(date, function (val, key) {
    return val * Math.pow(60, key);
  });
  date = _.reduce(date, function (memo, val) {
    return memo + val;
  });
  return date;
};


Calendar.prototype.assignJob = function (job, shift, startAt) {
  Meteor.call("assignJob", job, shift, startAt, function (err) {
    if (err) {
      console.log(err);
    } else {
      $(this).remove();
    }
  })
};


Calendar.prototype.destroy = function () {
  if (this.$calendar) {
    this.$calendar.fullCalendar('destroy');
  }
};


Calendar.prototype.getShifts = function () {
  var shifts = Shifts.find({
    shiftDate: new Date(this.options.shiftDate).getTime()
  }, {
    sort: {
      startTime: 1
    }
  });
  this.options.shifts = shifts.fetch();
};


Calendar.prototype._getEventsFromShift = function (shift) {
  var self = this;
  var shifts = self.options.shifts;
  var index = (shifts.indexOf(shift) - 4) * self.options.oneDay;
  ShiftsToTime[shift._id] = index;
  TimeToShifts['' + index] = shift._id;

  var thisDate = new Date(index);
  var thisDay = thisDate.getDate();
  var thisMonth = thisDate.getMonth();
  var thisYear = thisDate.getFullYear();

  self.options.businessStartsAt = parseInt(
    moment(shift.startTime).format("HH")
  );
  self.options.businessEndsAt = parseInt(
    moment(shift.endTime).format("HH")
  );

  _.each(shift.jobs, function (job) {
    var hourFix = 0;
    var minFix = 0;
    var jobDoc = Jobs.findOne(job);
    if (!jobDoc) {
      return;
    }
    var activeTimeInMiliSecs = jobDoc.activeTime * 1000;
    var activeHours = moment.duration(activeTimeInMiliSecs).hours();
    var activeMins = moment.duration(activeTimeInMiliSecs).minutes();
    if (jobDoc.startAt) {
      hourFix = moment(jobDoc.startAt).format("HH");
      minFix = moment(jobDoc.startAt).format("mm");
    }
    var start = new Date(thisYear, thisMonth, thisDay, hourFix, minFix);
    start = moment(start);
    if (activeHours > 0) {
      hourFix = parseInt(hourFix) + activeHours;
    }
    if (activeMins > 0) {
      minFix = parseInt(activeMins);
    }
    var end = new Date(thisYear, thisMonth, thisDay, hourFix, minFix);
    end = moment(end).format();
    var eventObj = {
      title: jobDoc.name,
      id: jobDoc._id,
      shift: shift._id,
      start: start,
      end: end
    };
    self.options.events.push(eventObj);
  });
};


Calendar.prototype.getEvents = function () {
  var self =  this;
  var shifts = self.options.shifts;
  ShiftsToTime = {};
  TimeToShifts = {};
  self.options.events = [];
  _.each(shifts, function (shift) {
    self._getEventsFromShift.call(self, shift);
  });
};


Calendar.prototype.init = function () {
  var self = this;
  self.$calendar.fullCalendar({
    defaultView: "agendaShifts",
    defaultDate: moment(-4 * self.options.oneDay),
    header: {
      left: null,
      center: null,
      right: null
    },
    views: {
      "agendaShifts": {
        type: "agenda",
        duration: {days: self.options.shiftCount}
      }
    },
    businessHours: {
      "start": self.options.businessStartsAt + ":00",
      "end": (self.options.businessEndsAt + 1) + ":00",
      "dow": [0, 1, 2, 3, 4, 5, 6]
    },
    allDaySlot: false,
    editable: true,
    droppable: true, // this allows things to be dropped onto the calendar
    eventDurationEditable: false,
    drop: function (date, event, ui) {
      var day = date.date() - 1;
      var shift = TimeToShifts["" + day * self.options.oneDay];
      var job = ui.helper.attr("data-id").trim();
      var startTime = date.format();

      self.assignJob(job, shift, startTime);
    },
    eventDrop: function (event, duration, revertFunc) {
      var shift = event.shift;
      var job = event.id;
      var startTime = event.start.format();
      var jobStartTime = self.convertDate(startTime);
      var jobEndTime = self.convertDate(event.end.format());
      var shiftDoc = Shifts.findOne(shift);
      var shiftStartTime = self.convertDate(shiftDoc.startTime);
      var shiftEndTime = self.convertDate(shiftDoc.endTime);
      if (jobStartTime < shiftStartTime || jobEndTime > shiftEndTime) {
        revertFunc();
      }
      else if (!confirm("Are you sure about this change?")) {
        revertFunc();
      } else {
        self.assignJob(
          job,
          shift,
          moment(startTime).format("YYYY-MM-DD HH:mm")
        );
      }
    },
    events: self.options.events
  });
};


Calendar.prototype._updateEventsDOM = function () {
  $('#external-events div.external-event').each(function () {
    // store data so the calendar knows to render an event upon drop
    $(this).data('event', {
      title: $.trim($(this).text()), // use the element's text as the event title,
      id: $(this).attr("data-id"),
      stick: true // maintain when user navigates (see docs on the renderEvent method)
    });
    // make the event draggable using jQuery UI
    $(this).draggable({
      zIndex: 1111999,
      revert: true,  // will cause the event to go back to its
      revertDuration: 0  //  original position after the drag
    });
  });
};


Calendar.prototype.update = function () {
  this.getShifts();
  this.getEvents();
  this.options.shiftCount = Object.keys(TimeToShifts).length;
  this._updateEventsDOM();
  if (this.options.shiftCount > 0) {
    this.destroy();
    this.init();
  }
};


Template.dailyShiftScheduling.Calendar = Calendar;