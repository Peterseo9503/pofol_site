import {
    collection,
    addDoc,
    doc,
    getDoc,
    setDoc,
    increment,
    serverTimestamp,
    query,
    orderBy,
    limit,
    getDocs
} from "firebase/firestore";
import { db } from "./firebase";

// 브라우저 및 기기 환경 정보 추출
export const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let browser = "기타 브라우저";
    let os = "기타 OS";
    let device = "Desktop";

    // 디바이스 타입
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
        device = "Tablet";
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
        device = "Mobile";
    }

    // OS 파싱
    if (/Windows NT 10.0/i.test(ua)) os = "Windows 10/11";
    else if (/Windows NT 6.3/i.test(ua)) os = "Windows 8.1";
    else if (/Windows/i.test(ua)) os = "Windows";
    else if (/Android/i.test(ua)) os = "Android";
    else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
    else if (/Mac OS X/i.test(ua)) os = "macOS";
    else if (/Linux/i.test(ua)) os = "Linux";

    // 브라우저 파싱
    if (/Whale/i.test(ua)) browser = "Whale";
    else if (/Edg/i.test(ua)) browser = "Edge";
    else if (/Chrome/i.test(ua) && !/Chromium|Edg/i.test(ua)) browser = "Chrome";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/SamsungBrowser/i.test(ua)) browser = "Samsung Internet";

    return { browser, os, device };
};

// 국가 코드(KR, US 등)로 국기 이모지 생성
export const getFlagEmoji = (countryCode) => {
    if (!countryCode || countryCode.length !== 2) return "🌐";
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

// GeoIP API 호출 (IP 및 위치 정보 획득)
export const fetchGeoInfo = async () => {
    try {
        // 1차: freeipapi.com 시도
        const res = await fetch("https://freeipapi.com/api/json", { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            return {
                ip: data.ipAddress || "알 수 없음",
                country: data.countryName || "알 수 없음",
                countryCode: data.countryCode || "KR",
                city: data.cityName || "알 수 없음",
                region: data.regionName || ""
            };
        }
    } catch (err) {
        // fallback
    }

    try {
        // 2차 fallback: ipapi.co
        const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
        if (res.ok) {
            const data = await res.json();
            return {
                ip: data.ip || "알 수 없음",
                country: data.country_name || "알 수 없음",
                countryCode: data.country_code || "KR",
                city: data.city || "알 수 없음",
                region: data.region || ""
            };
        }
    } catch (err) {
        console.warn("GeoIP 조회 실패:", err);
    }

    return {
        ip: "알 수 없음",
        country: "알 수 없음",
        countryCode: "UN",
        city: "알 수 없음",
        region: ""
    };
};

// 오늘 날짜 YYYY-MM-DD
const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// 1. 방문자 로그 및 통계 기록
export const trackVisitor = async () => {
    // 관리자 본인 접속 제외 여부
    if (localStorage.getItem("exclude_admin_tracking") === "true") {
        console.log("[Tracker] 관리자 IP 추적 제외 모드 활성화 중");
        return;
    }

    try {
        const isNewSession = !sessionStorage.getItem("portfolio_session_id");
        if (isNewSession) {
            sessionStorage.setItem("portfolio_session_id", Date.now().toString());
        }

        const geo = await fetchGeoInfo();
        const { browser, os, device } = getDeviceInfo();
        const referrer = document.referrer ? new URL(document.referrer).hostname : "직접 접속";
        const todayStr = getTodayString();

        const logData = {
            ip: geo.ip,
            country: geo.country,
            countryCode: geo.countryCode,
            city: geo.city,
            region: geo.region,
            browser,
            os,
            device,
            referrer,
            isNewSession,
            createdAt: new Date().toLocaleString("ko-KR"),
            timestamp: serverTimestamp()
        };

        // visitor_logs 컬렉션에 개별 로그 기록
        await addDoc(collection(db, "visitor_logs"), logData);

        // site_stats/summary 문서에 카운터 증가
        const statsRef = doc(db, "site_stats", "summary");
        const updatePayload = {
            totalPV: increment(1),
            [`daily.${todayStr}.pv`]: increment(1)
        };

        if (isNewSession) {
            updatePayload.totalUV = increment(1);
            updatePayload[`daily.${todayStr}.uv`] = increment(1);
        }

        await setDoc(statsRef, updatePayload, { merge: true });
    } catch (error) {
        console.error("방문자 로깅 실패:", error);
    }
};

// 2. 클릭 이벤트 기록
export const trackClick = async (category, action, label, details = {}) => {
    if (localStorage.getItem("exclude_admin_tracking") === "true") {
        return;
    }

    try {
        const todayStr = getTodayString();
        const clickData = {
            category,
            action,
            label,
            details,
            createdAt: new Date().toLocaleString("ko-KR"),
            timestamp: serverTimestamp()
        };

        // click_logs 컬렉션에 추가
        await addDoc(collection(db, "click_logs"), clickData);

        // site_stats/clicks 집계 문서에 누적
        // Firebase 문서 필드명에 특수문자나 점(.)이 들어가면 nested field로 인식되므로 안전하게 변환
        const safeKey = `${category}_${action}_${label}`.replace(/[./[\]*~]/g, '_');
        const clickStatsRef = doc(db, "site_stats", "clicks");

        await setDoc(clickStatsRef, {
            [safeKey]: {
                category,
                action,
                label,
                count: increment(1),
                lastClickedAt: new Date().toLocaleString("ko-KR")
            },
            [`daily.${todayStr}.${safeKey}`]: increment(1)
        }, { merge: true });

    } catch (error) {
        console.error("클릭 이벤트 기록 실패:", error);
    }
};

// 3. 관리자 대시보드 데이터 조회 함수들
export const getStatsSummary = async () => {
    try {
        const statsRef = doc(db, "site_stats", "summary");
        const snap = await getDoc(statsRef);
        return snap.exists() ? snap.data() : { totalPV: 0, totalUV: 0, daily: {} };
    } catch (err) {
        console.error("통계 조회 실패:", err);
        return { totalPV: 0, totalUV: 0, daily: {} };
    }
};

export const getClickSummary = async () => {
    try {
        const clickStatsRef = doc(db, "site_stats", "clicks");
        const snap = await getDoc(clickStatsRef);
        return snap.exists() ? snap.data() : {};
    } catch (err) {
        console.error("클릭 통계 조회 실패:", err);
        return {};
    }
};

export const getRecentVisitorLogs = async (count = 50) => {
    try {
        const q = query(
            collection(db, "visitor_logs"),
            orderBy("timestamp", "desc"),
            limit(count)
        );
        const querySnapshot = await getDocs(q);
        const logs = [];
        querySnapshot.forEach(doc => {
            logs.push({ id: doc.id, ...doc.data() });
        });
        return logs;
    } catch (err) {
        console.error("최근 방문 로그 조회 실패:", err);
        return [];
    }
};

export const getRecentClickLogs = async (count = 50) => {
    try {
        const q = query(
            collection(db, "click_logs"),
            orderBy("timestamp", "desc"),
            limit(count)
        );
        const querySnapshot = await getDocs(q);
        const logs = [];
        querySnapshot.forEach(doc => {
            logs.push({ id: doc.id, ...doc.data() });
        });
        return logs;
    } catch (err) {
        console.error("최근 클릭 로그 조회 실패:", err);
        return [];
    }
};
