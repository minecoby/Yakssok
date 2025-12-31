import React, { useState } from 'react';
import './Create.css';
import { useNavigate } from "react-router-dom";
import SidebarLeft from '../components/SidebarLeft';
import SelectRange from '../components/SelectRange'; 
import LinkPopup from "../components/LinkPopup";
import logoImage from "../assets/createLogo.png";

const Create = () => {
    const navigate = useNavigate();

    const sampleEvents = []; 
    const [title, setTitle] = useState(""); 
    const [number, setNumber] = useState(0);
    const [selectedDates, setSelectedDates] = useState(new Set());
    const isFormValid = title.trim().length > 0 &&
                        Number(number) > 0 &&
                        selectedDates.size > 0;

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [shareLink, setShareLink] = useState("");

    const handleSubmit = () => {
        if (!isFormValid) return;

        const fakeLink = `http://yakssok111.com`;
        setShareLink(fakeLink);
        setIsPopupOpen(true);
    };


    return (
        <div className='create-container'>
            <SidebarLeft events={sampleEvents} />
            <main className='main-content'>
                <img src={logoImage} alt="logoImage" className='logoImage'/>
                <br/>
                <form>
                    <p className='request-text'>새로운 약속의 이름을 알려주세요</p>
                    <p className='input-index'>약속 이름</p>
                    <input
                        className="title-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="새로운 약속 이름"
                    />
                    <p className='request-text'>약속에 몇명의 인원이<br/>참여하나요?</p>
                    <div className='number-input'>
                        <span className='num-index-1'>참여인원</span>
                        <input
                            type="number"
                            className="number-box"
                            min="0"
                            max="10"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                        <span className='num-index-2'>명</span>
                    </div>
                    <p className='request-text'>어느 기간 안에서<br/>약속을 정하면 좋을까요?</p>
                    <SelectRange value={selectedDates} onChange={setSelectedDates} />
                    <button
                        type="button"
                        className="submit-button"
                        disabled={!isFormValid}
                        onClick={() => {
                            if (!isFormValid) return;
                            console.log("제출 데이터:", {
                                title,
                                number,
                                dates: [...selectedDates],
                            });
                            handleSubmit(); 
                        }}
                    >
                        {isFormValid ? "약속 만들기" : "아직 비어있는 칸이 있어요"}
                    </button>
                    <LinkPopup
                        open={isPopupOpen}
                        link={shareLink}
                        onClose={() => setIsPopupOpen(false)}
                    />
                </form>
            </main>
            
        </div>
    );
};

export default Create;
