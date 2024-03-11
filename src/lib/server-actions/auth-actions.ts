"use server";
import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import { cookies } from "next/headers";
import {v4} from 'uuid'

export async function actionLogCock(){
    console.log("cockies: ",cookies().getAll())
}


export async function actionLoginUser({email,password}:{email:string,password:string}){

    const supabase = createRouteHandlerClient({cookies})
    // console.log("cockies: ",cookies)
    //how long does the cookie last?
    
    //response returns AuthTokenResponse, it's a JSON object that contains
    //an access token, token type, expiration time, and refresh token. It is 
    //returned by supabase when a user successfully logs in or signs up. The 
    //access token is a JSON web token (JWT) that authorizes a client
    const response = await supabase.auth.signInWithPassword({
        email,
        password
    })


    console.log("response: ", response)
    return response;

}

export async function actionSignUpUser({email,password}:{email:string,password:string}){
    const supabase = createRouteHandlerClient({cookies})
    // const {data} = await supabase.from("profiles").select("*").eq("email",email);
    const {data} = await supabase.from("users").select("*").eq("email",email);
    console.log("data from profiles obviously doesn't exist so i gotta use users: ",data)
    if(data?.length){
        return {
            error: {
                message: "User already exists",
                data
            }
        }
    }
    const response = await supabase.auth.signUp({
        email,
        password,
        options:{
            emailRedirectTo:`${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`
        }
    })
    return response;
}


