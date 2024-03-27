"use client";
import Header from '@/components/main/Header';
import MobileHeader from '@/components/main/mobile-header';
import React from 'react'

interface LayoutProps{
    children:React.ReactNode
}

const layout:React.FC<LayoutProps> = ({
    children
}) => {
  return (

      <main className='border border-yellow-500'>
        <Header/>
        <MobileHeader/>
            {children}
      </main>
  )
}

export default layout

