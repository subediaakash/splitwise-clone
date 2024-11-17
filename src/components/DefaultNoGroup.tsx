import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function DefaultNoGroup() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Card className="w-full max-w-2xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-blue-100 p-3 w-16 h-16 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold mb-2">
            No Active Group Expenses
          </CardTitle>
          <CardDescription className="text-xl text-slate-600">
            You're all caught up! No pending payments at the moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-lg">
            Join a group to collaborate with others and manage shared expenses
            efficiently.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            onClick={() => router.push("/create")}
            className="font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Explore Groups
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
