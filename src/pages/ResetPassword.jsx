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
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../services/api";
import { toast } from "react-toastify";
import AuthButton from "../components/customized/AuthButton";

function ResetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocking] = useState(false);

  const { token } = useParams();

  const formSchema = yup.object({
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 charcters"),
  });

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { password: "" },
    mode: "onChange",
    resolver: yupResolver(formSchema),
  });

  const makeSubmission = async (data) => {
    setIsLoading(true);
    setIsBlocking(true);
    try {
      //data=password
      const res = await api.post(`/api/auth/reset-password/${token}`, data);
      toast.success(res.data.message, {
        style: {
          width: "500px",
        },
        onOpen: () => {
          setIsBlocking(true);
        },
        onClose: () => {
          setIsBlocking(false);
          navigate("/login",{replace:true});
        },
      });
      
    } catch (err) {
      // api network error connection so there is no senr req so no res thats why i depend on .code not .status
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
      //token's time has been expired error 
      else if (err.response.status === 400 )  {
        toast.error(err.response.data.message, {
          style: {
            width: "500px",
          },
          onOpen: () => {
            setIsBlocking(true);
          },
          onClose: () => {
            setIsBlocking(false);
            navigate("/forgot-password");
          },
        });
        
      }

      // api error
      else if (err.response.status === 500){
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
        height: "100vh",
        width: "100%",
        /*   minHeight: "100vh", */
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
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "none",
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          <motion.div variants={itemVariants}>
            <CardHeader title="New Password" />
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
              {/* password Field */}
              <motion.div variants={itemVariants}>
                <TextField
                 type="password"
                  label="Password "
                  fullWidth
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
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
                    "Confirm"
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
        </Card>
      </motion.div>
    </Box>
  );
}

export default ResetPassword;
