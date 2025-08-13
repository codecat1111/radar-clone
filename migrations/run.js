const db = require("../src/config/database");
const logger = require("../src/utils/logger");

async function runMigrations() {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    logger.info("Starting database migrations...");

    // Enable UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // 1. DOMAINS Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS domains (
          id SERIAL PRIMARY KEY,
          name VARCHAR(150) NOT NULL UNIQUE,
          description TEXT,
          color VARCHAR(7) NOT NULL,
          icon VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. TAGS Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tags (
          id SERIAL PRIMARY KEY,
          name VARCHAR(50) NOT NULL UNIQUE,
          color VARCHAR(7) NOT NULL,
          description TEXT,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. TECHNOLOGIES Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS technologies (
          id SERIAL PRIMARY KEY,
          uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
          name VARCHAR(250) NOT NULL,
          description TEXT NOT NULL,
          domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
          tag_id INTEGER REFERENCES tags(id) ON DELETE SET NULL,
          
          angle DECIMAL(6,2) NOT NULL CHECK (angle >= 0 AND angle < 360),
          radius DECIMAL(4,3) NOT NULL CHECK (radius >= 0 AND radius <= 1),
          
          impact_level VARCHAR(20) NOT NULL CHECK (impact_level IN ('High Impact', 'Medium Impact', 'Low Impact')),
          effort_level VARCHAR(20) NOT NULL CHECK (effort_level IN ('High Effort', 'Medium Effort', 'Low Effort')),
          time_to_market INTEGER,
          risk_score INTEGER CHECK (risk_score BETWEEN 1 AND 10),
          
          impact_description TEXT,
          effort_description TEXT,
          
          use_case_title VARCHAR(300),
          use_case_description TEXT,
          
          source_url VARCHAR(600),
          documentation_url VARCHAR(600),
          
          is_active BOOLEAN DEFAULT true,
          is_featured BOOLEAN DEFAULT false,
          version INTEGER DEFAULT 1,
          created_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. TECHNOLOGY_BENEFITS Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS technology_benefits (
          id SERIAL PRIMARY KEY,
          technology_id INTEGER REFERENCES technologies(id) ON DELETE CASCADE,
          benefit TEXT NOT NULL,
          category VARCHAR(50),
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. TECHNOLOGY_RISKS Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS technology_risks (
          id SERIAL PRIMARY KEY,
          technology_id INTEGER REFERENCES technologies(id) ON DELETE CASCADE,
          risk TEXT NOT NULL,
          severity VARCHAR(20) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
          category VARCHAR(50),
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. TECHNOLOGY_WORKFLOWS Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS technology_workflows (
          id SERIAL PRIMARY KEY,
          technology_id INTEGER REFERENCES technologies(id) ON DELETE CASCADE,
          workflow_name VARCHAR(200) NOT NULL,
          workflow_description TEXT NOT NULL,
          steps JSONB,
          estimated_duration VARCHAR(50),
          complexity_level VARCHAR(20) CHECK (complexity_level IN ('Simple', 'Moderate', 'Complex')),
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. TECHNOLOGY_METRICS Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS technology_metrics (
          id SERIAL PRIMARY KEY,
          technology_id INTEGER REFERENCES technologies(id) ON DELETE CASCADE,
          metric_name VARCHAR(100) NOT NULL,
          metric_value VARCHAR(100) NOT NULL,
          metric_unit VARCHAR(50),
          metric_type VARCHAR(50),
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Indexes
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_technologies_domain ON technologies(domain_id)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_technologies_tag ON technologies(tag_id)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_technologies_impact ON technologies(impact_level)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_technologies_effort ON technologies(effort_level)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_technologies_active ON technologies(is_active)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_technologies_angle_radius ON technologies(angle, radius)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_technology_benefits_tech ON technology_benefits(technology_id)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_technology_risks_tech ON technology_risks(technology_id)"
    );

    // Full-text search index
    await client.query(
      `CREATE INDEX IF NOT EXISTS idx_technologies_search ON technologies USING GIN(to_tsvector('english', name || ' ' || description))`
    );

    // Update timestamp function
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    // Update timestamp triggers
    await client.query(
      "DROP TRIGGER IF EXISTS update_technologies_updated_at ON technologies"
    );
    await client.query(
      "CREATE TRIGGER update_technologies_updated_at BEFORE UPDATE ON technologies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
    );

    await client.query(
      "DROP TRIGGER IF EXISTS update_domains_updated_at ON domains"
    );
    await client.query(
      "CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
    );

    await client.query("COMMIT");
    logger.info("Database migrations completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info("Migration process completed");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Migration process failed:", error);
      process.exit(1);
    });
}

module.exports = runMigrations;
