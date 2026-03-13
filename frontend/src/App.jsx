import Navbar from './components/Navbar';
import Home from './pages/Home';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Home />
      <footer className="mt-auto py-5 text-center">
        <p className="text-[10px] text-zinc-800">
          Student Dropout Risk Prediction System · © 2026
        </p>
      </footer>
    </div>
  );
}
