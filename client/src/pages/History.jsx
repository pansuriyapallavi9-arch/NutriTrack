import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';
import { Calendar, Flame, Clock } from 'lucide-react';

const History = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await API.get('/meals');
      setMeals(res.data.meals || []);
    } catch (err) {
      console.log('Error fetching meals');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const mealTypeColors = {
    breakfast: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    lunch: 'bg-green-50 text-green-600 border-green-100',
    dinner: 'bg-blue-50 text-blue-600 border-blue-100',
    snack: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  const nutritionItems = [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'protein', label: 'Protein', unit: 'g' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
    { key: 'iron', label: 'Iron', unit: 'mg' },
    { key: 'calcium', label: 'Calcium', unit: 'mg' },
    { key: 'vitaminD', label: 'Vitamin D', unit: 'mcg' },
    { key: 'vitaminB12', label: 'Vitamin B12', unit: 'mcg' },
    { key: 'omega3', label: 'Omega-3', unit: 'g' },
    { key: 'zinc', label: 'Zinc', unit: 'mg' },
  ];

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
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Meal history</h2>
        <p className="text-gray-500 text-sm mb-6">All your logged meals</p>

        {meals.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <p className="text-gray-400 text-sm">No meals logged yet</p>
            <p className="text-gray-300 text-xs mt-1">Start scanning meals to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {meals.map((meal, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer hover:border-green-200 transition-all"
                onClick={() => setSelected(selected === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  {/* Meal image */}
                  {meal.imageUrl ? (
                    <img
                      src={`http://localhost:5000${meal.imageUrl}`}
                      alt="meal"
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🍽️</span>
                    </div>
                  )}

                  {/* Meal info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${mealTypeColors[meal.mealType] || mealTypeColors.snack}`}>
                        {meal.mealType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {meal.detectedFoods?.join(', ') || 'No foods detected'}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={11} />
                        {formatDate(meal.timestamp)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={11} />
                        {formatTime(meal.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Calories */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Flame size={14} className="text-orange-400" />
                      <span className="text-lg font-semibold text-gray-800">
                        {Math.round(meal.nutritionData?.calories || 0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">kcal</p>
                  </div>
                </div>

                {/* Expanded nutrition */}
                {selected === i && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <p className="text-xs font-medium text-gray-500 mb-3">Nutrition breakdown</p>
                    <div className="grid grid-cols-4 gap-2">
                      {nutritionItems.map(({ key, label, unit }) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-400">{label}</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {Math.round(meal.nutritionData?.[key] || 0)}
                            <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;