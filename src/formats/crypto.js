// numeral.js format configuration
// format : crypto

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../numeral'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../numeral'));
    } else {
        factory(global.numeral);
    }
}(this, function (numeral) {
    // Hardcoded crypto prices (update these manually)
    var cryptoPrices = {
        'btc': 109000,
        'eth': 2500,
        'sol': 170,
        'doge': 0.22
    };

    numeral.register('format', 'crypto', {
        regexps: {
            format: /(btc|eth|sol|doge)/i,
            unformat: /(-?\d+\.?\d*)\s?(btc|eth|sol|doge)/i
        },
        format: function (value, format, roundingFunction) {
            var crypto = format.toLowerCase().match(/(btc|eth|sol|doge)/)[0];
            var price = cryptoPrices[crypto];
            var output;

            if (!price) {
                return value + ' ' + crypto.toUpperCase();
            }

            var cryptoAmount = value / price;

            // Format to appropriate decimal places based on crypto
            if (crypto === 'btc') {
                output = numeral._.toFixed(cryptoAmount, 8, roundingFunction || Math.round);
            } else if (crypto === 'eth') {
                output = numeral._.toFixed(cryptoAmount, 6, roundingFunction || Math.round);
            } else {
                output = numeral._.toFixed(cryptoAmount, 4, roundingFunction || Math.round);
            }

            // Remove trailing zeros
            output = output.replace(/\.?0+$/, '');

            return output + ' ' + crypto.toUpperCase();
        },
        unformat: function (string) {
            var parts = string.match(/(-?\d+\.?\d*)\s?(btc|eth|sol|doge)/i);

            if (parts) {
                var amount = Number(parts[1]);
                var crypto = parts[2].toLowerCase();
                var price = cryptoPrices[crypto];

                if (price) {
                    return amount * price;
                }
            }

            return null;
        }
    });
}));