const width = 500;
const height = 300;
const margin = { top: 30, right: 30, bottom: 30, left: 40 };

const svg = d3
  .select("body")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

const render = (dataset) => {
  const xScale = d3
    .scaleBand()
    .domain(d3.range(dataset.data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset.data, (d) => d[1])])
    .range([height - margin.bottom, margin.top]);

  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(xScale.domain().filter((d, i) => !(i % 20)));

  const yAxis = d3.axisLeft(yScale);

  svg
    .selectAll("rect")
    .data(dataset.data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => yScale(0) - yScale(d[1]));

  // Bottom Axis Append
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  // Left Axis Append
  svg.append("g").attr("transform", `translate(${margin.left},0)`).call(yAxis);
};

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(url).then((dataset) => render(dataset));
