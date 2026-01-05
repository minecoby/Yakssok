import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./Result.css";
import { API_BASE_URL } from "../config/api";

const Result = () => {
  const { inviteCode } = useParams();

  const [durationHours, setDurationHours] = useState(""); // 약속 소요 시간(시간 단위)

  const [startHour, setStartHour] = useState(""); // "0"~"24" 또는 ""
  const [endHour, setEndHour] = useState(""); // "0"~"24" 또는 ""

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingOptimal, setLoadingOptimal] = useState(false);
  const [error, setError] = useState("");

  const [detail, setDetail] = useState(null);
  const [optimal, setOptimal] = useState(null);

  const accessToken = localStorage.getItem("access_token");

  // 날짜 정규화
  const normalizeDateStr = (raw) => {
    const onlyDate = String(raw).split("T")[0];

    const [y, m, d] = onlyDate.split("-").map(Number);
    const mm = String(m).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  const makeLocalDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return `${m}월 ${d}일`;
  };

  function formatDay(dateStr) {
    const date = makeLocalDate(dateStr);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()] + "요일";
  }

  const formatTime = (hhmm) => {
    const [hh, mm] = hhmm.split(":").map(Number);
    const total = hh * 60 + mm;

    const meridiem = total < 12 * 60 ? "오전" : "오후";
    let h24 = hh;
    if (h24 === 24) h24 = 0;

    const h12raw = h24 % 12;
    const h12 = h12raw === 0 ? 12 : h12raw;

    return `${meridiem} ${String(h12).padStart(2, "0")}시 ${String(mm).padStart(
      2,
      "0"
    )}분`;
  };

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  const toHHMM = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const isDurationEntered = durationHours !== "" && Number(durationHours) > 0;
  const isTimeRangeSelected = startHour !== "" && endHour !== "";

  const minDurationMinutes = useMemo(() => {
    const h = Number(durationHours);
    if (Number.isFinite(h) && h > 0) return Math.round(h * 60);
    return 0;
  }, [durationHours]);

  const fetchDetail = async (code) => {
    if (!code) return;

    setLoadingDetail(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${code}/detail`, {
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

  const fetchOptimal = async (code, token, minDuration = 60) => {
    if (!code) return;

    setLoadingOptimal(true);
    setError("");

    try {
      if (!token) throw new Error("로그인이 필요해요.");

      const url = new URL(`${API_BASE_URL}/appointments/${code}/optimal-times`);
      url.searchParams.set("min_duration_minutes", String(minDuration));

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
    fetchDetail(inviteCode);
  }, [inviteCode]);

  const debounceRef = useRef(null);

  useEffect(() => {
    if (!inviteCode) return;

    if (!isDurationEntered || !isTimeRangeSelected) {
      setOptimal(null);
      setError("");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchOptimal(inviteCode, accessToken, minDurationMinutes);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    inviteCode,
    accessToken,
    isDurationEntered,
    isTimeRangeSelected,
    minDurationMinutes,
  ]);

  const daysForGrid = useMemo(() => {
    if (!detail?.dates) return [];

    return detail.dates.map((d) => {
      const dateStr = normalizeDateStr(d.date);
      const date = makeLocalDate(dateStr);

      return {
        key: dateStr,
        dateStr,
        day: date.getDate(),
        dayOfWeek: date.getDay(),
        selectedDay: true,
      };
    });
  }, [detail]);

  const calendarCells = useMemo(() => {
    if (!daysForGrid.length) return [];

    const sorted = [...daysForGrid].sort((a, b) =>
      a.dateStr.localeCompare(b.dateStr)
    );

    const firstDateStr = sorted[0].dateStr;
    const lastDateStr = sorted[sorted.length - 1].dateStr;

    const firstdate = makeLocalDate(firstDateStr);
    const lastdate = makeLocalDate(lastDateStr);

    const start = new Date(firstdate);
    start.setDate(start.getDate() - start.getDay());

    const end = new Date(lastdate);
    end.setDate(end.getDate() + (6 - end.getDay()));

    const rangeMap = new Map(sorted.map((d) => [d.dateStr, d.selectedDay]));

    const cells = [];
    const cur = new Date(start);

    while (cur <= end) {
      const yyyy = cur.getFullYear();
      const mm = String(cur.getMonth() + 1).padStart(2, "0");
      const dd = String(cur.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      cells.push({
        key: dateStr,
        type: "day",
        dateStr,
        day: cur.getDate(),
        dayOfWeek: cur.getDay(),
        selectedDay: rangeMap.get(dateStr) === true,
        inRange: rangeMap.has(dateStr),
      });

      cur.setDate(cur.getDate() + 1);
    }

    return cells;
  }, [daysForGrid]);

  const monthText = useMemo(() => {
    if (!daysForGrid.length) return "";
    const date = makeLocalDate(daysForGrid[0].dateStr);
    return `${date.getMonth() + 1}월`;
  }, [daysForGrid]);

  const optimalList = useMemo(() => optimal?.optimal_times || [], [optimal]);

  const preferredStartHHMM =
    startHour === "" ? null : `${String(startHour).padStart(2, "0")}:00`;
  const preferredEndHHMM =
    endHour === "" ? null : `${String(endHour).padStart(2, "0")}:00`;

  const timeRangeError = useMemo(() => {
    if (!isDurationEntered) return "";
    if (startHour === "" || endHour === "") return "";

    const s = Number(startHour);
    const e = Number(endHour);

    if (!Number.isFinite(s) || !Number.isFinite(e)) return "";
    if (e <= s) return "종료 시간은 시작 시간보다 늦어야 해요.";

    const rangeMinutes = (e - s) * 60;
    if (rangeMinutes < minDurationMinutes) {
      return `시간대가 소요시간에 비해 짧아요.`;
    }
    return "";
  }, [isDurationEntered, startHour, endHour, minDurationMinutes]);

  const filteredOptimalList = useMemo(() => {
    if (!isDurationEntered || !isTimeRangeSelected) return [];

    if (!optimalList.length) return [];
    if (timeRangeError) return [];

    if (!preferredStartHHMM || !preferredEndHHMM) return [];

    const ps = toMinutes(preferredStartHHMM);
    const pe = toMinutes(preferredEndHHMM);

    if (pe <= ps) return [];

    const D = minDurationMinutes;

    return optimalList
      .map((item) => {
        const s = toMinutes(item.start_time);
        const e = toMinutes(item.end_time);

        const Istart = Math.max(s, ps);
        const Iend = Math.min(e, pe);

        if (Iend - Istart < D) return null;

        const pickedStart = Istart;
        const pickedEnd = Istart + D;

        return {
          ...item,
          start_time: toHHMM(pickedStart),
          end_time: toHHMM(pickedEnd),
          duration_minutes: D,
        };
      })
      .filter(Boolean);
  }, [
    isDurationEntered,
    isTimeRangeSelected,
    optimalList,
    timeRangeError,
    preferredStartHHMM,
    preferredEndHHMM,
    minDurationMinutes,
  ]);

  return (
    <div className="resultPage">
      <div className="resultContainer">
        {/* 약속 범위 */}
        <div className="rangeContainer">
          <div className="rangeText">약속 범위</div>
          <div className="weekContainer">
            <div className="monthText">{monthText}</div>

            <div className="weekGrid">
              {loadingDetail}

              {!loadingDetail && daysForGrid.length === 0}

              {!loadingDetail &&
                calendarCells.map((cell) => (
                  <div
                    key={cell.key}
                    className={`dayCell ${cell.selectedDay ? "selected" : ""}`}
                  >
                    <div
                      className={`dayText
                        ${cell.dayOfWeek === 0 ? "sunday" : ""}
                        ${cell.dayOfWeek === 6 ? "saturday" : ""}`}
                    >
                      {cell.day}
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
              약속에는&nbsp;
              <input
                type="number"
                min="1"
                max="24"
                step="1"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                placeholder="1"
                className="setInput"
              />
              시간 소요돼요.
            </label>

            <br />

            <label>
              시간대는&nbsp;
              <input
                type="number"
                min="0"
                max="24"
                step="1"
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                placeholder="0"
                className="setInput"
              />
              &nbsp;시 부터&nbsp;
              <input
                type="number"
                min="0"
                max="24"
                step="1"
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                placeholder="0"
                className="setInput"
              />
              &nbsp;시 사이면 좋겠어요.
            </label>

            {timeRangeError && (
              <div className="errorText">{timeRangeError}</div>
            )}
          </div>
        </div>

        {/* 추천 날짜 */}
        <div className="resultContent">
          {!isDurationEntered || !isTimeRangeSelected ? (
            <div className="noticeText">
              소요시간과 시간대를 입력하면 추천 시간대가 나타나요.
            </div>
          ) : (
            <>
              <div className="noticeText">
                약속하기 좋은 날짜
                <br />
                약쏙이 골라봤어요.
              </div>

              <div className="resultList">
                <>
                  {loadingOptimal}

                  {!loadingOptimal &&
                    !error &&
                    filteredOptimalList.length === 0 && (
                      <div>추천 가능한 시간이 없어요.</div>
                    )}

                  {!loadingOptimal &&
                    filteredOptimalList.slice(0, 5).map((item, index) => (
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
                            {formatTime(item.start_time)} ~{" "}
                            {formatTime(item.end_time)}
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
