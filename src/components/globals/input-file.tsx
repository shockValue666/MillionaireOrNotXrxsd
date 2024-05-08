"use client";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '../ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAppState } from '@/lib/providers/state-provider';
import { updateProfile } from '@/lib/supabase/queries';

const InputFile = () => {
  // Define state to hold the file value
  const supabase = createClientComponentClient();
  const [file, setFile] = useState<File | null>(null);
  const {profile} = useAppState();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      // Handle the file submission here (e.g., upload to server)
      console.log('Selected file:', file);
    } else {
      console.log('No file selected.');
    }
  };

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    console.log("selectedFile: ",selectedFile)
    if (selectedFile) {
      setFile(selectedFile);
      const {data,error} = await supabase.storage.from('prof_pics').upload(`${profile?.id}.png`,selectedFile as File,{upsert:true});
    //   const {} = await updateProfile({avatar:})
    if(data){
      console.log("successfully uploaded the file: ",data.path)
    }
    if(error){
        console.log("error at uploading the file: ",error)
    }
    }
  };

  return (
    <form action="" onSubmit={(e) => handleSubmit(e)}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        {/* <Label htmlFor="picture">Picture</Label> */}
        {/* Add onChange event handler to track file selection */}
        <Input id="picture" type="file" onChange={(e) => handleFileChange(e)} />
        <Button type="submit" className="text-hotPink bg-black text-md hover:bg-accent">
          CHANGE PROF PIC
        </Button>
      </div>
    </form>
  );
};

export default InputFile;
