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

function __extractTime(cell){
	return $(cell[2]).text().trim() + ' - ' + $(cell[3]).text().trim();
}

function extractCellInfo(cell){
	if(__isBlank(cell)){ return null; }

	return {
		address : __extractAddress(cell),
		day     : __extractDay(cell),
		time    : __extractTime(cell)
	};
}

function extractRows(table){
	var rows = [];
	for(var i = 1; i < table.length; i++){
		rows.push($(table[i]).children('td'));
	}
	return rows;
}

function extractSubject(row){
	return {
		name:       $(row[0]).find('span').text().trim(),
		lecture:    extractCellInfo($(row[1]).find('td:nth-child(2)')),
		work_group: extractCellInfo($(row[2]).find('td:nth-child(2)')),
		practice:   extractCellInfo($(row[3]).find('td:nth-child(2)')),
		lab:        extractCellInfo($(row[4]).find('td:nth-child(2)'))
	};
}


function extractTheSchedule(){
	var table = $('html body form table tbody tr td div table.style1 tbody tr td div table tbody tr[style]');
	var rows = extractRows(table);

	var schedule = [];
	for(var i = 0; i < rows.length; i++){
		schedule.push(extractSubject(rows[i]));
	}
	return schedule;
}

console.log(extractTheSchedule());
