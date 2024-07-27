import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

//Get the data
const req = new XMLHttpRequest();
req.open('GET',url,true);
req.send();
req.onload = function(){
    const json = JSON.parse(req.responseText);
    const dataset = json.data;
    //Dataset format: [ [year,data], [year,data], ...]
    
//Declare the chart
const width = 700;
const height = 450;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

//Declare the x (horizontal position) scale
const x = d3.scaleBand()
            .domain(dataset.map(d => d[0]))
            .range([marginLeft, width - marginRight])
            .padding(0.1);

//Declare the y (vertical position) scale
const y = d3.scaleLinear()
            .domain([0,d3.max(dataset.map(d => d[1]))])
            .range([height - marginBottom, marginTop])

//Create SVG container
const svg = d3.create("svg")
            .attr('width',width)
            .attr('height',height)
            .attr('viewBox',[0, 0, width, height])
            .attr('style','max-width: 100%; height: auto;');

//Add a rect for each bar
svg.append("g")
    .attr('fill','steelblue')
    .selectAll()
    .data(dataset)
    .join('rect')
        .attr('x', (d) => x(d[0]))
        .attr('y', (d) => y(d[1]))
        .attr('width', x.bandwidth())
        .attr('height', (d) => y(0) - y(d[1]));
    
document.getElementById('container').append(svg.node());
}

