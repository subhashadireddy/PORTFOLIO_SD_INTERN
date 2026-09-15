export const publicationsData = {
  categories: [
    { id: "all", label: "All Works" },
    { id: "sci", label: "SCI Journals" },
    { id: "esci", label: "ESCI / Web of Science" },
    { id: "conference", label: "Conferences & Book Chapters" },
    { id: "ugc", label: "UGC CARE" }
  ],
  papers: [
    // SCI Journals
    {
      id: 1,
      category: "sci",
      title: "Numerical Investigation Using Machine Learning Process Combination of Bio PCM and Solar Salt for Thermal Energy Storage Applications",
      authors: "Kottala, Ravi Kumar, Sankaraiah Mogaligunta, Makham Satyanarayana Gupta, Seepana Praveenkumar, Ramakrishna Raghutu, Kiran Kumar Patro, Achanta Sampath Dakshina Murthy, and Dharmaiah Gurram",
      journal: "Symmetry",
      volume: "17, no. 7 (2025): 998",
      year: 2025,
      doi: "10.3390/sym17070998"
    },
    {
      id: 2,
      category: "sci",
      title: "Fine-Tuning Pre-Trained Networks with Attention Mechanisms for Improved Multi-Classification of Breast Cancer Histology Images",
      authors: "Sedimbi, Sri Durga Kameswari, Vijayakumar Veerappan, Jami Venkata Suman, Mamidipaka Hema, and Sampath Dakshina Murthy Achanta",
      journal: "Traitement du Signal",
      volume: "42, no. 1 (2025): 455",
      year: 2025,
      doi: "10.18280/ts.420138"
    },
    {
      id: 3,
      category: "sci",
      title: "Gait-based person fall prediction using deep learning approach",
      authors: "Sampath Dakshina Murthy, Achanta, Thangavel Karthikeyan, and R. Vinoth Kanna",
      journal: "Soft Computing",
      volume: "26, no. 23 (2022): 12933-12941",
      year: 2022,
      doi: "10.1007/s00500-021-06125-1"
    },
    {
      id: 4,
      category: "sci",
      title: "A novel hidden Markov model-based adaptive dynamic time warping (HMDTW) gait analysis for identifying physically challenged persons",
      authors: "S. D. M. Achanta, T. Karthikeyan, and R. Vinoth Kanna",
      journal: "Soft Computing",
      volume: "23, no. 18 (2019): 8359–8366",
      year: 2019,
      doi: "10.1007/s00500-019-04100-8"
    },
    {
      id: 5,
      category: "sci",
      title: "Robust hybrid visual digital data Authentication with human visual characteristics",
      authors: "Satyanarayana Murthy P, Koduganti Venkata Rao, Aravind Kumar M, Addanki Purna Ramesh, A. Sampath Dakshina Murthy",
      journal: "Agricultural Mechanization in Asia, Africa and Latin America",
      volume: "52, Issue 01 (2021)",
      year: 2021,
      doi: ""
    },

    // ESCI / Web of Science
    {
      id: 6,
      category: "esci",
      title: "AI and Sustainable Agriculture Through Cost–Benefit Analysis of Smart Irrigation Systems",
      authors: "Suman, Jami Venkata, Kalisetti Purushotham Prasad, A. Sampath Dakshina Murthy, R. Gurunadha, Mamidipaka Hema, and Omprakash Gurrapu",
      journal: "Research on World Agricultural Economy",
      volume: "(2025): 266-279",
      year: 2025,
      doi: ""
    },
    {
      id: 7,
      category: "esci",
      title: "The Role of Artificial Intelligence in Talent Management and Career Development",
      authors: "Kagi, Shivakumar, R. Balamurugan, A. Sampath Dakshina Murthy, Surrya Prakash DilliBabu, and M. S. Nidhya",
      journal: "AI-Oriented Competency Framework for Talent Management in the Digital Economy, CRC Press",
      volume: "pp. 42-53",
      year: 2024,
      doi: "10.1201/9781003440901-3"
    },
    {
      id: 8,
      category: "esci",
      title: "Enterprise support hierarchical model with secure data protocol",
      authors: "Reddy T, V. S., Parvathi, S., Sarada, C., Mohmmed, K. H., Sampath Dakshina Murthy, A., & Saikumar, K.",
      journal: "3rd International Conference on Smart Generation Computing, Communication and Networking (SMART GENCON)",
      volume: "IEEE",
      year: 2023,
      doi: "10.1109/SMARTGENCON60755.2023.10442282"
    },
    {
      id: 9,
      category: "esci",
      title: "Machine Learning Algorithms for Anomaly Detection in IoT Networks",
      authors: "D. G. Hannah, D. S. D. Murthy, D. G. Kalnoor, M. Vetriselvan, and D. Nidhya",
      journal: "Migration Letters",
      volume: "vol. 20, no. S13, pp. 560–565",
      year: 2023,
      doi: "10.47059/ml.v20iS13.6728"
    },
    {
      id: 11,
      category: "esci",
      title: "Magnetic Resonance Images for Spinal Cord Location Detection Using a Deep-Learning Model",
      authors: "Ahammad, S.H., Sampath Dakshina Murthy, A., Ratna Raju, A., Rajesh, V., Saikumar, K.",
      journal: "Artificial Intelligence for Smart Healthcare. EAI/Springer Innovations in Communication and Computing",
      volume: "Springer, Cham",
      year: 2023,
      doi: "10.1007/978-3-031-23602-0_24"
    },
    {
      id: 12,
      category: "esci",
      title: "A virtual reality research of Gait analysis in the medicine fields",
      authors: "Murthy, A. Sampath Dakshina, B. Omkar Lakshmi Jagan, K. Raghava Rao, and P. Satyanarayana Murty",
      journal: "AIP Conference Proceedings",
      volume: "vol. 2426, no. 1, p. 020040",
      year: 2022,
      doi: "10.1063/5.0111242"
    },
    {
      id: 16,
      category: "esci",
      title: "Wearable sensor based acoustic gait analysis using phase transition-based optimization algorithm on IoT",
      authors: "Achanta, S.D.M., Karthikeyan, T. & Kanna, R.V.",
      journal: "International Journal of Speech Technology",
      volume: "Springer",
      year: 2021,
      doi: "10.1007/s10772-021-09893-1"
    },
    {
      id: 17,
      category: "esci",
      title: "A wireless IOT system towards gait detection technique using FSR sensor and wearable IOT devices",
      authors: "Achanta, S.D.M., T., K. and R., V.K.",
      journal: "International Journal of Intelligent Unmanned Systems",
      volume: "Vol. 8 No. 1, pp. 43-54",
      year: 2020,
      doi: "10.1108/IJIUS-01-2019-0005"
    },

    // Conference & Book Chapters
    {
      id: 20,
      category: "conference",
      title: "Attacks in IoT Healthcare Wearable Sensors",
      authors: "Murthy, A. Sampath Dakshina, M. S. Nidhya, E. Gurumoorthi, and Mohit Tiwari",
      journal: "Revolutionizing Data Science and Analytics for Industry Transformation, IGI Global",
      volume: "pp. 309-324",
      year: 2025,
      doi: "10.4018/979-8-3693-4171-1.ch017"
    },
    {
      id: 21,
      category: "conference",
      title: "AI Implementation for Smart Wearable",
      authors: "Shameem, P. Mohammed, A. Sampath Dakshina Murthy, Mohit Tiwari, and Balajee Maram",
      journal: "Revolutionizing Data Science and Analytics for Industry Transformation, IGI Global",
      volume: "pp. 265-282",
      year: 2025,
      doi: "10.4018/979-8-3693-4171-1.ch015"
    },
    {
      id: 22,
      category: "conference",
      title: "Energy Efficient Node with Concurrent Transmission in WSN",
      authors: "Raghava, N., A. Sampath Dakshina Murthy, G. Mohan, R. Yamini, and M. S. Nidhya",
      journal: "2024 15th International Conference on Computing Communication and Networking Technologies (ICCCNT)",
      volume: "IEEE, pp. 1-9",
      year: 2024,
      doi: "10.1109/ICCCNT61001.2024.10725345"
    },
    {
      id: 28,
      category: "conference",
      title: "Robust Digital Image Watermarking Approach for Secure Medical Data Transmission in Smart Cities",
      authors: "Laxmi Lydia, N. Sharmili, T. Pavani, Sampath Dakshina Murthy",
      journal: "Artificial Intelligence Applications for Smart Societies, Studies in Distributed Intelligence",
      volume: "Springer, pp. 227-241",
      year: 2021,
      doi: "10.1007/978-3-030-63068-3_15"
    },
    {
      id: 30,
      category: "conference",
      title: "Gait Diagnosis Using Fuzzy Logic With Wearable Tech For Prolonged Disorders Of Diabetic Cardiomyopathy",
      authors: "Neha Sharma, A. Sampath Dakshina Murthy, T. Karthikeyan, B. Omkar Lakshmi Jagan et al.",
      journal: "Materials Today: Proceedings",
      volume: "Elsevier",
      year: 2020,
      doi: "10.1016/j.matpr.2020.10.623"
    },
    {
      id: 32,
      category: "conference",
      title: "Novel deep neural network for individual re recognizing physically disabled individuals",
      authors: "Sampath Dakshina Murthy, T. Karthikeyan, B. Omkar Lakshmi Jagan et al.",
      journal: "Materials Today: Proceedings",
      volume: "33, pp. 4323-4328",
      year: 2020,
      doi: "10.1016/j.matpr.2020.07.447"
    },

    // UGC CARE
    {
      id: 58,
      category: "ugc",
      title: "Impact of Backpack Disorders on Schools and College Students",
      authors: "A. Sampath Dakshina Murthy, L Sai Poojitha, L Sravya, Mamatha Kumari, M Vamsi Krishna",
      journal: "Industrial Engineering Journal",
      volume: "Volume : 52, Issue 11, November : 2023 UGC CARE Group-1, pp. 273-281",
      year: 2023,
      doi: ""
    },
    {
      id: 61,
      category: "ugc",
      title: "Machine Learning-Based Gait Analysis For Early Detection Of Sciatica In Aging Women",
      authors: "A. Sampath Dakshina Murthy, J. Sudhakar, Mamidipaka Hema",
      journal: "Industrial Engineering Journal",
      volume: "Volume : 52, Issue 12, December : 2023 UGC CARE Group-1, pp. 28-34",
      year: 2023,
      doi: ""
    },
    {
      id: 63,
      category: "ugc",
      title: "Integrating Wearable Sensors and AI for Gait Analysis-Based Sciatica Early Detection and Prediction",
      authors: "Mamidipaka Hema, A. Sampath Dakshina Murthy, J. Sudhakar",
      journal: "Industrial Engineering Journal",
      volume: "Volume : 52, Issue 12, December : 2023 UGC CARE Group-1, pp. 90-96",
      year: 2023,
      doi: ""
    }
  ]
};
