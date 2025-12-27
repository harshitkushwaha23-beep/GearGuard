import { FaRegCopy, FaCheck } from "react-icons/fa6";

import { useState } from "react";

const ProjectColors = () => {
    const [copiedColor, setCopiedColor] = useState(null);

    const colors = [
        { name: "Ink Black", variable: "--color-ink-black", hex: "#001219" },
        { name: "Dark Teal", variable: "--color-dark-teal", hex: "#005f73" },
        { name: "Dark Cyan", variable: "--color-dark-cyan", hex: "#0a9396" },
        { name: "Pearl Aqua", variable: "--color-pearl-aqua", hex: "#94d2bd" },
        { name: "Vanilla Custard", variable: "--color-vanilla-custard", hex: "#e9d8a6" },
        { name: "Golden Orange", variable: "--color-golden-orange", hex: "#ee9b00" },
        { name: "Burnt Caramel", variable: "--color-burnt-caramel", hex: "#ca6702" },
        { name: "Rusty Spice", variable: "--color-rusty-spice", hex: "#bb3e03" },
        { name: "Oxidized Iron", variable: "--color-oxidized-iron", hex: "#ae2012" },
        { name: "Brown Red", variable: "--color-brown-red", hex: "#9b2226" },
    ];

    const handleCopy = (hex) => {
        // Fallback for iframe environments where navigator.clipboard might fail
        const textArea = document.createElement("textarea");
        textArea.value = hex;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            setCopiedColor(hex);
            setTimeout(() => setCopiedColor(null), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
        document.body.removeChild(textArea);
    };

    // Helper to determine text color based on background brightness
    const getContrastColor = (hex) => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? "black" : "white";
    };

    return (
        <div className=" bg-gray-50 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 text-center">
                    <h2 className="text-4xl font-bold text-slate-800 mb-2">Project Color Palette</h2>
                    <p className="text-slate-500">Click any card to copy the hex code to your clipboard.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {colors.map((color) => {
                        const textColor = getContrastColor(color.hex);
                        const isCopied = copiedColor === color.hex;

                        return (
                            <div
                                key={color.hex}
                                onClick={() => handleCopy(color.hex)}
                                className="group relative flex flex-col rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden bg-white ring-1 ring-slate-200"
                            >
                                {/* Color Swatch */}
                                <div
                                    className="h-32 w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                                    style={{ backgroundColor: color.hex }}
                                >
                                    <div
                                        className={`transition-opacity duration-200 ${
                                            isCopied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        }`}
                                    >
                                        {isCopied ? (
                                            <span
                                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm font-medium text-sm"
                                                style={{ color: textColor }}
                                            >
                                                <FaCheck size={16} /> Copied!
                                            </span>
                                        ) : (
                                            <span
                                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm font-medium text-sm"
                                                style={{ color: textColor }}
                                            >
                                                <FaRegCopy size={16} /> Copy
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="p-4 bg-white flex flex-col gap-1">
                                    <h3 className="font-bold text-slate-800 text-lg">{color.name}</h3>
                                    {/* <code className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">{color.variable}</code> */}
                                    <p className="text-slate-600 font-mono text-sm mt-1 uppercase">{color.hex}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default ProjectColors;
