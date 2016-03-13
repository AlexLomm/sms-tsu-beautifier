//// parses elements common for all pages
//var LayoutParser = {
//    config: {
//        mailLinkTagPath: 'html body form#aspnetForm table tbody tr td span#ctl00_Label2 a',
//        mailLinkHref: 'http://sms.tsu.ge/sms/Students/Corespondencia/FakultMimowera.aspx'
//    },
//
//    extractIncomingMessages: function() {
//        var mailLinkTag = $(this.config.mailLinkTagPath);
//        // check if there is incoming messages link tag displayed
//        if(!mailLinkTag.length){ return null; }
//
//        return {
//            href: this.config.mailLinkHref,
//            messageCount: parseInt(mailLinkTag.text().replace(/[^0-9\.]/g, ''), 10)
//        };
//    }
//};


function extractIncommingMessagesCount(){
    var messagesLinkTag = $('html body form#aspnetForm table tbody tr td span#ctl00_Label2 a');
    if(!messagesLinkTag.length){
        return null;
    }
    return parseInt(messagesLinkTag.text().replace(/[^0-9\.]/g, ''), 10);
}

var scheduleData = ScheduleParser.produceSchedule();
console.log(scheduleData);

var incomingMessageCount = extractIncommingMessagesCount();
console.log(incomingMessageCount);

//$.get(chrome.extension.getURL('templates/index.html'), function(data) {
//    $($.parseHTML(data)).appendTo('body');
//});
