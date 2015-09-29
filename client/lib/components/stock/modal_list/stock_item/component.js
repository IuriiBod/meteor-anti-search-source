var component = FlowComponents.define('stockModalItem', function(props) {
  this.stock = props.stock;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  return this.stock;
};

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
};

component.prototype.onItemRendered = function() {
  $('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });

  $('input').on('ifChecked', function(event){
    var id = $(this).attr("data-id");
    var sareaId = Session.get("activeSArea");
    Meteor.call("assignStocksToAreas", id, sareaId, function(err) {
      if(err) {
        HospoHero.alert(err);
      }
    });
  });
};