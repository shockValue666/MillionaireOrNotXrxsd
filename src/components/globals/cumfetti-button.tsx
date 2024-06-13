"use client";
import React, { useRef, useState } from 'react'
import { Button } from '../ui/button';
import Cumfetti from './cumfetti';


interface CumfettiButtonProps {
    pc?: number;
    trigger?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CumfettiButton:React.FC<CumfettiButtonProps> = ({
    pc
}) => {
    const [showConfetti, setShowConfetti] = useState(false);
      const [fireConfetti, setFireConfetti] = useState(false);
        // const confettiRef = useRef<{ fire: () => void }>(null);
        const confettiRef = useRef<{ fire: (x: number, y: number) => void }>(null);


    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // setShowConfetti(true);
        // setTimeout(()=>{
        //     setShowConfetti(false);
        // },1000)

        // setFireConfetti(true);
        // setTimeout(() => {
        // setFireConfetti(false);
        // }, 5000); // Confetti disappears after 5 seconds
        // console.log("handle my cock cum")

        // confettiRef.current?.fire();

        // const rect = e.currentTarget.getBoundingClientRect();
        // const x = (rect.left + rect.right) / 2 / window.innerWidth;
        // const y = (rect.top + rect.bottom) / 2 / window.innerHeight;

        // confettiRef.current?.fire(x, y);

        if(!e.currentTarget.parentElement) return;
        const rect = e.currentTarget.parentElement.getBoundingClientRect();
        const x = rect.right / window.innerWidth;
        const y = (rect.top + rect.bottom) / 2 / window.innerHeight;

        confettiRef.current?.fire(x, y);
    }
  return (
    <div>
        <h1>welcum to my cock</h1>
        <Button onClick={handleButtonClick}>
            celebrate
        </Button>
        {/* {
            showConfetti && <Cumfetti fire={true}/>
        } */}

        {/* showConfetti && <Cumfetti fire={fireConfetti}/> */}

        <Cumfetti ref={confettiRef} particleCount={pc}/>

    </div>
  )
}

export default CumfettiButton