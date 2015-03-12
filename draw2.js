var width = 325,
    height = 325,
    radius = Math.min(width, height) / 2,
    innerRadius = 35,
    pi = Math.PI;

var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) { return d.data.tooltip; })
            .offset(function(d,n){ 
              console.log(n); 
              switch(n) {
                case 0:
                  return [10, 20]
                  break;
                case 1:
                  return [90, 15];
                  break;
                case 2:
                  return [70, 5];
                  break;
                case 3:
                  return [70, -5];
                  break;
                case 4: 
                  return [60, -20];
                  break;
                case 5:
                  return [50, 5];
                  break;
              }
            });

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
    return ((radius - innerRadius) * (d.data.score / 100.0) + innerRadius) - 2; 
  })
  .outerRadius(function (d) { 
    return ((radius - innerRadius) * (d.data.score / 100.0) + innerRadius) + 2; 
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


svg.call(tip);


d3.json('data.json', function(error, dat) {

  var data = dat.data;

  data.forEach(function(d, n) {
    d.id    = d.id;
    d.score = d.value;
    d.outer = (radius - innerRadius) * (d.value / 100.0) + innerRadius; 
    d.tooltip = "<span class=\"omod\">Order<br>Modification:</span><br>" + d.value;

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
        d.tooltip += " days";
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
        d.tooltip += "%";
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
        d.tooltip += " items"; 
        break;
    }
  });
  //draw the wedges
  var mainArc = svg.selectAll(".solidArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "#757373")
      .attr("class", function(d) { return "solidArc " + d.data.class; })
      .attr("stroke", "gray")
      .attr("d", arc)
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

  //draw concentric rings
  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#b5b4b4")
      .attr("class", "innerGrid")
      .attr("d", innerGrid);
  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#b5b4b4")
      .attr("class", "middleGrid")
      .attr("d", middleGrid);
  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#b5b4b4")
      .attr("class", "outerGrid")
      .attr("d", outerGrid);

  //colored edges on wedges
  svg.selectAll(".edge")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("class", function(d) { return "edge " + d.data.class; })
      .attr("d", edge);

  //outermost circle
  svg.selectAll(".outlineArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "#b5b4b4")
      .attr("class", "outlineArc")
      .attr("d", outlineArc);  

  //bang in the center
  svg.append("svg:text")
    .attr("class", "bang")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle") // text-align: right
    .text("!");

});
