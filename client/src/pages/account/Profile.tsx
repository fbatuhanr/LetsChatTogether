/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Datepicker from "tailwind-datepicker-react";

import useAxios from "../../hooks/useAxios";
import { useDecodedToken } from "../../hooks/useDecodedToken";
import { UserProps } from "../../types/User.types";
import Button from "../../components/general/clickable/Button";
import { toast } from "react-toastify";
import { AxiosError, AxiosResponse } from "axios";

import { storage } from "../../firebase/firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Img from "../../components/general/Img";
import { ApiErrorProps } from "../../types/ApiError.types";
import { resizeImage } from "../../utils/imageUtils";
import LoadingSpinnerPage from "../../components/loading/LoadingSpinnerPage";
import { errorMessages } from "../../constants/errorMessages";
import { successMessages } from "../../constants/successMessages";
import { FaTrash, FaTrashRestore } from "react-icons/fa";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const axiosInstance = useAxios();
  const decodedToken = useDecodedToken();

  const [isDatepickerVisible, setIsDatepickerVisible] =
    useState<boolean>(false);
  const [oldProfilePhotoUrl, setOldProfilePhotoUrl] = useState<string | null>(
    null
  );
  const [isPhotoDeleted, setIsPhotoDeleted] = useState(false);
  const {
    register,
    control,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<UserProps>();

  const onSubmit: SubmitHandler<UserProps> = async (data) => {
    setIsLoading(true);

    try {
      let newData = { ...data };

      if (isPhotoDeleted && oldProfilePhotoUrl) {
        const oldPhotoRef = ref(storage, oldProfilePhotoUrl);
        await deleteObject(oldPhotoRef).catch((error) => {
          console.error("Failed to delete old profile photo:", error);
        });
        newData = { ...newData, profilePhoto: "" };
        setOldProfilePhotoUrl(null);
        setIsPhotoDeleted(false);
      } else if ("File" in window && data.profilePhoto instanceof FileList) {
        if (data.profilePhoto.length > 0) {
          const file = data.profilePhoto[0];
          const resizedFile = await resizeImage(file);

          const toastId = toast.loading("Uploading profile photo...");

          const storageRef = ref(
            storage,
            `profile-photos/${Date.now()}-${resizedFile.name}`
          );
          const uploadTask = uploadBytesResumable(storageRef, resizedFile);
          const downloadUrl = await new Promise<string>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              null,
              (error) => {
                toast.dismiss(toastId);
                reject(error);
              },
              async () => {
                toast.update(toastId, {
                  render: successMessages.photoUpload,
                  type: "success",
                  isLoading: false,
                  autoClose: 2000,
                });
                resolve(await getDownloadURL(uploadTask.snapshot.ref));
              }
            );
          });
          // remove old profile photo from firebase storage
          if (oldProfilePhotoUrl) {
            const oldPhotoRef = ref(storage, oldProfilePhotoUrl);
            await deleteObject(oldPhotoRef).catch((error) => {
              console.error("Failed to delete old profile photo:", error);
            });
          }
          newData = { ...newData, profilePhoto: downloadUrl };
          setOldProfilePhotoUrl(downloadUrl);
        } else {
          newData = { ...newData, profilePhoto: "" };
        }
      }

      await toast.promise(
        axiosInstance.put(
          `${process.env.API_URL}/user/${decodedToken.userId}`,
          newData
        ),
        {
          pending: "Updating profile...",
          success: {
            render: ({ data }: { data: AxiosResponse }) =>
              data.data.message || successMessages.profileUpdate,
          },
          error: {
            render: ({ data }: { data: AxiosError<ApiErrorProps> }) =>
              data.response?.data?.message || errorMessages.profileUpdate,
          },
        }
      );

      reset({
        ...newData,
        dateOfBirth: newData.dateOfBirth ? new Date(newData.dateOfBirth) : undefined
      });
    } catch (error) {
      console.error("Profile Update Submission Error:", error);
      toast.error(errorMessages.profileUpdate);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`user/${decodedToken.userId}`);
        console.log(response.data);
        const { profilePhoto, dateOfBirth } = response.data;

        reset({
          ...response.data,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        });

        setOldProfilePhotoUrl(profilePhoto || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  const watchProfilePhoto = watch("profilePhoto");
  useEffect(() => {
    console.log(watchProfilePhoto);
  }, [watchProfilePhoto]);

  if (isLoading) return <LoadingSpinnerPage />;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-4 h-full justify-center"
    >
      <div>
        <div className="flex justify-between gap-x-2">
          <div className="w-full">
            <label htmlFor="name" className="text-2xl font-semibold ps-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500"
              placeholder="Type here..."
              {...register("name", {
                required: "Name is required",
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message:
                    "Name should only contain English letters without spaces",
                },
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters long",
                },
                maxLength: {
                  value: 50,
                  message: "Name cannot be more than 50 characters long",
                },
              })}
            />
          </div>
          <div className="w-full">
            <label htmlFor="surname" className="text-2xl font-semibold ps-2">
              Surname
            </label>
            <input
              type="text"
              id="surname"
              className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500"
              placeholder="Type here..."
              {...register("surname", {
                required: "Surname is required",
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message:
                    "Name should only contain English letters without spaces",
                },
                minLength: {
                  value: 2,
                  message: "Surname must be at least 2 characters long",
                },
                maxLength: {
                  value: 50,
                  message: "Surname cannot be more than 50 characters long",
                },
              })}
            />
          </div>
        </div>
        <div className="text-sm mt-1 px-4">
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => <p>{message}</p>}
          />
          <ErrorMessage
            errors={errors}
            name="surname"
            render={({ message }) => <p>{message}</p>}
          />
        </div>
      </div>

      <div className="flex justify-between gap-x-2">
        <div className="w-full">
          <label htmlFor="gender" className="text-2xl font-semibold ps-2">
            Gender
          </label>
          <select
            id="gender"
            className="w-full min-h-[57px] bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-200 outline-1 focus:outline-dashed outline-indigo-500"
            {...register("gender", {
              required: "Gender is required",
            })}
          >
            <option value="">Choose...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <ErrorMessage
            errors={errors}
            name="gender"
            render={({ message }) => <p>{message}</p>}
          />
        </div>
        <div className="w-full">
          <label htmlFor="dateOfBirth" className="text-2xl font-semibold ps-2">
            Date of Birth
          </label>
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{
              required: "Date of birth is required", // Required kuralı
              validate: {
                isOldEnough: (value) => {
                  if (value) {
                    const today = new Date();
                    const birthDate = new Date(value);
                    const age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();

                    if (
                      monthDiff < 0 ||
                      (monthDiff === 0 && today.getDate() < birthDate.getDate())
                    ) {
                      return age > 18 || "You must be at least 18 years old";
                    }

                    return age >= 18 || "You must be at least 18 years old";
                  }

                  return true;
                },
              },
            }}
            render={({ field }) => (
              <Datepicker
                value={field.value}
                onChange={(date) => field.onChange(date)}
                show={isDatepickerVisible}
                setShow={(state) => setIsDatepickerVisible(state)}
                options={{
                  defaultDate: field.value || null,
                  autoHide: true,
                  todayBtn: false,
                  clearBtn: true,
                  theme: {
                    background: "",
                    todayBtn: "",
                    clearBtn: "",
                    icons: "",
                    text: "",
                    disabledText: "",
                    input:
                      "!bg-[#6841f2] text-white !placeholder-white !border-[#20183F] border-2 rounded-2xl py-4 outline-1 focus:outline-dashed outline-indigo-500",
                    inputIcon: "!text-white",
                    selected: "",
                  },
                  datepickerClassNames:
                    "text-center left-0 right-0 md:left-auto md:right-auto",
                }}
              />
            )}
          />
          <ErrorMessage
            errors={errors}
            name="dateOfBirth"
            render={({ message }) => <p>{message}</p>}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="profilePhoto" className="text-2xl font-semibold ps-2">
          Photo
        </label>
        <div className="relative">
          <input
            type="file"
            id="profilePhoto"
            className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500"
            multiple={false}
            accept="image/*"
            {...register("profilePhoto", {
              validate: {
                maxSize: (files) => {
                  // Check if there are files and if the first file size exceeds 5MB
                  if (
                    files instanceof FileList &&
                    files.length > 0 &&
                    files[0].size > 5 * 1024 * 1024
                  ) {
                    return "File size must be less than 5MB.";
                  }
                  return true;
                },
              },
            })}
          />
          <div className="flex items-center justify-center w-[66px] h-[66px] absolute top-0 bottom-0 right-0 p-0.5 bg-[#20183F] rounded-tr-2xl rounded-br-2xl">
            <Img
              src={watchProfilePhoto}
              height="100%"
              width="100%"
              className="rounded-r-xl"
            />
            {watchProfilePhoto && oldProfilePhotoUrl && (
              <button
                type="button"
                onClick={() => setIsPhotoDeleted(!isPhotoDeleted)}
                className={`flex group justify-center items-center absolute inset-0 bg-black ${
                  isPhotoDeleted ? "bg-opacity-90" : "bg-opacity-35"
                } rounded-r-xl hover:bg-opacity-75`}
              >
                {isPhotoDeleted ? (
                  <FaTrashRestore className="text-xl text-green-600" />
                ) : (
                  <FaTrash className="text-xl text-red-600 opacity-85 group-hover:opacity-100" />
                )}
              </button>
            )}
          </div>
        </div>
        <ErrorMessage
          errors={errors}
          name="profilePhoto"
          render={({ message }) => <p>{message}</p>}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <label htmlFor="about" className="text-2xl font-semibold ps-2">
          About
        </label>
        <textarea
          id="about"
          className="w-full bg-[#6841f2] border-[#20183F] border-2 rounded-2xl px-6 py-4 placeholder-slate-300 outline-1 focus:outline-dashed outline-indigo-500"
          placeholder="anything about yourself..."
          {...register("about")}
          rows={4}
        />
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

export default Profile;
