"use client";
import React from 'react';
import SlotCounter from 'react-slot-counter';
import { Button } from '../ui/button';

const BiggerOrSmaller = () => {
    const [winner, setWinner] = React.useState(1);
    
    // Use the winner state directly to trigger animations.
    // If necessary, convert winner to a format that SlotCounter expects.
    const slotValues = winner.toString().split('').map(num => <span key={num}>{num}</span>);

    return (
        <div className='flex flex-col justify-center align-center border border-white rounded-lg gap-2'>
            <p className='w-full text-center'>here it goes</p>
            <div className='w-full text-center'>
                <SlotCounter
                    key={winner} // Use winner as key to force re-render
                    value={slotValues}
                    duration={1}
                    startValue={'?'}
                />
                <Button onClick={() => {setWinner(winner + 1); console.log("pressed winner: ", winner);}}>
                    roll
                </Button>
            </div>
        </div>
    );
};

export default BiggerOrSmaller;
