var width = 325,
    height = 325,
    radius = Math.min(width, height) / 2,
    innerRadius = 35,
    pi = Math.PI;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
  .innerRadius(innerRadius)
  .outerRadius(function (d) { 
    return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
  });

var edge = d3.svg.arc()
  .innerRadius(function (d) { 
    return ((radius - innerRadius) * (d.data.score / 100.0) + innerRadius) - 1; 
  })
  .outerRadius(function (d) { 
    return ((radius - innerRadius) * (d.data.score / 100.0) + innerRadius)+1; 
  });

var outlineArc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);
var innerGrid = d3.svg.arc()
      .innerRadius(73)
      .outerRadius(73)
      .startAngle(0)
      .endAngle(2*pi); 
var middleGrid = d3.svg.arc()
      .innerRadius(111)
      .outerRadius(111)
      .startAngle(0)
      .endAngle(2*pi); 
var outerGrid = d3.svg.arc()
      .innerRadius(150)
      .outerRadius(150)
      .startAngle(0)
      .endAngle(2*pi); 

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


d3.json('data.json', function(error, dat) {

  data = dat.data;

  data.forEach(function(d, n) {
    d.id    = d.id;
    d.score = d.value;
    d.outer = (radius - innerRadius) * (d.value / 100.0) + innerRadius; 

    switch(d.type) {
      case 'days':
        if(d.value <= 15) {
          d.score = 30;
          d.class = "poor";
        } else if (d.value <= 30) {
          d.score = 60;
          d.class = "okay";
        } else {
          d.score = "90";
          d.class= "good";
        }
        break;
      case 'perc':
        if(d.value <= 33) {
          d.score = 90;
          d.class = "good";
        } else if(d.value <= 66) {
          d.score = 60;
          d.class = "okay";
        } else {
          d.score = 30;
          d.class = "poor";
        }
        break;
      case 'items':
        if(d.value <= 20 ) {
          d.score = 30;
          d.class = "poor"; 
        } else if(d.value <= 40) {
          d.score = 60;
          d.class = "okay";
        } else {
          d.score = 90;
          d.class = "good";
        }
        break;
    }
  });
  
  var path = svg.selectAll(".solidArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "#757373")
      .attr("class", function(d) { return "solidArc " + d.data.class; })
      .attr("stroke", "gray")
      .attr("d", arc);
  var inner = svg.selectAll(".innerGrid")
      .data(pie(data))
      .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "#b5b4b4")
      .attr("class", "innerGrid")
      .attr("d", innerGrid);
  var mid = svg.selectAll(".middleGrid")
      .data(pie(data))
      .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "#b5b4b4")
      .attr("class", "middleGrid")
      .attr("d", middleGrid);
  var outer = svg.selectAll(".outerGrid")
      .data(pie(data))
      .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "#b5b4b4")
      .attr("class", "outerGrid")
      .attr("d", outerGrid);
  var path = svg.selectAll(".edge")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("class", function(d) { return "edge " + d.data.class; })
      .attr("d", edge);

  var outerPath = svg.selectAll(".outlineArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "#b5b4b4")
      .attr("class", "outlineArc")
      .attr("d", outlineArc);  



 // // calculate the weighted mean score
 // var score = 
 //   data.reduce(function(a, b) {
 //     //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
 //     return a + (b.score * b.weight); 
 //   }, 0) / 
 //   data.reduce(function(a, b) { 
 //     return a + b.weight; 
 //   }, 0);

  svg.append("svg:text")
    .attr("class", "aster-score")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle") // text-align: right
    .text("!");

});
