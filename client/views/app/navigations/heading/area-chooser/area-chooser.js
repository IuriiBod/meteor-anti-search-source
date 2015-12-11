Template.areaChooser.events({
  'submit form': function (e, tmpl) {
    e.preventDefault();
    var areaId = tmpl.$('[name="areaId"]').val();
    tmpl.data.onAreaSelected(areaId);
  }
});

Template.areaChooser.helpers({
  areas: function () {
    var user = Meteor.user();

    if (user && user.relations && user.relations.organizationId) {
      var query = {
        organizationId: user.relations.organizationId
      };

      if (user.relations.locationIds) {
        query.locationId = {$in: user.relations.locationIds};

        if (user.relations.areaIds) {
          query._id = {$in: user.relations.areaIds};
        }
      }

      return Areas.find(query, {fields: {name: 1}}).fetch();
    } else {
      return [];
    }
  }
});