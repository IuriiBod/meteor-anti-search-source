Template.shiftsSummary.onCreated(function () {
  this.set('shiftState', 'future');
});


Template.shiftsSummary.helpers({
  currentShiftState: function (state) {
    return state === Template.instance().get('shiftState');
  },

  shifts: function () {
    var state = Template.instance().get('shiftState');

    var shiftsQueries = {
      future: {
        assignedTo: Meteor.userId(),
        published: true,
        startTime: {$gte: new Date()},
        'relations.areaId': HospoHero.getCurrentAreaId()
      },
      past: {
        assignedTo: Meteor.userId(),
        startTime: {$lte: new Date()},
        "relations.areaId": HospoHero.getCurrentAreaId()
      },
      open: {
        assignedTo: {$in: [null, undefined]},
        published: true,
        startTime: {$gte: moment().startOf('d').toDate()},
        "relations.areaId": HospoHero.getCurrentAreaId()
      }
    };

    return Shifts.find(shiftsQueries[state], {sort: {startTime: state === "past" ? -1 : 1}});
  }
});


Template.shiftsSummary.events({
  'click .futureShifts': function (event, tmpl) {
    tmpl.set('shiftState', 'future');
  },

  'click .pastShifts': function (event, tmpl) {
    tmpl.set('shiftState', 'past');
  },

  'click .openShifts': function (event, tmpl) {
    tmpl.set('shiftState', 'open');
  }
});
