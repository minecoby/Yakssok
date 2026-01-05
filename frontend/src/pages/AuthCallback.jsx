import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    if (token) {
      localStorage.setItem("access_token", token);

      //navigate("/home", { replace: true });
      // OAuth 콜백에서는 window.location 사용
      window.location.replace("/home");
    } else {
      navigate("/");
    }
  }, []);

  return <div>로그인 중입니다</div>;
};

export default AuthCallback;