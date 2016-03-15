var ScheduleParser = {
	///////////////////////// LEGEND //////////////////////////
	// TABLE    - the table itself, where raw rows are stored
	// SCHEDULE - just a set of ALL activities
    //
	// ROW      - table row, where raw subject is stored
	// SUBJECT  - just a set of activities
    //
	// CELL     - table cell, where raw activity is stored
	// ACTIVITY - (object) lecture, practice, etc
	///////////////////////////////////////////////////////////

    config: {
        // paths
        tablePath: 'html body form table tbody tr td div table.style1 tbody tr td div table tbody tr[style]',
        rowCellPath: 'td',
        rowAttendanceDetailsPath: 'td:nth-child(2)',
        rowSubjectPath: 'span',
        cellAddressPath: 'span',

        // other
        addressSeparator: ', ',
        subAddressesSeparator: ':',
        blankValue: '--------'
    },

    __isBlank: function(cell) {
        var weekDay = $(cell[0]).text().trim();

        // if the field "კვირის დღე:" is blank or equal to some set of dashes, return that the cell is blank
        return !weekDay || weekDay === this.config.blankValue;
    },

    __extractAddress: function(cell) {
        // extract the "კორ:XI, სართ:2, აუდიტ:202" type string from the cell and split it
        var address = $(cell[1]).children(this.config.cellAddressPath).text().split(this.config.addressSeparator);

        return {
            housing:  address[0].split(this.config.subAddressesSeparator)[1].trim(),
            floor:    address[1].split(this.config.subAddressesSeparator)[1].trim(),
            auditory: address[2].split(this.config.subAddressesSeparator)[1].trim()
        }
    },

    __extractDay: function(cell) {
        return $(cell[0]).text().trim();
    },

    __extractStartTime: function(cell) {
        return $(cell[2]).text().trim();
    },

    __extractEndTime: function(cell) {
        return $(cell[3]).text().trim();
    },

    __cellHasCollision: function(cell){
        return $(cell[0]).parent().closest('td').attr('style') === 'background-color:Red;';
    },

    // makes an object from the cell
    produceActivity: function(cell, subjectName, activityType) {
        if (this.__isBlank(cell)) {
            return null;
        }

	    // construct an activity and return it
        return {
	        name: subjectName,
	        type: activityType,
            collides: this.__cellHasCollision(cell),
            address: this.__extractAddress(cell),
            time: {
                weekDay: this.__extractDay(cell),
                startTime: this.__extractStartTime(cell),
                endTime: this.__extractEndTime(cell)
            }
        };
    },


    __extractCells: function(row) {
        return $(row).children(this.config.rowCellPath);
    },

    __extractSubjectName: function(row){
        return $(row[0]).find(this.config.rowSubjectPath).text().trim();
    },


	// TODO: code smell!
	//   function guesses the type of the activity,
	// judging by the cell's column position in the table
    __guessType: function(cellColumnNumber){
        switch(cellColumnNumber){
            case 1: return 'ლექცია';
            case 2: return 'სამ. ჯგუფი';
            case 3: return 'პრაქ.';
            case 4: return 'ლაბ.';
        }
        // if null is returned, something went wrong
        return null;
    },

	// TODO: code smell!
    produceSubject: function(row) {
        var activities = [];

        var subjectName = this.__extractSubjectName(row);
        //activities.push(subjectName);

	    // produce activity and push it into the activities pool
        var activity;
        for (var i = 1; i < row.length; i++) {
	        activity = this.produceActivity(
		        $(row[i]).find(this.config.rowAttendanceDetailsPath), // cell
		        subjectName,                                          // subjectName
		        this.__guessType(i)                                   // activityType
	        );

            if(activity){
                activities.push(activity);
            }
        }
        return activities;
    },

    __extractRows: function(table) {
        var rows = [];

        // the first row is excluded because of irrelevance
        for (var i = 1; i < table.length; i++) {
            rows.push(this.__extractCells(table[i]));
        }
        return rows;
    },


	// predicate helper
    __convertTimeToInt: function(subjectTime){
        var hours   = parseInt(subjectTime.split(':')[0].trim(), 10);
        var minutes = parseInt(subjectTime.split(':')[1].trim(), 10);

        return hours * 60 + minutes;
    },

	// TODO: code smell
	// predicate for sorting subjects
    __compare: function(subjectA, subjectB){
        var aStartTime = ScheduleParser.__convertTimeToInt(subjectA.time.startTime);
        var bStartTime = ScheduleParser.__convertTimeToInt(subjectB.time.startTime);

        if (aStartTime < bStartTime)
            return -1;
        else if (aStartTime > bStartTime)
            return 1;

        //   if the start times of both activities are equal,
        // return the one with the lesser duration
        else {
	        var aEndTime = ScheduleParser.__convertTimeToInt(subjectA.time.endTime);
	        var bEndTime = ScheduleParser.__convertTimeToInt(subjectB.time.endTime);

	        var aDuration = aEndTime - aStartTime;
	        var bDuration = bEndTime - bStartTime;

	        if(aDuration < bDuration)
		        return -1;
	        else
		        return 1;
        }
    },

    produceSchedule: function() {
        var table = $(this.config.tablePath);

        var rows = this.__extractRows(table);

        var schedule = [];
        for (var i = 0; i < rows.length; i++) {
            schedule = $.merge(schedule, this.produceSubject(rows[i]));
        }
        return schedule.sort(this.__compare);
    }
};

//console.log(ScheduleParser.produceSchedule());
