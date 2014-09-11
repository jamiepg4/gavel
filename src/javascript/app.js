require('jquery');
var Spreadsheets = require('google-spreadsheets');




Spreadsheets({
    key: "1ksjdv6hT3rZh9tYkOo8MtwVT5_0vq8AFPMk8hz1xKmc"
}, function(err, spreadsheet) {

    spreadsheet.worksheets[0].cells({
        range: "R1C1:R5C5"
    }, function(err, cells) {
        // Cells will contain a 2 dimensional array with all cell data in the
        // range requested.
    });
});