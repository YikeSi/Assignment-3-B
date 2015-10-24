console.log("Assignment 3");

//Set up drawing environment with margin conventions
var margin = {t:20,r:20,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.l - margin.r,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width + margin.l + margin.r)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','plot-area')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//


//Initialize axes
//Consult documentation here https://github.com/mbostock/d3/wiki/SVG-Axes
var scaleX,scaleY,scaleY2;

var tip = d3.select("body")
    .append('tip')
    .attr('class', 'd3-tip')
    .style('opacity',0);



var axisX = d3.svg.axis()
    .orient('bottom')
    .tickSize(-height);
var axisY = d3.svg.axis()
    .orient('left')
    .tickSize(-width);



//Start importing data
d3.csv('data/world_bank_2012.csv', parse, dataLoaded);

function parse(d){
    if(d["GDP per capita, PPP (constant 2011 international $)"] == ".."){
        return;
    }
    var newdata = {
        perCap: d["GDP per capita, PPP (constant 2011 international $)"] == ".."? undefined: +d["GDP per capita, PPP (constant 2011 international $)"],
        primComple : d["Primary completion rate, total (% of relevant age group)"] == ".."? undefined: +d["Primary completion rate, total (% of relevant age group)"],
        urbanPopu : d["Urban population (% of total)"] == ".."? undefined:+d["Urban population (% of total)"],
        cName : d["Country Name"],
        cCode : d["Country Code"]
    }
    return (newdata);

}

function dataLoaded(error, rows){
    var minprimComple = d3.min(rows, function(d){return d.primComple }),
        maxprimComple = d3.max(rows, function(d){return d.primComple});

    var perCapMIN = d3.min(rows, function(d){return d.perCap}),
        perCapMAX = d3.max(rows, function(d){return d.perCap});

    var urbanPopMIN = d3.min(rows, function(d){return d.urbanPopu}),
        urbanPopMAX = d3.max(rows,function(d){return d.urbanPopu});

    console.log(perCapMIN, perCapMAX);

    scaleX = d3.scale.log().domain([perCapMIN,perCapMAX]).range([0,width]);
    scaleY = d3.scale.linear().domain([0,250]).range([height,0]);
    //scaleY2 = d3.scale.linear().domain([minprimComple,maxprimComple]).range([height,0]);

console.log(rows);

    axisX.scale(scaleX);
    axisY.scale(scaleY);



    plot.append('g')
        .attr('class','axis axis-x')
        .attr('transform','translate(0,'+height+')')
        .call(axisX)
    plot.append('g')
        .attr('class','axis axis-y')
        .call(axisY)

    //plot.append('rect')
    //    .attr("class","countryLabel")
    //    .attr('transform',function(d){
    //        return 'translate('+scaleX(d.perCap)+','+scaleY+')'
    //    })
    //    .attr('x1', 892.0996828132694)
    //    .attr('x2', 892.0996828132694)
    //    .attr('y1',334.59165)
    //    .attr('y2',530)
    //    .style('fill', "red");




    var country = plot.selectAll('g')
        .data(rows)
        .enter()
        .append('g')
        .attr('class','country')
    country.append('line')
            .attr('class','redline')
            .attr('x1',function(d){return scaleX(d.perCap) })
            .attr('y1',function(d){if(d.urbanPopu == undefined){return height;} else{return scaleY(d.urbanPopu)}})
            .attr('x2',function(d){return scaleX(d.perCap)})
            .attr('y2',height)
            .style('stroke','rgb(255, 204, 0)')
            .style('stroke-width',3)
        .on('mouseover',function(d){
            d3.select(".countryLabel")
                .append("text")
                .text(function(d){return(d.cName)})
                .transition()
                .style('opacity',1)
            tip.transition()
                .duration(100)
                .style("opacity", 0.9);
            tip.html(d.cName+':'+d.urbanPopu);
        }
    )
            .on('mouseout',function(){
                tip.transition()
                    .duration(100)
                    .style("opacity", 0);
            }
        )


    country.append('line')
            .attr('class','blueline')
            .attr('transform','translate('+6+','+0+')')
            .attr('x1',function(d){return scaleX(d.perCap)})
            .attr('y1',function(d){if (d.primComple == undefined){return height;} else{return d.primComple}})
            .attr('x2',function(d){return scaleX(d.perCap)})
            .attr('y2',height)
            .style('stroke','rgb(51, 102, 153)')
            .style('stroke-width',3)
            .on('mouseover',function(d){
                    tip.transition()
                        .duration(100)
                        .style("opacity", 0.9);
                    tip.html(d.cName+':'+d.primComple)

                    }
            )
        .on('mouseout',function(){
            tip.transition()
                .duration(100)
                .style("opacity", 0);
        }
    )

    }











    //each country should have two <line> elements, nested under a common <g> element




