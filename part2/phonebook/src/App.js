import { useState } from "react";

import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filter, setFilter] = useState("");

	const addPerson = (event) => {
		event.preventDefault();
		const personObject = {
			name: newName,
			id: newName,
			number: newNumber,
		};

		persons.map((person) => person.name).includes(newName)
			? alert(`${newName} already in phonebook`)
			: setPersons(persons.concat(personObject));
		setNewName("");
		setNewNumber("");
	};

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilter(event.target.value);
	};

	return (
		<div>
			<h2>Phonebook</h2>

			<Filter onChange={handleFilterChange} filter={filter} />

			<h3>Add a new</h3>

			<PersonForm
				onSubmit={addPerson}
				onNameChange={handleNameChange}
				onNumberChange={handleNumberChange}
				newName={newName}
				newNumber={newNumber}
			/>

			<h3>Numbers</h3>

			<Persons persons={persons} filter={filter} />
		</div>
	);
};

export default App;
