import React from 'react';
import NotesDash from '../app/components/notes/notesDash';
import Navbar from '../app/sections/navbar';
import '../app/globals.css';

export default function NotesPage() {
 return (
  <div>
   <Navbar />
   <NotesDash />
  </div>
 );
}
