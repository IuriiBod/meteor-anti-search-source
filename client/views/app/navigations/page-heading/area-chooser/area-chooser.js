Template.areaChooser.helpers({
  areas: function () {
    var user = Meteor.user();

    if (user && user.relations && user.relations.organizationIds) {
      var query = {
        organizationId: {$in: user.relations.organizationIds}
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

Template.areaChooser.events({
  'submit form': function (event, tmpl) {
    event.preventDefault();
    var areaId = event.target.areaId.value;

    if (_.isFunction(tmpl.data.onAreaSelected)) {
      tmpl.data.onAreaSelected(areaId);
      ModalManager.getInstanceByElement(event.target).close();
    }
  }
});