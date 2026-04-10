import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUser, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Selected deficiencies state
  const [selectedDeficiencies, setSelectedDeficiencies] = useState([]);
  const [dietType, setDietType] = useState('');

  const deficiencyOptions = [
    { id: 'iron', label: 'Iron', icon: '🩸' },
    { id: 'omega3', label: 'Omega-3', icon: '🐟' },
    { id: 'vitaminD', label: 'Vitamin D', icon: '☀️' },
    { id: 'vitaminB12', label: 'Vitamin B12', icon: '💊' },
    { id: 'calcium', label: 'Calcium', icon: '🦴' },
    { id: 'zinc', label: 'Zinc', icon: '⚡' },
    { id: 'fiber', label: 'Fiber', icon: '🌾' },
    { id: 'protein', label: 'Protein', icon: '💪' },
  ];

  const toggleDeficiency = (id) => {
    setSelectedDeficiencies(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleStep1 = (data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const handleStep2 = () => {
    if (!dietType) {
      toast.error('Please select your diet type');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        dietType,
        deficiencies: selectedDeficiencies,
        isOnboarded: true
      };

      const res = await API.put('/users/profile', payload);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Profile saved!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-lg">

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step >= s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-1 rounded transition-all ${step > s ? 'bg-green-500' : 'bg-gray-100'}`}/>}
            </div>
          ))}
        </div>

        {/* STEP 1 - Personal Details */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Personal details</h2>
            <p className="text-gray-500 text-sm mb-6">This helps us calculate your nutrition data accurately</p>

            <form onSubmit={handleSubmit(handleStep1)} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Age</label>
                  <input
                    type="number"
                    {...register('age', { required: 'Required', min: { value: 10, message: 'Min 10' }, max: { value: 100, message: 'Max 100' } })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="25"
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Gender</label>
                  <select
                    {...register('gender', { required: 'Required' })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    {...register('weight', { required: 'Required', min: { value: 20, message: 'Min 20kg' } })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="70"
                  />
                  {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    {...register('height', { required: 'Required', min: { value: 100, message: 'Min 100cm' } })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="170"
                  />
                  {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition mt-2"
              >
                Continue →
              </button>
            </form>
          </div>
        )}

        {/* STEP 2 - Diet Type + Deficiencies */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Diet & deficiencies</h2>
            <p className="text-gray-500 text-sm mb-6">We'll personalise all suggestions based on this</p>

            {/* Diet Type */}
            <p className="text-sm font-medium text-gray-700 mb-3">I am</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { id: 'vegetarian', label: 'Vegetarian', icon: '🥦' },
                { id: 'eggetarian', label: 'Eggetarian', icon: '🥚' },
                { id: 'non-vegetarian', label: 'Non-Veg', icon: '🍗' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDietType(d.id)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    dietType === d.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{d.icon}</div>
                  <div className="text-xs font-medium text-gray-700">{d.label}</div>
                </button>
              ))}
            </div>

            {/* Deficiencies */}
            <p className="text-sm font-medium text-gray-700 mb-3">Known deficiencies <span className="text-gray-400 font-normal">(select all that apply)</span></p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {deficiencyOptions.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDeficiency(d.id)}
                  className={`p-2 rounded-xl border-2 text-center transition-all ${
                    selectedDeficiencies.includes(d.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="text-xl mb-1">{d.icon}</div>
                  <div className="text-xs font-medium text-gray-600">{d.label}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleStep2}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 - Summary */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">You're all set! 🎉</h2>
            <p className="text-gray-500 text-sm mb-6">Here's a summary of your profile</p>

            <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Age</span>
                <span className="font-medium text-gray-800">{formData.age} years</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Weight</span>
                <span className="font-medium text-gray-800">{formData.weight} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Height</span>
                <span className="font-medium text-gray-800">{formData.height} cm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium text-gray-800 capitalize">{formData.gender}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Diet type</span>
                <span className="font-medium text-gray-800 capitalize">{dietType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Deficiencies</span>
                <span className="font-medium text-gray-800">
                  {selectedDeficiencies.length === 0 ? 'None selected' : selectedDeficiencies.join(', ')}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Start tracking! 🚀'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;