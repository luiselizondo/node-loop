'use strict';

var should = require("should");
var loop = require("../../index.js");
var _ = require("lodash");

describe("Loop", function() {
  this.timeout(5000);
  describe("Loop through an array", function() {
    it("Should loop through an array and return object transformed with the name on uppercase", function(done) {
      var people = [{
        id: 1,
        name: "William"
      }, {
        id: 2,
        name: "John"
      }, {
        id: 3,
        name: "Bill"
      }, {
        id: 4,
        name: "John"
      }, {
        id: 5,
        name: "Anne"
      }, {
        id: 6,
        name: "Lucy"
      }];

      function transformName(item, next) {
        setTimeout(function() {
          var data = {
            id: item.id,
            name: item.name.toUpperCase()
          }

          return next(false, data);
        }, 1000);
      }

      loop.promise(people, transformName)
      .then(function(transformed) {
        transformed.should.be.an.Array;

        _.each(transformed, function(item, index) {
          transformed[index].should.have.property("name", item.name);
          transformed[index].should.have.property("id", item.id);
        })

        done();
      })
      .fail(function(err) {
        console.log(err);
        done();
      })
    });

    it("Should return a tick every 1 second", function(done) {
      var messages = ["First tick", "Second tick", "Third tick"];

      function tick(message, next) {
        setTimeout(function() {
          return next(false, message);
        }, 2250);
      }

      loop.promise(messages, tick)
      .then(function(msgs) {
        msgs.should.be.an.Array;
        msgs[0].should.be.equal("First tick");
        msgs[1].should.be.equal("Second tick");
        msgs[2].should.be.equal("Third tick");
        done();
      })
    });

    it("Should be able to loop through an object", function(done) {
      var object = {
        one: {
          name: "Bill"
        },
        two: {
          name: "John"
        },
        three: {
          name: "Thomas"
        }
      };

      function tick(obj, next) {
        setTimeout(function() {
          return next(null, obj);
        }, 2250);
      }

      loop.async(object, tick, function(err, results) {
        should.not.exist(err);
        results[0].should.have.property("name", "Bill");
        results[1].should.have.property("name", "John");
        results[2].should.have.property("name", "Thomas");
        done();
      });

    })
  })
});
