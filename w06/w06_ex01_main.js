d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then( data => {
        ShowScatterPlot( data );
    })
    .catch( error => {
        console.error( error );
    });

function ShowScatterPlot( data ) {
    var svg = d3.select("body").append("svg");
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.r);
};
