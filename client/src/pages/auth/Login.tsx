import HumanImg3 from "../../assets/human-3.png";

import useAuthentication from "../../hooks/api/useAuthentication";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Button from "../../components/general/clickable/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";

interface LoginProps {
  username: string;
  password: string;
}

export const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginCall } = useAuthentication();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginProps>();

  const onSubmit: SubmitHandler<LoginProps> = (data) => {
    setIsLoading(true);
    toast.promise(loginCall(data.username, data.password), {
      pending: "Information is being checked...",
      success: { render: ({ data }) => `${data}` },
      error: { render: ({ data }) => `${data}` },
    }).finally(() => {
      setIsLoading(false);
    });
  };
  /*
    --- WITHOUT react-hook-form
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        toast.promise(loginCall(username, password), {
            pending: 'Information is being checked...',
            success: { render: ({ data }) => `${data}` },
            error: { render: ({ data }) => `${data}` }
        })
    }*/
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
        <div>
          <h1 className="text-5xl font-bold">Login</h1>
        </div>
        <div className="relative w-11/12 md:w-full max-w-3xl h-[440px] px-4 md:px-8 rounded-xl bg-gradient-to-br from-[#4F22F2] to-[#20183F]">
          <div className="md:ps-24 w-full px-1 md:w-3/4 flex flex-col gap-y-2 h-full justify-center">
            <div className="flex flex-col gap-y-1">
              <label htmlFor="username" className="text-2xl font-semibold ps-2">
                Username
              </label>
              <input
                type="text"
                className="bg-[#0D0D0D] rounded-2xl px-6 py-4"
                placeholder="type here..."
                {...register("username", { required: "Username is required" })}
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
              <label htmlFor="password" className="text-2xl font-semibold ps-2">
                Password
              </label>
              <input
                type="password"
                className="bg-[#0D0D0D] rounded-2xl px-6 py-4"
                placeholder="type here..."
                {...register("password", { required: "Password is required" })}
              />
              <div className="text-sm px-4 min-h-5">
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => <p>{message}</p>}
                />
              </div>
            </div>

            <Button
              disabled={isLoading}
              text="Login"
              color="primary"
              size="2xl"
              rounded="2xl"
              innerHeight={3}
              className="mt-2"
            />

            <p className="mt-2 underline">
              <Link to="/signup">No account yet? Sign up</Link>
            </p>
          </div>
          <div className="absolute top-4 -right-24 mr-2 md:-right-20 md:-mr-0.5">
            <img src={HumanImg3} className="w-56 animate-smallBounce" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
