Namespace('HospoHero.template', {
  equal: function (a, b) {
    return (a === b);
  },

  or: function () {
    var res = false;
    for (var i = 0; i < arguments.length; i++) {
      res = res || arguments[i];
    }
    return res;
  },

  and: function () {
    var res = true;
    for (var i = 0; i < arguments.length; i++) {
      res = !!(res && arguments[i]);
    }
    return res;
  },

  profilePicture: function (user) {
    user = user || Meteor.userId();
    if (_.isString(user)) {
      user = Meteor.users.findOne({_id: user});
    }

    if (user) {
      if (user.profile && user.profile.image) {
        return user.profile.image;
      } else if (user.services && user.services.google && user.services.google.picture) {
        return user.services.google.picture;
      } else {
        return "/images/user-image.jpeg";
      }
    }
  },

  /**
   * @return {string}
   */
  supplierName: function (id) {
    if (id) {
      var supplier = Suppliers.findOne(id);
      return supplier ? supplier.name : "Not assigned";
    } else {
      return "Not assigned";
    }
  },

  roundCount: function (count) {
    return count ? HospoHero.misc.rounding(count) : 0;
  },

  sectionById: function (id) {
    if (id) {
      var section = Sections.findOne(id);
      if (section) {
        return section.name;
      }
    } else {
      return "Open";
    }
  },

  jobTypeById: function (id) {
    if (id) {
      var type = JobTypes.findOne(id);
      if (type) {
        return type.name;
      }
    } else {
      return "Not assigned";
    }
  },

  getCurrentArea: HospoHero.getCurrentArea,
  getCurrentAreaId: HospoHero.getCurrentAreaId,

  hasPermissionInAreaTo: HospoHero.security.hasPermissionInAreaTo
});

Object.keys(HospoHero.template).forEach(function (helper) {
  Template.registerHelper(helper, HospoHero.template[helper]);
});