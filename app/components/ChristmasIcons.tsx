'use client';
import React from 'react';
import { christmasIcons } from '../constants';
import { useEffect, useState } from 'react';

const ChristmasIcons: React.FC = () => {
 const [positions, setPositions] = useState<Array<{ left: number; top: number }>>([]);

 const getRandomPosition = (): { left: number; top: number } => {
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  return { left, top };
 };

 const checkCollision = (newPosition: { left: number; top: number }): boolean => {
  const collisionThreshold = 10;

  for (const position of positions) {
   if (
    Math.abs(position.left - newPosition.left) < collisionThreshold &&
        Math.abs(position.top - newPosition.top) < collisionThreshold
   ) {
    return true; // Collision detected
   }
  }

  return false; // No collision
 };

 useEffect(() => {
  const newPositions: Array<{ left: number; top: number }> = [];

  christmasIcons.forEach(() => {
   let newPosition = getRandomPosition();

   // Check for collisions and adjust position if needed
   while (checkCollision(newPosition)) {
    newPosition = getRandomPosition();
   }

   newPositions.push(newPosition);
  });

  setPositions(newPositions);
 }, []); // Run once on component mount

 return (
  <>
   {christmasIcons.map((icon, index) => (
    <div
     key={index}
     style={{
      position: 'absolute',
      left: `${positions[index]?.left || 0}%`,
      top: `${positions[index]?.top || 0}%`,
      zIndex: -1,
     }}
    >
     {icon.type === 'emoji' ? (
      <span style={{ fontSize: '24px', filter: 'blur(0px)' }}>{icon.name}</span>
     ) : (
      <img src={icon.content} alt={icon.description} style={{ width: '50px', filter: 'blur(0px)' }} />
     )}
    </div>
   ))}
  </>
 );
};

export default ChristmasIcons;
