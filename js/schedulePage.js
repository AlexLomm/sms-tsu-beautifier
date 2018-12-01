var paths = {
  extensionAbsolutePath: chrome.extension.getURL('/'),

  schedulePageHtml: 'html/schedule_page.html',
  placeholdersHtml: 'html/schedule_page_placeholders.html',

  oldHtmlMessagesAnchor: 'html body form#aspnetForm table tbody tr td span#ctl00_Label2 a',
  newHtmlMessagesAnchor: 'body > nav > div > ul:nth-child(1) > li:nth-child(3) > a',

  panelAddressSection: '.panel-heading span',
  panelNameSection: '.panel-body',
  panelTimeAndTypeSection: '.upper-divider span',
  panelCollisionSection: '.panel-default',

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

// GENERIC HELPERS
function extractElementFromImportedHtml(elementSelector, importedHtml) {
  return $(elementSelector, $(importedHtml));
}

function extractLastActivityFromH4(weekday) {
  return $('h4:contains(' + weekday + ')').parent().siblings(':last').children('div');
}

function saveOption(optionName, optionValue) {
  var option         = {};
  option[optionName] = optionValue;

  chrome.storage.sync.set(option);
}

function getSavedOption(optionName, callback) {
  chrome.storage.sync.get(optionName, callback);
}

// LAYOUT OVERWRITING
function __extractHead(importedHtml) {
  return extractElementFromImportedHtml('#head', importedHtml)[0].innerHTML;
}

function __extractBody(importedHtml) {
  return extractElementFromImportedHtml('#body', importedHtml)[0].innerHTML;
}

function overwriteCurrentLayout(importedHtml) {
  //  innerHTMLs are used to ignore div#head and div#body tags, which
  // wrap the imported head and body
  $('head').empty().append(__extractHead(importedHtml));
  $('body').empty().removeAttr('style').append(__extractBody(importedHtml));
}

// MESSAGES (e.g: წერილები (2))
function __extractIncomingMessagesCount() {
  var messagesLinkTag = $(paths.oldHtmlMessagesAnchor);

  // if there are no messages return null
  if (!messagesLinkTag.length) {
    return null;
  }
  // if there are messages present, return their count
  return parseInt(messagesLinkTag.text().replace(/[^0-9\.]/g, ''), 10);
}

function displayIncomingMessages(incomingMessageCount) {
  if (incomingMessageCount) {
    $(paths.newHtmlMessagesAnchor).append($('<span class="badge">' + incomingMessageCount + '</span>'));
  }
}

// POPULATING NEW LAYOUT
function __populateAddressSection(activityDiv, activity) {
  var panelAddressSection = activityDiv.find(paths.panelAddressSection);

  panelAddressSection[0].innerHTML = activity.address.auditory;
  panelAddressSection[1].innerHTML = activity.address.floor;
  panelAddressSection[2].innerHTML = activity.address.housing;
}

function __populateNameSection(activityDiv, activity) {
  var panelNameSection = activityDiv.find(paths.panelNameSection);

  panelNameSection[0].innerHTML = activity.name;
}

function __populateTimeAndTypeSection(activityDiv, activity) {
  var panelTimeAndTypeSection = activityDiv.find(paths.panelTimeAndTypeSection);

  panelTimeAndTypeSection[0].innerHTML = activity.time.startTime + ' - ' + activity.time.endTime;
  panelTimeAndTypeSection[1].innerHTML = activity.type;
}

function __markCollisionIfNeeded(activityDiv, activity) {
  if (activity.collides) {
    activityDiv.find(paths.panelCollisionSection).addClass('collision');
  } else {
    // class removal is needed, because if previous div was marked, this activity
    // div will also be marked, as it is an EXACT COPY OF THE PREVIOUS DIV
    activityDiv.find(paths.panelCollisionSection).removeClass('collision');
  }
}

function __populateActivityDiv(activityDiv, activity) {
  __populateAddressSection(activityDiv, activity);
  __populateNameSection(activityDiv, activity);
  __populateTimeAndTypeSection(activityDiv, activity);
  __markCollisionIfNeeded(activityDiv, activity);
}

function __populateWeekdayColumn(activityDiv, weekdayActivities) {
  //   after a div is populated, creates it's clone
  // and inserts it before the original div
  __populateActivityDiv(activityDiv, weekdayActivities[0]);

  for (var j = 1; j < weekdayActivities.length; j++) {
    activityDiv.before(activityDiv.clone());
    __populateActivityDiv(activityDiv, weekdayActivities[j]);
  }
}

function displaySchedule(activitiesByWeekdays) {
  var weekdays = Object.keys(activitiesByWeekdays);

  for (var i = 0; i < weekdays.length; i++) {
    var activityDiv = extractLastActivityFromH4(weekdays[i]);
    //console.log(activityDiv.clone())
    __populateWeekdayColumn(activityDiv, activitiesByWeekdays[weekdays[i]]);
  }
}

// THEMES
function __selectedThemeIsCorrect(selectedTheme) {
  for (var i = 0; i < themes.availableThemes.length; i++) {
    if (themes.availableThemes[i] === selectedTheme) {
      return true;
    }
  }
  saveOption('theme', themes.defaultTheme);
  return false;
}

function __highlightSelectedTheme(selectedTheme) {
  // clear highlightion of previously selected themes
  $('div.theme-selectors > div span.theme-selected').removeClass('theme-selected');

  $('div.custom-dropdown-item span[data-value="' + selectedTheme + '"]').addClass('theme-selected');
}

function __changeStylesheets(themeName) {
  // TODO: remove
  $($('link')[1]).attr('href', paths.extensionAbsolutePath + 'css/style.css');

  $('link[data-theme="main"]').attr('href', paths.extensionAbsolutePath + 'css/bootstrap/css/' + themeName + '.min.css');
  $('link[data-theme="secondary"]').attr('href', paths.extensionAbsolutePath + 'css/themes/' + themeName + '.css');
}

function activateChosenTheme() {
  getSavedOption('theme', function (data) {
    // select the saved theme, if it does not exist, keep the default one
    var selectedTheme = themes.defaultTheme;
    if (data.theme && __selectedThemeIsCorrect(data.theme)) {
      selectedTheme = data.theme;
    }

    __changeStylesheets(selectedTheme);
    __highlightSelectedTheme(selectedTheme);
  });
}

function respondToThemeChoice() {
  // changes the theme dynamically when the button is clicked
  $('div.theme-selectors > div').on('click', 'span', function () {
    $('body').css('display', 'none'); // to prevent flickering when changing themes
    var selectedTheme = $(this).data('value');
    __changeStylesheets(selectedTheme);
    __highlightSelectedTheme(selectedTheme);
    saveOption('theme', selectedTheme);
    $('body').css('display', 'initial'); // to prevent flickering when changing themes
  });
}

// MODES
function __findUnusedWeekdays(activitiesGroupedByWeekdays) {
  var usedWeekdays = Object.keys(activitiesGroupedByWeekdays);

  // unused week days will be those days which are not used
  // in activitiesGroupedByWeekdays as keys (Smartass logic ;))
  return $(allWeekdays).not(usedWeekdays).get();
}

function __indexWasPreviouslyChosen(randomIndex, chosenIndexes) {
  return $.inArray(randomIndex, chosenIndexes) !== -1;
}

function __selectNewRandomImgIndex(chosenIndexes, uniqueness) {
  var availableMemesCount = memes.memePlaceholders.length;
  var randomIndex         = Math.floor(Math.random() * availableMemesCount);

  if (!uniqueness) return randomIndex;

  // re-choose random index if it was previously chosen
  while (__indexWasPreviouslyChosen(randomIndex, chosenIndexes)) {
    randomIndex = (randomIndex + 1) % availableMemesCount;
  }

  return randomIndex;
}

function __selectRandomImgIndexes(unusedWeekdaysCount) {
  var uniqueness = memes.memePlaceholders.length >= unusedWeekdaysCount;

  var chosenIndexes = [];
  for (var i = 0; i < unusedWeekdaysCount; i++) {
    chosenIndexes.push(__selectNewRandomImgIndex(chosenIndexes, uniqueness));
  }

  return chosenIndexes;
}

function __replaceWithRandomFunnyPlaceholders(unusedWeekDays, importedPlaceholders) {
  var funnyPlaceholder = extractElementFromImportedHtml(paths.funnyPlaceholder, importedPlaceholders);
  var randomIndexes    = __selectRandomImgIndexes(unusedWeekDays.length);

  for (var i = 0; i < unusedWeekDays.length; i++) {
    var emptyActivityCell = extractLastActivityFromH4(unusedWeekDays[i]);

    $(funnyPlaceholder).find('img').attr('src', paths.extensionAbsolutePath + memes.memePlaceholders[randomIndexes[i]]);
    $(emptyActivityCell).replaceWith($(funnyPlaceholder).clone());
  }
}

function __replaceWithRegularPlaceholders(unusedWeekDays, importedPlaceholders) {
  var regularPlaceholder = extractElementFromImportedHtml(paths.regularPlaceholder, importedPlaceholders);

  var currentSrc = $(regularPlaceholder).find('img').attr('src');
  $(regularPlaceholder).find('img').attr('src', paths.extensionAbsolutePath + currentSrc);

  for (var i = 0; i < unusedWeekDays.length; i++) {
    var lastActivity = extractLastActivityFromH4(unusedWeekDays[i]);
    lastActivity.replaceWith($(regularPlaceholder).clone());
  }
}

function __applyMode(funModeStatus, unusedWeekDays, importedPlaceholders) {
  // apply regular or fun mode depending on what user chose in previous session
  if (funModeStatus) {
    __markCollisionWithTrollface();
    __replaceWithRandomFunnyPlaceholders(unusedWeekDays, importedPlaceholders);
  } else {
    __undoMarkCollisionTrollface();
    __replaceWithRegularPlaceholders(unusedWeekDays, importedPlaceholders);
  }
}

function __toggleFunModeButton(data) {
  $(paths.funModeToggle).prop('checked', !!data.funMode);
}

function __markCollisionWithTrollface() {
  // choose divs that have .collision class and are not located immediately
  // after <h4>weekday</h4>s
  var trollingCandidates = $('div:not(:first-child) > div.collision');
  var randomIndex        = Math.floor(Math.random() * trollingCandidates.length);
  var chosenCollisionDiv = $(trollingCandidates[randomIndex]);

  // create trollface img element
  var trollFaceImg = $('<img id="troll" src="img/peekingTrollface.png" alt="They see me trollin, they hatin">');
  trollFaceImg.attr('src', paths.extensionAbsolutePath + trollFaceImg.attr('src'));

  // calculate position of trollface img, for example margin-left:-17px, or 43px, etc
  var randomOffset = Math.floor(Math.random() * 80);
  trollFaceImg.css('margin-left', randomOffset.toString() + 'px');

  // add the trollface img before chosenCollisionDiv
  chosenCollisionDiv.before(trollFaceImg);

  // add margin-top -20px to compensate for trollface img height
  chosenCollisionDiv.parent().css('margin-top', '-20px');
}

function __undoMarkCollisionTrollface() {
  // find the trollface img
  var trollImg = $('#troll');

  // remove margin from it's parrent
  trollImg.parent().css('margin-top', '');

  // remove the trollface img itself
  trollImg.remove();
}

function activateChosenMode(unusedWeekDays) {
  getSavedOption('funMode', function (data) {
    var funModeStatus = !!data.funMode;

    $.get(chrome.extension.getURL(paths.placeholdersHtml), function (importedPlaceholders) {
      __applyMode(funModeStatus, unusedWeekDays, importedPlaceholders);
      //  toggle mode selector button
      getSavedOption('funMode', __toggleFunModeButton);
    });
  });
}

function respondToModeChoice(unusedWeekDays) {
  $('div.fun-mode').on('click', 'input', function () {
    var funModeStatus = $(this).prop('checked');

    $.get(chrome.extension.getURL(paths.placeholdersHtml), function (importedPlaceholders) {
      __applyMode(funModeStatus, unusedWeekDays, importedPlaceholders);
      saveOption('funMode', funModeStatus);
    });
  });
}

// MAIN
function __groupActivitiesByWeekDays(scheduleData) {
  //   The function extracts weekDays one by one from all the activities present in scheduleData,
  // pushing the activity into it's corresponding weekday array in groupedByWeekdays
  var activitiesByWeekdays = {};
  for (var i = 0; i < scheduleData.length; i++) {
    var key = scheduleData[i].time.weekDay;
    if (!activitiesByWeekdays[key]) {
      activitiesByWeekdays[key] = [];
    }
    activitiesByWeekdays[key].push(scheduleData[i]);
  }
  return activitiesByWeekdays;
}

$.get(chrome.extension.getURL(paths.schedulePageHtml), function (importedHtml) {
  var scheduleData          = ScheduleParser.produceSchedule();
  var incomingMessagesCount = __extractIncomingMessagesCount();

  overwriteCurrentLayout(importedHtml);
  var activitiesGroupedByWeekdays = __groupActivitiesByWeekDays(scheduleData);
  displaySchedule(activitiesGroupedByWeekdays);
  displayIncomingMessages(incomingMessagesCount);

  activateChosenTheme();
  activateChosenMode(__findUnusedWeekdays(activitiesGroupedByWeekdays));

  // event handlers
  respondToThemeChoice();
  respondToModeChoice(__findUnusedWeekdays(activitiesGroupedByWeekdays));
});
