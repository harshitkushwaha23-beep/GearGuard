const LoadingSpinner = ({ className }) => {
    return (
        <div className="flex items-center justify-center">
            <div className={` aspect-square   rounded-full border-t-transparent animate-spin ${className}`}></div>
        </div>
    );
};

export default LoadingSpinner;
