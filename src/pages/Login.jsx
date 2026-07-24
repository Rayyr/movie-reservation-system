import React from "react";
import { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import ImageMasonry from "../components/built-in/ImageMasonry";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
  Link,
  CircularProgress,
} from "@mui/material";
import api from "../services/api";
import { roles } from "../constants/systemRoles";

export default function Login({
  logo,
  title,
  description,
  imageSrc,
  imageAlt,
  onSubmit,
  forgotPasswordHref,
  createAccountHref,
}) {
  const navigate = useNavigate();

  const loginFormSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .matches(/@gmail\.com$/, "Please enter valid email : example@gmail.com"),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 charcters"),
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [isBlocked, setIsBlocking] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setIsBlocking(true);
    try {
      //success login,the returned value is =res.data directlly from the interceptor before its arrival here
      const res = await api.post("/api/auth/login", data);

      if (res.role === roles.user)
        navigate("/userDashboard", { replace: true });
      if (res.role === roles.admin)
        navigate("/adminDashboard", { replace: true });
    } catch (err) {
      // api network error connection 
      if (err.code === "ERR_NETWORK")
        toast.error("No network connection", {
          style: {
            width: "500px",
          },
        });
      //invalid login error | api error
      else if (err.response.status === 400 || err.response.status === 500) {
        //  console.log(err.response.status);
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
      setIsBlocking(false);
      reset();
      clearErrors();
    }
  };

  // Animations
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
        display: "flex",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left Panel */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>MRS</motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant="h5" fontWeight="600">
                Sign in
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </motion.div>

            <Box
              component="form"
              onSubmit={handleSubmit(handleFormSubmit)}
              noValidate
              sx={{ mt: 3 }}
            >
              {/* Email */}
              <motion.div variants={itemVariants}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      fullWidth
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={isBlocked || isLoading}
                    />
                  )}
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="password"
                      label="Password"
                      fullWidth
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      disabled={isBlocked || isLoading}
                    />
                  )}
                />
              </motion.div>

              {/* Remember + Forgot */}
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                            disabled={isBlocked || isLoading}
                          />
                        }
                        label="Remember Me"
                      />
                    )}
                  />

                  <Link href={forgotPasswordHref} underline="hover">
                    Forgot Password?
                  </Link>
                </Box>
              </motion.div>

              {/* Submit */}
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={isLoading || !isValid || isBlocked}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Continue"
                  )}
                </Button>
              </motion.div>
            </Box>

            {/* Footer */}
            <motion.div variants={itemVariants}>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link href={createAccountHref} underline="hover">
                  Create one
                </Link>
              </Typography>
            </motion.div>
          </motion.div>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: { xs: "none", md: "block" },
          position: "relative",
          overflow: "hidden",
          bgcolor: "white",
        }}
      >
        <ImageMasonry />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "linear-gradient(0deg, rgba(16, 11, 27, 0.08), transparent 18%)",
          }}
        />
      </Box>
    </Box>
  );
}
