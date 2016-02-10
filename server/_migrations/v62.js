Migrations.add({
  version: 62,
  name: 'Remove NULLs in relations of Meteor.users',
  up: function () {
    var properties = ['organizationIds', 'locationIds', 'areaIds'];

    properties.forEach((propertyName)=> {
      Meteor.users.update({
        [`relations.${propertyName}`]: null
      }, {
        $unset: {
          [`relations.${propertyName}`]: ''
        }
      }, {multi: true});
    });
  }
});