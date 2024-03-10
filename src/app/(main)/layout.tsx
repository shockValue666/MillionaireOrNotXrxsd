"use client";
import Header from '@/components/main/Header';
import React from 'react'

interface LayoutProps{
    children:React.ReactNode
}

const layout:React.FC<LayoutProps> = ({
    children
}) => {
  return (

      <main>
        <Header/>
            {children}
      </main>
  )
}

export default layout

