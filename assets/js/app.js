// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read CSV
  d3.csv("./data/data.csv", function(err, censusData) {


    censusData.forEach(function(data) {
      data.income = +data.income;
      data.healthcare = +data.healthcare;
    });

    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(censusData, d => d.income))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.healthcare)])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

    // append circles
    chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.income))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "18")
      .attr("fill", "lightblue")
      .attr("stroke-width", "1")
      .attr("stroke", "black");

    chartGroup.selectAll("text")
      .data(censusData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.income))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr("dx", "-0.65em")
      .attr("dy", "0.4em")
      .style("font-size", "13px")
      .text( d => d.abbr);

    // Append y-axis label
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup
        .append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("class", "axisText")
        .text("Income");

  })


}