"use client";
import AdBanner from '@/components/globals/ad-banner';
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

      <main>
        <Header/>
        <MobileHeader/>
    <AdBanner/>
            {children}
      </main>
  )
}

export default layout

