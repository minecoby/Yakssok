import React, { useState } from 'react';
import './Create.css';
import SidebarLeft from '../components/SidebarLeft';
import SelectRange from '../components/SelectRange'; 
import LinkPopup from "../components/LinkPopup";
import logoImage from "../assets/createLogo.png";
import { FRONT_BASE_URL } from '../config/front';
import { API_BASE_URL } from '../config/api';
import { useNavigate } from "react-router-dom";

const Create = () => {
    const navigate = useNavigate();

    const sampleEvents = []; //좌측 사이드바용 샘플 데이터

    const [title, setTitle] = useState(""); 
    const [number, setNumber] = useState(0);
    const [selectedDates, setSelectedDates] = useState(new Set());
    const isFormValid = title.trim().length > 0 &&
                        Number(number) > 0 &&
                        selectedDates.size > 0;

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [shareLink, setShareLink] = useState("");

    const handleSubmit = async () => {
        if (!isFormValid) return;

        const dates = [...selectedDates].sort();
        const start_date = dates[0];
        const end_date = dates[dates.length - 1];

        const payload = {
            name: title.trim(),
            start_date: start_date,
            end_date: end_date,
            max_participants: Number(number),
        };

        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("로그인 정보가 없습니다. 다시 로그인해주세요. ");
            navigate("/"); 
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/appointments/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            });

            if (res.status == 401 || res.status == 403) {
                localStorage.removeItem("access_token");
                alert("로그인 정보가 만료되었어요. 다시 로그인해주세요.");
                navigate("/");
                return;
            }

            if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error("API error:", res.status, err);
            alert(`약속 생성 실패: ${res.status}`);
            return;
            }

            const data = await res.json();
            const inviteCode = data.invite_link;
            const inviteLink = `${FRONT_BASE_URL}/invite/${inviteCode}`;

            setShareLink(inviteLink);
            setIsPopupOpen(true);

        } catch (e) {
            console.error(e);
            alert("네트워크 오류로 약속 생성에 실패했어요.");
        }
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
                            max="30"
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
                        onClick={handleSubmit}
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
