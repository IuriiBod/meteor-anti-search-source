Notification = function Notification() {
  this.notificationText = [];
};

Notification.prototype.add = function (date, name, prevQuantity, newQuantity) {
  this.notificationText.push("<li>" + moment(date).format("YYYY-MM-DD") + ":" + name + ": from " + prevQuantity + " to " + newQuantity + "</li>");
};

Notification.prototype.send = function (receiversIds) {
  if (this.notificationText.length != 0) {
    this.notificationText.push("</ul>");
    this.notificationText.unshift("<ul>");

    var options = {
      type: 'prediction',
      read: false,
      title: 'Some predictions have been changed',
      createdBy: null,
      text: this.notificationText.join(''),
      actionType: 'update'
    };

    _.each(receiversIds, function (id) {
      options.to = id;
      Notifications.insert(options);
    });
    this.notificationText = [];
  }
}