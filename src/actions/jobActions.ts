"use server";

import { authenticateAndRedirect } from "@/utils/authenticateAndRedirect";
import prisma from "@/utils/db";
import {
  createAndEditJobSchema,
  CreateAndEditJobType,
  JobType,
} from "@/utils/types";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

type GetAllJobsActionTypes = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};

export async function createJobAction(jobInfo: CreateAndEditJobType) {
  const userId = authenticateAndRedirect();
  try {
    createAndEditJobSchema.parse(jobInfo);
    const job = await prisma.job.create({
      data: {
        ...jobInfo,
        clerkId: userId,
      },
    });
    return job;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteJobAction(jobId: string) {
  const userId = authenticateAndRedirect();
  try {
    const job = await prisma.job.delete({
      where: {
        id: jobId,
        clerkId: userId,
      },
    });
    return job;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getSingleJobAction(id: string): Promise<JobType | null> {
  let job: JobType | null = null;
  const userId = authenticateAndRedirect();
  try {
    job = (await prisma.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    })) as JobType;
  } catch (error) {
    job = null;
  }
  if (!job) {
    redirect("/jobs");
  }
  return job;
}

export async function updateJobAction(
  id: string,
  values: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = authenticateAndRedirect();

  try {
    const job: JobType = (await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    })) as JobType;
    return job;
  } catch (error) {
    return null;
  }
}

export async function getAllJobsAction({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}: GetAllJobsActionTypes): Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> {
  const userId = authenticateAndRedirect();

  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId,
    };
    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            position: {
              contains: search,
            },
          },
          {
            company: {
              contains: search,
            },
          },
        ],
      };
    }
    if (jobStatus && jobStatus !== "all") {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      };
    }

    const skip = (page - 1) * limit;

    const jobs: JobType[] = (await prisma.job.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })) as JobType[];

    const count: number = await prisma.job.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(count / limit);

    return { jobs, count, page, totalPages };
  } catch (error) {
    console.error(error);
    return { jobs: [], count: 0, page: 1, totalPages: 0 };
  }
}
