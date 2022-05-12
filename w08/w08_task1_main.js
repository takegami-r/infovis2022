d3.csv("https://takegami-r.github.io/infovis2022/w08/w08_task1.csv")
    .then( data => {
        data.forEach( d => {d.value = +d.value; d.label = d.label});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 148,
            margin: {top:30, right:10, bottom:40, left:60}
        };

        const barChart = new BarChart( config, data );
        barChart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {

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

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleBand()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        self.yaxis_group = self.chart.append('g');
    }

    update() {
        let self = this;
        const xmin = 0;
        const xmax = d3.max( self.data, d => d.value );

        self.xscale.domain( [xmin, xmax] );

        self.yscale.domain(self.data.map(d => d.label))
                   .paddingInner(0.1);

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 0 )
            .attr("y", d => self.yscale( d.label ) )
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());

        self.svg.append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width/2+self.config.margin.left)
            .attr("y", self.config.margin.top/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "15pt")
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