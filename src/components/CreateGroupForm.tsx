"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

const signupFormSchema = z.object({
  totalPrice: z.string().transform((val) => Number(val)),
  description: z.string(),
  members: z.array(z.number()),
});

export default function CreateGroupForm({ users, creatorId }: any) {
  const router = useRouter();

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      totalPrice: 0,
      description: "",
      members: [],
    },
  });

  async function onSubmit(values: z.infer<typeof signupFormSchema>) {
    const apiBody = {
      creatorId: creatorId,
      totalPrice: Number(values.totalPrice),
      memberIds: values.members,
      description: values.description,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiBody),
      }
    );

    console.log("Form submitted with values:", apiBody);
    router.push("/dashboard");
  }

  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

  return (
    <>
      <main className="flex justify-center   ">
        <div className="p-9 sm:w-[90vw] lg:w-[40vw] bg-white border-2 shadow-2xl shadow-[#abbede] border-gray-200 mt-9 lg:mt-32  flex flex-col gap-2 justify-center items-center">
          <div>
            <p className="font-extrabold text-xl text-red-700">CREATE GROUP</p>
          </div>
          <div className="sm:w-[90vw] lg:w-[28vw]">
            <p className="flex  text-gray-500 p-2">
              Where did you spend hmm ?{" "}
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 max-w-lg w-full"
            >
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Total Bill
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter total bill amount"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="What is this bill for?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="members"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Select Group Members
                    </FormLabel>
                    <FormControl>
                      <Controller
                        name="members"
                        control={form.control}
                        render={({ field }) => (
                          <>
                            {users.map((user: any) => (
                              <FormItem
                                key={user.id}
                                className="flex items-center space-x-3"
                              >
                                <Checkbox
                                  checked={field.value.includes(user.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([
                                        ...field.value,
                                        parseInt(user.id),
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (id: number) => id !== user.id
                                        )
                                      );
                                    }
                                  }}
                                />
                                <FormLabel>
                                  {capitalizeFirstLetter(user.name)}
                                </FormLabel>{" "}
                              </FormItem>
                            ))}
                          </>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="font-semibold shadow-xl">
                SUBMIT
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
}
