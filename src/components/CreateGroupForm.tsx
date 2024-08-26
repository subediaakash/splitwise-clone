'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

const signupFormSchema = z.object({
    totalPrice: z.string().transform((val) => Number(val)),
    description: z.string(),
    members: z.array(z.number())
});

export default function CreateGroupForm({ users, creatorId }: any) {

    const router = useRouter()

    const form = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            totalPrice: 0,
            description: '',
            members: [],
        },
    });

    async function onSubmit(values: z.infer<typeof signupFormSchema>) {
        const apiBody = {
            creatorId: creatorId, // This comes from props
            totalPrice: Number(values.totalPrice),
            memberIds: values.members,
            description: values.description
            // This is already an array of numbers
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiBody),
        });

        console.log("Form submitted with values:", apiBody);
        router.push("/dashboard")
    }
    return (
        <>
            <main className='flex justify-center'>
                <div className='p-9 w-[40vw] border border-black'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-8 max-w-lg w-full'
                        >
                            {/* Total Bill Amount Field */}
                            <FormField
                                control={form.control}
                                name='totalPrice'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Bill</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter total bill amount'
                                                type='number'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='What is this bill for?'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='members'
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Select Group Members</FormLabel>
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
                                                                            field.onChange([...field.value, parseInt(user.id)]);
                                                                        } else {
                                                                            field.onChange(field.value.filter((id: number) => id !== user.id));
                                                                        }
                                                                    }}
                                                                />
                                                                <FormLabel>{user.name}</FormLabel>
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

                            <Button type='submit'>Submit</Button>
                        </form>
                    </Form>
                </div>
            </main>
        </>
    );
}
