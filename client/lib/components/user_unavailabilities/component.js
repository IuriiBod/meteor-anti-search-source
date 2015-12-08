var component = FlowComponents.define('userUnavailability', function() {
});

component.state.userName = function () {
    var user = Meteor.user();

    if (user.profile && user.profile.name) {
        return user.profile.name;
    };

    return user.username;
};

component.state.profileImgSrc = function () {
    var user = Meteor.user();
    if (user) {
        if (user.profile.image) {
            return user.profile.image;
        } else if (user.services && user.services.google) {
            return user.services.google.picture;
        } else {
            return "/images/user-image.jpeg";
        }
    }
};