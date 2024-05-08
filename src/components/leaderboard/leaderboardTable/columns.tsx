"use client"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { EmojiSlot } from "@/lib/supabase/supabase.types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  avatar:string
  username: string
  points: number
//   status: "pending" | "processing" | "success" | "failed"
  pnl: number,
//   createdAt:string
}

export const columns: ColumnDef<EmojiSlot>[] = [
  {
    accessorKey:"avatar",
    header: "avatar",
    cell: ({ row }) => {
      const avatar = row.getValue("avatar")
 
      return (
      <div className="">
        <Avatar className="">
          <AvatarImage src={`https://ytrtdcbrzjpyjpjqmhub.supabase.co/storage/v1/object/public/prof_pics/${avatar}`} alt="Avatar" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
      </div>
      )
    },
  },
  {
    accessorKey: "username",
    header: "username",
  },
//   {
//     accessorKey: "createdAt",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         >
//           Date
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       )
//     },
//   },
  {
    accessorKey: "points",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Points
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="ml-[3%] font-medium">{row.getValue("points")}</div>
    },
  },
  {
    accessorKey: "pnl",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PnL
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const pnl = parseFloat(row.getValue("pnl"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(pnl)
 
      return <div className="ml-[3%] font-medium">{formatted}</div>
    },

  },
]
