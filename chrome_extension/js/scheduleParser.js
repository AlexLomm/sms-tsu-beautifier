var ScheduleParser = {
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
			housing: address[0].split(this.config.subAddressesSeparator)[1].trim(),
			floor: address[1].split(this.config.subAddressesSeparator)[1].trim(),
			auditory: address[2].split(this.config.subAddressesSeparator)[1].trim()
		}
	},

	__extractDay: function(cell) {
		return $(cell[0]).text().trim();
	},

	__extractStartTime: function(cell) {
		return $(cell[2]).text().trim();
	},

	__extractEndTime: function (cell) {
		return $(cell[3]).text().trim();
	},

	// makes an object from the cell
	extractAttendanceDetails: function (cell) {
		if (this.__isBlank(cell)) {
			return null;
		}

		return {
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

	__extractSubjectData: function(row) {
		var extractedSubjectData = [];

		var subjectTitle = $(row[0]).find(this.config.rowSubjectPath).text().trim();
		extractedSubjectData.push(subjectTitle);

		var attendanceDetails;
		for (var i = 1; i < row.length; i++) {
			attendanceDetails = this.extractAttendanceDetails($(row[i]).find(this.config.rowAttendanceDetailsPath));
			extractedSubjectData.push(attendanceDetails);
		}
		return extractedSubjectData;
	},

	extractSubject: function(row) {
		var subjectInfo = this.__extractSubjectData(row);
		return {
			name: subjectInfo[0],
			lecture: subjectInfo[1],
			work_group: subjectInfo[2],
			practice: subjectInfo[3],
			lab: subjectInfo[4]
		};
	},

	extractRows: function(table) {
		var rows = [];

		// the first row is excluded because of irrelevance
		for (var i = 1; i < table.length; i++) {
			rows.push(this.__extractCells(table[i]));
		}
		return rows;
	},

	extractSchedule: function() {
		var table = $(this.config.tablePath);

		var rows = this.extractRows(table);

		var schedule = [];
		for (var i = 0; i < rows.length; i++) {
			schedule.push(this.extractSubject(rows[i]));
		}
		return schedule;
	}
};

console.log(ScheduleParser.extractSchedule());
