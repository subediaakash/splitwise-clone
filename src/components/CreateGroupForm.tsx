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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

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
    }
  }

  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white space-y-2 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">
            Create New Group
          </CardTitle>
          <CardDescription className="text-blue-100 text-center">
            Split bills easily with your group members
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <FormField
                  control={form.control}
                  name="totalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700 font-semibold">
                        Total Bill
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter total bill amount"
                          type="number"
                          {...field}
                          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-700 font-semibold">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is this bill for?"
                          {...field}
                          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="bg-gray-200" />

              <FormField
                control={form.control}
                name="members"
                render={() => (
                  <FormItem className="bg-white p-4 rounded-lg">
                    <FormLabel className="text-blue-700 font-semibold block mb-3">
                      Select Group Members
                    </FormLabel>
                    <div className="grid gap-3">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
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
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <label
                              htmlFor={`user-${user.id}`}
                              className="text-sm font-medium text-gray-700"
                            >
                              {capitalizeFirstLetter(user.name)}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage className="text-red-500 mt-2" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5"
              >
                Create Group
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
