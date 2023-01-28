import { useEffect, useState } from 'react';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestAPI, setGuestAPI] = useState([]);
  const baseUrl =
    'https://express-guest-list-api-memory-data-store.danielkoller3.repl.co';
  const [refetch, setRefetch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  // Enter a new guest

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
    setRefetch(!refetch);
    setFirstName('');
    setLastName('');

    console.log(createdGuest);
    console.log(newGuest);
  }

  // Update a guest

  async function updateGuest(val, guestId) {
    console.log(val, guestId);
    await fetch(`${baseUrl}/guests/${guestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attending: val }),
    });
    setRefetch(!refetch);
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
      setIsLoading(false);
      setIsDisabled(false);
    }

    fetchUsers().catch((error) => console.log(error));
  }, [refetch]);

  // Loading Message

  if (isLoading) {
    return 'Loading...';
  }

  return (
    <div>
      <h1>Guest List</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          name="firstName"
          value={firstName}
          disabled={isDisabled}
          placeholder="First Name"
          onChange={(event) => setFirstName(event.target.value)}
        />
        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          name="lastName"
          value={lastName}
          disabled={isDisabled}
          placeholder="Last Name"
          onChange={(event) => setLastName(event.target.value)}
        />
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
                  updateGuest(event.currentTarget.checked, guest.id)
                }
              />
              <button
                aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                onClick={deleteGuest}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
