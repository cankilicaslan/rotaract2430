/* ==========================================================================
   ROTARACT DISTRICT 2430 — İNGİLİZCE ÇEVİRİLER
   Yalnızca en/ sayfalarında, data.js'ten sonra yüklenir.
   Görevli unvanlarını ve görev açıklamalarını İngilizceye çevirir; isim,
   e-posta ve fotoğraflar data.js'ten gelir (tek kaynak).
   Grup sorumlularının unvanı otomatik çevrilir ("3. ve 8. Grup" → "Groups 3 & 8").
   ========================================================================== */
(() => {
  const EN = {
    "Alper Abacıgil": {
      unvanEn: "District Rotaract Representative (DRR)",
      aciklamaEn: "Represents every Rotaract club in the district. Leads the district team, supports the clubs' growth, and manages relations with Rotary District 2430, Rotary International and other districts."
    },
    "Ekin Çoşkun": {
      unvanEn: "District Secretary for Clubs",
      aciklamaEn: "Runs communication between the clubs and the district. Tracks club reports and board and membership details, and routes the support clubs ask for to the right people."
    },
    "Mutluhan Özdemir": {
      unvanEn: "District Secretary for Committees",
      aciklamaEn: "Coordinates the work of the district committees. Follows their plans, calendars and reports for the year and helps the committees work together."
    },
    "Neslihan Doğan": {
      unvanEn: "District Administrative Secretary",
      aciklamaEn: "Handles the district's official correspondence, meeting minutes and archive, and makes sure announcements reach the right people on time."
    },
    "Mithat Şakar": {
      unvanEn: "District Secretary for Meetings and Events",
      aciklamaEn: "Plans and organises district meetings, trainings and conferences: venue, programme, registration and logistics."
    },
    "Emre Kaan Kocaman": {
      unvanEn: "District Treasurer",
      aciklamaEn: "Prepares and manages the district budget. Records club dues, income and expenses, and presents the financial report at the end of the year."
    },
    "Göksu Çetintaş": {
      unvanEn: "Service Projects",
      aciklamaEn: "Plans service projects that benefit the community. Launches district-wide joint projects and supports club projects with ideas, resources and partnerships."
    },
    "Ataberk Atikoğlu": {
      unvanEn: "Membership Development",
      aciklamaEn: "Helps clubs bring in new members and keep the ones they have. Promotes Rotaract and supports the founding of new clubs."
    },
    "Yusuf Ufuk Altınöz": {
      unvanEn: "International Service",
      aciklamaEn: "Builds ties with Rotaract clubs and districts abroad. Guides twin-club partnerships, international joint projects, exchange programmes and participation in international events."
    },
    "Can Kılıçaslan": {
      unvanEn: "Public Relations",
      aciklamaEn: "Gets the district's story out. Runs the website, social media and press relations, and helps clubs with promotion and visual identity."
    },
    "Batuhan Sönmez": {
      unvanEn: "Club Service · Hobby",
      aciklamaEn: "Club Service: strengthens how clubs run, with support on board work, meeting practice and member training. Hobby: organises activities around shared interests that build friendship between members."
    },
    "Uygar Eren Kandemir": {
      unvanEn: "Disaster Response",
      aciklamaEn: "Raises awareness about disaster preparedness. When disaster strikes, coordinates the relief work of the district's clubs and liaises with the relevant organisations."
    },
    "Alper Durucu": {
      unvanEn: "Professional Development",
      aciklamaEn: "Supports members' professional growth. Organises career talks, mentoring and meetings with the business world, and highlights professional ethics through the Four-Way Test."
    },
    "Dilasu Tamgül": {
      unvanEn: "Interact",
      aciklamaEn: "Connects with the Interact clubs (ages 12–18) in the district. Mentors Interactors and supports joint Rotaract–Interact projects and the move from Interact to Rotaract."
    }
  };
  (window.GOREVLILER || []).forEach((g) => Object.assign(g, EN[g.ad] || {}));
})();
