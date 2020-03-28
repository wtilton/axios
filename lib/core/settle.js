'use strict';

var createError = require('./createError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    var result = '';
    for (var i in response) {
      if (response.hasOwnProperty(i)) {
        var cache = [];
        result += 'response.' + i + ' = ' + JSON.stringify(response[i], function (key, value) {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Duplicate reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          return value;
        }) + '\n';
        cache = null;
      }
    }
    reject(createError(
      'Request failed with status code ' + response.status + ' Other shit ' + result,
      response.config,
      null,
      response.request,
      response
    ));
  }
};
