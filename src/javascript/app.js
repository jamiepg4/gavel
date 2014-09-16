var $ = require('jquery');
var Backbone = require('backbone');
var queue = require('queue-async');

Backbone.$ = $;

var app = {};

$(function () {

    'use strict';

    var AppView = Backbone.View.extend({

        el: '#gavel',
        events: {
            'click #button': 'clickButton',
            'change input#hammer': 'updateValue',
            'change input#value': 'updateValue',
            'keypress': 'updateValue'
        },

        initialize: function () {
        },

        updateValue: function () {
            var initial = parseInt($('#hammer').val(), 10);

            $('#value').val(initial * 2);
        }

    }), appView = new AppView({el: $('#gavel')});

});