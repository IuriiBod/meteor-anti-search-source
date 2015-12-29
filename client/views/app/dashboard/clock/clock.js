Template.clock.helpers({
  currentShift: function () {
    var upperLimit = moment().add(2, 'hours').toDate();
    var lowerLimit = moment().subtract(2, 'hours').toDate();

    var query = {
      assignedTo: Meteor.userId(),
      $or: [
        {
          status: 'draft',

          startTime: {
            $gte: lowerLimit,
            $lte: upperLimit
          }
        },
        {
          status: 'started'
        },
        //clock info stays visible 1 minutes after clock was finished
        {
          status: 'finished',
          finishedAt: {
            $lte: new Date()
          }
        }
      ]
    };
    query["relations.areaId"] = HospoHero.getCurrentAreaId();

    return Shifts.findOne(query, {sort: {"startTime": -1}});
  }
});


