var $ = require('jquery');
var Backbone = require('backbone');

window.jQuery = $;

require('./autoNumeric');

Backbone.$ = $;

var app = {};
var jQuery = $.noConflict();

var autoNumericOptions = {
    'aDec': '.',
    'aSign': '$'
};

$(function () {

    'use strict';

    var Auction = Backbone.Model.extend();

    var AuctionList = Backbone.Collection.extend({
        model: Auction,
        url: 'auctions.json'
    });


    var AuctionView = Backbone.View.extend({

        el: '#gavel',
        events: {
            'click #button': 'clickButton',
            'change input#hammer': 'updateValue',
            'change input#value': 'updateValue',
            'keypress': 'updateValue'
        },

        initialize: function () {
            $('#hammer').autoNumeric('init', autoNumericOptions);
            $('#value').autoNumeric('init', autoNumericOptions);
        },

        updateValue: function () {
            var initial = parseInt($('#hammer').autoNumeric('get'), 10);

            $('#value').autoNumeric('set', initial * 2);
        }

    });

    var auctions = new AuctionList();

    var auctionView = new AuctionView({el: $('#gavel'), model: auctions});

    auctions.fetch({reset: true});

    auctions.bind('reset', function () {
        console.log(auctions);
    });

});