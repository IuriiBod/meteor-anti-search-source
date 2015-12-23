//context: item (Ingredient/JobItem), type ("ing"/"prep"), quantity (number), setCurrentEditedIngredient (function)
Template.menuItemIngredientRow.onCreated(function () {
});


Template.menuItemIngredientRow.helpers({
  itemName: function () {
    return this.type == 'prep' && this.item.name || this.item.description;
  },

  itemMeasure: function () {
    return this.type == "prep" && this.item.measure || this.item.portionUsed;
  },

  price: function () {
    var isPrep = this.type === 'prep';
    var analyzeResult = HospoHero.analyze[isPrep ? 'jobItem' : 'ingredient'](this.item);
    var targetValue = analyzeResult[isPrep ? 'prepCostPerPortion' : 'costPerPortionUsed'];
    return Math.round(targetValue * this.quantity * 100) / 100;
  },

  getOnQuantityEditableSuccess: function () {
    var tmpl = Template.instance();

    return function (response, newValue) {
      var menuItemId = Router.current().params._id;

      if (newValue) {
        newValue = parseFloat(newValue);
        newValue = !isNaN(newValue) ? newValue : 0;

        var type = tmpl.data.type === 'prep' ? 'jobItems' : 'ingredients';

        Meteor.call('editMenuIngredientsOrJobItems', menuItemId, {
          _id: tmpl.data.item._id,
          quantity: newValue
        }, type, HospoHero.handleMethodResult());
      }
    };
  }
});


Template.menuItemIngredientRow.events({
  'click .remove-button': function (event, tmpl) {
    event.preventDefault();
    var menuItemId = Template.parentData(1)._id;

    var confirmRemove = confirm("Are you sure you want to remove this item?");
    if (confirmRemove) {
      var queryProperty = tmpl.data.type == 'prep' ? 'jobItems' : 'ingredients';
      var query = {};
      query[queryProperty] = {_id: tmpl.data.item._id};

      Meteor.call("removeItemFromMenu", menuItemId, query, HospoHero.handleMethodResult());
    }
  },

  'click .view-button': function (event, tmpl) {
    event.preventDefault();
    if (tmpl.data.type == 'prep') {
      Router.go('jobItemEdit', {_id: tmpl.data.item._id});
    } else {
      tmpl.ingredientItemEditorModal = ModalManager.open('ingredientItemEditor', {ingredient: tmpl.data.item});
    }
  }
});



