import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, Container
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Save as SaveIcon, Cancel as CancelIcon
} from '@mui/icons-material';

const Vocational = () => {
  const [vocationalData, setVocationalData] = useState([]);
  const [newVocational, setNewVocational] = useState({
    vocationalNameOfSchool: '',
    vocationalDegree: '',
    vocationalPeriodFrom: '',
    vocationalPeriodTo: '',
    vocationalHighestAttained: '',
    vocationalYearGraduated: '',
    person_id: ''
  });
  const [editingVocationalId, setEditingVocationalId] = useState(null);
  const [editVocationalData, setEditVocationalData] = useState({});

  useEffect(() => {
    fetchVocationalData();
  }, []);

  const fetchVocationalData = async () => {
    try {
      const result = await axios.get('http://localhost:5000/vocational/vocational-table');
      setVocationalData(result.data);
    } catch (error) {
      console.error('Error fetching vocational data:', error);
    }
  };

  const handleAddVocational = async () => {
    try {
      await axios.post('http://localhost:5000/vocational/vocational-table', newVocational);
      fetchVocationalData();
      setNewVocational({
        vocationalNameOfSchool: '',
        vocationalDegree: '',
        vocationalPeriodFrom: '',
        vocationalPeriodTo: '',
        vocationalHighestAttained: '',
        vocationalYearGraduated: '',
        person_id: ''
      });
    } catch (error) {
      console.error('Error adding vocational data:', error);
    }
  };

  const updateVocational = async () => {
    try {
      await axios.put(`http://localhost:5000/vocational/vocational-table/${editingVocationalId}`, editVocationalData);
      setEditingVocationalId(null);
      fetchVocationalData();
    } catch (error) {
      console.error('Failed to update vocational data:', error);
    }
  };

  const deleteVocational = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/vocational/vocational-table/${id}`);
      fetchVocationalData();
    } catch (error) {
      console.error('Error deleting vocational data:', error);
    }
  };

  return (
    <Container style={{ marginTop: '20px', backgroundColor: '#FEF9E1', padding: '20px', borderRadius: '10px' }}>
      {/* Header Section */}
      <div
        style={{
          backgroundColor: '#6D2323',
          color: '#FEF9E1',
          padding: '10px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h1>Vocational Information Dashboard</h1>
      </div>

      {/* Add New Vocational Form Box */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px'
        }}
      >
        <h3 style={{ color: '#6D2323' }}>Add New Vocational Information</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {[
            { label: 'School', key: 'vocationalNameOfSchool' },
            { label: 'Degree', key: 'vocationalDegree' },
            { label: 'From Year', key: 'vocationalPeriodFrom' },
            { label: 'To Year', key: 'vocationalPeriodTo' },
            { label: 'Highest Attained', key: 'vocationalHighestAttained' },
            { label: 'Year Graduated', key: 'vocationalYearGraduated' },
            { label: 'Person ID', key: 'person_id' },
          ].map(({ label, key }) => (
            <TextField
              key={key}
              label={label}
              value={newVocational[key]}
              onChange={(e) => setNewVocational({ ...newVocational, [key]: e.target.value })}
              style={{ width: '324px' }}
            />
          ))}
        </div>
        <Button
          onClick={handleAddVocational}
          variant="contained"
          style={{ backgroundColor: '#6D2323', color: '#FEF9E1', marginTop: '20px', width: '100%' }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>

      {/* Vocational Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>School</TableCell>
            <TableCell>Degree</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Highest Attained</TableCell>
            <TableCell>Year Graduated</TableCell>
            <TableCell>Person ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vocationalData.map((voc) => (
            <TableRow key={voc.id}>
              {editingVocationalId === voc.id ? (
                <>
                  <TableCell>{voc.id}</TableCell>
                  {[
                    'vocationalNameOfSchool', 'vocationalDegree', 'vocationalPeriodFrom',
                    'vocationalPeriodTo', 'vocationalHighestAttained',
                    'vocationalYearGraduated', 'person_id'
                  ].map((key) => (
                    <TableCell key={key}>
                      <TextField
                        value={editVocationalData[key]}
                        onChange={(e) => setEditVocationalData({ ...editVocationalData, [key]: e.target.value })}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      onClick={updateVocational}
                      variant="contained"
                      style={{ backgroundColor: '#6D2323', color: '#FEF9E1', marginBottom: '5px', width: '100px' }}
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingVocationalId(null)}
                      variant="contained"
                      style={{ backgroundColor: 'black', color: 'white', marginLeft: '10px', width: '100px' }}
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{voc.id}</TableCell>
                  <TableCell>{voc.vocationalNameOfSchool}</TableCell>
                  <TableCell>{voc.vocationalDegree}</TableCell>
                  <TableCell>{voc.vocationalPeriodFrom}</TableCell>
                  <TableCell>{voc.vocationalPeriodTo}</TableCell>
                  <TableCell>{voc.vocationalHighestAttained}</TableCell>
                  <TableCell>{voc.vocationalYearGraduated}</TableCell>
                  <TableCell>{voc.person_id}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Button
                        onClick={() => {
                          setEditingVocationalId(voc.id);
                          setEditVocationalData(voc);
                        }}
                        variant="contained"
                        style={{ backgroundColor: '#6D2323', color: '#FEF9E1', width: '100px' }}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteVocational(voc.id)}
                        variant="contained"
                        style={{ backgroundColor: 'black', color: 'white', width: '100px' }}
                        startIcon={<DeleteIcon />}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Vocational;
