import React, { useState } from 'react';

const CyberInput = ({ type = "text", placeholder, value, onChange, name, icon: Icon, required = false }) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className="relative group mb-6">
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/20 to-transparent transition-opacity duration-300 pointer-events-none
        ${focused ? 'opacity-100' : 'opacity-0'}`} />

            <div className="relative flex items-center bg-black/80 border border-gray-700 focus-within:border-neon-green transition-colors duration-300">
                {Icon && (
                    <div className="pl-4 text-neon-green">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="w-full bg-transparent text-neon-green font-mono p-4 outline-none placeholder-gray-600 appearance-none"
                    placeholder={placeholder}
                    autoComplete="off"
                />
                {focused && (
                    <div className="absolute right-2 w-2 h-2 bg-neon-green animate-pulse" />
                )}
            </div>

            {/* Corner accents */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-neon-green opacity-50" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-neon-green opacity-50" />
        </div>
    );
};

export default CyberInput;
