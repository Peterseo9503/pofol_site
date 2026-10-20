import React, { useState, useEffect, useCallback } from 'react';
import styles from './AdminDashboard.module.scss';
import {
    getStatsSummary,
    getClickSummary,
    getRecentVisitorLogs,
    getRecentClickLogs,
    getFlagEmoji
} from '../../services/tracker';

const AdminDashboard = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('visitors'); // 'visitors' | 'clicks'
    const [loading, setLoading] = useState(true);

    // 데이터 상태
    const [stats, setStats] = useState({ totalPV: 0, totalUV: 0, daily: {} });
    const [clickStats, setClickStats] = useState({});
    const [visitorLogs, setVisitorLogs] = useState([]);
    const [clickLogs, setClickLogs] = useState([]);

    // 관리자 추적 제외 여부
    const [excludeAdmin, setExcludeAdmin] = useState(() => {
        return localStorage.getItem('exclude_admin_tracking') === 'true';
    });

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [summaryData, clickData, vLogs, cLogs] = await Promise.all([
                getStatsSummary(),
                getClickSummary(),
                getRecentVisitorLogs(50),
                getRecentClickLogs(50)
            ]);
            setStats(summaryData);
            setClickStats(clickData);
            setVisitorLogs(vLogs);
            setClickLogs(cLogs);
        } catch (err) {
            console.error('관리자 대시보드 데이터 로드 실패:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen, loadData]);

    const handleToggleExclude = () => {
        const nextState = !excludeAdmin;
        setExcludeAdmin(nextState);
        localStorage.setItem('exclude_admin_tracking', String(nextState));
    };

    if (!isOpen) return null;

    // 오늘 통계 계산
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const todayUV = stats.daily?.[todayStr]?.uv || 0;
    const todayPV = stats.daily?.[todayStr]?.pv || 0;

    // 클릭 통계 가공
    const clickItems = Object.keys(clickStats)
        .filter(key => key !== 'daily' && clickStats[key]?.count)
        .map(key => ({
            key,
            ...clickStats[key]
        }))
        .sort((a, b) => (b.count || 0) - (a.count || 0));

    const projectClicks = clickItems.filter(item => item.category === 'Project');
    const navClicks = clickItems.filter(item => item.category === 'Navigation');

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                {/* 헤더 */}
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <h2>📈 포트폴리오 관리자 센터</h2>
                        <span className={styles.badge}>Live</span>
                    </div>
                    <div className={styles.headerActions}>
                        <label className={styles.toggleLabel} title="체크 시 관리자 본인의 접속 및 클릭은 집계에서 제외됩니다.">
                            <input
                                type="checkbox"
                                checked={excludeAdmin}
                                onChange={handleToggleExclude}
                            />
                            <span>내 접속 추적 제외 {excludeAdmin ? '(적용 중)' : ''}</span>
                        </label>
                        <button className={styles.refreshBtn} onClick={loadData} title="새로고침">
                            🔄 새로고침
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>✕</button>
                    </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className={styles.tabBar}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'visitors' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('visitors')}
                    >
                        👥 방문자 통계 & 접속 로그 ({visitorLogs.length})
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'clicks' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('clicks')}
                    >
                        🎯 클릭 & 관심도 분석 ({clickItems.length})
                    </button>
                </div>

                {/* 컨텐츠 영역 */}
                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loadingArea}>
                            <div className={styles.spinner}></div>
                            <p>데이터를 불러오는 중입니다...</p>
                        </div>
                    ) : (
                        <>
                            {/* [탭 1: 방문자 통계] */}
                            {activeTab === 'visitors' && (
                                <div className={styles.tabContent}>
                                    {/* 통계 요약 카드 */}
                                    <div className={styles.summaryGrid}>
                                        <div className={styles.summaryCard}>
                                            <div className={styles.cardIcon}>🌟</div>
                                            <div className={styles.cardInfo}>
                                                <div className={styles.cardTitle}>오늘 방문자 (UV)</div>
                                                <div className={styles.cardValue}>{todayUV.toLocaleString()} <span className={styles.cardSub}>명</span></div>
                                            </div>
                                        </div>
                                        <div className={styles.summaryCard}>
                                            <div className={styles.cardIcon}>👁️</div>
                                            <div className={styles.cardInfo}>
                                                <div className={styles.cardTitle}>오늘 페이지뷰 (PV)</div>
                                                <div className={styles.cardValue}>{todayPV.toLocaleString()} <span className={styles.cardSub}>회</span></div>
                                            </div>
                                        </div>
                                        <div className={styles.summaryCard}>
                                            <div className={styles.cardIcon}>👥</div>
                                            <div className={styles.cardInfo}>
                                                <div className={styles.cardTitle}>총 순방문자 (UV)</div>
                                                <div className={styles.cardValue}>{(stats.totalUV || 0).toLocaleString()} <span className={styles.cardSub}>명</span></div>
                                            </div>
                                        </div>
                                        <div className={styles.summaryCard}>
                                            <div className={styles.cardIcon}>📊</div>
                                            <div className={styles.cardInfo}>
                                                <div className={styles.cardTitle}>총 페이지뷰 (PV)</div>
                                                <div className={styles.cardValue}>{(stats.totalPV || 0).toLocaleString()} <span className={styles.cardSub}>회</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 최근 접속 상세 로그 테이블 */}
                                    <div className={styles.sectionTitle}>
                                        <h3>실시간 접속자 상세 로그 (최신 50건)</h3>
                                    </div>
                                    <div className={styles.tableWrapper}>
                                        <table className={styles.logTable}>
                                            <thead>
                                                <tr>
                                                    <th>접속 일시</th>
                                                    <th>국가 / 도시</th>
                                                    <th>IP 주소</th>
                                                    <th>환경 (기기 / OS)</th>
                                                    <th>브라우저</th>
                                                    <th>유입 경로</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visitorLogs.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className={styles.noData}>
                                                            아직 기록된 방문자 로그가 없습니다.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    visitorLogs.map((log) => (
                                                        <tr key={log.id}>
                                                            <td className={styles.timeCell}>{log.createdAt || '-'}</td>
                                                            <td className={styles.geoCell}>
                                                                <span className={styles.flag}>{getFlagEmoji(log.countryCode)}</span>
                                                                <span>{log.country || '알 수 없음'}</span>
                                                                {log.city && log.city !== '알 수 없음' && (
                                                                    <span className={styles.cityText}>({log.city})</span>
                                                                )}
                                                            </td>
                                                            <td className={styles.ipCell}>{log.ip || '-'}</td>
                                                            <td>
                                                                <span className={styles.deviceBadge}>{log.device || 'PC'}</span> {log.os || '-'}
                                                            </td>
                                                            <td>{log.browser || '-'}</td>
                                                            <td className={styles.referrerCell} title={log.referrer}>
                                                                {log.referrer || '직접 접속'}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* [탭 2: 클릭 분석] */}
                            {activeTab === 'clicks' && (
                                <div className={styles.tabContent}>
                                    <div className={styles.clickAnalysisGrid}>
                                        {/* 프로젝트별 클릭 순위 */}
                                        <div className={styles.analysisCard}>
                                            <h3>📂 프로젝트별 관심도 (클릭 순위)</h3>
                                            {projectClicks.length === 0 ? (
                                                <p className={styles.noData}>아직 프로젝트 클릭 기록이 없습니다.</p>
                                            ) : (
                                                <div className={styles.rankingList}>
                                                    {projectClicks.map((item, idx) => (
                                                        <div key={item.key} className={styles.rankingItem}>
                                                            <div className={styles.rankingHeader}>
                                                                <span className={styles.rankNum}>#{idx + 1}</span>
                                                                <span className={styles.itemTitle}>{item.label}</span>
                                                                <span className={styles.actionTag}>{item.action}</span>
                                                                <span className={styles.clickCount}>{item.count}회</span>
                                                            </div>
                                                            <div className={styles.barContainer}>
                                                                <div
                                                                    className={styles.barFill}
                                                                    style={{
                                                                        width: `${Math.min(100, (item.count / (projectClicks[0]?.count || 1)) * 100)}%`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* 네비게이션 메뉴 클릭 순위 */}
                                        <div className={styles.analysisCard}>
                                            <h3>🧭 상단 메뉴 이동 순위</h3>
                                            {navClicks.length === 0 ? (
                                                <p className={styles.noData}>아직 메뉴 클릭 기록이 없습니다.</p>
                                            ) : (
                                                <div className={styles.rankingList}>
                                                    {navClicks.map((item, idx) => (
                                                        <div key={item.key} className={styles.rankingItem}>
                                                            <div className={styles.rankingHeader}>
                                                                <span className={styles.rankNum}>#{idx + 1}</span>
                                                                <span className={styles.itemTitle}>{item.label}</span>
                                                                <span className={styles.clickCount}>{item.count}회</span>
                                                            </div>
                                                            <div className={styles.barContainer}>
                                                                <div
                                                                    className={`${styles.barFill} ${styles.blueBar}`}
                                                                    style={{
                                                                        width: `${Math.min(100, (item.count / (navClicks[0]?.count || 1)) * 100)}%`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 최근 실시간 클릭 스트림 */}
                                    <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                                        <h3>실시간 클릭 이벤트 로그 (최신 50건)</h3>
                                    </div>
                                    <div className={styles.tableWrapper}>
                                        <table className={styles.logTable}>
                                            <thead>
                                                <tr>
                                                    <th>클릭 일시</th>
                                                    <th>분류</th>
                                                    <th>액션</th>
                                                    <th>대상 (항목명)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {clickLogs.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="4" className={styles.noData}>
                                                            아직 클릭 이벤트 기록이 없습니다.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    clickLogs.map((log) => (
                                                        <tr key={log.id}>
                                                            <td className={styles.timeCell}>{log.createdAt || '-'}</td>
                                                            <td>
                                                                <span className={styles.categoryBadge}>{log.category}</span>
                                                            </td>
                                                            <td>{log.action}</td>
                                                            <td className={styles.itemTitle}>{log.label}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
