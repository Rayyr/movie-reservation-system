import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import { roles } from "../constants/systemRoles";
import { logoName } from "../constants/systemLogo";
import AuthButton from "../components/user-defined/AuthButton";
import { Controller } from "react-hook-form";
export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocking] = useState(false);

  //animation
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const formSchema = yup.object({
    username: yup
      .string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .matches(
        /^[a-zA-Z][a-zA-Z0-9]*$/,
        "Username must not contain special characters or start with them",
      ),

    email: yup
      .string()
      .required("Email is required")
      .matches(/@gmail\.com$/, "Please enter valid email : example@gmail.com"),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 charcters")
      .test(
        "Is have username",
        "Password nust not contain username",
        function (value) {
          let x = this.parent.username;
          if (value.includes(x)) return false;
          return true;
        },
      ),

    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const makeSubmission = async (data) => {
    setIsLoading(true);
    setIsBlocking(true);
    
    try {
      const res = await api.post("/api/auth/signup", data);
       
      toast.success(res.data.message, {
        style: {
          width: "500px",
        },
        onOpen: () => {
          setIsBlocking(true);
        },
        onClose: () => {
          setIsBlocking(false);
          navigate("/login");
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
      //user exists error | api error
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fff",
        px: 2,
        py: 4,
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ width: "100%", maxWidth: "560px" }}
      >
        <Card sx={{ borderRadius: 3, boxShadow: 4, p: { xs: 1, sm: 2 } }}>
          <motion.div variants={itemVariants}>
            <CardHeader
              title={`Get started with ${logoName}`}
              subheader="Join Movie Reservation and start reserving your seats."
              titleTypographyProps={{ fontWeight: 700 }}
            />
          </motion.div>

          <CardContent>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(makeSubmission)}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <motion.div variants={itemVariants}>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      fullWidth
                      margin="normal"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      disabled={isBlocked || isLoading}
                    />
                  )}
                />
              </motion.div>

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

              <motion.div variants={itemVariants}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                       type="password"
                      label="Confirm Password"
                      fullWidth
                      margin="normal"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      disabled={isBlocked || isLoading}
                    />
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <AuthButton
                  isBlocked={isBlocked}
                  isLoading={isLoading}
                  isValid={isValid}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Create account"
                  )}
                </AuthButton>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography align="center" variant="body2" sx={{ mt: 1 }}>
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{ color: "var(--blue)", fontWeight: 600 }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </motion.div>
            </Box>
          </CardContent>
        </Card>

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
                
      </motion.div>

          
              
    </Box>
  );
}
