MenuItems = new Mongo.Collection("menuItems");

Ingredients = new Mongo.Collection("ingredients");

JobItems = new Mongo.Collection("jobItems");

Jobs = new Mongo.Collection("jobs");

Shifts = new Mongo.Collection("shifts");
ManagerNotes = new Mongo.Collection('managerNotes');

Comments = new Mongo.Collection("comments");
Notifications = new Mongo.Collection("notifications");
Subscriptions = new Mongo.Collection("subscriptions");

Categories = new Mongo.Collection("categories");
JobTypes = new Mongo.Collection("jobTypes");
Sections = new Mongo.Collection("sections");
Statuses = new Mongo.Collection("statuses");

GeneralAreas = new Mongo.Collection("generalAreas");
SpecialAreas = new Mongo.Collection("specialAreas");

Payroll = new Mongo.Collection("payroll");

NewsFeeds = new Mongo.Collection("newsFeeds");

StocktakeMain = new Mongo.Collection("stocktakeMain");
Stocktakes = new Mongo.Collection("stocktakes");
CurrentStocks = new Mongo.Collection("currentStocks");
StockOrders = new Mongo.Collection("stockOrders");
OrderReceipts = new Mongo.Collection("orderReceipts");

Suppliers = new Mongo.Collection("suppliers");

//new roles functionality
Organizations = new Mongo.Collection("organizations");
Locations = new Mongo.Collection("locations");
Areas = new Mongo.Collection("areas");
Invitations = new Mongo.Collection("invitations");

//new forecast functionality
WeatherForecast = new Mongo.Collection("weatherForecast");
DailySales = new Mongo.Collection("dailySales");

LeaveRequests = new Mongo.Collection('leaveRequests');

//POS
PosMenuItems = new Mongo.Collection('posMenuItems');

// null collections
LocalMenuItem = new Mongo.Collection(null);
LocalJobItem = new Mongo.Collection(null);