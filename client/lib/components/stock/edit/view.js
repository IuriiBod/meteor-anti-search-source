Template.editIngredientItem.helpers({
  item: function() {
    var id = Session.get("thisIngredientId");
    Meteor.subscribe("ingredients", [id]);
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

  'click .archiveIngredient': function(e) {
    e.preventDefault();
    var id = $(e.target).attr("data-id");
    var status = $(e.target).attr("data-status");
    FlowComponents.callAction("archiveIng", id, status);
  }
});