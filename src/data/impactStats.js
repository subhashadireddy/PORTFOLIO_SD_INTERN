export const impactStatsData = {
  verifiedMetrics: [
    { id: 'hindex', label: "h-index (Scopus)", target: 15, suffix: "", padZero: false, note: "Scopus Citation Benchmark" },
    { id: 'papers', label: "Research Papers Published", target: 103, suffix: "", padZero: false, note: "SCI, Scopus & Peer-Reviewed" },
    { id: 'awards', label: "Research Awards", target: 20, suffix: "", padZero: false, note: "National & International Honors" },
    { id: 'design-patents', label: "Design Patent Grant", target: 14, suffix: "", padZero: false, note: "UK & India Registrations" },
    { id: 'patents-pub', label: "Patents Published", target: 11, suffix: "", padZero: false, note: "IP India Official Publications" },
    { id: 'patents-grant', label: "Patents Grant", target: 6, suffix: "", padZero: true, note: "Utility Grants (India, AU, SA)" },
    { id: 'copyright', label: "Copyright", target: 4, suffix: "", padZero: true, note: "Canada & India Authorities" },
    { id: 'books', label: "Books Published", target: 9, suffix: "", padZero: true, note: "Lambert, IIP, Deccan & Jaya Lakshmi" },
    { id: 'proj-grants', label: "Project Grants", target: 2, suffix: "", padZero: true, note: "AICTE & STPI Chunauti Schemes" },
    { id: 'seed-grants', label: "Seed Fund Grants", target: 2, suffix: "", padZero: true, note: "Institutional Seed Awards (VIIT)" },
    { id: 'editorial', label: "Editorial Board / Reviewer", target: 15, suffix: "+", padZero: false, note: "IEEE, Sensors, PLoS ONE" },
    { id: 'certs', label: "Certificate of Appreciation", target: 100, suffix: "+", padZero: false, note: "Scholarly & Academic Recognitions" }
  ],
  citationDatabases: [
    {
      database: "Google Scholar",
      hIndex: "15",
      metrics: "i10-index: 23",
      citations: "1,018",
      scope: "Global Citation Index"
    },
    {
      database: "Scopus",
      hIndex: "15",
      metrics: "Author ID: 57224323534",
      citations: "724",
      scope: "Elsevier International"
    },
    {
      database: "ResearchGate",
      hIndex: "12",
      metrics: "Score: 382.8",
      citations: "686",
      scope: "Scientific Network"
    },
    {
      database: "Publons",
      hIndex: "8",
      metrics: "Clarivate ResearcherID: G-9691-2016",
      citations: "597",
      scope: "Clarivate Web of Science"
    }
  ]
};
