import DirectorsCut from '../components/features/DirectorsCut';

const DirectorsCutPage = () => {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Director's Cut</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Navigate through a filmmaker's complete body of work with personalized viewing 
            orders and contextual insights into their unique style and evolution.
          </p>
        </div>
        
        <DirectorsCut />
      </div>
    </div>
  );
};

export default DirectorsCutPage; 