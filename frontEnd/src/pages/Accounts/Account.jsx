import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash, Info, Search, RefreshCw } from 'lucide-react';
import CreateAcc from './CreateAcc';
import Accdetails from './AccountDetails';
import {
  createAccount,
  updateAccount,
  deleteAccount,
  fetchAccounts
} from '../../services/accountService';
import Button from '../../components/ui/Button';

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [showCreateAcc, setShowCreateAcc] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [employeeToCreate, setEmployeeToCreate] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedAccount = accounts.find((acc) => acc.staffId === selectedId);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      setError(null);
      const response = await fetchAccounts();
      setAccounts(response.data.result || []);
    } catch (err) {
      console.error('❌ Error fetching accounts:', err);
      setError(err.message || 'Failed to load accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSaveAccount = async (formData) => {
    try {
      const payload = {
        userName: formData.userName,
        roleId: parseInt(formData.roleId),
      };

      if (!editMode && formData.password) {
        payload.password = formData.password;
      }

      if (editMode) {
        await updateAccount(formData.staffId, payload);
      } else {
        await createAccount(formData.staffId, payload);
      }

      await loadAccounts();
      setShowCreateAcc(false);
      setEditMode(false);
      setSelectedId(null);
    } catch (err) {
      console.error('❌ Save failed:', err);
      setError(err.message || 'Failed to save account.');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      setError('Please select an account to delete!');
      return;
    }
    if (window.confirm('Are you sure you want to delete this account?')) {

      try {
        await deleteAccount(selectedId);
        await loadAccounts();
        setSelectedId(null);
      } catch (err) {
        console.error('❌ Delete failed:', err);
        setError(err.message || 'Failed to delete.');
      }
    }
  };

  const handleEdit = () => {
    if (!selectedId) {
      setError('Please select an account to edit!');
      return;
    }
    setEditMode(true);
    setShowCreateAcc(true);
  };

  const filtered = accounts.filter((acc) =>
    acc.userName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <div className="flex-grow w-full px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
              <Button
                onClick={() => {
                  setEditMode(false);
                  setShowCreateAcc(true);
                }}
                className="group flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-300 shadow-lg px-3 py-2 text-sm"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span className="hidden sm:inline">Add</span>
              </Button>

              <Button
                onClick={handleEdit}
                className="group flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105 transition-all duration-300 shadow-lg px-3 py-2 text-sm"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>

              <Button
                onClick={handleDelete}
                className="group flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all duration-300 shadow-lg px-3 py-2 text-sm"
              >
                <Trash className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>

              <Button
                onClick={() => {
                  if (!selectedId) {
                    setError('Please select an account!');
                    return;
                  }
                  setShowDetails(true);
                }}
                className="group flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-lg px-3 py-2 text-sm"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">Details</span>
              </Button>

              <Button
                onClick={loadAccounts}
                className="group flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 transition-all duration-300 shadow-lg px-3 py-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Reload</span>
              </Button>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search account..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-auto">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((acc, index) => (
                <tr
                  key={acc.staffId}
                  onClick={() => setSelectedId(acc.staffId)}
                  className={`cursor-pointer hover:bg-blue-50 ${
                    selectedId === acc.staffId ? 'bg-blue-100 font-semibold' : ''
                  }`}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{acc.userName}</td>
                  <td className="px-4 py-2">{acc.roleId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        {showCreateAcc && (
          <CreateAcc
            account={editMode ? selectedAccount : employeeToCreate}
            onClose={() => {
              setShowCreateAcc(false);
              setEditMode(false);
              setEmployeeToCreate(null);
            }}
            onSave={handleSaveAccount}
          />
        )}
        {showDetails && (
          <Accdetails
            onSelect={(employee) => {
              setEmployeeToCreate({
                staffId: employee.id,
                userName: '',
                roleId: '2',
              });
              setShowDetails(false);
              setShowCreateAcc(true);
            }}
            onClose={() => setShowDetails(false)}
          />
        )}
      </div>
    </div>
  );
}
