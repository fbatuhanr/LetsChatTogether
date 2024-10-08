/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthentication from "../hooks/api/useAuthentication";
import { useDecodedToken } from "../hooks/useDecodedToken";
import {
  IoIosChatboxes,
  IoIosNotifications,
  IoIosNotificationsOutline,
  IoMdClose,
  IoMdLogIn,
  IoMdLogOut,
  IoMdMenu,
} from "react-icons/io";
import { FaUser, FaUsers } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { numberClip } from "../utils/textUtils";
import useGeneralNotifications from "../hooks/api/useGeneralNotifications";

const Header: React.FC = () => {
  const decodedToken = useDecodedToken();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { logoutCall } = useAuthentication();

  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const {
    getTotalNotificationsCount,
    getTotalUnreadMessageCount,
    getTotalIncomingRequestCount,

    fetchGeneralNotifications,
  } = useGeneralNotifications(decodedToken.userId);

  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.height = menuOpen
        ? `${headerRef.current.scrollHeight}px`
        : (headerRef.current.style.height = "125px");
    }
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logoutCall();
    navigate("/");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (notificationOpen) {
      timer = setTimeout(() => {
        setNotificationOpen(false);
      }, 4000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [notificationOpen]);

  useEffect(() => {
    fetchGeneralNotifications();
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className="bg-gradient-to-b from-[#4F22F2] to-[#0D0D0D1a] transition-height duration-500 ease-in-out overflow-hidden"
      style={{ height: "125px" }}
    >
      <div className="max-w-6xl mx-auto lg:px-12">
        <nav
          className={`w-full py-8 flex flex-col lg:flex-row lg:justify-between items-center gap-y-4`}
        >
          <div className="w-full flex justify-between pb-1 ps-7 pe-10 lg:ps-0 lg:pe-0 lg:flex-1">
            <div className="flex items-center gap-x-3 lg:gap-x-1">
              <Link
                to="/"
                className="text-[1.7rem] lg:min-w-[270px] lg:text-3xl font-bold"
              >
                Let's Chat Together
              </Link>
              {decodedToken?.username && (
                <div className="z-20 relative flex items-center mt-0.5 lg:mt-1">
                  <button
                    type="button"
                    onClick={() => setNotificationOpen(!notificationOpen)}
                  >
                    {getTotalNotificationsCount() > 0 ? (
                      <>
                        <IoIosNotifications size={30} />
                        <div className="absolute bottom-1.5 -right-0.5 bg-[#6841F2] text-white w-4 h-4 text-[0.8rem] flex justify-center items-center rounded-full">
                          {numberClip(getTotalNotificationsCount())}
                        </div>
                      </>
                    ) : (
                      <IoIosNotificationsOutline size={30} />
                    )}
                  </button>
                  {notificationOpen &&
                    (getTotalNotificationsCount() > 0 ? (
                      <div className="flex absolute top-10 bg-[#6841F2] text-white border border-[#0D0D0D] rounded">
                        <Link
                          to="/chat"
                          onClick={() => setNotificationOpen(false)}
                          className="relative ps-2 pe-3 py-1 border-r-2 border-[#0D0D0D]"
                        >
                          <IoIosChatboxes size={26} />
                          <div className="absolute bottom-1 right-1 bg-[#472DA6] text-white text-[0.6rem] flex justify-center items-center w-4 h-4 rounded-full">
                            <span>
                              {numberClip(getTotalUnreadMessageCount())}
                            </span>
                          </div>
                        </Link>
                        <Link
                          to="/account/friends"
                          onClick={() => setNotificationOpen(false)}
                          className="px-3 py-1"
                        >
                          <FaUsers size={26} />
                          <div className="absolute bottom-1 right-1 bg-[#472DA6] text-white text-[0.6rem] flex justify-center items-center w-4 h-4 rounded-full">
                            <span>
                              {numberClip(getTotalIncomingRequestCount())}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ) : (
                      <div className="absolute -right-10 lg:right-auto lg:-left-14 top-12 lg:top-8 text-white w-[275px] px-4">
                        You do not have any notifications!
                      </div>
                    ))}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setNotificationOpen(false);
              }}
              className="lg:hidden text-4xl"
            >
              {menuOpen ? <IoMdClose /> : <IoMdMenu />}
            </button>
          </div>
          <div
            className={`${
              menuOpen ? "flex" : "hidden"
            } w-full flex-col px-9 gap-y-2.5 lg:flex lg:flex-row lg:justify-end lg:items-center lg:px-0 lg:gap-y-0 ${
              decodedToken?.username ? "lg:gap-x-7" : "lg:gap-x-4"
            }`}
          >
            {decodedToken?.username ? (
              <>
                <div className="text-2xl font-semibold pb-1 border-b lg:border-0">
                  <Link
                    to="/chat"
                    className="flex items-center gap-x-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IoIosChatboxes size={25} />
                    Chat
                  </Link>
                </div>
                <div className="text-2xl font-semibold pb-1 border-b lg:border-0">
                  <Link
                    to="/users"
                    className="flex items-center gap-x-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUsers size={25} />
                    Users
                  </Link>
                </div>
                <div className="text-2xl font-semibold pb-1 border-b lg:border-0">
                  <Link
                    to={`/user/${decodedToken.username}`}
                    className="flex items-center gap-x-0.5"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUser size={16.5} />
                    {decodedToken.username}
                  </Link>
                </div>
                <div className="text-2xl font-semibold pb-1 border-b lg:border-0">
                  <Link
                    to="/account/friends"
                    className="flex items-center gap-x-0"
                    onClick={() => setMenuOpen(false)}
                  >
                    <MdManageAccounts size={26} />
                    Account
                  </Link>
                </div>
                <div className="flex items-end gap-x-2 pb-1 lg:flex-none lg:relative lg:ml-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-2xl font-semibold text-[#F52525] flex items-center gap-x-0.5"
                  >
                    <IoMdLogOut />
                    Logout
                  </button>
                  <span className="mb-1 lg:mb-0 text-[0.75rem] lg:text-[0.65rem] text-[#cccccc] lg:absolute lg:-top-2 lg:-right-2">
                    ({decodedToken.username})
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-2xl font-semibold pb-1 border-b mb-1 lg:border-0 lg:mr-5 lg:mb-0">
                  <Link
                    to="/users"
                    className="flex items-center gap-x-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUsers size={25} />
                    Users
                  </Link>
                </div>
                <div className="text-2xl font-semibold pb-1">
                  <Link
                    to="/login"
                    className="flex items-center gap-x-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IoMdLogIn size={26} />
                    Login
                  </Link>
                </div>
                <div className="text-2xl font-semibold pb-1">
                  <Link
                    to="/signup"
                    className="flex items-center gap-x-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    <IoMdLogIn size={26} className="lg:hidden" />
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
