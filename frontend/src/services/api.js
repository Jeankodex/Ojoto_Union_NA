const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include'
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }
    
    return response.json();
};

// Auth API
export const authAPI = {
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    
    login: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    
    getCurrentUser: () => apiRequest('/auth/me')
};

// Profile API
export const profileAPI = {
    getProfile: () => apiRequest('/profile'),
    
    updateProfile: (profileData) => apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
    }),
    
    getUser: (userId) => apiRequest(`/profile/${userId}`)
};

// ============ COMMUNITY API ============ //

export const communityAPI = {
    // POSTS
    getPosts: (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return apiRequest(`/community/posts?${params}`);
    },
    
    createPost: (postData) => apiRequest('/community/posts', {
        method: 'POST',
        body: JSON.stringify(postData)
    }),
    
    getPost: (postId) => apiRequest(`/community/posts/${postId}`),
    
    likePost: (postId) => apiRequest(`/community/posts/${postId}/like`, {
        method: 'POST'
    }),
    
    // COMMENTS
    getComments: (postId) => apiRequest(`/community/posts/${postId}/comments`),
    
    addComment: (postId, content) => apiRequest(`/community/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content })
    })
};


// ============ Q&A API ============ //
export const qandaAPI = {
    // QUESTIONS
    getQuestions: (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return apiRequest(`/qanda/questions?${params}`);
    },
    
    createQuestion: (questionData) => apiRequest('/qanda/questions', {
        method: 'POST',
        body: JSON.stringify(questionData)
    }),
    
    getQuestion: (questionId) => apiRequest(`/qanda/questions/${questionId}`),
    
    markQuestionResolved: (questionId) => apiRequest(`/qanda/questions/${questionId}/resolve`, {
        method: 'POST'
    }),
    
    // ANSWERS
    getAnswers: (questionId) => apiRequest(`/qanda/questions/${questionId}/answers`),
    
    addAnswer: (questionId, content) => apiRequest(`/qanda/questions/${questionId}/answers`, {
        method: 'POST',
        body: JSON.stringify({ content })
    }),
    
    markAnswerHelpful: (answerId) => apiRequest(`/qanda/answers/${answerId}/helpful`, {
        method: 'POST'
    })
};


export default {
    auth: authAPI,
    profile: profileAPI,
    community: communityAPI,
    qanda: qandaAPI  // Add this
};