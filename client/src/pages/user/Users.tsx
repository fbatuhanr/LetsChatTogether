import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinnerPage from "../../components/loading/LoadingSpinnerPage";
import useSearchUsers from "../../hooks/api/useSearchUser";
import { UserProps } from "../../types/User.types";
import useDebounce from "../../hooks/useDebounce";
import NotFound from "../../components/NotFound";
import Img from "../../components/general/Img";

const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [limit, setLimit] = useState<number>(4);
  const [sortOrder, setSortOrder] = useState("desc");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { users, totalUsers, totalPages, isLoading } = useSearchUsers(
    debouncedSearchQuery,
    page,
    limit,
    sortOrder
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(event.target.value));
    setPage(1);
  };

  const handleSortOrderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortOrder(event.target.value);
    setPage(1);
  };

  return (
    <div className="relative flex flex-col gap-y-6 justify-center items-center bg-blur-ellipse-small bg-[center_top_-1rem] bg-[length:200px] bg-no-repeat">
      <div>
        <h1 className="text-5xl font-bold">
          Users ({totalUsers ? totalUsers : 0})
        </h1>
      </div>

      <div className="max-w-3xl w-full px-4 lg:px-0 lg:flex lg:justify-center lg:items-center gap-x-2">
        <input
          type="text"
          placeholder="Search users by name, surname or username..."
          className="w-full mb-1.5 lg:mb-0 px-6 py-3 text-lg bg-[#472DA6] rounded"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="flex justify-center gap-x-1">
          <select
            className="w-full lg:w-44 px-3 lg:px-6 py-[13.5px] text-lg bg-[#472DA6] rounded text-center"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="" disabled>
              Select Sort Order
            </option>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
          <select
            className="w-full lg:w-36 px:3 lg:px-6 py-[13.5px] text-lg bg-[#472DA6] rounded text-center"
            value={limit}
            onChange={handleLimitChange}
          >
            <option value="" disabled>
              Users per page
            </option>
            <option value={4}>4 Results</option>
            <option value={8}>8 Results</option>
            <option value={12}>12 Results</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinnerPage />
      ) : users && users?.length ? (
        <>
          <div className="max-w-6xl w-full mx-auto px-4 lg:px-12 min-h-72 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {users.map((user: UserProps, index: number) => (
              <div
                key={index}
                className="w-full h-auto pt-6 pb-7 px-1 lg:px-2 rounded-sm bg-gradient-to-t from-[#0D0D0D] to-[#472DA6] shadow shadow-[#472DA6]"
              >
                <div className="flex justify-center items-center relative w-40 h-40 mx-auto rounded-full overflow-hidden p-2 border border-[#cccccc] bg-gray-300 animate-shimmer bg-gradient-to-r from-gray-300 via-gray-50 to-gray-300 bg-[length:200%_100%]">
                  <Link to={`/user/${user.username}`}>
                    <Img
                      src={
                        typeof user.profilePhoto === "string"
                          ? user.profilePhoto
                          : ""
                      }
                      width="100%"
                      height="auto"
                      className="scale-125"
                    />
                  </Link>
                  <div className="absolute bottom-0 left-0 right-0 text-center bg-[#0D0D0D] border-t border-[#000000] bg-opacity-80 h-8">
                    <span className="font-semibold">{user.username}</span>
                  </div>
                </div>
                <div className="mt-3 mb-0.5">
                  <p className="text-center">
                    {!user.name && !user.surname ? (
                      <span className="text-[#acacac]">No Information</span>
                    ) : (
                      `${user.name && user.name} ${
                        user.surname && user.surname
                      }`
                    )}
                  </p>
                </div>
                <div className="w-4/5 mx-auto">
                  <Link
                    to={`/user/${user.username}`}
                    className="block w-full py-0.5 text-center text-xl font-bold border border-[#0D0D0D] bg-[#F2D541] rounded-xl [text-shadow:1px_1px_2px_var(--tw-shadow-color)] shadow-[#0D0D0D] relative"
                  >
                    View
                    <img
                      src={""}
                      className="absolute w-20 h-auto -top-5 -right-8"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              className={`px-4 py-2 rounded ${
                page <= 1
                  ? "bg-[#1f124d] text-gray-500 cursor-not-allowed"
                  : "bg-[#472DA6] text-white hover:bg-[#382288]"
              }`}
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="text-lg px-1">
              Page {page} of {totalPages}
            </span>
            <button
              className={`px-4 py-2 rounded ${
                page >= totalPages
                  ? "bg-[#1f124d] text-gray-500 cursor-not-allowed"
                  : "bg-[#472DA6] text-white hover:bg-[#382288]"
              }`}
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <NotFound text="No users found!" backToHomeButton />
      )}
    </div>
  );
};

export default Users;
