Template.clock.helpers({
  currentShift: function () {
    var upplerLimit = moment().add(2, 'hours').toDate();
    var lowerLimit = moment().subtract(2, 'hours').toDate();

    var query = {
      assignedTo: Meteor.userId(),
      $or: [
        {
          status: 'draft',
          $and: [{
            "startTime": {
              $gte: lowerLimit
            }
          }, {
            "startTime": {
              $lte: upplerLimit
            }
          }]
        },
        {
          status: 'started'
        },

        //clock info stays visible 1 minutes after clock was finished
        {
          status: 'finished',
          finishedAt: {
            $lte: moment().add(1, 'minutes').toDate()
          }
        }
      ]
    };
    query["relations.areaId"] = HospoHero.getCurrentAreaId();

    return Shifts.findOne(query, {sort: {"startTime": 1}});
  }
});


