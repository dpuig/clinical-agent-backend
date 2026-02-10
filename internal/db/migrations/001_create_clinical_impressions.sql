CREATE TABLE IF NOT EXISTS clinical_impressions (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(255),
    status VARCHAR(50),
    description TEXT,
    raw_fhir JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
