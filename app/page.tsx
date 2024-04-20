import TerminalLayout from './components/terminal';

export default function Home() {
 return (
  <main className="flex min-h-screen bg-gray-500 flex-col items-center justify-between p-2 md:p-2 overflow-hidden relative">
   <TerminalLayout />
   <div className="fixed bottom-4 right-4">
    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          coming soon
    </button>
   </div>
  </main>
 );
}
