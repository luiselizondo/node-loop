'use strict';

var Q = require("q");
var _ = require("lodash");

/**
 * Async loop, goes through each of the elements in the array, applies the callback
 * and once everything is finished processing, it returns the next callback with the
 * array of the results
 * @method asyncLoop
 * @param  {Array}   arr      The array to process
 * @param  {Function} callback The callback to execute on each loop
 * @param  {Function} next     The callback to execute once it finishes processing the array
 */
function asyncLoop(arr, callback, next) {
  var counter = 0;
  var results = [];

  var total;
  if(arr.length === undefined) {
    total = _.size(arr);
  }
  else {
    total = arr.length;
  }

  _.each(arr, function(element, index) {
    callback(element, function(err, result) {
      counter++;

      if(err) {
        return next(err);
      }

      if(result) {
        results.push(result);
      }

      if(counter == total) {
        return next(err, results);
      }
    })
  });
}

/**
 * Processes an array an returns a promise once it finished
 * Calls asyncLoop behind the scenes
 * @method promiseLoop
 * @param  {Array}    arr      The array to process
 * @param  {Function}  callback The callback to execute, cannot be a promise
 * @return {Promise}             A promise with the results or an error
 */
function promiseLoop(arr, callback) {
  var d = Q.defer();

  if(!_.isArray(arr)) {
    d.reject(new Error("The first argument must be an array"));
  }

  asyncLoop(arr, callback, function(err, result) {
    if(err) {
      d.reject(err);
    }
    if(result) {
      d.resolve(result);
    }
  })

  return d.promise;
}

module.exports = {
  promise: promiseLoop,
  async: asyncLoop
}
