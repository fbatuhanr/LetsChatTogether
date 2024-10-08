import HumanImg3 from "../../assets/human-3.png";
import { toast } from "react-toastify";

import useAuthentication from "../../hooks/api/useAuthentication";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/general/clickable/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";

interface SignupProps {
  username: string;
  email: string;
  password: string;
  passwordAgain: string;
}
export const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signupCall } = useAuthentication();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<SignupProps>();

  const onSubmit: SubmitHandler<SignupProps> = (data) => {
    setIsLoading(true);
    toast.promise(signupCall(data.username, data.email, data.password), {
      pending: "Information is being checked...",
      success: {
        render: ({ data }) => {
          navigate("/login");
          return `${data}`;
        },
      },
      error: { render: ({ data }) => `${data}` },
    }).finally(() => {
      setIsLoading(false);
    });
  };
  const password = watch("password", "");
  /*
    --- WITHOUT react-hook-form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordAgain) {
            toast.error("Passwords are not matching!")
            return
        }
        toast.promise(signupCall(username, email, password), {
            pending: 'Information is being checked...',
            success: {
                render: ({ data }) => {
                    navigate("/login")
                    return `${data}`;
                }
            },
            error: { render: ({ data }) => `${data}` }
        })
    }
    */
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
        <div>
          <h1 className="text-5xl font-bold">Sign up</h1>
        </div>
        <div className="relative w-11/12 md:w-full max-w-3xl min-h-[525px] px-4 md:px-8 rounded-xl bg-gradient-to-br from-[#4F22F2] to-[#20183F]">
          <div className="md:ps-24 w-full px-1 py-10 md:w-3/4 flex flex-col gap-y-2 h-full justify-center">
            <div className="flex flex-col gap-y-1">
              <label htmlFor="username" className="text-2xl font-semibold ps-2">
                Username
              </label>
              <input
                type="text"
                className="bg-[#0D0D0D] rounded-2xl px-6 py-4"
                placeholder="type here..."
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^(?=[a-z][a-z0-9._-]{2,15}$)[a-z0-9._-]*$/,
                    message:
                      "Must be 3-16 char long and only lower letters, digits, ., _, or -.",
                  },
                })}
              />
              <div className="text-sm px-4 min-h-5">
                <ErrorMessage
                  errors={errors}
                  name="username"
                  render={({ message }) => <p>{message}</p>}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="email" className="text-2xl font-semibold ps-2">
                Email
              </label>
              <input
                type="text"
                className="bg-[#0D0D0D] rounded-2xl px-6 py-4"
                placeholder="type here..."
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              <div className="text-sm px-4 min-h-5">
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => <p>{message}</p>}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="password" className="text-2xl font-semibold ps-2">
                Password
              </label>
              <input
                type="password"
                className="bg-[#0D0D0D] rounded-2xl px-6 py-4"
                placeholder="type here..."
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^[A-Za-z\d]{8,20}$/,
                    message:
                      "Must be 8-20 char long and include only letters and digits",
                  },
                })}
              />
              <div className="text-sm px-4 min-h-5">
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => <p>{message}</p>}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-1">
              <label htmlFor="password" className="text-2xl font-semibold ps-2">
                Password Again
              </label>
              <input
                type="password"
                className="bg-[#0D0D0D] rounded-2xl px-6 py-4"
                placeholder="type here..."
                {...register("passwordAgain", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <div className="text-sm px-4 min-h-5">
                <ErrorMessage
                  errors={errors}
                  name="passwordAgain"
                  render={({ message }) => <p>{message}</p>}
                />
              </div>
            </div>
            <Button
              disabled={isLoading}
              text="Sign up"
              color="primary"
              size="2xl"
              rounded="2xl"
              innerHeight={3}
              className="mt-2"
            />
            <p className="mt-2 underline">
              <Link to="/login">Already have an account? Login</Link>
            </p>
          </div>
          <div className="absolute top-16 -right-20 -mr-0.5">
            <img src={HumanImg3} className="w-56 animate-bounceNotify" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Signup;
