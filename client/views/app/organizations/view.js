Template.organizationStructure.onCreated(function () {
  this.set('location', null);
  this.set('area', null);
  this.set('organization', HospoHero.getOrganization());
});

Template.organizationStructure.events({
  'click .location-settings': function () {
    FlyoutManager.open('locationSettings', {locationId: this._id}, true);
  },

  'click .area-settings': function () {
    FlyoutManager.open('areaSettings', {areaId: this._id}, true);
  },

  'click .change-current-area': function (e) {
    e.preventDefault();

    FlowComponents.callAction('changeDefaultArea', this._id);
    var routerParams = Router.current().params;

    var paramsToRedirect = ['_id', 'id'];

    paramsToRedirect.forEach(function (param) {
      if (routerParams[param]) {
        Router.go('home');
      }
    });
  }
});