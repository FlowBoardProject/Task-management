import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth"; // Import confirmPasswordReset
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  // Function to handle forgot password
  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Reset Password",
      input: "email",
      inputLabel: "Enter your email address",
      inputPlaceholder: "Your email address",
      showCancelButton: true,
      confirmButtonText: "Send Reset Code",
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter your email!";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address!";
        }
      },
    });

    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        Swal.fire({
          icon: "success",
          title: "Email Sent!",
          text: "A password reset code has been sent to your email address.",
        }).then(async () => {
          // Prompt the user to enter the code
          const { value: code } = await Swal.fire({
            title: "Enter Reset Code",
            input: "text",
            inputLabel: "Enter the code sent to your email",
            inputPlaceholder: "Reset code",
            showCancelButton: true,
            confirmButtonText: "Verify Code",
            inputValidator: (value) => {
              if (!value) {
                return "You need to enter the code!";
              }
            },
          });

          if (code) {
            // Prompt the user to enter a new password
            const { value: newPassword } = await Swal.fire({
              title: "Enter New Password",
              input: "password",
              inputLabel: "Enter your new password",
              inputPlaceholder: "New password",
              showCancelButton: true,
              confirmButtonText: "Reset Password",
              inputValidator: (value) => {
                if (!value) {
                  return "You need to enter a new password!";
                }
                if (value.length < 6) {
                  return "Password must be at least 6 characters long!";
                }
              },
            });

            if (newPassword) {
              // Verify the code and update the password
              await confirmPasswordReset(auth, code, newPassword);
              Swal.fire({
                icon: "success",
                title: "Password Reset Successful!",
                text: "Your password has been updated successfully.",
              });
            }
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${user.displayName || user.email}!`,
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Please enter your details to sign in</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="absolute -bottom-6 text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
                {errors.password && (
                  <p className="absolute -bottom-6 text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  id="remember-me"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
