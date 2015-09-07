Template.editIngredientItem.helpers({
  'item': function() {
    var id = Session.get("thisIngredientId");
    if(id) {
      var ing = Ingredients.findOne(id);
      return ing;
    }
  }
});

Template.editIngredientItem.events({
  'submit form': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var code = $(event.target).find('[name=code]').val().trim();
    var desc = $(event.target).find('[name=desc]').val().trim();
    var supplier = $(event.target).find('[name=supplier]').val().trim();
    var portionOrdered = $(event.target).find('[name=portionOrdered]').val().trim();
    var costPerPortion = $(event.target).find('[name=costPerPortion]').val().trim();
    var portionUsed = $(event.target).find('[name=portionUsed]').val().trim();
    var unitSize = $(event.target).find('[name=unitSize]').val().trim();

    if(!code) {
      return alert("Code must have a value");
    }
    if(!desc) {
      return alert("Description should have a value");
    }
    var info = {
      "code": code,
      "description": desc,
      "portionOrdered": portionOrdered,
      "portionUsed": portionUsed,
      "suppliers": supplier
    }

    if(!costPerPortion || typeof(parseFloat(costPerPortion)) != "number") {
      info.costPerPortion =  0;
    } else {
      info.costPerPortion = parseFloat(costPerPortion);
      info.costPerPortion = Math.round(info.costPerPortion * 100)/100;
    }

    if(!unitSize || typeof(parseFloat(unitSize)) != "number") {
      info.unitSize =  0;
    } else {
      info.unitSize = parseFloat(unitSize);
    }

    FlowComponents.callAction('submit', id, info, event);
  },

  'click .archiveIngredient': function(e, tpl) {
    e.preventDefault();
    var id = $(e.target).attr("data-id");
    var status = $(e.target).attr("data-status");
    var state = false;
    if(status == "delete") {
      state = true;
    }
    Meteor.call("archiveIngredient", id, state, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
    IngredientsListSearch.cleanHistory();
    var selector = {
      limit: 30
    };
    var params = {};
    if(Router.current().params.type == "archive") {
      selector.status = "archived";
    } else {
      selector.status = {$ne: "archived"};
    }
    IngredientsListSearch.search("", selector);
  }
});
