Template.projectStatusButton.helpers({
  buttonClass () {
    return this.activeButton === this.button.value ? 'btn-primary' : 'btn-default';
  }
});


Template.projectStatusButton.events({
  'click button' (event, tmpl) {
    tmpl.data.onButtonClick(tmpl.data.button.value);
  }
});