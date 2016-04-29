Template.ingredientEditorForm.onCreated(function () {
  this.closeFlyout = (event) => {
    FlyoutManager.getInstanceByElement(event.target).close();
  };

  this.changeIngredientState = function (newState, event) {
    Meteor.call('archiveIngredient', this.data.ingredient._id, newState, HospoHero.handleMethodResult(() => {
      this.closeFlyout(event);
      HospoHero.info('Stock item ' + newState + 'd');
    }));
  };

  this.unitOrdered = new ReactiveVar(false);
  this.unitUsed = new ReactiveVar(false);

  this.updateUnitOrderedState = function (value) {
    this.unitOrdered.set(value || '[unit ordered]');
  };

  this.updateUnitUsedState = function (value) {
    this.unitUsed.set(value || '[unit used]');
  };

  //initialize states
  var ingredient = this.data.ingredient;
  if (ingredient) {
    this.updateUnitOrderedState(ingredient.portionOrdered);
    this.updateUnitUsedState(ingredient.portionUsed);
  } else {
    this.updateUnitOrderedState();
    this.updateUnitUsedState();
  }
});

Template.ingredientEditorForm.onRendered(function () {
  this.$('.unit-ordered-popover').popover({
    content: "Put the amount that you usually order in here. " +
    "If it's a 20kg bag of flour, put '20kg bag'. If it's a 1lt bottle, put '1lt Bottle.",
    placement: function (context, source) {
      return calculatePlacement(source);
    }
  });
  this.$('.unit-used-popover').popover({
    content: "What is the measure that you prefer to use in your recipes. " +
    "This is usually small. If you order 20kg's of flour, you might use grams of flour in your recipes. " +
    "In this box you'd simple put 'grams' or 'gms'.",
    placement: function (context, source) {
      return calculatePlacement(source);
    }
  });
  this.$('.unit-size-popover').popover({
    content: "If you use mls of milk and order 1lt you'd put 1000 in this box, as there is 1000 mls in every litre. " +
    "If you use grams of flour and order 20kg bags you'd put 20000, as there is 20000 grams in 20kgs.",
    placement: function (context, source) {
      return calculatePlacement(source);
    }
  });
});

Template.ingredientEditorForm.helpers({
  unitsCaptions: function () {
    return {
      ordered: Template.instance().unitOrdered.get(),
      used: Template.instance().unitUsed.get()
    };
  },

  supplierOptions: function () {
    var suppliers = Suppliers.find({}, {sort: {"name": 1}}).fetch();
    suppliers.unshift({
      _id: '',
      name: 'Not assigned'
    });
    return suppliers;
  },

  suppliersOptionAttrs: function () {
    var attributes = {
      value: this._id
    };

    var ingredient = Template.parentData(1).ingredient;
    var selectedSupplierId = ingredient && ingredient.suppliers || null;
    if (selectedSupplierId && selectedSupplierId === this._id) {
      attributes.selected = 'selected';
    }
    return attributes;
  },

  defaultValue: function (value, defaultValue) {
    return value || defaultValue;
  },

  isArchive: function () {
    return this.ingredient && this.ingredient.status === 'archived';
  }
});


Template.ingredientEditorForm.events({
  'submit form': function (event, tmpl) {
    event.preventDefault();
    event.stopPropagation();

    var ingredient = HospoHero.misc.getValuesFromEvent(event, submitIngredientFormFields, true);

    if (!ingredient.code) {
      return HospoHero.error("You need to add a code");
    }

    if (!ingredient.description) {
      return HospoHero.error("You need to a description");
    }

    ingredient.costPerPortion = HospoHero.misc.rounding(ingredient.costPerPortion);

    var handleMethodResultClose = HospoHero.handleMethodResult(function () {
      FlyoutManager.getInstanceByElement(event.target).close();
    });

    var oldIngredient = tmpl.data.ingredient;
    if (oldIngredient) {
      let updatedIngredient = _.extend(oldIngredient, ingredient);
      Meteor.call("editIngredient", updatedIngredient, handleMethodResultClose);
    } else {
      Meteor.call("createIngredients", ingredient, handleMethodResultClose);
    }
  },

  'change [name="unitOrdered"]': function (event, tmpl) {
    tmpl.updateUnitOrderedState(event.currentTarget.value);
  },

  'change [name="unitUsed"]': function (event, tmpl) {
    tmpl.updateUnitUsedState(event.currentTarget.value);
  },

  'click .submit-ingredient-button': function (event, tmpl) {
    tmpl.find('.submit-form-button').click();
  },

  'click .archive-button': function (event, tmpl) {
    tmpl.changeIngredientState('archive', event);
  },
  'click .restore-button': function (event, tmpl) {
    tmpl.changeIngredientState('restore', event);
  },
  'click .delete-button': function (event, tmpl) {
    if (confirm('Are you sure you want to delete this ingredient?\nIt will be removed from all menu items as well.')) {
      tmpl.changeIngredientState('delete', event);
    }
  },
  'click .cancel-button': function (event) {
    Template.instance().closeFlyout(event);
  }
});

let calculatePlacement = function(source) {
  let position = $(source).position();

  if (position.left < 120) {
    return 'right';
  } else {
    return 'top';
  }
};

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
  },
  {
    name: 'shelfLife',
    parse: 'int',
    type: 'number'
  }
];