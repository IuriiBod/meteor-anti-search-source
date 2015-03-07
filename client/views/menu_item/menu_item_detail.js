Template.menuItemDetail.helpers({
  item: function() {
    var id = Session.get("thisMenuItem");
    if(id) {
      var item = MenuItems.findOne(id);
      item.ingCost = 0;
      item.prepCost = 0;
      item.contribution = 0;
      if(item.ingredients.length > 0) {
        item.ingredients.forEach(function(doc) {
          var ing = Ingredients.findOne(doc.id);
          if(ing) {
            doc.desc = ing.description;
            doc.portionUsed = ing.portionUsed;
            if(ing.unit == "each") {
              costPerPortion = parseFloat(ing.costPerUnit)/parseInt(ing.unitSize)
            }  else {
              var unitId = ing.unit + "-" + ing.portionUsed;
              var conversion = Conversions.findOne(unitId);
              if(conversion) {
                var convertedCount = parseInt(conversion.count);
                if(ing.unitSize > 1) {
                  convertedCount = (convertedCount * parseInt(ing.unitSize));
                }
                costPerPortion = parseFloat(ing.costPerUnit)/convertedCount;
              } else {
                costPerPortion = 0;
                console.log("Convertion not defined");
              }
            }
            doc.cost = parseFloat(costPerPortion * parseInt(doc.quantity));
            doc.cost = Math.round(doc.cost * 100)/100;
            item.ingCost += doc.cost;
            item.ingCost = Math.round(item.ingCost * 100)/100;
          }
        });
      }
      if(item.jobItems) {
        if(item.jobItems.length > 0) {
          item.jobItems.forEach(function(doc) {
            var jobitem = JobItems.findOne(doc.id);
            if(jobitem) {
              jobitem.prepCostPerPortion = 0;
              doc.name = jobitem.name;
              doc.cost = 0;
              if(jobitem.ingredients.length > 0) {
                jobitem.ingredients.forEach(function(ing_item) {
                  var ing = Ingredients.findOne(ing_item.id);
                  var costPerPortion = 0;

                  if(ing) {
                    if(ing.unit == "each") {
                      costPerPortion = parseFloat(ing.costPerUnit)/parseInt(ing.unitSize)
                    }  else {
                      var unitId = ing.unit + "-" + ing.portionUsed;
                      var conversion = Conversions.findOne(unitId);
                      if(conversion) {
                        var convertedCount = parseInt(conversion.count);
                        if(ing.unitSize > 1) {
                          convertedCount = (convertedCount * parseInt(ing.unitSize));
                        }
                        costPerPortion = parseFloat(ing.costPerUnit)/convertedCount;
                      } else {
                        costPerPortion = 0;
                        console.log("Convertion not defined");
                      }
                    }
                  }
                  var calc_cost = costPerPortion * parseInt(ing_item.quantity);
                  doc.cost += calc_cost;
                });
                doc.prepCostPerPortion = parseFloat(doc.cost)/parseInt(jobitem.portions);
                doc.prepTotalCost = parseFloat(doc.prepCostPerPortion * doc.quantity);
                item.prepCost += doc.prepTotalCost;
                doc.prepTotalCost = Math.round(doc.prepTotalCost * 100)/100;
                item.prepCost = Math.round(item.prepCost * 100)/100;
              }
            }
          });
        }
      }
      if(item.salesPrice) {
        item.tax = parseFloat(item.salesPrice * 10)/100;
        item.tax = Math.round(item.tax * 100)/100;
      }
      var totalCost = parseFloat(parseFloat(item.prepCost) + item.ingCost + item.tax);
      item.contribution = parseFloat(item.salesPrice - totalCost);
      item.contribution = Math.round(item.contribution * 100)/100;
      return item;
    }
  }
});

Template.menuItemDetail.events({
  'click .editMenuItemBtn': function(e) {
    e.preventDefault();
    Router.go("menuItemEdit", {"_id": $(e.target).attr("data-id")})
  }
});

Template.menuItemDetail.rendered = function() {
}