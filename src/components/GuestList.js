import React, { useEffect, useState } from 'react';

const baseUrl = 'http://localhost:4000';
export default function GuestList() {
  const [guestAPI, setGuestAPI] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuestAPI(allGuests);
      console.log(allGuests);
    }

    fetchUsers().catch((error) => console.log(error));
  }, []);
  return (
    <div>
      <h1>Names</h1>
      {guestAPI.map((guest) => {
        return (
          <div key={guest.id}>
            <div data-test-id="guest">
              {guest.firstName} {guest.lastName}
            </div>
            <input type="checkbox" aria-label="" />
            <button>Remove</button>
          </div>
        );
      })}
    </div>
  );
}
