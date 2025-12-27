import { FaCheck } from "react-icons/fa6";

const PasswordValidation = ({ className, password }) => {
    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
    };

    return (
        <div className={`text-sm ${className}`}>
            {/* Length */}
            <CheckItem
                label="At least 8 characters"
                isValid={checks.length}
            />

            {/* Uppercase */}
            <CheckItem
                label="Contains uppercase letter (A-Z)"
                isValid={checks.upper}
            />

            {/* Lowercase */}
            <CheckItem
                label="Contains lowercase letter (a-z)"
                isValid={checks.lower}
            />

            {/* Number */}
            <CheckItem
                label="Contains number (0-9)"
                isValid={checks.number}
            />

            {/* Symbols */}
            <CheckItem
                label="Contains special symbol (!,@,#,$ etc.)"
                isValid={checks.symbol}
            />
        </div>
    );
};

export default PasswordValidation;

const CheckItem = ({ label, isValid }) => {
    return (
        <div className="flex items-center gap-2">
            <span className={`text-lg ${isValid ? "text-green-600" : "text-red-500"}`}>{isValid ? <FaCheck className="size-4" /> : ""}</span>
            <span className={`${isValid ? "text-green-700" : "text-red-500"}`}>{label}</span>
        </div>
    );
};
