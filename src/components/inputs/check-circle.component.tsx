const CircleCheckbox = ({ checked }) => {
    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                className="hidden"
                readOnly
            />
            <div
                className={`flex items-center justify-center w-4 h-4 border-2 rounded-full transition duration-300 ${
                    checked
                        ? "bg-primary border-primary"
                        : "border-input-border"
                }`}
            >
                {checked && (
                    <div className="w-2 h-2 bg-text-inverse rounded-full" />
                )}
            </div>
        </label>
    );
};

export default CircleCheckbox;