import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, ShoppingBag, LogOut, ChevronRight, ShoppingCart, Heart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const UserProfile = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <h2 className="text-2xl font-semibold mb-4 text-[#206060]">Your Profile</h2>
                <p className="text-gray-600 mb-6">Please log in to view and manage your profile.</p>
                <Button onClick={() => navigate('/login')} className="bg-[#206060] hover:bg-[#1a4d4d] px-8">
                    Login
                </Button>
            </div>
        );
    }

    const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : '?';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:hidden">
            <div className="bg-[#206060] pt-12 pb-16 px-6 flex flex-col items-center relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                        <Avatar className="h-28 w-28 border-4 border-white/20 shadow-xl">

                            <AvatarImage src={user?.avatar} alt={user?.username} />
                            <AvatarFallback className="bg-[#1a4d4d] text-white text-4xl font-bold">
                                {firstLetter}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-100 cursor-pointer" onClick={() => navigate('/account')}>
                            <Pencil className="h-4 w-4 text-[#206060]" />
                        </div>
                    </div>
                    <h1 className="mt-4 text-white text-2xl font-bold tracking-tight">
                        {user?.username}
                    </h1>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50 rounded-t-[40px] z-0" />
            </div>

            <div className="px-6 -mt-6 z-10 space-y-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Edit Profile */}
                    <button
                        onClick={() => navigate('/account')}
                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-[#f0f9f9] p-3 rounded-2xl">
                                <Pencil className="h-5 w-5 text-[#206060]" />
                            </div>
                            <span className="font-semibold text-gray-800">Edit Profile</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300" />
                    </button>

                    {/* My Cart */}
                    <button
                        onClick={() => navigate('/cart')}
                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-[#f0f9f9] p-3 rounded-2xl">
                                <ShoppingCart className="h-5 w-5 text-[#206060]" />
                            </div>
                            <span className="font-semibold text-gray-800">My Cart</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300" />
                    </button>

                    {/* My Wishlist */}
                    <button
                        onClick={() => navigate('/wishlist')}
                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-[#f0f9f9] p-3 rounded-2xl">
                                <Heart className="h-5 w-5 text-[#206060]" />
                            </div>
                            <span className="font-semibold text-gray-800">My Wishlist</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300" />
                    </button>

                    {/* My Orders */}
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-[#f0f9f9] p-3 rounded-2xl">
                                <ShoppingBag className="h-5 w-5 text-[#206060]" />
                            </div>
                            <span className="font-semibold text-gray-800">My Orders</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300" />
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between p-5 hover:bg-red-50 active:bg-red-100 transition-colors"
                    >
                        <div className="flex items-center gap-4 text-red-600">
                            <div className="bg-red-50 p-3 rounded-2xl">
                                <LogOut className="h-5 w-5" />
                            </div>
                            <span className="font-semibold">Logout</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-red-200" />
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-8">
                    Signature Drapes v1.0.0
                </p>
            </div>
        </div>
    );
};

export default UserProfile;