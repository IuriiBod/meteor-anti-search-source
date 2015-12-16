//context: ingredient (Ingredient/undefined), isModal (boolean)
Template.submitIngredientBody.onCreated(function () {
  this.updateUnitOrderedState = function (value) {
    this.set('unitOrdered', value || '[unit ordered]');
  };

  this.updateUnitUsedState = function (value) {
    this.set('unitUsed', value || '[unit used]');
  };

  //initialize states
  this.updateUnitOrderedState();
  this.updateUnitUsedState();
});


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


Template.submitIngredientBody.helpers({
  suppliers: function () {
    return Suppliers.find({}, {sort: {"name": 1}});
  }
});


Template.submitIngredientBody.events({
  'submit #submitIngredientForm': function (event, tmpl) {
    event.preventDefault();

    var info = HospoHero.misc.getValuesFromEvent(event, submitIngredientFormFields, true);

    if (!info.code) {
      return HospoHero.error("You need to add a code");
    }

    if (!info.description) {
      return HospoHero.error("You need to a description");
    }

    info.costPerPortion = Math.round(info.costPerPortion * 100) / 100;

    var handleMethodResultCb = HospoHero.handleMethodResult(function () {
      $(event.target).find('[type=text]').val('');
      $('#ingredientItemEditor').modal('hide');
    });

    var oldIngredient = tmpl.data.ingredient;
    if (oldIngredient) {
      Meteor.call("editIngredient", oldIngredient._id, info, handleMethodResultCb);
    } else {
      Meteor.call("createIngredients", info, handleMethodResultCb);
    }
  },

  'change [name="unitOrdered"]': function (event, tmpl) {
    tmpl.updateUnitOrderedState(event.currentTarget.value);
  },

  'change [name="unitUsed"]': function (event, tmpl) {
    tmpl.updateUnitUsedState(event.currentTarget.value);
  }
});


var submitIngredientFormFields = [
  'code',
  {
    name: 'name',
    newName: 'description'
  },
  {
    name: 'supplier',
    newName: 'suppliers'
  },
  {
    name: 'unitOrdered',
    newName: 'portionOrdered'
  },
  {
    name: 'unitUsed',
    newName: 'portionUsed'
  },
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