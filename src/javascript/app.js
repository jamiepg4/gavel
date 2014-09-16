var $ = require('jquery');
var Backbone = require('backbone');

Backbone.$ = $;

var app = {};

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
        },

        updateValue: function () {
            var initial = parseInt($('#hammer').val(), 10);

            $('#value').val(initial * 2);
        }

    });

    var auctions = new AuctionList();

    var auctionView = new AuctionView({el: $('#gavel'), model: auctions});

    auctions.fetch({reset: true});

    auctions.bind('reset', function () {
        console.log(auctions);
    });

});