(function () {
  'use strict';
  angular.module('starter.directives',[])
    .directive('d3Streamgraph', ['d3', function(d3) {
      return {
        restrict: 'EA',
        scope: {
        },
        link: function(scope, iElement, iAttrs) {
 
        // code from d3 comes here - e.g. script from http://bl.ocks.org/tjdecke/5558084
        // remember to change the target to iElement[0] in d3.select()
          var n = 40,
              duration = 750,
              random = d3.random.normal(0, .2),
              count = 0,
              now = new Date(Date.now() - duration),
              data = d3.range(n).map(random);

          var margin = {top: 20, right: 20, bottom: 20, left: 40},
              width = 1280 - margin.left - margin.right,
              height = 200 - margin.top - margin.bottom;

          var x = d3.time.scale()
              .domain([now - (n - 2) * duration, now - duration])
              .range([0, width]);

          var y = d3.scale.linear()
              .domain([0, 1])
              .range([height, 0]);

          var line = d3.svg.line()
              .interpolate("basis")
              .x(function(d, i) { return x(now - (n - 1 - i) * duration); })
              .y(function(d, i) { return y(d); });

          var svg = d3.select(iElement[0]).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          svg.append("defs").append("clipPath")
              .attr("id", "clip")
            .append("rect")
              .attr("width", width)
              .attr("height", height);

          var axis = svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));


          svg.append("g")
              .attr("class", "y axis")
              .call(d3.svg.axis().scale(y).orient("left"));

          var path = svg.append("g")
              .attr("clip-path", "url(#clip)")
            .append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);

          var transition = d3.select({}).transition()
              .duration(750)
              .ease("linear");

          d3.select(window)
              .on("scroll", function() { ++count; });

          (function tick() {
            transition = transition.each(function() {

              // update the domains
              now = new Date();
              x.domain([now - (n - 2) * duration, now - duration]);
              y.domain([0, d3.max(data)]);

              // push the accumulated count onto the back, and reset the count
              data.push(Math.min(30, count));
              count = 0;

              // redraw the line
              svg.select(".line")
                  .attr("d", line)
                  .attr("transform", null);

              // slide the x-axis left
              axis.call(x.axis);

              // slide the line left
              path.transition()
                  .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");

              // pop the old data point off the front
              data.shift();

            }).transition().each("start", tick);
          })();
        // end of code from d3
        }       
      };
    }]);
}());