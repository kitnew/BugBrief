CREATE SCHEMA IF NOT EXISTS bug_brief;

CREATE TABLE bug_reports (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(255),
    raw_description TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    steps_to_reproduce JSONB,
    expected_result TEXT,
    actual_result TEXT,
    technical_notes TEXT,
    suggested_fix TEXT,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);