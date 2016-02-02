Migrations.add({
  version: 56,
  name: 'Add multiple organization owners',
  up: function () {
    Organizations.find().forEach(function (organization) {
      Organizations.update({
        _id: organization._id
      }, {
        $set: {
          owners: [organization.owner]
        },
        $unset: {
          owner: true
        }
      });
    });
  }
});