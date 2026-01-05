import React from 'react';
import { useEffect } from "react"; 
import './Login.css';
import logoImage from "../assets/logo.png";
import googleLogo from "../assets/googleLogo.png";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const Login = () => {
    const navigate = useNavigate();

    // 이제 AuthCallback.jsx에서 처리하므로 주석 처리
    // const navigateToHome = () => {
    // navigate("/home");
    // };

    // 로그인 시 이미 토큰이 있으면 홈으로 이동 임시 제거
    // useEffect(() => {
    // const token = localStorage.getItem("access_token");
    // if (token) {
    //     navigate("/home", { replace: true });
    //     }
    // }, [navigate]);

    const handleGoogleLogin = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/google/login`);
            const data = await response.json();

            window.location.href = data.auth_url;
        } catch (error) {
            console.error("구글 로그인 실패", error);
        }
    };

    return (
        <div className='login-container'>
            <img src={logoImage} alt="logoImage" className='logoImage'/>
            <br />
            <span className='text'>약속 잡기,</span>
            <br />
            <span className='text-bold'>약쏙</span>
            <span className='text'>으로 더 간편하게.</span>
            <br />
            <button className='login-button' onClick={handleGoogleLogin}>
                <img src={googleLogo}
                    alt="GoogleLogo"
                    className="googleLogo"/>
                Google 계정으로 로그인
            </button>
            <br />
            <span className='login-text'>구글 계정으로 시작하세요</span>
        </div>
    );
};

export default Login;