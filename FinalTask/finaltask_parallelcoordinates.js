class ParallelCoodinates {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 356,
            height: config.height || 256,
            margin: config.margin || {top:30, right:40, bottom:40, left:80}
        }
        this.data = data;
        this.init();
        this.index = 0;
        this.labelname = ["交通量", "降水量", "日照時間", "気温"];
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

        self.xscale = d3.scaleBand()
            .range( [0, self.inner_width] );

        self.xaxis = d3.axisBottom( self.xscale )
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.trafficyscale = d3.scaleLinear()
            .range( [self.inner_height,0] );

        self.trafficyaxis = d3.axisLeft( self.trafficyscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.trafficyaxis_group = self.chart.append('g');

        self.precipitationyscale = d3.scaleLinear()
            .range( [self.inner_height,0] );
        
        self.precipitationyaxis = d3.axisLeft( self.precipitationyscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.precipitationyaxis_group = self.chart.append('g')
            .attr('transform', `translate(${this.inner_width/3},0)`);

        self.daylightyscale = d3.scaleLinear()
            .range( [self.inner_height,0] );
        
        self.daylightyaxis = d3.axisLeft( self.daylightyscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.daylightyaxis_group = self.chart.append('g')
            .attr('transform', `translate(${this.inner_width*2/3},0)`);

        self.temperatureyscale = d3.scaleLinear()
            .range( [self.inner_height,0] );
        
        self.temperatureyaxis = d3.axisLeft( self.temperatureyscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.temperatureyaxis_group = self.chart.append('g')
            .attr('transform', `translate(${this.inner_width},0)`);

        self.trafficLine = d3.line()
            .x( d=> self.xscale( d ) )
            .y( d => self.trafficyscale(self.data.traffic) );

        self.targetLine = d3.line()
            .x( d => self.xscale( self.labelname ) )
            .y( d => self.precipitationyscale(d.precipitation) );

        self.area = d3.area()
            .x( d => self.xscale( d.month ) )
            .y1( d => self.trafficyscale(d.traffic) )
            .y0( self.trafficyscale(0) );

        self.colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([0, 11]);

    }

    update() {
        let self = this;
        const trafficxmin = d3.min( self.data, d => d.traffic );
        const trafficxmax = d3.max( self.data, d => d.traffic );

        self.trafficyscale.domain( [trafficxmin, trafficxmax] );

        const precipitationxmin = d3.min( self.data, d => d.precipitation );
        const precipitationxmax = d3.max( self.data, d => d.precipitation );

        self.precipitationyscale.domain( [precipitationxmin, precipitationxmax] );

        const daylightxmin = d3.min( self.data, d => d.daylight );
        const daylightxmax = d3.max( self.data, d => d.daylight );

        self.daylightyscale.domain( [daylightxmin, daylightxmax] );

        const temperaturexmin = d3.min( self.data, d => d.temperature );
        const temperaturexmax = d3.max( self.data, d => d.temperature );

        self.temperatureyscale.domain( [temperaturexmin, temperaturexmax] );

        self.xscale.domain(self.labelname)
                   .paddingInner(1);

        self.render();
    }

    GetIndex() {
        this.index = this.index + 1;
        return this.index 
    }

    render() {
        let self = this;

        this.index = 0;

        self.chart.selectAll("line")
                  .data(self.data)
                  .enter()
                  .append("line")
                  .attr("x1",0)
                  .attr("x2",this.inner_width/3)
                  .attr("y1",d => this.trafficyscale(d.traffic))
                  .attr("y2",d => this.precipitationyscale(d.precipitation))
                  .attr("stroke-width",2)
                  .attr("stroke",function(d) {return self.colorScale(self.GetIndex(d)); });

        this.index = 0;

        self.chart.selectAll("line1")
                  .data(self.data)
                  .enter()
                  .append("line")
                  .attr("x1",this.inner_width/3)
                  .attr("x2",this.inner_width*2/3)
                  .attr("y1",d => this.precipitationyscale(d.precipitation))
                  .attr("y2",d => this.daylightyscale(d.daylight))
                  .attr("stroke-width",2)
                  .attr("stroke",function(d) {return self.colorScale(self.GetIndex(d)); });

        this.index = 0;

        self.chart.selectAll("line2")
                  .data(self.data)
                  .enter()
                  .append("line")
                  .attr("x1",this.inner_width*2/3)
                  .attr("x2",this.inner_width)
                  .attr("y1",d => this.daylightyscale(d.daylight))
                  .attr("y2",d => this.temperatureyscale(d.temperature))
                  .attr("stroke-width",2)
                  .attr("stroke",function(d) {return self.colorScale(self.GetIndex(d)); });

        this.index = 0;
        
        self.chart.selectAll("circle")
                  .data(self.data)
                  .enter()
                  .append("circle")
                  .attr("cx", d => self.xscale( self.labelname[0] ))
                  .attr("cy", d => self.trafficyscale( d.traffic ))
                  .attr("r", 3)
                  .attr('fill', function(d) {return self.colorScale(self.GetIndex(d)); })
                  .on('mouseover', (e,d) => {
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">Position</div>(${d.month+"月"}})`);
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

        this.index = 0;

        self.chart.selectAll("circle1")
                  .data(self.data)
                  .enter()
                  .append("circle")
                  .attr("cx", d => self.xscale( self.labelname[1] ))
                  .attr("cy", d => self.precipitationyscale( d.precipitation ))
                  .attr("r", 3)
                  .attr('fill', function(d) {return self.colorScale(self.GetIndex(d)); });

        this.index = 0;

        self.chart.selectAll("circle2")
                .data(self.data)
                .enter()
                .append("circle")
                .attr("cx", d => self.xscale( self.labelname[2] ))
                .attr("cy", d => self.daylightyscale( d.daylight ))
                .attr("r", 3)
                .attr('fill', function(d) {return self.colorScale(self.GetIndex(d)); });

        this.index = 0;

        self.chart.selectAll("circle3")
                .data(self.data)
                .enter()
                .append("circle")
                .attr("cx", d => self.xscale( self.labelname[3] ))
                .attr("cy", d => self.temperatureyscale( d.temperature ))
                .attr("r", 3)
                .attr('fill', function(d) {return self.colorScale(self.GetIndex(d)); });

        self.xaxis_group
            .call( self.xaxis );
        
        self.trafficyaxis_group
            .call( self.trafficyaxis );

        self.precipitationyaxis_group
            .call( self.precipitationyaxis );

        self.daylightyaxis_group
            .call( self.daylightyaxis );

        self.temperatureyaxis_group
            .call( self.temperatureyaxis );
        
    }
}