# Node Loop
Helper method to loop through an array. Returns a promise.

# Install

      $ npm install node-loop

# Example

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
        // do something with your transformed array.
      })
      .fail(function(err) {
        console.log(err);
      })
