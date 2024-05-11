"use client";
import React, { useEffect, useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAppState } from '@/lib/providers/state-provider';
import { createAd, updateProfile } from '@/lib/supabase/queries';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Loader from '../globals/Loader';
import { Ad } from '@/lib/supabase/supabase.types';
import { v4 } from 'uuid';
import { toast } from '../ui/use-toast';

const localFormSchemaAd = z.object({
    title:z.string().min(2).max(100),
    image:z.any().nullable(),
    amount:z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    description:z.string().min(2).max(100),
    aiImageBackgroundGeneation: z.string()
})



const CreateAdForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const {profile,dispatch} = useAppState()
    const supabase = createClientComponentClient();

    // 1. Define your form.
    const form = useForm<z.infer<typeof localFormSchemaAd>>({
        resolver: zodResolver(localFormSchemaAd),
        defaultValues: {
            amount: "0",
            image: null,
            description:"",
            aiImageBackgroundGeneation:""
        },
    })
    const {isSubmitting} = form.formState
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof localFormSchemaAd>) {
        // if(!profile?.id) return;
        // // Do something with the form values.
        // // ✅ This will be type-safe and validated.
        // console.log(values)

        // if(values.username !== profile?.username && file){
        //     console.log("username changed and profpic changed")
        //     const {data,error} = await supabase.storage.from('prof_pics').upload(`${profile?.id}`,file as File,{upsert:true});
        //     if(data?.path){
        //         await updateProfile({username:values.username,avatar:data?.path},profile?.id)
        //         dispatch({
        //             type:"UPDATE_USER",
        //             payload:{
        //                 ...profile,
        //                 username:values.username,
        //                 avatar:data?.path
        //             }
        //         })

        //     }else{
        //         console.log("error at uploading the file: ",error)
        //     }
        // } else if(values.username !== profile?.username && !file){
        //     console.log("username changed")
        //     await updateProfile({username:values.username},profile?.id)
        //     dispatch({
        //         type:"UPDATE_USER",
        //         payload:{
        //             ...profile,
        //             username:values.username
        //         }
        //     })
        // }else if(values.username === profile?.username && file){
        //     console.log("profpic changed")
        //     const {data,error} = await supabase.storage.from('prof_pics').upload(`${profile?.id}`,file as File,{upsert:true});
        //     if(data?.path){
        //         await updateProfile({avatar:data?.path},profile?.id)
        //         dispatch({
        //             type:"UPDATE_USER",
        //             payload:{
        //                 ...profile,
        //                 avatar:data?.path
        //             }
        //         })
        //     }else{
        //         console.log("error at uploading the file: ",error)
        //     }
        // }else if(values.username === profile?.username && !file){
        //     console.log("nothing changed")
        // }else{
        //     console.log("something went wrong")
        // }
        if(!profile?.id) {
            console.log("profile not found")
            toast({description:"Profile not found",variant:"destructive", title:"Error"})
            return
        };
        //WIP update photo to supabase storage
        console.log("values: ",values)
        const newAd:Ad = {
            id:v4(),
            createdAt:new Date().toISOString(),
            profileId:profile?.id,
            amount:0.66,
            views:0,
            clicks:0,
            website:"",
            image:values.image ? values.image :"",
            description:values.description,
            payPerClick:0.01,
            payPerView:0.01,
            title:values.title
        }
        console.log("newAd: ",newAd)
        const {data:createAdData,error:createAdError} = await createAd(newAd)
        if(createAdError || !createAdData){
            console.log("error at creating ad: ",createAdError)
            toast({description:"Error at creating ad",variant:"destructive", title:"Error"})
            return
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        console.log("selectedFile: ",selectedFile)
        if (selectedFile) {
            setFile(selectedFile);
            // const {data,error} = await supabase.storage.from('prof_pics').upload(`${profile?.id}.png`,selectedFile as File,{upsert:true});
            //   const {} = await updateProfile({avatar:})
        }
    };

    // useEffect(()=>{
    //     console.log("file: ",file)
    // },[file])
    return (
        <div className='flex justify-center items-center w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your ad's title
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your ad's description (max 100 characters)
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the amount you need to pay for the ad
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Banner</FormLabel>
                            <FormControl>
                                {/* <Input placeholder="shadcn" {...field} /> */}
                                <Input id="picture" type="file" accept='image/png, image/jpeg' onChange={(e)=>{handleFileChange(e)}} disabled={field.disabled} onBlur={field.onBlur} name={field.name} value={field.value} ref={field.ref}/>
                            </FormControl>
                            <FormDescription>
                                This is your ad's Banner (not obligatory).
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="aiImageBackgroundGeneation"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>or create banner with ai</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field}/>
                            </FormControl>
                            <FormDescription>
                                This is your ad's Banner (max 300 characters)
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                        {
                            !isSubmitting && <Button type="submit" className="text-hotPink bg-black text-md hover:bg-accent">Create Ad</Button>
                        }
                        {
                            isSubmitting && <Loader/>
                        }
                </form>
            </Form>
        </div>
    )
}

export default CreateAdForm