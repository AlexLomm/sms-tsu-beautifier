// parses elements common for all pages
var LayoutParser = {
    config: {
        mailLinkTagPath: 'html body form#aspnetForm table tbody tr td span#ctl00_Label2 a',
        mailLinkHref: 'http://sms.tsu.ge/sms/Students/Corespondencia/FakultMimowera.aspx'
    },

    extractIncomingMessages: function() {
        var mailLinkTag = $(this.config.mailLinkTagPath);
        // check if there is incoming messages link tag displayed
        if(!mailLinkTag.length){ return null; }

        return {
            href: this.config.mailLinkHref,
            messageCount: parseInt(messageLinkTag.text().replace(/[^0-9\.]/g, ''), 10)
        };
    }
};


var scheduleData = ScheduleParser.extractSchedule();
var incomingMessages = LayoutParser.extractIncomingMessages();

$.get(chrome.extension.getURL('templates/index.html'), function(data) {
    $($.parseHTML(data)).appendTo('body');
});
