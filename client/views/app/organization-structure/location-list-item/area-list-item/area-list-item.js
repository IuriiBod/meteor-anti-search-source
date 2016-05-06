const CHANGE_AREA_BUTTON_CLASS = 'change-current-area-button';

Template.areaListItem.helpers({
  canEditArea: function () {
    let permissionChecker = new HospoHero.security.PermissionChecker();
    return permissionChecker.hasPermissionInArea(this._id, 'edit areas');
  },

  changeAreaButtonClass: function () {
    let activeClass = HospoHero.getCurrentAreaId() === this._id ? 'active' : '';
    return `${CHANGE_AREA_BUTTON_CLASS} ${activeClass}`;
  }
});

Template.areaListItem.events({
  'click .area-settings-button': function (event, tmpl) {
    FlyoutManager.open('areaSettings', {
      areaId: tmpl.data._id
    });
  },

  [`click .${CHANGE_AREA_BUTTON_CLASS}`]: function (event, tmpl) {
    Meteor.call('changeDefaultArea', tmpl.data._id, Template.waitButton.handleMethodResult(event));

    let routerParams = Router.current().params;
    let needRedirect = ['_id', 'id'].some(param => !!routerParams[param]);
    if (needRedirect) {
      Router.go('dashboard');
    }
  }
});