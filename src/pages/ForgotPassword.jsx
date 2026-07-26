import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

import { GoChevronLeft } from "react-icons/go";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../services/api";
import { toast } from "react-toastify";
import AuthButton from "../components/customized/AuthButton";

function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocking] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const formSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .matches(/@gmail\.com$/, "Please enter valid email : example@gmail.com"),
  });

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { email: "" },
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });

  const makeSubmission = async (data) => {
    setIsLoading(true);
    setIsBlocking(true);
    try {
      const res = await api.post("/api/auth/forgot-password", data);
      toast.success(res.data.message, {
        style: {
          width: "500px",
        },
        onOpen: () => {
          setIsBlocking(true);
        },
        onClose: () => {
          setIsBlocking(false);
          setIsEmailSent(true);
        },
      });
    } catch (err) {
      // api network error connection
      if (err.code === "ERR_NETWORK")
        toast.error("No network connection", {
          style: {
            width: "500px",
          },
          onOpen: () => {
            setIsBlocking(true);
          },
          onClose: () => {
            setIsBlocking(false);
          },
        });
      //invalid email error | api error
      else if (err.response.status === 400 || err.response.status === 500) {
        toast.error(err.response.data.message, {
          style: {
            width: "500px",
          },
          onOpen: () => {
            setIsBlocking(true);
          },
          onClose: () => {
            setIsBlocking(false);
          },
        });
      }
    } finally {
      setIsLoading(false);
      reset();
      clearErrors();
    }
  };

  /* ------------------ ANIMATIONS ------------------ */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      {/*  Animated Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            p: 2,
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          {isEmailSent ? (
            <>
              <CardContent sx={{ py: 5, textAlign: "center" }}>
                <motion.div variants={itemVariants}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Please check your email
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 4 }}>
                  We sent a password-reset link to your email address. The link
                  expires in 15 minutes.
                </Typography>
                </motion.div>
              </CardContent>
            </>
          ) : (
            <>
              <motion.div variants={itemVariants}>
                <CardHeader
                  title="Forgot Password?"
                  subheader="Enter your email and we will send you a reset-link to your email"
                />
              </motion.div>

              <CardContent>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit(makeSubmission)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {/* Email Field */}
                  <motion.div variants={itemVariants}>
                    <TextField
                      label="Email Address"
                      fullWidth
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={isBlocked || isLoading}
                    />
                  </motion.div>

                  {/* Button */}
                  <motion.div variants={itemVariants}>
                    <AuthButton
                     isBlocked={isBlocked}
                  isLoading={isLoading}
                  isValid={isValid}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Send Reset Link" 
                      )}
                    </AuthButton>
                  </motion.div>

                  {/* Back to Login */}
                  <motion.div
                    variants={itemVariants}
                    style={{
                      textAlign: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      onClick={() => navigate("/login")}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        cursor: "pointer",
                        textAlign: "center",
                        mt: 2,
                        color: "var(--blue)",
                         pointerEvents: isLoading || isBlocked ? "none" : "auto", // ✅ disables click
                      }}
                      
                    >
                      <GoChevronLeft size={18} style={{ display: "block" }} />
                      <Typography
                        variant="body1"
                        sx={{ lineHeight: 1, fontWeight: 500 }}
                      >
                        Back to login
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>
    </Box>
  );
}

export default ForgotPassword;
