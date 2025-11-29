-- ==========================================
-- JoBika Advanced Analytics Queries
-- ==========================================

-- 1. Funnel Analysis: Job Application Flow
-- ------------------------------------------
SELECT 
    COUNT(DISTINCT CASE WHEN event_name = 'job_viewed' THEN user_id END) as viewed,
    COUNT(DISTINCT CASE WHEN event_name = 'apply_clicked' THEN user_id END) as clicked,
    COUNT(DISTINCT CASE WHEN event_name = 'resume_generated' THEN user_id END) as generated,
    COUNT(DISTINCT CASE WHEN event_name = 'application_submitted' THEN user_id END) as submitted,
    
    -- Conversion rates
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN event_name = 'apply_clicked' THEN user_id END) / 
          NULLIF(COUNT(DISTINCT CASE WHEN event_name = 'job_viewed' THEN user_id END), 0), 2) as view_to_click_rate,
    
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN event_name = 'application_submitted' THEN user_id END) / 
          NULLIF(COUNT(DISTINCT CASE WHEN event_name = 'apply_clicked' THEN user_id END), 0), 2) as click_to_submit_rate

FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days';


-- 2. Funnel Analysis: Signup to First Application
-- -------------------------------------------------
WITH user_journey AS (
    SELECT 
        user_id,
        MIN(CASE WHEN event_name = 'user_signed_up' THEN created_at END) as signup_time,
        MIN(CASE WHEN event_name = 'resume_uploaded' THEN created_at END) as resume_time,
        MIN(CASE WHEN event_name = 'preferences_set' THEN created_at END) as prefs_time,
        MIN(CASE WHEN event_name = 'application_submitted' THEN created_at END) as first_app_time
    FROM analytics_events
    GROUP BY user_id
)
SELECT 
    COUNT(*) as total_signups,
    COUNT(resume_time) as uploaded_resume,
    COUNT(prefs_time) as set_preferences,
    COUNT(first_app_time) as submitted_first_app,
    
    -- Time to first application
    AVG(EXTRACT(EPOCH FROM (first_app_time - signup_time))/3600) as avg_hours_to_first_app,
    
    -- Drop-off analysis
    COUNT(*) - COUNT(resume_time) as dropoff_at_resume,
    COUNT(resume_time) - COUNT(prefs_time) as dropoff_at_preferences,
    COUNT(prefs_time) - COUNT(first_app_time) as dropoff_at_first_app
FROM user_journey
WHERE signup_time >= NOW() - INTERVAL '30 days';


-- 3. Cohort Analysis: Retention
-- -------------------------------
WITH cohorts AS (
    SELECT 
    user_id,
    DATE_TRUNC('week', created_at) as cohort_week
    FROM users
),
activity AS (
    SELECT 
    user_id,
    DATE_TRUNC('week', event_time) as activity_week
    FROM analytics_events
    WHERE event_name IN ('job_viewed', 'application_submitted')
)
SELECT 
    c.cohort_week,
    COUNT(DISTINCT c.user_id) as cohort_size,
    COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week THEN a.user_id END) as week_0,
    COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '1 week' THEN a.user_id END) as week_1,
    COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '2 weeks' THEN a.user_id END) as week_2,
    COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '4 weeks' THEN a.user_id END) as week_4,
    
    -- Retention percentages
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '1 week' THEN a.user_id END) / 
        COUNT(DISTINCT c.user_id), 2) as retention_week_1,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.activity_week = c.cohort_week + INTERVAL '4 weeks' THEN a.user_id END) / 
        COUNT(DISTINCT c.user_id), 2) as retention_week_4
FROM cohorts c
LEFT JOIN activity a ON c.user_id = a.user_id
GROUP BY c.cohort_week
ORDER BY c.cohort_week DESC;


-- 4. Cohort Analysis: Revenue
-- -----------------------------
SELECT 
    DATE_TRUNC('month', u.created_at) as cohort_month,
    COUNT(DISTINCT u.id) as users,
    COUNT(DISTINCT CASE WHEN s.status = 'active' THEN s.user_id END) as paying_users,
    SUM(CASE WHEN s.status = 'active' THEN s.amount ELSE 0 END) as monthly_revenue,
    
    -- LTV calculation
    SUM(s.lifetime_value) / COUNT(DISTINCT u.id) as avg_ltv_per_user
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
GROUP BY cohort_month
ORDER BY cohort_month DESC;


-- 5. Dashboard KPIs
-- -------------------

-- Daily Active Users (DAU)
SELECT DATE(event_time) as date, COUNT(DISTINCT user_id) as dau
FROM analytics_events
WHERE event_time >= NOW() - INTERVAL '30 days'
GROUP BY date
ORDER BY date;

-- Application Success Rate
SELECT 
    COUNT(CASE WHEN status IN ('interview', 'offer') THEN 1 END) * 100.0 / 
    COUNT(*) as success_rate
FROM applications
WHERE applied_date >= NOW() - INTERVAL '30 days';

-- Average Match Score
SELECT AVG(match_score) as avg_match_score
FROM job_matches
WHERE created_at >= NOW() - INTERVAL '7 days';

-- MRR (Monthly Recurring Revenue)
SELECT SUM(amount) as mrr
FROM subscriptions
WHERE status = 'active'
AND billing_period = 'monthly';

-- Churn Rate
WITH monthly_cohorts AS (
    SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_subscribers
    FROM subscriptions
    GROUP BY month
),
churned_users AS (
    SELECT 
        DATE_TRUNC('month', cancelled_at) as month,
        COUNT(*) as churned
    FROM subscriptions
    WHERE cancelled_at IS NOT NULL
    GROUP BY month
)
SELECT 
    c.month,
    c.churned * 100.0 / NULLIF(m.new_subscribers, 0) as churn_rate
FROM churned_users c
JOIN monthly_cohorts m ON c.month = m.month;
