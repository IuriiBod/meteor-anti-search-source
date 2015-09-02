Meteor.methods({
  'upsertSalesActual': function(date, revenue, department) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }
    if(!date) {
      logger.error("Date field not found");
      throw new Meteor.Error(404, "Date field not found");
    }
    if(!revenue) {
      logger.error("Revenue field not found");
      throw new Meteor.Error(404, "Revenue field not found");
    }
    var exist = ActualSales.findOne({"date": new Date(date).getTime(), "department": department});
    if(exist) {
      ActualSales.update({"_id": exist._id}, {$set: {"revenue": parseFloat(revenue)}});
      logger.info("Updated actual sales revenue for department: " + department + " on " + date);
    } else {
      var doc = {
        "date": new Date(date).getTime(), 
        "revenue": parseFloat(revenue),
        "department": department,
        "createdOn": Date.now(),
        "createdBy": user._id
      }
      var id = ActualSales.insert(doc);
      logger.info("Actual sales created for department " + department + " on " + date + ": ", id);
      return id;
    }
  },

  'upsertSalesForecast': function(date, revenue, department) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(403, "User not permitted to create menu");
    }
    if(!date) {
      logger.error("Date field not found");
      throw new Meteor.Error(404, "Date field not found");
    }
    if(!revenue) {
      logger.error("Revenue field not found");
      throw new Meteor.Error(404, "Revenue field not found");
    }
    var exist = SalesForecast.findOne({"date": new Date(date).getTime(), "department": department});
    if(exist) {
      SalesForecast.update({"_id": exist._id}, {$set: {"forecastedRevenue": parseFloat(revenue)}});
      logger.info("Updated sales forecast revenue for department: " + department + " on " + date);
    } else {
      var doc = {
        "date": new Date(date).getTime(), 
        "forecastedRevenue": parseFloat(revenue),
        "department": department,
        "createdOn": Date.now(),
        "createdBy": user._id
      }
      var id = SalesForecast.insert(doc);
      logger.info("Sales forecast created for department " + department + " on " + date + ": ", id);
      return id;
    }
  }
});