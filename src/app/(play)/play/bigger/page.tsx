import BalanceAndPoints from '@/components/globals/balance-and-points'
import BiggerCo from '@/components/globals/bigger-cstarock'
import BiggerOrSmaller from '@/components/globals/bigget-or-smaller'
import Cumfetti from '@/components/globals/cumfetti'
import CumfettiButton from '@/components/globals/cumfetti-button'
import { Button } from '@/components/ui/button'
import React from 'react'

const Page = () => {

  return (
    <div>
      <div className='flex'>
        <BalanceAndPoints/>
      </div>
      <div className='flex items-center justify-center '>
          <BiggerCo/>
      </div>
    </div>
  )
}

export default Page