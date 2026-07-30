import React, { useContext } from "react";
import { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import ImageMasonry from "../components/built-in/ImageMasonry";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoName } from "../constants/systemLogo.js";
import { AuthContext } from "../context/AuthContext.js";
import { Eye, EyeOff } from "lucide-react";
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
import AuthButton from "../components/user-defined/AuthButton";
import { startTimer } from "../utils/tokenExpiry.js";
import { IconButton, InputAdornment } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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

  const { login } = useContext(AuthContext);

  const makeSubmission = async (data) => {
    setIsLoading(true);
    setIsBlocking(true);

    try {
      //success login from backend side
      const res = await api.post("/api/auth/login", data); //data==req.body

      //frontend side login processing
      login(res.data);

      if (res.data.role === roles.user)
        navigate("/user-dashboard", { replace: true }); //important to put replace to avoid go back
      if (res.data.role === roles.admin)
        navigate("/admin-dashboard", { replace: true });
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
      //invalid login(invalid crediantial) error | api error
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
            <motion.div variants={itemVariants}>{logoName}</motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant="h5" fontWeight="600">
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary"></Typography>
            </motion.div>

            <Box
              component="form"
              onSubmit={handleSubmit(makeSubmission)}
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
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      fullWidth
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      disabled={isBlocked || isLoading}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton //child prop
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                                aria-pressed={showPassword}
                                edge="end"
                                disabled={isBlocked || isLoading}
                                onClick={togglePasswordVisibility}
                                onMouseDown={(event) => event.preventDefault()}
                              >
                                {showPassword ? (
                                  <EyeOff size={20} />
                                ) : (
                                  <Eye size={20} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
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

                  <Link
                    sx={{
                      color: "var(--blue)",
                      pointerEvents: isLoading || isBlocked ? "none" : "auto", // ✅ disables click
                    }}
                    href="/forgot-password"
                    underline="hover"
                  >
                    Forgot Password?
                  </Link>
                </Box>
              </motion.div>

              {/* Submit */}
              <motion.div variants={itemVariants}>
                <AuthButton
                  isBlocked={isBlocked}
                  isLoading={isLoading}
                  isValid={isValid}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Sign in"
                  )}
                </AuthButton>
              </motion.div>
            </Box>

            {/* Footer */}
            <motion.div variants={itemVariants}>
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link
                  sx={{
                    color: "var(--blue)",
                    pointerEvents: isLoading || isBlocked ? "none" : "auto", // ✅ disables click
                  }}
                  href={"/sign-up"}
                  underline="hover"
                >
                  Create one
                </Link>
              </Typography>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 3,
              }}
            >
              <button
                disabled={isBlocked || isLoading}
                style={{
                  pointerEvents: isLoading || isBlocked ? "none" : "auto", // ✅ disables click
                }}
                onClick={() => navigate("/")}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    fill="none"
                    stroke={`var(--red)`}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`group cursor-pointer transition-colors duration-200 hover:fill-[var(--red)]`}
                  >
                    {/* Main House Outline */}
                    <path d="M21 19v-6.733a4 4 0 0 0-1.245-2.9L13.378 3.31a2 2 0 0 0-2.755 0L4.245 9.367A4 4 0 0 0 3 12.267V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2" />

                    {/* Inner Door (flips stroke color on hover so it stays visible) */}
                    <path
                      className="transition-colors duration-200 group-hover:stroke-white"
                      d="M9 15a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6H9z"
                    />
                  </svg>{" "}
                </div>
              </button>
            </Box>
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
