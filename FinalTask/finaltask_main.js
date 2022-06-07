d3.csv("https://takegami-r.github.io/infovis2022/FinalTask/H27traffic_weather.csv")
    .then( data => {
        data.forEach(d =>{d.month = d.month; d.traffic = +d.traffic; d.precipitation = +d.precipitation; d.daylight = +d.daylight; d.temperature = +d.temperature;} )
        inputdata = data;
        inputdata.forEach(d =>{
            d.month = d.month;
            d.traffic = +d.traffic;
            d.target = +d.precipitation;
        })

        inputdata_para = data;
        inputdata_para.forEach(d =>{
            d.month = d.month;
            d.traffic = +d.traffic; 
            d.precipitation = +d.precipitation; 
            d.daylight = +d.daylight; 
            d.temperature = +Math.abs(d.temperature-22); } )

        var config_linechart = {
            parent: '#drawing_region_linechart',
            width: 356,
            height: 256,
            margin: {top:30, right:50, bottom:40, left:80}
        };

        var config_scatterplot = {
            parent: '#drawing_region_scatterplot',
            width: 300,
            height: 256,
            margin: {top:30, right:40, bottom:50, left:60}
        };

        var config_parallelcoodinates = {
            parent: '#drawing_region_parallelcoordinates',
            width: 670,
            height: 256,
            margin: {top:30, right:40, bottom:40, left:80}
        };

        const lineChart = new LineChart( config_linechart, inputdata );
        lineChart.setLeftLabel("平均降水量(mm/日)");
        lineChart.update();

        const scatterplot = new ScatterPlot( config_scatterplot, inputdata );
        scatterplot.setLeftLabel("平均降水量(mm/日)");
        scatterplot.update();

        const parallelcoodinates = new ParallelCoodinates( config_parallelcoodinates, inputdata );
        parallelcoodinates.update();

        d3.select('#precipitation').on('click', d => {
            inputdata.forEach(d =>{
                d.month = d.month;
                d.traffic = +d.traffic;
                d.target = +d.precipitation;
            })
            lineChart.setLeftLabel("平均降水量(mm/日)");
            lineChart.update();

            scatterplot.setLeftLabel("平均降水量(mm/日)");
            scatterplot.update();

            const labelname = ["交通量", "降水量", "日照時間", "気温"];
            const labelorder = [0,1,2,3];
            parallelcoodinates.setLabelName(labelname);
            parallelcoodinates.setLabelOrder(labelorder);
            parallelcoodinates.update();
        });
        d3.select('#daylight').on('click', d => {
            inputdata.forEach(d =>{
                d.month = d.month;
                d.traffic = +d.traffic;
                d.target = +d.daylight;
            })
            lineChart.setLeftLabel("平均日照時間(h/日)");
            lineChart.update();

            scatterplot.setLeftLabel("平均日照時間(h/日)");
            scatterplot.update();

            const labelname = ["交通量", "日照時間", "気温", "降水量"];
            const labelorder = [0,3,1,2];
            parallelcoodinates.setLabelName(labelname);
            parallelcoodinates.setLabelOrder(labelorder);
            parallelcoodinates.update();
        });
        d3.select('#temperature').on('click', d => {
            inputdata.forEach(d =>{
                d.month = d.month;
                d.traffic = +d.traffic;
                d.target = +d.temperature;
            })
            lineChart.setLeftLabel("快適気温との差(℃)");
            lineChart.update();

            scatterplot.setLeftLabel("快適気温との差(℃)");
            scatterplot.update();

            const labelname = ["交通量", "気温", "降水量", "日照時間"];
            const labelorder = [0,2,3,1];
            parallelcoodinates.setLabelName(labelname);
            parallelcoodinates.setLabelOrder(labelorder);
            parallelcoodinates.update();
        });
    })
    .catch( error => {
        console.log( error );
    });
