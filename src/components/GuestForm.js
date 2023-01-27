import { useState } from 'react';

export default function GuestForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const baseUrl = 'http://localhost:4000';

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: 'Karl', lastName: 'Horky' }),
    });
    const createdGuest = await response.json();
    const newGuest = { firstName, lastName };
    setFirstName('');
    setLastName('');
    console.log(createdGuest);
    console.log(newGuest);
  }

  return (
    <div>
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
    </div>
  );
}
