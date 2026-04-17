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
    
    updateProfile: (profileData) => {
        console.log('🔧 API: Sending profile data:', profileData);
        console.log('🔧 API: contact_preferences value:', profileData.contact_preferences);
        console.log('🔧 API: contact_preferences type:', typeof profileData.contact_preferences);
        
        // FORCE stringify everything to ensure it's JSON
        const bodyData = JSON.stringify({
            ...profileData,
            // Double-check contact_preferences
            contact_preferences: profileData.contact_preferences || '{"email":true,"phone":true,"linkedin":true,"inPerson":true}',
            // Double-check privacy_settings
            privacy_settings: profileData.privacy_settings || '{"profileVisibility":"members","contactVisibility":"members","activityVisibility":"public"}'
        });
        
        console.log('🔧 API: Final body being sent:', bodyData);
        
        return apiRequest('/profile', {
            method: 'PUT',
            body: bodyData
        });
    },
    
    getUser: (userId) => apiRequest(`/profile/${userId}`),
    
    // ✅ ADD THIS - Get all profiles for member directory
    getAllProfiles: () => apiRequest('/profile/all'),
    
    // === ADD UPLOAD METHODS HERE ===
    uploadProfilePicture: async (file) => {
        const formData = new FormData();
        formData.append('profilePicture', file);

        const response = await fetch(`${API_URL}/upload/profile-picture`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Profile picture upload failed');
        }
        return data;
    },


    uploadCoverPhoto: async (file) => {
        const formData = new FormData();
        formData.append('coverPhoto', file);

        const response = await fetch(`${API_URL}/upload/cover-photo`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Cover photo upload failed');
        }

        return data;
    },
    updateProfileImages: async (data) => {
        const response = await fetch(`${API_URL}/profile/update-images`, {  // Use API_URL
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }
    // === END UPLOAD METHODS ===
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

// ============ VOLUNTEER API ============ //
export const volunteerAPI = {
    // OPPORTUNITIES
    getOpportunities: (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        return apiRequest(`/volunteer/opportunities?${params}`);
    },
    
    createOpportunity: (opportunityData) => apiRequest('/volunteer/opportunities', {
        method: 'POST',
        body: JSON.stringify(opportunityData)
    }),
    
    getOpportunity: (opportunityId) => apiRequest(`/volunteer/opportunities/${opportunityId}`),
    
    // APPLICATIONS
    applyToOpportunity: (opportunityId, applicationData) => apiRequest(`/volunteer/opportunities/${opportunityId}/apply`, {
        method: 'POST',
        body: JSON.stringify(applicationData)
    }),
    
    getUserApplications: () => apiRequest('/volunteer/applications/my'),
    
    getOpportunityApplications: (opportunityId) => apiRequest(`/volunteer/opportunities/${opportunityId}/applications`),
    
    updateApplicationStatus: (applicationId, status) => apiRequest(`/volunteer/applications/${applicationId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    })
};

// Export everything properly
export default {
    auth: authAPI,
    profile: profileAPI,
    community: communityAPI,
    qanda: qandaAPI,
    volunteer: volunteerAPI
};