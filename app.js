const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Function to calculate numerology number
function calculateLifePathNumber(date) {
  const digits = date.replace(/[^0-9]/g, '');
  let sum = 0;
  for (const digit of digits) {
    sum += parseInt(digit, 10);
  }
  return reduceToSingleDigit(sum);
}

// Function to reduce a number to a single digit
function reduceToSingleDigit(num) {
  while (num > 9) {
    num = num.toString().split('').reduce((acc, val) => acc + parseInt(val, 10), 0);
  }
  return num;
}

// Function to calculate the numerology number for a name
function calculateNameNumber(name) {
  const letterValues = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9
  };

  let sum = 0;
  for (const letter of name.toUpperCase().replace(/[^A-Z]/g, '')) {
    sum += letterValues[letter] || 0;
  }

  return reduceToSingleDigit(sum);
}

// Route to calculate numerology for a person and optionally their partner
app.post('/calculate-numerology', (req, res) => {
  const { person, partner } = req.body;
  
  if (!person || !person.name || !person.birthDate || !person.city) {
    return res.status(400).json({ error: "Person's name, birthDate, and city are required." });
  }

  // Calculate numerology for the main person
  const personLifePathNumber = calculateLifePathNumber(person.birthDate);
  const personNameNumber = calculateNameNumber(person.name);

  // Prepare response for the main person
  const response = {
    person: {
      name: person.name,
      birthDate: person.birthDate,
      city: person.city,
      lifePathNumber: personLifePathNumber,
      nameNumber: personNameNumber
    }
  };

  // Calculate numerology for the partner, if provided
  if (partner && partner.name && partner.birthDate && partner.city) {
    const partnerLifePathNumber = calculateLifePathNumber(partner.birthDate);
    const partnerNameNumber = calculateNameNumber(partner.name);

    response.partner = {
      name: partner.name,
      birthDate: partner.birthDate,
      city: partner.city,
      lifePathNumber: partnerLifePathNumber,
      nameNumber: partnerNameNumber
    };
  }

  res.json(response);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
