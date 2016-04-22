class PrepJobsAllocator {
  constructor(area, date) {
    this._date = HospoHero.dateUtils.getDateMomentForLocation(date, area.locationId);
    this._areaId = area._id;
    this._timeRange = TimeRangeQueryBuilder.forDay(date, area.locationId);
  }

  allocate() {
    const dailySales = this._getDailySales();
    const menuItems = this._getMenuItemsFromDailySales(dailySales);
    const prepItemsIds = this._getPrepItemsIdsFromMenuItems(menuItems);
    const availableUsersIds = this._getAvailableUsersIds();
    const usersAllocation = this._getUsersAllocation(prepItemsIds, availableUsersIds);

    usersAllocation.forEach((allocation) => {
      allocation.jobsIds.forEach((jobId) => {
        const prepItemsAmount = this._getNeededAmountOfPrepItem(jobId, menuItems, dailySales);
        const prepJobsAmount = this._getNumberOfNeededPrepJob(jobId, prepItemsAmount);

        if (prepJobsAmount > 0) {
          const duration = this._defineNeededTimeForJob(jobId, prepJobsAmount);
          this._addPrepJobEvent(jobId, allocation.userId, duration);
        }
      });
    });
  }

  static removeAllocations (locationId, date) {
    return CalendarEvents.remove({
      startTime: TimeRangeQueryBuilder.forDay(date, locationId),
      locationId: locationId,
      isAutomaticallyAllocated: true
    });
  }

  _getDailySales() {
    return DailySales.find({
      date: this._timeRange,
      predictionQuantity: {$gt: 0},
      'relations.areaId': this._areaId
    }).fetch();
  }

  _getMenuItemsFromDailySales(dailySales) {
    return MenuItems.find({
      _id: {$in: dailySales.map(item => item.menuItemId)}
    }).fetch();
  }

  _getPrepItemsIdsFromMenuItems(menuItems) {
    let allJobItemsIds = new Set();

    menuItems.forEach((menuItem) => {
      if (menuItem.jobItems.length > 0) {
        const jobItemsIds = menuItem.jobItems.map((item) => item._id);
        jobItemsIds.forEach(id => allJobItemsIds.add(id));
      }
    });

    return Array.from(allJobItemsIds);
  }

  _getExpectedAmountOfPrepItem(prepItemId, menuItems, dailySales) {
    let expectedAmount = 0;

    menuItems.forEach((menuItem) => {
      const prepJob = menuItem.jobItems.find(item => item._id === prepItemId);
      if (prepJob) {
        const dailySale = dailySales.find(item => item.menuItemId);
        if (dailySale && dailySale.predictionQuantity) {
          expectedAmount += dailySale.predictionQuantity * prepJob.quantity;
        }
      }
    });

    return expectedAmount;
  }

  _getAvailableAmountOfPrepItem(prepItemId) {
    let stockPrepItem;

    const stocktake = Stocktakes.findOne({
      date: this._timeRange,
      'relations.areaId': this._areaId
    });

    if (stocktake) {
      stockPrepItem = StockPrepItems.findOne({
        stocktakeId: stocktake._id,
        jobItemId: prepItemId
      });
    }

    return stockPrepItem ? stockPrepItem.count : 0;
  }

  _getNeededAmountOfPrepItem(prepItemId, menuItems, dailySales) {
    const expectedAmount = this._getExpectedAmountOfPrepItem(prepItemId, menuItems, dailySales);
    const availableAmount = this._getAvailableAmountOfPrepItem(prepItemId);
    const neededAmount = expectedAmount - availableAmount;
    return neededAmount >= 0 ? neededAmount : 0;
  }

  _getNumberOfNeededPrepJob(prepItemId, numberOfNeededJobItems) {
    const prepItem = JobItems.findOne({_id: prepItemId});
    return prepItem.producedAmount ? Math.ceil(numberOfNeededJobItems / prepItem.producedAmount) : 1;
  }

  _defineNeededTimeForJob(jobItemId, jobsNumber) {
    const job = JobItems.findOne({_id: jobItemId});
    return job.activeTime * jobsNumber;
  }

  _getAvailableUsersIds() {
    const sectionsIds = Sections.find({
      'relations.areaId': this._areaId
    }).map(section => section._id);

    const shifts = Shifts.find({
      section: {$in: sectionsIds},
      startTime: this._timeRange,
      assignedTo: {$ne: null}
    });

    return shifts.map(shift => shift.assignedTo);
  }

  _defineFastestUserForJob(prepItemId, usersIds) {
    const skilledUsers = [];
    const startDateOfSearching = moment(this._date).add(-1, 'quarters').toDate();

    usersIds.forEach((userId) => {
      const durations = CalendarEvents
          .find({
            itemId: prepItemId,
            userId: userId,
            duration: {$gt: 0},
            startTime: TimeRangeQueryBuilder.forInterval(startDateOfSearching, this._date)
          })
          .map(event => event.duration);

      if (durations.length > 0) {
        const totalDuration = durations.reduce((sum, current) => sum + current, 0);

        skilledUsers.push({
          id: userId,
          averageDuration: totalDuration / durations.length
        });
      }
    });

    if (skilledUsers.length > 0) {
      const fastUser = skilledUsers.reduce((min, current) => current.averageDuration < min ? current : min, 0);
      return fastUser.id;
    }

    return usersIds[0];
  }

  _getUsersIdsSkilledForJob(jobId, usersIds) {
    const sectionId = JobItems.findOne({_id: jobId}).section;
    const usersSkilledForJob = Meteor.users.find({
      _id: {$in: usersIds},
      'profile.sections': sectionId
    }).map(user => user._id);

    return usersSkilledForJob.length > 0 ? usersSkilledForJob : null;
  }

  _defineUserForJob(jobId, usersIds) {
    const users = this._getUsersIdsSkilledForJob(jobId, usersIds) || usersIds;

    return users.length > 1 ? this._defineFastestUserForJob(jobId, users) : users[0];
  }

  /**
   * Returns allocation of jobs for user
   * @returns {Object[]} allocationArray allocationArray[].userId - id of user, allocationArray[].jobsIds - list of ids for user
   */
  _getUsersAllocation(prepItemsIds, usersIds) {
    const usersAllocation = usersIds.map((id) => {
      return  {userId: id, jobsIds: []};
    });
    const freeUsers = usersIds;

    const getMaxNumberOfItemsForUser = (itemsNumber) => {
      return Math.ceil(itemsNumber / freeUsers.length);
    };

    let maxNumberOfItemsForUser = getMaxNumberOfItemsForUser(prepItemsIds.length);

    prepItemsIds.forEach((itemId, i) => {
      const userId = this._defineUserForJob(itemId, freeUsers);
      const allocation = usersAllocation.find(item => item.userId === userId);
      allocation.jobsIds.push(itemId);

      if (allocation.jobsIds.length >= maxNumberOfItemsForUser) {
        freeUsers.splice(freeUsers.indexOf(userId), 1);
        maxNumberOfItemsForUser = getMaxNumberOfItemsForUser(prepItemsIds.length - i - 1);
      }
    });

    return usersAllocation;
  }

  _getUserShift(userId) {
    return Shifts.findOne({
      assignedTo: userId,
      startTime: {$gte: this._timeRange.$gte},
      endTime: {$lte: this._timeRange.$lte}
    });
  }

  _getUserEvents(userId) {
    return CalendarEvents.find({
      userId: userId,
      startTime: {$gte: this._timeRange.$gte},
      endTime: {$lte: this._timeRange.$lte}
    }, {
      sort: {startTime: 1}
    }).fetch();
  }

  _defineTimeForEvent(shift, events, duration) {
    const firstEvent = events[0];
    const secondEvent = events[1];
    let startTime;
    let endTime;

    if (shift) {
      startTime = shift.startTime;
      endTime = moment(startTime).add(duration, 'seconds');

      if (events.length === 0 || endTime.isBefore(firstEvent.startTime)) {
        return {
          startTime: startTime,
          endTime: endTime.toDate()
        };
      }
    }

    startTime = moment(firstEvent.endTime).add(1, 'seconds');
    endTime = moment(firstEvent.endTime).add(duration + 1, 'seconds');

    if (events.length === 1 || endTime.isBefore(secondEvent.startTime)) {
      return {
        startTime: startTime.toDate(),
        endTime: endTime.toDate()
      };
    }

    return this._defineTimeForEvent(null, events.slice(1), duration);
  }

  _addPrepJobEvent(prepItemId, userId, duration) {
    const shift = this._getUserShift(userId);
    const events = this._getUserEvents(userId);
    const eventTimeRange = this._defineTimeForEvent(shift, events, duration);

    const newEvent = {
      itemId: prepItemId,
      type: 'prep job',
      startTime: eventTimeRange.startTime,
      endTime: eventTimeRange.endTime,
      userId: userId,
      shiftId: shift._id,
      locationId: HospoHero.getRelationsObject(this._areaId).locationId,
      isAutomaticallyAllocated: true
    };

    Meteor.call('addCalendarEvent', newEvent);
  }
}

const allocatePrepJobs = (location, date) => {
  PrepJobsAllocator.removeAllocations(location._id, date);

  const areas = Areas.find({locationId: location._id});
  areas.forEach((area) => {
    const prepJobAllocator = new PrepJobsAllocator(area, date);
    prepJobAllocator.allocate();
  });
};

const allocatePrepJobsForWeek = (location) => {
  const sevenDays = _.range(7).map((item, i) => moment().add(i, 'days').toDate());
  sevenDays.forEach(day => allocatePrepJobs(location, day));
};

if (!HospoHero.isDevelopmentMode()) {
  HospoHero.LocationScheduler.addDailyJob('Allocate prep jobs', () => {
    return 4; //4:00 AM
  }, (location) => {
    logger.info('Started prep jobs allocation', {locationId: location._id});
    allocatePrepJobsForWeek(location);
  });
}