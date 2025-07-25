import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../components/services/api";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { data: userData, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: !!token,
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else if (isSuccess && userData?.data) {
      navigate("/dashboard");
    } else if (isError) {
      navigate("/");
    }
  }, [token, isSuccess, isError, userData, navigate]);

  if (isLoading) return <div>Loading...</div>;

  return children;
};

export default AuthWrapper;
