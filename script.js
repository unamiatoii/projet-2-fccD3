// script.js
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// Fetch the dataset
fetch(url)
  .then(response => response.json())
  .then(data => {
    createChart(data);
  });

function createChart(dataset) {
  // Chart dimensions
  const width = 1000;
  const height = 600;
  const padding = 60;

  // Create SVG element
  const svg = d3.select('#chart')
    .attr('width', width)
    .attr('height', height);

  // Create scales
  const xScale = d3.scaleLinear()
    .domain([d3.min(dataset, d => d.Year - 1), d3.max(dataset, d => d.Year + 1)])
    .range([padding, width - padding]);

  const yScale = d3.scaleTime()
    .domain(d3.extent(dataset, d => new Date(d.Seconds * 1000)))
    .range([height - padding, padding]);

  // Create axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format('d'));

  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat('%M:%S'));

  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(xAxis);

  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

  // Create dots
  svg.selectAll('.dot')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', 6)
    .attr('cx', d => xScale(d.Year))
    .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => new Date(d.Seconds * 1000))
    .on('mouseover', (event, d) => {
      const tooltip = d3.select('#tooltip');
      tooltip.html(`
        Year: ${d.Year}<br/>
        Time: ${d.Time}<br/>
        ${d.Doping ? `Doping: ${d.Doping}` : 'No doping allegations'}
      `)
        .attr('data-year', d.Year)
        .classed('hidden', false)
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`);
    })
    .on('mouseout', () => {
      d3.select('#tooltip')
        .classed('hidden', true);
    });

  // Create legend
  const legend = svg.append('g')
    .attr('id', 'legend');

  legend.append('rect')
    .attr('x', width - 200)
    .attr('y', height - 120)
    .attr('width', 18)
    .attr('height', 18)
    .attr('fill', 'steelblue');

  legend.append('text')
    .attr('x', width - 170)
    .attr('y', height - 109)
    .text('Riders with doping allegations');
}
