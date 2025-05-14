import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Container,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  TextField,
  InputAdornment,
  Button,
  Modal,
  Grid, // Added Grid import
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';








const PayrollProcess = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editRow, setEditRow] = useState(null); // Added missing state for editRow
  const [isPayrollProcessed, setIsPayrollProcessed] = useState(false);
  const [finalizedPayroll, setFinalizedPayroll] = useState([]);
  const [duplicateEmployeeNumbers, setDuplicateEmployeeNumbers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);














  useEffect(() => {
    const fetchFinalizedPayroll = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/finalized-payroll");
        setFinalizedPayroll(res.data);
      } catch (err) {
        console.error("Error fetching finalized payroll data:", err);
      }
    };
 
    fetchFinalizedPayroll();
  }, []);








  const isAlreadyFinalized = filteredData.some(fd =>
    finalizedPayroll.some(fp =>
      fp.employeeNumber === fd.employeeNumber &&
      fp.startDate === fd.startDate &&
      fp.endDate === fd.endDate
    )
  );












  useEffect(() => {
    const fetchPayrollData = async () => {
  try {
    const res = await axios.get(
      'http://localhost:5000/api/payroll-with-remittance'
    );
    console.log(res.data);




    const seen = new Set();
    const duplicates = new Set(); // newly add




    res.data.forEach(item => {
      if (seen[item.employeeNumber]) {
        duplicates.add(item.employeeNumber);
      } else {
        seen[item.employeeNumber] = true;
      }
    });








     const allData = res.data.map(item => ({
      ...item,
      status: item.status === 'Processed' || item.status === 1 ? 'Processed' : 'Unprocessed',
    }));








    setDuplicateEmployeeNumbers([...duplicates]);
    setFilteredData(allData);
    setData(allData); // ✅ Add this line here






    const allProcessed = allData.every(
      (item) => item.status === 'Processed' || item.status === 1
    );




    const allUnprocessed = allData.every(
      (item) => item.status === 'Unprocessed' || item.status === 0
    );




    setIsPayrollProcessed(allProcessed);




  } catch (err) {
    console.error('Error fetching payroll data:', err);
    setError('An error occurred while fetching the payroll data.');
  }
};
























    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/department-table'
        );
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };








    fetchPayrollData();
    fetchDepartments();
  }, []);
































  const handleDepartmentChange = (event) => {
    const selectedDept = event.target.value;
    setSelectedDepartment(selectedDept);
    applyFilters(selectedDept, searchTerm);
  };








  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilters(selectedDepartment, term);
  };
































  const applyFilters = (department, search) => {
    let filtered = [...data];




    /// SA MAY DEPARTMENT DROP DOWN AND SEARCH BUTTON
    if (department) {
      filtered = filtered.filter((record) => record.department === department);
    }


      if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter((record) =>
        (record.name || '').toLowerCase().includes(lowerSearch) ||
        (record.employeeNumber || '').toString().toLowerCase().includes(lowerSearch)
      );
    }






    setFilteredData(filtered);
  };
































  const handleSubmitPayroll = async () => {
    try {
      const updatedData = filteredData.map((item) => {
 const h = item.h || 0; // Default to 0 if h is not available
    const m = item.m || 0; // Default to 0 if m is not availabl


    const grossSalary = item.increment
    ? (parseFloat(item.rateNbc594) || 0) + (parseFloat(item.nbcDiffl597) || 0) + (parseFloat(item.increment) || 0)
    : (parseFloat(item.rateNbc594) || 0) + (parseFloat(item.nbcDiffl597) || 0);




    const abs = (grossSalary *  0.0058341725167354* h) + (grossSalary *   0.00009723557208532  * m);   

    const PhilHealthContribution = Math.floor((grossSalary * 0.05 / 2) * 100) / 100;
    const personalLifeRetIns = ((grossSalary) * 0.09);




    const netSalary = grossSalary - (abs);




    const totalGsisDeds =
    (parseFloat(personalLifeRetIns) || 0) +
    (parseFloat(item.gsisSalaryLoan) || 0) +
    (parseFloat(item.gsisPolicyLoan) || 0) +
    (parseFloat(item.gsisArrears) || 0) +
    (parseFloat(item.cpl) || 0) +
    (parseFloat(item.mpl) || 0) +
    (parseFloat(item.eal) || 0) +
    (parseFloat(item.mplLite) || 0) +
    (parseFloat(item.emergencyLoan) || 0);




    const totalPagibigDeds =
    (parseFloat(item.pagibigFundCont) || 0) +
    (parseFloat(item.pagibig2) || 0) +
    (parseFloat(item.multiPurpLoan) || 0);




    const totalOtherDeds =
   
      (parseFloat(item.liquidatingCash) || 0) +
      (parseFloat(item.landbankSalaryLoan) || 0) +
      (parseFloat(item.earistCreditCoop) || 0) +
      (parseFloat(item.feu) || 0);




    const totalDeductions =
    (parseFloat(item.withholdingTax) || 0) +
    (parseFloat(PhilHealthContribution) || 0) +
    (parseFloat(totalGsisDeds) || 0) +
    (parseFloat(totalPagibigDeds) || 0) +
    (parseFloat(totalOtherDeds) || 0);




    const pay1stCompute = netSalary - totalDeductions;
    const pay2ndCompute = (netSalary - totalDeductions) / 2;








    const pay1st = pay2ndCompute;
    const pay2nd = (parseFloat(pay1stCompute) || 0) - parseFloat((parseFloat(pay1st) || 0).toFixed(0));




    const rtIns = grossSalary * 0.12;
 
        return {
          ...item,
          totalGsisDeds: totalGsisDeds.toFixed(2),
          totalPagibigDeds: totalPagibigDeds.toFixed(2),
          totalOtherDeds: totalOtherDeds.toFixed(2),
          grossSalary,
          abs: abs.toFixed(2),
          netSalary: netSalary.toFixed(2),
          totalDeductions: totalDeductions.toFixed(2),
          PhilHealthContribution: PhilHealthContribution.toFixed(2),
          personalLifeRetIns: personalLifeRetIns.toFixed(2),
          pay1stCompute: pay1stCompute.toFixed(2),
          pay2ndCompute: pay2ndCompute.toFixed(2),
          pay1st: pay1st.toFixed(0),
          pay2nd: pay2nd.toFixed(2),
          rtIns: rtIns.toFixed(2),
          status: 'Processed',
        };
      });
 








 
      await axios.post(
        'http://localhost:5000/api/finalized-payroll',
        updatedData
      );








 
      setFilteredData(updatedData);
      setData(updatedData);
      setIsPayrollProcessed(true);
      alert('Payroll Processed and submitted successfully!');
 
      const res = await axios.get("http://localhost:5000/api/finalized-payroll");
      setFinalizedPayroll(res.data);
 
    } catch (error) {
      console.error('Error submitting payroll:', error);
      alert('Error submitting payroll.');
    }
  };
 




  const handleEdit = (rowId) => {
    const row = computedRows.find((item) => item.id === rowId);
    setEditRow(row);
    setOpenModal(true);
  };








  const handleDelete = async (rowId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/payroll-with-remittance/${rowId}`
      );
      const newData = filteredData.filter((item) => item.id !== rowId);
        setFilteredData(newData);




        // Recalculate duplicates
        const seen = {};
        const updatedDuplicates = new Set();




        newData.forEach(item => {
          if (seen[item.employeeNumber]) {
            updatedDuplicates.add(item.employeeNumber);
          } else {
            seen[item.employeeNumber] = true;
          }
        });




        setDuplicateEmployeeNumbers([...updatedDuplicates]);




      } catch (error) {
        console.error('Error deleting payroll data:', error);
      }
    };      








  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };








  const handleCancel = () => {
    setOpenModal(false);
    setEditRow(null); // Clear the modal data on cancel
  };








  const handleSave = async () => {
    try {
      // Recalculate totalGsisDeds based on relevant fields
      const updatedRow = {
        ...editRow,
        totalGsisDeds:
          (parseFloat(editRow.personalLifeRetIns) || 0) +
          (parseFloat(editRow.gsisSalaryLoan) || 0) +
          (parseFloat(editRow.gsisPolicyLoan) || 0) +
          (parseFloat(editRow.gsisArrears) || 0) +
          (parseFloat(editRow.cpl) || 0) +
          (parseFloat(editRow.mpl) || 0) +
          (parseFloat(editRow.mplLite) || 0) +
          (parseFloat(editRow.emergencyLoan) || 0),








        totalPagibigDeds:
          (parseFloat(editRow.pagibigFundCont) || 0) +
          (parseFloat(editRow.pagibig2) || 0) +
          (parseFloat(editRow.multiPurpLoan) || 0) ,


        totalOtherDeds:
          (parseFloat(editRow.liquidatingCash) || 0) +
          (parseFloat(editRow.landbankSalaryLoan) || 0) +
          (parseFloat(editRow.earistCreditCoop) || 0) +
          (parseFloat(editRow.feu) || 0),


        totalDeductions:
          (parseFloat(editRow.withholdingTax) || 0) +
          (parseFloat(editRow.totalGsisDeds) || 0) +
          (parseFloat(editRow.totalPagibigDeds) || 0) +
          (parseFloat(editRow.PhilHealthContribution) || 0)+
          (parseFloat(editRow.totalOtherDeds) || 0),
      };




      // Send the updated data to the backend
      const response = await axios.put(
        `http://localhost:5000/api/payroll-with-remittance/${editRow.employeeNumber}`,
        updatedRow
      );




      console.log('Payroll record updated successfully:', response.data);




      // Close the modal after saving
      setOpenModal(false);




      // Update state with the new data
      setFilteredData((prevData) =>
        prevData.map((item) =>
          item.employeeNumber === updatedRow.employeeNumber
            ? { ...item, ...updatedRow }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating payroll:', error);
      setError('Failed to update payroll data.');
    }
  };




  const employeeFields = [
    'employeeNumber',
    'name',
    'position',
    'department',
    'startDate',
    'endDate',
   
  ];
  const salaryRateandAdjustments = [
    'rateNbc584',
    'nbc594',
    'rateNbc594',
    'nbcDiffl597',
    'increment',
  ];
  const SalaryComputation = [
    'abs',
    'h',
    'm',
   
  ];
  const MandatoryDeductions = [
    'withholdingTax',
    'totalGsisDeds',
    'totalPagibigDeds',
    'PhilHealthContribution',
    'totalOtherDeds',
    'totalDeductions',


   
  ];
  const PayrollDisbursement = [


  'pay1st',
  'pay2nd',


  ];


  const GsisDeductions = [




  'personalLifeRetIns',
  'gsisSalaryLoan',
  'gsisPolicyLoan',
  'gsisArrears',
  'mpl',
  'eal',
  'cpl',
  'mplLite',
  'emergencyLoan'


  ];


  const PagIbigDeductions = [


  'pagibigFundCont',
  'multiPurpLoan',
  'pagibig2'


  ];


  const totalOtherDeductions = [


  'liquidatingCash',
  'earistCreditCoop',
  'feu',
  'landbankSalaryLoan'


  ];






  // COMPUTATION:
 
  const computedRows = filteredData.map((item) => {
    const h = item.h || 0; // Default to 0 if h is not available
    const m = item.m || 0; // Default to 0 if m is not availabl


    const grossSalary = item.increment
    ? (parseFloat(item.rateNbc594) || 0) + (parseFloat(item.nbcDiffl597) || 0) + (parseFloat(item.increment) || 0)
    : (parseFloat(item.rateNbc594) || 0) + (parseFloat(item.nbcDiffl597) || 0);




    const abs = (grossSalary *  0.0058341725167354* h) + (grossSalary *   0.00009723557208532  * m);

    const PhilHealthContribution = Math.floor((grossSalary * 0.05 / 2) * 100) / 100;
    const personalLifeRetIns = ((grossSalary) * 0.09);




    const netSalary = grossSalary - (abs);




    const totalGsisDeds =
    (parseFloat(personalLifeRetIns) || 0) +
    (parseFloat(item.gsisSalaryLoan) || 0) +
    (parseFloat(item.gsisPolicyLoan) || 0) +
    (parseFloat(item.gsisArrears) || 0) +
    (parseFloat(item.cpl) || 0) +
    (parseFloat(item.mpl) || 0) +
    (parseFloat(item.eal) || 0) +
    (parseFloat(item.mplLite) || 0) +
    (parseFloat(item.emergencyLoan) || 0);




    const totalPagibigDeds =
    (parseFloat(item.pagibigFundCont) || 0) +
    (parseFloat(item.pagibig2) || 0) +
    (parseFloat(item.multiPurpLoan) || 0);




     const totalOtherDeds =
   
      (parseFloat(item.liquidatingCash) || 0) +
      (parseFloat(item.landbankSalaryLoan) || 0) +
      (parseFloat(item.earistCreditCoop) || 0) +
      (parseFloat(item.feu) || 0);




    const totalDeductions =
    (parseFloat(item.withholdingTax) || 0) +
    (parseFloat(PhilHealthContribution) || 0) +
    (parseFloat(totalGsisDeds) || 0) +
    (parseFloat(totalPagibigDeds) || 0) +
    (parseFloat(totalOtherDeds) || 0);




    const pay1stCompute = netSalary - totalDeductions;
    const pay2ndCompute = (netSalary - totalDeductions) / 2;








    const pay1st = pay2ndCompute;
    const pay2nd = (parseFloat(pay1stCompute) || 0) - parseFloat((parseFloat(pay1st) || 0).toFixed(0));




    const rtIns = grossSalary * 0.12;
   
 
    return {
      ...item,
        totalGsisDeds: totalGsisDeds.toFixed(2),
        totalPagibigDeds: totalPagibigDeds.toFixed(2),
        totalOtherDeds: totalOtherDeds.toFixed(2),
        grossSalary,
        abs: abs.toFixed(2),
        netSalary: netSalary.toFixed(2),
        totalDeductions: totalDeductions.toFixed(2),
        PhilHealthContribution:PhilHealthContribution.toFixed(2),
        personalLifeRetIns: personalLifeRetIns.toFixed(2),
        pay1stCompute: pay1stCompute.toFixed(2),
        pay2ndCompute: pay2ndCompute.toFixed(2),
        pay1st: pay1st.toFixed(0),
        pay2nd: pay2nd.toFixed(2),
        rtIns:rtIns.toFixed(2)




 
    };
  });








  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={6}
        sx={{
          backgroundColor: 'rgb(109, 35, 35)',
          color: '#fff',
          p: 3,
          borderRadius: 3,
          mb: 3,
          width: 1230
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <BusinessCenterIcon fontSize="large" />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Payroll Dashboard | Processing
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.7)">
                Manage employee payroll records effectively
              </Typography>
            </Box>
          </Box>




          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <FormControl
              variant="outlined"
              sx={{ minWidth: 200, backgroundColor: '#fff', borderRadius: 1 }}
            >
              <InputLabel id="department-label">
                <b>Department</b>
              </InputLabel>
              <Select
                labelId="department-label"
                id="department-select"
                value={selectedDepartment}
                label="Department"
                onChange={handleDepartmentChange}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: 1,
                }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.code}>
                    {dept.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>








            <TextField
              variant="outlined"
              label="Search Name"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ minWidth: 250, backgroundColor: '#fff', borderRadius: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Paper>








      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>




        {duplicateEmployeeNumbers.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Duplicate employee number(s) found: {duplicateEmployeeNumbers.join(', ')}. These rows are highlighted in red.
          </Alert>
        )}
        <Box sx={{ width: '100%' }}>
         <Box display="flex" gap={3} alignItems="flex-start" minWidth="1300px">




        <Paper elevation={4} sx={{ borderRadius: 3 }}> {/*TABLE HEADER */}
          <TableContainer component={Box} sx={{ maxHeight: 600 , maxWidth: 1100, borderRadius: 1}}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: '#F1F1F1' }}>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Employee Number</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Rate NBC 584</TableCell>
                  <TableCell>NBC 594</TableCell>
                  <TableCell>Rate NBC 594</TableCell>
                  <TableCell>NBC DIFF'L 597</TableCell>
                  <TableCell>Increment</TableCell>
                  <TableCell>Gross Salary</TableCell>
                  <TableCell><b>ABS</b></TableCell>
                  <TableCell>H</TableCell>
                  <TableCell>M</TableCell>
                  <TableCell>Net Salary</TableCell>
                  <TableCell>Withholding Tax</TableCell>
                  <TableCell><b>Total GSIS Deductions</b></TableCell>
                  <TableCell><b>Total Pag-ibig Deductions</b></TableCell>
                  <TableCell>PhilHealth</TableCell>
                  <TableCell> <b>Total Other Deductions</b></TableCell>
                  <TableCell><b>Total Deductions</b></TableCell>
                  <TableCell>1st Pay</TableCell>
                  <TableCell>2nd Pay</TableCell>
                  <TableCell>No.</TableCell>
                  <TableCell>RT Ins.</TableCell>
                  <TableCell>EC</TableCell>
                  <TableCell>PhilHealth</TableCell>
                  <TableCell>Pag-Ibig</TableCell>
                  <TableCell style={{color: 'red', fontWeight: 'bold'}}>Pay1st Compute </TableCell>
                  <TableCell style={{color: 'red', fontWeight: 'bold'}}>Pay2nd Compute </TableCell>
                  <br />








                  <TableCell style={{ borderLeft: '2px solid black' }}></TableCell>
               




                  <TableCell>No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Withholding Tax</TableCell>
                  <TableCell>Personal Life Ret Ins</TableCell>
                  <TableCell>GSIS Salary Loan</TableCell>
                  <TableCell>GSIS Policy Loan</TableCell>
                  <TableCell>gsisArrears</TableCell>
                  <TableCell>CPL</TableCell>
                  <TableCell>MPL</TableCell>
                  <TableCell> EAL</TableCell>
                  <TableCell>MPL LITE</TableCell>
                  <TableCell>Emergency Loan (ELA)</TableCell>
                  <TableCell>Total GSIS Deductions</TableCell>
                  <TableCell>Pag-ibig Fund Contribution</TableCell>
                  <TableCell>Pag-ibig 2</TableCell>
                  <TableCell>Multi-Purpose Loan</TableCell>
                  <TableCell>Total Pag-Ibig Deduction</TableCell>
                  <TableCell> PhilHealth</TableCell>
                  <TableCell> liquidatingCash</TableCell>
                  <TableCell>LandBank Salary Loan</TableCell>
                  <TableCell> Earist Credit COOP.</TableCell>
                  <TableCell> FEU</TableCell>
                  <TableCell> Total Other Deductions</TableCell>
                  <TableCell> Total Deductions</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
































              <TableBody>
              {filteredData.length > 0 &&
                computedRows.map((row, index) => {
                    const isFinalized = finalizedPayroll.some(fp =>
                      fp.employeeNumber === row.employeeNumber &&
                      fp.startDate === row.startDate &&
                      fp.endDate === row.endDate
                    );








                    return (
                      <TableRow
                        key={`${row.employeeNumber}-${row.dateCreated}`}
                        sx={{
                          backgroundColor: duplicateEmployeeNumbers.includes(row.employeeNumber)
                            ? 'rgba(255, 0, 0, 0.1)'
                            : 'inherit',
                        }}
                      >      
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.employeeNumber}</TableCell>
                      <TableCell>{row.startDate}</TableCell>
                      <TableCell>{row.endDate}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.position}</TableCell>
                      <TableCell>{row.rateNbc584}</TableCell>
                      <TableCell>{row.nbc594}</TableCell>
                      <TableCell>{row.rateNbc594 || '0' }</TableCell>
                      <TableCell>{row.nbcDiffl597 || '0' }</TableCell>
                      <TableCell>{row.increment}</TableCell>
                      <TableCell>{row.grossSalary}</TableCell>
                      <TableCell><b>{row.abs}</b></TableCell>
                      <TableCell>{row.h}</TableCell>
                      <TableCell>{row.m}</TableCell>
                      <TableCell>{row.netSalary} </TableCell>    
                      <TableCell>{row.withholdingTax}</TableCell>
                      <TableCell>{row.totalGsisDeds}</TableCell>
                      <TableCell>{row.totalPagibigDeds}</TableCell>
                      <TableCell>{row.PhilHealthContribution}</TableCell>
                      <TableCell>{row.totalOtherDeds}</TableCell>
                      <TableCell>{row.totalDeductions}</TableCell>
                      <TableCell sx={{color: 'red', fontWeight:'bold'}}>{row.pay1st} </TableCell>
                      <TableCell sx={{color:'red', fontWeight:'bold'}}>{row.pay2nd }</TableCell>
                   
                      <TableCell>{index + 1}</TableCell>






                      <TableCell>{row.rtIns}</TableCell>
                      <TableCell>{row.ec}</TableCell>
                      <TableCell>{row.PhilHealthContribution}</TableCell>


                      <TableCell>{row.pagibigFundCont}</TableCell>
                      <TableCell>{row.pay1stCompute}</TableCell>
                      <TableCell>{row.pay2ndCompute}</TableCell>
                      <br />


                      <TableCell style={{ borderLeft: '2px solid black' }}></TableCell>








                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.position}</TableCell>
                      <TableCell>{row.withholdingTax}</TableCell>
                      <TableCell>{row.personalLifeRetIns}</TableCell>
                      <TableCell>{row.gsisSalaryLoan}</TableCell>
                      <TableCell>{row.gsisPolicyLoan}</TableCell>
                      <TableCell>{row.gsisArrears}</TableCell>
                      <TableCell>{row.cpl}</TableCell>
                      <TableCell>{row.mpl}</TableCell>
                      <TableCell>{row.eal}</TableCell>
                      <TableCell>{row.mplLite}</TableCell>
                      <TableCell>{row.emergencyLoan}</TableCell>
                      <TableCell>{row.totalGsisDeds}</TableCell>
                      <TableCell>{row.pagibigFundCont}</TableCell>
                      <TableCell>{row.pagibig2}</TableCell>
                      <TableCell>{row.multiPurpLoan}</TableCell>
                      <TableCell>{row.totalPagibigDeds}</TableCell>
                      <TableCell>{row.PhilHealthContribution}</TableCell>
                      <TableCell>{row.liquidatingCash}</TableCell>
                      <TableCell>{row.landbankSalaryLoan}</TableCell>
                      <TableCell>{row.earistCreditCoop}</TableCell>
                      <TableCell>{row.feu}</TableCell>              
                      <TableCell>{row.totalOtherDeds}</TableCell>
                      <TableCell>{row.totalDeductions}</TableCell>
                      <TableCell>{row.status}</TableCell>


                    </TableRow>
             );
    })}


              </TableBody>
            </Table>
          </TableContainer>
           {}
                    {filteredData.length === 0 && (
            <Typography
              variant="h6"
              align="center"
              color="error"
              sx={{ mt: 2 }}
            >
              Loading or No Data Available
            </Typography>
          )}
        </Paper>


        <Paper elevation={4} sx={{ borderRadius: 1, pt: 2.5, width: 150 }}>
          <TableContainer component={Box} sx={{ maxHeight: 600, width: 150, overflow: 'hidden' }}>
            <Table stickyHeader>
              <TableHead sx={{ backgroundColor: '#F1F1F1' }}>
                <TableRow>
               
                  <TableCell style={{alignItems: 'center', marginTop: '10px', paddingBottom: '40px', paddingLeft: '45px'}}>Actions</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>




          <TableBody>
            {filteredData.length > 0 ? (
              computedRows.map((row, index) => {
                const isFinalized = finalizedPayroll.some(fp =>
                  fp.employeeNumber === row.employeeNumber &&
                  fp.startDate === row.startDate &&
                  fp.endDate === row.endDate
                );




            return (
              <TableRow key={`actions-${row.employeeNumber}-${row.dateCreated}`}>
               


                {/* Edit column */}
                <TableCell>
                  <Button
                    onClick={() => handleEdit(row.id)}
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    style={{
                      backgroundColor: isFinalized ? '#D3D3D3' : '#6D2323',
                      color: isFinalized ? '#A9A9A9' : '#FEF9E1',
                      textTransform: 'none',
                      width: '85px',
                      opacity: isFinalized ? 0.6 : 1,
                      pointerEvents: isFinalized ? 'none' : 'auto',
                      position: 'inherit',
                      marginLeft: '15px',
                      padding: '4px'


                   
                    }}
                    disabled={isFinalized}
                  >
                    Edit
                  </Button>
               




                {/* Delete column */}
               
                  <Button
                    onClick={() => handleDelete(row.id)}
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    style={{
                      backgroundColor: isFinalized ? '#D3D3D3' : '#000000',
                      color: isFinalized ? '#A9A9A9' : '#ffffff',
                      textTransform: 'none',
                      width: '85px',
                      opacity: isFinalized ? 0.6 : 1,
                      pointerEvents: isFinalized ? 'none' : 'auto',
                      marginTop: '5px',
                      position: 'inherit',
                      marginLeft: '15px',
                      padding: '4px',
                      marginBottom: '-5px'


                    }}
                    disabled={isFinalized}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={5} align="center">
              No Data Available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
        </Paper>




       


        </Box>
       
        </Box>




       




        </>
       
      )}
     








<Button
  variant="contained"
  color="success"
  onClick={() => setShowConfirmation(true)}
  disabled={isAlreadyFinalized || duplicateEmployeeNumbers.length > 0}
  sx={{
    backgroundColor: '#6D2323',
    color: '#ffffff',
    textTransform: 'none',
    height: '56px',
    width: '200px',
    marginTop: 2,
    opacity: isAlreadyFinalized || duplicateEmployeeNumbers.length > 0 ? 0.6 : 1,
    pointerEvents: isAlreadyFinalized ? 'none' : 'auto',
    pointerEvents: isAlreadyFinalized || duplicateEmployeeNumbers.length > 0 ? 'none' : 'auto',




  }}
>
  Submit Payroll
</Button>
















































      <Modal open={openModal} onClose={handleCancel}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {editRow && (
            <>
              <Typography variant="h5" mb={3}>
                Edit Payroll Record
              </Typography>
































              {/* Employee Info */}
              <Typography variant="h6" gutterBottom>
                Employee Information
              </Typography>
              <Grid container spacing={2}>
                {employeeFields.map((field) => (
                  <Grid item xs={6} key={field}>
                    {field === 'department' ? (
                      // Department field with dropdown
                      <FormControl fullWidth>
                        <InputLabel id="department-label">
                          Department
                        </InputLabel>
                        <Select
                          labelId="department-label"
                          id="department-select"
                          name={field}
                          value={editRow[field] || ''}
                          onChange={handleModalChange}
                          label="Department"
                        >
                          {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.code}>
                              {dept.description}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      // Other fields with text input
                      <TextField
                        fullWidth
                        label={field}
                        name={field}
                        value={editRow[field] || ''}
                        onChange={handleModalChange}
                        InputLabelProps={{
                                  style: { fontSize: '15px' }  // Make the label bigger
                                }}
                                InputProps={{
                                  style: { fontSize: '15px' }  // Make the input text bigger
                                }}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
























{/* MODAL EDIT*/}






               {/* Salary Info */}
                              <Typography variant="h6" mt={4} gutterBottom>
                                Salary Rate and Adjustments
                              </Typography>
                              <Grid container spacing={2}>
                                {salaryRateandAdjustments.map((field) => (
                                  <Grid item xs={6} key={field}>
                                    <TextField
                                      fullWidth
                                      label={field}
                                      name={field}
                                      value={editRow[field] || ''}
                                      onChange={handleModalChange}
                                      disabled={field === 'rateNbc594' || field === 'rateNbc584' }
                                      InputProps={{
                                        style:
                                          field === 'rateNbc594' || field === 'rateNbc584'
                                            ? { fontWeight: 'bold', color: 'black', fontSize: '15px' }
                                            : undefined,}}
                                      InputLabelProps={{
                                  style: { fontSize: '15px' }  // Make the label bigger
                                }}
                               
                                    />
                                  </Grid>
             
                                 
                                ))}
                              </Grid>
             
                     




                          {/* Deductions */}
                          <Typography variant="h6" mt={5} gutterBottom>
                            Salary Computations
                          </Typography>
                          <Grid container spacing={2}>
                            {SalaryComputation.map((field) => (
                              <Grid item xs={6} key={field}>
                                <TextField
                                  fullWidth
                                  label={field}
                                  name={field}
                                  value={editRow[field] || ''}
                                  onChange={handleModalChange}
                                  InputLabelProps={{
                                  style: { fontSize: '15px' }  // Make the label bigger
                                }}
                                InputProps={{
                                  style: { fontSize: '15px' }  // Make the input text bigger
                                }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                 


                          <Typography variant="h6" mt={4} gutterBottom>
                            Payroll Disbursement
                          </Typography>
                          <Grid container spacing={2}>
                            {PayrollDisbursement.map((field) => (
                              <Grid item xs={6} key={field}>
                                <TextField
                                  fullWidth
                                  label={field}
                                  name={field}
                                  value={editRow[field] || ''}
                                  onChange={handleModalChange}
                                  InputLabelProps={{
                                  style: { fontSize: '15px' }  // Make the label bigger
                                }}
                                InputProps={{
                                  style: { fontSize: '15px' }  // Make the input text bigger
                                }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                         


                           <Typography variant="h6" mt={4} gutterBottom>
                           GSIS Deductions
                          </Typography>
                          <Grid container spacing={2}>
                            {GsisDeductions.map((field) => (
                              <Grid item xs={6} key={field}>
                                <TextField
                                  fullWidth
                                  label={field}
                                  name={field}
                                  value={editRow[field] || ''}
                                  onChange={handleModalChange}
                                  InputLabelProps={{
                                  style: { fontSize: '15px' }  // Make the label bigger
                                }}
                                InputProps={{
                                  style: { fontSize: '15px' }  // Make the input text bigger
                                }}
                                />
                              </Grid>
                            ))}
                          </Grid>


                          <Typography variant="h6" mt={4} gutterBottom>
                           PAGIBIG Deductions
                          </Typography>
                          <Grid container spacing={2}>
                            {PagIbigDeductions.map((field) => (
                              <Grid item xs={6} key={field}>
                                <TextField
                                  fullWidth
                                  label={field}
                                  name={field}
                                  value={editRow[field] || ''}
                                  onChange={handleModalChange}
                                  InputLabelProps={{
                                  style: { fontSize: '15px' }  // Make the label bigger
                                }}
                                InputProps={{
                                  style: { fontSize: '15px' }  // Make the input text bigger
                                }}
                                />
                              </Grid>
                            ))}
                          </Grid>


                           <Typography variant="h6" mt={4} gutterBottom>
                           Total Other Deductions
                          </Typography>
                          <Grid container spacing={2}>
                            {totalOtherDeductions.map((field) => (
                              <Grid item xs={6} key={field}>
                                <TextField
                                  fullWidth
                                  label={field}
                                  name={field}
                                  value={editRow[field] || ''}
                                  onChange={handleModalChange}
                                  InputLabelProps={{
                                  style: { fontSize: '15px' }  // Make the label bigger
                                }}
                                InputProps={{
                                  style: { fontSize: '15px' }  // Make the input text bigger
                                }}
                                />
                              </Grid>
                            ))}
                          </Grid>


                        {/* Other Info */}
<Box mt={4} mb={2}>
  <Typography variant="h6" fontWeight="bold">
    Total Contributions & Deductions
  </Typography>
</Box>






<Grid container spacing={2}>
  {MandatoryDeductions.map((field) => (
    <Grid item xs={6} key={field}>
      <TextField
        fullWidth
        label={field}
        name={field}
        value={editRow[field] || ''}
        onChange={handleModalChange}
        InputLabelProps={{
                                  style: { fontSize: '15px' }  // Make the label bigger
                                }}
                                InputProps={{
                                  style: { fontSize: '15px' }  // Make the input text bigger
                                }}
      />
    </Grid>
  ))}
</Grid>
































              {/* Save / Cancel */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  startIcon={<SaveIcon />}
                  style={{
                    textTransform: 'none',
                    width: '100px',
                    backgroundColor: '#6D2323',
                    color: '#FEF9E1',
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<CancelIcon />}
                  style={{
                    textTransform: 'none',
                    width: '100px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                  }}
                >
                  Cancel
                </Button>


               
              </Box>


             
            </>
          )}
        </Box>


      </Modal>


      <Modal open={showConfirmation} onClose={() => setShowConfirmation(false)}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      textAlign: 'center',
      width: 400,
    }}
  >
    <Typography variant="h6" mb={2}>
      Are you sure all the data are correct?
    </Typography>
    <Box display="flex" justifyContent="center" gap={2}>
      <Button
        style={{color: 'black'}}
        onClick={() => setShowConfirmation(false)}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        style={{backgroundColor: '#6D2323', width: '100px'}}
        color="success"
        onClick={async () => {
          setIsSubmitting(true);
          setShowConfirmation(false);
          await handleSubmitPayroll(); // THIS is your real submit function
          setIsSubmitting(false);
        }}
        disabled={isSubmitting}
      >
        Yes
      </Button>
    </Box>
  </Box>
</Modal>


    </Container>
  );
};








export default PayrollProcess;





