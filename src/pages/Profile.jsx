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
import { Eye, EyeOff } from "lucide-react";

import { IconButton, InputAdornment } from "@mui/material";

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocking] = useState(false);

  const { user, setUser, syncLocalStorage } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
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
      .notRequired()
      // .min(6, "Password must be at least 6 charcters")
      .test(
        "Password validation",
        "Password nust not contain username,min len=6 chars",
        function (value) {
          let x = this.parent.username;

          //optional key
          if (!value) return true;

          if (value.includes(x)) return false; //conatins username

          if (value.length < 6) return false; //min len not 6

          return true;
        },
      ),
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors, isValid },
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      username: `${user.username}`,
      password: "",
    },
  });

  const makeSubmission = async (data) => {
    setIsLoading(true);
    setIsBlocking(true);

    try {
      //data=username,password , token will be sent automatically by api interceptor
      const res = await api.patch(`/api/user/edit-profile`, data);

      toast.success(res.data.message, {
        style: {
          width: "500px",
        },
        onOpen: () => {
          setIsBlocking(true);
        },
        onClose: () => {
          setIsBlocking(false);
          const newUser = {
            ...res.data.user, //new updated user
            token: user.token,
            /*             ...(data.password && { password: data.password }), // ✅ only if exists we will not put it in localstorage
             */
          };
          setUser(newUser);
          syncLocalStorage(newUser);
          reset({ username: data.username, password: data.password });
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
      reset();
    } finally {
      setIsLoading(false);

      clearErrors();
    }
  };

  return (
    <>
      {/* Back to Dashboard */}
      <motion.div
        variants={containerVariants}
        style={{
          position: "absolute",
          top: "30px",
          left: "70px",
          zIndex: 10,
        }}
        initial="hidden"
        animate="visible"
      >
        <Box
          onClick={() => navigate(`/${user.role.toLowerCase()}-dashboard`)} //either user/admin dashboard
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
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
                      Edit profile
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {user.lastEdit &&
                        " Last edited:" + user.lastEdit?.split("T")[0]}
                      {/* optional chain in case of null */}
                    </Typography>
                  </Box>
                }
                subheader="Make changes to your profile here. Click save when you're done"
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
                          type={showPassword ? "text" : "password"}
                          label="Password(optional)"
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
                                    onMouseDown={(event) =>
                                      event.preventDefault()
                                    }
                                  >
                                    {showPassword ? (
                                      <Eye size={20} />
                                    ) : (
                                      <EyeOff size={20} />
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

                <motion.div variants={itemVariants}>
                  <AuthButton
                    isBlocked={isBlocked}
                    isLoading={isLoading}
                    isValid={isValid && isDirty}
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
