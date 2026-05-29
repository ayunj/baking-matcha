"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { useApp } from "@/context/AppContext";
import styles from "@/styles/app.module.css";

type AuthTab = "login" | "signup";

function passwordStrength(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Za-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function AuthScreen() {
  const { login, signup, isUsernameTaken } = useApp();
  const [tab, setTab] = useState<AuthTab>("login");

  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [sName, setSName] = useState("");
  const [sId, setSId] = useState("");
  const [sPw, setSPw] = useState("");
  const [sPwC, setSPwC] = useState("");
  const [signupErr, setSignupErr] = useState("");
  const [signupOk, setSignupOk] = useState("");

  const [nameMsg, setNameMsg] = useState<{ type: "" | "ok" | "err"; text: string }>({
    type: "",
    text: "",
  });
  const [idMsg, setIdMsg] = useState<{ type: "" | "ok" | "err"; text: string }>({
    type: "",
    text: "",
  });
  const [pwcMsg, setPwcMsg] = useState<{ type: "" | "ok" | "err"; text: string }>({
    type: "",
    text: "",
  });
  const [idAvailable, setIdAvailable] = useState<boolean | null>(null);
  const [authBusy, setAuthBusy] = useState(false);

  const pwStr = passwordStrength(sPw);
  const pwBarClass =
    pwStr <= 1 ? "weak" : pwStr <= 2 ? "mid" : "strong";
  const pwLabels = ["", "취약", "보통", "강함", "매우 강함"];

  const validateName = () => {
    const v = sName.trim();
    if (!v) {
      setNameMsg({ type: "", text: "" });
      return false;
    }
    if (v.length < 2) {
      setNameMsg({ type: "err", text: "2자 이상 입력해주세요" });
      return false;
    }
    setNameMsg({ type: "ok", text: "좋아요!" });
    return true;
  };

  useEffect(() => {
    const v = sId.trim();
    if (!/^[a-z0-9_]{4,20}$/.test(v)) {
      setIdAvailable(null);
      return;
    }
    let cancelled = false;
    isUsernameTaken(v).then((taken) => {
      if (!cancelled) setIdAvailable(!taken);
    });
    return () => {
      cancelled = true;
    };
  }, [sId, isUsernameTaken]);

  const validateId = async () => {
    const v = sId.trim();
    if (!v) {
      setIdMsg({ type: "", text: "" });
      return false;
    }
    if (!/^[a-z0-9_]{4,20}$/.test(v)) {
      setIdMsg({ type: "err", text: "영문 소문자, 숫자, _ 4~20자" });
      return false;
    }
    if (await isUsernameTaken(v)) {
      setIdMsg({ type: "err", text: "이미 사용 중인 아이디예요" });
      return false;
    }
    setIdMsg({ type: "ok", text: "사용 가능한 아이디예요" });
    return true;
  };

  const validatePwC = () => {
    if (!sPwC) {
      setPwcMsg({ type: "", text: "" });
      return false;
    }
    if (sPw !== sPwC) {
      setPwcMsg({ type: "err", text: "비밀번호가 일치하지 않아요" });
      return false;
    }
    setPwcMsg({ type: "ok", text: "비밀번호가 일치해요" });
    return true;
  };

  const nameOk = sName.trim().length >= 2;
  const idOk =
    /^[a-z0-9_]{4,20}$/.test(sId.trim()) && idAvailable === true;
  const signupReady = nameOk && idOk && sPw.length >= 8 && sPw === sPwC;

  const handleLogin = async () => {
    if (authBusy) return;
    setAuthBusy(true);
    setLoginErr("");
    try {
      const err = await login(loginId.trim(), loginPw);
      if (err) {
        setLoginErr(err);
        return;
      }
      setLoginId("");
      setLoginPw("");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignup = async () => {
    if (authBusy) return;
    if (
      !validateName() ||
      !(await validateId()) ||
      sPw.length < 8 ||
      sPw !== sPwC
    ) {
      return;
    }
    setAuthBusy(true);
    const name = sName.trim();
    const id = sId.trim();
    try {
      const err = await signup(name, id, sPw);
      if (err) {
        setSignupErr(err);
        return;
      }
    setSignupErr("");
      setSignupOk(`${name}님, 가입 완료! 로그인해주세요 🎉`);
      setTimeout(() => {
        setSignupOk("");
        setSName("");
        setSId("");
        setSPw("");
        setSPwC("");
        setNameMsg({ type: "", text: "" });
        setIdMsg({ type: "", text: "" });
        setPwcMsg({ type: "", text: "" });
        setTab("login");
        setLoginId(id);
      }, 2000);
    } finally {
      setAuthBusy(false);
    }
  };

  const switchTab = (t: AuthTab) => {
    setTab(t);
    setLoginErr("");
    setSignupErr("");
  };

  const FieldMsg = ({
    msg,
  }: {
    msg: { type: "" | "ok" | "err"; text: string };
  }) => (
    <div
      className={
        msg.type === "err"
          ? styles.fmsgErr
          : msg.type === "ok"
            ? styles.fmsgOk
            : styles.fmsg
      }
    >
      {msg.type ? (
        <>
          <Icon id={msg.type === "ok" ? "ic-check" : "ic-x2"} size={11} />
          <span>{msg.text}</span>
        </>
      ) : null}
    </div>
  );

  return (
    <div className={styles.authOuter}>
      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <span className={styles.authEmoji}>🍽️</span>
          <h1>나의 레시피 노트</h1>
          <p>오늘도 맛있는 하루</p>
        </div>

        <div className={styles.authTabs}>
          <button
            type="button"
            className={tab === "login" ? styles.authTabOn : styles.authTab}
            onClick={() => switchTab("login")}
          >
            로그인
          </button>
          <button
            type="button"
            className={tab === "signup" ? styles.authTabOn : styles.authTab}
            onClick={() => switchTab("signup")}
          >
            회원가입
          </button>
        </div>

        {tab === "login" ? (
          <div>
            <div className={styles.af}>
              <label>아이디</label>
              <input
                type="text"
                placeholder="아이디 입력"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div className={styles.af}>
              <label>비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            {loginErr ? (
              <div className={styles.gerrOn}>{loginErr}</div>
            ) : null}
            <button
              type="button"
              className={styles.authBtn}
              style={{ marginTop: 16 }}
              onClick={handleLogin}
            >
              로그인
            </button>
            <div className={styles.divider}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerTxt}>또는</span>
              <div className={styles.dividerLine} />
            </div>
            <p className={styles.socHint}>간편 인증 준비 중 (카카오, 네이버)</p>
          </div>
        ) : (
          <div>
            <div className={styles.af}>
              <label>이름</label>
              <input
                type="text"
                placeholder="이름 입력"
                value={sName}
                onChange={(e) => setSName(e.target.value)}
                onBlur={validateName}
                onInput={validateName}
              />
              <FieldMsg msg={nameMsg} />
            </div>
            <div className={styles.af}>
              <label>아이디</label>
              <input
                type="text"
                placeholder="영문+숫자 4~20자"
                value={sId}
                onChange={(e) => setSId(e.target.value)}
                onBlur={validateId}
                onInput={validateId}
              />
              <FieldMsg msg={idMsg} />
            </div>
            <div className={styles.af}>
              <label>비밀번호</label>
              <input
                type="password"
                placeholder="8자 이상"
                value={sPw}
                onChange={(e) => {
                  setSPw(e.target.value);
                  if (sPwC) validatePwC();
                }}
              />
              <div className={styles.pwBars}>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={[
                      styles.pwBar,
                      i < pwStr && pwBarClass === "weak" ? styles.pwBarWeak : "",
                      i < pwStr && pwBarClass === "mid" ? styles.pwBarMid : "",
                      i < pwStr && pwBarClass === "strong" ? styles.pwBarStrong : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                ))}
              </div>
              <div className={styles.pwLbl}>{sPw ? pwLabels[pwStr] : ""}</div>
            </div>
            <div className={styles.af}>
              <label>비밀번호 확인</label>
              <input
                type="password"
                placeholder="비밀번호 재입력"
                value={sPwC}
                onChange={(e) => setSPwC(e.target.value)}
                onBlur={validatePwC}
                onInput={validatePwC}
              />
              <FieldMsg msg={pwcMsg} />
            </div>
            {signupErr ? (
              <div className={styles.gerrOn}>{signupErr}</div>
            ) : null}
            {signupOk ? (
              <div className={styles.gokOn}>{signupOk}</div>
            ) : null}
            <button
              type="button"
              className={styles.authBtn}
              style={{ marginTop: 16 }}
              disabled={!signupReady}
              onClick={handleSignup}
            >
              가입하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
