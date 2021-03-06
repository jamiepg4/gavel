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
    'aPad': false,
    'mRound': 'B'
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
    var initial = false;

    new PlacesView({el: $('#place'), collection: places});
    places.fetch({reset: true});

    var AuctionView = Backbone.View.extend({

        el: '#gavel',
        events: {
            'click #button': 'clickButton',
            'change input#hammer': 'updateValue',
            'change input#value': 'updateReverseValue',
            'keyup': 'keyUp',
            'change .switcher': 'selectPlace',
            'click .widget': 'showEmbed',
            'click .return': 'hideEmbed'
        },

        initialize: function () {
            $('#hammer').autoNumeric('init', autoNumericOptions);
            $('#value').autoNumeric('init', autoNumericOptions);
        },

        keyUp: function (e) {
                if ($("#hammer").is(":focus")) {
                    this.updateValue();
                }

                if ($("#value").is(":focus")) {
                    this.updateReverseValue();
                }
        },

        hideEmbed: function () {
            $('.main').show();
            $('.buttons').show();
            $('.widget').show();

            if (!initial) {
                $('.tagline').show();
            }

            $('.widget-text').hide();
        },

        showEmbed: function () {
            $('.main').hide();
            $('.buttons').hide();
            $('.widget').hide();
            $('.tagline').hide();
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
            $('.tagline').hide();

            initial = true;

            var selectedPlace = places.find(function (i) {
                return i.get('id') == $('#place').val();
            });

            if (selectedPlace.get('flatRate')) {
                $('.commission-graph').css('visibility', 'hidden');
                $('#commission-1').css('visibility', 'hidden');
                $('#commission-3').css('visibility', 'hidden');
            } else {
                $('.commission-graph').css('visibility', 'visible');
                $('#commission-1').css('visibility', 'visible');
                $('#commission-3').css('visibility', 'visible');
            }

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

            if (isNaN(taxablePrice)) {
                $('#value').autoNumeric('set', 0);
                return;
            }

            var firstBandPercentage = parseFloat(selectedPlace.get('commissionOne'), 10) / 100;
            var firstBandThreshold = parseInt(selectedPlace.get('commissionOneAmount'), 10);

            var secondBandPercentage = parseFloat(selectedPlace.get('commissionTwo'), 10) / 100;
            var secondBandThreshold = parseInt(selectedPlace.get('commissionTwoAmount'), 10);

            var thirdBandPercentage = parseFloat(selectedPlace.get('commissionThree'), 10) / 100;
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

            var totalPrice = taxablePrice + firstBandTaxLiability + secondBandTaxLiability + thirdBandTaxLiability;
            $('#value').autoNumeric('set', Math.round(totalPrice));

        },

        updateReverseValue: function () {
            var totalIncludingTax = parseInt($('#value').autoNumeric('get'), 10);

            var selectedPlace = places.find(function (i) {
                return i.get('id') == $('#place').val();
            });

            if (isNaN(totalIncludingTax)) {
                $('#hammer').autoNumeric('set', 0);
                return;
            }

            var firstBandPercentage = parseFloat(selectedPlace.get('commissionOne'), 10) / 100;
            var firstBandThreshold = parseInt(selectedPlace.get('commissionOneAmount'), 10);

            var secondBandPercentage = parseFloat(selectedPlace.get('commissionTwo'), 10) / 100;
            var secondBandThreshold = parseInt(selectedPlace.get('commissionTwoAmount'), 10);

            var thirdBandPercentage = parseFloat(selectedPlace.get('commissionThree'), 10) / 100;
            var thirdBandThreshold = parseInt(selectedPlace.get('commissionTwoAmount'), 10);

            var firstBandTaxLiability = 0;
            var secondBandTaxLiability = 0;
            var thirdBandTaxLiability = 0;

            var originalPrice, difference, finalPrice;

            // Flat rate reverse calculation
            if (selectedPlace.get('flatRate')) {
                $('#hammer').autoNumeric('set', Math.round(totalIncludingTax / (1 + (parseFloat(selectedPlace.get('commissionOne'), 10)/100))));
                return;
            }

            // Reverse, in first band
            if (totalIncludingTax <= (firstBandThreshold + (firstBandThreshold * firstBandPercentage))) {
                $('#hammer').autoNumeric('set', Math.round(totalIncludingTax / (1 + (parseFloat(selectedPlace.get('commissionOne'), 10)/100))));
                return;
            }

            // Reverse, in second band
            if (totalIncludingTax >= (firstBandThreshold + (firstBandThreshold * firstBandPercentage)) && totalIncludingTax < (secondBandThreshold + (firstBandThreshold * firstBandPercentage) + (secondBandThreshold - firstBandThreshold) * secondBandPercentage)) {
                originalPrice = totalIncludingTax - (firstBandThreshold * firstBandPercentage);
                difference = originalPrice - firstBandThreshold;
                secondBandTaxLiability = difference / (1 + secondBandPercentage);
                finalPrice = firstBandThreshold + secondBandTaxLiability;
                $('#hammer').autoNumeric('set', Math.round(finalPrice));
                return;
            }

            // Third band
            if (totalIncludingTax >= (secondBandThreshold + (firstBandThreshold * firstBandPercentage) + (secondBandThreshold - firstBandThreshold) * secondBandPercentage)) {
                firstBandTaxLiability = firstBandThreshold * firstBandPercentage;
                secondBandTaxLiability = (secondBandThreshold - firstBandThreshold) * secondBandPercentage;
                originalPrice = totalIncludingTax - firstBandTaxLiability - secondBandTaxLiability;
                difference = originalPrice - secondBandThreshold;
                thirdBandTaxLiability = difference / (1 + thirdBandPercentage);
                finalPrice = secondBandThreshold + thirdBandTaxLiability;
                $('#hammer').autoNumeric('set', Math.round(finalPrice));
                return;
            }
            

        }

    });

    var auctionView = new AuctionView({el: $('#gavel')});

});