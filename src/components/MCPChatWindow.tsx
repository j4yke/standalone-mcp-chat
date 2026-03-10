"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

type AnimationState =
    | "initial"
    | "typing1"
    | "submitting1"
    | "transitioning1"
    | "fetching1"
    | "using_tool1"
    | "responding1"
    | "typing2"
    | "submitting2"
    | "transitioning2"
    | "using_tool2"
    | "responding2"
    | "resetting"
    | "completed";

const TEXT1 = "Create a transactional template for order confirmation emails";
const TEXT2 = "Send me a test email on david@acme.com";
const AGENT_FETCHING_TEXT = "Connecting to the AutoSend MCP";

const RESPONSE1_TITLE = "Implementing Order Confirmation Template";
const RESPONSE1_BODY_PLAIN = "I have successfully created and verified the order confirmation template. The template is now live in the ";
const RESPONSE1_BODY_LINK = "AutoSend Dashboard.";
const RESPONSE1_BODY = RESPONSE1_BODY_PLAIN + RESPONSE1_BODY_LINK;
const RESPONSE2_TEXT = "Test email sent to david@acme.com! ✅";

const INITIAL_MESSAGES = [
    "What suppression groups do I have?",
    "List all my contact segments and their sizes",
    "Create a newsletter campaign for our March product updates",
];

export default function MCPChatWindow() {
    const [state, setState] = useState<AnimationState>("initial");
    const [displayedInput, setDisplayedInput] = useState("");
    const [agentFetchingText, setAgentFetchingText] = useState("");
    const [response1Title, setResponse1Title] = useState("");
    const [response1Body, setResponse1Body] = useState("");
    const [response2Text, setResponse2Text] = useState("");
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const historyRef = useRef<HTMLDivElement>(null);

    // Initial State Looping Typewriter
    useEffect(() => {
        if (state !== "initial" && state !== "completed") return;

        let messageIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 30;

        const loop = () => {
            const currentMessage = INITIAL_MESSAGES[messageIndex];

            if (isDeleting) {
                setDisplayedInput(currentMessage.substring(0, charIndex - 1));
                charIndex--;
                typingSpeed = 20;
            } else {
                setDisplayedInput(currentMessage.substring(0, charIndex + 1));
                charIndex++;
                typingSpeed = 30;
            }

            if (!isDeleting && charIndex === currentMessage.length) {
                isDeleting = true;
                typingSpeed = 1500; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                messageIndex = (messageIndex + 1) % INITIAL_MESSAGES.length;
                typingSpeed = 300; // Pause before next message
            }

            timerRef.current = setTimeout(loop, typingSpeed);
        };

        loop();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [state]);

    // Auto-scroll logic
    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [state]);

    // Animation Controller
    useEffect(() => {
        if (state === "initial") return;

        if (state === "typing1") {
            let i = 0;
            setDisplayedInput("");
            const typeInterval = setInterval(() => {
                setDisplayedInput(TEXT1.slice(0, i + 1));
                i++;
                if (i === TEXT1.length) {
                    clearInterval(typeInterval);
                    timerRef.current = setTimeout(() => setState("submitting1"), 400);
                }
            }, 15);
            return () => clearInterval(typeInterval);
        }

        if (state === "submitting1") {
            setDisplayedInput("");
            timerRef.current = setTimeout(() => setState("transitioning1"), 100);
        }

        if (state === "transitioning1") {
            timerRef.current = setTimeout(() => {
                setState("fetching1");
            }, 800);
        }

        if (state === "fetching1") {
            let i = 0;
            setAgentFetchingText("");
            const typeInternal = setInterval(() => {
                setAgentFetchingText(AGENT_FETCHING_TEXT.slice(0, i + 1));
                i++;
                if (i === AGENT_FETCHING_TEXT.length) {
                    clearInterval(typeInternal);
                    timerRef.current = setTimeout(() => setState("using_tool1"), 1000);
                }
            }, 8);
            return () => clearInterval(typeInternal);
        }

        if (state === "using_tool1") {
            timerRef.current = setTimeout(() => setState("responding1"), 1800);
        }

        if (state === "responding1") {
            let i = 0;
            setResponse1Title("");
            setResponse1Body("");
            let typeBody: NodeJS.Timeout;
            const typeTitle = setInterval(() => {
                setResponse1Title(RESPONSE1_TITLE.slice(0, i + 1));
                i++;
                if (i === RESPONSE1_TITLE.length) {
                    clearInterval(typeTitle);
                    let j = 0;
                    typeBody = setInterval(() => {
                        setResponse1Body(RESPONSE1_BODY.slice(0, j + 1));
                        j++;
                        if (j === RESPONSE1_BODY.length) {
                            clearInterval(typeBody);
                            timerRef.current = setTimeout(() => setState("typing2"), 1500);
                        }
                    }, 8);
                }
            }, 6);
            return () => {
                clearInterval(typeTitle);
                if (typeBody) clearInterval(typeBody);
            };
        }

        if (state === "typing2") {
            let i = 0;
            setDisplayedInput("");
            const typeInternal = setInterval(() => {
                setDisplayedInput(TEXT2.slice(0, i + 1));
                i++;
                if (i === TEXT2.length) {
                    clearInterval(typeInternal);
                    timerRef.current = setTimeout(() => setState("submitting2"), 400); // Reduced from 1000ms
                }
            }, 15);
            return () => clearInterval(typeInternal);
        }

        if (state === "submitting2") {
            setDisplayedInput("");
            timerRef.current = setTimeout(() => setState("transitioning2"), 100);
        }

        if (state === "transitioning2") {
            timerRef.current = setTimeout(() => {
                setState("using_tool2");
            }, 800);
        }

        if (state === "using_tool2") {
            timerRef.current = setTimeout(() => setState("responding2"), 1800);
        }

        if (state === "responding2") {
            let i = 0;
            setResponse2Text("");
            const typeInterval = setInterval(() => {
                setResponse2Text(RESPONSE2_TEXT.slice(0, i + 1));
                i++;
                if (i === RESPONSE2_TEXT.length) {
                    clearInterval(typeInterval);
                    timerRef.current = setTimeout(() => setState("resetting"), 1500);
                }
            }, 12);
            return () => clearInterval(typeInterval);
        }

        if (state === "resetting") {
            setDisplayedInput("");
            setAgentFetchingText("");
            setResponse1Title("");
            setResponse1Body("");
            setResponse2Text("");
            timerRef.current = setTimeout(() => setState("completed"), 800);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [state]);

    const handlePlay = () => {
        setDisplayedInput("");
        setAgentFetchingText("");
        setResponse1Title("");
        setResponse1Body("");
        setResponse2Text("");
        setState("typing1");
    };

    const isInitial = state === "initial";
    const isCompleted = state === "completed";
    const showOverlay = isInitial || isCompleted;

    // Step flags
    const isInteraction1Visible = ["transitioning1", "fetching1", "using_tool1", "responding1", "typing2", "submitting2", "transitioning2", "using_tool2", "responding2"].includes(state);
    const isStep1Final = ["fetching1", "using_tool1", "responding1", "typing2", "submitting2", "transitioning2", "using_tool2", "responding2"].includes(state);

    const isInteraction2Visible = ["transitioning2", "using_tool2", "responding2"].includes(state);
    const isStep2Final = ["using_tool2", "responding2"].includes(state);

    const isBottomLayout = !["initial", "typing1", "submitting1", "completed"].includes(state);

    return (
        <LayoutGroup>
            <div
                className="w-full max-w-[896px]"
                style={{
                    height: "498px",
                    background: "#f5f5f4",
                    border: "1px solid #e7e5e4",
                    borderRadius: "16px",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
                }}
            >
                {/* Chat History Area */}
                <div
                    ref={historyRef}
                    className="md:px-[160px] px-6 flex flex-col gap-4 md:gap-6"
                    style={{
                        flex: 1,
                        paddingTop: "24px",
                        overflowY: "hidden", // Hide scrollbar, but allow programmatic scrolling
                        scrollBehavior: "smooth",
                        paddingBottom: "120px", // Give space for the input
                    }}
                >
                    {/* INTERACTION 1 */}
                    {isInteraction1Visible && (
                        <div className="flex flex-col gap-4">
                            {/* User Message 1 */}
                            <motion.div
                                layoutId="message-content-1"
                                initial={false}
                                style={{
                                    alignSelf: "flex-end",
                                    background: "#fafaf9",
                                    border: "1px solid #e7e5e4",
                                    borderRadius: "12px",
                                    padding: "8px 12px",
                                    maxWidth: "80%",
                                    boxShadow: "0px 1px 2px rgba(0,0,0,0.02)",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 30
                                }}
                            >
                                <p style={{ margin: 0, fontSize: "14px", color: "#292524", lineHeight: "24px" }}>
                                    {TEXT1}
                                </p>
                            </motion.div>

                            {/* Agent Response 1 */}
                            {isStep1Final && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                    }}
                                >
                                    <div style={{ width: "24px", height: "24px", flexShrink: 0 }}>
                                        <img src="/robotic-stroke-rounded.svg" alt="Robot" width={24} height={24} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                                        <p style={{ margin: 0, fontSize: "14px", color: "#292524" }}>{agentFetchingText}</p>

                                        {["using_tool1", "responding1", "typing2", "submitting2", "transitioning2", "using_tool2", "responding2"].includes(state) && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                            >
                                                <span style={{ fontSize: "14px", color: "#292524" }}>Using</span>
                                                <div style={{ background: "#e7e5e4", padding: "2px 6px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                                                    <img src="/wrench-01-stroke-rounded.svg" alt="Tool" width={12} height={12} />
                                                    <span style={{ fontSize: "12px", fontWeight: 500, fontFamily: "monospace", color: "#292524" }}>create_template</span>
                                                </div>
                                            </motion.div>
                                        )}

                                        {["responding1", "typing2", "submitting2", "transitioning2", "using_tool2", "responding2"].includes(state) && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <p style={{ margin: 0, fontSize: "14px", color: "#292524", lineHeight: "1.5" }}>{response1Title}</p>
                                                {response1Title.length === RESPONSE1_TITLE.length && (
                                                    <p style={{ margin: 0, fontSize: "14px", color: "#292524", lineHeight: "1.5", marginTop: "4px" }}>
                                                        {response1Body.slice(0, RESPONSE1_BODY_PLAIN.length)}
                                                        {response1Body.length > RESPONSE1_BODY_PLAIN.length && (
                                                            <span style={{ color: "#615fff", cursor: "pointer" }}>
                                                                {response1Body.slice(RESPONSE1_BODY_PLAIN.length)}
                                                            </span>
                                                        )}
                                                    </p>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* INTERACTION 2 */}
                    {isInteraction2Visible && (
                        <div className="flex flex-col gap-4 mt-6 md:mt-0 mb-10">
                            {/* User Message 2 */}
                            <motion.div
                                layoutId="message-content-2"
                                initial={false}
                                style={{
                                    alignSelf: "flex-end",
                                    background: "#fafaf9",
                                    border: "1px solid #e7e5e4",
                                    borderRadius: "12px",
                                    padding: "8px 12px",
                                    maxWidth: "80%",
                                    boxShadow: "0px 1px 2px rgba(0,0,0,0.02)",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 30
                                }}
                            >
                                <p style={{ margin: 0, fontSize: "14px", color: "#292524", lineHeight: "24px" }}>
                                    {TEXT2}
                                </p>
                            </motion.div>

                            {/* Agent Response 2 */}
                            {isStep2Final && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                                    style={{
                                        display: "flex",
                                        gap: "12px",
                                    }}
                                >
                                    <div style={{ width: "24px", height: "24px", flexShrink: 0 }}>
                                        <img src="/robotic-stroke-rounded.svg" alt="Robot" width={24} height={24} />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ fontSize: "14px", color: "#292524" }}>Using</span>
                                            <div style={{ background: "#e7e5e4", padding: "2px 6px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                                                <img src="/wrench-01-stroke-rounded.svg" alt="Tool" width={12} height={12} />
                                                <span style={{ fontSize: "12px", fontWeight: 500, fontFamily: "monospace", color: "#292524" }}>send_test_email</span>
                                            </div>
                                        </div>
                                        {["responding2"].includes(state) && (
                                            <motion.p
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{ margin: 0, fontSize: "14px", color: "#292524" }}
                                            >
                                                {response2Text.startsWith("Test email sent to ") ? (
                                                    <>
                                                        Test email sent to{" "}
                                                        <strong>{response2Text.slice(19).replace(/!.*$/, "")}</strong>
                                                        {response2Text.includes("!") ? response2Text.slice(response2Text.indexOf("!")) : ""}
                                                    </>
                                                ) : (
                                                    response2Text
                                                )}
                                            </motion.p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Input Area */}
                <motion.div
                    layout="position"
                    className="w-[calc(100%-32px)] md:w-[576px]"
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        margin: "auto",
                        x: 0,
                        y: isBottomLayout ? 0 : "-50%",
                        top: isBottomLayout ? "auto" : "50%",
                        bottom: isBottomLayout ? "16px" : "auto",
                        height: "96px",
                        background: "white",
                        border: "1px solid #e7e5e4",
                        borderRadius: "16px",
                        padding: "8px",
                        boxShadow: isBottomLayout ? "0 2px 8px rgba(0,0,0,0.02)" : "0 8px 32px rgba(0,0,0,0.06)",
                        zIndex: 5,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 30
                    }}
                >
                    {/* Bot Icon and Text in Input */}
                    <div style={{ position: "absolute", left: "7px", top: "7px", display: "flex", gap: "8px", alignItems: "center" }}>
                        <div style={{ width: "32px", height: "32px", flexShrink: 0, background: "#e7e5e4", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src="/robotic-stroke-rounded.svg" alt="Robot" width={20} height={20} />
                        </div>

                        <div style={{ position: "relative" }}>
                            {/* Stable text wrapper with layoutId applied early to provide a smooth starting point for morphing */}
                            <motion.div
                                layoutId={
                                    (state === "typing1" || state === "submitting1")
                                        ? "message-content-1"
                                        : (state === "typing2" || state === "submitting2")
                                            ? "message-content-2"
                                            : undefined
                                }
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 30
                                }}
                                style={{
                                    fontSize: "14px",
                                    color: "#292524",
                                    lineHeight: "24px",
                                }}
                            >
                                <p style={{ margin: 0 }}>
                                    {displayedInput}
                                    <motion.span
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        style={{
                                            display: (state === "transitioning1" || state === "transitioning2" || state === "resetting") ? "none" : "inline-block",
                                            width: "2px",
                                            height: "14px",
                                            background: "#615fff",
                                            marginLeft: "2px",
                                            verticalAlign: "middle",
                                        }}
                                    />
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                        style={{
                            position: "absolute",
                            bottom: "7px",
                            right: "9px",
                            width: "32px",
                            height: "32px",
                            background: "#44403b",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        animate={{
                            scale: (state === "submitting1" || state === "submitting2") ? 0.9 : 1,
                            opacity: (state === "transitioning1" || state === "transitioning2") ? 0 : 1
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="m5 12 7-7 7 7" />
                            <path d="M12 19V5" />
                        </svg>
                    </motion.div>
                </motion.div>

                <style jsx>{`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                `}</style>

                {/* Step 0 Overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 300%)",
                        backdropFilter: "none",
                        zIndex: 100,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        padding: "24px",
                        opacity: showOverlay ? 1 : 0,
                        pointerEvents: showOverlay ? "auto" : "none",
                        visibility: showOverlay ? "visible" : "hidden",
                        transition: "opacity 0.6s ease, backdrop-filter 0.6s ease, visibility 0.6s",
                    }}
                >
                    <button
                        onClick={handlePlay}
                        style={{
                            background: "#fafafa",
                            border: "2px solid #e5e5e5",
                            borderRadius: "10px",
                            padding: "6px 16px 6px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            transition: "all 0.2s ease",
                            fontFamily: "monospace",
                            textTransform: "uppercase",
                            letterSpacing: "0.56px",
                            fontWeight: 600,
                            color: "#171717",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
                            e.currentTarget.style.background = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                            e.currentTarget.style.background = "#fafafa";
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            {isCompleted ? (
                                <path d="M23 4v6h-6M20.49 15a9 9 0 1 1-2.12-9.36L23 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            ) : (
                                <path d="M5 3v18l15-9L5 3z" />
                            )}
                        </svg>
                        <span style={{ fontSize: "14px" }}>
                            {isCompleted ? "REPLAY" : "SEE IT IN ACTION"}
                        </span>
                    </button>
                </div>
            </div>
        </LayoutGroup>
    );
}
