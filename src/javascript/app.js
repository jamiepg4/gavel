require('jquery');
var Backbone = require('backbone');

var app = app || {};

console.log('something');

app.AppView = Backbone.View.extend({

    el: '#gavel',
    events: {
        'click #button': 'clickButton'
    },

    initialize: function () {
        console.log('initialise gavel');
    },

    click: function () {
        console.log('clicked button');
    }


});