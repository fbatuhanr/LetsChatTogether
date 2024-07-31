import withAuthCheck from "./withAuthCheck";

const UserGuard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default withAuthCheck(UserGuard, false, "/login");