import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Button, Input, Badge } from '../components/ui';
import { getAllProblems } from '../api/problems';
import type { ProblemListItem } from '../types';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProblems, setTotalProblems] = useState(0);

  // Fetch problems from database
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await getAllProblems(100, 0); // Fetch first 100 problems
        if (response.success && response.data) {
          setProblems(response.data);
          setTotalProblems(response.total || response.data.length);
        } else {
          toast.error(response.error || 'Failed to fetch problems');
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
        toast.error('Failed to load problems');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || p.difficulty.toLowerCase() === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProblems = filteredProblems.slice(startIndex, endIndex);

  const handleQuestionClick = (id: number) => {
    navigate(`/problems/${id}`);
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-50 mb-2">Problem Set</h1>
          <p className="text-dark-400">
            {loading ? 'Loading...' : `Solve ${totalProblems} coding challenges to improve your skills`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-400 text-sm mb-1">Total Solved</p>
                <p className="text-3xl font-bold text-dark-50">
                  {problems.filter((p) => p.solved).length}
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
                  {problems.filter((p) => p.difficulty === 'Easy' && p.solved).length}/
                  {problems.filter((p) => p.difficulty === 'Easy').length}
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
                  {problems.filter((p) => p.difficulty === 'Medium' && p.solved).length}/
                  {problems.filter((p) => p.difficulty === 'Medium').length}
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
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary-500 mr-2" size={24} />
                        <span className="text-dark-400">Loading problems...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentProblems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-dark-400">
                      No problems found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  currentProblems.map((problem) => (
                    <tr
                      key={problem.id}
                      onClick={() => handleQuestionClick(problem.id)}
                      className="hover:bg-dark-800 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {problem.solved ? (
                          <CheckCircle2 className="text-green-500" size={20} />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-dark-700"></div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-dark-300 mr-3 text-sm">{problem.id}.</span>
                          <span className="text-dark-50 font-medium hover:text-primary-500 transition-colors">
                            {problem.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}>
                          {problem.difficulty}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-dark-400 text-sm">
                        {problem.tags.length > 0 ? problem.tags[0] : 'General'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-dark-400 text-sm">
                        {problem.acceptance || 0}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-dark-800 px-6 py-4 flex items-center justify-between border-t border-dark-700">
            <div className="text-sm text-dark-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProblems.length)} of{' '}
              {filteredProblems.length} problems
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
