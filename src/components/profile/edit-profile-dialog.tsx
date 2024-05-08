import React from 'react'
import CustomDialogTrigger from '../globals/custom-dialog-trigger';
import UpdateProfileForm from './update-profile-form';

interface EditProfileDialogProps{
    children:React.ReactNode;

}

const EditProfileDialog:React.FC<EditProfileDialogProps> = ({children}) => {
  return (
    <CustomDialogTrigger content={<UpdateProfileForm/>}>
        {children}
    </CustomDialogTrigger>
  )
}

export default EditProfileDialog