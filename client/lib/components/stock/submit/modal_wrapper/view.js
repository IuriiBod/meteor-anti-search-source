Template.submitIngredient.events({
  'click #submitSubmitIngredientBtn': function (event, tmpl) {
    event.preventDefault();
    var $form = $(tmpl.find('#submitIngredientForm'));
    $form.submit();
  },
  'click #cancel': function(e) {
    e.preventDefault();
  }
});