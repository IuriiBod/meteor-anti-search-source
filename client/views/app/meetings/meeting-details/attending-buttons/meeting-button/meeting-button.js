Template.meetingButton.helpers({
  buttonClass () {
    return this.isActiveButton() ? this.button.class : 'btn-default';
  }
});


Template.meetingButton.events({
  'click button' (event, tmpl) {
    if (!tmpl.data.isActiveButton()) {
      tmpl.data.onButtonClick(tmpl.data.button.field);
    }
  }
});