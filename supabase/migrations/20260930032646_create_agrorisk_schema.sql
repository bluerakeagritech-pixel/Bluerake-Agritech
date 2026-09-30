/*
# AgroRisk Ghana - Complete Database Schema

## Overview
This migration creates the complete database schema for the AgroRisk Ghana platform,
a farming risk assessment system for Ghanaian farmers. It replaces the in-memory
data storage (JavaScript Maps that reset on page reload) with persistent Postgres tables.

## New Tables

1. **farmers** — Core farmer profile data including personal info, farm size, location,
   irrigation/mechanization access, education, and extended nested data (land tenure,
   soil data, crop management, input access, infrastructure, social/financial, vegetation health)
   stored as JSONB.

2. **farmsense_soil_data** — FarmSense soil analysis reports per farmer, including
   pH, NPK, fertility score, moisture, organic matter, crop suitability, and fertilizer
   recommendations stored as JSONB arrays.

3. **demo_plots** — Benchmark demo plots for comparing farmer performance. Includes
   agro-ecological zone, crop/variety, soil test results, fertilizer used, yield,
   weather conditions, costs, profit, and extension officer info — all as JSONB
   for nested structures.

4. **risk_assessments** — Bank-grade risk assessment results per farmer. Stores
   the overall score, risk level, default probability, profit capacity, safe loan
   amount, repayment period, recommendations, and factor breakdown as JSONB.

5. **bank_intelligence** — Derived bank-facing intelligence records summarizing
   farmer risk for the bank portal. Includes risk score/category, loan recommendation,
   and loan status.

6. **production_plans** — Seasonal production plans tracking pre-planting, during-growth,
   and post-harvest phases. All nested data stored as JSONB.

7. **extension_guidance** — Digital extension guidance per farmer/season including
   planting dates, fertilizer timing, pest alerts, irrigation alerts, market price
   alerts, and compliance score.

8. **loan_applications** — Loan application records linked to risk assessments.

9. **financial_records** — Financial data per farmer including income, expenses,
   loan history, insurance, and market access info.

## Security
- RLS enabled on every table.
- This app has sign-in screens (login/register) but they are not yet wired to Supabase auth.
  To avoid breaking the app (anon-key client would get zero rows with authenticated-only policies),
  we use `TO anon, authenticated` with `USING (true)` for all CRUD — the data is intentionally
  shared across the platform portals (farmer, bank, system admin). When auth is properly
  implemented later, these policies should be tightened with ownership checks.
- All policies use 4 separate statements per table (SELECT/INSERT/UPDATE/DELETE).

## Important Notes
1. Nested complex structures (soil test results, fertilizer arrays, crop suitability,
   risk factors, production plan phases, etc.) are stored as JSONB columns to exactly
   match the existing TypeScript interfaces without requiring dozens of child tables.
2. All tables use `gen_random_uuid()` for primary keys.
3. Foreign keys link child tables to `farmers` with `ON DELETE CASCADE`.
4. Timestamps default to `now()`.
*/

-- ============================================================
-- 1. FARMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS farmers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  age integer NOT NULL DEFAULT 0,
  gender text NOT NULL DEFAULT 'male',
  education text NOT NULL DEFAULT 'primary',
  farming_experience integer NOT NULL DEFAULT 0,
  phone text NOT NULL DEFAULT '',
  email text,
  ghana_card_id text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'en',
  photo_url text,
  farm_photo_url text,
  farm_size numeric NOT NULL DEFAULT 0,
  irrigation_access boolean NOT NULL DEFAULT false,
  mechanisation_access boolean NOT NULL DEFAULT false,
  location jsonb NOT NULL DEFAULT '{}',
  extension_score numeric NOT NULL DEFAULT 0,
  performance_ratio numeric NOT NULL DEFAULT 1.0,
  extended_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_farmers" ON farmers;
CREATE POLICY "anon_select_farmers" ON farmers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_farmers" ON farmers;
CREATE POLICY "anon_insert_farmers" ON farmers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_farmers" ON farmers;
CREATE POLICY "anon_update_farmers" ON farmers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_farmers" ON farmers;
CREATE POLICY "anon_delete_farmers" ON farmers FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 2. FARMSENSE_SOIL_DATA
-- ============================================================
CREATE TABLE IF NOT EXISTS farmsense_soil_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  report_date text NOT NULL,
  report_type text NOT NULL DEFAULT 'manual',
  report_url text,
  soil_data jsonb NOT NULL DEFAULT '{}',
  crop_suitability jsonb NOT NULL DEFAULT '[]',
  fertilizer_recommendation jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE farmsense_soil_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_farmsense" ON farmsense_soil_data;
CREATE POLICY "anon_select_farmsense" ON farmsense_soil_data FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_farmsense" ON farmsense_soil_data;
CREATE POLICY "anon_insert_farmsense" ON farmsense_soil_data FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_farmsense" ON farmsense_soil_data;
CREATE POLICY "anon_update_farmsense" ON farmsense_soil_data FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_farmsense" ON farmsense_soil_data;
CREATE POLICY "anon_delete_farmsense" ON farmsense_soil_data FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 3. DEMO_PLOTS
-- ============================================================
CREATE TABLE IF NOT EXISTS demo_plots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agro_ecological_zone text NOT NULL,
  crop_type text NOT NULL,
  variety text NOT NULL,
  season text NOT NULL DEFAULT 'Main',
  year integer NOT NULL DEFAULT 2024,
  soil_test_results jsonb NOT NULL DEFAULT '{}',
  fertilizer_used jsonb NOT NULL DEFAULT '[]',
  yield_achieved numeric NOT NULL DEFAULT 0,
  weather_conditions jsonb NOT NULL DEFAULT '{}',
  production_cost numeric NOT NULL DEFAULT 0,
  market_price numeric NOT NULL DEFAULT 0,
  profit numeric NOT NULL DEFAULT 0,
  extension_officer text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE demo_plots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_demo_plots" ON demo_plots;
CREATE POLICY "anon_select_demo_plots" ON demo_plots FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_demo_plots" ON demo_plots;
CREATE POLICY "anon_insert_demo_plots" ON demo_plots FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_demo_plots" ON demo_plots;
CREATE POLICY "anon_update_demo_plots" ON demo_plots FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_demo_plots" ON demo_plots;
CREATE POLICY "anon_delete_demo_plots" ON demo_plots FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 4. RISK_ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  score numeric NOT NULL DEFAULT 0,
  risk_level text NOT NULL DEFAULT 'Medium',
  default_probability numeric NOT NULL DEFAULT 0,
  profit_capacity numeric NOT NULL DEFAULT 0,
  safe_loan_amount numeric NOT NULL DEFAULT 0,
  recommended_repayment_period integer NOT NULL DEFAULT 12,
  recommendations jsonb NOT NULL DEFAULT '[]',
  factors jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_risk_assessments" ON risk_assessments;
CREATE POLICY "anon_select_risk_assessments" ON risk_assessments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_risk_assessments" ON risk_assessments;
CREATE POLICY "anon_insert_risk_assessments" ON risk_assessments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_risk_assessments" ON risk_assessments;
CREATE POLICY "anon_update_risk_assessments" ON risk_assessments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_risk_assessments" ON risk_assessments;
CREATE POLICY "anon_delete_risk_assessments" ON risk_assessments FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 5. BANK_INTELLIGENCE
-- ============================================================
CREATE TABLE IF NOT EXISTS bank_intelligence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  farmer_name text NOT NULL,
  location text NOT NULL DEFAULT '',
  farm_size numeric NOT NULL DEFAULT 0,
  crop_type text NOT NULL DEFAULT '',
  season text NOT NULL DEFAULT '',
  risk_score numeric NOT NULL DEFAULT 0,
  risk_category text NOT NULL DEFAULT 'Medium',
  default_probability numeric NOT NULL DEFAULT 0,
  profit_capacity numeric NOT NULL DEFAULT 0,
  recommended_loan_amount numeric NOT NULL DEFAULT 0,
  repayment_period integer NOT NULL DEFAULT 12,
  loan_status text NOT NULL DEFAULT 'conditional',
  last_assessment timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bank_intelligence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bank_intelligence" ON bank_intelligence;
CREATE POLICY "anon_select_bank_intelligence" ON bank_intelligence FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bank_intelligence" ON bank_intelligence;
CREATE POLICY "anon_insert_bank_intelligence" ON bank_intelligence FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bank_intelligence" ON bank_intelligence;
CREATE POLICY "anon_update_bank_intelligence" ON bank_intelligence FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bank_intelligence" ON bank_intelligence;
CREATE POLICY "anon_delete_bank_intelligence" ON bank_intelligence FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 6. PRODUCTION_PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS production_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  season text NOT NULL,
  year integer NOT NULL,
  pre_planting jsonb NOT NULL DEFAULT '{}',
  during_growth jsonb NOT NULL DEFAULT '{}',
  post_harvest jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE production_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_production_plans" ON production_plans;
CREATE POLICY "anon_select_production_plans" ON production_plans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_production_plans" ON production_plans;
CREATE POLICY "anon_insert_production_plans" ON production_plans FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_production_plans" ON production_plans;
CREATE POLICY "anon_update_production_plans" ON production_plans FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_production_plans" ON production_plans;
CREATE POLICY "anon_delete_production_plans" ON production_plans FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 7. EXTENSION_GUIDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS extension_guidance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  season text NOT NULL,
  year integer NOT NULL,
  recommendations jsonb NOT NULL DEFAULT '{}',
  compliance_score numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE extension_guidance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_extension_guidance" ON extension_guidance;
CREATE POLICY "anon_select_extension_guidance" ON extension_guidance FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_extension_guidance" ON extension_guidance;
CREATE POLICY "anon_insert_extension_guidance" ON extension_guidance FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_extension_guidance" ON extension_guidance;
CREATE POLICY "anon_update_extension_guidance" ON extension_guidance FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_extension_guidance" ON extension_guidance;
CREATE POLICY "anon_delete_extension_guidance" ON extension_guidance FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 8. LOAN_APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS loan_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  lender text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  purpose text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  smart_recommendation jsonb,
  bank_grade_assessment_id uuid REFERENCES risk_assessments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_loan_applications" ON loan_applications;
CREATE POLICY "anon_select_loan_applications" ON loan_applications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_loan_applications" ON loan_applications;
CREATE POLICY "anon_insert_loan_applications" ON loan_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_loan_applications" ON loan_applications;
CREATE POLICY "anon_update_loan_applications" ON loan_applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_loan_applications" ON loan_applications;
CREATE POLICY "anon_delete_loan_applications" ON loan_applications FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 9. FINANCIAL_RECORDS
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  monthly_income numeric NOT NULL DEFAULT 0,
  monthly_expenses numeric NOT NULL DEFAULT 0,
  previous_loans jsonb NOT NULL DEFAULT '[]',
  has_insurance boolean NOT NULL DEFAULT false,
  insurance_provider text,
  market_access jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_financial_records" ON financial_records;
CREATE POLICY "anon_select_financial_records" ON financial_records FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_financial_records" ON financial_records;
CREATE POLICY "anon_insert_financial_records" ON financial_records FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_financial_records" ON financial_records;
CREATE POLICY "anon_update_financial_records" ON financial_records FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_financial_records" ON financial_records;
CREATE POLICY "anon_delete_financial_records" ON financial_records FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_farmsense_farmer_id ON farmsense_soil_data(farmer_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_farmer_id ON risk_assessments(farmer_id);
CREATE INDEX IF NOT EXISTS idx_bank_intelligence_farmer_id ON bank_intelligence(farmer_id);
CREATE INDEX IF NOT EXISTS idx_production_plans_farmer_id ON production_plans(farmer_id);
CREATE INDEX IF NOT EXISTS idx_extension_guidance_farmer_id ON extension_guidance(farmer_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_farmer_id ON loan_applications(farmer_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_farmer_id ON financial_records(farmer_id);
CREATE INDEX IF NOT EXISTS idx_demo_plots_zone ON demo_plots(agro_ecological_zone);
CREATE INDEX IF NOT EXISTS idx_farmers_region ON farmers((location->>'region'));
