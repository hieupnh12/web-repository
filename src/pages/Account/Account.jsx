import React, { useState, useEffect } from 'react';
import Accdetails from './AccountDetails';
import CreateAcc from './CreatAcc';
import {
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount
} from '../../api/accountApi';

export default function Account() {
  const [accounts, setAccounts] = useState([]);
  const [showCreateAcc, setShowCreateAcc] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [employeeToCreate, setEmployeeToCreate] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const selectedAccount = accounts.find(acc => acc.staffId === selectedId);

  const fetchData = async () => {
    try {
      const response = await fetchAccounts();
      setAccounts(response);
    } catch (error) {
      console.error("❌ Failed to fetch accounts:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAccount = async (newData) => {
    try {
      const payload = {
        staffId: newData.staffId,
        userName: newData.userName,
        password: newData.password,
        role: { id: newData.roleId },
        status: newData.status
      };

      if (editMode) {
        await updateAccount(newData.staffId, payload);
      } else {
        await createAccount(newData.staffId, payload);
      }
      fetchData();
    } catch (err) {
      console.error("❌ Failed to save account:", err);
    }

    setShowCreateAcc(false);
    setEditMode(false);
    setSelectedId(null);
    setEmployeeToCreate(null);
  };

  const handleDelete = async () => {
    if (!selectedId) return alert('Please select an account to delete!');
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(selectedId);
        fetchData();
        setSelectedId(null);
      } catch (error) {
        console.error("❌ Failed to delete:", error);
      }
    }
  };

  const handleEdit = () => {
    if (!selectedId) return alert('Please select an account to edit!');
    setEditMode(true);
    setShowCreateAcc(true);
  };

  const filteredAccounts = accounts.filter(acc => {
    const matchRole = filterRole === 'All' || acc.role?.id === filterRole;
    const matchSearch =
      acc.userName.toLowerCase().includes(search.toLowerCase()) ||
      acc.staffId.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="p-4">
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
              if (!selectedId) return alert("Please select an account!");
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
            <option value="1">Staff</option>
            <option value="2">Manager</option>
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
            onClick={fetchData}
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
            {filteredAccounts.map(acc => (
              <tr
                key={acc.staffId}
                className={`hover:bg-blue-50 cursor-pointer ${selectedId === acc.staffId ? 'bg-blue-100 font-bold' : ''}`}
                onClick={() => setSelectedId(acc.staffId)}
              >
                <td className="px-4 py-2">{acc.staffId}</td>
                <td className="px-4 py-2">{acc.userName}</td>
                <td className="px-4 py-2">{acc.role?.name}</td>
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
              userName: employee.name,
              roleId: '2',
              status: true,
              password: ''
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
