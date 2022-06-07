class LineChart {

    constructor( config, inputdata ) {
        this.config = {
            parent: config.parent,
            width: config.width || 356,
            height: config.height || 256,
            margin: config.margin || {top:30, right:40, bottom:40, left:80}
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


        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.label = self.svg.append('g');

        self.xscale = d3.scaleBand()
            .range( [0, self.inner_width] );

        self.xaxis = d3.axisBottom( self.xscale )
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.leftyscale = d3.scaleLinear()
            .range( [self.inner_height,0] );

        self.leftyaxis = d3.axisLeft( self.leftyscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.leftyaxis_group = self.chart.append('g');

        self.rightyscale = d3.scaleLinear()
            .range( [self.inner_height,0] );
        
        self.rightyaxis = d3.axisRight( self.rightyscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.rightyaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.inner_width},0)`);

        self.trafficLine = d3.line()
            .x( d => self.xscale( d.month ) )
            .y( d => self.leftyscale(d.traffic) );

        self.targetLine = d3.line()
            .x( d => self.xscale( d.month ) )
            .y( d => self.rightyscale(d.target) );

        self.area = d3.area()
            .x( d => self.xscale( d.month ) )
            .y1( d => self.leftyscale(d.traffic) )
            .y0( self.leftyscale(0) );
    }

    update() {
        let self = this;
        const leftxmin = d3.min( self.inputdata, d => d.traffic );
        const leftxmax = d3.max( self.inputdata, d => d.traffic );

        const rightxmin = d3.min( self.inputdata, d => d.target );
        const rightxmax = d3.max( self.inputdata, d => d.target );

        self.leftyscale.domain( [leftxmin, leftxmax] );

        self.rightyscale.domain( [rightxmin, rightxmax] );

        self.xscale.domain(self.inputdata.map(d => d.month))
                   .paddingInner(1);

        self.render();
    }

    render() {
        let self = this;

        self.label.selectAll("text").remove();
        self.chart.selectAll("circle").remove();
        self.chart.selectAll("path").remove();

        self.chart.append('path')
                  .attr('d', self.trafficLine(self.inputdata))
                  .attr('stroke', 'black')
                  .attr('fill', 'none');

        self.chart.append('path')
                  .attr('d', self.area(self.inputdata))
                  .attr('stroke', 'none')
                  .attr("fill", "rgba(0, 30, 150, 0.3)");

        self.chart.append('path')
                  .attr('d', self.targetLine(self.inputdata))
                  .attr('stroke', 'red')
                  .attr('fill', 'none');
        
        self.chart.selectAll("circle")
                  .data(self.inputdata)
                  .enter()
                  .append("circle")
                  .attr("cx", d => self.xscale( d.month ))
                  .attr("cy", d => self.leftyscale( d.traffic ))
                  .attr("r", 3);

        self.chart.selectAll("circle2")
                  .data(self.inputdata)
                  .enter()
                  .append("circle")
                  .attr("cx", d => self.xscale( d.month ))
                  .attr("cy", d => self.rightyscale( d.target ))
                  .attr("r", 3)
                  .attr('stroke', 'none')
                  .attr('fill', 'red');

        /*
        self.label.append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width/2+self.config.margin.left)
            .attr("y", self.config.margin.top/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "12pt")
            .attr("font-weight", "bold")
            .text("Graph title");
        */

        self.label.append("text")
            .attr("fill", "black")
            .attr("x", -self.inner_height/2-self.config.margin.top)
            .attr("y", self.config.margin.left/4)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .attr("font-size", "10pt")
            .text("平均交通量(台/日)");
        
        self.label.append("text")
            .attr("fill", "black")
            .attr("x", self.inner_height/2+self.config.margin.top)
            .attr("y", -self.inner_width-self.config.margin.left-3*self.config.margin.right/4)
            .attr("transform", "rotate(90)")
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .attr("font-size", "10pt")
            .text(this.leftlabel);

        self.label.append("text")
            .attr("fill", "black")
            .attr("x",self.inner_width/2 + self.config.margin.left )
            .attr("y", self.config.height - self.config.margin.bottom/4)
            .attr("text-anchor", "middle")
            .attr("font-size", "10pt")
            .attr("font-weight", "bold")
            .text("月");

        self.xaxis_group
            .call( self.xaxis );
        
        self.leftyaxis_group
            .call( self.leftyaxis );

        self.rightyaxis_group
            .call( self.rightyaxis );
        
    }
}