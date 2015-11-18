Template.customFormInputText.events({
  'blur input': function (event) {
    var value = event.target.value;
    FlowComponents.callAction('checkValid', value);
  }
});