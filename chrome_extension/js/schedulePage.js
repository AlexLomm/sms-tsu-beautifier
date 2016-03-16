var paths = {
	shedulePageHtml: 'html/schedulePage.html',

	oldMessagesAnchor:       'html body form#aspnetForm table tbody tr td span#ctl00_Label2 a',
	newMessagesAnchor:       '#body > nav > div > ul:nth-child(2) > li:nth-child(3) > a',

	panelAddressSection:     '.panel-heading span',
	panelNameSection:        '.panel-body',
	panelTimeAndTypeSection: '.upper-divider span',
	panelCollisionSection:   '.panel-default'
};


function __extractIncomingMessagesCount(){
    var messagesLinkTag = $(paths.oldMessagesAnchor);

	// if there are no messages return null
    if(!messagesLinkTag.length){
        return null;
    }
	// if there are messages present, return their count
    return parseInt(messagesLinkTag.text().replace(/[^0-9\.]/g, ''), 10);
}

function displayIncomingMessages(incomingMessageCount){
	if(incomingMessageCount){
		var newMessagesAnchor = $(paths.newMessagesAnchor);
		newMessagesAnchor.append($('<span class="badge">' + incomingMessageCount + '</span>'));
	}
}


function __populateAddressSection(activityDiv, activity){
	var panelAddressSection  = activityDiv.find(paths.panelAddressSection);

	panelAddressSection[0].innerHTML = activity.address.auditory;
	panelAddressSection[1].innerHTML = activity.address.floor;
	panelAddressSection[2].innerHTML = activity.address.housing;
}

function __populateNameSection(activityDiv, activity){
	var panelNameSection = activityDiv.find(paths.panelNameSection);

	panelNameSection[0].innerHTML = activity.name;
}

function __populateTimeAndTypeSection(activityDiv, activity){
	var panelTimeAndTypeSection  = activityDiv.find(paths.panelTimeAndTypeSection);

	panelTimeAndTypeSection[0].innerHTML = activity.time.startTime + ' - ' + activity.time.endTime;
	panelTimeAndTypeSection[1].innerHTML = activity.type;
}

function __markCollision(activityDiv){
	activityDiv.find(paths.panelCollisionSection).addClass('collision');
}

function __populateActivityDiv(activityDiv, activity){
	__populateAddressSection(activityDiv, activity);
	__populateNameSection(activityDiv, activity);
	__populateTimeAndTypeSection(activityDiv, activity);

	// mark activity with red color if it has collisions
	if(activity.collides){
		__markCollision(activityDiv);
	}
}

function populateWeekdayColumn(activityDiv, weekdayActivities){
	//   after a div is populated, creates it's clone
	// and inserts it before the original div
	__populateActivityDiv(activityDiv, weekdayActivities[0]);

	for(var j = 1; j < weekdayActivities.length; j++){
		activityDiv.before(activityDiv.clone());
		__populateActivityDiv(activityDiv, weekdayActivities[j]);
	}
}


function __extractHead(importedHtml){
	return $.parseHTML(importedHtml, true)[1].innerHTML;
}

function __extractBody(importedHtml){
	return $.parseHTML(importedHtml, true)[3].innerHTML;
}

function overwriteCurrentLayout(importedHtml){
	//  innerHTMLs are used to ignore div#head and div#body tags, which
	// wrap the imported head and body
	$('head').empty().append(__extractHead(importedHtml));
	$('body').empty().removeAttr('style').append(__extractBody(importedHtml));
}


function __groupActivitiesByWeekDays(scheduleData){
	//   The function extracts weekDays one by one from all the activities present in scheduleData,
	// pushing the activity into it's corresponding weekday array in groupedByWeekdays
	var activitiesByWeekdays = {};
	for(var i = 0; i < scheduleData.length; i++){
		var key = scheduleData[i].time.weekDay;
		if(!activitiesByWeekdays[key]){
			activitiesByWeekdays[key] = [];
		}
		activitiesByWeekdays[key].push(scheduleData[i]);
	}
	return activitiesByWeekdays;
}

function displaySchedule(activitiesByWeekdays){
	var weekdays = Object.keys(activitiesByWeekdays);

	for(var i = 0; i < weekdays.length; i++){
		var activityDiv = $('h4:contains(' + weekdays[i] + ')').parent().siblings(":last");
		populateWeekdayColumn(activityDiv, activitiesByWeekdays[weekdays[i]]);
	}
}


$.get(chrome.extension.getURL(paths.shedulePageHtml), function(importedHtml) {
	var scheduleData = ScheduleParser.produceSchedule();
	var incomingMessageCount = __extractIncomingMessagesCount();

	overwriteCurrentLayout(importedHtml);
	var activitiesByWeekdays = __groupActivitiesByWeekDays(scheduleData);
	displaySchedule(activitiesByWeekdays);
	displayIncomingMessages(incomingMessageCount);
});
