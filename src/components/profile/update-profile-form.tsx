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
import { updateProfile } from '@/lib/supabase/queries';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Loader from '../globals/Loader';

const localFormSchema = z.object({
  username: z.string().min(2).max(50),
  profpic:z.any()
})



const UpdateProfileForm = () => {
    const [file, setFile] = useState<File | null>(null);
    const {profile,dispatch} = useAppState()
    const supabase = createClientComponentClient();

    // 1. Define your form.
    const form = useForm<z.infer<typeof localFormSchema>>({
        resolver: zodResolver(localFormSchema),
        defaultValues: {
            username: profile?.username,
            profpic: null
        },
    })
    const {isSubmitting} = form.formState
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof localFormSchema>) {
        if(!profile?.id) return;
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)

        if(values.username !== profile?.username && file){
            console.log("username changed and profpic changed")
            const {data,error} = await supabase.storage.from('prof_pics').upload(`${profile?.id}`,file as File,{upsert:true});
            if(data?.path){
                await updateProfile({username:values.username,avatar:data?.path},profile?.id)
                dispatch({
                    type:"UPDATE_USER",
                    payload:{
                        ...profile,
                        username:values.username,
                        avatar:data?.path
                    }
                })

            }else{
                console.log("error at uploading the file: ",error)
            }
        } else if(values.username !== profile?.username && !file){
            console.log("username changed")
            await updateProfile({username:values.username},profile?.id)
            dispatch({
                type:"UPDATE_USER",
                payload:{
                    ...profile,
                    username:values.username
                }
            })
        }else if(values.username === profile?.username && file){
            console.log("profpic changed")
            const {data,error} = await supabase.storage.from('prof_pics').upload(`${profile?.id}`,file as File,{upsert:true});
            if(data?.path){
                await updateProfile({avatar:data?.path},profile?.id)
                dispatch({
                    type:"UPDATE_USER",
                    payload:{
                        ...profile,
                        avatar:data?.path
                    }
                })
            }else{
                console.log("error at uploading the file: ",error)
            }
        }else if(values.username === profile?.username && !file){
            console.log("nothing changed")
        }else{
            console.log("something went wrong")
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
        <div className='flex justify-centeritems-center w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="profpic"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Profile Picture</FormLabel>
                            <FormControl>
                                {/* <Input placeholder="shadcn" {...field} /> */}
                                <Input id="picture" type="file" accept='image/png, image/jpeg' onChange={(e)=>{handleFileChange(e)}} disabled={field.disabled} onBlur={field.onBlur} name={field.name} value={field.value} ref={field.ref}/>
                            </FormControl>
                            <FormDescription>
                                This is your profile picture.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                        {
                            !isSubmitting && <Button type="submit" className="text-hotPink bg-black text-md hover:bg-accent">Save Changes</Button>
                        }
                        {
                            isSubmitting && <Loader/>
                        }
                        <Button className="text-hotPink bg-black text-md hover:bg-accent" onClick={() => {}}>
                            close
                        </Button>
                </form>
            </Form>
        </div>
    )
}

export default UpdateProfileForm