const form = document.getElementById('patient-form');
const patientTableBody = document.getElementById('patient-table-body');

// Fetch and display existing patient records
async function fetchAndDisplayPatients() {
  try {
    const response = await fetch('/api/patients');
    const patients = await response.json();

    patients.forEach((patient) => {
      addPatientToTable(patient);
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
}

// Add a new patient record to the table
function addPatientToTable(patient) {
  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  nameCell.textContent = patient.name;
  row.appendChild(nameCell);

  const ageCell = document.createElement('td');
  ageCell.textContent = patient.age;
  row.appendChild(ageCell);

  const genderCell = document.createElement('td');
  genderCell.textContent = patient.gender;
  row.appendChild(genderCell);

  const contactCell = document.createElement('td');
  contactCell.textContent = patient.contact;
  row.appendChild(contactCell);

  const addressCell = document.createElement('td');
  addressCell.textContent = patient.address;
  row.appendChild(addressCell);

  const allergiesCell = document.createElement('td');
  allergiesCell.textContent = patient.allergies;
  row.appendChild(allergiesCell);

  const chronicConditionsCell = document.createElement('td');
  chronicConditionsCell.textContent = patient.chronicConditions;
  row.appendChild(chronicConditionsCell);

  patientTableBody.appendChild(row);
}

// Handle form submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    contact: document.getElementById('contact').value,
    address: document.getElementById('address').value,
    allergies: document.getElementById('allergies').value,
    chronicConditions: document.getElementById('chronic-conditions').value
  };

  try {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const patient = await response.json();
    addPatientToTable(patient);

    form.reset();
  } catch (error) {
    console.error('Error saving patient:', error);
  }
});

fetchAndDisplayPatients();
