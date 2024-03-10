import React from 'react'

const Features = () => {
  return (
    <div className='py-24'>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-black p-6 rounded-lg shadow-md border border-white">
            <h2 className="text-xl font-semibold mb-4">Real-Time Trading</h2>
            <p className="text-white">Trade meme coins with live updates on prices, order book, and recent trades.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-black p-6 rounded-lg shadow-md border border-white" >
            <h2 className="text-xl font-semibold mb-4">Bet on the number</h2>
            <p className="text-white">Generating a random 5 digit number every 5 seconds, bet on roll</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-black p-6 rounded-lg shadow-md border border-white">
            <h2 className="text-xl font-semibold mb-4">Social Features</h2>
            <p className="text-white">Connect with other traders, share strategies, and discuss meme coins in chat rooms and forums.</p>
            </div>
            {/* Add more features as needed */}
        </div>
    </div>
  )
}

export default Features