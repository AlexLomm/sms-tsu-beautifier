var table = $('html body form#aspnetForm');

var mailLinkTag = $('html body form#aspnetForm table tbody tr td span#ctl00_Label2 a');
var mailCount = parseInt(mailLinkTag.text().replace(/[^0-9\.]/g, ''), 10); // extract decimal number from the text
var mailHref = mailLinkTag.attr('href');

console.log('-------------');
console.log(mailCount);
console.log(mailHref);

