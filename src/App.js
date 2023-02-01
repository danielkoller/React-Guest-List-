/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

const wrapperStyles = css`
  display: grid;
  justify-content: center;

  h1 {
    text-align: center;
  }

  p {
    text-align: center;
  }

  h2 {
    text-align: center;
  }
`;

const formStyles = css`
  background-color: antiquewhite;
  display: grid;
  width: 400px;
  padding: 40px;
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  text-align: center;

  input {
    width: 100%;
    padding: 10px 0;
    font-size: 16px;
    margin-bottom: 20px;
    border: none;
    border-bottom: 1px solid #fff;
    outline: none;
  }

  label {
    font-weight: 700;
    top: 0;
    left: 0;
    padding: 10px 0;
    font-size: 20px;
    pointer-events: none;
  }

  p {
    font-weight: 700;
    font-size: 20px;
  }
`;

const buttonSectionStyles = css`
  display: flex;
  justify-content: space-evenly;
`;

const primaryButtonStyles = css`
  padding: 8px;
  font-size: large;
  background: #3498db;
  color: #ffffff;
  border-radius: 10px;
  &:hover {
    background: #2980b9;
    color: #ffffff;
  }
`;

const dangerButtonStyles = css`
  padding: 8px;
  font-size: large;
  background: #e74c3c;
  color: #ffffff;
  border-radius: 10px;
  &:hover {
    background: #c0392b;
    color: #ffffff;
  }
`;

const guestStyles = css`
  background-color: antiquewhite;
  justify-content: center;
  padding: 15px;
  display: grid;
  margin: 20px;
  border-style: solid;
  border-radius: 10px;
`;

const checkboxStyles = css`
  justify-self: center;
  margin-bottom: 20%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  height: 28px;
  width: 28px;
  display: block;
  &:after {
    border: 2px solid #fff;
    border-top: none;
    border-right: none;
    content: '';
    height: 6px;
    left: 8px;
    opacity: 0;
    position: absolute;
    top: 9px;
    transform: rotate(-45deg);
    width: 12px;
  }
`;

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
    setRefetch(!refetch);
    setFirstName('');
    setLastName('');

    console.log(createdGuest);
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

  async function deleteGuest(id) {
    await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const response = await fetch(`${baseUrl}/guests`);
    const allGuests = await response.json();
    setGuestAPI(allGuests);
  }

  // Delete all guests

  async function deleteAllGuests() {
    for (const guest of guestAPI) {
      await fetch(`${baseUrl}/guests/${guest.id}`, {
        method: 'DELETE',
      });
    }
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
    <div css={wrapperStyles}>
      <h1>💁 Guest List</h1>
      <form css={formStyles} onSubmit={handleSubmit}>
        <label htmlFor="firstName">First name</label>
        <input
          id="firstName"
          name="firstName"
          value={firstName}
          disabled={isDisabled}
          placeholder="Enter first name here"
          onChange={(event) => setFirstName(event.target.value)}
        />
        <label htmlFor="lastName">Last name</label>
        <input
          id="lastName"
          name="lastName"
          value={lastName}
          disabled={isDisabled}
          placeholder="Enter last name here"
          onChange={(event) => setLastName(event.target.value)}
        />
        <p>Press Enter to submit!</p>
        <div css={buttonSectionStyles}>
          <button css={primaryButtonStyles}>Submit</button>
          <button css={dangerButtonStyles} onClick={deleteAllGuests}>
            Delete all guests
          </button>
        </div>
      </form>
      <div>
        <h2>Guests</h2>
        {guestAPI.map((guest) => {
          return (
            <div key={guest.id}>
              <div css={guestStyles} data-test-id="guest">
                <h3>
                  {guest.firstName} {guest.lastName}
                </h3>
                <input
                  css={checkboxStyles}
                  type="checkbox"
                  aria-label="attending"
                  checked={guest.attending}
                  onChange={(event) =>
                    updateGuest(event.currentTarget.checked, guest.id)
                  }
                />
                <button
                  css={dangerButtonStyles}
                  aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                  onClick={() => deleteGuest(guest.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
