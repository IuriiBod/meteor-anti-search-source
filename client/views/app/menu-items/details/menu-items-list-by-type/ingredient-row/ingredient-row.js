//context: item (Ingredient/JobItem), type ("ing"/"prep"), quantity (number), setCurrentEditedIngredient (function)
Template.menuItemIngredientRow.helpers({
  itemName: function () {
    return this.itemDocument[this.type === 'prep' ? 'name' : 'description'];
  },

  itemMeasure: function () {
    return this.itemDocument[this.type === 'ings' ? 'portionUsed' : 'producedMeasure'];
  },

  itemPrice: function () {
    let itemCost = Template.menuItemsListByType.analyzeItemCost(this.itemDocument, this.type, this.quantity);
    return HospoHero.misc.rounding(itemCost);
  },

  getOnQuantityEditableSuccess: function () {
    var tmpl = Template.instance();

    return function (response, newValue) {
      var menuItemId = Router.current().params._id;

      if (newValue) {
        newValue = parseFloat(newValue);
        newValue = !isNaN(newValue) ? newValue : 0;

        var type = tmpl.data.type === 'prep' ? 'jobItems' : 'ingredients';

        Meteor.call('editItemOfMenu', menuItemId, {
          _id: tmpl.data.itemDocument._id,
          quantity: newValue
        }, 'updateQuantity', type, HospoHero.handleMethodResult());
      }
    };
  }
});


Template.menuItemIngredientRow.events({
  'click .remove-button': function (event, tmpl) {
    event.preventDefault();
    var menuItemId = HospoHero.getParamsFromRoute('_id');

    var confirmRemove = confirm("Are you sure you want to remove this item?");
    if (confirmRemove) {
      var queryProperty = tmpl.data.type === 'prep' ? 'jobItems' : 'ingredients';
      var query = {};
      query[queryProperty] = {_id: tmpl.data.itemDocument._id};

      Meteor.call("editItemOfMenu", menuItemId, query, 'remove', HospoHero.handleMethodResult());
    }
  },

  'click .view-button': function (event, tmpl) {
    event.preventDefault();
    if (tmpl.data.type === 'prep') {
      FlyoutManager.open('submitEditJobItem', {
        title: 'Edit Job',
        editMode: true,
        jobItemId: tmpl.data.itemDocument._id
      });
    } else {
      FlyoutManager.open('ingredientEditor', {
        title: 'Edit ingredient',
        editMode: true,
        ingredient: tmpl.data.itemDocument
      });
    }
  }
});



