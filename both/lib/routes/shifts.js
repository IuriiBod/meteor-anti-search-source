Router.route('/claim/:id/:action', {
  name: 'claim',
  where: 'server',
  action: function () {
    var notificationId = this.params.id;
    var action = this.params.action;
    var notification = Notifications.findOne({_id: notificationId});

    if(notification) {
      var shiftId = notification.meta.shiftId;
      var claimedBy = notification.meta.claimedBy;
      if(action === 'confirm') {
        Shifts.update({_id: shiftId}, {
          $set: {
            assignedTo: claimedBy
          },
          $unset: {
            claimedBy: 1,
            rejectedFor: 1
          }
        });
        Notifications.remove({'meta.shiftId': shiftId});
      } else {
        Shifts.update({_id: shiftId}, {
          $pull: {
            claimedBy: claimedBy
          },
          $addToSet: {
            rejectedFor: claimedBy
          }
        });
        Notifications.remove({
          'meta.shiftId': shiftId,
          'meta.claimedBy': claimedBy
        });
      }
    }

    this.response.writeHead(301, {'Location': '/'});
    this.response.end();
  }
});