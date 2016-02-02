Template.menuItemsListByType.onCreated(function () {
  this.onAddStockItem = (itemId) => {
    var query = {};
    query[this.type === 'prep' ? 'jobItems' : 'ingredients'] = {
      _id: itemId,
      quantity: 1
    };

    var menuItemId = HospoHero.getParamsFromRoute('_id');
    Meteor.call("editItemOfMenu", menuItemId, query, 'add', HospoHero.handleMethodResult());
  }
});

Template.menuItemsListByType.helpers({
  ingredient: function () {
    return Ingredients.findOne({_id: this._id});
  },

  jobItem: function () {
    return JobItems.findOne({_id: this._id});
  }
});

Template.menuItemsListByType.events({
  'click #showIngsOrPrepList': function (event, tmpl) {
    event.preventDefault();

    let idsOfItemsInList = tmpl.data.type === 'ings' ? _.pluck(tmpl.data.ingredients, '_id') : _.pluck(tmpl.data.jobItems, '_id');

    FlyoutManager.open('stocksList', {
      onAddStockItem: tmpl.onAddStockItem,
      idsToExclude: idsOfItemsInList
    });
  }
});