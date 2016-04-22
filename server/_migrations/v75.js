Migrations.add({
  version: 75,
  name: "Add field 'section' for all prep items",
  up: function () {
    const prepType = JobTypes.findOne({name: 'Prep'});
    const areas = Areas.find();

    const addDefaultSectionToJobItems = (jobType, areaId) => {
      const defaultSection = Sections.findOne({name: 'Kitchen hand', 'relations.areaId': areaId}) ||
          Sections.findOne({'relations.areaId': areaId});

      if (!!defaultSection) {
        JobItems.update({
          type: jobType._id,
          'relations.areaId': areaId
        }, {
          $set: {section: defaultSection._id}
        }, {
          multi: true
        });
      }
    };

    areas.forEach((area) => addDefaultSectionToJobItems(prepType, area._id));
  }
});