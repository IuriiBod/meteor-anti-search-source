Template.collapsibleElement.onCreated(function () {
  this.uiStatesManager = UIStates.getManagerFor(this.data.options.namespace);
});

Template.collapsibleElement.helpers({
  collapsed() {
    return Template.instance().uiStatesManager.getState(this.options.uiStateId);
  },

  userCanEdit() {
    return HospoHero.canUser(`edit ${this.options.namespace}`, Meteor.userId());
  },

  panelBodyClasses(collapsed) {
    let contentClass = `${collapsed ? 'hide' : 'show'}-content`;
    return `${contentClass} ${this.options.contentPadding} collapse ${collapsed ? 'in' : ''}`;
  }
});

Template.collapsibleElement.events({
  'shown.bs.collapse .show-content': _.throttle((event, tmpl) => {
    event.preventDefault();
    tmpl.uiStatesManager.setState(tmpl.data.options.uiStateId, true);
  }, 1000),

  'hidden.bs.collapse .hide-content': _.throttle((event, tmpl) => {
    event.preventDefault();
    tmpl.uiStatesManager.setState(tmpl.data.options.uiStateId, false);
  }, 1000)
});