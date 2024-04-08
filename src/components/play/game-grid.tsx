import React from 'react'
import { StaticImageData } from 'next/image'
import Image from 'next/image'
import Link from 'next/link'

interface GameGridProps {
    games: {title:string,description:string,image:StaticImageData,url:string}[],
}

const GameGrid:React.FC<GameGridProps> = ({games}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {games.map((game, index) => (
        <Link key={index} href={game.url} className="block w-full h-full">
            <div className="border border-gray-200 p-4 rounded-md">
                <Image src={game.image} alt={game.title} />
                <h3 className="text-lg font-semibold">{game.title}</h3>
                <p className="text-gray-600">{game.description}</p>
                {/* Add more details about the game as needed */}
            </div>
        </Link>
      ))}
    </div>
  )
}

export default GameGrid