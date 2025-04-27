const express = require("express");
const router = express.Router();
const mysql = require("mysql2");




const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "earist_hris",
});




router.get('/person_table', (req, res) => {
  const query = 'SELECT * FROM person_table';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send(result);
  });
});




router.post('/person_table', (req, res) => {
  const {
    firstName, middleName, lastName, nameExtension, birthDate, placeOfBirth, sex, civilStatus, citizenship, heightCm, weightKg, bloodType,
    gsisNum, pagibigNum, philhealthNum, sssNum, tinNum, agencyEmployeeNum,
    permanent_houseBlockLotNum, permanent_streetName, permanent_subdivisionOrVillage, permanent_barangay, permanent_cityOrMunicipality,
    permanent_provinceName, permanent_zipcode, residential_houseBlockLotNum, residential_streetName, residential_subdivisionOrVillage, residential_barangayName,
    residential_cityOrMunicipality, residential_provinceName, residential_zipcode, telephone, mobileNum, emailAddress,
    spouseFirstName, spouseMiddleName, spouseLastName, spouseNameExtension,
    spouseOccupation, spouseEmployerBusinessName, spouseBusinessAddress, spouseTelephone,
    fatherFirstName, fatherMiddleName, fatherLastName, fatherNameExtension,
    motherMaidenFirstName, motherMaidenMiddleName, motherMaidenLastName,
    elementaryNameOfSchool, elementaryDegree, elementaryPeriodFrom, elementaryPeriodTo,
    elementaryHighestAttained, elementaryYearGraduated, elementaryScholarshipAcademicHonorsReceived,
    secondaryNameOfSchool, secondaryDegree, secondaryPeriodFrom, secondaryPeriodTo,
    secondaryHighestAttained, secondaryYearGraduated, secondaryScholarshipAcademicHonorsReceived
  } = req.body;




  const query = 'INSERT INTO person_table (firstName, middleName, lastName, nameExtension, birthDate, placeOfBirth, sex, civilStatus, citizenship, heightCm, weightKg, bloodType, gsisNum, pagibigNum, philhealthNum, sssNum, tinNum, agencyEmployeeNum, permanent_houseBlockLotNum, permanent_streetName, permanent_subdivisionOrVillage, permanent_barangay, permanent_cityOrMunicipality, permanent_provinceName, permanent_zipcode, residential_houseBlockLotNum, residential_streetName, residential_subdivisionOrVillage, residential_barangayName, residential_cityOrMunicipality, residential_provinceName, residential_zipcode, telephone, mobileNum, emailAddress, spouseFirstName, spouseMiddleName, spouseLastName, spouseNameExtension, spouseOccupation, spouseEmployerBusinessName, spouseBusinessAddress, spouseTelephone, fatherFirstName, fatherMiddleName, fatherLastName, fatherNameExtension, motherMaidenFirstName, motherMaidenMiddleName, motherMaidenLastName, elementaryNameOfSchool, elementaryDegree, elementaryPeriodFrom, elementaryPeriodTo, elementaryHighestAttained, elementaryYearGraduated, elementaryScholarshipAcademicHonorsReceived, secondaryNameOfSchool, secondaryDegree, secondaryPeriodFrom, secondaryPeriodTo, secondaryHighestAttained, secondaryYearGraduated, secondaryScholarshipAcademicHonorsReceived) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';




  db.query(query, [firstName, middleName, lastName, nameExtension, birthDate, placeOfBirth, sex, civilStatus, citizenship, heightCm, weightKg, bloodType, gsisNum, pagibigNum, philhealthNum, sssNum, tinNum, agencyEmployeeNum, permanent_houseBlockLotNum, permanent_streetName, permanent_subdivisionOrVillage, permanent_barangay, permanent_cityOrMunicipality, permanent_provinceName, permanent_zipcode, residential_houseBlockLotNum, residential_streetName, residential_subdivisionOrVillage, residential_barangayName, residential_cityOrMunicipality, residential_provinceName, residential_zipcode, telephone, mobileNum, emailAddress, spouseFirstName, spouseMiddleName, spouseLastName, spouseNameExtension, spouseOccupation, spouseEmployerBusinessName, spouseBusinessAddress, spouseTelephone, fatherFirstName, fatherMiddleName, fatherLastName, fatherNameExtension, motherMaidenFirstName, motherMaidenMiddleName, motherMaidenLastName, elementaryNameOfSchool, elementaryDegree, elementaryPeriodFrom, elementaryPeriodTo, elementaryHighestAttained, elementaryYearGraduated, elementaryScholarshipAcademicHonorsReceived, secondaryNameOfSchool, secondaryDegree, secondaryPeriodFrom, secondaryPeriodTo, secondaryHighestAttained, secondaryYearGraduated, secondaryScholarshipAcademicHonorsReceived], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).send({ message: 'Person record created', id: result.insertId });
  });
});




router.put('/person_table/:id', (req, res) => {
  const { id } = req.params;
  const {
    firstName, middleName, lastName, nameExtension, birthDate, placeOfBirth, sex, civilStatus, citizenship, heightCm, weightKg, bloodType,
    gsisNum, pagibigNum, philhealthNum, sssNum, tinNum, agencyEmployeeNum,
    permanent_houseBlockLotNum, permanent_streetName, permanent_subdivisionOrVillage, permanent_barangay, permanent_cityOrMunicipality,
    permanent_provinceName, permanent_zipcode, residential_houseBlockLotNum, residential_streetName, residential_subdivisionOrVillage, residential_barangayName,
    residential_cityOrMunicipality, residential_provinceName, residential_zipcode, telephone, mobileNum, emailAddress,
    spouseFirstName, spouseMiddleName, spouseLastName, spouseNameExtension,
    spouseOccupation, spouseEmployerBusinessName, spouseBusinessAddress, spouseTelephone,
    fatherFirstName, fatherMiddleName, fatherLastName, fatherNameExtension,
    motherMaidenFirstName, motherMaidenMiddleName, motherMaidenLastName,
    elementaryNameOfSchool, elementaryDegree, elementaryPeriodFrom, elementaryPeriodTo,
    elementaryHighestAttained, elementaryYearGraduated, elementaryScholarshipAcademicHonorsReceived,
    secondaryNameOfSchool, secondaryDegree, secondaryPeriodFrom, secondaryPeriodTo,
    secondaryHighestAttained, secondaryYearGraduated, secondaryScholarshipAcademicHonorsReceived
  } = req.body;




  const query = 'UPDATE person_table SET firstName = ?, middleName = ?, lastName = ?, nameExtension = ?, birthDate = ?, placeOfBirth = ?, sex = ?, civilStatus = ?, citizenship = ?, heightCm = ?, weightKg = ?, bloodType = ?, gsisNum = ?, pagibigNum = ?, philhealthNum = ?, sssNum = ?, tinNum = ?, agencyEmployeeNum = ?, permanent_houseBlockLotNum = ?, permanent_streetName = ?, permanent_subdivisionOrVillage = ?, permanent_barangay = ?, permanent_cityOrMunicipality = ?, permanent_provinceName = ?, permanent_zipcode = ?, residential_houseBlockLotNum = ?, residential_streetName = ?, residential_subdivisionOrVillage = ?, residential_barangayName = ?, residential_cityOrMunicipality = ?, residential_provinceName = ?, residential_zipcode = ?, telephone = ?, mobileNum = ?, emailAddress = ?, spouseFirstName = ?, spouseMiddleName = ?, spouseLastName = ?, spouseNameExtension = ?, spouseOccupation = ?, spouseEmployerBusinessName = ?, spouseBusinessAddress = ?, spouseTelephone = ?, fatherFirstName = ?, fatherMiddleName = ?, fatherLastName = ?, fatherNameExtension = ?, motherMaidenFirstName = ?, motherMaidenMiddleName = ?, motherMaidenLastName = ?, elementaryNameOfSchool = ?, elementaryDegree = ?, elementaryPeriodFrom = ?, elementaryPeriodTo = ?, elementaryHighestAttained = ?, elementaryYearGraduated = ?, elementaryScholarshipAcademicHonorsReceived = ?, secondaryNameOfSchool = ?, secondaryDegree = ?, secondaryPeriodFrom = ?, secondaryPeriodTo = ?, secondaryHighestAttained = ?, secondaryYearGraduated = ?, secondaryScholarshipAcademicHonorsReceived = ? WHERE id = ?';




  db.query(query, [firstName, middleName, lastName, nameExtension, birthDate, placeOfBirth, sex, civilStatus, citizenship, heightCm, weightKg, bloodType, gsisNum, pagibigNum, philhealthNum, sssNum, tinNum, agencyEmployeeNum, permanent_houseBlockLotNum, permanent_streetName, permanent_subdivisionOrVillage, permanent_barangay, permanent_cityOrMunicipality, permanent_provinceName, permanent_zipcode, residential_houseBlockLotNum, residential_streetName, residential_subdivisionOrVillage, residential_barangayName, residential_cityOrMunicipality, residential_provinceName, residential_zipcode, telephone, mobileNum, emailAddress, spouseFirstName, spouseMiddleName, spouseLastName, spouseNameExtension, spouseOccupation, spouseEmployerBusinessName, spouseBusinessAddress, spouseTelephone, fatherFirstName, fatherMiddleName, fatherLastName, fatherNameExtension, motherMaidenFirstName, motherMaidenMiddleName, motherMaidenLastName, elementaryNameOfSchool, elementaryDegree, elementaryPeriodFrom, elementaryPeriodTo, elementaryHighestAttained, elementaryYearGraduated, elementaryScholarshipAcademicHonorsReceived, secondaryNameOfSchool, secondaryDegree, secondaryPeriodFrom, secondaryPeriodTo, secondaryHighestAttained, secondaryYearGraduated, secondaryScholarshipAcademicHonorsReceived, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send({ message: 'Person record updated' });
  });
});




router.delete('/person_table/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM person_table WHERE id = ?';
 
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send({ message: 'Person record deleted' });
  });
});




module.exports = router;









