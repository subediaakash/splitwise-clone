import GroupsList from "@/components/groups/groups-list";
import { Card, CardContent } from "@/components/ui/card";

export default function SortByComponent(){
    return (
        <Card className="glass border rounded-2xl w-1/2">
            <CardContent className="p-5">
                <GroupsList variant="list" title="Groups that you are in :" />
            </CardContent>
        </Card>
    )
}
