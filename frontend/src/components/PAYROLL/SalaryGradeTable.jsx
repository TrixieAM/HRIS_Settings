import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';




const SalaryGradeTable = () => {
  const [salaryGrades, setSalaryGrades] = useState([]);
  const [newSalaryGrade, setNewSalaryGrade] = useState({
    effectivityDate: "",
    sg_number: "",
    step1: "",
    step2: "",
    step3: "",
    step4: "",
    step5: "",
    step6: "",
    step7: "",
    step8: "",
  });
  const [editSalaryGradeId, setEditSalaryGradeId] = useState(null);


  useEffect(() => {
    fetchSalaryGrades();
  }, []);


  const fetchSalaryGrades = async () => {
    const response = await axios.get("http://localhost:5000/SalaryGradeTable/salary-grade");
    setSalaryGrades(response.data);
  };


  const addSalaryGrade = async () => {
    if (Object.values(newSalaryGrade).includes("")) {
      console.log("All fields are required");
      return;
    } else {
      await axios.post("http://localhost:5000/SalaryGradeTable/salary-grade", newSalaryGrade);
      setNewSalaryGrade({
        effectivityDate: "",
        sg_number: "",
        step1: "",
        step2: "",
        step3: "",
        step4: "",
        step5: "",
        step6: "",
        step7: "",
        step8: "",
      });
      fetchSalaryGrades();
    }
  };


  const updateSalaryGrade = async (id) => {
    const recordToUpdate = salaryGrades.find((record) => record.id === id);
    await axios.put(
      `http://localhost:5000/SalaryGradeTable/salary-grade/${id}`,
      recordToUpdate
    );
    setEditSalaryGradeId(null);
    fetchSalaryGrades();
  };


  const deleteSalaryGrade = async (id) => {
    await axios.delete(`http://localhost:5000/SalaryGradeTable/salary-grade/${id}`);
    fetchSalaryGrades();
  };


  return (
    <Container>
      {/* Header */}
      <Paper
  elevation={3}
  sx={{
    padding: 3,
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    marginBottom: "24px",
  }}
>
  <Typography
    variant="h6"
    sx={{
      fontWeight: "bold",
      backgroundColor: "#6D2323",
      color: "#ffffff",
      padding: "12px 16px",
      borderRadius: "8px",
      marginBottom: "16px",
    }}
  >
    2025 Second Tranche Salary Schedule
    <p style={{ fontSize: "14px", marginTop: "8px", fontWeight: "normal" }}>
      For Civilian Personnel of the National Government  
      Effective January 1, 2025
</p>




  </Typography>
 


  <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Effectivity Date"
        value={newSalaryGrade.effectivityDate}
        onChange={(e) =>
          setNewSalaryGrade({
            ...newSalaryGrade,
            effectivityDate: e.target.value,
          })
        }
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        label="Salary Grade Number"
        value={newSalaryGrade.sg_number}
        onChange={(e) =>
          setNewSalaryGrade({
            ...newSalaryGrade,
            sg_number: e.target.value,
          })
        }
        fullWidth
      />
    </Grid>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} key={index}>
        <TextField
          label={`Step ${index + 1}`}
          value={newSalaryGrade[`step${index + 1}`]}
          onChange={(e) =>
            setNewSalaryGrade({
              ...newSalaryGrade,
              [`step${index + 1}`]: e.target.value,
            })
          }
          fullWidth
        />
      </Grid>
    ))}
    <Grid item xs={12}>
      <Button
        onClick={addSalaryGrade}
        variant="contained"
        sx={{
          backgroundColor: "#6D2323",
          '&:hover': { backgroundColor: "#9C2A2A" },
          height: "40px",
          width: "100%",
        }}
        startIcon={<AddIcon />}
      >
        Add Salary Grade
      </Button>
    </Grid>
  </Grid>
</Paper>
 <br />
 


      {/* Salary Grade Table */}
      <Table style={{ backgroundColor: 'white', borderRadius: '5px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginLeft: '-3%' }}>
      <TableHead>
          <TableRow style={{ backgroundColor: "#6D2323", borderRadius: "15px", overflow: "hidden" }}>
            <TableCell style={{ color: "#ffffff", fontWeight: "bold" }}>
              ID
            </TableCell>
            <TableCell style={{ color: "#ffffff", fontWeight: "bold" }}>
              Effectivity Date
            </TableCell>
            <TableCell style={{ color: "#ffffff", fontWeight: "bold" }}>
              Salary Grade Number
            </TableCell>
            {[...Array(8)].map((_, index) => (
              <TableCell
                key={index}
                style={{ color: "#ffffff", fontWeight: "bold", minWidth: "80px", // Adjust width as needed
                  padding: "12px 16px",
                }}
              >
                Step {index + 1}
              </TableCell>
            ))}
            <TableCell style={{ color: "#ffffff", fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {salaryGrades.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.id}</TableCell>
              <TableCell>
                {editSalaryGradeId === record.id ? (
                  <TextField
                    value={record.effectivityDate}
                    onChange={(e) => {
                      const updatedRecord = {
                        ...record,
                        effectivityDate: e.target.value,
                      };
                      setSalaryGrades((prevData) =>
                        prevData.map((rec) =>
                          rec.id === record.id ? updatedRecord : rec
                        )
                      );
                    }}
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  record.effectivityDate
                )}
              </TableCell>
              <TableCell>
                {editSalaryGradeId === record.id ? (
                  <TextField
                    value={record.sg_number}
                    onChange={(e) => {
                      const updatedRecord = {
                        ...record,
                        sg_number: e.target.value,
                      };
                      setSalaryGrades((prevData) =>
                        prevData.map((rec) =>
                          rec.id === record.id ? updatedRecord : rec
                        )
                      );
                    }}
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  record.sg_number
                )}
              </TableCell>
              {[...Array(8)].map((_, index) => (
                <TableCell key={index}>
                  {editSalaryGradeId === record.id ? (
                    <TextField
                      value={record[`step${index + 1}`]}
                      onChange={(e) => {
                        const updatedRecord = {
                          ...record,
                          [`step${index + 1}`]: e.target.value,
                        };
                        setSalaryGrades((prevData) =>
                          prevData.map((rec) =>
                            rec.id === record.id ? updatedRecord : rec
                          )
                        );
                      }}
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    record[`step${index + 1}`]
                  )}
                </TableCell>
              ))}
              <TableCell>
                {editSalaryGradeId === record.id ? (
                  <>
                    <Button
                      onClick={() => updateSalaryGrade(record.id)}
                      variant="contained"
                      sx={{
                        backgroundColor: "#6D2323",
                        color: "#FEF9E1",
                        "&:hover": { backgroundColor: "#9C2A2A" },
                        marginRight: "8px",
                        marginBottom:'5px',
                        width: "100%",
                      }}
                      startIcon={<SaveIcon />}
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => setEditSalaryGradeId(null)}
                      variant="contained"
                      color="error"
                      sx={{
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        "&:hover": { backgroundColor: "#333333" },
                        width: "100%",
                      }}
                      startIcon={<CancelIcon />}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setEditSalaryGradeId(record.id)}
                      variant="contained"
                      sx={{
                        backgroundColor: "#6D2323",
                        color: "#FEF9E1",
                        "&:hover": { backgroundColor: "#9C2A2A" },
                        marginRight: "8px",
                        marginBottom:'5px',
                        width: "100%",
                       
                      }}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteSalaryGrade(record.id)}
                      variant="contained"
                      color="error"
                      sx={{
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        "&:hover": { backgroundColor: "#333333" },
                        width: "100%",
                      }}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};


export default SalaryGradeTable;



