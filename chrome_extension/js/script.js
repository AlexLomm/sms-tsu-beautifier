$.get(chrome.extension.getURL('templates/index.html'), function(data) {
    $($.parseHTML(data)).appendTo('body');
});

console.log('ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss');
//console.log($);
