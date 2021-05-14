document.addEventListener('DOMContentLoaded', function () {




  const req = new XMLHttpRequest();

  req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);

  req.send();

  req.onload = function () {

    const json = JSON.parse(req.responseText);

    const dataset = json['data']; //data is the key in the json object whose date and gdp value is needed to plot the graph


    /*  const margin = {top: 20, right: 10, bottom: 20, left: 10};
    const width = 500 - margin.left - margin.right,
         height = 300 - margin.top - margin.bottom;
    const g = d3.select("body").append("svg")
               .attr("width", width + margin.left + margin.right)
               .attr("height", height + margin.top + margin.bottom)
               .append("g")
               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  */


    const h = 500;
    const w = 1000;
    const padding = 30;
    const len = dataset.length - 1;
    let dt1 = new Date(dataset[0][0]);
    let dt2 = new Date(dataset[len][0]);

    const xScale = d3.scaleTime().
    domain([dt1, dt2]).
    range([padding + 10, w - padding]);

    const yScale = d3.scaleLinear().
    domain([0, d3.max(dataset, d => d[1])]).
    range([h - padding, padding]);



    const svg = d3.select('body').
    append('svg').
    attr('width', w).
    attr('height', h);

    const tooltip = d3.select('body').
    append('div').
    attr('id', 'tooltip').
    style("position", "absolute").
    text('tooltip');

    svg.on("mousemove", d => {tooltip.style("left", `${d.x + 15}px`);tooltip.style("top", '370px');});

    svg.selectAll('rect').
    data(dataset).
    enter().
    append('rect').
    attr('class', 'bar').
    attr('data-date', d => d[0]).
    attr('data-gdp', d => d[1]).
    attr('x', (d, i) => xScale(new Date(d[0]))).
    attr('y', d => yScale(d[1])).
    attr('height', d => h - 30 - yScale(d[1]))
    /*  .append('title')   //using title to add a tooltip doesn't pass the text although the tooltip is displayed, hence added a div element as a tooltip using mouseover method.
      .text((d,i) => d[0])
      .attr('id','tooltip')
      .attr('data-date','.data-date');*/.
    on("mouseover", function (d) {
      tooltip.text(`${d3.select(this).attr("data-date").split('-').reverse().join('-')}\n$${d3.select(this).attr("data-gdp")} Billion`);
      tooltip.attr("data-date", `${d3.select(this).attr("data-date")}`);
      tooltip.style("visibility", "visible");
    }).
    on("mouseout", d => tooltip.style("visibility", "hidden"));



    const xAxis = d3.axisBottom(xScale);
    // .ticks(3);
    //.tickFormat((d,i) => dataset[i][0]);



    svg.append('g').
    attr("transform", "translate (0," + (h - padding) + ")").
    attr('id', 'x-axis').
    call(xAxis);

    const yAxis = d3.axisLeft(yScale);

    svg.append('g').
    attr("transform", "translate(" + (padding + 10) + ",0)").
    attr('id', 'y-axis').
    call(yAxis);

    svg.append('text').
    attr('id', 'title').
    text('Gross Domestic Product').
    style('font-size', '35px').
    attr('x', 350).
    attr('y', 70);

  };

});