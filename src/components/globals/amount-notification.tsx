import React, { useState, useEffect } from 'react';

interface AmountNotificationProps {
    message: string;
}

const AmountNotification:React.FC<AmountNotificationProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500); // Change the duration as needed (e.g., 3000 milliseconds for 3 seconds)

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full p-4 text-white ${isVisible ? 'bg-green-500' : 'hidden'}`}>
      <p>{message}</p>
    </div>
  );
};

export default AmountNotification;
