"use client";
import Balance from '@/components/globals/Balance';
import Points from '@/components/globals/Points';
import BalanceAndPoints from '@/components/globals/balance-and-points';
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

      <main className=''>
        {/* <Header/>
        <MobileHeader/> */}
        {/* <div className="flex justify-start items-center">
                <BalanceAndPoints/>
        </div> */}
            {children}
            <style jsx>{`
                input, textarea {
                    font-size: 16px; /* Example font size */
                    /* Other styling for input fields */
                    touch-action: manipulation;
                    -ms-touch-action: manipulation;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    -webkit-tap-highlight-color: rgba(0,0,0,0);
                }
            `}</style>
      </main>
  )
}

export default layout

