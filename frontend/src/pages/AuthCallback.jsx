import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");

    if (token) {
      localStorage.setItem("access_token", token);

      const code = sessionStorage.getItem("invite-code"); 
      sessionStorage.removeItem("invite-code"); 

      //navigate("/home", { replace: true });
      // OAuth 콜백에서는 window.location 사용
      if (code === null) {
        window.location.replace("/home");
      }
      else {
        window.location.replace(`/invite/${code}`);
      }
      
    } else {
      sessionStorage.removeItem("invite-code");
      navigate("/");
    }
  }, []);

  return <div>로그인 중입니다</div>;
};

export default AuthCallback;