import React from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Button from '@mui/material/Button';


const SalnFront = () => {
  const handleNext = () => {
    navigate('/saln-back');
  };


  const navigate = useNavigate();


  return (
    <div
      style={{
        border: '1px solid black',
        padding: '0.25in',
        width: '8in',
        height: '18in',
        margin: 'auto',
        marginTop: '50px',
        marginBottom: '15%',
      }}
    >
      <table
        style={{
          border: '1px solid white',
          borderCollapse: 'collapse',
          fontFamily: 'Arial, Helvetica, sans-serif',
          width: '8.2in',
          tableLayout: 'fixed',
          backgroundColor: '#ffffff'
        }}
      >
        <tr>
          <td colSpan="15" style={{ height: '0.1in', fontSize: '72.5%' }}>
            &nbsp;
          </td>
          <td colSpan="5" style={{ height: '0.1in', fontSize: '72.5%' }}>
            Revised as of January 2015
            <br />
            Per CSC Resolution No. 1500088
            <br />
            Promulgated on January 23, 2015
            <br />
            &nbsp;
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '110%', textAlign: 'center' }}
          >
            <b>SWORN STATEMENT OF ASSETS, LIABILITIES AND NET WORTH</b>
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '90%', textAlign: 'center' }}
          >
            As of ________________________
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '72.5%', textAlign: 'center' }}
          >
            &emsp;&emsp;(Required by R.A. 6713)
            <br />
            <br />
            <b>Note:</b>{' '}
            <i>
              Husband and wife who are both public officials and employees may
              file the required statements jointly or separately.
            </i>
          </td>
        </tr>
        <tr>
          <td
            colSpan="4"
            style={{ height: '0.2in', fontSize: '90%', textAlign: 'center' }}
          >
            &nbsp;
          </td>
          <td
            colSpan="4"
            style={{ height: '0.2in', fontSize: '90%', textAlign: 'center' }}
          >
            [ ] <i>Joint Filing</i>
          </td>
          <td
            colSpan="4"
            style={{ height: '0.2in', fontSize: '90%', textAlign: 'center' }}
          >
            [ ] <i>Separate Filing</i>
          </td>
          <td
            colSpan="4"
            style={{ height: '0.2in', fontSize: '90%', textAlign: 'center' }}
          >
            [ ] <i>Not Applicable</i>
          </td>
          <td
            colSpan="4"
            style={{ height: '0.2in', fontSize: '90%', textAlign: 'center' }}
          >
            &nbsp;
          </td>
        </tr>
        <tr>
          <td
            colSpan="3"
            style={{ height: '0.1in', fontSize: '80%', textAlign: 'left' }}
          >
            <br />
            <br />
            <b>DECLARANT:</b>
            <br />
            <br />
            <br />
            <b>ADDRESS:</b>
            <br />
            <br />
            <br />
            <b>SPOUSE:</b>
            <br />
            <br />
            <br />
          </td>
          <td
            colSpan="8"
            style={{ height: '0.1in', fontSize: '80%', textAlign: 'left' }}
          >
            <br />
            <br />
            &emsp; ________________________________________
            <br />
            &emsp;&emsp;&emsp;(Family Name)&emsp;&emsp;&emsp;(First
            Name)&emsp;&emsp;(M.I.)
            <br />
            <br />
            &emsp; ________________________________________
            <br />
            &emsp; ________________________________________
            <br />
            <br />
            &emsp; ________________________________________
            <br />
            &emsp;&emsp;&emsp;(Family Name)&emsp;&emsp;&emsp;(First
            Name)&emsp;&emsp;(M.I.)
            <br />
            <br />
          </td>
          <td
            colSpan="4"
            style={{ height: '0.1in', fontSize: '80%', textAlign: 'left' }}
          >
            <br />
            <br />
            &emsp;<b>POSITION:</b>
            <br />
            &emsp;<b>AGENCY/OFFICE:</b>
            <br />
            &emsp;<b>OFFICE ADDRESS:</b>
            <br />
            <br />
            <br />
            &emsp;<b>POSITION:</b>
            <br />
            &emsp;<b>AGENCY/OFFICE:</b>
            <br />
            &emsp;<b>OFFICE ADDRESS:</b>
            <br />
            <br />
          </td>
          <td
            colSpan="6"
            style={{ height: '0.1in', fontSize: '80%', textAlign: 'left' }}
          >
            <br />
            <br />
            _______________________________
            <br />
            _______________________________
            <br />
            _______________________________
            <br />
            _______________________________
            <br />
            <br />
            _______________________________
            <br />
            _______________________________
            <br />
            _______________________________
            <br />
            _______________________________
            <br />
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '0%', textAlign: 'center' }}
          >
            &nbsp;
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{
              height: '0.05in',
              fontSize: '0%',
              backgroundColor: 'black',
              textAlign: 'center',
            }}
          >
            &nbsp;
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '0%', textAlign: 'center' }}
          >
            &nbsp;
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '95%', textAlign: 'center' }}
          >
            <b>
              <u>
                UNMARRIED CHILDREN BELOW EIGHTEEN (18) YEARS OF AGE LIVING IN
                DECLARANT'S HOUSEHOLD
              </u>
            </b>
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '0%', textAlign: 'center' }}
          >
            &nbsp;
          </td>
        </tr>
        <tr>
          <td
            colSpan="10"
            style={{ height: '0.1in', fontSize: '72.5%', textAlign: 'center' }}
          >
            <b>NAME</b>
          </td>
          <td
            colSpan="6"
            style={{ height: '0.1in', fontSize: '72.5%', textAlign: 'center' }}
          >
            <b>DATE OF BIRTH</b>
          </td>
          <td
            colSpan="4"
            style={{ height: '0.1in', fontSize: '72.5%', textAlign: 'center' }}
          >
            <b>AGE</b>
          </td>
        </tr>
        <tr>
          <td
            colSpan="10"
            style={{ height: '0.1in', fontSize: '62.5%', textAlign: 'center' }}
          >
            <br />
            ________________________________________________
            <br />
            <br />
            ________________________________________________
            <br />
            <br />
            ________________________________________________
            <br />
            <br />
            ________________________________________________
            <br />
            <br />
          </td>
          <td
            colSpan="6"
            style={{ height: '0.1in', fontSize: '62.5%', textAlign: 'center' }}
          >
            <br />
            ____________________________________
            <br />
            <br />
            ____________________________________
            <br />
            <br />
            ____________________________________
            <br />
            <br />
            ____________________________________
            <br />
            <br />
          </td>
          <td
            colSpan="4"
            style={{ height: '0.1in', fontSize: '62.5%', textAlign: 'center' }}
          >
            <br />
            ________________________
            <br />
            <br />
            ________________________
            <br />
            <br />
            ________________________
            <br />
            <br />
            ________________________
            <br />
            <br />
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '0%', textAlign: 'center' }}
          >
            &nbsp;
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{
              height: '0.05in',
              fontSize: '0%',
              backgroundColor: 'black',
              textAlign: 'center',
            }}
          >
            &nbsp;
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '0%', textAlign: 'center' }}
          >
            &nbsp;
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '95%', textAlign: 'center' }}
          >
            <b>
              <u>ASSETS, LIABILITIES AND NETWORTH</u>
            </b>
            <br />
            <i>
              (Including those of the spouse and unmarried children below
              eighteen (18)
              <br />
              years of age living in declarant's household)
            </i>
            <br />
            <br />
          </td>
        </tr>
        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '0%', textAlign: 'center' }}
          >
            &nbsp;
          </td>
        </tr>


        <tr>
          <td
            colSpan="20"
            style={{ height: '0.1in', fontSize: '95%', textAlign: 'left' }}
          >
            <b>
              1.&emsp;ASSETS
              <br />
              <br />
              &emsp;&emsp;a.&emsp;Real Properties*
            </b>
          </td>
        </tr>
        <table
          style={{
            borderCollapse: 'collapse',
            fontFamily: 'Arial, Helvetica, sans-serif',
            width: '8in',
            tableLayout: 'fixed',
          }}
        >
          <tr style={{ backgroundColor: 'lightgray' }}>
            <td
              colSpan="5"
              rowSpan="2"
              style={{
                border: '1px solid black',
                height: '0.1in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <br />
              <b>DESCRIPTION</b>
              <br />
              <br />
              (e.g. lot, house and
              <br />
              lot, condominium
              <br />
              and improvements)
            </td>
            <td
              colSpan="5"
              rowSpan="2"
              style={{
                border: '1px solid black',
                height: '0.1in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <br />
              <b>KIND</b>
              <br />
              <br />
              (e.g. residential,
              <br />
              commercial, industrial,
              <br />
              agricultural and mixed
              <br />
              use)
            </td>
            <td
              colSpan="5"
              rowSpan="2"
              style={{
                border: '1px solid black',
                height: '0.1in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <br />
              <b>
                EXACT
                <br />
                <br />
                LOCATION
              </b>
            </td>
            <td
              colSpan="3"
              style={{
                border: '1px solid black',
                height: '0.1in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <br />
              <b>
                ASSESSED
                <br />
                <br />
                VALUE
              </b>
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.1in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <br />
              <b>
                CURRENT FAIR
                <br />
                <br />
                MARKET VALUE
              </b>
            </td>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.1in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <br />
              <b>ACQUISITION</b>
            </td>
            <td
              colSpan="4"
              rowSpan="2"
              style={{
                border: '1px solid black',
                height: '0.1in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <br />
              <b>
                ACQUISITION
                <br />
                <br />
                COST
              </b>
            </td>
          </tr>
          <tr style={{ backgroundColor: 'lightgray' }}>
            <td
              colSpan="7"
              style={{
                border: '1px solid black',
                height: '0.1in',
                fontSize: '60%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              (As found in the Tax Declaration of
              <br />
              Real Property)
            </td>
            <td
              colSpan="2"
              style={{
                border: '1px solid black',
                height: '0.1in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <b>YEAR</b>
            </td>
            <td
              colSpan="3"
              style={{
                border: '1px solid black',
                height: '0.1in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <b>MONTH</b>
            </td>
          </tr>


          <tr>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="3"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="2"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="3"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
          </tr>
          <tr>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="3"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="2"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="3"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
          </tr>
          <tr>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="3"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="2"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="3"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
          </tr>
          <tr>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="5"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="3"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="2"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="3"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.55in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
          </tr>
          <td
            colSpan="24"
            style={{
              border: '1px 1px 0px 1px solid black',
              height: '0.1in',
              fontSize: '0%',
            }}
          >
            &nbsp;
          </td>
          <td
            colSpan="7"
            style={{
              border: '1px 1px 0px 1px solid black',
              height: '0.1in',
              fontSize: '90%',
            }}
          >
            <b>Subtotal:</b> _____________
          </td>
          <tr></tr>


          <tr>
            <td
              colSpan="31"
              style={{ height: '0.1in', fontSize: '95%', textAlign: 'left' }}
            >
              <b>&emsp;&emsp;b.&emsp;Personal Properties*</b>
            </td>
          </tr>


          <tr style={{ backgroundColor: 'lightgray' }}>
            <td
              colSpan="18"
              style={{
                border: '1px solid black',
                height: 'height: 0.55in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <br />
              <b>DESCRIPTION</b>
            </td>
            <td
              colSpan="9"
              style={{
                border: '1px solid black',
                height: 'height: 0.55in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <br />
              <b>YEAR ACQUIRED</b>
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: 'height: 0.55in',
                fontSize: '72.5%',
                textAlign: 'center',
                verticalAlign: 'top',
              }}
            >
              <br />
              <b>
                ACQUISITION <br />
                <b>COST/AMOUNT</b>
              </b>
            </td>
          </tr>
          <tr>
            <td
              colSpan="18"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="9"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
          </tr>
          <tr>
            <td
              colSpan="18"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="9"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
          </tr>
          <tr>
            <td
              colSpan="18"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="9"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
          </tr>
          <tr>
            <td
              colSpan="18"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="9"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan="4"
              style={{
                border: '1px solid black',
                height: '0.25in',
                fontSize: '0%',
              }}
            >
              &nbsp;
            </td>
          </tr>


          <tr>
            <td
              colSpan={24}
              style={{ border: 0, height: '0.1in', fontSize: '0%' }}
            >
              &nbsp;
            </td>
            <td
              colSpan={7}
              style={{ border: 0, height: '0.1in', fontSize: '90%' }}
            >
              <b>Subtotal:</b> _____________
            </td>
          </tr>


          <tr>
            <td
              colSpan={20}
              style={{ border: 0, height: '0.1in', fontSize: '90%' }}
            >
              <i>* Additional sheet/s may be used, if necessary.</i>
            </td>
            <td
              colSpan={11}
              style={{ border: 0, height: '0.1in', fontSize: '90%' }}
            >
              <b>&nbsp;&nbsp;TOTAL ASSETS (a+b): _____________</b>
            </td>
          </tr>


          <tr>
            <td
              colSpan={31}
              style={{
                border: 0,
                height: '0.1in',
                fontSize: '90%',
                textAlign: 'center',
              }}
            >
              <br />
              <i>Page 1 of ____</i>
            </td>
          </tr>
        </table>
        {/* Next Button */}
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          color="darkgray"
          sx={{
            position: 'right',
            marginTop: '-50px',
            marginRight: '7.50in',
            '&:hover': {
              backgroundColor: 'black',
              color: 'lightgray',
            },
          }}
        >
          Next
        </Button>
      </table>
    </div>
  );
};


export default SalnFront;



