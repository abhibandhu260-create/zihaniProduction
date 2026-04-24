import React from "react";
import "./Hero.css";

const Hero = () => {
    return (
        <div className="hero-container">
            {/* LEFT SIDE */}
            <div className="hero-left">
                <div className="spotlight"></div>
                <div className="logo">Zihani Production</div>

                <p className="tag">REEL · 01 · PROLOGUE</p>

                <h1>
                    Lights.<br />
                    Camera.<br />
                    <span>Launching Soon.</span>
                </h1>
            </div>

            {/* RIGHT SIDE CARD */}
            <div className="hero-right">
                <div className="card">
                    <p className="scene">SCENE 001</p>

                    <h2>
                        The reel is being <span>threaded.</span>
                    </h2>

                    <ul>
                        <li>Original stories, rooted in India.</li>
                        <li>Cinema first. Always.</li>
                        <li>A slate that honours the craft.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Hero;