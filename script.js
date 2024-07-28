
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

//Get the data
const req = new XMLHttpRequest();
req.open('GET',url,true);
req.send();
req.onload = function(){
    const json = JSON.parse(req.responseText);
    const dataset = json.data;
    
    const years = dataset.map(item => {
        let quarter;
        const temp = item[0].substring(5,7);

        if (temp === '01') {
            quarter = 'Q1';
        } else if (temp === '04') {
            quarter = 'Q2';
        } else if (temp === '07') {
            quarter = 'Q3';
        } else if (temp === '10') {
            quarter = 'Q4';
        }
        return item[0].substring(0,4) + ' ' + quarter;
    })

    const yearsDate = dataset.map(item => new Date(item[0]));

    //Declare chart properties
    const width = 700;
    const height = 500;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;
    const barWidth = width/275; //dataset.length = 275
    const tooltip = d3.select('#container')
                      .append('div')
                      .attr('id','tooltip')
                      .style('opacity',0);
    const overlay = d3.select('#container')
                      .append('div')
                      .attr('class','overlay')
                      .style('opacity',0);

    //Create SVG container
    const svg = d3.select('#container')
    .append("svg")
    .attr('width',width)
    .attr('height',height)
    .attr('viewBox',[0, 0, width-marginLeft, height+marginBottom]) //Make chart svg responsive
    .attr('style','max-width: 100%; height: auto;');

    const xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth()+3);
    const xScale = d3.scaleTime()
                     .domain([d3.min(yearsDate),xMax])
                     .range([0,width])

    const xAxis = d3.axisBottom().scale(xScale);

    //Add x axis
    svg.append('g')
       .call(xAxis)
       .attr('id','x-axis')
       .attr('transform',`translate(0,${height-marginBottom})`);
       
    //Add legend to x-axis
    svg.append('text')
       .attr('x', width/2 - 20)
       .attr('y', height + 10)
       .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf') 
       .attr('class','info');

    const GDP = dataset.map(item => item[1]);
    
    let scaleGDP = [];
    
    const gdpMax = d3.max(GDP);
    
    const linearScale = d3.scaleLinear()
                          .domain([0,gdpMax])
                          .range([0,height - marginTop - marginBottom]);
    
    scaleGDP = GDP.map(item => linearScale(item));
    
    const yAxisScale = d3.scaleLinear()
                         .domain([0,gdpMax])
                         .range([height-marginBottom, marginTop]);
    
    const yAxis = d3.axisLeft(yAxisScale);
    
    //Add y axis
    svg.append('g')
       .call(yAxis)
       .attr('id','y-axis')       
       .attr('transform',`translate(0,0)`);       
    
    //Add legend to y-axis
    svg.append('text')
       .attr('x', -width/4 + 10)
       .attr('y', 20)
       .attr('transform','rotate(-90)')
       .text('Gross Domestic Product');
    
    //Draw rects for each data
    d3.select('svg')
      .selectAll('rect')
      .data(scaleGDP)
      .enter()
      .append('rect')
      .attr('data-date', (d,i) => dataset[i][0])
      .attr('data-gdp', (d,i) => dataset[i][1])
      .attr('class','bar')
      .attr('x', (d,i) => xScale(yearsDate[i]))
      .attr('y', d => height - d - marginBottom - 1)
      .attr('width', barWidth)
      .attr('height', d => d)
      .attr('index', (d,i) => i)
      .attr('fill','steelblue')
      .on('mouseover', (event,d) => {
        //d is the height of the current rect
        const i = event.currentTarget.getAttribute('index');
        
        // overlay
        //     .transition()
        //     .duration(0)
        //     .style('height', d + 'px')
        //     .style('width', barWidth + 'px')
        //     .style('opacity',0.9)
        //     .style('left',i * barWidth + 0 + 'px')
        //     .style('top', height - d + 136 + 'px')
        //     .style('transform','translateX(60px)');
        tooltip.transition().duration(200).style('opacity',0.9);
        tooltip
            .html(
                years[i] +
                    '<br>' +
                    '$' +
                    GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g,'$1,') +
                    ' Billion'
            )
            .attr('data-date',dataset[i][0])
            .style('left', i * barWidth + 30 + 'px')
            .style('top', height+'px')
            .style('transform', 'translateX(60px)') 
      })
      .on('mouseout', function(){
        tooltip.transition().duration(200).style('opacity',0);
        overlay.transition().duration(200).style('opacity',0);
      });
}

