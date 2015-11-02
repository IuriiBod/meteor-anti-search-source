Template.submitIngredientBody.events({
    'submit #addIngredientBtn': function (event) {
        event.preventDefault();
    },

    'submit #submitIngredientForm': function(event) {
        console.log('submit event');
        event.preventDefault();

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

        FlowComponents.callAction('submit', event, info);

        $(event.target).find("[type=text]").val("");
        $("#addIngredientModal").modal("hide");
    }
});