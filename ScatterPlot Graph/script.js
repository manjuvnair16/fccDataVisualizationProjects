document.addEventListener('DOMContentLoaded', function () {

  const req = new XMLHttpRequest();

  req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
  req.send();
  req.onload = function () {

    const json = JSON.parse(req.responseText);
    const dataset = json;

    const w = 1000;
    const h = 500;
    const padding = 30;

    var timeFormat = d3.timeParse("%M:%S");
    dataset.forEach(obj => {
      obj.Time = timeFormat(obj.Time);
    });

    yTimeMin = d3.min(dataset, dataset => dataset.Time);
    yTimeMin = timeFormat(yTimeMin.getMinutes() + ':' + (yTimeMin.getSeconds() - 20));
    yTimeMax = d3.max(dataset, dataset => dataset.Time);
    yTimeMax = timeFormat(yTimeMax.getMinutes() + 1 + ':00');

    const yScale = d3.scaleTime().
    domain([yTimeMax, yTimeMin]).
    range([h - padding, padding + 20]);

    var yearFormat = d3.timeParse("%Y");
    dataset.forEach(obj => {
      obj.Year = yearFormat(obj.Year);
    });

    xYearMin = d3.min(dataset, dataset => dataset.Year);
    xYearMin = yearFormat(xYearMin.getFullYear() - 1);
    xYearMax = d3.max(dataset, dataset => dataset.Year);
    xYearMax = yearFormat(xYearMax.getFullYear() + 1);

    const xScale = d3.scaleTime().
    domain([xYearMin, xYearMax]).
    range([padding + 20, w - padding]);



    const svg = d3.select('body').
    append('svg').
    attr('height', h).
    attr('width', w);


    svg.append('text').
    attr('id', 'title').
    attr('font-size', '35px').
    text('Scatterplot Graph - Doping in Cycle Racing').
    attr('x', 200).
    attr('y', 30);

    var tooltip = d3.select('#main').
    append('div').
    attr('id', 'tooltip');

    var displayTimeFormat = d3.timeFormat("%M:%S");
    var displayYear = d3.timeFormat("%Y");

    svg.selectAll('circle').
    data(dataset).
    enter().
    append('circle').
    attr('class', 'dot').
    attr('cx', d => xScale(d.Year)).
    attr('cy', d => yScale(d.Time)).
    attr('r', '5').
    attr('fill', d => d.Doping !== "" ? 'red' : 'green').
    attr('Name', d => d.Name).
    attr('Time', d => displayTimeFormat(d.Time)).
    attr('data-xvalue', d => displayYear(d.Year)).
    attr('data-yvalue', d => d.Time).
    attr('Doping', d => d.Doping).
    on('mouseover', function (e) {
      const circle = d3.select(this);
      tooltip.text(`Name: ${circle.attr('Name')}\nTime: ${circle.attr('Time')}\nYear: ${circle.attr('data-xvalue')}\n${circle.attr('Doping')}`).
      style("visibility", "visible").
      style("left", e.pageX + 15 + 'px').
      style("top", e.pageY - 10 + 'px').
      attr('data-year', circle.attr('data-xvalue'));
    }).
    on("mouseout", function (d) {
      tooltip.style('visibility', 'hidden');
    });


    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale).
    tickFormat(displayTimeFormat);

    svg.append('g').
    attr("transform", "translate (0,470)").
    attr('id', 'x-axis').
    call(xAxis);

    svg.append('g').
    attr("transform", "translate(50,0)").
    attr('id', 'y-axis').
    call(yAxis);

    d3.select('#main').
    append('div').
    attr('id', 'legend').
    text('\n Riders with doping allegation:\n\n Riders without allegations:');

    svg.append('circle').
    attr('cx', '985').
    attr('cy', '155').
    attr('r', '5').
    attr('fill', 'red').
    attr('stroke', 'black');

    svg.append('circle').
    attr('cx', '985').
    attr('cy', '190').
    attr('r', '5').
    attr('fill', 'green').
    attr('stroke', 'black');

  };

});