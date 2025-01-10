import { useState } from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../features/auth/authApi";
import { errorToast } from "@/components/Toast";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginAuthAction } from "@/features/auth/authSlice";

// Define types for Form Values
interface LoginFormValues {
  username: string;
  password: string;
}

// Define types for login response
interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const initialValues: LoginFormValues = {
    // username: "",
    // password: "",
    username:"nihad@gmail.com",
    password:"Nihad@123#"
  };

  const [login, {  }] = useLoginMutation();

  const validationSchema = Yup.object({
    username: Yup.string()
      .trim()
      .min(5, "Username or email must be at least 5 characters.")
      .max(40, "Username or email must not exceed 40 characters.")
      .matches(
        /^[a-zA-Z0-9@._]+$/,
        "Only letters, numbers, '@', '.', and '_' are allowed."
      )
      .required("Username or email is required."),
    password: Yup.string()
      .trim()
      .min(8, "Password must be at least 8 characters.")
      .max(12, "Password must not exceed 12 characters.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()!_\-+=])[A-Za-z\d@#$%^&*()!_\-+=]{8,12}$/,
        "Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 special character (@#$%^&*()!_-+=)."
      )
      .required("Password is required."),
  });

  const handleSubmit = async (
    values: LoginFormValues,
    { resetForm }: FormikHelpers<LoginFormValues>
  ): Promise<void> => {


    const data: LoginFormValues = {
      username: values.username,
      password: values.password,
    };

    try {
      const response: AuthResponse = await login(data).unwrap();

      // Store the token or perform actions after successful login
      localStorage.setItem('token', response.token);
      resetForm(); // Clear the form after submission
      navigate('/'); // Redirect to login page if not authenticated
      dispatch(loginAuthAction(response.token)); // Dispatch login action


    } catch (err) {
      if (err?.data?.message) {
        errorToast(err?.data?.message)
      } else if (Array.isArray(err?.data?.errors)) {
        for (const item of err.data.errors) {
          errorToast(item.msg)
        }
      }


    }

    console.log("Form values:", values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex max-w-md m-auto mt-6 flex-col gap-4">
          {/* Username or Email Field */}
          <div>
            <Label htmlFor="username" className="mb-2 block">
              Username or Mail ID
            </Label>
            <Field
              as={TextInput}
              id="username"
              name="username"
              type="text"
              placeholder="Enter your Username or Mail ID"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Label htmlFor="password" className="mb-2 block">
              Password
            </Label>
            <Field
              as={TextInput}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 top-6 flex items-center pr-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          {/* Submit Button */}
          <Button className="bg-black hover:!bg-black focus:!bg-black" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
