import React, { useState, useEffect } from 'react';

interface AmountNotificationProps {
    message: string;
    visible:boolean;
}

const AmountNotification:React.FC<AmountNotificationProps> = ({ message, visible }) => {
  const [isVisible, setIsVisible] = useState(visible);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(false);
//     }, 1500); // Change the duration as needed (e.g., 3000 milliseconds for 3 seconds)

useEffect(() => {
    console.log("isVisibile from Notification component: ",isVisible)
         const timer = setTimeout(() => {
           setIsVisible(false);
         },999); // Change the duration as needed (e.g., 3000 milliseconds for 3 seconds)
    return () => clearTimeout(timer);
  }, [isVisible]);

  const notificationStyle = {
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'fit-content',
    padding: '1rem',
    color: 'white',
    backgroundColor: isVisible ? 'green' : 'transparent',
    position: 'absolute',
    animation: isVisible ? 'bounce 0.5s ease infinite' : 'none' // Apply bounce animation if visible
  };



  return (
    // <div className={`fixed top-0 left-0 w-full p-4 text-white ${isVisible ? 'bg-green-500' : 'hidden'}`}>
    //   <p>{message}</p>
    // </div>
    <div className={`p-4 text-white rounded-md ${isVisible ? 'bg-green-500' : 'hidden'}`} style={{ 
      // left: '50%',
      transform: 'translateX(-50%)',
      width: 'fit-content',
      padding: '1rem',
      color: 'white',
      backgroundColor: isVisible ? 'green' : 'transparent',
      position: 'absolute',
      animation: isVisible ? 'bounce 0.75s ease infinite' : 'none' // Apply bounce animation if visible}}>
    }}>
      <p>{message}</p>
    </div>
  );
};

export default AmountNotification;
