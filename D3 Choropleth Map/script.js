const projectName = 'Choropleth Map';
const margin = { top: 10, right: 80, bottom: 30, left: 200 };
const h = 800 - margin.top - margin.bottom;
const w = 1500 - margin.left - margin.right;

const svg = d3.select('body').
append('svg').
attr('height', h + margin.top + margin.bottom).
attr('width', w + margin.left + margin.right).
append('g').
attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const colorScale = d3.scaleQuantile().
range(["#a50026", "#ed643f", "#fee090", "#e1f298", "#c0e47c", "#a0d76d", "#128646"]);

let drawMap = (countyData, countyTopojsonData, eduData) => {
  const degData = eduData.map(item => item.bachelorsOrHigher);
  const legData = [0, 5, 10, 15, 20, 30, 40, 50];
  colorScale.domain(legData);


  svg.append('g').
  selectAll('path').
  attr('class', 'counties').
  data(countyTopojsonData).
  enter().
  append('path').
  attr('class', 'county').
  attr('data-fips', d => {
    const eduDataForCounty = eduData.find(item => {
      return item.fips === d.id;
    });
    return eduDataForCounty.fips;
  }).
  attr('data-education', d => {
    const eduDataForCounty = eduData.find(item => {
      return item.fips === d.id;
    });
    return eduDataForCounty.bachelorsOrHigher;
  }).
  attr('d', d3.geoPath()) //code which joins the coordinates for the path
  .attr('fill', d => {
    const eduDataForCounty = eduData.find(item => {
      return item.fips === d.id;
    });
    let eduDegree = eduDataForCounty.bachelorsOrHigher;
    return colorScale(eduDegree);
  }).
  on('mouseover', function (e, d) {
    d3.select('#tooltip').
    style('visibility', 'visible').
    style('left', e.pageX + 15 + 'px').
    style('top', e.pageY + 'px').
    attr('data-education', d3.select(this).attr('data-education')).
    text(function () {
      const eduDataForCounty = eduData.find(item => {
        return item.fips === d.id;
      });
      const text = eduDataForCounty.area_name + '\n' + eduDataForCounty.state + '\n' + eduDataForCounty.bachelorsOrHigher + '%';
      return text;
    });

  }).
  on('mouseout', function () {
    d3.select('#tooltip').
    style('visibility', 'hidden');
  });

  //using topojson.mesh to mark the state boundaries
  svg.append('path').
  datum(topojson.mesh(countyData, countyData.objects.states, function (a, b) {
    return a !== b;
  })).
  attr('class', 'states').
  attr('d', d3.geoPath());


  //code for legend
  const yLegendScale = d3.scaleBand().
  domain(legData).
  range([h / 8, h / 2]);

  const yLegAxis = d3.axisLeft(yLegendScale);
  const legendSvg = svg.append('g').
  attr('transform', 'translate(' + (w - 100) + ',' + 0 + ')').
  call(yLegAxis).
  attr('id', 'legend');


  legendSvg.append("g").
  selectAll('rect').
  data(legData).
  enter().
  append('rect').
  attr('x', '0').
  attr('y', l => yLegendScale(l)).
  attr('width', '10').
  attr('height', yLegendScale.bandwidth()).
  attr('fill', l => colorScale(l));


};


Promise.all([
d3.json('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'),
d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json")]).
then(data => {

  const countyData = data[0];
  const eduData = data[1];
  const countyTopojsonData = topojson.feature(countyData, countyData.objects.counties).features;
  drawMap(countyData, countyTopojsonData, eduData);


});