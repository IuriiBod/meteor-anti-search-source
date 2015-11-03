var migrationFn = function () {
  Shifts.find({shiftDate: {$gte: new Date('2015-10-30')}}).forEach(function (shift) {
    var getAuTime = function (date) {
      var dateM = moment(date).add(9, 'hours');
      return moment(shift.shiftDate).hours(dateM.hours()).minutes(dateM.minutes());
    };

    var convertToLocalTime = function (dateM) {
      return dateM.subtract(9, 'hours').toDate();
    };


    var applyNewTime = function (propertyName) {
      shift[propertyName] = convertToLocalTime(getAuTime(shift[propertyName]));
      return shift[propertyName];
    };

    applyNewTime('startTime');
    applyNewTime('endTime');

    //var duration = moment(end).diff(start) / 1000 / 60 / 60;

    //console.log('start', start, '\nend', end, '\ndiff:', duration);

    Shifts.update({_id: shift._id}, {$set: shift})
  });
};


//Migrations.add({
//  version: 16,
//  name: "Adjust shift's dates",
//  up: migrationFn
//});
