import React from 'react'
import CustomDialogTrigger from '../globals/custom-dialog-trigger';
import CreateAdForm from './create-ad-form';

interface AdCreationDialogProps{
    children:React.ReactNode;

}

const AdCreationDialog:React.FC<AdCreationDialogProps> = ({children}) => {
  return (
    <CustomDialogTrigger content={<CreateAdForm/>}>
        {children}
    </CustomDialogTrigger>
  )
}

export default AdCreationDialog