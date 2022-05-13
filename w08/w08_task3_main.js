d3.csv("https://takegami-r.github.io/infovis2022/w08/w08_task1.csv")
    .then( data => {
        data.forEach( d => {d.value = +d.value; d.label = d.label;});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            radius: 128
        };

        const pie_chart = new PieChart( config, data);
        pie_chart.update();
     })
     .catch( error => {
        console.log( error );
     });
     

class PieChart{
     
    constructor( config, data ) { 
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            radius: config.radius || Math.min( this.width, this.height ) / 2
        }
        this.data = data;
        this.index = 0;
        this.init();
    }

    init() { 
        let self = this;

        self.svg = d3.select( self.config.parent ) 
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);


        self.pie = d3.pie()
            .value( d => d.value);

        self.arc = d3.arc()
            .innerRadius(self.config.radius/3)
            .outerRadius(self.config.radius);
 
    }

    update() { 
        let self = this;

        self.render();

    }

    GetIndex() {
        this.index = this.index + 1;
        return this.index 
    }


    render() { 
        let self = this;

        self.svg.selectAll("pie")
            .data(self.pie(self.data))
            .enter()
            .append("path")
            .attr('d', self.arc)
            .attr('fill', function(d) {return d3.schemeSet1[self.GetIndex(d)]; })
            .attr("stroke",'white' )
            .attr("stroke-width", '2px');

 
        self.svg.selectAll("text")
            .data(self.pie(self.data))
            .enter()
            .append("text")
            .attr("fill", "white")
            .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")"; })
            .attr("dy", "5px")
            .attr("font", "10px")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.data.label; });
        }
}
