Template.newsFeed.rendered = function(){
    $(".message-input").val("");
};

Template.newsFeed.helpers({
    settings: function() {
        return {
            position: "top",
            limit: 10,
            rules: [
                {
                    token: '@',
                    collection: Meteor.users,
                    field: "username",
                    filter: { "_id": {$nin: [Meteor.userId()]}, "isActive": true},
                    template: Template.user
                }
            ]
        };
    }
});

Template.newsFeed.events({
    'keypress .message-input': function(event) {
        if(event.keyCode == 10 || event.keyCode == 13) {
            event.preventDefault();
            var text = $(".message-input").val();
            FlowComponents.callAction('submit', text);
        }
    }
});
