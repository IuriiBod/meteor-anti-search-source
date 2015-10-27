Template.editIngredientItem.helpers({
  item: function() {
    var id = Session.get("thisIngredientId");
    if(id) {
      return Ingredients.findOne(id);
    }
  }
});

Template.editIngredientItem.events({
  'submit form': function(event) {
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

    var info = HospoHero.otherUtils.getValuesFromEvent(event, fields, true);

    if(!info.code) {
      return alert("Code must have a value");
    }
    if(!info.description) {
      return alert("Description should have a value");
    }

    FlowComponents.callAction('submit', info);
  },

  'click .archiveIngredient': function(e) {
    e.preventDefault();
    var id = $(e.target).attr("data-id");
    var status = $(e.target).attr("data-status");
    FlowComponents.callAction("archiveIng", id, status);
  }
});