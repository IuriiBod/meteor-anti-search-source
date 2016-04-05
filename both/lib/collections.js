MenuItems = new Mongo.Collection("menuItems");
Ingredients = new Mongo.Collection("ingredients");
JobItems = new Mongo.Collection("jobItems");

Shifts = new Mongo.Collection("shifts");
ManagerNotes = new Mongo.Collection('managerNotes');

Comments = new Mongo.Collection("comments");
Notifications = new Mongo.Collection("notifications");
Subscriptions = new Mongo.Collection("subscriptions");

Categories = new Mongo.Collection("categories");
JobTypes = new Mongo.Collection("jobTypes");
Sections = new Mongo.Collection("sections");

NewsFeeds = new Mongo.Collection("newsFeeds");

//stocktake 2.0
Suppliers = new Mongo.Collection("suppliers");

StockAreas = new Mongo.Collection("stockAreas");

Stocktakes = new Mongo.Collection("stocktakes");
StockItems = new Mongo.Collection("stockItems");
StockPrepItems = new Mongo.Collection('stockPrepItems');

Orders = new Mongo.Collection("orders");
OrderItems = new Mongo.Collection("orderItems");

//new roles functionality
Organizations = new Mongo.Collection("organizations");
Locations = new Mongo.Collection("locations");
Areas = new Mongo.Collection("areas");

//new forecast functionality
WeatherForecast = new Mongo.Collection("weatherForecast");
DailySales = new Mongo.Collection("dailySales");
PosMenuItems = new Mongo.Collection('posMenuItems');

LeaveRequests = new Mongo.Collection('leaveRequests');

// calendar functionality
CalendarEvents = new Mongo.Collection('calendarEvents');
TaskList = new Mongo.Collection('taskList');
Meetings = new Mongo.Collection('meetings');
RelatedItems = new Mongo.Collection('relatedItems');
Files = new Mongo.Collection('files');
Projects = new Mongo.Collection('projects');

//Applications (Recruitment)  functionality
Applications = new Mongo.Collection('applications');
ApplicationDefinitions = new Mongo.Collection('applicationDefinitions');
Positions = new Mongo.Collection('positions');
Interviews = new Mongo.Collection('interviews');