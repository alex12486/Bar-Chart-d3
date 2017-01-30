var width = 1200, height = 480;

var svg = d3.select('.diagram')
						.append('svg')
						.attr('width', width)
						.attr('height', height)
						.append("g")
						.attr("id", "container")
						.attr('width', 300);


// HTTP REQUEST						
var request = new XMLHttpRequest();
request.open('GET', './libs/letters.tsv');

request.onload = function () {
	var dataset = request.responseText;
	render(dataset);
};

request.send();

function render (dataset) {

var data = d3.tsvParse(dataset);

  data.forEach(function(d) {
    d.frequency = +d.frequency;
  });



// ADD RECTANGLES AND TEXT
var g = svg.selectAll('g')
	.data(data)
	.enter()
	.append('g')
	.attr("class", "rectangle")
	.append('rect')
  .attr("class", ".bar")
	.attr('x', function(value, index) {
		return index * 35;
	})
	.attr('y', function(value) {
		return -value.frequency * 3000;
	})
	.attr('height', function(value) {
		return value.frequency * 3000;
	})
	.attr('width', 35 * 0.98)
	.attr('fill', 'teal')
  .on('mouseover', function(value, index){
		d3.select(this).attr('fill', 'orange');	
		d3.select(this.parentNode).select('text').attr('style', 'display: block; font: 10px sans-serif;');
		})
	.on('mouseout', function(value, index){
		d3.select(this).attr('fill', 'teal');
		d3.select(this.parentNode).select('text').attr('style', 'display: none; font: 10px sans-serif;');
	});

d3.selectAll('.rectangle')
	.append('text')
	.attr('text-anchor', "middle")
	.attr('style', 'display: none; font: 10px sans-serif;')
	.attr('x', function(value, index) {
		return index * 35 + 35/2;
	})
	.attr('y', function(value) {
		return -value.frequency * 3000;
	})
	.attr('fill', 'black')
	.text(function(value) {
		return (value.frequency * 100).toFixed(2);
	});






// ADD AXIS
var elementWidth = document.getElementById("container").getBoundingClientRect().width;
var elementHeight = document.getElementById("container").getBoundingClientRect().height;
svg.attr("transform", "translate(" + (width - elementWidth) / 2 + "," + (height + elementHeight) / 2 + ")");

var axisScale_X = d3.scaleBand()
													.range([0, elementWidth])
													.domain(data.map(function(d) { return d.letter; }));

var axisScale_Y = d3.scaleLinear()
													.rangeRound([elementHeight, 0])
													.domain([0, d3.max(data.map(function(d) { return d.frequency;	}))]);                          
                          
svg.append('g')
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0,0)")
	.call(d3.axisBottom(axisScale_X));

svg.append('g')
	.attr("class", "axis axis--y")
	.attr("transform", "translate(-10,-"+ elementHeight +")")
	.call(d3.axisLeft(axisScale_Y).ticks(10, "%"));
}
