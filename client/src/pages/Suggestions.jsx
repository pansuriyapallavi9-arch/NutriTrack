import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Lightbulb, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Suggestions = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      // Get today's nutrition data
      const mealsRes = await API.get('/meals/today');
      const { totals, meals } = mealsRes.data;

      const recentFoods = meals.flatMap(m => m.detectedFoods || []);

      // Call Flask recommender
      const flaskRes = await axios.post('http://127.0.0.1:5001/recommend', {
        deficiencies: user?.deficiencies || [],
        diet_type: user?.dietType || 'vegetarian',
        recent_foods: recentFoods,
        daily_nutrients: totals || {}
      });

      setSuggestions(flaskRes.data.suggestions || []);
    } catch (err) {
      console.log('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const urgencyConfig = {
    high: {
      color: 'border-red-100 bg-red-50',
      badge: 'bg-red-100 text-red-600',
      icon: <AlertCircle size={14} className="text-red-500" />,
      label: 'High priority'
    },
    medium: {
      color: 'border-amber-100 bg-amber-50',
      badge: 'bg-amber-100 text-amber-600',
      icon: <Info size={14} className="text-amber-500" />,
      label: 'Medium priority'
    },
    low: {
      color: 'border-green-100 bg-green-50',
      badge: 'bg-green-100 text-green-600',
      icon: <CheckCircle size={14} className="text-green-500" />,
      label: 'You\'re doing well'
    }
  };

  const deficiencyLabels = {
    iron: 'Iron', omega3: 'Omega-3', vitaminD: 'Vitamin D',
    vitaminB12: 'Vitamin B12', calcium: 'Calcium',
    zinc: 'Zinc', fiber: 'Fiber', protein: 'Protein'
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Suggestions</h2>
        <p className="text-gray-500 text-sm mb-6">
          Personalised food recommendations based on your deficiencies and today's meals
        </p>

        {/* Diet type badge */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-gray-500">Your diet:</span>
          <span className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full border border-green-100 capitalize">
            {user?.dietType || 'Not set'}
          </span>
          <span className="text-xs text-gray-500 ml-2">Deficiencies:</span>
          {user?.deficiencies?.map(d => (
            <span key={d} className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full border border-blue-100">
              {deficiencyLabels[d]}
            </span>
          ))}
        </div>

        {suggestions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Lightbulb size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No suggestions available</p>
            <p className="text-gray-300 text-xs mt-1">
              Log some meals first or make sure you've set your deficiencies in your profile
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {suggestions.map((s, i) => {
              const config = urgencyConfig[s.urgency] || urgencyConfig.medium;
              return (
                <div key={i} className={`rounded-xl border p-5 ${config.color}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <h3 className="text-base font-semibold text-gray-800">{s.food}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
                        {deficiencyLabels[s.deficiency]}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
                        {s.percentage_met}% met
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Why: </span>{s.reason}
                  </p>

                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-medium">Recipe idea: </span>{s.recipe}
                  </p>

                  <div className="bg-white bg-opacity-60 rounded-lg p-3">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">💡 Tip: </span>{s.tip}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Suggestions;