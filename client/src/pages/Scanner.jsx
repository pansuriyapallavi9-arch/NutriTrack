import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../api/axios';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, X, Check, Search, Plus, Minus } from 'lucide-react';

const Scanner = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [mealType, setMealType] = useState('lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImage(URL.createObjectURL(file));

    setSearching(true);
    toast('Scanning meal...');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('http://127.0.0.1:5001/scan-meal', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.results && res.data.results.length > 0) {
        let newFoods = [...selectedFoods];
        res.data.results.forEach(food => {
          if (!newFoods.find(f => f.name === food.name)) {
            newFoods.push({ ...food, quantity: 100 });
            toast.success(`Detected ${food.name}!`);
          }
        });
        setSelectedFoods(newFoods);
      } else {
        toast('No specific foods detected. Please search manually.');
      }
    } catch (err) {
      toast.error('Scan failed. Ensure backend is running.');
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:5001/search-food?query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(res.data.results || []);
    } catch (err) {
      toast.error('Search failed. Is Flask running?');
    } finally {
      setSearching(false);
    }
  };

  const addFood = (food) => {
    const exists = selectedFoods.find(f => f.name === food.name);
    if (exists) {
      toast('Already added!');
      return;
    }
    setSelectedFoods([...selectedFoods, { ...food, quantity: 100 }]);
    setSearchResults([]);
    setSearchQuery('');
    toast.success(`${food.name} added!`);
  };

  const removeFood = (name) => {
    setSelectedFoods(selectedFoods.filter(f => f.name !== name));
  };

  const updateQuantity = (name, qty) => {
    setSelectedFoods(selectedFoods.map(f =>
      f.name === name ? { ...f, quantity: Math.max(10, qty) } : f
    ));
  };

  const calculateTotals = () => {
    return selectedFoods.reduce((acc, food) => {
      const ratio = food.quantity / 100;
      acc.calories += (food.calories || 0) * ratio;
      acc.protein += (food.protein || 0) * ratio;
      acc.carbs += (food.carbs || 0) * ratio;
      acc.fat += (food.fat || 0) * ratio;
      acc.fiber += (food.fiber || 0) * ratio;
      acc.iron += (food.iron || 0) * ratio;
      acc.calcium += (food.calcium || 0) * ratio;
      acc.vitaminD += (food.vitaminD || 0) * ratio;
      acc.vitaminB12 += (food.vitaminB12 || 0) * ratio;
      acc.omega3 += (food.omega3 || 0) * ratio;
      acc.zinc += (food.zinc || 0) * ratio;
      return acc;
    }, {
      calories: 0, protein: 0, carbs: 0, fat: 0,
      fiber: 0, iron: 0, calcium: 0, vitaminD: 0,
      vitaminB12: 0, omega3: 0, zinc: 0
    });
  };

  const handleSaveMeal = async () => {
    if (selectedFoods.length === 0) {
      toast.error('Please add at least one food item');
      return;
    }
    setSaving(true);
    try {
      const totals = calculateTotals();
      Object.keys(totals).forEach(k => {
        totals[k] = Math.round(totals[k] * 10) / 10;
      });

      const formData = new FormData();
      if (imageFile) formData.append('image', imageFile);
      formData.append('detectedFoods', JSON.stringify(selectedFoods.map(f => f.name)));
      formData.append('nutritionData', JSON.stringify(totals));
      formData.append('mealType', mealType);

      await API.post('/meals/save', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Meal saved successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Could not save meal');
    } finally {
      setSaving(false);
    }
  };

  const totals = calculateTotals();

  const nutritionItems = [
    { key: 'calories', label: 'Calories', unit: 'kcal', color: 'text-orange-500', bg: 'bg-orange-50' },
    { key: 'protein', label: 'Protein', unit: 'g', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { key: 'carbs', label: 'Carbs', unit: 'g', color: 'text-blue-500', bg: 'bg-blue-50' },
    { key: 'fat', label: 'Fat', unit: 'g', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { key: 'fiber', label: 'Fiber', unit: 'g', color: 'text-purple-500', bg: 'bg-purple-50' },
    { key: 'iron', label: 'Iron', unit: 'mg', color: 'text-red-500', bg: 'bg-red-50' },
    { key: 'calcium', label: 'Calcium', unit: 'mg', color: 'text-indigo-400', bg: 'bg-indigo-50' },
    { key: 'vitaminD', label: 'Vitamin D', unit: 'mcg', color: 'text-amber-500', bg: 'bg-amber-50' },
    { key: 'vitaminB12', label: 'Vitamin B12', unit: 'mcg', color: 'text-pink-500', bg: 'bg-pink-50' },
    { key: 'omega3', label: 'Omega-3', unit: 'g', color: 'text-teal-500', bg: 'bg-teal-50' },
    { key: 'zinc', label: 'Zinc', unit: 'mg', color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  return (
    <Layout>
      <div className="bg-slate-50/50 min-h-full py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center">
              Scan & Log
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Upload a meal photo for automatic AI detection, or manually enter your ingredients below.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image & Type */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Meal Capture</p>
                
                {!image ? (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-emerald-200 bg-emerald-50/30 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all group overflow-hidden relative">
                    <Upload size={28} className="text-emerald-400 mb-3 group-hover:-translate-y-1 transition-transform" />
                    <p className="text-sm font-semibold text-emerald-800">Tap to upload</p>
                    <p className="text-xs text-emerald-600/70 mt-1">JPEG, PNG, HEIC</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                    <img src={image} alt="meal" className={`w-full h-48 object-cover transition-all ${searching ? 'brightness-75 scale-105' : 'scale-100'}`} />
                    {searching && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 animate-laser shadow-[0_0_15px_#34d399]" />
                    )}
                    <button
                      onClick={() => { setImage(null); setImageFile(null); }}
                      className="absolute top-3 right-3 bg-white/80 backdrop-blur-md rounded-full p-2 shadow-lg hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Timing</p>
                <div className="grid grid-cols-2 gap-3">
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`py-3 rounded-xl text-sm font-semibold transition-all capitalize shadow-sm ${
                        mealType === type
                          ? 'bg-emerald-500 text-white shadow-emerald-200 ring-2 ring-emerald-500 ring-offset-2'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Search, Selection & Macros */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Database Search</p>
                
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="e.g. Avocado Toast..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3.5 rounded-xl text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                  >
                    {searching ? 'Wait...' : 'Search'}
                  </button>
                </div>

                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="mt-4 border border-slate-100 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-50">
                    {searchResults.map((food, i) => (
                      <div
                        key={i}
                        onClick={() => addFood(food)}
                        className="flex items-center justify-between p-4 bg-white hover:bg-emerald-50 cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{food.name}</p>
                          <p className="text-xs font-medium text-emerald-600 mt-0.5">
                            {Math.round(food.calories)} kcal <span className="text-slate-300 mx-1">|</span> {Math.round(food.protein)}g protein
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Plus size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {searchResults.length === 0 && searchQuery && !searching && (
                  <p className="text-sm font-medium text-slate-400 text-center py-6">
                    No matching ingredients found.
                  </p>
                )}
              </div>

              {selectedFoods.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Selected Items</p>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">{selectedFoods.length} selected</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {selectedFoods.map((food) => (
                      <div key={food.name} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:shadow-md transition-all">
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 text-sm">{food.name}</p>
                          <p className="text-xs font-medium text-slate-500 mt-1">
                            {Math.round((food.calories * food.quantity) / 100)} kcal for {food.quantity}g
                          </p>
                        </div>
                        
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm p-1">
                          <button
                            onClick={() => updateQuantity(food.name, food.quantity - 10)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-12 text-center text-slate-700">{food.quantity}g</span>
                          <button
                            onClick={() => updateQuantity(food.name, food.quantity + 10)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <button onClick={() => removeFood(food.name)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1">
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutrition totals */}
              {selectedFoods.length > 0 && (
                <div className="bg-slate-800 rounded-3xl shadow-lg border border-slate-700 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="flex justify-between items-end mb-6 relative z-10">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Imprint</p>
                      <p className="text-3xl font-black text-white mt-1">{totals.calories.toFixed(0)} <span className="text-sm font-medium text-slate-400 ml-1">kcal</span></p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
                    {nutritionItems.filter(item => item.key !== 'calories').map(({ key, label, unit, color, bg }) => (
                      <div key={key} className={`${bg} rounded-2xl p-4 transition-transform hover:-translate-y-1`}>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
                        <p className={`text-xl font-bold ${color}`}>
                          {Math.round(totals[key] * 10) / 10}
                          <span className="text-xs font-semibold opacity-70 ml-1">{unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save button */}
              {selectedFoods.length > 0 && (
                <button
                  onClick={handleSaveMeal}
                  disabled={saving}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-wide py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all disabled:opacity-70 flex items-center justify-center gap-3 text-sm mt-2"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Check size={20} />
                  )}
                  {saving ? 'Processing Entry...' : 'Finalize Meal Entry'}
                </button>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Scanner;