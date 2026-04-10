import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Droplets, Apple, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [todayMeals, setTodayMeals] = useState([]);
  const [todayNutrition, setTodayNutrition] = useState({
    calories: 0, protein: 0, carbs: 0, fat: 0,
    iron: 0, omega3: 0, vitaminD: 0, vitaminB12: 0,
    calcium: 0, zinc: 0, fiber: 0
  });
  const [water, setWater] = useState(0);
  const [loading, setLoading] = useState(true);

  // RDA values based on general standards
  const RDA = {
    calories: user?.gender === 'female' ? 2000 : 2500,
    protein: user?.weight ? user.weight * 0.8 : 60,
    carbs: 300, fat: 65, iron: 18, omega3: 1.6,
    vitaminD: 20, vitaminB12: 2.4, calcium: 1000,
    zinc: 11, fiber: 30
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const res = await API.get('/meals/today');
      setTodayMeals(res.data.meals || []);
      setTodayNutrition(res.data.totals || todayNutrition);
      setWater(res.data.water || 0);
    } catch (err) {
      console.log('No meals yet');
    } finally {
      setLoading(false);
    }
  };

  const macroData = [
    { name: 'Protein', value: Math.round(todayNutrition.protein), color: '#10b981' },
    { name: 'Carbs', value: Math.round(todayNutrition.carbs), color: '#3b82f6' },
    { name: 'Fat', value: Math.round(todayNutrition.fat), color: '#f59e0b' },
  ];

  const deficiencyNutrients = user?.deficiencies || [];

  const getPercentage = (nutrient) => {
    const val = todayNutrition[nutrient] || 0;
    const rda = RDA[nutrient] || 1;
    return Math.min(Math.round((val / rda) * 100), 100);
  };

  const getBarColor = (pct) => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 50) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const nutrientLabels = {
    iron: 'Iron', omega3: 'Omega-3', vitaminD: 'Vitamin D',
    vitaminB12: 'Vitamin B12', calcium: 'Calcium',
    zinc: 'Zinc', fiber: 'Fiber', protein: 'Protein'
  };

  const mealBarData = todayMeals.map(m => ({
    name: m.mealType?.charAt(0).toUpperCase() + m.mealType?.slice(1) || 'Meal',
    calories: Math.round(m.nutritionData?.calories || 0)
  }));

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 md:p-10 pt-8">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, <span className="text-emerald-500">{user?.name?.split(' ')[0]}!</span> 👋
            </h2>
            <p className="text-slate-500 font-medium mt-1">Here is your nutritional command center for today.</p>
          </div>
          <div className="bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm text-sm font-bold text-slate-600 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Tracking
          </div>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 bg-orange-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform blur-xl"></div>
            <div className="flex items-center gap-3 mb-3 relative">
              <div className="p-2.5 bg-orange-100 text-orange-500 rounded-xl"><Flame size={18} /></div>
              <span className="text-sm font-bold text-slate-500 tracking-wide uppercase">Calories</span>
            </div>
            <div className="relative">
              <p className="text-4xl font-black text-slate-800 tracking-tight">{Math.round(todayNutrition.calories)}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase">of ~{RDA.calories} kcal goal</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 bg-emerald-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform blur-xl"></div>
            <div className="flex items-center gap-3 mb-3 relative">
              <div className="p-2.5 bg-emerald-100 text-emerald-500 rounded-xl text-lg flex items-center justify-center leading-none">💪</div>
              <span className="text-sm font-bold text-slate-500 tracking-wide uppercase">Protein</span>
            </div>
            <div className="relative">
              <p className="text-4xl font-black text-slate-800 tracking-tight">{Math.round(todayNutrition.protein)}<span className="text-xl text-slate-400 ml-0.5">g</span></p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase">of ~{Math.round(RDA.protein)}g target</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 bg-red-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform blur-xl"></div>
            <div className="flex items-center gap-3 mb-3 relative">
              <div className="p-2.5 bg-red-100 text-red-500 rounded-xl"><Apple size={18} /></div>
              <span className="text-sm font-bold text-slate-500 tracking-wide uppercase">Meals</span>
            </div>
            <div className="relative">
              <p className="text-4xl font-black text-slate-800 tracking-tight">{todayMeals.length}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase">logged today</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 bg-blue-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform blur-xl"></div>
            <div className="flex items-center gap-3 mb-3 relative">
              <div className="p-2.5 bg-blue-100 text-blue-500 rounded-xl"><Droplets size={18} /></div>
              <span className="text-sm font-bold text-slate-500 tracking-wide uppercase">Water</span>
            </div>
            <div className="relative">
              <p className="text-4xl font-black text-slate-800 tracking-tight">{water}<span className="text-xl text-slate-400 ml-0.5">ml</span></p>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase">of 2500ml daily target</p>
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Macros pie chart */}
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm">
            <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-6">Macronutrient Profile</h3>
            {todayNutrition.calories > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={macroData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                      {macroData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} className="hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-4">
                  {macroData.map((m) => (
                    <div key={m.name} className="flex items-center gap-3 border bg-slate-50 border-slate-100 px-4 py-2.5 rounded-2xl">
                      <div className="w-3.5 h-3.5 rounded-full shadow-inner" style={{ background: m.color }}></div>
                      <span className="text-sm font-medium text-slate-600 w-16">{m.name}</span>
                      <strong className="text-slate-800 font-black">{m.value}g</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[180px] text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-2xl">🍽️</div>
                <p className="text-sm font-medium">No macros to display yet</p>
              </div>
            )}
          </div>

          {/* Meals bar chart */}
          <div className="bg-white rounded-3xl border border-slate-100 p-7 shadow-sm">
            <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-6">Caloric Distribution</h3>
            {mealBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={mealBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 'bold' }} />
                  <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 8, 8]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[180px] text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-3"><Flame size={24} className="text-slate-300" /></div>
                <p className="text-sm font-medium">No meals analyzed yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Deficiency tracker */}
          {deficiencyNutrients.length > 0 && (
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><AlertCircle size={16} /></div>
                <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Deficiency Monitor</h3>
              </div>
              <div className="flex flex-col gap-5">
                {deficiencyNutrients.map((nutrient) => {
                  const pct = getPercentage(nutrient);
                  return (
                    <div key={nutrient} className="group">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-700">{nutrientLabels[nutrient]}</span>
                        <span className="text-xs font-black text-slate-400 group-hover:text-amber-500 transition-colors">{pct}% <span className="font-medium text-[10px]">RDA</span></span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${getBarColor(pct)}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Today's meals list */}
          <div className={`${deficiencyNutrients.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white rounded-3xl border border-slate-100 p-7 shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase">Meal History</h3>
              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full">{todayMeals.length} records</span>
            </div>
            
            {todayMeals.length > 0 ? (
              <div className="flex flex-col gap-4">
                {todayMeals.map((meal, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100/50 transition-colors group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0 bg-white">
                      {meal.imageUrl ? (
                        <img src={meal.imageUrl} alt="meal" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><Apple size={24} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-800 capitalize truncate">{meal.mealType}</p>
                      <p className="text-sm font-medium text-slate-500 truncate mt-0.5">{meal.detectedFoods?.join(', ') || 'No specific foods'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-black text-emerald-500">{Math.round(meal.nutritionData?.calories || 0)} <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">kcal</span></p>
                      <p className="text-xs font-semibold text-slate-400 mt-1">{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 mt-2">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Apple size={28} className="text-slate-300" />
                </div>
                <p className="text-base font-bold text-slate-600">Your plate is empty!</p>
                <p className="text-sm text-slate-400 font-medium mt-1">Head over to the scanner to log your first meal.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;