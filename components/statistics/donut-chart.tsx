"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { COMPETENCY_LEVELS } from "@/constants/competency-level";

interface DonutChartProps {
  data: {
    skillName: string;
    level: number;
    count: number;
    percentage: number;
    color: string;
  }[];
  onSegmentClick?: (skillName: string, level: number) => void;
  selectedSkill?: string | null;
  selectedLevel?: number | null;
}

export function DonutChart({
  data,
  onSegmentClick,
  selectedSkill,
  selectedLevel,
}: DonutChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const getCompetencyColor = useCallback((level: number) => {
    return (
      COMPETENCY_LEVELS.find((c) => c.grade === level)?.color || "bg-gray-400"
    );
  }, []);

  const drawChart = useCallback(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return;

    const width = dimensions.width;
    const height = dimensions.height;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6; // For donut effect

    d3.select(svgRef.current).selectAll("*").remove(); // Clear previous chart

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<{ skillName: string; level: number; count: number }>()
      .value((d) => d.count)
      .sort(null);

    const arc = d3
      .arc<
        d3.PieArcDatum<{ skillName: string; level: number; count: number }>
      >()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const arcs = svg
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => {
        const colorClass = getCompetencyColor(d.data.level);
        // Extract Tailwind color from class, e.g., "bg-skill-0" -> "var(--color-skill-0)"
        // This is a simplification; in a real app, you'd map directly to hex codes or use CSS variables
        const colorVar = `var(--${colorClass.replace("bg-", "color-")})`;
        return colorVar;
      })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("cursor", onSegmentClick ? "pointer" : "default")
      .classed("transition-all duration-200 ease-in-out", true)
      .classed("opacity-100", (d) => {
        if (selectedSkill === null && selectedLevel === null) return true;
        return (
          d.data.skillName === selectedSkill && d.data.level === selectedLevel
        );
      })
      .classed("opacity-40", (d) => {
        if (selectedSkill === null && selectedLevel === null) return false;
        return !(
          d.data.skillName === selectedSkill && d.data.level === selectedLevel
        );
      })
      .on("click", (event, d) => {
        onSegmentClick?.(d.data.skillName, d.data.level);
      })
      .append("title") // Tooltip
      .text(
        (d) =>
          `${d.data.skillName} (Level ${d.data.level}): ${d.data.count} employees`
      );

    // Add text labels for percentages
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("fill", (d) => {
        // Determine text color based on background for contrast
        const colorClass = getCompetencyColor(d.data.level);
        if (colorClass.includes("skill-2")) {
          // Yellow background, use dark text
          return "hsl(var(--foreground))"; // Tailwind's default dark text
        }
        return "white"; // For darker backgrounds, use white text
      })
      .style("font-size", "10px")
      .style("pointer-events", "none") // Make sure text doesn't interfere with click events on path
      .text((d) => {
        const percentage = (d.data.count / d3.sum(data, (d) => d.count)) * 100;
        return percentage > 5 ? `${percentage.toFixed(0)}%` : ""; // Only show if large enough
      });
  }, [
    data,
    dimensions,
    onSegmentClick,
    selectedSkill,
    selectedLevel,
    getCompetencyColor,
  ]);

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const { width, height } =
          svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions(); // Set initial dimensions
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      drawChart();
    }
  }, [drawChart, dimensions]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
}
