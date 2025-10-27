export interface Question {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  acceptance: number;
  solved: boolean;
}

export const mockQuestions: Question[] = [
  { id: 1, title: 'Two Sum', difficulty: 'easy', category: 'Array', acceptance: 49.2, solved: true },
  { id: 2, title: 'Add Two Numbers', difficulty: 'medium', category: 'Linked List', acceptance: 40.1, solved: true },
  { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', category: 'String', acceptance: 33.8, solved: false },
  { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'hard', category: 'Array', acceptance: 35.2, solved: false },
  { id: 5, title: 'Longest Palindromic Substring', difficulty: 'medium', category: 'String', acceptance: 32.4, solved: false },
  { id: 6, title: 'Zigzag Conversion', difficulty: 'medium', category: 'String', acceptance: 44.8, solved: false },
  { id: 7, title: 'Reverse Integer', difficulty: 'medium', category: 'Math', acceptance: 27.5, solved: true },
  { id: 8, title: 'String to Integer (atoi)', difficulty: 'medium', category: 'String', acceptance: 16.5, solved: false },
  { id: 9, title: 'Palindrome Number', difficulty: 'easy', category: 'Math', acceptance: 53.1, solved: true },
  { id: 10, title: 'Regular Expression Matching', difficulty: 'hard', category: 'String', acceptance: 27.9, solved: false },
  { id: 11, title: 'Container With Most Water', difficulty: 'medium', category: 'Array', acceptance: 54.2, solved: false },
  { id: 12, title: 'Integer to Roman', difficulty: 'medium', category: 'Math', acceptance: 61.8, solved: false },
  { id: 13, title: 'Roman to Integer', difficulty: 'easy', category: 'Math', acceptance: 58.7, solved: true },
  { id: 14, title: 'Longest Common Prefix', difficulty: 'easy', category: 'String', acceptance: 41.2, solved: false },
  { id: 15, title: '3Sum', difficulty: 'medium', category: 'Array', acceptance: 32.4, solved: false },
  { id: 16, title: '3Sum Closest', difficulty: 'medium', category: 'Array', acceptance: 45.8, solved: false },
  { id: 17, title: 'Letter Combinations of a Phone Number', difficulty: 'medium', category: 'Backtracking', acceptance: 56.3, solved: false },
  { id: 18, title: '4Sum', difficulty: 'medium', category: 'Array', acceptance: 36.2, solved: false },
  { id: 19, title: 'Remove Nth Node From End of List', difficulty: 'medium', category: 'Linked List', acceptance: 42.1, solved: false },
  { id: 20, title: 'Valid Parentheses', difficulty: 'easy', category: 'Stack', acceptance: 40.8, solved: true },
  { id: 21, title: 'Merge Two Sorted Lists', difficulty: 'easy', category: 'Linked List', acceptance: 61.2, solved: false },
  { id: 22, title: 'Generate Parentheses', difficulty: 'medium', category: 'Backtracking', acceptance: 72.4, solved: false },
  { id: 23, title: 'Merge k Sorted Lists', difficulty: 'hard', category: 'Linked List', acceptance: 49.8, solved: false },
  { id: 24, title: 'Swap Nodes in Pairs', difficulty: 'medium', category: 'Linked List', acceptance: 61.5, solved: false },
  { id: 25, title: 'Reverse Nodes in k-Group', difficulty: 'hard', category: 'Linked List', acceptance: 54.2, solved: false },
];
