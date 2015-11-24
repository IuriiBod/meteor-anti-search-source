Template.submitIngredientBody.onRendered(function () {
  this.$('.unit-ordered-popover').popover({
    content: "Put the amount that you usually order in here. If it's a 20kg bag of flour, put '20kg bag'. If it's a 1lt bottle, put '1lt Bottle."
  });
  this.$('.unit-used-popover').popover({
    content: "What is the measure that you prefer to use in your recipes. This is usually small. If you order 20kg's of flour, you might use grams of flour in your recipes. In this box you'd simple put 'grams' or 'gms'."
  });
  this.$('.unit-size-popover').popover({
    content: "If you use mls of milk and order 1lt you'd put 1000 in this box, as there is 1000 mls in every litre. If you use grams of flour and order 20kg bags you'd put 20000, as there is 20000 grams in 20kgs."
  });
});

Template.submitIngredientBody.events({
  'submit #submitIngredientForm': function (event) {
    event.preventDefault();

    FlowComponents.callAction('submit', event).catch(function () {
    }).then(function () {
      $(event.target).find('[type=text]').val('');
      $('#addIngredientModal').modal('hide');
    });
  },
  'change [name="unitOrdered"]': function (event) {
    FlowComponents.callAction('changeUnitOrdered', event.currentTarget.value);
  },
  'change [name="unitUsed"]': function (event) {
    FlowComponents.callAction('changeUnitUsed', event.currentTarget.value);
  }
});