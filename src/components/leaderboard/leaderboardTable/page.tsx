import React, { useState, useEffect } from 'react';
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ColumnDef } from '@tanstack/react-table';
import { useAppState } from '@/lib/providers/state-provider';
import { getSlotsForUser, getTotalPnlAndPointsForAllUsers, getTotalPnlAndPointsForUser, getUsersWithHighestPoints } from '@/lib/supabase/queries';
import { EmojiSlot } from '@/lib/supabase/supabase.types';

import Loader from '@/components/globals/Loader';

interface LeaderBoardMatrixDataTypes {
    points?:number,
    pnl?:number,
    username?:string
}

function formatUserFriendlyDate(timestamp:string | null) {
    if (!timestamp) {console.log("no timestamp");return 'error or something'};
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
}

function LeaderBoardMatrix() {
  const [data, setData] = useState<Partial<LeaderBoardMatrixDataTypes>[]>([]);
  const {profile} = useAppState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchGames = async () => {
        // Fetch games from the server
        // if(!profile){
        //     console.log("No profile found in the game table");
        //     return;
        // }
        // const {data,error} = await getSlotsForUser(profile?.id); 
        // if(error || !data){
        //     console.log("Error at fetching games: ",error);
        //     return;
        // }
        // console.log("data[0].pnl * -1: ",data[0].pnl*-1)
        // const manipulatedData = data.map(slot => ({
        //     ...slot,
        //     // createdAt: formatUserFriendlyDate(slot.createdAt), // Convert createdAt to a user-friendly date string
        //     points:slot.points,
        //     username:profile.username,
        //     pnl: slot.pnl * -1 // Invert the sign of pnl
        // }));

        // setData(manipulatedData)
        // setLoading(false)

        // const {data:totalPnlAndPointsData, error:totalPnlAndPointsError} = await getTotalPnlAndPointsForUser(profile?.id);
        // if(totalPnlAndPointsError || !totalPnlAndPointsData){
        //     console.log("Error at fetching total pnl and points: ",totalPnlAndPointsError);
        //     return;
        // }
        // console.log("totalPnlAndPointsData: ",totalPnlAndPointsData.totalPnl, " ",totalPnlAndPointsData.totalPoints)
        // const manipulatedDataNew = {
        //     points:totalPnlAndPointsData.totalPoints,
        //     pnl:totalPnlAndPointsData.totalPnl*-1,
        //     username:profile.username
        // } 
        // setData([manipulatedDataNew])
        // setLoading(false)

        const {data:totalPnlAndPointsForAllUsersData, error: totalPnlAndPointsForAllUsersError} = await getUsersWithHighestPoints()
        if(totalPnlAndPointsForAllUsersError || !totalPnlAndPointsForAllUsersData){
            console.log("Error at fetching total pnl and points for all users: ",totalPnlAndPointsForAllUsersError)
            return;
        }
        const manipulatedDataNewer = totalPnlAndPointsForAllUsersData.map((user) => ({
            points:user.points,
            pnl:user.pnl*-1,
            username:user.username
        })) 
        setData(manipulatedDataNewer)
        setLoading(false)
        // console.log("totalPnlAndPointsForAllUsersData: ",totalPnlAndPointsForAllUsersData)

    }
    fetchGames();
  }, []); // Empty dependency array means this runs once on mount

return (
    <div className="container mx-auto py-10">
        <DataTable loading={loading} columns={columns as ColumnDef<Partial<EmojiSlot>, unknown>[]} data={data} />
    </div>
);
}

export default LeaderBoardMatrix;
