var $ = require('jquery');
var Backbone = require('backbone');

Backbone.$ = $;

var app = app || {};

$(function () {

    'use strict';

    var AppView = Backbone.View.extend({

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

    var appView = new AppView({el: $('#gavel')});

});