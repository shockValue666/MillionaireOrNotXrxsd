import React, { useEffect, useState, useRef } from 'react';
import { SlotCounterRef } from 'react-slot-counter';
import SlotCounter from 'react-slot-counter';
import { Direction, Value } from 'react-slot-counter/lib/types/common';

interface AnimateOnVisibleOptions {
    rootMargin?: string;
    triggerOnce?: boolean;
}

interface Props {
    value: Value;
    startValue?: Value;
    startValueOnce?: boolean;
    duration?: number;
    dummyCharacters?: string[] | JSX.Element[];
    dummyCharacterCount?: number;
    autoAnimationStart?: boolean;
    animateUnchanged?: boolean;
    hasInfiniteList?: boolean;
    containerClassName?: string;
    charClassName?: string;
    separatorClassName?: string;
    valueClassName?: string;
    sequentialAnimationMode?: boolean;
    useMonospaceWidth?: boolean;
    direction?: Direction;
    debounceDelay?: number;
    animateOnVisible?: boolean | AnimateOnVisibleOptions;
    onAnimationEnd?: () => void;  // Add this line
}


const TestSlotCounter = React.forwardRef<SlotCounterRef, Props>((props, ref) => {
    const { onAnimationEnd, duration, autoAnimationStart } = props;
    const [isAnimating, setIsAnimating] = useState(false);

     const startAnimation = () => {
        setIsAnimating(true);
        // Assuming 'duration' is in seconds and animations are CSS-based
        setTimeout(() => {
            setIsAnimating(false);
            if (onAnimationEnd) {
                onAnimationEnd();  // Call the onAnimationEnd callback
            }
        }, (duration ?? 0) * 1000);
    }
    // Assuming you control the animation with some state or effects
    useEffect(() => {
        if (autoAnimationStart) {
            startAnimation();
        }
    }, [autoAnimationStart]);

    // Add the missing refreshStyles property
    React.useImperativeHandle(ref, () => ({
        startAnimation: () => {}, // Declare and provide an initializer for startAnimation
        refreshStyles: () => {} // Add an empty function for now
    }));

    return (
        <div className="slot-container">
            {/* Animation logic here */}
             <SlotCounter
                // startValue={currentEmojisNew}
                startValueOnce={true}
                value={["3,3,3,3,3"]}
                
                // value={currentEmojisNew}
                charClassName='text-4xl'
                animateUnchanged
                autoAnimationStart={false}
                // dummyCharacters={emojis}
                duration={0.5}
                // hasInfiniteList={true}
                // useMonospaceWidth={true}
                debounceDelay={3}
                // ref={slot1Ref} 
                onAnimationEnd={()=>{}}
        />
        </div>
    );
});

TestSlotCounter.displayName = 'TestSlotCounter';

export default React.memo(TestSlotCounter);
