import BreadcrumbNav from "@/src/components/BreadCrumNav";
import CustomAnalysisComponent from "@/src/components/CustomAnalysisComponent";
import CustomInput from "@/src/components/CustomInput";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const LoshuSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  mobileNumber: z.string().min(1, "The mobile number field is required."),
  emailAddress: z.string().min(1, "The email id field is required."),
  gender: z.string().min(1, "The gender field is required."),
  dob: z.string().min(1, "The date of birth field is required."),
});

const LoshuGridMastery: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const BreadCrum = [
    {
      label: "Numerology",
      to: "numerology",
    },
    {
      label: "Loshu Grid Mastery",
      to: "numerology/loshu-grid-mastery",
    },
  ];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof LoshuSchema>>({
    resolver: zodResolver(LoshuSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber: "",
      emailAddress: "",
      gender: "Male",
      dob: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoshuSchema>) => {
    console.log(data);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <section className="w-[80%] mx-auto">
      <BreadcrumbNav items={BreadCrum} />
      <CustomAnalysisComponent
        title="Loshu Grid Mastery"
        reportListHref="/numerology/loshu-grid-mastery/reports"
        footerButtons={[
          {
            label: `${isSubmitting ? "Submitting..." : "Save & Submit"}`,
            onClick: () => handleSubmit(onSubmit)(),
            variant: "primary",
            disabled: false,
          },
          {
            label: "Reset",
            onClick: handleReset,
            variant: "outline",
            disabled: false,
          },
        ]}
      >
        <form ref={formRef} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="First Name"
                  placeholder="Enter First Name"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="middleName"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Middle Name"
                  placeholder="Enter Middle Name"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Last Name"
                  placeholder="Enter Last Name"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="mobileNumber"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Mobile Number"
                  required
                  placeholder="Enter Mobile Number"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.mobileNumber?.message}
                />
              )}
            />

            <Controller
              name="emailAddress"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Email ID"
                  required
                  placeholder="Enter Email ID"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.emailAddress?.message}
                />
              )}
            />

            <Controller
              name="dob"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Date Of Birth"
                  variant="date"
                  placeholder="Enter Email ID"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Gender"
                  variant="gender"
                  placeholder="Enter Email ID"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </form>
      </CustomAnalysisComponent>
    </section>
  );
};

export default LoshuGridMastery;
