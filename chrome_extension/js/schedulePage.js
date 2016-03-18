var paths = {
	extensionAbsolutePath: chrome.extension.getURL('/'),
	
	schedulePageHtml: 'html/schedule_page.html',
	placeholdersHtml: 'html/schedule_page_placeholders.html',

	oldHtmlMessagesAnchor:   'html body form#aspnetForm table tbody tr td span#ctl00_Label2 a',
	newHtmlMessagesAnchor:   'body > nav > div > ul:nth-child(1) > li:nth-child(3) > a',

	panelAddressSection:     '.panel-heading span',
	panelNameSection:        '.panel-body',
	panelTimeAndTypeSection: '.upper-divider span',
	panelCollisionSection:   '.panel-default',

	funnyPlaceholder: '#placeholder-fun > div',
	regularPlaceholder: '#placeholder-regular > div',

	funModeToggle: 'div.fun-mode input'
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

var themes = {
	availableThemes: ['flatly', 'sandstone', 'slate', 'united'],
	defaultTheme: 'flatly'
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


function __indexWasPreviouslyChosen(randomIndex, chosenIndexes){
	return $.inArray(randomIndex, chosenIndexes) !== -1;
}

function __selectNewRandomImgIndex(chosenIndexes, uniqueness){
	var availableMemesCount = memes.memePlaceholders.length;
	var randomIndex = Math.floor(Math.random() * availableMemesCount);

	if(!uniqueness) return randomIndex;

	// re-choose random index if it was previously chosen
	while(__indexWasPreviouslyChosen(randomIndex, chosenIndexes)){
		randomIndex = (randomIndex + 1) % availableMemesCount;
	}

	return randomIndex;
}

function __selectRandomImgIndexes(unusedWeekdaysCount){
	var uniqueness = memes.memePlaceholders.length >= unusedWeekdaysCount;

	var chosenIndexes = [];
	for (var i = 0; i < unusedWeekdaysCount; i++) {
		chosenIndexes.push(__selectNewRandomImgIndex(chosenIndexes, uniqueness));
	}

	return chosenIndexes;
}

function __replaceWithRandomFunPlaceholders(unusedWeekDays, importedPlaceholders){
	var funnyPlaceholder = __extractElementFromImportedHtml(paths.funnyPlaceholder, importedPlaceholders);
	var randomIndexes = __selectRandomImgIndexes(unusedWeekDays.length);
	console.log(randomIndexes);

	for (var i = 0; i < unusedWeekDays.length; i++) {
		var emptyActivityCell = __extractLastActivityFromH4(unusedWeekDays[i]);

		$(funnyPlaceholder).find('img').attr('src', paths.extensionAbsolutePath + memes.memePlaceholders[randomIndexes[i]]);
		$(emptyActivityCell).replaceWith($(funnyPlaceholder).clone());
	}
}

function __replaceWithRegularPlaceholders(unusedWeekDays, importedPlaceholders){
	var regularPlaceholder = __extractElementFromImportedHtml(paths.regularPlaceholder, importedPlaceholders);

	var currentSrc = $(regularPlaceholder).find('img').attr('src');
	$(regularPlaceholder).find('img').attr('src', paths.extensionAbsolutePath + currentSrc);

	for (var i = 0; i < unusedWeekDays.length; i++) {
		var lastActivity = __extractLastActivityFromH4(unusedWeekDays[i]);
		lastActivity.replaceWith($(regularPlaceholder).clone());
	}
}

function addPlaceholders(unusedWeekdays){
	chrome.storage.sync.get('funMode', function(data) {
		data.funMode = !!data.funMode;

		$.get(chrome.extension.getURL(paths.placeholdersHtml), function (importedPlaceholders) {
			if(data.funMode){
				__replaceWithRandomFunPlaceholders(unusedWeekdays, importedPlaceholders);
			} else {
				__replaceWithRegularPlaceholders(unusedWeekdays, importedPlaceholders);
			}
		});
	});
}


function __saveOption(optionName, optionValue){
	var option = {};
	option[optionName] = optionValue;

	chrome.storage.sync.set(option);
}

function __getSavedOption(optionName, handlerFunction){
	chrome.storage.sync.get(optionName, handlerFunction);
}

function __selectedThemeIsCorrect(selectedTheme){
	for (var i = 0; i < themes.availableThemes.length; i++) {
		if(themes.availableThemes[i] === selectedTheme) {
			return true;
		}
	}
	__saveOption('theme', themes.defaultTheme);
	return false;
}

function __highlightSelectedTheme(selectedTheme){
	// clear highlightion of previously selected themes
	$('div.theme-selectors > div span.theme-selected').removeClass('theme-selected');

	$('div.custom-dropdown-item span[data-value="' + selectedTheme + '"]').addClass('theme-selected');
}

function __changeStylesheets(themeName){
	// TODO: remove
	$($('link')[1]).attr('href', paths.extensionAbsolutePath + 'css/style.css');

	$('link[data-theme="main"]').attr('href', paths.extensionAbsolutePath + 'css/bootstrap/css/' + themeName + '.min.css');
	$('link[data-theme="secondary"]').attr('href', paths.extensionAbsolutePath + 'css/themes/' + themeName + '.css');
}

function __activateUserChosenTheme(data){
	// select the saved theme, if it does not exist, keep the default one
	var selectedTheme = themes.defaultTheme;
	if(data.theme && __selectedThemeIsCorrect(data.theme)){
		selectedTheme = data.theme;
	}

	__changeStylesheets(selectedTheme);
	__highlightSelectedTheme(selectedTheme);
}

function __activateUserChosenMode(data){
	$(paths.funModeToggle).prop('checked', !!data.funMode);
}

function __dynamicallyActivateUserChosenTheme(){
	// changes the theme dynamically when the button is clicked
	$('div.theme-selectors > div').on('click', 'span', function(){
		var selectedTheme = $(this).data('value');
		__changeStylesheets(selectedTheme);
		__highlightSelectedTheme(selectedTheme);
		__saveOption('theme', selectedTheme);
	});
}

function __dynamicallyActivateUserChosenMode(){
	$('div.fun-mode').on('click', 'input', function(){
		__saveOption('funMode', $(this).prop('checked'));
		location.reload();
	});
}

function __findUnusedWeekdays(activitiesGroupedByWeekdays){
	var usedWeekdays = Object.keys(activitiesGroupedByWeekdays);

	// unused week days will be those days which are not used
	// in activitiesGroupedByWeekdays as keys (Smartass logic ;))
	return $(allWeekdays).not(usedWeekdays).get();
}

function addEventListeners(){
	__getSavedOption('theme', __activateUserChosenTheme);
	__getSavedOption('funMode', __activateUserChosenMode);

	__dynamicallyActivateUserChosenTheme();
	__dynamicallyActivateUserChosenMode();
}


$.get(chrome.extension.getURL(paths.schedulePageHtml), function(importedHtml) {
	var scheduleData = ScheduleParser.produceSchedule();
	var incomingMessagesCount = __extractIncomingMessagesCount();

	overwriteCurrentLayout(importedHtml);
	var activitiesGroupedByWeekdays = __groupActivitiesByWeekDays(scheduleData);
	displaySchedule(activitiesGroupedByWeekdays);
	displayIncomingMessages(incomingMessagesCount);

	addPlaceholders(__findUnusedWeekdays(activitiesGroupedByWeekdays));
	addEventListeners();
});
