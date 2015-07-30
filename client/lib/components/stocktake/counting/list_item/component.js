var component = FlowComponents.define("stockCountingListItem", function(props) {
  this.id = props.id;
  this.date = props.date;
  this.garea = props.garea;
  this.sarea = props.sarea;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  subs.subscribe("ingredients", [this.id]);
  var stock = Ingredients.findOne(this.id);
  console.log("....date", this.date);
  // subs.subscribe("ingredients", list.stocks);
  // subs.subscribe("")
  var stocktake = Stocktakes.findOne({
    "date": this.date, 
    "stockId": this.id, 
    "generalArea": this.garea,
    "specialArea": this.sarea
  });
  console.log("..........", stocktake);
  if(stock) {
    if(stocktake) {
      stock['counting'] = stocktake.counting;
    } else {
      stock['counting'] = 0;
    }
    stock['date'] = this.date;
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
      var id = $(this).closest("li").attr("data-id");
      var date = $(this).closest("li").attr("data-date");
      console.log("......", self);
      if(newValue) {
        var info = {
          "date": date,
          "generalArea": Session.get("activeGArea"),
          "specialArea": Session.get("activeSArea"),
          "stockId": id,
          "counting": parseFloat(newValue)
        }
        console.log(".........", info);
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