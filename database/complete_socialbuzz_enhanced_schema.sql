-- ================================================================
-- SOCIALBUZZ ENHANCED DATABASE SCHEMA - COMPLETE SOCIAL PLATFORM
-- ================================================================
-- Enhanced schema with comprehensive social media features
-- Includes: Posts, Comments, Likes, Follows, Stories, Groups, Events, Live Streaming

-- Drop existing tables if they exist (in dependency order)
DROP TABLE IF EXISTS live_stream_viewers CASCADE;
DROP TABLE IF EXISTS live_streams CASCADE;
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS group_posts CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS story_views CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS post_media CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS followers CASCADE;
DROP TABLE IF EXISTS user_blocks CASCADE;
DROP TABLE IF EXISTS user_reports CASCADE;
DROP TABLE IF EXISTS notification_settings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS transaction_fees CASCADE;
DROP TABLE IF EXISTS payout_requests CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ================================================================
-- CATEGORIES TABLE (For content categorization)
-- ================================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- hex color code
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- USERS TABLE (Enhanced with social features)
-- ================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar TEXT,
    cover_image TEXT,
    bio TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin', 'super_admin', 'moderator')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'pending', 'deactivated')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMP,
    last_login TIMESTAMP,
    last_seen TIMESTAMP,
    is_online BOOLEAN DEFAULT FALSE,
    privacy_level VARCHAR(20) DEFAULT 'public' CHECK (privacy_level IN ('public', 'private', 'friends_only')),
    allow_messages VARCHAR(20) DEFAULT 'everyone' CHECK (allow_messages IN ('everyone', 'followers', 'none')),
    
    -- Financial data
    balance DECIMAL(15,2) DEFAULT 0.00,
    total_earnings DECIMAL(15,2) DEFAULT 0.00,
    total_donations DECIMAL(15,2) DEFAULT 0.00,
    total_spent DECIMAL(15,2) DEFAULT 0.00,
    
    -- Social metrics
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    total_supporters INTEGER DEFAULT 0,
    
    -- Platform metrics
    views_count BIGINT DEFAULT 0,
    likes_received BIGINT DEFAULT 0,
    
    -- Account settings
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'id',
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- USER PROFILES TABLE (Extended profile information)
-- ================================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    website VARCHAR(255),
    location VARCHAR(255),
    birth_date DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    
    -- Social links
    social_links JSONB DEFAULT '{}', -- {youtube, instagram, twitter, tiktok, etc}
    
    -- Creator specific
    category_id UUID REFERENCES categories(id),
    specialty TEXT,
    experience_years INTEGER,
    education TEXT,
    achievements TEXT[],
    
    -- Preferences and settings
    preferences JSONB DEFAULT '{}',
    notification_preferences JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    
    -- Business information (for creators)
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    tax_id VARCHAR(50),
    
    -- Banking details
    bank_details JSONB DEFAULT '{}',
    
    -- KYC information
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'under_review', 'verified', 'rejected')),
    kyc_documents JSONB DEFAULT '{}',
    kyc_verified_at TIMESTAMP,
    
    -- Creator goals and content
    donation_goal DECIMAL(15,2),
    monthly_goal DECIMAL(15,2),
    donation_message TEXT,
    featured_content JSONB DEFAULT '[]',
    content_schedule JSONB DEFAULT '{}',
    
    -- Profile customization
    profile_color VARCHAR(7), -- hex color
    profile_theme VARCHAR(50),
    custom_css TEXT,
    
    -- Tags and interests
    tags TEXT[],
    interests TEXT[],
    skills TEXT[],
    
    -- Statistics
    profile_views BIGINT DEFAULT 0,
    last_active TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- FOLLOWERS TABLE (Follow/Following relationships)
-- ================================================================
CREATE TABLE followers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'muted', 'blocked')),
    is_close_friend BOOLEAN DEFAULT FALSE,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- ================================================================
-- USER BLOCKS TABLE (Blocked users)
-- ================================================================
CREATE TABLE user_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(100),
    blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blocker_id, blocked_id),
    CHECK (blocker_id != blocked_id)
);

-- ================================================================
-- USER REPORTS TABLE (Content/User reporting)
-- ================================================================
CREATE TABLE user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_content_type VARCHAR(50), -- 'user', 'post', 'comment', 'story'
    reported_content_id UUID,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved', 'dismissed')),
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- POSTS TABLE (User posts/content)
-- ================================================================
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'image', 'video', 'audio', 'poll', 'article', 'donation_request')),
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private', 'unlisted')),
    
    -- Post metadata
    title VARCHAR(500),
    excerpt TEXT,
    featured_image TEXT,
    reading_time INTEGER, -- in minutes
    
    -- Media and attachments
    media_urls TEXT[],
    media_metadata JSONB DEFAULT '{}',
    
    -- Post settings
    allow_comments BOOLEAN DEFAULT TRUE,
    allow_likes BOOLEAN DEFAULT TRUE,
    allow_shares BOOLEAN DEFAULT TRUE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Categories and tags
    category_id UUID REFERENCES categories(id),
    tags TEXT[],
    hashtags TEXT[],
    
    -- Engagement metrics
    views_count BIGINT DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    
    -- Monetization
    is_monetized BOOLEAN DEFAULT FALSE,
    price DECIMAL(15,2),
    is_premium_only BOOLEAN DEFAULT FALSE,
    
    -- Scheduling
    publish_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Content moderation
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled', 'archived', 'removed', 'flagged')),
    moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
    moderation_notes TEXT,
    
    -- Location
    location JSONB, -- {lat, lng, name, address}
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    slug VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- POST MEDIA TABLE (Detailed media information)
-- ================================================================
CREATE TABLE post_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', 'audio', 'document')),
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    duration INTEGER, -- for video/audio in seconds
    thumbnail_url TEXT,
    alt_text TEXT,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    is_sensitive BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- COMMENTS TABLE (Post comments)
-- ================================================================
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    
    -- Comment metadata
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    
    -- Moderation
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'removed', 'flagged')),
    is_pinned BOOLEAN DEFAULT FALSE,
    
    -- Threading depth control
    depth_level INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- POST LIKES TABLE (Post likes/reactions)
-- ================================================================
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'laugh', 'angry', 'sad', 'wow')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- ================================================================
-- COMMENT LIKES TABLE (Comment likes/reactions)
-- ================================================================
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) DEFAULT 'like' CHECK (reaction_type IN ('like', 'love', 'laugh', 'angry', 'sad', 'wow')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id)
);

-- ================================================================
-- STORIES TABLE (Temporary content/stories)
-- ================================================================
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    media_url TEXT,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'video', 'text')),
    background_color VARCHAR(7),
    font_style VARCHAR(50),
    duration INTEGER DEFAULT 24, -- hours
    
    -- Story settings
    visibility VARCHAR(20) DEFAULT 'followers' CHECK (visibility IN ('public', 'followers', 'close_friends', 'custom')),
    allow_replies BOOLEAN DEFAULT TRUE,
    allow_reactions BOOLEAN DEFAULT TRUE,
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    
    -- Story highlights
    is_highlighted BOOLEAN DEFAULT FALSE,
    highlight_category VARCHAR(100),
    
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- STORY VIEWS TABLE (Story view tracking)
-- ================================================================
CREATE TABLE story_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(story_id, viewer_id)
);

-- ================================================================
-- GROUPS TABLE (Community groups)
-- ================================================================
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    avatar TEXT,
    cover_image TEXT,
    
    -- Group settings
    type VARCHAR(20) DEFAULT 'public' CHECK (type IN ('public', 'private', 'secret')),
    join_policy VARCHAR(20) DEFAULT 'open' CHECK (join_policy IN ('open', 'approval_required', 'invite_only')),
    post_policy VARCHAR(20) DEFAULT 'members' CHECK (post_policy IN ('anyone', 'members', 'admins_only')),
    
    -- Group details
    category_id UUID REFERENCES categories(id),
    location VARCHAR(255),
    website VARCHAR(255),
    rules TEXT,
    tags TEXT[],
    
    -- Metrics
    members_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Administration
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- GROUP MEMBERS TABLE (Group membership)
-- ================================================================
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin', 'owner')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'banned', 'left')),
    
    -- Member settings
    notifications_enabled BOOLEAN DEFAULT TRUE,
    is_muted BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    UNIQUE(group_id, user_id)
);

-- ================================================================
-- GROUP POSTS TABLE (Posts within groups)
-- ================================================================
CREATE TABLE group_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    posted_by UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Group post specific settings
    is_pinned BOOLEAN DEFAULT FALSE,
    is_announcement BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, post_id)
);

-- ================================================================
-- EVENTS TABLE (Event management)
-- ================================================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE,
    
    -- Event details
    type VARCHAR(20) DEFAULT 'online' CHECK (type IN ('online', 'offline', 'hybrid')),
    category_id UUID REFERENCES categories(id),
    
    -- Scheduling
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Location (for offline events)
    venue_name VARCHAR(255),
    venue_address TEXT,
    venue_coordinates JSONB, -- {lat, lng}
    
    -- Online event details
    meeting_url TEXT,
    streaming_url TEXT,
    meeting_password VARCHAR(100),
    
    -- Media
    banner_image TEXT,
    gallery_images TEXT[],
    
    -- Event settings
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    registration_required BOOLEAN DEFAULT FALSE,
    max_attendees INTEGER,
    is_paid BOOLEAN DEFAULT FALSE,
    ticket_price DECIMAL(15,2),
    
    -- Content
    agenda JSONB DEFAULT '[]',
    tags TEXT[],
    
    -- Metrics
    attendees_count INTEGER DEFAULT 0,
    interested_count INTEGER DEFAULT 0,
    
    -- Organization
    organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'live', 'completed', 'cancelled')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- EVENT ATTENDEES TABLE (Event attendance)
-- ================================================================
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'interested' CHECK (status IN ('interested', 'going', 'maybe', 'not_going')),
    
    -- Registration details
    registration_data JSONB DEFAULT '{}',
    ticket_id VARCHAR(100),
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded', 'cancelled')),
    
    -- Timestamps
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checked_in_at TIMESTAMP,
    
    UNIQUE(event_id, user_id)
);

-- ================================================================
-- LIVE STREAMS TABLE (Live streaming)
-- ================================================================
CREATE TABLE live_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Stream details
    stream_key VARCHAR(255) UNIQUE,
    stream_url TEXT,
    thumbnail_url TEXT,
    category_id UUID REFERENCES categories(id),
    tags TEXT[],
    
    -- Stream settings
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'private')),
    allow_comments BOOLEAN DEFAULT TRUE,
    allow_donations BOOLEAN DEFAULT TRUE,
    is_premium_only BOOLEAN DEFAULT FALSE,
    
    -- Metrics
    viewers_count INTEGER DEFAULT 0,
    max_viewers INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    donations_count INTEGER DEFAULT 0,
    total_donations DECIMAL(15,2) DEFAULT 0.00,
    
    -- Status and timing
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    duration INTEGER, -- in seconds
    
    -- Recording
    is_recorded BOOLEAN DEFAULT FALSE,
    recording_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- LIVE STREAM VIEWERS TABLE (Live stream viewership)
-- ================================================================
CREATE TABLE live_stream_viewers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP,
    watch_duration INTEGER DEFAULT 0, -- in seconds
    UNIQUE(stream_id, user_id)
);

-- ================================================================
-- TRANSACTIONS TABLE (Enhanced with more transaction types)
-- ================================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Transaction details
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'donation', 'payout', 'fee', 'refund', 'bonus', 
        'subscription', 'tip', 'gift', 'premium_upgrade',
        'event_ticket', 'group_membership', 'content_purchase'
    )),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    
    -- Status and processing
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'completed', 'failed', 
        'cancelled', 'refunded', 'disputed'
    )),
    
    -- Payment details
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    external_transaction_id VARCHAR(255),
    reference_id VARCHAR(255),
    
    -- Content and context
    description TEXT,
    message TEXT,
    related_content_type VARCHAR(50), -- 'post', 'stream', 'event', etc.
    related_content_id UUID,
    
    -- Metadata and fees
    metadata JSONB DEFAULT '{}',
    fee_amount DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2),
    
    -- Processing timestamps
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Notes and tracking
    admin_notes TEXT,
    failure_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- PAYOUT REQUESTS TABLE (Enhanced)
-- ================================================================
CREATE TABLE payout_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    
    -- Request details
    type VARCHAR(20) DEFAULT 'manual' CHECK (type IN ('manual', 'automatic', 'scheduled')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'approved', 'rejected', 
        'completed', 'cancelled', 'failed'
    )),
    
    -- Banking information
    bank_details JSONB NOT NULL,
    payout_method VARCHAR(50) DEFAULT 'bank_transfer',
    
    -- Processing details
    admin_notes TEXT,
    rejection_reason TEXT,
    processing_fee DECIMAL(15,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2),
    
    -- Staff tracking
    processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- External tracking
    external_payout_id VARCHAR(255),
    transaction_hash VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- TRANSACTION FEES TABLE (Enhanced)
-- ================================================================
CREATE TABLE transaction_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    fee_type VARCHAR(50) NOT NULL CHECK (fee_type IN (
        'platform_fee', 'payment_gateway_fee', 'processing_fee',
        'currency_conversion_fee', 'international_fee', 'premium_fee'
    )),
    amount DECIMAL(15,2) NOT NULL,
    percentage DECIMAL(5,2),
    currency VARCHAR(3) DEFAULT 'IDR',
    description TEXT,
    
    -- Fee details
    calculation_base DECIMAL(15,2),
    minimum_fee DECIMAL(15,2),
    maximum_fee DECIMAL(15,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- NOTIFICATIONS TABLE (Enhanced)
-- ================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'donation_received', 'payout_approved', 'payout_rejected',
        'new_follower', 'new_comment', 'new_like', 'new_share',
        'mention', 'tag', 'message', 'friend_request',
        'group_invitation', 'event_reminder', 'live_stream_started',
        'system_announcement', 'security_alert', 'content_approved',
        'content_rejected', 'achievement_unlocked', 'milestone_reached'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related content
    related_type VARCHAR(50), -- 'user', 'post', 'comment', 'transaction', etc.
    related_id UUID,
    action_url TEXT,
    
    -- Notification data and metadata
    data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    
    -- Status and priority
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Delivery settings
    delivery_methods TEXT[] DEFAULT ARRAY['in_app'], -- in_app, email, push, sms
    sent_via TEXT[],
    
    -- Expiration and grouping
    expires_at TIMESTAMP,
    group_key VARCHAR(255), -- for grouping similar notifications
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- NOTIFICATION SETTINGS TABLE (Enhanced)
-- ================================================================
CREATE TABLE notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- General notification channels
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    in_app_notifications BOOLEAN DEFAULT TRUE,
    
    -- Specific notification types
    donation_notifications BOOLEAN DEFAULT TRUE,
    payout_notifications BOOLEAN DEFAULT TRUE,
    security_notifications BOOLEAN DEFAULT TRUE,
    marketing_notifications BOOLEAN DEFAULT FALSE,
    
    -- Social notifications
    follow_notifications BOOLEAN DEFAULT TRUE,
    comment_notifications BOOLEAN DEFAULT TRUE,
    like_notifications BOOLEAN DEFAULT TRUE,
    mention_notifications BOOLEAN DEFAULT TRUE,
    message_notifications BOOLEAN DEFAULT TRUE,
    
    -- Group and event notifications
    group_notifications BOOLEAN DEFAULT TRUE,
    event_notifications BOOLEAN DEFAULT TRUE,
    live_stream_notifications BOOLEAN DEFAULT TRUE,
    
    -- Frequency settings
    notification_frequency VARCHAR(20) DEFAULT 'instant' CHECK (notification_frequency IN ('instant', 'hourly', 'daily', 'weekly')),
    digest_frequency VARCHAR(20) DEFAULT 'daily' CHECK (digest_frequency IN ('never', 'daily', 'weekly')),
    
    -- Quiet hours
    quiet_hours_enabled BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    quiet_hours_timezone VARCHAR(50) DEFAULT 'UTC',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- ================================================================
-- SYSTEM SETTINGS TABLE (Enhanced)
-- ================================================================
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    data_type VARCHAR(20) DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json', 'array')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    validation_rules JSONB DEFAULT '{}',
    
    -- Organization
    sort_order INTEGER DEFAULT 0,
    group_name VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, key)
);

-- ================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_seen ON users(last_seen);
CREATE INDEX idx_users_is_online ON users(is_online);

-- User profiles indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_category_id ON user_profiles(category_id);

-- Followers indexes
CREATE INDEX idx_followers_follower_id ON followers(follower_id);
CREATE INDEX idx_followers_following_id ON followers(following_id);
CREATE INDEX idx_followers_status ON followers(status);
CREATE INDEX idx_followers_followed_at ON followers(followed_at);

-- Posts indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_visibility ON posts(visibility);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_hashtags ON posts USING GIN(hashtags);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Comments indexes
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Likes indexes
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);

-- Stories indexes
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);
CREATE INDEX idx_stories_visibility ON stories(visibility);

-- Groups indexes
CREATE INDEX idx_groups_type ON groups(type);
CREATE INDEX idx_groups_status ON groups(status);
CREATE INDEX idx_groups_created_by ON groups(created_by);
CREATE INDEX idx_groups_category_id ON groups(category_id);

-- Group members indexes
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_role ON group_members(role);
CREATE INDEX idx_group_members_status ON group_members(status);

-- Events indexes
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category_id ON events(category_id);

-- Live streams indexes
CREATE INDEX idx_live_streams_user_id ON live_streams(user_id);
CREATE INDEX idx_live_streams_status ON live_streams(status);
CREATE INDEX idx_live_streams_started_at ON live_streams(started_at);
CREATE INDEX idx_live_streams_category_id ON live_streams(category_id);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_recipient_id ON transactions(recipient_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_reference_id ON transactions(reference_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_priority ON notifications(priority);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_stream_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Categories (public read)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (is_active = true);

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Public profiles are viewable" ON users
    FOR SELECT USING (status = 'active' AND privacy_level IN ('public'));

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- User profiles policies
CREATE POLICY "Users can manage their own profile data" ON user_profiles
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Public profile data is viewable" ON user_profiles
    FOR SELECT USING (EXISTS(
        SELECT 1 FROM users WHERE id = user_profiles.user_id 
        AND status = 'active' AND privacy_level IN ('public')
    ));

-- Followers policies
CREATE POLICY "Users can manage their follow relationships" ON followers
    FOR ALL USING (
        auth.uid()::text = follower_id::text OR 
        auth.uid()::text = following_id::text
    );

-- Posts policies
CREATE POLICY "Users can manage their own posts" ON posts
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Public posts are viewable" ON posts
    FOR SELECT USING (
        (visibility = 'public' AND status = 'published') OR
        (auth.uid()::text = user_id::text)
    );

-- Comments policies
CREATE POLICY "Users can manage their own comments" ON comments
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Comments on viewable posts are viewable" ON comments
    FOR SELECT USING (EXISTS(
        SELECT 1 FROM posts WHERE id = comments.post_id 
        AND (visibility = 'public' OR user_id::text = auth.uid()::text)
    ));

-- Likes policies
CREATE POLICY "Users can manage their own likes" ON post_likes
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own comment likes" ON comment_likes
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Stories policies
CREATE POLICY "Users can manage their own stories" ON stories
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Public stories are viewable" ON stories
    FOR SELECT USING (
        (visibility = 'public') OR
        (auth.uid()::text = user_id::text)
    );

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR 
        auth.uid()::text = recipient_id::text
    );

-- Notifications policies
CREATE POLICY "Users can manage their own notifications" ON notifications
    FOR ALL USING (auth.uid()::text = user_id::text);

-- ================================================================
-- TRIGGERS FOR UPDATED_AT AND COUNTERS
-- ================================================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_streams_updated_at BEFORE UPDATE ON live_streams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Counter update functions
CREATE OR REPLACE FUNCTION update_user_followers_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET followers_count = followers_count + 1 
        WHERE id = NEW.following_id;
        
        UPDATE users SET following_count = following_count + 1 
        WHERE id = NEW.follower_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET followers_count = followers_count - 1 
        WHERE id = OLD.following_id;
        
        UPDATE users SET following_count = following_count - 1 
        WHERE id = OLD.follower_id;
        
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_followers_count
    AFTER INSERT OR DELETE ON followers
    FOR EACH ROW EXECUTE FUNCTION update_user_followers_count();

-- ================================================================
-- FUNCTIONS AND STORED PROCEDURES
-- ================================================================

-- Function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    followers_count INTEGER,
    following_count INTEGER,
    posts_count INTEGER,
    total_donations DECIMAL(15,2),
    total_supporters INTEGER,
    avg_donation DECIMAL(15,2),
    last_donation_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.followers_count,
        u.following_count,
        u.posts_count,
        u.total_donations,
        u.total_supporters,
        COALESCE(AVG(t.amount), 0) as avg_donation,
        MAX(t.created_at) as last_donation_date
    FROM users u
    LEFT JOIN transactions t ON t.recipient_id = u.id 
        AND t.type = 'donation' 
        AND t.status = 'completed'
    WHERE u.id = user_uuid
    GROUP BY u.id, u.followers_count, u.following_count, u.posts_count, u.total_donations, u.total_supporters;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending posts
CREATE OR REPLACE FUNCTION get_trending_posts(
    limit_count INTEGER DEFAULT 10,
    hours_back INTEGER DEFAULT 24
)
RETURNS TABLE (
    post_id UUID,
    title VARCHAR(500),
    user_id UUID,
    username VARCHAR(50),
    engagement_score DECIMAL(10,2),
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as post_id,
        p.title,
        p.user_id,
        u.username,
        -- Engagement score calculation
        (p.likes_count * 1.0 + p.comments_count * 2.0 + p.shares_count * 3.0 + 
         p.views_count * 0.1) / EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - p.created_at))/3600 as engagement_score,
        p.created_at
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.status = 'published' 
    AND p.visibility = 'public'
    AND p.created_at >= CURRENT_TIMESTAMP - (hours_back || ' hours')::INTERVAL
    ORDER BY engagement_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- INSERT SAMPLE DATA
-- ================================================================

-- Insert categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Gaming', 'gaming', 'Gaming content and streams', 'gamepad-2', '#8B5CF6'),
('Music', 'music', 'Music and audio content', 'music', '#F59E0B'),
('Art', 'art', 'Digital and traditional art', 'palette', '#EF4444'),
('Technology', 'technology', 'Tech reviews and tutorials', 'cpu', '#3B82F6'),
('Cooking', 'cooking', 'Cooking and food content', 'chef-hat', '#10B981'),
('Education', 'education', 'Educational content', 'graduation-cap', '#6366F1'),
('Fitness', 'fitness', 'Health and fitness content', 'dumbbell', '#F97316'),
('Travel', 'travel', 'Travel and adventure', 'map-pin', '#14B8A6'),
('Comedy', 'comedy', 'Comedy and entertainment', 'laugh', '#F472B6'),
('Lifestyle', 'lifestyle', 'Lifestyle and vlogs', 'heart', '#A855F7');

-- Insert system settings
INSERT INTO system_settings (category, key, value, data_type, description, is_public) VALUES
('platform', 'name', 'SocialBuzz', 'string', 'Platform name', true),
('platform', 'version', '2.0.0', 'string', 'Platform version', true),
('platform', 'maintenance_mode', 'false', 'boolean', 'Maintenance mode status', true),
('platform', 'max_upload_size', '104857600', 'number', 'Max file upload size in bytes (100MB)', false),
('platform', 'allowed_file_types', '["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm", "audio/mpeg", "audio/wav"]', 'json', 'Allowed file types for upload', false),

('payment', 'duitku_merchant_code', 'DS17625', 'string', 'Duitku merchant code', false),
('payment', 'duitku_sandbox_mode', 'true', 'boolean', 'Duitku sandbox mode', false),
('payment', 'minimum_donation', '5000', 'number', 'Minimum donation amount in IDR', true),
('payment', 'maximum_donation', '10000000', 'number', 'Maximum donation amount in IDR', true),
('payment', 'platform_fee_percentage', '5', 'number', 'Platform fee percentage', false),
('payment', 'minimum_payout', '50000', 'number', 'Minimum payout amount', true),

('social', 'max_post_length', '2000', 'number', 'Maximum characters in a post', true),
('social', 'max_comment_length', '500', 'number', 'Maximum characters in a comment', true),
('social', 'max_hashtags_per_post', '10', 'number', 'Maximum hashtags per post', true),
('social', 'story_duration_hours', '24', 'number', 'Story visibility duration in hours', true),

('security', 'max_login_attempts', '5', 'number', 'Maximum login attempts', false),
('security', 'session_timeout', '86400', 'number', 'Session timeout in seconds (24 hours)', false),
('security', 'require_email_verification', 'true', 'boolean', 'Require email verification for new accounts', false),

('features', 'user_registration', 'true', 'boolean', 'Enable user registration', true),
('features', 'live_streaming', 'true', 'boolean', 'Enable live streaming feature', true),
('features', 'groups', 'true', 'boolean', 'Enable groups feature', true),
('features', 'events', 'true', 'boolean', 'Enable events feature', true),
('features', 'stories', 'true', 'boolean', 'Enable stories feature', true);

-- ================================================================
-- VIEWS FOR COMMON QUERIES
-- ================================================================

-- Enhanced creator stats view
CREATE OR REPLACE VIEW creator_stats AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.avatar,
    u.is_verified,
    u.is_premium,
    up.category_id,
    c.name as category_name,
    u.followers_count,
    u.following_count,
    u.posts_count,
    u.total_earnings,
    u.total_supporters,
    up.donation_goal,
    recent_activity.posts_last_30_days,
    recent_activity.donations_last_30_days,
    recent_activity.earnings_last_30_days,
    last_activity.last_post_date,
    last_activity.last_donation_date,
    u.created_at as joined_date
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN categories c ON up.category_id = c.id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as posts_last_30_days,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' AND type = 'donation' THEN 1 END) as donations_last_30_days,
        SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' AND type = 'donation' AND status = 'completed' THEN amount ELSE 0 END) as earnings_last_30_days
    FROM (
        SELECT user_id, created_at, NULL::text as type, NULL::decimal as amount FROM posts
        UNION ALL
        SELECT recipient_id as user_id, created_at, type, amount FROM transactions WHERE type = 'donation'
    ) combined
    GROUP BY user_id
) recent_activity ON u.id = recent_activity.user_id
LEFT JOIN (
    SELECT 
        user_id,
        MAX(CASE WHEN source = 'posts' THEN created_at END) as last_post_date,
        MAX(CASE WHEN source = 'donations' THEN created_at END) as last_donation_date
    FROM (
        SELECT user_id, created_at, 'posts' as source FROM posts
        UNION ALL
        SELECT recipient_id as user_id, created_at, 'donations' as source FROM transactions WHERE type = 'donation' AND status = 'completed'
    ) combined
    GROUP BY user_id
) last_activity ON u.id = last_activity.user_id
WHERE u.role IN ('creator', 'user') AND u.status = 'active';

-- Popular posts view
CREATE OR REPLACE VIEW popular_posts AS
SELECT 
    p.id,
    p.title,
    p.content,
    p.type,
    p.featured_image,
    p.user_id,
    u.username,
    u.full_name,
    u.avatar,
    u.is_verified,
    p.category_id,
    c.name as category_name,
    p.likes_count,
    p.comments_count,
    p.shares_count,
    p.views_count,
    p.hashtags,
    p.created_at,
    -- Engagement score for ranking
    (p.likes_count * 1.0 + p.comments_count * 2.0 + p.shares_count * 3.0 + 
     p.views_count * 0.1) as engagement_score
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published' 
AND p.visibility = 'public'
AND u.status = 'active'
ORDER BY engagement_score DESC;

-- ================================================================
-- FINAL SETUP COMPLETION
-- ================================================================

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'SOCIALBUZZ ENHANCED DATABASE SCHEMA COMPLETED SUCCESSFULLY';
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'Total Tables Created: %', (
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name NOT IN ('schema_migrations', 'ar_internal_metadata')
    );
    RAISE NOTICE 'Categories Available: %', (SELECT COUNT(*) FROM categories);
    RAISE NOTICE 'System Settings Configured: %', (SELECT COUNT(*) FROM system_settings);
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'Database is ready for SocialBuzz Enhanced Platform!';
    RAISE NOTICE 'Features included: Users, Posts, Comments, Stories, Groups, Events, Live Streaming';
    RAISE NOTICE '================================================================';
END $$;