var component = FlowComponents.define('menuDetailsHeader', function (props) {
  this.set('id', Router.current().params._id);
});

component.state.isSubscribed = function () {
  return !!Subscriptions.findOne({_id: this.get('id'), subscribers: Meteor.userId()});
};

component.state.isArchived = function () {
  var menu = MenuItems.findOne({_id: this.get('id')});
  return menu && menu.status == "archived";
};

component.state.onAreaSelected = function () {
  return function(areaId) {
    Meteor.call("duplicateMenuItem", this.get('id'), areaId, HospoHero.handleMethodResult(function () {
      HospoHero.success("Menu item has successfully copied!");
      $('#areaChooser').modal('hide');
    }));
  };
};

component.action.subscribe = function () {
  var method = this.get('isSubscribed') ? 'unSubscribe' : 'subscribe';
  Meteor.call(method, this.get('id'), HospoHero.handleMethodResult());
};

component.action.deleteMenuItem = function () {
  Meteor.call("deleteMenuItem", this.get('id'), HospoHero.handleMethodResult(function () {
    Router.go("menuItemsMaster", {"category": "all", "status": "all"});
  }));
};

component.action.archive = function () {
  Meteor.call("archiveMenuItem", this.get('id'), HospoHero.handleMethodResult(function(status) {
    return HospoHero.info("Menu item " + status);
  }));
};