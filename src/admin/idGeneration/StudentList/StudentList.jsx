//frontend/src/Reusable/IDGeneration/StudentList/StudentList.js

import React from 'react';
import './StudentList.css'

const StudentList = ({ students, toggleStatus, handleDelete }) => {
  return (
    <div className='StudentList-container'>
      <h2 className='StudentList-heading'>Student List</h2>
      <table className='StudentList-table-container'>
        <thead className='StudentList-thead-container'>
          <tr className='StudentList-tr-container'>
            <th className='StudentList-titile'>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='StudentList-tbody'>
          {students.map((student) => (
            <tr className='StudentList-tr' key={student.id}>
              <td className='StudentList-td'>{student.id}</td>
              <td className='StudentList-td'>{student.name}</td>
              <td className='StudentList-td'>
                <button className='StudentList-status-button' onClick={() => toggleStatus(student.id)}>
                  {student.status ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className='StudentList-delete-button'>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
