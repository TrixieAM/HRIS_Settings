import React, {useState} from "react";
import "../pages/css/components.css";
const PDS4 = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedThumbmark, setUploadedThumbmark] = useState(null);
  const [uploadedSignature, setUploadedSignature] = useState(null);

    const handleThumbmarkUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedThumbmark(reader.result); // Store the uploaded thumbmark as a base64 URL
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSignatureUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedSignature(reader.result); // Store the uploaded image as a base64 URL
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImage(reader.result); // Store the uploaded image as a base64 URL
        };
        reader.readAsDataURL(file);
      }
    };



  return (
    <div
      style={{
        border: "1px solid black",
        padding: "0.25in",
        width: "8in",
        marginBottom: "7%",
        height: "fit-content",
      }}
    >
      <table
        style={{
          border: "1px solid black",
          borderCollapse: "collapse",
          fontFamily: "Arial, Helvetica, sans-serif",
          width: "8in",
          tableLayout: "fixed",
        }}
      >
        <tbody>
          <tr>
            <td
              colSpan={12}
              style={{
                height: "1in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
              }}
            >
              34.  Are you related by consanguinity or affinity to the
              appointing or recommending authority, or to the
              <br />
              chief of bureau or office or to the person who has immediate
              supervision over you in the Office,
              <br />
              Bureau or Department where you will be apppointed,
              <br />
              <br />
              a. within the third degree?
              <br />
              <br />
              b. within the fourth degree (for Local Government Unit - Career
              Employees)?
              <br />
              <br />
              <br />
            </td>
            <td
              colSpan={6}
              style={{
                height: "1in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <br />
              <br />
              <br />
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>
              <br />
              <br />
              <br />
              <br />
              If YES, give details: <input type="text" style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderWidth: '1px', marginBottom: '1rem', outline: 'none'}}/>
              <br />
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td
              colSpan={12}
              rowSpan={2}
              style={{
                height: "1.5in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
              }}
            >
              35.  a. Have you ever been found guilty of any administrative
              offense?
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              b. Have you been criminally charged before any court?
              <br />
              <br />
              <br />
              <br />
              <br />
            </td>
            <td
              colSpan={6}
              style={{
                height: "0.75in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>
              <br />
              If YES, give details: <input type="text" style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderWidth: '1px', marginBottom: '1rem', outline: 'none'}}/>
              <br />
            </td>
          </tr>
          <tr>
            <td
              colSpan={6}
              style={{
                height: "0.75in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>  
              <br />
              If YES, give details: <input type="text" style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderWidth: '1px', marginBottom: '1rem', outline: 'none'}}/>
            </td>
          </tr>
          <tr>
            <td
              colSpan={12}
              style={{
                height: "0.5in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
              }}
            >
              <br />
              36.  Have you ever been convicted of any crime or violation of any
              law, decree, ordinance or
              <br />
              regulation by any court or tribunal?
              <br />
              <br />
              <br />
            </td>
            <td
              colSpan={6}
              style={{
                height: "0.5in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>
              <br />
              If YES, give details: <input type="text" style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderWidth: '1px', marginBottom: '1rem', outline: 'none'}}/>
              <br />
            </td>
          </tr>
          <tr>
            <td
              colSpan={12}
              style={{
                height: "0.5in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
              }}
            >
              <br />
              37.  Have you ever been separated from the service in any of the
              following modes: resignation,
              <br />
              retirement, dropped from the rolls, dismissal, termination, end of
              term, finished contract or phased
              <br />
              out (abolition) in the public or private sector?
              <br />
              <br />
            </td>
            <td
              colSpan={6}
              style={{
                height: "0.5in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>
              <br />
              If YES, give details: <input type="text" style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderWidth: '1px', marginBottom: '1rem', outline: 'none'}}/>
              <br />
            </td>
          </tr>
          <tr>
            <td
              colSpan={12}
              style={{
                height: "1.05in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
              }}
            >
              38.  a. Have you ever been a candidate in a national or local
              election held within the last year (except
              <br />
              Barangay election)?
              <br />
              <br />
              <br />
              b. Have you resigned from the government service during the three
              (3)-month period before the
              <br />
              last election to promote/actively campaign for a national or local
              candidate?
              <br />
              <br />
            </td>
            <td
              colSpan={6}
              style={{
                height: "1in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <br />
              <br />
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>
              <br />
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>
              <br />
              <br />
              If YES, give details: <input type="text" style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderWidth: '1px', marginBottom: '1rem', outline: 'none'}}/>
              <br />
            </td>
          </tr>
          <tr>
            <td
              colSpan={12}
              style={{
                height: "0.5in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
              }}
            >
              <br />
              39.  Have you acquired the status of an immigrant or permanent
              resident of another country?
              <br />
              <br />
              <br />
              <br />
            </td>
            <td
              colSpan={6}
              style={{
                height: "0.5in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>
              <br />
              If YES, give details (country): <input type="text" style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderWidth: '1px', marginBottom: '1rem', outline: 'none'}}/>
              <br />
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td
              colSpan={12}
              style={{
                height: "0.7in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
              }}
            >
              40.  Pursuant to: (a) Indigenous People's Act (RA 8371); (b) Magna
              Carta for Disabled Persons (RA
              <br />
              7277); and (c) Solo Parents Welfare Act of 2000 (RA 8972), please
              answer the following items:
              <br />
              <br />
              a. Are you a member of any indigenous group?
              <br />
              <br />
              <br />
              b. Are you a person with disability?
              <br />
              <br />
              <br />
              c. Are you a solo parent?
              <br />
              <br />
              <br />
              <br />
            </td>
            <td
              colSpan={6}
              style={{
                height: "1in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>
              <br />
              <br />
              If YES, give details: <input type="text" style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderWidth: '1px', marginBottom: '1rem', outline: 'none'}}/>
              <br />
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>
              <br />
              <br />
              If YES, please specify ID No: <input type="text" style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderWidth: '1px', marginBottom: '1rem', outline: 'none'}}/>
              <br />
              <br />
              <div className="checkBox_Container">
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">Yes</label>
                </div>
                <div className="checkBox">
                  <input type="checkbox" id="Yes" />
                  <label htmlFor="Yes">No</label>
                </div>
              </div>
              <br />
              <br />
              If YES, please specify ID No: <input type="text" style={{borderRight: 'none', borderLeft: 'none', borderTop: 'none', borderWidth: '1px', marginBottom: '1rem', outline: 'none'}}/>
              <br />
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td
              colSpan={14}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
              }}
            >
              41.   REFERENCES{" "}
              <font color="red">
                (Person not related by consanguinity or affinity to applicant
                /appointee)
              </font>
            </td>
            <td
              colSpan={4}
              rowSpan={6}
              style={{
                height: "0.1in",
                fontSize: "62.5%",
                border: "1px 1px 0px 1px solid black",
                textAlign: "center",
              }}
            >
              
              <div
                style={{
                  border: "1px solid black",
                  width: "3.5cm",
                  height: "4.5cm",
                  position: "relative",
                  left: "17.5px",
                  top: "7.5px",
                  textAlign: "center",
                }}
              >
                 {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Ensures the image scales correctly
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: "10px",
                    lineHeight: "1.2",
                    marginTop: "0.5rem",
                  }}
                  
                >
                  Click to Upload Image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
                title="Upload ID Picture"
              />
          
              
              </div>
            </td>
          </tr>
          <tr>
            <td
              colSpan={7}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
                textAlign: "center",
              }}
            >
              NAME
            </td>
            <td
              colSpan={5}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
                textAlign: "center",
              }}
            >
              ADDRESS
            </td>
            <td
              colSpan={2}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
                textAlign: "center",
              }}
            >
              TEL. NO.
            </td>
          </tr>
          <tr>
            <td
              colSpan={7}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
            <td
              colSpan={5}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
            <td
              colSpan={2}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
          </tr>
          <tr>
            <td
              colSpan={7}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
            <td
              colSpan={5}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
            <td
              colSpan={2}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
          </tr>
          <tr>
            <td
              colSpan={7}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
            <td
              colSpan={5}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
            <td
              colSpan={2}
              style={{
                height: "0.25in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
          </tr>
          <tr>
            <td
              colSpan={14}
              style={{
                height: "0.6in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
              }}
            >
              42.  I declare under oath that I have personally accomplished this
              Personal Data Sheet which is a true, correct and
              <br />
              complete statement pursuant to the provisions of pertinent laws,
              rules and regulations of the Republic of the
              <br />
              Philippines. I authorize the agency head/authorized representative
              to verify/validate the contents stated herein.
              <br />
              I agree that any misrepresentation made in this document and its
              attachments shall cause the filing of
              <br />
              administrative/criminal case/s against me.
            </td>
          </tr>
          <tr>
            <td
              colSpan={18}
              style={{
                height: "1.35in",
                fontSize: "47.5%",
                border: "0px 1px 0px 1px solid black",
              }}
            >
              <div
                style={{
                  position: "relative",
                  top: "0.06in",
                  left: "0.1in",
                  float: "left",
                }}
              >
                <table
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    width: "2.9in",
                    height: "1in",
                    tableLayout: "fixed",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          height: "0.35in",
                          fontSize: "47.5%",
                          backgroundColor: "lightgray",
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        Government Issued ID (i.e.Passport, GSIS, SSS, PRC,
                        Driver's
                        <br />
                        License, etc.) PLEASE INDICATE ID Number and Date of
                        Issuance
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          height: "0.25in",
                          fontSize: "0.6rem",
                          display: "flex",
                          marginLeft: "0.4rem",
                          alignItems: "center"
                        }}
                      >
                        Government Issued ID: <input type="text" style={{ fontSize: "0.65rem",marginLeft: "0.2rem",width: "53%",border: "none", outline: "none", background: "none"}}/>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          height: "0.25in",
                          fontSize: "0.6rem",
                          marginLeft: "1rem",
                          border: "1px solid black",
                        }}
                      >
                        &nbsp;&nbsp;ID/License/Passport No: <input type="text" style={{ fontSize: "0.65rem",marginLeft: "0.2rem",width: "50%",border: "none", outline: "none", background: "none"}}/>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          height: "0.25in",
                          fontSize: "0.6rem",
                          border: "1px solid black",
                        }}
                      >
                        &nbsp;&nbsp;Date/Place of Issuance: <input type="text" style={{ fontSize: "0.6rem",marginLeft: "0.2rem",width: "50%",border: "none", outline: "none", background: "none"}}/>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  position: "relative",
                  top: "0.08in",
                  left: "0.3in",
                  float: "left",
                }}
              >
                <table
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    width: "2.9in",
                    maxheight: "1in",
                    tableLayout: "fixed",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          height: "0.6in",
                          fontSize: "55%",
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "3.5rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                          }}
                        >
                          {uploadedSignature ? (
                            <img
                              src={uploadedSignature}
                              alt="Thumbmark"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain", // Ensures proper scaling of the thumbmark
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "gray",
                              }}
                            >
                              Click to upload your Signature
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSignatureUpload}
                            style={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              opacity: 0,
                              cursor: "pointer",
                            }}
                            title="Upload Signature"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          height: "0.1in",
                          fontSize: "55%",
                          backgroundColor: "lightgray",
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        Signature (Sign inside the box)
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          height: "0.2in",
                          fontSize: "55%",
                          border: "1px solid black",
                        }}
                      >
                        <input
                          type="text"
                          style={{
                            width: "98%",
                            border: "none",
                            outline: "none",
                            textAlign: "center",
                            background: "none",
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          height: "0.1in",
                          fontSize: "55%",
                          backgroundColor: "lightgray",
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        Date Accomplished
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  position: "relative",
                  top: "-0.05in",
                  left: "-0.15in",
                  float: "right",
                }}
              >
                <table
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    width: "1.5in",
                    height: "1in",
                    tableLayout: "fixed",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          height: "1in",
                          fontSize: "55%",
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            overflow: "hidden",
                          }}
                        >
                          {uploadedThumbmark ? (
                            <img
                              src={uploadedThumbmark}
                              alt="Thumbmark"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "6rem",
                                objectFit: "contain", // Ensures proper scaling of the thumbmark
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "gray",
                              }}
                            >
                              Click to upload your thumbmark
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbmarkUpload}
                            style={{
                              position: "absolute",
                              width: "100%",
                              height: "100%",
                              opacity: 0,
                              cursor: "pointer",
                            }}
                            title="Upload Thumbmark"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          height: "0.2in",
                          fontSize: "55%",
                          backgroundColor: "lightgray",
                          border: "1px solid black",
                          textAlign: "center",
                        }}
                      >
                        Right Thumbmark
                      </td>   
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td
              colSpan={18}
              style={{
                height: 1,
                fontSize: "0%",
                backgroundColor: "black",
                border: "0px solid white",
              }}
            ></td>
          </tr>
          <tr>
            <td
              colSpan={18}
              style={{
                height: "0.2in",
                fontSize: "62.5%",
                border: "1px 1px 0px 1px solid black",
                textAlign: "center",
              }}
            >
              <br />
              SUBSCRIBED AND SWORN to before me this ____________
             , affiant
              exhibiting his/her validly issued government ID as indicated
              above.
              <br />
              <br />
            </td>
          </tr>
          <tr>
            <td
              colSpan={6}
              rowSpan={3}
              style={{
                height: "0.7in",
                fontSize: "62.5%",
                border: "0px 1px 1px 1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
            <td
              colSpan={6}
              style={{
                height: "0.5in",
                fontSize: "62.5%",
                border: "1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
            <td
              colSpan={6}
              rowSpan={3}
              style={{
                height: "0.6in",
                fontSize: "62.5%",
                border: "0px 1px 1px 1px solid black",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
          </tr>
          <tr>
            <td
              colSpan={6}
              style={{
                height: "0.1in",
                fontSize: "62.5%",
                backgroundColor: "lightgray",
                border: "1px solid black",
                textAlign: "center",
              }}
            >
              Person Administering Oath
            </td>
          </tr>
          <tr>
            <td
              colSpan={6}
              style={{
                height: "0.1in",
                fontSize: "62.5%",
                border: "1px solid white",
                textAlign: "center",
              }}
            >
              <input
                type="text"
                style={{
                  width: "98%",
                  border: "none",
                  outline: "none",
                  background: "none",
                }}
              />
            </td>
          </tr>
          <tr>
            <td
              colSpan={18}
              style={{
                height: 1,
                fontSize: "0%",
                backgroundColor: "black",
                border: "0px solid white",
              }}
            ></td>
          </tr>
          <tr>
            <td
              colSpan={18}
              style={{
                height: "0.1in",
                fontSize: "50%",
                border: "1px solid white",
                textAlign: "right",
              }}
            >
              <i>CS FORM 212 (Revised 2017), Page 4 of 4</i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PDS4;
