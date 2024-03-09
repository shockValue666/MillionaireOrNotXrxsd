"use client";
import Navbar from '@/components/main/Navbar';
import React from 'react'

interface LayoutProps{
    children:React.ReactNode
}

const layout:React.FC<LayoutProps> = ({
    children
}) => {
  return (

      <main>
        <Navbar/>
            {children}
      </main>
  )
}

export default layout

