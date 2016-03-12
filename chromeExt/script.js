var config = {
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
};

// TODO: move the code into separate classes
function __isBlank(cell){
	var weekDay = $(cell[0]).text().trim();

	// if the field "კვირის დღე:" is blank or equal to some set of dashes, return that the cell is blank
	return !weekDay || weekDay === config.blankValue;
}

function __extractAddress(cell){
	// extract the "კორ:XI, სართ:2, აუდიტ:202" type string from the cell and split it
	var address = $(cell[1]).children(config.cellAddressPath).text().split(config.addressSeparator);

	return {
		housing  : address[0].split(config.subAddressesSeparator)[1].trim(),
		floor    : address[1].split(config.subAddressesSeparator)[1].trim(),
		auditory : address[2].split(config.subAddressesSeparator)[1].trim()
	}
}

function __extractDay(cell){
	return $(cell[0]).text().trim();
}

function __extractStartTime(cell){
	return $(cell[2]).text().trim();
}

function __extractEndTime(cell){
	return $(cell[3]).text().trim();
}

// makes an object from the cell
function extractAttendanceDetails(cell){
	if(__isBlank(cell)){ return null; }

	return {
		address   : __extractAddress(cell),
		day       : __extractDay(cell),
		startTime : __extractStartTime(cell),
		endTime   : __extractEndTime(cell)
	};
}


function __extractCells(row){
	return $(row).children(config.rowCellPath);
}

function __extractSubjectData(row){
	var extractedSubjectData = [];

	var subjectTitle = $(row[0]).find(config.rowSubjectPath).text().trim();
	extractedSubjectData.push(subjectTitle);

	var attendanceDetails;
	for(var i = 1; i < row.length; i++){
		attendanceDetails = extractAttendanceDetails($(row[i]).find(config.rowAttendanceDetailsPath));
		extractedSubjectData.push(attendanceDetails);
	}
	return extractedSubjectData;
}

function extractSubject(row){
	var subjectInfo = __extractSubjectData(row);
	return {
		name:       subjectInfo[0],
		lecture:    subjectInfo[1],
		work_group: subjectInfo[2],
		practice:   subjectInfo[3],
		lab:        subjectInfo[4]
	};
}


function extractRows(table){
	var rows = [];

	// the first row is excluded because of irrelevance
	for(var i = 1; i < table.length; i++){
		rows.push(__extractCells(table[i]));
	}
	return rows;
}


function extractSchedule(){
	var table = $(config.tablePath);

	var rows = extractRows(table);

	var schedule = [];
	for(var i = 0; i < rows.length; i++){
		schedule.push(extractSubject(rows[i]));
	}
	return schedule;
}

console.log(extractSchedule());
