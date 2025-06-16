'use client';

import React, { useState, useEffect } from 'react';
import {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from '../../api/employeeApi';

export default function Staff() {
  const [staffs, setStaffs] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getAllEmployees();
      setStaffs(data);
      setSelectedStaffId(null); // clear selection on reload
    } catch (error) {
      setError('Failed to load staff data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    const full_name = prompt('Enter full name:');
    const gender = prompt('Enter gender (Male/Female):');
    const phone_number = prompt('Enter phone number:');
    const email = prompt('Enter email:');

    if (!full_name || !gender || !phone_number || !email) {
      setError('All fields are required for adding staff.');
      return;
    }

    const newStaff = {
      staff_id: Date.now().toString(), // temporary ID for demo
      full_name,
      gender,
      phone_number,
      email,
    };

    try {
      await addEmployee(newStaff);
      fetchStaffs();
    } catch (error) {
      setError('Failed to add staff.');
    }
  };

  const handleUpdate = async () => {
    if (!selectedStaffId) {
      setError('Please select a staff to update.');
      return;
    }

    const staff = staffs.find((s) => s.staff_id === selectedStaffId);
    if (!staff) {
      setError('Selected staff not found.');
      return;
    }

    const full_name = prompt('Enter new full name:', staff.full_name);
    const gender = prompt('Enter new gender:', staff.gender);
    const phone_number = prompt('Enter new phone number:', staff.phone_number);
    const email = prompt('Enter new email:', staff.email);

    const updatedStaff = {
      full_name,
      gender,
      phone_number,
      email,
      status: staff.status,
    };

    try {
      await updateEmployee(selectedStaffId, updatedStaff);
      fetchStaffs();
    } catch (error) {
      setError('Failed to update staff.');
    }
  };

  const handleDelete = async () => {
    if (!selectedStaffId) {
      setError('Please select a staff to delete.');
      return;
    }

    const staff = staffs.find((s) => s.staff_id === selectedStaffId);
    if (!staff) {
      setError('Selected staff not found.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${staff.full_name}?`)) {
      try {
        await deleteEmployee(selectedStaffId);
        fetchStaffs();
      } catch (error) {
        setError('Failed to delete staff.');
      }
    }
  };

  const filteredStaffs = staffs.filter((staff) =>
    [staff.full_name, staff.staff_id, staff.phone_number, staff.email]
      .filter(Boolean)
      .some((field) =>
        field.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold"
            onClick={handleAdd}
          >
            Add
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold"
            onClick={handleUpdate}
          >
            Update
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded font-bold"
            onClick={() => alert('Details not implemented yet')}
          >
            Details
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded font-bold"
            onClick={fetchStaffs}
          >
            Reload
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading staff data...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-md overflow-hidden text-center">
            <thead className="bg-gray-100 text-black font-semibold">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaffs.map((staff) => (
                <tr
                  key={staff.staff_id}
                  onClick={() => setSelectedStaffId(staff.staff_id)}
                  className={`hover:bg-blue-100 cursor-pointer ${
                    selectedStaffId === staff.staff_id
                      ? 'bg-blue-200 font-semibold'
                      : ''
                  }`}
                >
                  <td className="px-4 py-2">{staff.staff_id}</td>
                  <td className="px-4 py-2">{staff.full_name}</td>
                  <td className="px-4 py-2">{staff.gender}</td>
                  <td className="px-4 py-2">{staff.phone_number}</td>
                  <td className="px-4 py-2">{staff.email}</td>
                  <td className="px-4 py-2">
                    {staff.status ? 'Active' : 'Inactive'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
