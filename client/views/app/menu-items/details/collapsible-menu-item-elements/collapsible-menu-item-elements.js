Template.collapsibleMenuItemElements.onCreated(function () {
  this.uiStatesManager = UIStates.getManagerFor(this.data.options.namespace);
});

Template.collapsibleMenuItemElements.helpers({
  collapsed() {
    return Template.instance().uiStatesManager.getState(this.options.type);
  }
});

Template.collapsibleMenuItemElements.events({
  'shown.bs.collapse .show-content': _.throttle((event, tmpl) => {
    event.preventDefault();
    tmpl.uiStatesManager.setState(tmpl.data.options.type, true);
  }, 1000),

  'hidden.bs.collapse .hide-content': _.throttle((event, tmpl) => {
    event.preventDefault();
    tmpl.uiStatesManager.setState(tmpl.data.options.type, false);
  }, 1000)
});