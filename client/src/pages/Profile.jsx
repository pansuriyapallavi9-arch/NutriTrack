import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      age: user?.age || '',
      weight: user?.weight || '',
      height: user?.height || '',
      gender: user?.gender || '',
    }
  });
  const [loading, setLoading] = useState(false);
  const [dietType, setDietType] = useState(user?.dietType || '');
  const [selectedDeficiencies, setSelectedDeficiencies] = useState(user?.deficiencies || []);

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

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await API.put('/users/profile', {
        ...data,
        dietType,
        deficiencies: selectedDeficiencies,
        isOnboarded: true
      });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Your profile</h2>
        <p className="text-gray-500 text-sm mb-6">Update your health details and preferences</p>

        {/* User card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Personal details */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm font-medium text-gray-700 mb-4">Personal details</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Age</label>
                <input
                  type="number"
                  {...register('age', { required: true })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  {...register('weight')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  {...register('height')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Diet type */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Diet type</p>
            <div className="grid grid-cols-3 gap-3">
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
          </div>

          {/* Deficiencies */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">My deficiencies</p>
            <div className="grid grid-cols-4 gap-2">
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;