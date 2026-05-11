// ============================================
// Base Types
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  result: T[];
  items?: T[]; // Some endpoints use 'items' instead of 'data'
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ============================================
// User & Auth Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role?: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  totalCorrectScore?: number;
  rank?: string;
  answers?: any[];
  user?: User;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginDto {
  email?: string;
  password?: string;
  email_or_phone?: string;
}

export interface SignupDto {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse extends AuthTokens {
  user?: User;
}

// ============================================
// Quiz Types
// ============================================

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  questionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  points: number;
  quizId: string;
  options?: QuizOption[];
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  price?: number;
  duration?: number; // in minutes
  totalQuestions?: number;
  difficulty?: "easy" | "medium" | "hard";
  thumbnail?: string;
  image?: string;
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
  questions: QuizQuestion[];
  sold?: number;
  rating?: number;
  createdAt: string;
  updatedAt?: string;
  category?: Category;
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  category?: string;
  categoryId?: string;
  price: number;
  duration?: number;
  difficulty?: "easy" | "medium" | "hard";
  thumbnail?: string;
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * UpdateQuizDto represents the data transfer object for updating a quiz.
 * All properties are optional as it extends Partial<CreateQuizDto>.
 */
export type UpdateQuizDto = Partial<CreateQuizDto>;

export interface QuizSubmission {
  quizId: string;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
}

export interface QuizResult {
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  answers: {
    questionId: string;
    answer: string | string[];
    isCorrect: boolean;
    points: number;
  }[];
  completedAt: string;
}

// ============================================
// Category Types
// ============================================

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  color?: string;
  products?: Product[]
  quizCount?: number;
  createdAt: string;
  updatedAt: string;

}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string;
  color?: string;
}

/**
 * UpdateCategoryDto represents the data transfer object for updating a category.
 * All properties are optional as it extends Partial<CreateCategoryDto>.
 */
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

// ============================================
// Article Types
// ============================================

export interface Article {
  id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  author?: string;
  authorId?: string;
  category?: string;
  categoryId?: string;
  thumbnail?: string;
  image?: string;
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  viewCount?: number;
  readTime?: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleDto {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  author?: string;
  category?: string;
  thumbnail?: string;
  coverImage?: string;
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: string;
}

export interface CreateAnswerDto {
  quizId: string;
  questionAnswerDto: {
    questionId?: string;
    optionId?: string;
  }[];
}

/**
 * UpdateArticleDto represents the data transfer object for updating an article.
 * All properties are optional as it extends Partial<CreateArticleDto>.
 */
export type UpdateArticleDto = Partial<CreateArticleDto>;

export interface ArticleQueryParams extends PaginationParams {
  category?: string;
  author?: string;
  isPublished?: boolean;
}

// ============================================
// Banner Types
// ============================================

export interface Banner {
  id: string;
  name: string;
  subname?: string;
  description?: string;
  image: string;
  imageUrl?: string;
  link?: string;
  buttonText?: string;
  isActive?: boolean;
  order?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerDto {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
  buttonText?: string;
  isActive?: boolean;
  order?: number;
  startDate?: string;
  endDate?: string;
}



export interface Product {
  id: string;
  title: string;
  description?: string;
  author?: string;
  category?: string;
  categoryId?: string;
  image: string;
  fileUrl?: string;
  price: number;
  offerPrice?: number;
  sellPrice?: number;
  brand?: string;
  language?: string;
  publishedDate?: string;
  isbn?: string;
  rating: number;
  stock: number;
  totalSell: number;
  discountPercentage: number;
  downloadCount?: number;
  createdAt: string;
  updatedAt: string;
}



/**
 * UpdateBannerDto represents the data transfer object for updating a banner.
 * All properties are optional as it extends Partial<CreateBannerDto>.
 */
export type UpdateBannerDto = Partial<CreateBannerDto>;

// ============================================
// Ebook Types
// ============================================

export interface Ebook {
  id: string;
  title: string;
  description?: string;
  author?: string;
  category?: string;
  categoryId?: string;
  coverImage?: string;
  fileUrl?: string;
  price: number;
  pages?: number;
  language?: string;
  publishedDate?: string;
  isbn?: string;
  rating?: number;
  downloadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEbookDto {
  title: string;
  description?: string;
  author?: string;
  category?: string;
  coverImage?: string;
  fileUrl?: string;
  price: number;
  pages?: number;
  language?: string;
  publishedDate?: string;
  isbn?: string;
}

/**
 * UpdateEbookDto represents the data transfer object for updating an ebook.
 * All properties are optional as it extends Partial<CreateEbookDto>.
 */
export type UpdateEbookDto = Partial<CreateEbookDto>;

/**
 * EbookResponseDto represents the response data transfer object for an ebook.
 * This is an alias for the Ebook interface and can be extended in the future if needed.
 */
export type EbookResponseDto = Ebook;

// ============================================
// Cart & Order Types (Client-Side)
// ============================================

export interface CartItem {
  quiz: Quiz;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// ============================================
// Leaderboard Types
// ============================================

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  points: number;
  rank: number;
  quizzesCompleted: number;
  isMe?: boolean;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  myRank?: LeaderboardEntry;
}
