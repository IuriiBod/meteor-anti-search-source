Template.submitIngredientBody.events({
    'submit #submitIngredientForm': function(event) {
        event.preventDefault();

        FlowComponents.callAction('submit', event).catch(function() {
        }).then(function() {
            $(event.target).find('[type=text]').val('');
            $('#addIngredientModal').modal('hide');
        });
    }
});