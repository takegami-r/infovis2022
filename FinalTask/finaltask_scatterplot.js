class ScatterPlot {

    constructor( config, inputdata ) {
        this.config = {
            parent: config.parent,
            width: config.width || 356,
            height: config.height || 256,
            margin: config.margin || {top:30, right:40, bottom:60, left:60}
        }
        this.inputdata = inputdata;
        this.init();
    }

    setLeftLabel(leftlabel){
        this.leftlabel = leftlabel; 
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.label = self.svg.append('g');

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(6);

        self.xaxis_group = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.height- self.config.margin.bottom+10})`);
        
        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(6);

        self.yaxis_group = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left-10},${self.config.margin.top})`);
    }

    update() {
        let self = this;

        const xmin = d3.min( self.inputdata, d => d.traffic );
        const xmax = d3.max( self.inputdata, d => d.traffic );
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.inputdata, d => d.target );
        const ymax = d3.max( self.inputdata, d => d.target );
        self.yscale.domain( [ymin, ymax] );

        self.render();
    }

    render() {
        let self = this;

        self.label.selectAll("text").remove();
        self.chart.selectAll("circle").remove();

        self.chart.selectAll("circle")
            .data(self.inputdata)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.traffic ) )
            .attr("cy", d => self.yscale( d.target ) )
            .attr("r", d => 5.0 )
            .attr("class", "circle")
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(${d.month+"月"}, ${d.traffic}, ${d.target})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            });

        self.xaxis_group
            .call( self.xaxis );

        self.label.append("text")
            .attr("fill", "black")
            .attr("x", self.config.margin.left+self.inner_width/2)
            .attr("y", self.config.margin.top+self.inner_width+self.config.margin.bottom/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text("平均交通量(台/日)");
        
        self.yaxis_group
            .call( self.yaxis );


        self.label.append("text")
            .attr("fill", "black")
            .attr("x", -self.config.margin.top-self.inner_height/2)
            .attr("y", self.config.margin.left/4)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .attr("font-size", "10pt")
            .text(self.leftlabel);

    }
}