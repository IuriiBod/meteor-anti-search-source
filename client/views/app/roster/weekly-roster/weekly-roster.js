Template.weeklyRoster.helpers({
  isRosterTemplate: function () {
    return this.type === 'template';
  },

  pageHeadingConfig: function () {
    let shift = Shifts.findOne();
    let location = shift && Locations.findOne({_id: shift.relations.locationId});

    let config = {
      category: 'Roster',
      subtitle: location && `timezone: ${location.timezone}`
    };

    let extension;
    if (this.type === 'template') {
      extension = {
        title: 'Template Weekly Roster',
        name: 'weeklyrostertemplate'
      };
    } else {
      extension = {
        title: 'Weekly Roster',
        name: 'weeklyroster'
      };
    }

    _.extend(config, extension);
    return config;
  },

  //temporal solution
  weeklyFiguresDate: function () {
    return this.localMoment.toDate();
  }
});