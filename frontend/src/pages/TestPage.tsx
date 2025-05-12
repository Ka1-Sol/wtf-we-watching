import { useState } from 'react';
import { Link } from 'react-router-dom';

const TestPage = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-6">Pagina di Test</h1>
      <p className="mb-4">
        Questa è una pagina di test semplice per verificare se l'applicazione funziona correttamente.
      </p>

      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setCount(prev => prev - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          -
        </button>
        <span className="text-xl font-bold">{count}</span>
        <button
          onClick={() => setCount(prev => prev + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          +
        </button>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Test dei Link</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="text-blue-500 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/discover" className="text-blue-500 hover:underline">
              Discover
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-blue-500 hover:underline">
              Pagina che non esiste (test errore)
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage; 