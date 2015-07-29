var component = FlowComponents.define("stockCountingListItem", function(props) {
  this.id = props.id;
  this.date = props.date;
  this.garea = props.garea;
  this.sarea = props.sarea;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  console.log(".........this", this);
  var stock = Ingredients.findOne(this.id);
  var stocktake = Stocktakes.findOne({
    "date": this.date, 
    "stockId": this.id, 
    "generalArea": this.garea,
    "specialArea": this.sarea
  });
  if(stock) {
    console.log("......", stock, stocktake);
    if(stocktake) {
      stock['counting'] = stocktake.counting;
    } else {
      stock['counting'] = 0;
    }
    return stock;
  }
}

component.prototype.onItemRendered = function() {
  $(".counting").editable({
    type: "text",
    title: 'Edit No of Portions',
    showbuttons: true,
    mode: 'inline',
    success: function(response, newValue) {
      var self = this;
      console.log("..........", self);
      if(newValue) {
        var info = {
          "date": self.date,
          "generalArea": self.garea,
          "specialArea": self.sarea,
          "stockId": self.id,
          "counting": newValue
        }
        Meteor.call("updateStocktake", info, function(err, id) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    }
  });
}