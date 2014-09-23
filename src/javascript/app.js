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
            'change input#value': 'updateReverseValue',
            'keypress': 'updateValue',
            'change .switcher': 'selectPlace',
            'click .widget': 'showEmbed',
            'click .return': 'hideEmbed'
        },

        initialize: function () {
            $('#hammer').autoNumeric('init', autoNumericOptions);
            $('#value').autoNumeric('init', autoNumericOptions);
        },

        hideEmbed: function () {
            $('.main').show();
            $('.buttons').show();
            $('.widget-text').hide();
        },

        showEmbed: function () {
            $('.main').hide();
            $('.buttons').hide();
            $('.widget-text').show();
        },

        formatCurrency: function (x) {

            var selectedPlace = places.find(function (i) {
                return i.get('id') == $('#place').val();
            });

            var currency = selectedPlace.get('currency');

            return currency + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        selectPlace: function (s) {
            $('#commission-1').html('5');

            var selectedPlace = places.find(function (i) {
                return i.get('id') == $('#place').val();
            });

            $('#commission-1').html(selectedPlace.get('commissionOne') + '%');
            $('#commission-2').html(selectedPlace.get('commissionTwo') + '%');
            $('#commission-3').html(selectedPlace.get('commissionThree') + '%');

            $('#commission-base').html(this.formatCurrency(0));
            $('#commission-one-amount').html(this.formatCurrency(selectedPlace.get('commissionOneAmount')));
            $('#commission-two-amount').html(this.formatCurrency(selectedPlace.get('commissionTwoAmount')));

            autoNumericOptions.aSign = selectedPlace.get('currency');

            $('#hammer').autoNumeric('update', autoNumericOptions);
            $('#value').autoNumeric('update', autoNumericOptions);

            $('#background').fadeOut();
            $('section.main').css('visibility', 'visible');

            this.updateValue();

        },

        updateValue: function () {
            var taxablePrice = parseInt($('#hammer').autoNumeric('get'), 10);

            var selectedPlace = places.find(function (i) {
                return i.get('id') == $('#place').val();
            });

            var firstBandPercentage = parseInt(selectedPlace.get('commissionOne'), 10) / 100;
            var firstBandThreshold = parseInt(selectedPlace.get('commissionOneAmount'), 10);

            var secondBandPercentage = parseInt(selectedPlace.get('commissionTwo'), 10) / 100;
            var secondBandThreshold = parseInt(selectedPlace.get('commissionTwoAmount'), 10);

            var thirdBandPercentage = parseInt(selectedPlace.get('commissionThree'), 10) / 100;
            var thirdBandThreshold = parseInt(selectedPlace.get('commissionTwoAmount'), 10);

            var firstBandTaxLiability = 0;
            var secondBandTaxLiability = 0;
            var thirdBandTaxLiability = 0;

            if (taxablePrice > 0) {
              if (taxablePrice > firstBandThreshold) {
                firstBandTaxLiability = firstBandThreshold * firstBandPercentage;
              } else {
                firstBandTaxLiability = taxablePrice * firstBandPercentage;
              }
            }

            if (taxablePrice > firstBandThreshold) {
              if (taxablePrice > secondBandThreshold) {
                secondBandTaxLiability = secondBandPercentage * (secondBandThreshold - firstBandThreshold);
              } else {
                secondBandTaxLiability = (taxablePrice - firstBandThreshold) * secondBandPercentage;
              }
            }

            if (taxablePrice > thirdBandThreshold) {
              thirdBandTaxLiability = (taxablePrice - thirdBandThreshold) * thirdBandPercentage;
            }

            console.log('FIRST BAND TAX LIABILITY: ' + firstBandTaxLiability);
            console.log('SECOND BAND TAX LIABILITY: ' + secondBandTaxLiability);
            console.log('THIRD BAND TAX LIABILITY:' + thirdBandTaxLiability);

            var totalPrice = taxablePrice + firstBandTaxLiability + secondBandTaxLiability + thirdBandTaxLiability;
            $('#value').autoNumeric('set', totalPrice);

        },

        updateReverseValue: function () {
            var totalIncludingTax = parseInt($('#value').autoNumeric('get'), 10);

            var selectedPlace = places.find(function (i) {
                return i.get('id') == $('#place').val();
            });

            var firstBandPercentage = parseInt(selectedPlace.get('commissionOne'), 10) / 100;
            var firstBandThreshold = parseInt(selectedPlace.get('commissionOneAmount'), 10);

            var secondBandPercentage = parseInt(selectedPlace.get('commissionTwo'), 10) / 100;
            var secondBandThreshold = parseInt(selectedPlace.get('commissionTwoAmount'), 10);

            var thirdBandPercentage = parseInt(selectedPlace.get('commissionThree'), 10) / 100;
            var thirdBandThreshold = parseInt(selectedPlace.get('commissionTwoAmount'), 10);

            var firstBandTaxLiability = 0;
            var secondBandTaxLiability = 0;
            var thirdBandTaxLiability = 0;

            if (totalIncludingTax > firstBandThreshold) {
                firstBandTaxLiability = (firstBandThreshold * firstBandPercentage);
            } else {
                firstBandTaxLiability = totalIncludingTax * firstBandPercentage;
            }


            // if (totalIncludingTax - firstBandTaxLiability >)


            var totalLessFirstBand = totalIncludingTax - (firstBandThreshold * firstBandPercentage);
            var totalLessSecondBand = totalLessFirstBand - ((secondBandThreshold - firstBandThreshold) * secondBandPercentage);

            var totalThirdBand = (totalLessSecondBand - secondBandThreshold) / (1 + thirdBandPercentage);

            thirdBandTaxLiability = (totalThirdBand * thirdBandPercentage);

            var originalPrice = totalIncludingTax - (firstBandTaxLiability - secondBandTaxLiability - thirdBandTaxLiability);

            // debugger;

            $('#hammer').autoNumeric('set', totalThirdBand + secondBandThreshold);

        }

    });

    var auctionView = new AuctionView({el: $('#gavel')});

});