"use client";
import { createJobAction } from "@/actions/jobActions";
import { createAndEditJobSchema, JobMode, JobStatus } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CustomFormField, CustomFormSelect } from "./FormComponents";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { useToast } from "./ui/use-toast";

const CreateJobForm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof createAndEditJobSchema>) =>
      createJobAction(values),
    onSuccess: (data) => {
      if (!data) {
        toast({
          description: "there was an error",
        });
        return;
      }
      toast({ description: "job created" });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["charts"] });

      router.push("/jobs");
      // form.reset();
    },
  });

  const form = useForm<z.infer<typeof createAndEditJobSchema>>({
    resolver: zodResolver(createAndEditJobSchema),
    defaultValues: {
      position: "",
      company: "",
      location: "",
      status: JobStatus.PENDING,
      mode: JobMode.FULL_TIME,
    },
  });

  const onSubmit = (data: z.infer<typeof createAndEditJobSchema>) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomFormField name="position" control={form.control} />
        <CustomFormField name="company" control={form.control} />
        <CustomFormField name="location" control={form.control} />
        <CustomFormSelect
          name="status"
          control={form.control}
          labelText="job status"
          items={Object.values(JobStatus)}
        />
        <CustomFormSelect
          name="mode"
          control={form.control}
          labelText="job mode"
          items={Object.values(JobMode)}
        />
        <Button
          type="submit"
          className="self-end capitalize"
          disabled={isPending}
        >
          {isPending ? "loading..." : "create job"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateJobForm;
