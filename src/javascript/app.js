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
    'aSign': '$',
    'wEmpty': 'sign',
    'aPad': false
};

var backgroundImage = Math.floor(Math.random() * 4) + 1;
$('#background').css('background-image', 'url(images/background_' + backgroundImage + '.png)');
$('#background-blur').css('background-image', 'url(images/background_' + backgroundImage + '_blur.png)');

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
            $(this.el).attr('value', this.model.get('id')).html(this.model.get('name'));
            return this;
        }
    });

    var PlacesView = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, 'addOne', 'addAll');
            this.collection.bind('reset', this.addAll);
        },
        addOne: function(place){
            $(this.el).append(new PlaceView({ model: place }).render().el);
        },
        addAll: function(){
            this.collection.each(this.addOne);
        }
    });

    var places = new PlaceList();

    new PlacesView({el: $('#place'), collection: places});
    places.fetch({reset: true});

    var AuctionView = Backbone.View.extend({

        el: '#gavel',
        events: {
            'click #button': 'clickButton',
            'change input#hammer': 'updateValue',
            'change input#value': 'updateValue',
            'keypress': 'updateValue',
            'change .switcher': 'selectPlace'
        },

        initialize: function () {
            $('#hammer').autoNumeric('init', autoNumericOptions);
            $('#value').autoNumeric('init', autoNumericOptions);
        },

        selectPlace: function (s) {
            $('#commission-1').html('5');

            var selectedPlace = places.find(function (i) {
                return i.get('id') == $('#place').val();
            });

            $('#commission-1').html(selectedPlace.get('commissionOne'));
            $('#commission-2').html(selectedPlace.get('commissionTwo'));
            $('#commission-3').html(selectedPlace.get('commissionThree'));

            autoNumericOptions.aSign = selectedPlace.get('currency');

            $('#hammer').autoNumeric('update', autoNumericOptions);
            $('#value').autoNumeric('update', autoNumericOptions);

            $('#background').fadeOut();

            console.log(selectedPlace);
        },

        updateValue: function () {
            var initial = parseInt($('#hammer').autoNumeric('get'), 10);

            $('#value').autoNumeric('set', initial * 2);
        }

    });

    // var auctions = new AuctionList();

    var auctionView = new AuctionView({el: $('#gavel')});

});