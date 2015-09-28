var component = FlowComponents.define('stockModalItem', function(props) {
  this.stock = props.stock;
  this.name = props.name;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  return this.stock;
}

component.state.costPerPortionUsed = function() {
  var costPerPortionUsed = 0;
  if((this.stock.costPerPortion > 0) && (this.stock.unitSize > 0)) {
    costPerPortionUsed = this.stock.costPerPortion/this.stock.unitSize;
    costPerPortionUsed = Math.round(costPerPortionUsed * 100)/100;
    if(costPerPortionUsed === 0) {
      costPerPortionUsed = 0.001;
    }
  }
  return costPerPortionUsed;
}

component.prototype.onItemRendered = function() {
  var self = this;
  $('.i-checks.selected-Ing').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });

  $('input.selectedIng').on('ifChecked', function(event){
    var id = $(this).attr("data-id");

    if(self.name == "stockModal") {
      var sareaId = Session.get("activeSArea");
      Meteor.call("assignStocksToAreas", id, sareaId, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    } else if(self.name == "editJob") {
      var localId = Session.get("localId");

      var localJobItem = LocalJobItem.findOne(localId);
      if(localJobItem) {
        LocalJobItem.update({"_id": localId}, {$addToSet: {"ings": id}});
      } else {
        var localMenuItem = LocalMenuItem.findOne(localId);
        if(localMenuItem) {
          LocalMenuItem.update({"_id": localId}, {$addToSet: {"ings": id}});
        }
      }
    }
  });
};