import React from 'react';
m;
interface FullScreenNoteProps {
  note: any; // Replace with the type of your note
}

const FullScreenNote: React.FC<FullScreenNoteProps> = ({ note }) => {
 return (
  <div className="full-screen-note">
   <h1>{note.title}</h1>
   <p>{note.content}</p>
   {/* Add more fields as necessary */}
  </div>
 );
};

export default FullScreenNote;