import StatisticsViewerWrapper from "@/components/auth/statistics-viewer-wrapper";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "AI Tools Statistics – Jakala Skill Matrix",
  description:
    "AI tools usage statistics dashboard for managing and visualizing AI tool adoption within Jakala.",
  generator: "Jakala Skill Matrix - AI Statistics",
};

export default function AIStatisticsLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <StatisticsViewerWrapper>{children}</StatisticsViewerWrapper>;
}
