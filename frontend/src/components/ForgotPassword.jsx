import React, { useState } from "react";
import logo from "../assets/logo.PNG";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: Code, 3: Password
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [errMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [passwordConfirmed, setPasswordConfirmed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showVerificationModal, setShowVerificationModal] = useState(false);


  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errMessage) setErrorMessage("");
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

     if (response.ok) {
      setCurrentStep(2);
      setShowVerificationModal(true);
    } else {
      setErrorMessage(data.error || "Failed to send verification code.");
    }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    if (!formData.verificationCode) {
      setErrorMessage("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep(3);
      } else {
        setErrorMessage(data.error || "Invalid verification code.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.newPassword || !formData.confirmPassword) {
      setErrorMessage("Please fill in both password fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!passwordConfirmed) {
      setErrorMessage("Please confirm that you want to change your password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(data.error || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    window.location.href = "/";
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div style={{
              marginBottom: "24px",
              color: "#666",
              fontSize: "14px",
              lineHeight: "1.5",
            }}>
              Enter your email address and we'll send you a verification code to reset your password.
            </div>
            
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChanges}
              style={{
                width: "100%",
                padding: "12px 16px",
                marginBottom: "24px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              required
            />

            <button
              onClick={handleSubmitEmail}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 24px",
                backgroundColor: loading ? "#cccccc" : "#A31D1D",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        );

      case 2:
        return (
          <div>
            <div style={{
              marginBottom: "24px",
              color: "#666",
              fontSize: "14px",
              lineHeight: "1.5",
            }}>
              Enter the 6-digit verification code sent to {formData.email}
            </div>
            
            <input
              type="text"
              name="verificationCode"
              placeholder="○○○○○○"
              value={formData.verificationCode}
              onChange={handleChanges}
              maxLength={6}
              style={{
                width: "100%",
                padding: "16px",
                marginBottom: "24px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1.5rem",
                textAlign: "center",
                letterSpacing: "0.5em",
                boxSizing: "border-box",
              }}
              required
            />

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  backgroundColor: "white",
                  color: "#A31D1D",
                  border: "1px solid #A31D1D",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Back
              </button>
              <button
                onClick={handleVerifyCode}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  backgroundColor: loading ? "#cccccc" : "#A31D1D",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <div style={{
              marginBottom: "24px",
              color: "#666",
              fontSize: "14px",
              lineHeight: "1.5",
            }}>
              Create a new password for your account.
            </div>
            
            <div style={{
              position: "relative",
              marginBottom: "24px",
            }}>
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChanges}
                style={{
                  width: "100%",
                  padding: "12px 25px 12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#666",
                }}
              >
              </button>
            </div>

            <div style={{
              position: "relative",
              marginBottom: "24px",
            }}>
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChanges}
                style={{
                  width: "100%",
                  padding: "12px 25px 12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#666",
                }}
              >
              </button>
            </div>

            <div style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "24px",
              textAlign: "left",
              gap: "8px",
            }}>
              <input
                type="checkbox"
                checked={passwordConfirmed}
                onChange={(e) => setPasswordConfirmed(e.target.checked)}
                style={{
                  marginTop: "2px",
                }}
              />
              <label>I confirm that I want to change my password</label>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}>
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  backgroundColor: "white",
                  color: "#A31D1D",
                  border: "1px solid #A31D1D",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Back
              </button>
              <button
                onClick={handleResetPassword}
                disabled={loading || !passwordConfirmed}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  backgroundColor: (loading || !passwordConfirmed) ? "#cccccc" : "#A31D1D",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: (loading || !passwordConfirmed) ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "70vh",
        backgroundColor: "#fff8e1",
      }}
    >
      <div style={{
        padding: "32px",
        width: "100%",
        maxWidth: "400px",
        borderRadius: "8px",
        textAlign: "center",
        backgroundColor: "white",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      }}>
        {/* Logo Section */}
        <div style={{
          backgroundColor: "#A31D1D",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
          marginLeft: "-32px",
          marginRight: "-32px",
          marginTop: "-32px",
        }}>
          <img
            src={logo}
            alt="E.A.R.I.S.T Logo"
            style={{
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "white",
              padding: "4px",
            }}
          />
        </div>

        {/* Header */}
        <div style={{
          fontSize: "1.125rem",
          fontWeight: "bold",
          marginTop: "40px",
          marginBottom: "16px",
        }}>
          {currentStep === 1 && "Reset Your Password"}
          {currentStep === 2 && "Enter Verification Code"}
          {currentStep === 3 && "Create New Password"}
        </div>

        {/* Step Indicator */}
        <div style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "center",
          gap: "6px",
        }}>
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.875rem",
                backgroundColor: currentStep >= step ? "#A31D1D" : "#e0e0e0",
                color: currentStep >= step ? "white" : "#999",
              }}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {errMessage && (
          <div style={{
            padding: "12px 16px",
            marginBottom: "16px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "4px",
            color: "#dc2626",
            fontSize: "14px",
          }}>
            {errMessage}
          </div>
        )}

        {/* Step Content */}
        {renderStepContent()}

        {/* Back to login link */}
        <div style={{
          marginTop: "24px",
          fontSize: "14px",
        }}>
          Remember your password?{" "}
          <a href="/" style={{
            color: "black",
            fontWeight: "bold",
            fontSize: "13px",
            textDecoration: "none",
          }}>
            Login
          </a>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "8px",
            textAlign: "center",
            maxWidth: "400px",
            width: "90%",
          }}>
            <div style={{
              fontSize: "60px",
              color: "#4caf50",
              marginBottom: "16px",
            }}>✅</div>
            <div style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "16px",
              color: "#333",
            }}>
              Password Updated Successfully!
            </div>
            <div style={{
              color: "#666",
              marginBottom: "24px",
              lineHeight: "1.5",
            }}>
              Your password has been successfully updated. You can now login with your new password.
            </div>
            <button
              onClick={handleSuccessClose}
              style={{
                width: "100%",
                padding: "12px 24px",
                backgroundColor: "#A31D1D",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}

      {/* Verification Code Sent Modal */}
{showVerificationModal && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  }}>
    <div style={{
      backgroundColor: "white",
      padding: "32px",
      borderRadius: "8px",
      textAlign: "center",
      maxWidth: "400px",
      width: "90%",
    }}>
      <div style={{
        fontSize: "50px",
        color: "#6d2323",
        marginBottom: "16px",
      }}>✉</div>
      <div style={{
        fontSize: "1.25rem",
        fontWeight: "bold",
        marginBottom: "16px",
        color: "#333",
      }}>
        Verification Code Sent
      </div>
      <div style={{
        color: "#666",
        marginBottom: "24px",
        lineHeight: "1.5",
      }}>
        A verification code has been sent to <b>{formData.email}</b>.  
        Please check your inbox and enter the code to proceed.
      </div>
      <button
        onClick={() => setShowVerificationModal(false)}
        style={{
          width: "100%",
          padding: "12px 24px",
          backgroundColor: "#A31D1D",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Okay
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default ForgotPassword;