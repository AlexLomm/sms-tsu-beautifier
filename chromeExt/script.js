function extractCellInfo(cell){
	if(!$(cell[0]).text().trim() || $(cell[0]).text().trim() === '--------'){ return null; }

	//subject = $(subject).find('tr:nth-child(2)');
	//console.log(subject);

	var extractedCell = [];
	var address = $(cell[1]).children('span').text().split(", ");

	extractedCell['housing']  = address[0].split(':')[1].trim();
	extractedCell['floor']    = address[1].split(':')[1].trim();
	extractedCell['auditory'] = address[2].split(':')[1].trim();

	extractedCell['day']      = $(cell[0]).text().trim();
	extractedCell['time']     = $(cell[2]).text().trim() + ' - ' + $(cell[3]).text().trim();

	//console.log(extractedCell);

	return extractedCell;
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
