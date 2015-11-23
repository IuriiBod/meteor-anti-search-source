var ShiftDocument = Match.Where(function (shift) {
    check(shift, {
        startTime: Date,
        endTime: Date,
        shiftDate: Date,
        type: Match.OneOf(String, null),

        //optional properties
        _id: HospoHero.checkers.OptionalMongoId,
        section: HospoHero.checkers.OptionalNullableMongoId,
        createdBy: HospoHero.checkers.OptionalNullableMongoId,
        assignedTo: HospoHero.checkers.OptionalNullableMongoId,
        assignedBy: HospoHero.checkers.OptionalNullableMongoId,
        jobs: Match.Optional([HospoHero.checkers.MongoId]),
        status: Match.Optional(Match.OneOf('draft', 'started', 'finished')),
        published: Match.Optional(Boolean),
        publishedOn: Match.Optional(Number),
        startedAt: Match.Optional(Date),
        finishedAt: Match.Optional(Date),
        order: Match.Optional(Number),
        relations: Match.Optional(HospoHero.checkers.Relations)
    });

    var checkerHelper = new HospoHero.checkerUtils.DocumentCheckerHelper(shift, Shifts);

    checkerHelper.checkPropertiesGroup(['startTime', 'endTime'], function () {
        if (shift.startTime.getTime() > shift.endTime.getTime()) {
            throw new Meteor.Error("'Start time' should be less then 'end time'");
        }
    });

    checkerHelper.checkPropertiesGroup(['startedAt', 'finishedAt'], function () {
        if (shift.startedAt > shift.finishedAt) {
            throw new Meteor.Error("Started time should be less then finished");
        }
    });


    //check if worker already assigned
    if (shift.assignedTo) {

        var assignedUserId = shift.assignedTo;
        var occupiedTimeRange = TimeRangeQueryBuilder.forInterval(shift.startTime, shift.endTime);

        checkerHelper.checkPropertiesGroup(['startTime', 'endTime'], function () {
            var findInTimeRanges = [{
                startDate: occupiedTimeRange
            }, {
                endDate: occupiedTimeRange
            }, {
                startDate: {$lte: shift.startTime},
                endDate: {$gte: shift.endTime}
            }
            ];
            var isUserHasUnavailability = !!Meteor.users.findOne({
                _id: assignedUserId,
                unavailabilities: {
                    $elemMatch: {
                        $or: findInTimeRanges
                    }
                }
            });

            var isUserHasApprovedLeaveRequest = !!LeaveRequests.findOne({
                userId: assignedUserId,
                status: "approved",
                $or: findInTimeRanges
            });

            if (isUserHasUnavailability || isUserHasApprovedLeaveRequest) {
                logger.error("User unavailable at selected time", {
                    "startTime": shift.startTime,
                    "endTime": shift.endTime
                });
                throw new Meteor.Error('This user unavailable at this time!');
            }
        });

        checkerHelper.checkPropertiesGroup(['assignedTo', 'shiftDate'], function () {
            var assignedWorker = Meteor.users.findOne({_id: assignedUserId});
            if (!assignedWorker) {
                logger.error("Worker not found");
                throw new Meteor.Error(404, "Worker not found");
            }

            var existInShift = !!Shifts.findOne({
                _id: {$ne: shift._id},
                $or: [
                    {startTime: occupiedTimeRange},
                    {endTime: occupiedTimeRange},
                    {
                        startTime: {$lte: shift.startTime},
                        endTime: {$gte: shift.endTime}
                    }
                ],
                assignedTo: assignedUserId
            });
            if (existInShift) {
                logger.error("User already exist in a shift", {"date": shift.shiftDate});
                throw new Meteor.Error(404, "Worker has already been assigned to a shift");
            }
        });

        if (shift.section) {
            checkerHelper.checkPropertiesGroup(['assignedTo', 'section'], function () {
                if (!Meteor.users.findOne({_id: shift.assignedTo, 'profile.sections': shift.section})) {
                    logger.error("User not trained for this section", {"sectionId": shift.section});
                    throw new Meteor.Error(404, "User not trained for this section");
                }
            });
        }
    }

    return true;
});

Namespace('HospoHero.checkers', {
    /**
     * Shift document checker
     */
    ShiftDocument: ShiftDocument
});


/*
 * var occupiedTimeRange = TimeRangeQueryBuilder.forInterval(shift.startTime, shift.endTime);

 var assignedUserId = shift.assignedTo;
 var isUserHasUnavailability = !!Meteor.users.findOne({_id: assignedUserId,
 unavailabilities: {
 $elemMatch: {
 $or: [
 {
 startDate: occupiedTimeRange
 },
 {
 endDate: occupiedTimeRange
 },
 {
 startDate: {$lte: shift.startTime},
 endDate: {$gte: shift.endTime}
 }]
 }
 }
 });

 var isUserHasApprovedLeaveRequest = !!LeaveRequests.findOne({
 userId: assignedUserId,
 status: "approved",
 $or: [
 {
 startDate: occupiedTimeRange
 },
 {
 endDate: occupiedTimeRange
 },
 {
 startDate: {$lte: shift.startTime},
 endDate: {$gte: shift.endTime}
 }]
 });

 if(isUserHasUnavailability || isUserHasApprovedLeaveRequest) {
 throw new Meteor.Error('This user unavailable at this time!')
 }
 * */