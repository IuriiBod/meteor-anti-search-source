Template.ItemsToCollapse.onRendered(function () {
  this.$(`#${this.data.options.type}`).on('shown.bs.collapse', _.throttle(() => {
    this.data.uiStates.setUIState(this.data.options.type, true);
  }, 1000));

  this.$(`#${this.data.options.type}`).on('hidden.bs.collapse', _.throttle(() => {
    this.data.uiStates.setUIState(this.data.options.type, false);
  }, 1000))
});


Template.ItemsToCollapse.helpers({
  collapsed() {
    return this.uiStates.getUIState(this.options.type);
  },

  type() {
    let type = this.options.type;
    return {
      image: type === 'images',
      notInstructionsOrSettings: type !== 'instructions' && type !== 'settings' && type !== 'performance',
      performance: type === 'performance'
    }
  }
});