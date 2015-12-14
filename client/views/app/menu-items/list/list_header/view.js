Template.menuListHeader.events({
  'click .subscribeMenuList': function (e) {
    e.preventDefault();
    FlowComponents.callAction('subscribe');
  }
});