import { getSingleJobAction } from "@/actions/jobActions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import EditJobForm from "./EditJobForm";
import CreateJobForm from "@/components/CreateJobForm";

const JobDetailPage = async ({ params }: { params: { jobId: string } }) => {
  const { jobId } = params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["job", jobId],
    queryFn: () => getSingleJobAction(jobId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditJobForm jobId={jobId} />
    </HydrationBoundary>
  );
};

export default JobDetailPage;
