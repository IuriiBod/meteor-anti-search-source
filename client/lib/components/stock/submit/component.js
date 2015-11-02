var component = FlowComponents.define('submitIngredientBody', function(props) {
    var isModal = props.isModal || false;
    this.set('isModal', isModal);
});

component.action.submit = function(event, info) {
    Meteor.call("createIngredients", info, HospoHero.handleMethodResult(function() {
        IngredientsListSearch.cleanHistory();
        IngredientsListSearch.search("", {"limit": 10});
    }));
};

component.state.suppliers = function() {
    return Suppliers.find({}, {sort: {"name": 1}});
};