import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreemapNode extends d3.HierarchyRectangularNode<TreemapData> {}

interface TreemapData {
  name: string;
  value: number;
  children?: TreemapData[];
  category?: string;
}

interface TreemapChartProps {
  data: TreemapData;
  width?: number;
  height?: number;
  colorScheme?: string[];
}

const TreemapChart: React.FC<TreemapChartProps> = ({
  data,
  width = 600,
  height = 400,
  colorScheme = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create hierarchical data structure
    const root = d3.hierarchy(data)
      .sum((d: TreemapData) => d.value)
      .sort((a, b) => ((b.data as TreemapData).value || 0) - ((a.data as TreemapData).value || 0));

    // Create treemap layout
    const treemap = d3.treemap<TreemapData>()
      .size([width, height])
      .padding(2)
      .round(true);

    treemap(root);

    // Color scale
    const color = d3.scaleOrdinal(colorScheme);

    // Create tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "treemap-tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", "1000");

    // Create rectangles
    const leaf = svg.selectAll("g")
      .data(root.leaves() as TreemapNode[])
      .enter().append("g")
      .attr("transform", (d: TreemapNode) => `translate(${d.x0},${d.y0})`);

    leaf.append("rect")
      .attr("fill", (d: TreemapNode) => color(d.data.category || d.data.name))
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1)
      .attr("width", (d: TreemapNode) => d.x1 - d.x0)
      .attr("height", (d: TreemapNode) => d.y1 - d.y0)
      .attr("rx", 4)
      .style("cursor", "pointer")
      .on("mouseover", function(event: MouseEvent, d: TreemapNode) {
        d3.select(this as SVGRectElement).attr("opacity", 0.8);
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`
          <strong>${d.data.name}</strong><br/>
          Value: ${d.data.value.toLocaleString()}<br/>
          ${d.data.category ? `Category: ${d.data.category}` : ''}
        `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this as SVGRectElement).attr("opacity", 1);
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .on("mousemove", function(event: MouseEvent) {
        tooltip.style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      });

    // Add text labels
    leaf.append("text")
      .attr("x", 4)
      .attr("y", 14)
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "white")
      .style("pointer-events", "none")
      .text((d: TreemapNode) => {
        const rectWidth = d.x1 - d.x0;
        const rectHeight = d.y1 - d.y0;
        if (rectWidth < 60 || rectHeight < 30) return '';
        return d.data.name.length > 15 ? d.data.name.substring(0, 12) + '...' : d.data.name;
      });

    // Add value labels
    leaf.append("text")
      .attr("x", 4)
      .attr("y", 28)
      .style("font-size", "10px")
      .style("fill", "rgba(255, 255, 255, 0.8)")
      .style("pointer-events", "none")
      .text((d: TreemapNode) => {
        const rectWidth = d.x1 - d.x0;
        const rectHeight = d.y1 - d.y0;
        if (rectWidth < 60 || rectHeight < 30) return '';
        return d.data.value.toLocaleString();
      });

    // Cleanup tooltip on unmount
    return () => {
      d3.selectAll(".treemap-tooltip").remove();
    };
  }, [data, width, height, colorScheme]);

  return (
    <div className="treemap-chart-container">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="treemap-chart"
      />
    </div>
  );
};

export default TreemapChart;