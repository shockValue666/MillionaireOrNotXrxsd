import React from 'react'
import CustomDialogTrigger from '../globals/custom-dialog-trigger';
import { SignupLogin } from './SignupLogin';
import { Toaster } from '../ui/toaster';

interface AuthProps{
    children:React.ReactNode;
}

export const Auth:React.FC<AuthProps> = ({
    children
}) => {
  return (
    <CustomDialogTrigger content={<SignupLogin/>}>
        {children}
        <Toaster/>
    </CustomDialogTrigger>
  )
}

