const projectName ='Tree Map';
const margin = {top: 0, right: 0, bottom: 0, left: 0}
const h = 1000 - margin.top - margin.bottom;
const w = 1200 - margin.left - margin.right;
  
const toolTip = d3.select('#main')
                  .append('div')
                  .attr('id','tooltip');

let linkData,leafData;

//default TreeMap to movies on-load  
let linkURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"; 

d3.select('#title')
  .text('Movie Tree Map');

d3.select('#description')
  .text('Highest Grossing Movies');


let colorScale = d3.scaleOrdinal()
                .range(["steelblue","orange","lightgreen","crimson","pink","yellow","grey","green","navy","magenta","brown","purple","violet","indigo","gold","lightblue","cream","silver","maroon"]);
//.range(d3.schemeCategory10);

d3.select('#pledgeURL')
  .on('click', function(e){
    linkURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
    d3.selectAll('svg').remove();
  
    d3.select('#title')
      .text('Pledge Tree Map');

    d3.select('#description')
      .text('KickStarter Pledges');

    treeMap();
});

d3.select('#movieURL')
  .on('click', function(e){
    linkURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
    d3.selectAll('svg').remove();
    
    d3.select('#title')
      .text('Movie Tree Map');

    d3.select('#description')
      .text('Highest Grossing Movies');
   
    treeMap();
});

d3.select('#videoGamesURL')
  .on('click', function(e){
    linkURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";
    d3.selectAll('svg').remove();
  
    d3.select('#title')
      .text('Video Game Tree Map');

    d3.select('#description')
      .text('Highest Selling Video Games');
  
    treeMap();
});
      
      
function drawTreeMap() {
  
  const svg  = d3.select('body')
               .append('svg')
               .attr('height',(h + margin.top + margin.bottom))
               .attr('width', (w + margin.left + margin.right))
               .append('g')
               .attr('transform','translate('+ margin.left + ','+ margin.top + ')');
  
  let root  = d3.hierarchy(linkData)                                  //get the root element
                .sum((d) => d.hasOwnProperty('value') ? d.value : 0)  //setting the value properties incase it doesn't exist 
                .sort((a,b) => b.value - a.value);                    //sorting the nodes
  
  //Create a new treemap layout, set it's size
  d3.treemap()
    .size([(w + margin.left + margin.right),(h + margin.top + margin.bottom)])
    .padding(1)
    (root);  //pass it the root node
  
  let tiles = root.leaves();
 
  
  let block = svg.selectAll('g')
                 .data(tiles)
                 .enter()
                 .append('g')
                 .attr("transform",(tile) => "translate(" + tile.x0 + "," + tile.y0 + ")");
   
  block.append('rect')
       .attr('class','tile')
       .attr('width', (tile) => tile.x1 - tile.x0)
       .attr('height',(tile) => tile.y1 - tile.y0)
       .attr('fill', (tile) => colorScale(tile.data.category))
       .attr('data-name',(tile) => tile.data.name)
       .attr('data-category',(tile) => tile.data.category)
       .attr('data-value',(tile) => tile.data.value)
       .on("mouseover", function(e,d) {
          d3.select('#tooltip')
            .style('visibility','visible')
            .attr('data-value',d.value)
            .text(`Name: ${d.data.name}\nCategory: ${d.data.category}\nValue: ${d.value}`)
            .style('top',e.pageY + 5 + 'px')
            .style('left',e.pageX + 10 +'px');
       })
      .on("mouseout",function(e,d){
          d3.select('#tooltip')
            .style('visibility','hidden');
      });
  
  block.append('text')
       .selectAll('tspan')
       .data((tile) => tile.data.name.split(/(?=[A-Z][^A-Z])/g))
       .enter()
       .append('tspan')
       .text((d) => d)
       .attr('id','rect-text')
       .attr('font-size','8px')
       .attr('fill','black')
       .attr('x', 4)
       .attr('y', (d, i) => 13 + 10 * i);
  
  const legendSvg = d3.select('body')
                      .append('svg')  
                      .attr('height',1000)
                      .attr('width',300)
                      .append('g')
                      .attr('id','legend')
                      .attr('transform','translate(50,0)');
     
  legendSvg.selectAll('rect')
           .data(leafData)
           .enter()
           .append('rect')
           .attr('class','legend-item')
           .attr('x',50)
           .attr('y',(d,i) => i*50)
           .attr('width',50)
           .attr('height',50)
           .attr('fill',(d) => colorScale(d));
  
     legendSvg.selectAll('text')
           .data(leafData)
           .enter()
           .append('text')
           .text((d) => '- ' + d)
           .attr('x',110)
           .attr('y',(d,i) => i*50+25);
}

function treeMap(){
  
  d3.json(linkURL).then((data,error) => {
  
    if (error){
      console.log(error);
    }
    else{
    
      linkData = data;
      leafData = linkData.children.map((child) => child.name);
      colorScale.domain(leafData);
      drawTreeMap();
    
    }
  
  
  })
}

treeMap();