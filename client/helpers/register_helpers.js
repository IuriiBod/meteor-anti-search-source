Template.registerHelper('isInOrganization', HospoHero.isInOrganization);
Template.registerHelper('isOrganizationOwner', HospoHero.isOrganizationOwner);
Template.registerHelper('getOrganization', HospoHero.getOrganization);
Template.registerHelper('isManager', HospoHero.isManager);
Template.registerHelper('isWorker', HospoHero.isWorker);
Template.registerHelper('getCurrentArea', HospoHero.getCurrentArea);
Template.registerHelper('isMe', HospoHero.isMe);

Template.registerHelper('canInvite', HospoHero.perms.canInvite);

Template.registerHelper('canViewRoster', HospoHero.perms.canViewRoster);
Template.registerHelper('canEditRoster', HospoHero.perms.canEditRoster);

Template.registerHelper('canViewMenu', HospoHero.perms.canViewMenu);
Template.registerHelper('canEditMenu', HospoHero.perms.canEditMenu);

Template.registerHelper('canViewJob', HospoHero.perms.canViewJob);
Template.registerHelper('canEditJob', HospoHero.perms.canEditJob);

Template.registerHelper('canViewStock', HospoHero.perms.canViewStock);
Template.registerHelper('canEditStock', HospoHero.perms.canEditStock);

Template.registerHelper('canViewForecast', HospoHero.perms.canViewForecast);