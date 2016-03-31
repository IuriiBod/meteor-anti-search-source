// Deny all users to send notifications from client side
Push.allow({
  send: function () {
    return false;
  }
});