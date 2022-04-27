d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then( data => {
        // Convert strings to numbers
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        ShowScatterPlot(data);
    })
    .catch( error => {
        console.log( error );
    });

function ShowScatterPlot( data ) {
    const width = 256;
    const height = 256;
    const margin = {top: 10, right: 10, bottom: 10, left: 10};
    var svg = d3.select("body").append("svg")
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    var xscale = d3.scaleLinear()
        .domain( [d3.min(data, d => d.x), d3.max(data, d => d.x)] )
        .range( [0, width - margin.left - margin.right ] );

    var yscale = d3.scaleLinear()
        .domain( [d3.min(data, d => d.y), d3.max(data, d => d.y)] )
        .range( [0, height - margin.top - margin.bottom] );

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xscale(d.x))
        .attr("cy", d => yscale(d.y))
        .attr("r", d => d.r);
};
