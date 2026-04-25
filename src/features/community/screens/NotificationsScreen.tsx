import React from 'react';
import { notifications } from '../data/notifications';

export const NotificationsScreen = () => {
    return (
        <div className="flex flex-col gap-2 p-4">
            {notifications.map(n => (
                <div key={n.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <img src={n.actor.avatar} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="text-sm text-white"><span className="font-bold">{n.actor.username}</span> {n.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
