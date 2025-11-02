import React, { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import { Token, TokenCategory } from '../types';
import Spinner from '../components/Spinner';

const CategoryBadge: React.FC<{ category: TokenCategory }> = ({ category }) => {
    const colors = {
        [TokenCategory.General]: 'bg-blue-100 text-blue-800',
        [TokenCategory.SeniorCitizen]: 'bg-yellow-100 text-yellow-800',
        [TokenCategory.Referral]: 'bg-purple-100 text-purple-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[category]}`}>{category}</span>;
}

const CounterConsole: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [walkInCaseId, setWalkInCaseId] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseService.listenToTokens((newTokens) => {
      setTokens(newTokens);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCategoryChange = (tokenId: string, newCategory: TokenCategory) => {
    firebaseService.updateTokenCategory(tokenId, newCategory);
  };

  const handleIssueWalkIn = async () => {
    setIsIssuing(true);
    await firebaseService.generateWalkInToken(walkInCaseId);
    setWalkInCaseId('');
    setIsIssuing(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">OPD Counter Console</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Issue Walk-in Token</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input 
                type="text"
                placeholder="Optional: Case Paper ID"
                value={walkInCaseId}
                onChange={e => setWalkInCaseId(e.target.value)}
                className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gmc focus:border-gmc"
            />
            <button
                onClick={handleIssueWalkIn}
                disabled={isIssuing}
                className="w-full sm:w-auto flex justify-center items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gmc hover:bg-gmc-dark disabled:bg-gray-400"
            >
                {isIssuing ? <Spinner size="sm" /> : 'Issue Walk-in'}
            </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token No.</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Paper ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                    <tr><td colSpan={5} className="text-center py-8"><Spinner /></td></tr>
                ) : tokens.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No tokens generated yet for today.</td></tr>
                ) : (
                    tokens.map((token) => (
                        <tr key={token.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-mono font-bold text-gmc-dark">{token.tokenNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{token.casePaperId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(token.generatedAt).toLocaleTimeString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{token.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <select 
                                value={token.category}
                                onChange={(e) => handleCategoryChange(token.id, e.target.value as TokenCategory)}
                                className="text-sm rounded-md border-gray-300 focus:ring-gmc focus:border-gmc"
                            >
                                {Object.values(TokenCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </td>
                        </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default CounterConsole;