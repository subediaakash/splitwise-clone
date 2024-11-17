"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const signupFormSchema = z.object({
  totalPrice: z.string().transform((val) => Number(val)),
  description: z.string().min(1, "Description is required"),
  members: z.array(z.number()).min(1, "Select at least one member"),
});

type FormValues = z.infer<typeof signupFormSchema>;

export default function CreateGroupForm({
  users,
  creatorId,
}: {
  users: any[];
  creatorId: number;
}) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      totalPrice: 0,
      description: "",
      members: [],
    },
  });

  async function onSubmit(values: FormValues) {
    const apiBody = {
      creatorId: creatorId,
      totalPrice: values.totalPrice,
      memberIds: values.members,
      description: values.description,
    };

    try {
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

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      console.log("Form submitted successfully:", apiBody);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show error message to user)
    }
  }

  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Create Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Bill</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter total bill amount"
                        type="number"
                        {...field}
                        className="focus:ring-primary"
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is this bill for?"
                        {...field}
                        className="focus:ring-primary"
                      />
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
                    <FormLabel>Select Group Members</FormLabel>
                    <div className="space-y-2">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`user-${user.id}`}
                            checked={form.watch("members").includes(user.id)}
                            onCheckedChange={(checked) => {
                              const currentMembers = form.getValues("members");
                              if (checked) {
                                form.setValue("members", [
                                  ...currentMembers,
                                  user.id,
                                ]);
                              } else {
                                form.setValue(
                                  "members",
                                  currentMembers.filter((id) => id !== user.id)
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`user-${user.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {capitalizeFirstLetter(user.name)}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Group
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
