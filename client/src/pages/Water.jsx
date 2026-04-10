import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Droplets, Plus, Minus } from 'lucide-react';

const Water = () => {
  const [water, setWater] = useState(0);
  const [customAmount, setCustomAmount] = useState(250);
  const [loading, setLoading] = useState(false);
  const goal = 2500;

  useEffect(() => {
    fetchWater();
  }, []);

  const fetchWater = async () => {
    try {
      const res = await API.get('/water/today');
      setWater(res.data.water || 0);
    } catch (err) {
      console.log('No water data yet');
    }
  };

  const addWater = async (amount) => {
    setLoading(true);
    try {
      const res = await API.post('/water/add', { amount });
      setWater(res.data.water);
      toast.success(`+${amount}ml added!`);
    } catch (err) {
      toast.error('Could not update water');
    } finally {
      setLoading(false);
    }
  };

  const percentage = Math.min(Math.round((water / goal) * 100), 100);

  const getColor = () => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-blue-500';
    return 'text-red-400';
  };

  const quickAmounts = [150, 250, 350, 500];

  return (
    <Layout>
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Water tracker</h2>
        <p className="text-gray-500 text-sm mb-6">Stay hydrated throughout the day</p>

        {/* Main water card */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4 text-center">
          <Droplets size={40} className={`mx-auto mb-3 ${getColor()}`} />
          <p className={`text-5xl font-bold mb-1 ${getColor()}`}>{water}</p>
          <p className="text-gray-400 text-sm">of {goal}ml daily goal</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-3 mt-4 mb-2">
            <div
              className="h-3 rounded-full bg-blue-400 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">{percentage}% of daily goal</p>

          {/* Status message */}
          <div className="mt-4 p-3 rounded-lg bg-gray-50">
            {percentage >= 100 ? (
              <p className="text-green-600 text-sm font-medium">🎉 Daily goal achieved!</p>
            ) : percentage >= 50 ? (
              <p className="text-blue-600 text-sm">💧 Good progress! Keep going</p>
            ) : (
              <p className="text-red-500 text-sm">⚠️ You need to drink more water today</p>
            )}
          </div>
        </div>

        {/* Quick add buttons */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick add</p>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => addWater(amount)}
                disabled={loading}
                className="py-3 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition disabled:opacity-50"
              >
                +{amount}ml
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Custom amount</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCustomAmount(Math.max(50, customAmount - 50))}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <Minus size={16} />
            </button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-semibold text-gray-800">{customAmount}</span>
              <span className="text-gray-400 text-sm ml-1">ml</span>
            </div>
            <button
              onClick={() => setCustomAmount(customAmount + 50)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={() => addWater(customAmount)}
            disabled={loading}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
          >
            Add {customAmount}ml
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Water;