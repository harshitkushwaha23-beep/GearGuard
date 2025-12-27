import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Logo = () => {
    return (
        <Link
            to="/"
            className="flex items-center gap-2"
        >
            <img
                src={logo}
                alt="logo"
                className="size-8"
            />
            <div className="text-2xl font-bold text-dark-teal tracking-wide">
                Gear<span className="text-golden-orange">Guard</span>
            </div>
        </Link>
    );
};

export default Logo;
