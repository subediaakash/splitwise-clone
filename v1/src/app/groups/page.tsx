import GroupsList from "@/components/groups/groups-list";
import CreateGroups from "@/components/groups/create-groups";

export default function GroupsPage(){
    return(
    <div>
        <div className="mx-auto w-1/2 p-2">
            <CreateGroups/>
        </div>
        <div className="w-1/2 mx-auto py-2">
            <GroupsList/>    
        </div>
     </div>
    
    )
}