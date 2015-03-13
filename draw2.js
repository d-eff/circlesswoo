var width = 400,
    height = 400,
    radius = 325 / 2,
    innerRadius = 35,
    pi = Math.PI,
    outers = {1: "outer ", 3: "outer ", 5: "outer "},
    totalScore = 0,
    strank = "";

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d) { return d.data.tooltip; })
    .offset(function(d,n){ 
      switch(n) {
        case 0:
          if(d.data.score === 30) {
            return [10, 20];
          } else if(d.data.score === 60) {
            return [50,0];
          } else {
            return [70,-10];
          }
          break;
        case 1:
          if(d.data.score === 30) {
            return [55,35];
          } else if(d.data.score === 60) {
            return [75,20];
          } else {
            return [90, 15];
          }
          break;
        case 2:
          if(d.data.score === 30) {
            return [70,10];
          } else if(d.data.score === 60) {
            return [70, 0];
          } else {
            return [80,-15];
          }
          break;
        case 3:
          if(d.data.score === 30) {
            return [70, -5];
          } else if(d.data.score === 60) {
            return [75,10];
          } else {
            return [80,20];
          }
          break;
        case 4: 
          if(d.data.score === 30) {
            return [60, -20];
          } else if(d.data.score === 60) {
            return [80,0];
          } else {
            return [100,0];
          }
          break;
        case 5:
          if(d.data.score === 30) {
            return [20,-10];
          } else if(d.data.score === 60) {
            return [50, 5];
          } else {
            return [90,20];
          }
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

var topRight = d3.svg.arc()
      .innerRadius(168)
      .outerRadius(170)
      .startAngle(0.1)
      .endAngle(2);
var bottom = d3.svg.arc()
      .innerRadius(168)
      .outerRadius(170)
      .startAngle(2.18)
      .endAngle(4.1);
var topLeft = d3.svg.arc()
      .innerRadius(168)
      .outerRadius(170)
      .startAngle(4.27)
      .endAngle(6.2);

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

    if(n%2 === 1) {
      var avg = data[n].score + data[n-1].score / 2;
      if(avg >= 120) {
        outers[n] += "good";   
      } else if(avg >= 90) {
        outers[n] += "okay";
      } else {
        outers[n] += "poor";
      }
    }

    totalScore += +d.score;

    if(n===5){
      console.log(totalScore);
      if(totalScore >= 360) {
        strank = "good";
      } else if(totalScore >= 180) {
        strank = "okay";
      } else {
        strank = "poor";
      }
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

  svg.append("path")
      .attr("id", "topRight")
      .attr("class", outers[1])
      .attr("d", topRight);
  svg.append("path")
      .attr("id", "bottom")
      .attr("class", outers[3])
      .attr("d", topLeft);
  svg.append("path")
      .attr("id", "topLeft")
      .attr("class", outers[5])
      .attr("d", bottom);

  svg.append("text")
      .attr("x", 150)
      .attr("dy", -10)
    .append("textPath")
      .attr("stroke","white")
      .attr("xlink:href","#topRight")
      .text("Late Additions");
  svg.append("text")
      .attr("x", 150)
      .attr("dy", -10)
    .append("textPath")
      .attr("stroke","white")
      .attr("xlink:href","#bottom")
      .text("Transfers In");
  svg.append("text")
      .attr("x", 150)
      .attr("dy", -10)
    .append("textPath")
      .attr("stroke","white")
      .attr("xlink:href","#topLeft")
      .text("Order Modifications");


  //outermost circle
  svg.selectAll(".outlineArc")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "#b5b4b4")
      .attr("class", "outlineArc")
      .attr("d", outlineArc);  

  svg.append("circle")
      .attr("cx", 1)
      .attr("cy", 0)
      .attr("class", function(d) { return "overall " + strank; })
      .attr("r", 20);

  //bang in the center
  svg.append("svg:text")
    .attr("class", "bang")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text("!");

});
