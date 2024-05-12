import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const LocalStats = () => {
  return (
    <div className='border border-red-500 rounded-md w-[50%]'>
        <Card className='border border-yellow-500' x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <div className=''>
                <CardContent className="grid gap-8 w-full border border-green-500">
                    <div className="flex items-center gap-4 border border-yellow-500 w-[50%]">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="" alt="Avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1 border border-white">
                        <p className="text-sm font-medium leading-none">
                            Olivia Martin
                        </p>
                        <p className="text-sm text-muted-foreground">
                            olivia.martin@email.com
                        </p>
                        </div>
                        <div className="ml-auto font-medium">+$1,999.00</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="" alt="Avatar" />
                        <AvatarFallback>JL</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            Jackson Lee
                        </p>
                        <p className="text-sm text-muted-foreground">
                            jackson.lee@email.com
                        </p>
                        </div>
                        <div className="ml-auto font-medium">+$39.00</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="" alt="Avatar" />
                        <AvatarFallback>IN</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            Isabella Nguyen
                        </p>
                        <p className="text-sm text-muted-foreground">
                            isabella.nguyen@email.com
                        </p>
                        </div>
                        <div className="ml-auto font-medium">+$299.00</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="" alt="Avatar" />
                        <AvatarFallback>WK</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            William Kim
                        </p>
                        <p className="text-sm text-muted-foreground">
                            will@email.com
                        </p>
                        </div>
                        <div className="ml-auto font-medium">+$99.00</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="" alt="Avatar" />
                        <AvatarFallback>SD</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                            Sofia Davis
                        </p>
                        <p className="text-sm text-muted-foreground">
                            sofia.davis@email.com
                        </p>
                        </div>
                        <div className="ml-auto font-medium">+$39.00</div>
                    </div>
                    </CardContent>
            </div>
          </Card>
    </div>
  )
}

export default LocalStats