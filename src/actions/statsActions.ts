"use server";

import { authenticateAndRedirect } from "@/utils/authenticateAndRedirect";
import prisma from "@/utils/db";
import dayjs from "dayjs";
import { redirect } from "next/navigation";

export const getStatsAction = async (): Promise<{
  pending: number;
  interview: number;
  declined: number;
}> => {
  const userId = authenticateAndRedirect();
  try {
    const stats = await prisma.job.groupBy({
      by: ["status"],
      _count: { status: true },
      where: {
        clerkId: userId,
      },
    });
    console.log("stats", stats);

    const statsObject = stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);
    console.log("statsObject", statsObject);

    const defaultStats = {
      pending: 0,
      declined: 0,
      interview: 0,
      ...statsObject,
    };
    console.log("defaultStats", defaultStats);

    return defaultStats;
  } catch (error) {
    redirect("/jobs");
  }
};

export const getChartsDataAction = async (): Promise<
  Array<{ date: string; count: number }>
> => {
  const userId = authenticateAndRedirect();
  const sixMonthsAgo = dayjs().subtract(6, "months").toDate();
  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const applicationPerMonth = jobs.reduce((acc, job) => {
      const date = dayjs(job.createdAt).format("MMM YY");
      const existingEntry = acc.find((entry) => entry.date === date);
      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, [] as Array<{ date: string; count: number }>);

    return applicationPerMonth;
  } catch (e) {
    redirect("/jobs");
  }
};
