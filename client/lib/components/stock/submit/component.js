var component = FlowComponents.define('submitIngredientBody', function(props) {
    var isModal = props.isModal || false;
    this.set('isModal', isModal);
});

component.action.submit = function(event) {

    var fields = [
        'code',
        {
            name: 'desc',
            newName: 'description'
        },
        {
            name: 'supplier',
            newName: 'suppliers'
        },
        'portionOrdered',
        'portionUsed',
        {
            name: 'costPerPortion',
            parse: 'float',
            type: 'number'
        },
        {
            name: 'unitSize',
            parse: 'float',
            type: 'number'
        }
    ];

    var info = HospoHero.misc.getValuesFromEvent(event, fields, true);

    if(!info.code) {
        return HospoHero.error("You need to add a code");
    }

    if(!info.description) {
        return HospoHero.error("You need to a description");
    }

    info.costPerPortion = Math.round(info.costPerPortion * 100)/100;

    Meteor.call("createIngredients", info, HospoHero.handleMethodResult(function() {
        IngredientsListSearch.cleanHistory();
        IngredientsListSearch.search("", {"limit": 10});
    }));
};

component.state.suppliers = function() {
    return Suppliers.find({}, {sort: {"name": 1}});
};