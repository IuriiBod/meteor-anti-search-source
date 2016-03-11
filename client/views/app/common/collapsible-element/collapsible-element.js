Template.collapsibleElement.onCreated(function () {
  this.uiStatesManager = UIStates.getManagerFor(this.data.settings.namespace);
});

Template.collapsibleElement.helpers({
  collapsed() {
    let uiStatesManager = Template.instance().uiStatesManager;
    //by default panel should be not collapsed
    return uiStatesManager.getState(this.settings.uiStateId, true);
  },

  panelBodyClasses(collapsed) {
    return `collapse ${collapsed ? 'in' : ''}`;
  }
});

Template.collapsibleElement.events({
  'shown.bs.collapse .collapsible-element-content': _.throttle((event, tmpl) => {
    event.preventDefault();
    tmpl.uiStatesManager.setState(tmpl.data.settings.uiStateId, true);
  }, 1000),

  'hidden.bs.collapse .collapsible-element-content': _.throttle((event, tmpl) => {
    event.preventDefault();
    tmpl.uiStatesManager.setState(tmpl.data.settings.uiStateId, false);
  }, 1000)
});