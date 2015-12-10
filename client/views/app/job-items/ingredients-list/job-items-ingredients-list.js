Template.listOfIngredients.onCreated(function () {
  this.addedStockItemsIds = new ReactiveVar([]);
});

Template.listOfIngredients.helpers({
  ingredientsIds: function () {
    console.log(Template.instance().addedStockItemsIds.get());
    return Template.instance().addedStockItemsIds.get();
  },

  isMenu: function () {
    return Template.instance().data.id == "menuSubmit";
  },

  name: function () {
    return Template.instance().data.name;
  },

  id: function () {
    return Session.get("thisJobItem");
  },

  modalStockListParams: function () {
    var thisTmpl = Template.instance();
    return {
      onAddStockItem: function (itemId) {
        var addedIds = thisTmpl.addedStockItemsIds.get();
        addedIds.push(itemId)
        thisTmpl.addedStockItemsIds.set(addedIds);
      },
      addedStockItemsIds: thisTmpl.addedStockItemsIds.get()
    }
  }
});

Template.listOfIngredients.events({
  'click #showIngredientsList': function (event, tmpl) {
    event.preventDefault();
    tmpl.$("#ingredientsListModal").modal("show");
  }
});