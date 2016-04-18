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
        headingTemplate: 'weeklyTemplateHeader'
      };
    } else {
      extension = {
        title: 'Weekly Roster',
        headingTemplate: 'weeklyHeader'
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