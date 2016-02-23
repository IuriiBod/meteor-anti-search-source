Template.areaListItem.helpers({
  canEditArea: function () {
    let permissionChecker = new HospoHero.security.PermissionChecker();
    return permissionChecker.hasPermissionInArea(this._id, 'edit areas');
  },

  isCurrentArea: function () {
    return HospoHero.getCurrentAreaId() === this._id;
  }
});

Template.areaListItem.events({
  'click .area-settings-button': function (event, tmpl) {
    FlyoutManager.open('areaSettings', {areaId: tmpl.data._id});
  },

  'click .change-current-area-button': function (event, tmpl) {
    event.preventDefault();

    Meteor.call('changeDefaultArea', tmpl.data._id, HospoHero.handleMethodResult());

    let routerParams = Router.current().params;
    let needRedirect = ['_id', 'id'].some(param => !!routerParams[param]);
    if (needRedirect) {
      Router.go('dashboard');
    }
  }
});