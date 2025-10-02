import { apiClient } from '@/utils/api';

export interface News {
  id: string;
  title: string;
  content: string;
  summary: string;
  image_url?: string;
  publish_date: string;
  expire_date?: string;
  category: string;
  tags: string[];
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface NewsFilter {
  category?: string;
  search?: string;
  published_only?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  summary: string;
  image_url?: string;
  publish_date: string;
  expire_date?: string;
  category: string;
  tags: string[];
  is_published: boolean;
}

export interface UpdateNewsRequest extends Partial<CreateNewsRequest> {
  id: string;
}

export interface UnreadNewsCount {
  count: number;
}

class NewsService {
  async getUnreadNewsCount(): Promise<number> {
    try {
      const response = await apiClient.get<UnreadNewsCount>('/news/unread/count');
      return response.count;
    } catch (error) {
      console.error('Failed to get unread news count:', error);
      return 0;
    }
  }

  async markNewsAsRead(newsId: string): Promise<void> {
    try {
      await apiClient.post(`/news/${newsId}/read`);
    } catch (error) {
      console.error('Failed to mark news as read:', error);
    }
  }

  async getNews(filter: NewsFilter = {}): Promise<{
    news: News[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<{
        news: News[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/news?${params.toString()}`);

      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNewsById(id: string): Promise<News> {
    try {
      const response = await apiClient.get<News>(`/news/${id}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createNews(news: CreateNewsRequest): Promise<News> {
    try {
      const response = await apiClient.post<News>('/news', news);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateNews(news: UpdateNewsRequest): Promise<News> {
    try {
      const response = await apiClient.put<News>(`/news/${news.id}`, news);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteNews(id: string): Promise<void> {
    try {
      await apiClient.delete(`/news/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    console.error('News service error:', error);
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    return new Error('An error occurred while processing your request');
  }
}

export const newsService = new NewsService();
