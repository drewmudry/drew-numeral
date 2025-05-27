// numeral.js format configuration
// format : fraction

(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['../numeral'], factory);
    } else if (typeof module === 'object' && module.exports) {
        factory(require('../numeral'));
    } else {
        factory(global.numeral);
    }
}(this, function (numeral) {
    numeral.register('format', 'fraction', {
        regexps: {
            format: /(\/)/,
            unformat: /(-?\d+)\/(\d+)/
        },
        format: function (value, format, roundingFunction) {
            var output,
                sign = '',
                numerator,
                denominator,
                gcd;

            // Handle zero
            if (value === 0) {
                return '0/1';
            }

            // Handle negative numbers
            if (value < 0) {
                sign = '-';
                value = Math.abs(value);
            }

            // Handle whole numbers
            if (value % 1 === 0) {
                return sign + value + '/1';
            }

            // Greatest common divisor function
            gcd = function (a, b) {
                return b ? gcd(b, a % b) : a;
            };

            // Convert decimal to fraction
            // Count decimal places to determine denominator
            var decimalStr = value.toString();
            var decimalPlaces = decimalStr.split('.')[1] ? decimalStr.split('.')[1].length : 0;

            denominator = Math.pow(10, decimalPlaces);
            numerator = Math.round(value * denominator);

            // Simplify fraction
            var divisor = gcd(numerator, denominator);
            numerator /= divisor;
            denominator /= divisor;

            output = sign + numerator + '/' + denominator;

            return output;
        },
        unformat: function (string) {
            var parts = string.match(/(-?\d+)\/(\d+)/),
                value;

            if (parts) {
                value = Number(parts[1]) / Number(parts[2]);
                return value;
            }

            return Number(string) || null;
        }
    });
}));