Template.customForm.events({
  'submit form': function(event) {
    event.preventDefault();

    FlowComponents.callAction('submitForm', event);
  }
});