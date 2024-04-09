import React, { useState, useEffect } from 'react';
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ColumnDef } from '@tanstack/react-table';
import { useAppState } from '@/lib/providers/state-provider';
import { getSlotsForUser } from '@/lib/supabase/queries';
import { EmojiSlot } from '@/lib/supabase/supabase.types';

import Loader from '@/components/globals/Loader';

function formatUserFriendlyDate(timestamp:string | null) {
    if (!timestamp) {console.log("no timestamp");return 'error or something'};
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
}

function DemoPage() {
  const [data, setData] = useState<Partial<EmojiSlot>[]>([]);
  const {profile} = useAppState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchGames = async () => {
        // Fetch games from the server
        if(!profile){
            console.log("No profile found in the game table");
            return;
        }
        const {data,error} = await getSlotsForUser(profile?.id); 
        if(error || !data){
            console.log("Error at fetching games: ",error);
            return;
        }
        const manipulatedData = data.map(slot => ({
            ...slot,
            createdAt: formatUserFriendlyDate(slot.createdAt), // Convert createdAt to a user-friendly date string
            pnl: slot.pnl * -1 // Invert the sign of pnl
        }));

        setData(manipulatedData)
        setLoading(false)

    }
    fetchGames();
  }, [profile]); // Empty dependency array means this runs once on mount

return (
    <div className="container mx-auto py-10">
        <DataTable loading={loading} columns={columns as ColumnDef<Partial<EmojiSlot>, unknown>[]} data={data} />
    </div>
);
}

export default DemoPage;
