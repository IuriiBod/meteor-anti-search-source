Roles = {
  permissions: {}
};

var permissions = {
  Job: {
    view: {
      code: 'JOB_VIEW',
      title: 'View Jobs',
      description: 'view jobs'
    },
    edit: {
      code: 'JOB_EDIT',
      title: 'Edit Jobs',
      description: 'edit jobs'
    }
  },
  Menu: {
    view: {
      code: 'MENU_VIEW',
      title: 'View Menus',
      description: 'view menus'
    },
    edit: {
      code: 'MENU_EDIT',
      title: 'Edit Menus',
      description: 'edit menus'
    }
  },
  Roster: {
    view: {
      code: 'ROSTER_VIEW',
      title: 'View Roster',
      description: 'view roster'
    },
    edit: {
      code: 'ROSTER_EDIT',
      title: 'Edit Roster',
      description: 'edit roster'
    },
    canBeRosted: {
      code: 'ROSTER_CAN_BE_ROSTED',
      title: 'Can be rosted',
      description: 'be rosted onto shifts'
    },
    approver: {
      code: 'ROSTER_APPROVER',
      title: 'Roster Approver',
      description: 'approves roster requests'
    }
  },
  Stock: {
    view: {
      code: 'STOCK_VIEW',
      title: 'View Stocks',
      description: 'view stocks'
    },
    edit: {
      code: 'STOCK_EDIT',
      title: 'Edit Stocks',
      description: 'edit stocks'
    }
  },
  User: {
    invite: {
      code: 'USER_INVITE',
      title: 'Invite Users',
      description: 'invite users'
    },
    edit: {
      code: 'USER_EDIT',
      title: 'Edit Users',
      description: 'edit users'
    },
    editPayrate: {
      code: 'USER_EDIT_PAYRATE',
      title: 'Edit user\'s payrate'
    }
  },
  Forecast: {
    view: {
      code: 'FORECAST_VIEW',
      title: 'View Forecast',
      description: 'view forecast'
    }
  },
  Area: {
    edit: {
      code: 'AREA_EDIT',
      title: 'Edit Areas',
      description: 'edit areas'
    },
    viewFinancialInfo: {
      code: 'AREA_VIEW_FINANCIAL_INFO',
      title: 'View area\'s financial info',
      description: 'view area\'s financial info'
    }
  },
  Location: {
    edit: {
      code: 'LOCATION_EDIT',
      title: 'Edit Locations',
      description: 'edit locations'
    }
  },
  Organization: {
    billing: {
      code: 'ORGANIZATION_BILLING',
      title: 'Billing Account',
      description: 'edit billint account'
    },
    edit: {
      code: 'ORGANIZATION_EDIT',
      title: 'Edit Organization',
      description: 'edit organization settings'
    }
  },
  Site: {
    allRights: {
      code: 'SITE_ALL_RIGHTS',
      title: 'All Rights',
      description: 'all rights'
    }
  }
};

_.extend(Roles.permissions, permissions);