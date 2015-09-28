Notification = function Notification() {
    this.notificationText = [];
};

Notification.prototype.add = function (date, name, prevQuantity, newQuantity) {
    this.notificationText.push("<li>" + date + ":" + name + ": from " + prevQuantity + " to " + newQuantity+ "</li>");
};

Notification.prototype.send = function () {
    if(this.notificationText.length != 0) {
        this.notificationText.push("</ul>");
        this.notificationText.unshift("<ul>");

        var receivers = Meteor.users.find({isAdmin: true}).fetch();
        var options = {
            type: 'prediction',
            read: false,
            title: 'Some predictions have been changed',
            createdBy: null,
            text: this.notificationText.join(''),
            actionType: 'update'
        };

        _.each(receivers, function (item) {
            options.to = item._id;
            Notifications.insert(options);
        });
        this.notificationText = [];
    }
}