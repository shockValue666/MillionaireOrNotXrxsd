import React, { useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Rocket, Terminal } from 'lucide-react'
import { RocketIcon } from "@radix-ui/react-icons"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '../ui/card'
import { get5LatestAds } from '@/lib/supabase/queries'
import { toast } from '../ui/use-toast'
import { Ad } from '@/lib/supabase/supabase.types'




const AdBanner = () => {

  const [adArray, setAdArray] = React.useState<Ad[]>([])

  
  useEffect(() => {
    const getLatestAds = async () => {
      const {data,error} = await get5LatestAds();
      if(error || !data || data===null){
        console.error("error fetching latest ads",error)
        toast({title:"Error",description:"Error fetching latest ads",variant:"destructive"})
        return;
      }
      setAdArray(data)
      data?.forEach((ad:Ad) => {
        console.log("ad",ad)
      })
    }
    getLatestAds();
  },[]) //in order to run once i need to pass an empty array as the second argument


  return (
    <div className='flex items-center justify-center w-full mt-8 px-8'>
        <div className='inline-block border border-hotPink rounded-xl'>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {
                adArray.map((ad:Ad,index:number) => (
                  <CarouselItem key={index}>
                    <div className='p-1'>
                      <Alert>
                        {/* <h1 className='relative r-0'>{index}/5</h1> */}
                        <RocketIcon className="h-4 w-4" />
                        <AlertTitle>{ad.title}</AlertTitle>
                        <AlertDescription>
                            {ad.description}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CarouselItem>
                ))
              }
              {/* {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Alert>
                      <RocketIcon className="h-4 w-4" />
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                          You can add components to your app using the cli. {index}
                      </AlertDescription>
                  </Alert>
                  </div>
                </CarouselItem>
              ))} */}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
            {/* <Alert>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    You can add components to your app using the cli.
                </AlertDescription>
            </Alert> */}
        </div>
    </div>
  )
}

export default AdBanner