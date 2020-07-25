const width = 600;
const height = 300;
const margin = { top: 30, right: 10, bottom: 30, left: 20 };

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

const tooltip = d3
  .select("#chart")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

const render = (dataset) => {
  const xValue = (d) => d[0];

  const yValue = (d) => d[1];
  const yAxisLabel = "Gross Domestic Product";

  const bandwidth = width / dataset.data.length;

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset.data, xValue))
    .range([margin.left, width - margin.right - bandwidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset.data, yValue)])
    .range([height - margin.bottom, margin.top]);

  // Axis setup
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")).ticks(5);

  const yAxis = d3
    .axisRight(yScale)
    .tickSize(width - margin.right - margin.left);

  const customXAxis = (g) => {
    g.call(xAxis);
    g.select(".domain").remove();
  };

  const customYAxis = (g) => {
    g.call(yAxis);
    g.select(".domain").remove();
    g.selectAll(".tick:not(:first-of-type) line")
      .attr("stroke", "#777")
      .attr("stroke-dasharray", "2,2");
    g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
  };

  // Time format
  const formatTime = d3.timeFormat("%Y-%m-%d");
  const formatTimeTooltip = d3.timeFormat("%b, %Y");

  const colorScale = d3
    .scaleSequential()
    .domain([0, d3.max(dataset.data, yValue)])
    .interpolator(d3.interpolateCool);

  // Bottom Axis append
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(customXAxis);

  // Left Axis append
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(customYAxis);

  // Left Axis label append
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr(
      "transform",
      `translate(${margin.left - 10}, ${height / 2})rotate(-90)`
    )
    .text(yAxisLabel)
    .attr("fill", "white");

  // Rect (bar) elements append
  svg
    .selectAll("rect")
    .data(dataset.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => formatTime(d[0]))
    .attr("data-gdp", yValue)
    .attr("x", (d) => xScale(xValue(d)))
    .attr("y", (d) => yScale(yValue(d)))
    .attr("width", bandwidth)
    .attr("height", (d) => yScale(0) - yScale(yValue(d)))
    .attr("fill", (d) => colorScale(d[1]))
    .on("mouseover", (d) => {
      let date = formatTimeTooltip(d[0]);

      tooltip.transition().duration(200).style("opacity", 0.9);

      tooltip
        .html(`${date}<br />$${yValue(d)} billion`)
        .attr("data-date", formatTime(d[0]))
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY + 20 + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });
};

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(url).then((dataset) => {
  dataset.data.forEach((d) => {
    d[0] = new Date(d[0] + "T00:00");
  });
  render(dataset);
});
