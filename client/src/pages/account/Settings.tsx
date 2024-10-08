/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { useDecodedToken } from "../../hooks/useDecodedToken";
import useAxios from "../../hooks/useAxios";
import Button from "../../components/general/clickable/Button";
import { UserProps } from "../../types/User.types";
import { toast } from "react-toastify";
import { AxiosError, AxiosResponse } from "axios";
import { ApiErrorProps } from "../../types/ApiError.types";
import LoadingSpinnerPage from "../../components/loading/LoadingSpinnerPage";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);

  const axiosInstance = useAxios();
  const decodedToken = useDecodedToken();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<UserProps>();

  const onSubmit: SubmitHandler<UserProps> = async (data) => {
    setIsLoading(true);
    await toast.promise(
      axiosInstance.put(`user/${decodedToken.userId}`, data),
      {
        pending: "Updating...",
        success: {
          render: ({ data }: { data: AxiosResponse }) =>
            data.data.message || "Successfully updated!",
        },
        error: {
          render: ({ data }: { data: AxiosError<ApiErrorProps> }) =>
            data.response?.data?.message ||
            "An error occurred during the update.",
        },
      }
    );
    setIsLoading(false);
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`user/${decodedToken.userId}`);
        // console.log(response.data);

        reset({
          ...response.data,
          dateOfBirth: new Date(response.data.dateOfBirth),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [reset]);

  if (isLoading) return <LoadingSpinnerPage />;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-4 h-full justify-center"
    >
      <div className="flex flex-col gap-y-1">
        <label htmlFor="username" className="text-2xl font-semibold ps-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={decodedToken.username}
          className="bg-[#402798] border-[#20183F] border-2 rounded-2xl px-6 py-4 disabled:text-[#999999] disabled:cursor-not-allowed"
          readOnly
          disabled
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="email" className="text-2xl font-semibold ps-2">
          Email
        </label>
        <input
          type="text"
          id="email"
          className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500"
          placeholder="Type here..."
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />
        <div className="text-sm mt-1 px-4">
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => <p>{message}</p>}
          />
        </div>
      </div>

      <Button
        disabled={isLoading}
        text="Update"
        color="primary"
        innerHeight={3}
        size="2xl"
        uppercased
        className="mt-2"
      />
    </form>
  );
};

export default Settings;
