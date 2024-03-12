"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { actionLoginUser, actionSignUpUser } from "@/lib/server-actions/auth-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "../ui/use-toast";

export function SignupLogin() {
    const [email,setEmail] = useState<string | null>(null)
    const [password,setPassword] = useState<string | null>(null)

    const [newEmail,setNewEmail] = useState<string | null>(null)
    const [newPassword,setNewPassword] = useState<string | null>(null)  
    const [newPasswordVerify,setNewPasswordVerify] = useState<string | null>(null)
    const [match,setMatch] = useState<boolean | null>(true)
    const [error,setError] = useState<string | null>(null)
    const router = useRouter();
    const {toast} = useToast();

    const loginInClick = async () => {
        console.log('email: ', email, " password: ",password);
        if(!email || !password) return;
        const {error} = await actionLoginUser({email,password});
        if(error) {
            console.log("error: ",error)
            toast({
                title: "Error",
                description: error.message,
                variant:"destructive"
            })
            return;
        }
        router.replace(`/profile`)
    }

    const signupClick = async () => {
        console.log('email: ', newEmail, " password: ",newPassword);
        try {
            if(!newEmail || !newPassword) return;
            const response = await actionSignUpUser({email:newEmail,password:newPassword})
            if(response.error) {
                console.log("error: ",response.error)
                setError(response.error.message)
                toast({
                    title: "Error",
                    description: response.error.message,
                    variant:"destructive"
                })
            }else{
                console.log("response: ",response)
                {router.replace(`/profile`)}
            };
        } catch (error) {
            console.log("error at signing up user: ", error)
        }
    }
  return (
    
    <Tabs defaultValue="signup" className="mt-2">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Log In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Log In</CardTitle>
            <CardDescription>
              Login in to win!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">email</Label>
              <Input id="email" onChange={e=>setEmail(e.target.value)}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">password</Label>
              <Input id="password" type="password" onChange={e=>setPassword(e.target.value)}/>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="hover:bg-accent hover:text-accent-foreground tracking-tight text-center text-hotPink bg-black" onClick={loginInClick}>Log In</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Signup and win!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" onChange={e=>setNewEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" onChange={e=>setNewPassword(e.target.value)}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="newpassword">Repeat Password</Label>
              <Input id="newpassword" type="password" onChange={e=>{if(e.target.value!==newPassword){setMatch(false);}else{setMatch(true);}}}/>
              {!match && <p className="text-red-500 text-xs mt-1">passwords dont match</p>}
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="hover:bg-accent hover:text-accent-foreground tracking-tight text-center text-hotPink bg-black" onClick={signupClick}>Sign Up</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
