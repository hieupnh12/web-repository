import React, { useState, useEffect, startTransition } from 'react';
import Accdetails from './AccountDetails';
import CreateAcc from './CreateAcc';
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from '../../api/accountApi';

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [showCreateAcc, setShowCreateAcc] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [employeeToCreate, setEmployeeToCreate] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [error, setError] = useState(null);

  const selectedAccount = accounts.find((acc) => acc.staffId === selectedId);

  const loadAccounts = async () => {
    try {
      setError(null);
      const response = await fetchAccounts();
      startTransition(() => {
        setAccounts(response);
      });
    } catch (error) {
      console.error('❌ Failed to fetch accounts:', error);
      setError(error.message || 'Failed to fetch accounts.');
      if (error.message.includes('Unauthenticated')) {
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSaveAccount = async (newData) => {
    try {
      setError(null);
      const payload = {
        staffId: newData.staffId,
        userName: newData.userName,
        password: newData.password || '',
        role: { id: parseInt(newData.roleId) },
        status: newData.status,
      };

      if (editMode) {
        await updateAccount(newData.staffId, payload);
      } else {
        await createAccount(newData.staffId, payload);
      }
      await loadAccounts();
    } catch (err) {
      console.error('❌ Failed to save account:', err);
      setError(err.message || 'Failed to save account.');
    }

    setShowCreateAcc(false);
    setEditMode(false);
    setSelectedId(null);
    setEmployeeToCreate(null);
  };

  const handleDelete = async () => {
    if (!selectedId) {
      setError('Please select an account to delete!');
      return;
    }
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        setError(null);
        await deleteAccount(selectedId);
        await loadAccounts();
        setSelectedId(null);
      } catch (error) {
        console.error('❌ Failed to delete:', error);
        setError(error.message || 'Failed to delete account.');
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

  const filteredAccounts = accounts.filter((acc) => {
    const matchRole = filterRole === 'All' || acc.role?.id === parseInt(filterRole);
    const matchSearch =
      acc.userName?.toLowerCase().includes(search.toLowerCase()) ||
      acc.staffId?.toString().toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
          {error.includes('Unauthenticated') && (
            <button
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <button
            onClick={() => {
              setEditMode(false);
              setShowDetails(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold"
          >
            Add
          </button>
          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold"
          >
            Delete
          </button>
          <button
            onClick={() => {
              if (!selectedId) {
                setError('Please select an account!');
                return;
              }
              setShowDetails(true);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-bold"
          >
            Details
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="border rounded px-3 py-2"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All</option>
            <option value="1">Admin</option>
            <option value="2">Staff</option>
            <option value="3">Manager</option>
          </select>

          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded font-bold"
            onClick={loadAccounts}
          >
            Reload
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-md overflow-hidden text-center">
          <thead className="bg-gray-100 text-black font-semibold">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAccounts.map((acc) => (
              <tr
                key={acc.staffId}
                className={`hover:bg-blue-50 cursor-pointer ${
                  selectedId === acc.staffId ? 'bg-blue-100 font-bold' : ''
                }`}
                onClick={() => setSelectedId(acc.staffId)}
              >
                <td className="px-4 py-2">{acc.staffId}</td>
                <td className="px-4 py-2">{acc.userName}</td>
                <td className="px-4 py-2">{acc.role?.name || 'N/A'}</td>
                <td className="px-4 py-2">{acc.status ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              status: true,
              password: '',
              staff: employee,
            });
            setShowDetails(false);
            setShowCreateAcc(true);
          }}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}