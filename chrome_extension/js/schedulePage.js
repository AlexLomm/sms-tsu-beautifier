var paths = {
	shedulePageHtml: 'html/schedule_page.html',
	placeholdersHtml: 'html/schedule_page_placeholders.html',

	oldHtmlMessagesAnchor:   'html body form#aspnetForm table tbody tr td span#ctl00_Label2 a',
	newHtmlMessagesAnchor:   'body > nav > div > ul:nth-child(1) > li:nth-child(3) > a',

	panelAddressSection:     '.panel-heading span',
	panelNameSection:        '.panel-body',
	panelTimeAndTypeSection: '.upper-divider span',
	panelCollisionSection:   '.panel-default'
};

var allWeekdays = ['ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];

var memes = {
	trollFace: 'img/peekingTrollface.png',
	memePlaceholders: [
		'img/foreverAlone.png',
		'img/freddie.png',
		'img/fuckYeah.png',
		'img/lolGuy.png',
		'img/meGusta.png',
		'img/obama.png',
		'img/ohGodWhy.png',
		'img/slyMan.png',
		'img/yaoMing.png'
	]
};


function __extractIncomingMessagesCount(){
    var messagesLinkTag = $(paths.oldHtmlMessagesAnchor);

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


function __extractElementFromImportedHtml(elementSelector, importedHtml){
	return $(elementSelector, $(importedHtml));
}

function __extractHead(importedHtml){
	return __extractElementFromImportedHtml('#head', importedHtml)[0].innerHTML;
}

function __extractBody(importedHtml){
	return __extractElementFromImportedHtml('#body', importedHtml)[0].innerHTML;
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

function __extractLastActivityFromH4(weekday){
	return $('h4:contains(' + weekday + ')').parent().siblings(":last");
}

function displaySchedule(activitiesByWeekdays){
	var weekdays = Object.keys(activitiesByWeekdays);

	for(var i = 0; i < weekdays.length; i++){
		var activityDiv = __extractLastActivityFromH4(weekdays[i]);
		populateWeekdayColumn(activityDiv, activitiesByWeekdays[weekdays[i]]);
	}
}


function __chooseRandomFunnyPlaceholder(usedIndexes, unusedDaysCount){
	var memesCount = memes.memePlaceholders.length;
	var chooseUniqueIndexes = true;

	if(memesCount < unusedDaysCount){ chooseUniqueIndexes = false }

	var randomIndex = Math.floor(Math.random() * memesCount);
	if(chooseUniqueIndexes) {
		while($.inArray(randomIndex, usedIndexes) !== -1){
			randomIndex = (randomIndex + 1) % memesCount;
		}
		usedIndexes.push(randomIndex);
	}
	return memes.memePlaceholders[randomIndex];
}

function __randomizeFunnyPlaceholder(lastActivity, funnyPlaceholder, memeUrl){
	$(funnyPlaceholder).find('img').attr('src', memeUrl);
	$(lastActivity).replaceWith(funnyPlaceholder);
}

function __replaceWithFunnyPlaceholders(unusedWeekDays, importedPlaceholders){
	var funnyPlaceholder = __extractElementFromImportedHtml('#placeholder-fun > div', importedPlaceholders);
	var usedIndexes = [];

	for (var i = 0; i < unusedWeekDays.length; i++) {
		var lastActivity = __extractLastActivityFromH4(unusedWeekDays[i]);
		__randomizeFunnyPlaceholder(lastActivity, funnyPlaceholder,  __chooseRandomFunnyPlaceholder(usedIndexes, unusedWeekDays.length));
	}
}

function __replaceWithRegularPlaceholders(unusedWeekDays, importedPlaceholders){
	var regularPlaceholder = __extractElementFromImportedHtml('#placeholder-regular > div', importedPlaceholders);

	for (var i = 0; i < unusedWeekDays.length; i++) {
		var lastActivity = __extractLastActivityFromH4(unusedWeekDays[i]);
		lastActivity.replaceWith(regularPlaceholder);
	}
}

function __findOutUnusedWeekdays(activitiesGroupedByWeekdays){
	var usedWeekdays = Object.keys(activitiesGroupedByWeekdays);

	// unused week days will be those days which are not used
	// in activitiesGroupedByWeekdays as keys (Smartass logic ;))
	return $(allWeekdays).not(usedWeekdays).get();
}

function addPlaceholders(unusedWeekdays){
	chrome.storage.sync.get('funMode', function(data) {
		data.funMode = !!data.funMode;

		$.get(chrome.extension.getURL(paths.placeholdersHtml), function (importedPlaceholders) {
			if(data.funMode){
				__replaceWithFunnyPlaceholders(unusedWeekdays, importedPlaceholders);
			} else {
				__replaceWithRegularPlaceholders(unusedWeekdays, importedPlaceholders);
			}
		});
	});
}


$.get(chrome.extension.getURL(paths.shedulePageHtml), function(importedHtml) {
	var scheduleData = ScheduleParser.produceSchedule();
	var incomingMessagesCount = __extractIncomingMessagesCount();

	overwriteCurrentLayout(importedHtml);
	var activitiesGroupedByWeekdays = __groupActivitiesByWeekDays(scheduleData);
	displaySchedule(activitiesGroupedByWeekdays);
	displayIncomingMessages(incomingMessagesCount);

	addPlaceholders(__findOutUnusedWeekdays(activitiesGroupedByWeekdays));
});
