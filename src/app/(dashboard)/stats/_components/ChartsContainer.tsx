"use client";

import { getChartsDataAction } from "@/actions/statsActions";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const ChartsContainer = () => {
  const { data } = useQuery({
    queryKey: ["charts"],
    queryFn: getChartsDataAction,
  });

  if (!data || data.length < 1) {
    return notFound();
  }

  return (
    <section className="mt-16">
      <h1 className="text-4xl font-semibold text-center">
        Monthly Applications
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" barSize={75} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default ChartsContainer;
