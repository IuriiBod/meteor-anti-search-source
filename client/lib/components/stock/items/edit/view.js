Template.ingredientItemEdit.helpers({
  item: function () {
    if (this._id) {
      var item = getIngredientItem(this._id);
      if (item) {
        if (this.quantity) {
          item.quantity = this.quantity;
        }
        return item;
      }
    }
  }
});

Template.ingredientItemEdit.events({
  'click .removeIng': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var localMenuId = Session.get("localId");
    var localMenu = LocalMenuItem.findOne(localMenuId);
    if (localMenu && localMenu.ings.length > 0) {
      LocalMenuItem.update({"_id": localMenuId}, {$pull: {"ings": id}});
    }
    var item = $(event.target).closest('tr');
    $(item).remove();
  },

  'keypress .ing-qty': function (event) {
    if (event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var elem = $(event.target);
      $(elem).closest("tr").next().find("input").focus();
    }
  }
});

var component = FlowComponents.define('ingredientItemEdit', function (props) {
  this.id = props.id;
  this.name = props.name;
  this.itemId = props.itemId;
  this.quantity = 1;
});

component.state.item = function () {
  var item = Ingredients.findOne(this.id);
  if (item) {
    return item;
  }
};

component.state.unitPrice = function () {
  var item = getIngredientItem(this.id);
  if (item) {
    return item.costPerPortionUsed;
  }
};

component.state.quantity = function () {
  var id = this.id;
  var quantity = 1;
  if (this.name == "editJobItem") {
    var jobItem = JobItems.findOne({"_id": Session.get("thisJobItem")});
    if (jobItem) {
      if (jobItem.ingredients && jobItem.ingredients.length > 0) {
        $.grep(jobItem.ingredients, function (e) {
          if (e._id == id) {
            quantity = e.quantity;
          }
        });
      }
    }
  }
  return quantity;
};














Template.ingredientItemEdit.onCreated(function () {
  this.quantity = 1;
});

Template.ingredientItemEdit.onRendered(function () {
});

Template.ingredientItemEdit.helpers({
  item: function () {
    var item = Ingredients.findOne(Template.instance().data.id);
    if (item) {
      return item;
    }
  },

  unitPrice: function () {
    var item = getIngredientItem(Template.instance().data.id);
    if (item) {
      return item.costPerPortionUsed;
    }
  },

  quantity: function () {
    var id = Template.instance().data.id;
    var quantity = 1;
    if (this.name == "editJobItem") {
      var jobItem = JobItems.findOne({"_id": Session.get("thisJobItem")});
      if (jobItem) {
        if (jobItem.ingredients && jobItem.ingredients.length > 0) {
          $.grep(jobItem.ingredients, function (e) {
            if (e._id == id) {
              quantity = e.quantity;
            }
          });
        }
      }
    }
    return quantity;
  },


  item: function () {
    if (Template.instance().data._id) {
      var item = getIngredientItem(this._id);
      if (item) {
        if (Template.instance().quantity) {
          item.quantity = Template.instance().quantity;
        }
        return item;
      }
    }
  }
});

Template.ingredientItemEdit.events({
  'click .removeIng': function (event) {
    event.preventDefault();
  },

  'keypress .ing-qty': function (event) {
    if (event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var elem = $(event.target);
      $(elem).closest("tr").next().find("input").focus();
    }
  }
});
