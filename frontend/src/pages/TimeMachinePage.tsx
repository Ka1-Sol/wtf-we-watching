import TimeMachine from '../components/features/TimeMachine';

const TimeMachinePage = () => {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Time Machine</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Travel through decades of cinema and television history, discovering the content
            that defined each era, with cultural and historical context.
          </p>
        </div>
        
        <TimeMachine />
      </div>
    </div>
  );
};

export default TimeMachinePage; 