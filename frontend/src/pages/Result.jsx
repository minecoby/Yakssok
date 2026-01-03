import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarLeft from "../components/SidebarLeft";
import "./Result.css";
import { API_BASE_URL } from "../config/api";

const Result = () => {
  const { inviteCode } = useParams();

  const sampleEvents = [
    {
      title: "11월 약속 1",
      start: "2025-11-07T09:00:00",
      end: "2025-11-07T11:00:00",
      className: "color-point-1",
    },
    {
      title: "11월 약속 2",
      start: "2025-11-08T19:00:00",
      end: "2025-11-08T21:00:00",
      className: "color-point-2",
    },
    {
      title: "11월 약속 3",
      start: "2025-11-09T16:30:00",
      end: "2025-11-09T18:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 4",
      start: "2025-11-10T16:30:00",
      end: "2025-11-10T18:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 5",
      start: "2025-11-10T10:30:00",
      end: "2025-11-10T13:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 6",
      start: "2025-11-25T10:30:00",
      end: "2025-11-25T13:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 7",
      start: "2025-11-26T10:30:00",
      end: "2025-11-26T13:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 8",
      start: "2025-11-27T10:30:00",
      end: "2025-11-27T13:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 9",
      start: "2025-11-29T10:30:00",
      end: "2025-11-29T13:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 10",
      start: "2025-11-29T17:30:00",
      end: "2025-11-29T19:00:00",
      className: "color-point-3",
    },
    {
      title: "11월 약속 11",
      start: "2025-11-29T13:30:00",
      end: "2025-11-29T15:00:00",
      className: "color-point-3",
    },
    {
      title: "12월 약속 1",
      start: "2025-12-03T13:30:00",
      end: "2025-12-03T15:00:00",
      className: "color-point-3",
    },
    {
      title: "12월 약속 2",
      start: "2025-12-05T13:30:00",
      end: "2025-12-05T15:00:00",
      className: "color-point-3",
    },
  ];

  const [daysNeeded, setDaysNeeded] = useState(""); // 약속에 필요한 일 수
  const [startTime, setStartTime] = useState(""); // 시작 시각
  const [endTime, setEndTime] = useState(""); // 종료 시각

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingOptimal, setLoadingOptimal] = useState(false);
  const [error, setError] = useState("");

  const [detail, setDetail] = useState(null);
  const [optimal, setOptimal] = useState(null);

  const accessToken = localStorage.getItem("access_token");
 
  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${m}월 ${d}일`;
  };

  function formatDay(dateStr) {
    const date = new Date(dateStr + "T00:00:00");
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()] + "요일";
  };

  const formatTime = (hhmm) => {
    const [hh] = hhmm.split(":").map(Number);
    const meridiem = hh < 12 ? "오전" : "오후";
    const h = hh % 12 === 0 ? 12 : hh % 12;
    return `${meridiem} ${String(h).padStart(2, "0")}시`;
  };

  const fetchDetail = async () => {
    if (!inviteCode) return;

    setLoadingDetail(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${inviteCode}/detail`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`detail 실패: ${res.status} ${text}`);
      }

      const data = await res.json();
      setDetail(data);
    } catch (e) {
      setError(e?.message || "detail 불러오기 실패");
    } finally {
      setLoadingDetail(false);
    }
  };

  const fetchOptimal = async (minDurationMinutes = 60) => {
    if (!inviteCode) return;

    setLoadingOptimal(true);
    setError("");

    try {
      if (!accessToken) {
        throw new Error("로그인이 필요해요 (accessToken 없음).");
      }

      const url = new URL(`${API_BASE_URL}/appointments/${inviteCode}/optimal-times`);
      url.searchParams.set("min_duration_minutes", String(minDurationMinutes));

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`optimal-times 실패: ${res.status} ${text}`);
      }

      const data = await res.json();
      setOptimal(data);
    } catch (e) {
      setError(e?.message || "optimal-times 불러오기 실패");
    } finally {
      setLoadingOptimal(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    fetchOptimal(60);
  }, [inviteCode]);

  const daysForGrid = useMemo(() => {
    if (!detail?.dates) return [];

    return detail.dates.map((d) => {
      const dateStr = typeof d.date === "string" ? d.date : String(d.date);
      const dt = new Date(dateStr + "T00:00:00");

      return {
        key: dateStr,
        dateStr,
        day: dt.getDate(),
        dayOfWeek: dt.getDay(),
        selectedDay: d.availability !== "none", // none이면 비선택처럼
      };
    });
  }, [detail]);

  const monthText = useMemo(() => {
    if (!daysForGrid.length) return "약속";
    const dt = new Date(daysForGrid[0].dateStr + "T00:00:00");
    return `${dt.getMonth() + 1}월`;
  }, [daysForGrid]);

  const optimalList = useMemo(() => optimal?.optimal_times || [], [optimal]);

  // 입력값으로 min_duration_minutes 재계산 (시간대 차이로 분 계산)
  const computeMinDuration = () => {
    const s = Number(startTime);
    const e = Number(endTime);
    if (Number.isFinite(s) && Number.isFinite(e) && e > s) return (e - s) * 60;
    return 60;
  };

  const onRefetchOptimal = () => {
    fetchOptimal(computeMinDuration());
  };

  return (
    <div className="resultPage">
      <SidebarLeft events={sampleEvents} />
      <div className="resultContainer">
        {/* 약속 범위 */}
        <div className="rangeContainer">
          <div className="rangeText">약속 범위</div>
          <div className="weekContainer">
            <div className="monthText">{monthText}</div>

            {/* 날짜 그리드 */}
            <div className="weekGrid">
              {loadingDetail && <div>범위 불러오는 중...</div>}

              {!loadingDetail && daysForGrid.length === 0 && (
                <div>약속 범위 데이터가 없어요.</div>
              )}

              {!loadingDetail &&
                daysForGrid.map((day) => (
                  <div
                    key={day.key}
                    className={`dayCell ${day.selectedDay ? "selected" : ""}`}
                  >
                    <div
                      className={`dayText
                        ${day.dayOfWeek === 0 ? "sunday" : ""} 
                        ${day.dayOfWeek === 6 ? "saturday" : ""}`}
                    >
                      {day.day}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 추가 설정 */}
        <div className="addSetting">
          <div className="noticeText">
            약속 시간을
            <br />더 구체적으로 골라볼까요?
          </div>

          <div className="setText">
            <label>
              약속에
              <input
                type="number"
                min="1"
                value={daysNeeded}
                onChange={(e) => setDaysNeeded(e.target.value)}
                placeholder="0"
                className="setInput"
              />
              일 필요해요.
            </label>
            <br />
            <label>
              약속 시간대는&nbsp;
              <input
                type="number"
                min="0"
                max="23"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="00"
                className="setInput"
              />
              시부터&nbsp;
              <input
                type="number"
                min="0"
                max="23"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="00"
                className="setInput"
              />
              시까지예요.
            </label>
            <div style={{ marginTop: 12 }}>
              <button onClick={onRefetchOptimal} disabled={loadingOptimal}>
                {loadingOptimal ? "추천 계산 중..." : "추천 다시 받기"}
              </button>
            </div>
          </div>
        </div>

        {/* 추천 날짜 */}
        <div className="resultContent">
          <div className="noticeText">
            약속하기 좋은 시간대
            <br />
            약쏙이 골라봤어요.
          </div>
          <div className="resultList">
            {loadingOptimal && <div>추천 불러오는 중...</div>}

            {!loadingOptimal && !error && optimalList.length === 0 && (
              <div>추천 가능한 시간이 없어요.</div>
            )}

            {!loadingOptimal &&
              optimalList.slice(0, 5).map((item, index) => (
                <div
                  key={`${item.date}-${item.start_time}-${index}`}
                  className="resultCard"
                >
                  <div className="resultNum">{index + 1}</div>

                  <div className="resultText">
                    <div className="resultDate">
                      {formatDate(item.date)} {formatDay(item.date)}
                    </div>
                    <div className="resultTime">
                      {formatTime(item.start_time)} ~ {formatTime(item.end_time)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
