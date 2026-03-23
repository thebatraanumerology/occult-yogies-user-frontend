import React, { useRef } from "react";
import CustomInput from "../../components/CustomInput";
import BreadcrumbNav from "@/src/components/BreadCrumNav";
import CustomAnalysisComponent from "@/src/components/CustomAnalysisComponent";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const vastuPowerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  gender: z.string().min(1, "Gender is required"),
  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  address: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  dateOfPurchase: z.string().optional(),
  map: z.string().optional(),
});


const VastuAnalysisIndex: React.FC = () => {

   const { control, handleSubmit, reset, formState: { errors },} = useForm<z.infer<typeof vastuPowerSchema>>({
    resolver: zodResolver(vastuPowerSchema),  
    defaultValues: {
      fullName: "",
      gender: "Male",
      mobileNumber: "",
      address: "",
      category: "",
      dateOfPurchase: "",
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const categories = [
                    { label: "Residential", value: "residential" },
                    { label: "Commercial", value: "commercial" },
                  ];
 
  const onSubmit = (data: z.infer<typeof vastuPowerSchema>) => {
    console.log("Submitted:", data);
    
  };

  const handleReset = () => {
    reset();
  };

  return (
    <section className="w-[80%] mx-auto">
      <BreadcrumbNav items={[{ label: "Vastu Analysis" }]} />
      <CustomAnalysisComponent
        title="Vastu Energy Analysis"
        reportListHref="/list/energy-vastu"
        footerButtons={[
          { label: "Reset", onClick: handleReset, variant: "outline" },
          { label: "Save & Submit", onClick: () => handleSubmit(onSubmit)(), variant: "primary" },
        ]}
      >
         <form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Full Name"
                  required
                  placeholder="Enter full name"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.fullName?.message}
                />
              )}
            />
 
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Gender"
                  required
                  variant="gender"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.gender?.message}
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
                  placeholder="Enter mobile number"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.mobileNumber?.message}
                />
              )}
            />
 
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Address"
                  placeholder="Enter property address"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
 
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Category"
                  required
                  variant="select"
                  placeholder="Select Category"
                  options={categories}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.category?.message}
                />
              )}
            />
 
            <Controller
              name="dateOfPurchase"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Date of Purchase"
                  variant="date"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="map"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Upload Map"
                  variant="file"
                  required
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

export default VastuAnalysisIndex;
