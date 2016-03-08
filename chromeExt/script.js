// TODO: move the code into separate classes
function __isBlank(cell){
	var weekDay = $(cell[0]).text().trim();

	// if cell კვირის დღე: is blank or equal to dashes, return that the cell is blank
	return !weekDay || weekDay === '--------';
}

function __extractAddress(cell){
	// extract the კორ:XI, სართ:2, აუდიტ:202 type string from the cell and split it
	var address = $(cell[1]).children('span').text().split(", ");

	return {
		housing  : address[0].split(':')[1].trim(),
		floor    : address[1].split(':')[1].trim(),
		auditory : address[2].split(':')[1].trim()
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
function extractActivity(cell){
	if(__isBlank(cell)){ return null; }

	return {
		address   : __extractAddress(cell),
		day       : __extractDay(cell),
		startTime : __extractStartTime(cell),
		endTime   : __extractEndTime(cell)
	};
}


function __extractCells(row){
	return $(row).children('td');
}

function __extractSubjectInfo(row){
	var subjectInfo = [];

	subjectInfo.push($(row[0]).find('span').text().trim());

	for(var i = 1; i < row.length; i++){
		subjectInfo.push(extractActivity($(row[i]).find('td:nth-child(2)')));
	}
	return subjectInfo;
}

function extractSubject(row){
	var subjectInfo = __extractSubjectInfo(row);
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

	// the first row is excluded, because of irrelevance
	for(var i = 1; i < table.length; i++){
		rows.push(__extractCells(table[i]));
	}
	return rows;
}


function extractSchedule(){
	var table = $('html body form table tbody tr td div table.style1 tbody tr td div table tbody tr[style]');

	var rows = extractRows(table);

	var schedule = [];
	for(var i = 0; i < rows.length; i++){
		schedule.push(extractSubject(rows[i]));
	}
	return schedule;
}

console.log(extractSchedule());
