import React from 'react';

export default function GuestList() {
  async function fetchUsers() {
    const baseUrl = 'http://localhost:4000';

    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();

    console.log(allGuests);
  }

  fetchUsers();

  return <div>GuestList</div>;
}
