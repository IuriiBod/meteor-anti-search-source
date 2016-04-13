Migrations.add({
  version: 72,
  name: "Introduce prep portions",
  up: function () {
    let prepType = JobTypes.findOne({name: 'Prep'});
    JobItems.find({type: prepType._id}, {fields: {portions: 1}}).forEach((jobItem)=> {
      JobItems.direct.update({_id: jobItem._id}, {
        $set: {
          producedAmount: jobItem.portions,
          producedMeasure: 'portions'
        }
      });
    });

    JobItems.direct.update({}, {$unset: {portions: ''}}, {multi: true});
  }
});