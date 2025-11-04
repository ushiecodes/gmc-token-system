import React, { useState, useEffect, useMemo } from 'react';
import { firebaseService } from '../services/firebaseService';
import { type Token, TokenCategory } from '../types';
import StatCard from '../components/StatCard';
import Spinner from '../components/Spinner';

const AdminDashboard: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseService.listenToTokens((newTokens) => {
      setTokens(newTokens);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const stats = useMemo(() => {
    return tokens.reduce((acc, token) => {
      acc.total++;
      acc[token.category] = (acc[token.category] || 0) + 1;
      return acc;
    }, {
      total: 0,
      [TokenCategory.General]: 0,
      [TokenCategory.SeniorCitizen]: 0,
      [TokenCategory.Referral]: 0,
    });
  }, [tokens]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Live overview of today's OPD token generation.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tokens"
          value={stats.total}
          colorClass="bg-blue-100 text-blue-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
        />
        <StatCard
          title="General"
          value={stats[TokenCategory.General]}
          colorClass="bg-green-100 text-green-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <StatCard
          title="Senior Citizen"
          value={stats[TokenCategory.SeniorCitizen]}
          colorClass="bg-yellow-100 text-yellow-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a6 6 0 00-12 0v2" /></svg>}
        />
        <StatCard
          title="Referral"
          value={stats[TokenCategory.Referral]}
          colorClass="bg-purple-100 text-purple-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;