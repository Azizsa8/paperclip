-- AMADS PostgreSQL schema for Railway
-- Creates dedicated schema with UUID PKs, FKs, JSONB fields, timestamps, and indexes

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS amads;
SET search_path TO amads, public;

-- Agents: autonomous agents
CREATE TABLE IF NOT EXISTS amads.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  division TEXT NOT NULL,
  status TEXT DEFAULT 'idle',
  model JSONB,
  tools JSONB DEFAULT '[]'::jsonb,
  reports_to UUID REFERENCES amads.agents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Campaigns: marketing campaigns
CREATE TABLE IF NOT EXISTS amads.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  product_name TEXT,
  product_description TEXT,
  product_image TEXT,
  target_audience JSONB,
  goal TEXT,
  budget NUMERIC(14,2),
  status TEXT DEFAULT 'pending',
  created_by UUID REFERENCES amads.agents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks: work items
CREATE TABLE IF NOT EXISTS amads.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES amads.campaigns(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES amads.agents(id) ON DELETE SET NULL,
  task_type TEXT,
  status TEXT DEFAULT 'pending',
  input_data JSONB,
  output_data JSONB,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Deliverables: content outputs
CREATE TABLE IF NOT EXISTS amads.deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES amads.campaigns(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES amads.agents(id) ON DELETE SET NULL,
  content_type TEXT,
  content JSONB,
  platform TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMPTZ
);

-- Analytics: metrics
CREATE TABLE IF NOT EXISTS amads.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES amads.campaigns(id) ON DELETE CASCADE,
  platform TEXT,
  metric_name TEXT,
  metric_value NUMERIC,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Knowledge base
CREATE TABLE IF NOT EXISTS amads.knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT,
  title TEXT,
  content TEXT,
  source TEXT,
  created_by UUID REFERENCES amads.agents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agent logs
CREATE TABLE IF NOT EXISTS amads.agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES amads.agents(id) ON DELETE CASCADE,
  action TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MCP connections
CREATE TABLE IF NOT EXISTS amads.mcp_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  type TEXT,
  endpoint TEXT,
  auth_type TEXT,
  status TEXT DEFAULT 'inactive',
  last_connected TIMESTAMPTZ
);

-- Personas
CREATE TABLE IF NOT EXISTS amads.personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES amads.campaigns(id) ON DELETE CASCADE,
  name TEXT,
  demographics JSONB,
  psychographics JSONB,
  pain_points JSONB,
  desires JSONB
);

-- Campaign schedule
CREATE TABLE IF NOT EXISTS amads.campaigns_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES amads.campaigns(id) ON DELETE CASCADE,
  platform TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  content_id UUID REFERENCES amads.deliverables(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'scheduled'
);

-- Indexes
CREATE INDEX idx_agents_division ON amads.agents (division);
CREATE INDEX idx_agents_status ON amads.agents (status);
CREATE INDEX idx_campaigns_status ON amads.campaigns (status);
CREATE INDEX idx_tasks_campaign ON amads.tasks (campaign_id);
CREATE INDEX idx_tasks_agent ON amads.tasks (agent_id);
CREATE INDEX idx_tasks_status ON amads.tasks (status);
CREATE INDEX idx_deliverables_campaign ON amads.deliverables (campaign_id);
CREATE INDEX idx_analytics_campaign ON amads.analytics (campaign_id);
CREATE INDEX idx_analytics_metric ON amads.analytics (campaign_id, metric_name);
CREATE INDEX idx_logs_agent ON amads.agent_logs (agent_id);
CREATE INDEX idx_personas_campaign ON amads.personas (campaign_id);
CREATE INDEX idx_schedule_campaign ON amads.campaigns_schedule (campaign_id, platform);

-- Auto-update trigger for agents
CREATE OR REPLACE FUNCTION amads.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agents_updated_at
BEFORE UPDATE ON amads.agents
FOR EACH ROW EXECUTE FUNCTION amads.update_timestamp();
