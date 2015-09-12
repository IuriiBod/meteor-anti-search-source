Template.editIngredientItem.helpers({
  'item': function() {
    var id = Session.get("thisIngredientId");
    if(id) {
      return Ingredients.findOne(id);
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
    var portionOrdered = $(event.target).find('[name=portionOrdered]').val();
    var costPerPortion = $(event.target).find('[name=costPerPortion]').val().trim();
    var portionUsed = $(event.target).find('[name=portionUsed]').val();

    if(!code) {
      return alert("Code must have a value");
    }
    if(!desc) {
      return alert("Description should have a value");
    }
    var info = {
      "code": code,
      "description": desc,
      "portionOrdered": $(event.target).find('[name=portionOrdered]').val().trim(),
      "portionUsed": $(event.target).find('[name=portionUsed]').val().trim(),
      "suppliers": $(event.target).find('[name=supplier]').val().trim()
    };

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

    FlowComponents.callAction('submit', id, info);
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
        HospoHero.alert(err);
      }
    });
    IngredientsListSearch.cleanHistory();
    var selector = {
      limit: 30
    };
    if(Router.current().params.type == "archive") {
      selector.status = "archived";
    } else {
      selector.status = {$ne: "archived"};
    }
    IngredientsListSearch.search("", selector);
  }
});
