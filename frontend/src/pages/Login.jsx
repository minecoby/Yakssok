import React from 'react';
import './Login.css';
import logoImage from "../assets/logo.png";
import googleLogo from "../assets/googleLogo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const navigateToHome = () => {
    navigate("/home");
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
            <button className='login-button' onClick={navigateToHome}>
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