//frontend/src/Reusable/IDGeneration/ClientList/ClientList.js

import React from 'react';
import './ClientList.css'
const ClientList = ({ clients, toggleStatus, handleDelete }) => {
  return (
    <div className='ClientList-container'>
      <h2 className='ClientList-heading'>Client List</h2>
      <table className='ClientList-table-container'>
        <thead className='ClientList-thead-container'>
          <tr className='ClientList-tr'>
            <th className='ClientList-th'>ID</th>
            <th className='ClientList-th'>Name</th>
            <th className='ClientList-th'>Status</th>
            <th className='ClientList-th'>Actions</th>
          </tr>
        </thead>
        <tbody className='ClientList-tbody'>
          {clients.map((client) => (
            <tr className='ClientList-tr' key={client.id}>
              <td className='ClientList-td'>{client.id}</td>
              <td className='ClientList-td'>{client.name}</td>
              <td className='ClientList-tdButton-container'>
                <button className='ClientList-Status' onClick={() => toggleStatus(client.id)}>
                  {client.status ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className='ClientList-tdDelete-button'>
                <button className='ClientList-delete' onClick={() => handleDelete(client.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
