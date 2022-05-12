d3.csv("https://takegami-r.github.io/infovis2022/w08/w08_task2.csv")
    .then( data => {
        data.forEach( d => {d.x = +d.x; d.y = +d.y});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 148,
            margin: {top:30, right:10, bottom:40, left:50}
        };

        const lineChart = new LineChart( config, data );
        lineChart.update();
    })
    .catch( error => {
        console.log( error );
    });

class LineChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || {top:10, right:10, bottom:20, left:60}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);


        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height,0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5);
            //.tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(5);
            //.tickSizeOuter(0);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0,0)`);

        self.line = d3.line()
            .x( d => self.xscale(d.x) )
            .y( d => self.yscale(d.y) );

        self.area = d3.area()
            .x( d => self.xscale(d.x) )
            .y1( d => self.yscale(d.y) )
            .y0( self.yscale(0) );
    }

    update() {
        let self = this;
        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );

        self.xscale.domain( [0, xmax] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );

        self.yscale.domain( [0, ymax] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.append('path')
                  .attr('d', self.line(self.data))
                  .attr('stroke', 'black')
                  .attr('fill', 'none');

        self.chart.append('path')
                  .attr('d', self.area(self.data))
                  .attr('stroke', 'none')
                  .attr("fill", "rgba(0, 30, 150, 0.3)");
        
        self.chart.selectAll("circle")
                  .data(self.data)
                  .enter()
                  .append("circle")
                  .attr("cx", d => self.xscale(d.x))
                  .attr("cy", d => self.yscale(d.y))
                  .attr("r", 3);

        self.svg.append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width/2+self.config.margin.left)
            .attr("y", self.config.margin.top/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "12pt")
            .attr("font-weight", "bold")
            .text("Graph title")
            ;

        self.svg.append("text")
        .attr("fill", "black")
        .attr("x", -self.inner_height/2-self.config.margin.top)
        .attr("y", self.config.margin.left/4)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("font-size", "10pt")
        .text("Y Label");

        self.svg.append("text")
            .attr("fill", "black")
            .attr("x",self.inner_width/2 + self.config.margin.left )
            .attr("y", self.config.height - self.config.margin.bottom/4)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text("X Label");

        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis )
        
    }
}