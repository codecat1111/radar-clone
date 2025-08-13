const db = require("../src/config/database");
const logger = require("../src/utils/logger");

async function runSeeders() {
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    logger.info("Starting database seeding...");

    // Clear existing data (in correct order due to foreign keys)
    await client.query("DELETE FROM technology_workflows");
    await client.query("DELETE FROM technology_metrics");
    await client.query("DELETE FROM technology_risks");
    await client.query("DELETE FROM technology_benefits");
    await client.query("DELETE FROM technologies");
    await client.query("DELETE FROM tags");
    await client.query("DELETE FROM domains");

    logger.info("Cleared existing data");

    // Reset sequences
    await client.query("ALTER SEQUENCE domains_id_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE tags_id_seq RESTART WITH 1");
    await client.query("ALTER SEQUENCE technologies_id_seq RESTART WITH 1");

    // Insert domains
    const domainsData = [
      [
        "Intelligent Machines Technology",
        "AI, ML, and autonomous systems",
        "#3B82F6",
        "cpu",
      ],
      [
        "Networking & Communication",
        "Network infrastructure and communication protocols",
        "#10B981",
        "wifi",
      ],
      [
        "Security & Privacy",
        "Cybersecurity and privacy protection technologies",
        "#EF4444",
        "shield-check",
      ],
      [
        "Data & Analytics",
        "Data processing, storage, and analytics platforms",
        "#8B5CF6",
        "chart-bar",
      ],
      [
        "Cloud & Infrastructure",
        "Cloud computing and infrastructure technologies",
        "#F59E0B",
        "cloud",
      ],
      [
        "User Experience",
        "User interface and experience technologies",
        "#EC4899",
        "device-mobile",
      ],
      [
        "DevOps & Development",
        "Development tools and DevOps practices",
        "#06B6D4",
        "code-bracket",
      ],
      [
        "Business Applications",
        "Enterprise and business application platforms",
        "#84CC16",
        "building-office",
      ],
    ];

    for (const [name, description, color, icon] of domainsData) {
      await client.query(
        "INSERT INTO domains (name, description, color, icon) VALUES ($1, $2, $3, $4)",
        [name, description, color, icon]
      );
    }
    logger.info("Inserted domains");

    // Insert tags
    const tagsData = [
      [
        "Leading",
        "#90EE90",
        "Technologies that hold limited risk and have well-defined, replicable outcomes",
        1,
      ],
      [
        "Nascent",
        "#FFB6C1",
        "Early-stage technologies that hold relatively high risk and limited real-world validation",
        2,
      ],
      [
        "Watchlist",
        "#87CEEB",
        "Technologies worth monitoring for future potential",
        3,
      ],
    ];

    for (const [name, color, description, orderIndex] of tagsData) {
      await client.query(
        "INSERT INTO tags (name, color, description, order_index) VALUES ($1, $2, $3, $4)",
        [name, color, description, orderIndex]
      );
    }
    logger.info("Inserted tags");

    // Insert technologies (First 10 for now)
    const technologiesData = [
      // Leading Technologies
      [
        "Autonomous Agents (AI Agents)",
        "AI-powered actors capable of independently making decisions and taking actions to achieve specific goals. These agents adapt their behavior, collaborate with other agents, and operate without continuous human intervention.",
        1,
        1,
        45.5,
        0.7,
        "High Impact",
        "Medium Effort",
        18,
        6,
        "Can significantly reduce operational overhead and improve response times in complex workflows.",
        "DARPA Active Authentication Program",
        "The U.S. Department of Defense DARPA Active Authentication program piloted behavioral biometrics for continuous user verification on government systems.",
        "https://www.darpa.mil/program/active-authentication",
      ],
      [
        "Machine Learning Operations (MLOps)",
        "Practices and tools for deploying, monitoring, and maintaining machine learning models in production environments at scale.",
        1,
        1,
        52.3,
        0.6,
        "High Impact",
        "Medium Effort",
        12,
        4,
        "Streamlines ML model deployment and reduces time-to-production for AI initiatives.",
        "Netflix Recommendation Engine",
        "Netflix uses MLOps to continuously deploy and monitor recommendation algorithms that serve over 200 million subscribers globally.",
        "https://netflixtechblog.com/",
      ],
      [
        "Computer Vision APIs",
        "Pre-trained computer vision services accessible through APIs for image recognition, object detection, and visual analysis.",
        1,
        1,
        38.7,
        0.65,
        "High Impact",
        "Low Effort",
        6,
        3,
        "Enables rapid integration of advanced visual capabilities without extensive AI expertise.",
        "TSA Facial Recognition",
        "Transportation Security Administration uses computer vision APIs for passenger identity verification at airport checkpoints.",
        "https://www.tsa.gov/technology",
      ],
      [
        "Natural Language Processing (NLP)",
        "Technologies for understanding, interpreting, and generating human language in text and speech form.",
        1,
        1,
        61.2,
        0.72,
        "High Impact",
        "Medium Effort",
        15,
        5,
        "Transforms how organizations process and analyze textual data and customer communications.",
        "IRS Document Processing",
        "Internal Revenue Service employs NLP to automatically categorize and process millions of tax documents annually.",
        "https://www.irs.gov/about-irs/strategic-plan",
      ],
      [
        "Zero Trust Architecture",
        "Security framework that requires verification for every user and device attempting to access network resources, regardless of location.",
        3,
        1,
        185.3,
        0.73,
        "High Impact",
        "High Effort",
        20,
        8,
        "Significantly improves security posture by eliminating implicit trust and continuously validating access requests.",
        "CISA Zero Trust Initiative",
        "Cybersecurity and Infrastructure Security Agency mandates zero trust implementation across federal agencies by 2024.",
        "https://www.cisa.gov/zero-trust-maturity-model",
      ],
      // Nascent Technologies
      [
        "Quantum Machine Learning",
        "Application of quantum computing principles to machine learning algorithms, potentially offering exponential speedups for certain computational tasks.",
        1,
        2,
        15.3,
        0.85,
        "High Impact",
        "High Effort",
        36,
        9,
        "Could revolutionize complex optimization problems and pattern recognition in massive datasets.",
        "NSA Quantum Research",
        "National Security Agency researches quantum machine learning for cryptanalysis and secure communications.",
        "https://www.nsa.gov/",
      ],
      [
        "Behavioral Biometrics",
        "Security technology that identifies individuals based on unique behavioral patterns like typing rhythm, mouse movements, and gait analysis.",
        3,
        2,
        165.2,
        0.84,
        "Medium Impact",
        "High Effort",
        30,
        8,
        "Provides continuous authentication without user friction but raises significant privacy concerns.",
        "DARPA Active Authentication",
        "Defense Advanced Research Projects Agency pilots behavioral biometrics for continuous user verification systems.",
        "https://www.darpa.mil/",
      ],
      // Watchlist Technologies
      [
        "Swarm Intelligence",
        "Collective behavior systems inspired by biological swarms, enabling coordinated autonomous agent behavior.",
        1,
        3,
        68.2,
        0.95,
        "Medium Impact",
        "High Effort",
        45,
        9,
        "Could enable large-scale coordinated autonomous systems but requires significant research breakthroughs.",
        "DARPA Swarm Robotics",
        "Defense Advanced Research Projects Agency researches swarm intelligence for autonomous military applications.",
        "https://www.darpa.mil/",
      ],
      [
        "Blockchain Governance",
        "Using blockchain technology for transparent and immutable record-keeping in government processes.",
        8,
        3,
        35.4,
        0.87,
        "Medium Impact",
        "High Effort",
        30,
        7,
        "Promising for transparency but faces scalability and regulatory challenges.",
        "GSA Blockchain Pilot",
        "General Services Administration pilots blockchain for supply chain transparency and contract management.",
        "https://www.gsa.gov/",
      ],
      [
        "Digital Twins",
        "Virtual replicas of physical systems that use real-time data to simulate, predict, and optimize performance.",
        8,
        3,
        28.1,
        0.82,
        "Medium Impact",
        "High Effort",
        26,
        6,
        "Valuable for infrastructure management but requires extensive sensor networks and data integration.",
        "GSA Building Management",
        "General Services Administration develops digital twins for federal building energy optimization.",
        "https://www.gsa.gov/",
      ],
      [
        "Microservices Architecture",
        "Containerized application architecture that breaks down monolithic applications into smaller, independent deployable services",
        5,
        1,
        120.5,
        0.55,
        "Medium Impact",
        "Medium Effort",
        8,
        3,
        "Improves application scalability and enables faster deployment cycles",
        "GSA Cloud Modernization",
        "General Services Administration modernizes legacy applications using microservices for better scalability.",
        "https://www.gsa.gov/",
      ],
      [
        "API Management Platforms",
        "Comprehensive platforms for designing, deploying, and managing APIs across enterprise systems.",
        7, // DevOps & Development
        1, // Leading
        95.8,
        0.48,
        "Medium Impact",
        "Low Effort",
        6,
        2,
        "Streamlines API lifecycle management and improves developer productivity.",
        "Federal API Standards",
        "OMB mandates API-first design for federal digital services to improve interoperability.",
        "https://www.whitehouse.gov/omb/",
      ],
      [
        "Progressive Web Apps",
        "Web applications that provide native app-like experiences using modern web technologies.",
        6, // User Experience
        1, // Leading
        75.3,
        0.42,
        "Medium Impact",
        "Low Effort",
        4,
        2,
        "Delivers consistent user experience across devices without app store dependencies.",
        "VA Mobile Experience",
        "Department of Veterans Affairs develops progressive web apps for veteran services access.",
        "https://www.va.gov/",
      ],
      [
        "Real-time Analytics",
        "Systems that process and analyze data streams in real-time to provide immediate insights.",
        4, // Data & Analytics
        1, // Leading
        145.7,
        0.68,
        "High Impact",
        "Medium Effort",
        10,
        4,
        "Enables immediate response to changing conditions and rapid decision-making.",
        "CDC Disease Surveillance",
        "Centers for Disease Control uses real-time analytics for disease outbreak monitoring.",
        "https://www.cdc.gov/",
      ],
      [
        "5G Network Infrastructure",
        "Next-generation wireless technology providing ultra-fast, low-latency connectivity.",
        2, // Networking & Communication
        2, // Nascent
        200.4,
        0.89,
        "High Impact",
        "High Effort",
        24,
        7,
        "Could enable new categories of mobile government services with enhanced capabilities.",
        "FirstNet 5G Expansion",
        "First Responder Network Authority explores 5G integration for emergency communications.",
        "https://www.firstnet.gov/",
      ],
      [
        "Edge Computing",
        "Distributed computing that brings computation and data storage closer to data sources.",
        5, // Cloud & Infrastructure
        2, // Nascent
        155.9,
        0.78,
        "High Impact",
        "High Effort",
        18,
        6,
        "Reduces latency and bandwidth usage for real-time government applications.",
        "DOD Tactical Edge",
        "Department of Defense develops edge computing for tactical military operations.",
        "https://www.defense.gov/",
      ],
    ];

    const technologyIds = [];
    for (const techData of technologiesData) {
      const result = await client.query(
        `
        INSERT INTO technologies (
          name, description, domain_id, tag_id, angle, radius,
          impact_level, effort_level, time_to_market, risk_score,
          impact_description, use_case_title, use_case_description, source_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      `,
        techData
      );

      technologyIds.push(result.rows[0].id);
    }
    logger.info("Inserted technologies");

    // Insert benefits for all 10 technologies
    const benefitsData = [
      // Benefits for Autonomous Agents (ID: 1)
      [
        1,
        "Can support citizen navigation through government workflows, which can enhance service delivery and improve user satisfaction",
        "efficiency",
        1,
      ],
      [
        1,
        "Can execute tasks independently, which can minimize delays and streamline public-sector processes",
        "efficiency",
        2,
      ],
      [
        1,
        "Operate 24/7 without breaks, providing continuous service availability to citizens",
        "availability",
        3,
      ],
      [
        1,
        "Learn from interactions to improve performance over time",
        "adaptability",
        4,
      ],

      // Benefits for MLOps (ID: 2)
      [
        2,
        "Streamlines deployment of machine learning models to production environments",
        "efficiency",
        1,
      ],
      [
        2,
        "Enables continuous monitoring and improvement of ML model performance",
        "monitoring",
        2,
      ],
      [
        2,
        "Reduces time-to-market for AI-powered government services",
        "speed",
        3,
      ],
      [
        2,
        "Provides version control and rollback capabilities for ML models",
        "reliability",
        4,
      ],

      // Benefits for Computer Vision APIs (ID: 3)
      [
        3,
        "Enables rapid integration of visual recognition capabilities without extensive AI expertise",
        "accessibility",
        1,
      ],
      [
        3,
        "Provides pre-trained models that reduce development time and costs",
        "cost-efficiency",
        2,
      ],
      [
        3,
        "Offers scalable image processing for large-scale government operations",
        "scalability",
        3,
      ],
      [
        3,
        "Improves accuracy of visual data analysis through advanced algorithms",
        "accuracy",
        4,
      ],

      // Benefits for NLP (ID: 4)
      [
        4,
        "Automates document processing and analysis at unprecedented scale",
        "automation",
        1,
      ],
      [
        4,
        "Enables real-time language translation for multilingual government services",
        "accessibility",
        2,
      ],
      [
        4,
        "Improves citizen service through intelligent chatbots and virtual assistants",
        "service-quality",
        3,
      ],
      [
        4,
        "Extracts insights from unstructured text data for better decision-making",
        "intelligence",
        4,
      ],

      // Benefits for Zero Trust Architecture (ID: 5)
      [
        5,
        "Significantly reduces security breaches by eliminating implicit trust assumptions",
        "security",
        1,
      ],
      [
        5,
        "Provides granular access controls based on user identity and device status",
        "access-control",
        2,
      ],
      [
        5,
        "Enables secure remote work capabilities for government employees",
        "flexibility",
        3,
      ],
      [
        5,
        "Improves compliance with federal security mandates and standards",
        "compliance",
        4,
      ],

      // Benefits for Quantum Machine Learning (ID: 6)
      [
        6,
        "Potential for exponential speedup in complex optimization problems",
        "performance",
        1,
      ],
      [
        6,
        "Could revolutionize cryptographic security and quantum-safe communications",
        "security",
        2,
      ],
      [
        6,
        "Enables simulation of quantum systems for scientific research",
        "research",
        3,
      ],
      [
        6,
        "May solve previously intractable computational problems",
        "capability",
        4,
      ],

      // Benefits for Behavioral Biometrics (ID: 7)
      [
        7,
        "Provides continuous authentication without user friction",
        "usability",
        1,
      ],
      [
        7,
        "Detects unusual behavior patterns that may indicate security threats",
        "threat-detection",
        2,
      ],
      [
        7,
        "Reduces reliance on traditional passwords and tokens",
        "security",
        3,
      ],
      [
        7,
        "Enables passive monitoring for enhanced security posture",
        "monitoring",
        4,
      ],

      // Benefits for Swarm Intelligence (ID: 8)
      [
        8,
        "Enables coordinated behavior among multiple autonomous systems",
        "coordination",
        1,
      ],
      [
        8,
        "Provides resilience through distributed decision-making",
        "resilience",
        2,
      ],
      [
        8,
        "Scales efficiently with the addition of more agents",
        "scalability",
        3,
      ],
      [
        8,
        "Adapts to changing environments through collective learning",
        "adaptability",
        4,
      ],

      // Benefits for Blockchain Governance (ID: 9)
      [
        9,
        "Provides immutable records for transparent government processes",
        "transparency",
        1,
      ],
      [
        9,
        "Reduces corruption through decentralized verification mechanisms",
        "integrity",
        2,
      ],
      [
        9,
        "Enables automated contract execution through smart contracts",
        "automation",
        3,
      ],
      [
        9,
        "Improves citizen trust through verifiable government actions",
        "trust",
        4,
      ],

      // Benefits for Digital Twins (ID: 10)
      [
        10,
        "Enables predictive maintenance of government infrastructure",
        "maintenance",
        1,
      ],
      [
        10,
        "Optimizes resource usage through real-time simulation",
        "optimization",
        2,
      ],
      [
        10,
        "Reduces costs by preventing failures before they occur",
        "cost-savings",
        3,
      ],
      [
        10,
        "Improves decision-making through data-driven insights",
        "intelligence",
        4,
      ],
    ];

    for (const [techId, benefit, category, orderIndex] of benefitsData) {
      await client.query(
        "INSERT INTO technology_benefits (technology_id, benefit, category, order_index) VALUES ($1, $2, $3, $4)",
        [techId, benefit, category, orderIndex]
      );
    }
    logger.info("Inserted benefits for all technologies");

    // Insert risks for all 10 technologies
    const risksData = [
      // Risks for Autonomous Agents (ID: 1)
      [
        1,
        "Can be tricked by malicious user inputs, which may lead to unintended disclosure of sensitive government data",
        "High",
        "security",
        1,
      ],
      [
        1,
        "May make decisions based on biased training data, leading to unfair treatment of citizens",
        "Medium",
        "ethical",
        2,
      ],
      [
        1,
        "Could malfunction and provide incorrect information or services to users",
        "Medium",
        "technical",
        3,
      ],
      [
        1,
        "Requires significant computational resources and infrastructure investment",
        "Low",
        "cost",
        4,
      ],

      // Risks for MLOps (ID: 2)
      [
        2,
        "Model drift may cause performance degradation over time without proper monitoring",
        "Medium",
        "technical",
        1,
      ],
      [
        2,
        "Complex pipeline dependencies can create single points of failure",
        "Medium",
        "reliability",
        2,
      ],
      [
        2,
        "Requires specialized expertise that may be difficult to hire and retain",
        "Low",
        "resource",
        3,
      ],
      [
        2,
        "Data privacy concerns when models are trained on sensitive government data",
        "High",
        "privacy",
        4,
      ],

      // Risks for Computer Vision APIs (ID: 3)
      [
        3,
        "Dependency on third-party services may create vendor lock-in situations",
        "Medium",
        "vendor",
        1,
      ],
      [
        3,
        "Potential for bias in pre-trained models affecting fairness in government applications",
        "High",
        "ethical",
        2,
      ],
      [
        3,
        "Limited customization options for specific government use cases",
        "Low",
        "flexibility",
        3,
      ],
      [
        3,
        "Privacy concerns when processing citizen images through external APIs",
        "High",
        "privacy",
        4,
      ],

      // Risks for NLP (ID: 4)
      [
        4,
        "Language models may generate inappropriate or biased responses in citizen interactions",
        "High",
        "ethical",
        1,
      ],
      [
        4,
        "Sensitive information could be inadvertently exposed through text processing",
        "High",
        "privacy",
        2,
      ],
      [
        4,
        "Misinterpretation of context may lead to incorrect automated decisions",
        "Medium",
        "accuracy",
        3,
      ],
      [
        4,
        "Requires large amounts of training data which may not be available for specialized domains",
        "Medium",
        "data",
        4,
      ],

      // Risks for Zero Trust Architecture (ID: 5)
      [
        5,
        "Complex implementation requiring significant architectural changes",
        "High",
        "implementation",
        1,
      ],
      [
        5,
        "May impact user experience with additional authentication steps",
        "Medium",
        "usability",
        2,
      ],
      [
        5,
        "Requires substantial investment in security infrastructure and training",
        "High",
        "cost",
        3,
      ],
      [
        5,
        "Potential for system lockouts if authentication mechanisms fail",
        "Medium",
        "availability",
        4,
      ],

      // Risks for Quantum Machine Learning (ID: 6)
      [
        6,
        "Technology is still experimental with limited practical applications",
        "High",
        "maturity",
        1,
      ],
      [
        6,
        "Requires specialized quantum hardware that is expensive and difficult to maintain",
        "High",
        "infrastructure",
        2,
      ],
      [
        6,
        "Very limited pool of experts with quantum computing knowledge",
        "High",
        "expertise",
        3,
      ],
      [
        6,
        "Current quantum computers are error-prone and require significant error correction",
        "High",
        "reliability",
        4,
      ],

      // Risks for Behavioral Biometrics (ID: 7)
      [
        7,
        "Raises significant privacy concerns about continuous monitoring of user behavior",
        "High",
        "privacy",
        1,
      ],
      [
        7,
        "May produce false positives, blocking legitimate users from accessing systems",
        "Medium",
        "accuracy",
        2,
      ],
      [
        7,
        "Behavioral patterns may change due to medical conditions or stress",
        "Medium",
        "reliability",
        3,
      ],
      [
        7,
        "Potential for discrimination based on disabilities that affect behavior patterns",
        "High",
        "ethical",
        4,
      ],

      // Risks for Swarm Intelligence (ID: 8)
      [
        8,
        "Emergent behaviors may be unpredictable and difficult to control",
        "High",
        "control",
        1,
      ],
      [
        8,
        "Requires significant coordination infrastructure and communication protocols",
        "Medium",
        "complexity",
        2,
      ],
      [
        8,
        "Single point of failure in coordination mechanisms could affect entire swarm",
        "Medium",
        "reliability",
        3,
      ],
      [
        8,
        "Limited real-world validation of swarm intelligence applications",
        "High",
        "maturity",
        4,
      ],

      // Risks for Blockchain Governance (ID: 9)
      [
        9,
        "Scalability limitations may prevent adoption for large-scale government operations",
        "High",
        "scalability",
        1,
      ],
      [
        9,
        "High energy consumption for blockchain operations raises environmental concerns",
        "Medium",
        "sustainability",
        2,
      ],
      [
        9,
        "Regulatory uncertainty around blockchain technology in government applications",
        "High",
        "regulatory",
        3,
      ],
      [
        9,
        "Immutability of records could be problematic if corrections are needed",
        "Medium",
        "flexibility",
        4,
      ],

      // Risks for Digital Twins (ID: 10)
      [
        10,
        "Requires extensive sensor networks and data integration, increasing complexity",
        "High",
        "complexity",
        1,
      ],
      [
        10,
        "Real-time data requirements may strain existing IT infrastructure",
        "Medium",
        "infrastructure",
        2,
      ],
      [
        10,
        "Cybersecurity risks increase with more connected sensors and devices",
        "High",
        "security",
        3,
      ],
      [
        10,
        "Accuracy of digital twin depends heavily on quality and completeness of input data",
        "Medium",
        "data-quality",
        4,
      ],
    ];

    for (const [techId, risk, severity, category, orderIndex] of risksData) {
      await client.query(
        "INSERT INTO technology_risks (technology_id, risk, severity, category, order_index) VALUES ($1, $2, $3, $4, $5)",
        [techId, risk, severity, category, orderIndex]
      );
    }
    logger.info("Inserted risks for all technologies");

    await client.query("COMMIT");
    logger.info("Database seeding completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Seeding failed:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Run seeder if called directly
if (require.main === module) {
  runSeeders()
    .then(() => {
      logger.info("Seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Seeding process failed:", error);
      process.exit(1);
    });
}

module.exports = runSeeders;
