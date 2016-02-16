var helpMenuItems = [
  {
    title: 'Self Help',
    module: 'articles'
  },
  {
    title: 'Chat with Support',
    module: 'intercom'
  }
];

Template.helpMenu.onCreated(function () {
  this.items = new ReactiveVar(null);
});

Template.helpMenu.helpers({
  helpMenuItems: function () {
    return Template.instance().items.get();
  }
});

Template.helpMenu.events({
  'click .help-menu': function (event, tmpl) {
    event.preventDefault();
    tmpl.items.set(helpMenuItems);
  }
});