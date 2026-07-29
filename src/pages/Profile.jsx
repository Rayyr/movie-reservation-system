import {
  Box,
  Card,
  Typography,
  CardContent,
  CardHeader,
  CircularProgress,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { GoChevronLeft } from "react-icons/go";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import AuthButton from "../components/user-defined/AuthButton";
import { Controller } from "react-hook-form";
import { MdOutlineEdit } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocking] = useState(false);

  const { user } = useContext(AuthContext);

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
      .min(3, "Username must be at least 3 characters")
      .matches(
        /^[a-zA-Z][a-zA-Z0-9]*$/,
        "Username must not contain special characters or start with them",
      ),

    password: yup
      .string()
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
      username: `${user.username}`,
      password: `${user.password}`,
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
    <>
      {/* Back to Dashboard */}
      <motion.div
        variants={itemVariants}
        style={{
          position: "absolute",
          top: "30px",
          left: "70px",
          zIndex: 10,
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
            pointerEvents: isLoading || isBlocked ? "none" : "auto", // ✅ (actually as a disable prop it is not disabled but as style ) disables click
          }}
        >
          <GoChevronLeft size={18} style={{ display: "block" }} />
          <Typography variant="body1" sx={{ lineHeight: 1, fontWeight: 500 }}>
            Dashboard
          </Typography>
        </Box>
      </motion.div>

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
                title={`Edit profile`}
                subheader="Make changes to your profile here. Click save when you're done"
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
                  <AuthButton
                    isBlocked={isBlocked}
                    isLoading={isLoading}
                    isValid={isValid}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <MdOutlineEdit />
                        Save changes
                      </span>
                    )}
                  </AuthButton>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </>
  );
}

//go back btn ==close
