import React, { useState } from 'react';

const mockEmployees = [
  { id: 4, name: 'Nguyen Cong Phuong', gender: 'Male', dob: '1997-04-22', phone: '0144778523', email: 'phuongcn10@gmail.com' },
  { id: 5, name: 'Pham Hoang Khoa', gender: 'Male', dob: '1990-07-01', phone: '0789412563', email: 'karik0karik@gmail.com' },
  { id: 6, name: 'Nguyen Hoang Ly', gender: 'Female', dob: '1998-04-20', phone: '0741258963', email: 'lylyofficial@gmail.com' },
  { id: 7, name: 'Tran Minh Hieu', gender: 'Male', dob: '1999-10-19', phone: '0178546329', email: 'hieuthuhai@gmail.com' },
  { id: 8, name: 'Ngo Dang Thu Giang', gender: 'Female', dob: '1993-01-04', phone: '0148523697', email: 'sunyHaLinh@gmail.com' },
];
export default function Accdetails({ onSelect, onClose }) {
  const [search, setSearch] = useState('');

  const filtered = mockEmployees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">Select Employee</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✖</button>
        </div>
        <div className="mb-3 flex gap-2">
          <input
            placeholder="Search employee..."
            className="flex-1 border border-gray-300 px-3 py-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 rounded">Select</button>
        </div>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th><th>Full Name</th><th>Gender</th><th>Date of Birth</th><th>Phone</th><th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => onSelect(e)}>
                <td>{e.id}</td><td>{e.name}</td><td>{e.gender}</td><td>{e.dob}</td><td>{e.phone}</td><td>{e.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
