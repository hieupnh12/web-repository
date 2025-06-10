import React, { useState } from 'react';
import Accdetails from './Accdetails';
import CreateAcc from './CreateAcc';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const mockAccounts = [
  { id: 1, username: 'sinh', role: 'Admin', status: 'Active' },
  { id: 2, username: 'baopro', role: 'Admin', status: 'Active' },
  { id: 3, username: 'nam', role: 'Admin', status: 'Active' }
];

export default function Acclist() {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [showCreateAcc, setShowCreateAcc] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [employeeToCreate, setEmployeeToCreate] = useState(null);


  const selectedAccount = accounts.find(acc => acc.id === selectedId);

  const handleSaveAccount = (newData) => {
    if (editMode) {
      setAccounts(prev =>
        prev.map(acc => (acc.id === newData.id ? newData : acc))
      );
    } else {
      const newId = Math.max(0, ...accounts.map(acc => acc.id)) + 1;
      setAccounts([...accounts, { ...newData, id: newId }]);
    }
    setShowCreateAcc(false);
    setEditMode(false);
    setSelectedId(null);
  };

  const handleDelete = () => {
    if (!selectedId) return alert('Please select an account to delete!');
    const confirm = window.confirm('Are you sure you want to delete this account?');
    if (confirm) {
      setAccounts(accounts.filter(acc => acc.id !== selectedId));
      setSelectedId(null);
    }
  };

  const handleEdit = () => {
    if (!selectedId) return alert('Please select an account to edit!');
    setEditMode(true);
    setShowCreateAcc(true);
  };

  const handleExportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(accounts);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(data, 'account_list.xlsx');
  };

  return (
    <div className="p-4">
      {/* Header Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={() => {
            setEditMode(false);
            setShowDetails(true);  // ✅ mở bảng nhân viên thay vì CreateAcc
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold"
        >
        ADD
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold"
        >
          DELETE
        </button>
        <button
          onClick={handleEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold"
        >
          EDIT
        </button>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-bold"
        >
          DETAILS
        </button>
        
        <button
          onClick={handleExportExcel}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded font-bold"
          >
          EXPORT EXCEL
        </button>
        

        <div className="ml-auto flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 border rounded w-60 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded font-bold">Refresh</button>
        </div>
      </div>

      {/* Table */}
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
            {accounts.map(acc => (
              <tr
                key={acc.id}
                className={`hover:bg-blue-50 cursor-pointer ${selectedId === acc.id ? 'bg-blue-100 font-bold' : ''}`}
                onClick={() => setSelectedId(acc.id)}
              >
                <td className="px-4 py-2">{acc.id}</td>
                <td className="px-4 py-2">{acc.username}</td>
                <td className="px-4 py-2">{acc.role}</td>
                <td className="px-4 py-2">{acc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Account Modal */}
      {showCreateAcc && (
        <CreateAcc
          account={editMode ? selectedAccount : employeeToCreate}
            onClose={() => {
              setShowCreateAcc(false);
              setEditMode(false);
              setEmployeeToCreate(null); // reset sau khi dùng
            }}
          onSave={handleSaveAccount}
        />
      )}


      {/* Account Details Modal */}
      {showDetails && (
        <Accdetails
          onSelect={(employee) => {
            setEmployeeToCreate({
              username: employee.name || '',
              role: 'Staff',
              status: 'Active',
              password: ''
            });
          setShowDetails(false);
          setShowCreateAcc(true); // mở form tạo tài khoản luôn
          }}
        onClose={() => setShowDetails(false)}
        />
      )}

      
    </div>
  );
}
