import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CyberInput from '../components/ui/CyberInput';
import CyberButton from '../components/ui/CyberButton';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData.email, formData.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <div className="scanline" />

            {/* Background Matrix Effect Placeholder */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('https://media.giphy.com/media/u49M52JRY4skI9XWqV/giphy.gif')] bg-cover" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="cyber-box w-full max-w-md p-8 z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold font-cyber text-neon-green tracking-tighter mb-2 glitch-text">
                        neXus
                    </h1>
                    <p className="text-sm text-neon-cyan tracking-widest uppercase">
                        System Access Required
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 border border-neon-red bg-neon-red/10 flex items-center gap-3 text-neon-red"
                    >
                        <AlertTriangle size={20} />
                        <span className="font-mono text-sm uppercase">{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <CyberInput
                        icon={Terminal}
                        type="email"
                        name="email"
                        placeholder="OPERATOR_EMAIL"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <CyberInput
                        icon={Lock}
                        type="password"
                        name="password"
                        placeholder="ACCESS_CODE"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <CyberButton type="submit" className="w-full mt-4 group">
                        <span className="group-hover:hidden">Authenticate</span>
                        <span className="hidden group-hover:block">Enter System</span>
                    </CyberButton>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 font-mono text-sm">
                        New unit?{' '}
                        <Link to="/signup" className="text-neon-cyan hover:text-neon-green hover:underline transition-colors">
                            Initialize Protocol
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
