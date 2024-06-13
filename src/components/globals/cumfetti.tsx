// // components/Confetti.js
// import { useRef, useEffect } from 'react';
// import confetti from 'canvas-confetti';

// interface CumfettiProps {
//     fire: boolean;   
// }

// const Cumfetti:React.FC<CumfettiProps> = ({ fire }) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     if (fire && canvasRef.current) {
//       const myConfetti = confetti.create(canvasRef.current, {
//         resize: true,
//         useWorker: true,
//       });

//       myConfetti({
//         particleCount: 100,
//         spread: 70,
//         origin: { y: 0.6 },
//       });
//     }
//   }, [fire]);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         pointerEvents: 'none',
//         zIndex: 9999,
//       }}
//     />
//   );
// };

// export default Cumfetti;


// components/Confetti.tsx
// import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
// import confetti from 'canvas-confetti';

// interface ConfettiProps {}

// const Cumfetti = forwardRef((props: ConfettiProps, ref) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useImperativeHandle(ref, () => ({
//     fire: () => {
//       if (canvasRef.current) {
//         const myConfetti = confetti.create(canvasRef.current, {
//           resize: true,
//           useWorker: true,
//         });

//         myConfetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { y: 0.6 },
//         });
//       }
//     },
//   }));

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         pointerEvents: 'none',
//         zIndex: 9999,
//       }}
//     />
//   );
// });

// Cumfetti.displayName = 'Cumfetti';

// export default Cumfetti;




// components/Confetti.tsx
// import { useRef, forwardRef, useImperativeHandle } from 'react';
// import confetti from 'canvas-confetti';

// interface ConfettiProps {}

// const Cumfetti = forwardRef((props: ConfettiProps, ref) => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useImperativeHandle(ref, () => ({
//     fire: (x: number, y: number) => {
//       if (canvasRef.current) {
//         const myConfetti = confetti.create(canvasRef.current, {
//           resize: true,
//           useWorker: true,
//         });

//         myConfetti({
//           particleCount: 100,
//           spread: 70,
//           origin: { x, y },
//         });
//       }
//     },
//   }));

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         pointerEvents: 'none',
//         zIndex: 9999,
//       }}
//     />
//   );
// });

// Cumfetti.displayName = 'Cumfetti';

// export default Cumfetti;


// components/Confetti.tsx
import { useRef, forwardRef, useImperativeHandle } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
    particleCount?: number;

}

const Cumfetti = forwardRef((props: ConfettiProps, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useImperativeHandle(ref, () => ({
    fire: (x: number, y: number) => {
      if (canvasRef.current) {
        const myConfetti = confetti.create(canvasRef.current, {
          resize: true,
          useWorker: true,
        });

        myConfetti({
          particleCount: props.particleCount || 100,
          angle: 0,
          spread: 90,
          origin: { x, y },
          ticks: 200,
        });
      }
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      style={{
        // position: 'fixed',
        // top: 0,
        // left: 0,
        // width: '100%',
        // height: '100%',
        // pointerEvents: 'none',
        // zIndex: 9999,

         position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
});

Cumfetti.displayName = 'Cumfetti';

export default Cumfetti;