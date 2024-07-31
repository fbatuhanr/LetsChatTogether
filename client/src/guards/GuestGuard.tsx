import withAuthCheck from "./withAuthCheck";

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default withAuthCheck(GuestGuard, true, "/");