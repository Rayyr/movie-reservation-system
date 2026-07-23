import * as yup from "yup";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../services/api";
import { roles } from "../constants/systemRoles";
import { replace, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const formSchema = yup.object({
    email: yup
      .string()
      .required("Email is required!")
      .matches(/@gmail\.com$/, "Email must end with @gmail.com"),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 charcters"),
  });

  const {
    register,
    clearErrors,
    formState: { errors, isValid },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(formSchema),
    mode: "onChange",
  });

  const makeLogin = async (data) => {
    try {
      //send login info to backend api
      const res = await api.post("/api/auth/login", data);

      //handle if admin/user login
      if (data.role === roles.admin) {
        navigate("/adminDashboard" ,{replace:true});
      } else if (data.role === roles.user) {
       
        //i use replace to avoid go back to login 
        navigate("/userDashboard" ,{replace:true});
      }

      //logged in successfully
      if (res.status === 200) {
        console.log(res.data); //logged in user info
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit(makeLogin)}>
        <input type="email" placeholder="Email" {...register("email")}></input>
        {errors.email && (
          <ErrorMessage
            name="email"
            errors={errors}
            render={({ message }) => <p className="error">{message}</p>}
          />
        )}
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        ></input>
        {errors.password && (
          <ErrorMessage
            name="password"
            errors={errors}
            render={({ message }) => <p className="error">{message}</p>}
          />
        )}

        <input
          type="radio"
          id="admin"
          {...register("role")}
          value={roles.admin}
        />
        <label htmlFor="admin">Admin</label>
        <br></br>
        <input
          type="radio"
          id="user"
          {...register("role")}
          value={roles.user}
        />
        <label htmlFor="user">User</label>
        <br></br>

        <button disabled={!isValid} type="submit">
          Login
        </button>
      </form>
    </>
  );
}

export default Login;
