document.addEventListener('DOMContentLoaded', function () {

  const req = new XMLHttpRequest();
  req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json", true);
  req.send();

  req.onload = function () {

    const json = JSON.parse(req.responseText);
    const baseTemp = json.baseTemperature;
    const dataset = json.monthlyVariance;

    const margin = { top: 10, right: 80, bottom: 30, left: 60 };

    const h = 500 - margin.top - margin.bottom;
    const w = 1200 - margin.left - margin.right;
    const padding = 30;


    const svg = d3.select("body").
    append("svg").
    attr("height", h + margin.top + margin.bottom).
    attr("width", w + margin.left + margin.right).
    append("g").
    attr('transform', "translate(" + margin.left + "," + margin.top + ")");


    let yearArr = [];
    dataset.forEach(obj => {
      obj.month = obj.month - 1;
      if (yearArr.indexOf(obj.year) === -1) {

        yearArr.push(obj.year);
      }
    });



    const tempArr = dataset.map(obj => Math.ceil(obj.variance + baseTemp));
    const minTemp = d3.min(tempArr);
    const maxTemp = d3.max(tempArr);
    const colors = [

    '#313695', '#4575b4',
    '#74add1', '#abd9e9',
    '#e0f3f8', '#ffffbf',
    '#fee090', '#fdae61',
    '#f46d43', '#d73027',
    '#a50026'];

    const colrsLen = colors.length;
    let scaleTempArr = [];
    let step = (maxTemp - minTemp) / colrsLen;
    for (let i = 1; i < colrsLen; i++) {
      scaleTempArr.push(Math.round(minTemp + i * step));
    }


    color = d3.scaleThreshold().
    range(colors).
    domain(scaleTempArr);


    const xScale = d3.scaleBand().
    domain(yearArr).
    range([0, w]);


    const xAxis = d3.axisBottom(xScale).
    tickValues(yearArr.filter((year, i) => i === 0 || i === yearArr.length - 1 || i % 25 === 0)) //display fewer values so that the text doesnt overlap. ticks() doesn't work in this context
    .tickFormat((d, i) => d);

    svg.append("g").
    attr("transform", "translate(0," + h + ")").
    attr("id", "x-axis").
    call(xAxis);

    const yScale = d3.scaleBand().
    domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).
    range([h, 0]);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const yAxis = d3.axisLeft(yScale).
    tickFormat((d, i) => months[i]);

    svg.append("g").
    attr("id", "y-axis").
    call(yAxis);

    svg.selectAll("rect").
    data(dataset).
    enter().
    append("rect").
    attr("class", "cell").
    attr("x", d => xScale(d.year)).
    attr("y", d => yScale(d.month)).
    attr("width", d => xScale.bandwidth(d.year)).
    attr("height", d => yScale.bandwidth(d.month)).
    attr("fill", d => color(Math.round(d.variance + baseTemp))).
    attr("data-month", d => d.month).
    attr("data-year", d => d.year).
    attr("data-temp", d => Math.round(d.variance + baseTemp)).
    attr("data-var", d => d.variance).
    on("mouseover", function (e) {//code for tooltip
      const rec = d3.select(this);
      d3.select("#tooltip").
      text(`Year: ${rec.attr("data-year")}\nMonth: ${months[rec.attr("data-month")]}\nTemp: ${rec.attr("data-temp")}\u00B0C\nVariance: ${rec.attr("data-var")}\u00B0C`).
      style("visibility", "visible").
      style("left", e.pageX + 15 + 'px').
      style("top", e.pageY - 10 + 'px').
      attr('data-year', rec.attr('data-year'));
    }).
    on("mouseout", function (e) {
      d3.select("#tooltip").
      style("visibility", "hidden");
    });


    //code for legend
    const yLegScale = d3.scaleBand().
    domain(scaleTempArr).
    range([h / 4, h / 1.15]);


    const yLegAxis = d3.axisRight(yLegScale);


    svg.append("g").
    attr("transform", "translate(" + (w + 45) + ",0)").
    call(yLegAxis);

    const legend = svg.append("g").
    attr("id", "legend").
    attr("transform", "translate(" + (w + 20) + ",0)");

    legend.append("g").
    selectAll("rect").
    data(scaleTempArr).
    enter().
    append("rect").
    attr("x", "4").
    attr("y", s => yLegScale(s)).
    attr("height", s => yLegScale.bandwidth(s)).
    attr("width", "20").
    attr("fill", s => color(s));


  };


});