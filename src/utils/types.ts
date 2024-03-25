import { z } from "zod";

export enum JobStatus {
  PENDING = "pending",
  INTERVIEW = "interview",
  DECLINED = "declined",
}

export enum JobMode {
  FULL_TIME = "full-time",
  PART_TIME = "part-time",
  INTERN = "intern",
}

export type JobType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  position: string;
  company: string;
  location: string;
  status: JobStatus;
  mode: JobMode;
};

export type CreateAndEditJobType = z.infer<typeof createAndEditJobSchema>;

export const createAndEditJobSchema = z.object({
  position: z.string().min(2, {
    message: "position must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "company must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "location must be at least 2 characters.",
  }),
  status: z.nativeEnum(JobStatus),
  mode: z.nativeEnum(JobMode),
});
