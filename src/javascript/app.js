var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

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

    var Place = Backbone.Model.extend();

    var PlaceList = Backbone.Collection.extend({
        model: Place,
        url: 'auctions.json'
    });

    var PlaceView = Backbone.View.extend({
        tagName: 'option',
        initialize: function () {
            _.bindAll(this, 'render');
        },
        render: function () {
            $(this.el).attr('value', 'VALUE');
            return this;
        }
    });

    var PlacesView = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, 'addOne', 'addAll');
            console.log('initialise collection');
            this.collection.bind('reset', this.addAll);
        },
        addOne: function(place){
            console.log('add');
          $(this.el).append(new PlaceView({ model: place }).render().el);
        },
        addAll: function(){
          this.collection.each(this.addOne);
        }
    });

    var places = new PlaceList();

    new PlacesView({el: $('#place'), collection: places});
    places.fetch();

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

    // var auctions = new AuctionList();

    // var auctionView = new AuctionView({el: $('#gavel'), model: auctions});



});