Template.menuEntry.onRendered(function(){
    var self = this;
    showSubMenuEntryIfIsActive(self);
});

Template.menuEntry.events({
    'click .menu-entry-title': function (e, tmpl) {
        var $parentUl = $(e.currentTarget).parent().parent();
        if (!$parentUl.hasClass('nav-second-level')) {
            closeOtherSubMenuEntries(tmpl);
            openThisSubMenuEntry(tmpl);
        }
    }
});

var closeOtherSubMenuEntries = function(tmpl) {
    var $parentUl = $(tmpl.find('li')).parent();
    var $openSubMenusEntries = $parentUl.find('ul.nav-second-level:visible');
    $openSubMenusEntries.slideUp(300);
};

var openThisSubMenuEntry = function(tmpl) {
    var $thisSubMenuEntry = $(tmpl.find('li ul.nav-second-level'));
    $thisSubMenuEntry.slideDown(300);
};

var showSubMenuEntryIfIsActive = function(tmpl) {
    var $thisMenuEntry = $(tmpl.find('li'));

    if ($thisMenuEntry.hasClass('active')) {
        var $secondLevelMenu = $($thisMenuEntry.find('ul.nav-second-level'));
        $secondLevelMenu.show();
    }
};