import { useState, useEffect, useRef } from "react";

export default function Login({ onLogin }) {
    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const canvasRef = useRef(null);

    // ── Particle Canvas ──────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            a: Math.random(),
        }));

        let animId;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,180,255,${p.a * 0.4})`;
                ctx.fill();
            });
            particles.forEach((p, i) => {
                particles.slice(i + 1).forEach((q) => {
                    const d = Math.hypot(p.x - q.x, p.y - q.y);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(0,180,255,${0.08 * (1 - d / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
            animId = requestAnimationFrame(draw);
        }
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // ── Role-based Login Handler ─────────────────────────────────────
    const handleLogin = () => {
        setError("");
        const trimEmail = email.trim().toLowerCase();
        const trimPass = password.trim();

        if (!trimEmail || !trimPass) {
            setError("Please enter both email and password.");
            return;
        }
        if (trimEmail === "admin@rps.edu.in" && trimPass === "admin123") {
            onLogin("admin");
        } else if (trimEmail === "teacher@rps.edu.in" && trimPass === "teacher123") {
            onLogin("teacher");
        } else if (trimEmail === "student@rps.edu.in" && trimPass === "student123") {
            onLogin("student");
        } else {
            setError("Invalid credentials. Please check your email and password.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && mode === "signin") handleLogin();
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center",
            justifyContent: "center", background: "#020817",
            overflow: "hidden", position: "relative", fontFamily: "DM Sans, sans-serif"
        }}>
            {/* Particle Canvas */}
            <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

            {/* Card */}
            <div style={{
                position: "relative", zIndex: 10, display: "flex",
                width: "90%", maxWidth: 900, minHeight: 560,
                borderRadius: 24, overflow: "hidden",
                border: "1px solid rgba(6,182,212,0.12)",
                boxShadow: "0 25px 60px rgba(0,0,0,0.7)"
            }}>

                {/* ── LEFT PANEL ── */}
                <div style={{
                    width: "42%", background: "linear-gradient(135deg, #0a1628, #0d1f3c)",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", padding: 40, textAlign: "center",
                    position: "relative", overflow: "hidden"
                }}>
                    {/* Corner decorations */}
                    {[
                        { top: 12, left: 12, borderTop: "2px solid rgba(6,182,212,0.4)", borderLeft: "2px solid rgba(6,182,212,0.4)" },
                        { top: 12, right: 12, borderTop: "2px solid rgba(6,182,212,0.4)", borderRight: "2px solid rgba(6,182,212,0.4)" },
                        { bottom: 12, left: 12, borderBottom: "2px solid rgba(6,182,212,0.4)", borderLeft: "2px solid rgba(6,182,212,0.4)" },
                        { bottom: 12, right: 12, borderBottom: "2px solid rgba(6,182,212,0.4)", borderRight: "2px solid rgba(6,182,212,0.4)" },
                    ].map((s, i) => (
                        <div key={i} style={{ position: "absolute", width: 20, height: 20, ...s }} />
                    ))}

                    {/* Glow blob */}
                    <div style={{
                        position: "absolute", width: 250, height: 250, borderRadius: "50%",
                        background: "rgba(6,182,212,0.07)", filter: "blur(60px)"
                    }} />

                    <div style={{ position: "relative" }}>
                        <div style={{
                            width: 96, height: 96, borderRadius: "50%",
                            border: "2px solid rgba(6,182,212,0.4)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 16px"
                        }}>
                            <span style={{ fontFamily: "monospace", fontWeight: 900, color: "#22d3ee", fontSize: 22, letterSpacing: 4 }}>
                                RPS
                            </span>
                        </div>

                        <h2 style={{ color: "white", fontSize: 13, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 8px" }}>
                            Campus Pro
                        </h2>
                        <p style={{ color: "rgba(207,250,254,0.45)", fontSize: 13, lineHeight: 1.6, marginBottom: 24, fontWeight: 300 }}>
                            Next-generation campus management system
                        </p>

                        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                            {[["3.2K", "Students"], ["180", "Faculty"], ["98%", "Uptime"]].map(([n, l]) => (
                                <div key={l} style={{
                                    flex: 1, background: "rgba(6,182,212,0.06)",
                                    border: "1px solid rgba(6,182,212,0.15)",
                                    borderRadius: 12, padding: "12px 8px"
                                }}>
                                    <div style={{ color: "#22d3ee", fontWeight: 700, fontSize: 15, fontFamily: "monospace" }}>{n}</div>
                                    <div style={{ color: "rgba(165,243,252,0.45)", fontSize: 11, marginTop: 4, letterSpacing: 1 }}>{l}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(6,182,212,0.55)", fontSize: 12, letterSpacing: 2 }}>
                            <span style={{ width: 8, height: 8, background: "#22d3ee", borderRadius: "50%", marginRight: 8, display: "inline-block" }} />
                            Systems Online
                        </div>
                    </div>
                </div>

                {/* ── RIGHT FORM ── */}
                <div style={{
                    flex: 1, background: "rgba(8,16,31,0.97)",
                    display: "flex", flexDirection: "column", justifyContent: "center",
                    padding: "40px 44px", overflowY: "auto"
                }}>

                    {/* Tabs */}
                    <div style={{
                        display: "flex", background: "rgba(6,182,212,0.05)",
                        border: "1px solid rgba(6,182,212,0.12)",
                        borderRadius: 12, padding: 4, marginBottom: 24
                    }}>
                        {["signin", "signup"].map((t) => (
                            <button key={t}
                                onClick={() => { setMode(t); setError(""); setEmail(""); setPassword(""); }}
                                style={{
                                    flex: 1, padding: "10px 0", borderRadius: 9, fontSize: 13,
                                    fontWeight: 600, letterSpacing: 3, textTransform: "uppercase",
                                    border: "none", cursor: "pointer", transition: "all 0.3s",
                                    background: mode === t ? "rgba(6,182,212,0.18)" : "transparent",
                                    color: mode === t ? "#22d3ee" : "rgba(165,243,252,0.35)",
                                    boxShadow: mode === t ? "0 4px 20px rgba(6,182,212,0.1)" : "none",
                                }}>
                                {t === "signin" ? "Sign In" : "Sign Up"}
                            </button>
                        ))}
                    </div>

                    {/* ── SIGN IN ── */}
                    {mode === "signin" && (
                        <div>
                            <h2 style={{ color: "white", fontSize: 20, fontWeight: 700, letterSpacing: 2, marginBottom: 4, fontFamily: "monospace" }}>
                                Access Portal
                            </h2>
                            <p style={{ color: "rgba(165,243,252,0.35)", fontSize: 13, marginBottom: 20, fontWeight: 300 }}>
                                Enter your credentials to continue
                            </p>

                            <Field label="Email" type="email" placeholder="your.id@rps.edu.in"
                                value={email} onChange={setEmail} onKeyDown={handleKeyDown} />
                            <Field label="Password" type="password" placeholder="••••••••••"
                                value={password} onChange={setPassword} onKeyDown={handleKeyDown} />

                            {/* Error */}
                            {error && (
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
                                    padding: "10px 14px", borderRadius: 12,
                                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)"
                                }}>
                                    <span style={{ color: "#f87171", fontSize: 14 }}>⚠</span>
                                    <p style={{ color: "#f87171", fontSize: 12, margin: 0 }}>{error}</p>
                                </div>
                            )}

                            <div style={{ textAlign: "right", marginBottom: 16 }}>
                                <button onClick={() => { setMode("forgot"); setError(""); }}
                                    style={{ background: "none", border: "none", color: "rgba(6,182,212,0.55)", fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
                                    Forgot Password?
                                </button>
                            </div>

                            <SubmitBtn onClick={handleLogin}>Initialize Session</SubmitBtn>

                            {/* Test Credentials */}
                            <div style={{
                                marginTop: 16, padding: 12, borderRadius: 12,
                                border: "1px solid rgba(6,182,212,0.12)", background: "rgba(6,182,212,0.03)"
                            }}>
                                <p style={{ color: "rgba(6,182,212,0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, fontWeight: 700 }}>
                                    🔑 Test Credentials
                                </p>
                                {[
                                    ["admin@rps.edu.in", "admin123", "Admin"],
                                    ["teacher@rps.edu.in", "teacher123", "Teacher"],
                                    ["student@rps.edu.in", "student123", "Student"],
                                ].map(([e, p, role]) => (
                                    <button key={role}
                                        onClick={() => { setEmail(e); setPassword(p); setError(""); }}
                                        style={{
                                            width: "100%", display: "flex", alignItems: "center",
                                            justifyContent: "space-between", padding: "7px 10px",
                                            borderRadius: 8, border: "none", cursor: "pointer",
                                            background: "transparent", marginBottom: 2, transition: "background 0.2s"
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(6,182,212,0.1)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        <span style={{ color: "rgba(165,243,252,0.5)", fontSize: 11 }}>{e}</span>
                                        <span style={{
                                            color: "#22d3ee", fontSize: 10, fontWeight: 800,
                                            padding: "2px 8px", borderRadius: 20, background: "rgba(6,182,212,0.12)"
                                        }}>{role}</span>
                                    </button>
                                ))}
                                <p style={{ color: "rgba(165,243,252,0.2)", fontSize: 10, textAlign: "center", marginTop: 6 }}>
                                    Click any row to autofill credentials
                                </p>
                            </div>

                            <Divider />
                            <div style={{ display: "flex", gap: 10 }}>
                                <SocialBtn>Google</SocialBtn>
                                <SocialBtn>Microsoft</SocialBtn>
                            </div>
                            <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "rgba(165,243,252,0.35)" }}>
                                New user?{" "}
                                <span onClick={() => { setMode("signup"); setError(""); }}
                                    style={{ color: "#22d3ee", cursor: "pointer", fontWeight: 600 }}>
                                    Create account
                                </span>
                            </p>
                        </div>
                    )}

                    {/* ── SIGN UP ── */}
                    {mode === "signup" && <SignUpForm onSwitch={() => setMode("signin")} />}

                    {/* ── FORGOT PASSWORD ── */}
                    {mode === "forgot" && <ForgotForm onSwitch={() => setMode("signin")} />}

                </div>
            </div>
        </div>
    );
}

// ── Sign Up Form ──────────────────────────────────────────────────────────────
function SignUpForm({ onSwitch }) {
    const [name, setName] = useState("");
    const [roll, setRoll] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <h2 style={{ color: "white", fontSize: 20, fontWeight: 700, letterSpacing: 2, marginBottom: 4, fontFamily: "monospace" }}>
                Register Access
            </h2>
            <p style={{ color: "rgba(165,243,252,0.35)", fontSize: 13, marginBottom: 20, fontWeight: 300 }}>
                Create your campus portal account
            </p>
            <Field label="Full Name" type="text" placeholder="Your full name" value={name} onChange={setName} />
            <Field label="Roll No." type="text" placeholder="e.g. 2203010100" value={roll} onChange={setRoll} />
            <Field label="Email" type="email" placeholder="your.id@rps.edu.in" value={email} onChange={setEmail} />
            <Field label="Password" type="password" placeholder="••••••••••" value={password} onChange={setPassword} />
            <SubmitBtn onClick={onSwitch}>Create Account</SubmitBtn>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "rgba(165,243,252,0.35)" }}>
                Already registered?{" "}
                <span onClick={onSwitch} style={{ color: "#22d3ee", cursor: "pointer", fontWeight: 600 }}>Sign in</span>
            </p>
        </div>
    );
}

// ── Forgot Password Form ──────────────────────────────────────────────────────
function ForgotForm({ onSwitch }) {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    return (
        <div>
            <h2 style={{ color: "white", fontSize: 20, fontWeight: 700, letterSpacing: 2, marginBottom: 4, fontFamily: "monospace" }}>
                Reset Access
            </h2>
            <p style={{ color: "rgba(165,243,252,0.35)", fontSize: 13, marginBottom: 20, fontWeight: 300 }}>
                We'll send a recovery link to your email
            </p>
            <Field label="Registered Email" type="email" placeholder="your.id@rps.edu.in" value={email} onChange={setEmail} />
            {sent && (
                <div style={{
                    padding: "10px 14px", borderRadius: 12, marginBottom: 12,
                    background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80", fontSize: 12
                }}>
                    ✓ Reset link sent! Check your inbox.
                </div>
            )}
            <SubmitBtn onClick={() => setSent(true)}>Send Reset Link</SubmitBtn>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "rgba(165,243,252,0.35)" }}>
                <span onClick={onSwitch} style={{ color: "#22d3ee", cursor: "pointer", fontWeight: 600 }}>
                    ← Back to Sign In
                </span>
            </p>
        </div>
    );
}

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({ label, type, placeholder, value, onChange, onKeyDown }) {
    const [focused, setFocused] = useState(false);

    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{
                display: "block", fontSize: 11, color: "rgba(34,211,238,0.6)",
                letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, marginBottom: 6
            }}>
                {label}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "off"}
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: focused ? "rgba(6,182,212,0.09)" : "rgba(255,255,255,0.05)",
                    border: focused ? "1px solid rgba(6,182,212,0.6)" : "1px solid rgba(6,182,212,0.2)",
                    borderRadius: 12,
                    padding: "13px 16px",
                    color: "white",
                    fontSize: 14,
                    outline: "none",
                    transition: "all 0.25s",
                    boxShadow: focused ? "0 0 0 3px rgba(6,182,212,0.08)" : "none",
                }}
            />
        </div>
    );
}

// ── SubmitBtn ─────────────────────────────────────────────────────────────────
function SubmitBtn({ children, onClick }) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: "100%", padding: "14px 0",
                background: "linear-gradient(to right, #0088cc, #00c8ff)",
                color: "#020817", fontWeight: 900, fontSize: 13,
                letterSpacing: 3, textTransform: "uppercase",
                borderRadius: 12, border: "none", cursor: "pointer",
                marginTop: 4, transition: "all 0.3s",
                transform: hovered ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hovered ? "0 8px 25px rgba(0,180,255,0.35)" : "0 2px 10px rgba(0,0,0,0.2)",
            }}
        >
            {children}
        </button>
    );
}

// ── SocialBtn ─────────────────────────────────────────────────────────────────
function SocialBtn({ children }) {
    return (
        <button
            style={{
                flex: 1, padding: "10px 0",
                background: "rgba(6,182,212,0.05)",
                border: "1px solid rgba(6,182,212,0.18)",
                borderRadius: 12, color: "rgba(165,243,252,0.55)",
                fontSize: 13, letterSpacing: 1, fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(6,182,212,0.12)";
                e.currentTarget.style.color = "#22d3ee";
                e.currentTarget.style.borderColor = "rgba(6,182,212,0.4)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(6,182,212,0.05)";
                e.currentTarget.style.color = "rgba(165,243,252,0.55)";
                e.currentTarget.style.borderColor = "rgba(6,182,212,0.18)";
            }}
        >
            {children}
        </button>
    );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(6,182,212,0.1)" }} />
            <span style={{ color: "rgba(165,243,252,0.25)", fontSize: 12, letterSpacing: 1 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "rgba(6,182,212,0.1)" }} />
        </div>
    );
}