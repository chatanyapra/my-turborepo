import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button, Input, Badge } from '../components/ui';
import { mockQuestions } from '../data/mockQuestions';

const ITEMS_PER_PAGE = 10;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  // Filter questions
  const filteredQuestions = mockQuestions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  const handleQuestionClick = (id: number) => {
    navigate(`/problem/${id}`);
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-50 mb-2">Problem Set</h1>
          <p className="text-dark-400">
            Solve {mockQuestions.length} coding challenges to improve your skills
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm mb-1">Total Solved</p>
                <p className="text-3xl font-bold text-dark-50">
                  {mockQuestions.filter((q) => q.solved).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="text-green-500" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500">
              <span>↑ 12% from last week</span>
            </div>
          </div>

          <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm mb-1">Easy</p>
                <p className="text-3xl font-bold text-dark-50">
                  {mockQuestions.filter((q) => q.difficulty === 'easy' && q.solved).length}/
                  {mockQuestions.filter((q) => q.difficulty === 'easy').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🟢</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm mb-1">Medium</p>
                <p className="text-3xl font-bold text-dark-50">
                  {mockQuestions.filter((q) => q.difficulty === 'medium' && q.solved).length}/
                  {mockQuestions.filter((q) => q.difficulty === 'medium').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🟡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-900 border border-dark-800 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={difficultyFilter === 'all' ? 'primary' : 'secondary'}
                onClick={() => setDifficultyFilter('all')}
              >
                All
              </Button>
              <Button
                variant={difficultyFilter === 'easy' ? 'primary' : 'secondary'}
                onClick={() => setDifficultyFilter('easy')}
              >
                Easy
              </Button>
              <Button
                variant={difficultyFilter === 'medium' ? 'primary' : 'secondary'}
                onClick={() => setDifficultyFilter('medium')}
              >
                Medium
              </Button>
              <Button
                variant={difficultyFilter === 'hard' ? 'primary' : 'secondary'}
                onClick={() => setDifficultyFilter('hard')}
              >
                Hard
              </Button>
            </div>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-800 border-b border-dark-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Acceptance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {currentQuestions.map((question) => (
                  <tr
                    key={question.id}
                    onClick={() => handleQuestionClick(question.id)}
                    className="hover:bg-dark-800 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {question.solved ? (
                        <CheckCircle2 className="text-green-500" size={20} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-dark-700"></div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-dark-300 mr-3 text-sm">{question.id}.</span>
                        <span className="text-dark-50 font-medium hover:text-primary-500 transition-colors">
                          {question.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={question.difficulty}>{question.difficulty}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-dark-400 text-sm">
                      {question.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-dark-400 text-sm">
                      {question.acceptance}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-dark-800 px-6 py-4 flex items-center justify-between border-t border-dark-700">
            <div className="text-sm text-dark-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredQuestions.length)} of{' '}
              {filteredQuestions.length} problems
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
