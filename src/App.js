import { useEffect, useState } from 'react';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestAPI, setGuestAPI] = useState([]);
  const baseUrl = 'http://localhost:4000';
  const [refresh, setRefresh] = useState(false);

  // Enter the Guests

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });
    const createdGuest = await response.json();
    const newGuest = { firstName, lastName };
    setRefresh(!refresh);
    setFirstName('');
    setLastName('');

    console.log(createdGuest);
    console.log(newGuest);
  }

  // Update a guest

  async function guestUpdate(checkval, guestId) {
    console.log(checkval, guestId);
    await fetch(`${'http://localhost:4000'}/guests/${guestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attending: checkval }),
    });
    setRefresh(!refresh);
  }
  // Delete a guest

  async function deleteGuest() {
    await fetch(`${baseUrl}/guests/${guestAPI[0]['id']}`, {
      method: 'DELETE',
    });
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuestAPI(allGuests);
  }

  // Show the Guests

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      setGuestAPI(allGuests);
      console.log(allGuests);
    }

    fetchUsers().catch((error) => console.log(error));
  }, [refresh]);

  return (
    <div>
      <h1>Guest List</h1>
      <form onSubmit={handleSubmit}>
        <label id="firstName" htmlFor="firstName">
          First Name:
          <input
            value={firstName}
            placeholder="First Name"
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>
        <label id="lastName" htmlFor="lastName">
          Last Name:
          <input
            value={lastName}
            placeholder="Last Name"
            onChange={(event) => setLastName(event.target.value)}
          />
        </label>
        <p>Press Enter to submit!</p>
        <button>Submit</button>
      </form>
      <div>
        <h2>Names</h2>
        {guestAPI.map((guest) => {
          return (
            <div key={guest.id}>
              <div data-test-id="guest">
                {guest.firstName} {guest.lastName}
              </div>
              <input
                type="checkbox"
                aria-label={`${guest.firstName} ${guest.lastName} attending:${guest.attending}`}
                checked={guest.attending}
                onChange={(event) =>
                  guestUpdate(event.currentTarget.checked, guest.id)
                }
              />
              <button onClick={deleteGuest}>Remove</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
