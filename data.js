// 1. KULÜP LOGOLARI (34 Kulüp İçin Özel SVG Arma Motoru)
const CLUB_CRESTS = {
  "Manchester City": { c1: "#6CABDD", c2: "#1C2C5B", acc: "#FFC659", code: "MCI", pat: "circle" },
  "Arsenal": { c1: "#EF0107", c2: "#FFFFFF", acc: "#9C824A", code: "ARS", pat: "shield" },
  "Chelsea": { c1: "#034694", c2: "#FFFFFF", acc: "#DBA111", code: "CHE", pat: "circle" },
  "Liverpool": { c1: "#C8102E", c2: "#00B2A9", acc: "#F6EB61", code: "LIV", pat: "shield" },
  "Manchester United": { c1: "#DA291C", c2: "#FBE122", acc: "#000000", code: "MUN", pat: "shield" },
  "Tottenham": { c1: "#FFFFFF", c2: "#132257", acc: "#132257", code: "TOT", pat: "circle" },
  "Aston Villa": { c1: "#670E36", c2: "#95BFE5", acc: "#FEE505", code: "AVL", pat: "shield" },
  "Bournemouth": { c1: "#DA291C", c2: "#000000", acc: "#D3B257", code: "BOU", pat: "stripes" },
  "Brentford": { c1: "#E30613", c2: "#FFFFFF", acc: "#000000", code: "BRE", pat: "circle" },
  "Brighton": { c1: "#0057B8", c2: "#FFFFFF", acc: "#FFCD00", code: "BHA", pat: "circle" },
  "Coventry City": { c1: "#74B5E5", c2: "#FFFFFF", acc: "#1B365D", code: "COV", pat: "shield" },
  "Crystal Palace": { c1: "#1B458F", c2: "#C4122E", acc: "#FFFFFF", code: "CRY", pat: "stripes" },
  "Everton": { c1: "#003399", c2: "#FFFFFF", acc: "#F5A623", code: "EVE", pat: "shield" },
  "Fulham": { c1: "#FFFFFF", c2: "#000000", acc: "#CC0000", code: "FUL", pat: "shield" },
  "Hull City": { c1: "#F5A12D", c2: "#000000", acc: "#FFFFFF", code: "HUL", pat: "stripes" },
  "Ipswich Town": { c1: "#3A64A3", c2: "#FFFFFF", acc: "#DE2C3B", code: "IPS", pat: "shield" },
  "Leeds United": { c1: "#FFCD00", c2: "#1D428A", acc: "#FFFFFF", code: "LEE", pat: "shield" },
  "Newcastle United": { c1: "#241F20", c2: "#FFFFFF", acc: "#D1A954", code: "NEW", pat: "stripes" },
  "Nottingham Forest": { c1: "#DD0000", c2: "#FFFFFF", acc: "#FFFFFF", code: "NFO", pat: "circle" },
  "Sunderland": { c1: "#EB172B", c2: "#FFFFFF", acc: "#000000", code: "SUN", pat: "stripes" },
  "Real Madrid": { c1: "#FFFFFF", c2: "#FEBE10", acc: "#00529F", code: "RMA", pat: "circle" },
  "Barcelona": { c1: "#004D98", c2: "#A50044", acc: "#EDBB00", code: "FCB", pat: "stripes" },
  "Atletico Madrid": { c1: "#CB3524", c2: "#FFFFFF", acc: "#272E61", code: "ATM", pat: "stripes" },
  "Como": { c1: "#0054A6", c2: "#FFFFFF", acc: "#8ED8F8", code: "COM", pat: "shield" },
  "Inter": { c1: "#010E80", c2: "#000000", acc: "#C5A15A", code: "INT", pat: "circle" },
  "Juventus": { c1: "#000000", c2: "#FFFFFF", acc: "#D4AF37", code: "JUV", pat: "stripes" },
  "Milan": { c1: "#FB090B", c2: "#000000", acc: "#FFFFFF", code: "ACM", pat: "stripes" },
  "Roma": { c1: "#8E1F2F", c2: "#F0BC42", acc: "#FFFFFF", code: "ROM", pat: "shield" },
  "Bayern Munchen": { c1: "#DC052D", c2: "#0066B2", acc: "#FFFFFF", code: "BAY", pat: "circle" },
  "Borussia Dortmund": { c1: "#FDE100", c2: "#000000", acc: "#000000", code: "BVB", pat: "circle" },
  "Bayer Leverkusen": { c1: "#E32221", c2: "#000000", acc: "#F3D03E", code: "B04", pat: "circle" },
  "RB Leipzig": { c1: "#FFFFFF", c2: "#DD0741", acc: "#001F47", code: "RBL", pat: "shield" },
  "PSG": { c1: "#004170", c2: "#DA291C", acc: "#FFFFFF", code: "PSG", pat: "circle" },
  "Monaco": { c1: "#E51B24", c2: "#FFFFFF", acc: "#D4AF37", code: "ASM", pat: "shield" }
};

function clubLogo(club, size = 20) {
  const cr = CLUB_CRESTS[club] || { c1: "#2A9D8F", c2: "#264653", acc: "#E9C46A", code: (club || "FC").slice(0, 3).toUpperCase(), pat: "shield" };
  const textColor = (cr.c1 === "#FFFFFF" || cr.c1 === "#FDE100" || cr.c1 === "#FFCD00") ? "#111827" : "#FFFFFF";
  if (cr.pat === "circle") {
    return `<svg class="club-svg" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="${cr.c1}" stroke="${cr.acc}" stroke-width="2"/>
      <circle cx="16" cy="16" r="10.5" fill="${cr.c2}" opacity="0.28"/>
      <text x="16" y="19.5" text-anchor="middle" fill="${textColor}" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="10">${cr.code}</text>
    </svg>`;
  }
  if (cr.pat === "stripes") {
    return `<svg class="club-svg" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5,4 H27 V17 C27,24 16,29 16,29 C16,29 5,24 5,17 Z" fill="${cr.c1}" stroke="${cr.acc}" stroke-width="2"/>
      <path d="M11,5 V25 M16,5 V27 M21,5 V25" stroke="${cr.c2}" stroke-width="3.2"/>
      <rect x="5" y="11" width="22" height="9" fill="rgba(0,0,0,0.62)"/>
      <text x="16" y="18.2" text-anchor="middle" fill="#FFFFFF" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="9.2">${cr.code}</text>
    </svg>`;
  }
  return `<svg class="club-svg" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M5,4 H27 V17 C27,24 16,29 16,29 C16,29 5,24 5,17 Z" fill="${cr.c1}" stroke="${cr.acc}" stroke-width="2"/>
    <path d="M16,5 H26 V17 C26,22.5 16,27.5 16,27.5 Z" fill="${cr.c2}" opacity="0.32"/>
    <text x="16" y="19.2" text-anchor="middle" fill="${textColor}" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="9.5">${cr.code}</text>
  </svg>`;
}

// 2. 5 BÜYÜK LİG VERİ HAVUZU VE POZİSYON SİSTEMİ (2026-27)
const LEAGUES_META = [
  { id: "Premier Lig", name: "Premier Lig", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", country: "İngiltere" },
  { id: "La Liga", name: "La Liga", flag: "🇪🇸", country: "İspanya" },
  { id: "Serie A", name: "Serie A", flag: "🇮🇹", country: "İtalya" },
  { id: "Bundesliga", name: "Bundesliga", flag: "🇩🇪", country: "Almanya" },
  { id: "Ligue 1", name: "Ligue 1", flag: "🇫🇷", country: "Fransa" }
];

const DATA = {
  "Manchester City": [["Gianluigi Donnarumma",89],["Geronimo Rulli",78],["Marc Guehi",85],["Ruben Dias",84],["Abdukodir Khusanov",87],["Josko Gvardiol",87],["Nico O'Reilly",81],["Rayan Ait Nouri",80],["Matheus Nunes",82],["Rico Lewis",80],["Elliot Anderson",86],["Ayyoub Bouaddi",81],["Enzo Fernandez",87],["Mateo Kovacic",82],["Rayan Cherki",86],["Phil Foden",87],["Jeremy Doku",87],["Iliman Ndiaye",83],["Antonio Semenyo",83],["Ryan McAidoo",77],["Erling Haaland",91]],
  "Arsenal": [["David Raya",88],["Kepa",81],["Illan Meslier",81],["William Saliba",87],["Gabriel",88],["Piero Hincapie",85],["Ezri Konsa",84],["Christian Mosquera",80],["Riccardo Calafiori",86],["Jurrien Timber",83],["Ben White",82],["Martin Zubimendi",85],["Declan Rice",90],["Bruno Guimaraes",85],["Mikel Merino",87],["Martin Odegaard",89],["Eberechi Eze",84],["Christos Tzolis",84],["Bukayo Saka",88],["Max Dowman",78],["Noni Madueke",84],["Kai Havertz",83],["Viktor Gyokeres",86]],
  "Chelsea": [["Mike Penders",79],["Emiliano Martinez",88],["Maxence Lacroix",85],["Levi Colwill",83],["Wesley Fofana",82],["Josh Acheampong",79],["Aaron Anselmino",77],["Jorrel Hato",83],["Pep Chavarria",80],["Reece James",84],["Marco Palestra",80],["Malo Gusto",83],["Moises Caicedo",88],["Romeo Lavia",83],["Valentin Barco",83],["Jordan Henderson",81],["Cole Palmer",87],["Morgan Rogers",88],["Jamie Gittens",82],["Estevao",82],["Pedro Neto",81],["Geovany Quenda",84],["Joao Pedro",89],["Emmanuel Emegha",80],["Danny Welbeck",79]],
  "Liverpool": [["Giorgi Mamardashvili",85],["Alisson",85],["Jeremy Jacquet",84],["Giovanni Leoni",82],["Ronald Araujo",82],["Virgil Van Dijk",85],["Joe Gomez",79],["Milos Kerkez",79],["Kostas Tsimikas",78],["Jeremie Frimpong",84],["Conor Bradley",80],["Ryan Gravenberch",86],["Wataru Endo",76],["Alexis MacAllister",87],["Trey Nyoni",83],["Dominik Szoboszlai",88],["Florian Wirtz",89],["Bradley Barcola",87],["Cody Gakpo",84],["Rio Ngumoha",82],["Victor Munoz",81],["Alexander Isak",88],["Hugo Ekitike",86]],
  "Manchester United": [["Senne Lammens",83],["Lisandro Martinez",82],["Leny Yoro",82],["Ayden Heaven",79],["Matthias de Ligt",83],["Harry Maguire",81],["Luke Shaw",81],["Diego Dalot",80],["Noussair Mazraoui",84],["Carlos Baleba",81],["Andrey Santos",80],["Manuel Ugarte",82],["Kobbie Mainoo",84],["Youri Tielemans",84],["Bruno Fernandes",89],["Mason Mount",81],["Marcus Rashford",80],["Patrick Dorgu",81],["Bryan Mbeumo",83],["Amad Diallo",82],["Matheus Cunha",85],["Benjamin Sesko",83],["Joshua Zirkzee",81]],
  "Tottenham": [["Antonin Kinsky",76],["Martin Dubravka",80],["Jan Paul van Hecke",85],["Micky van de Ven",87],["Marcos Senesi",83],["Tosin Adarabioyo",78],["Ben Davies",80],["Destiny Udogie",82],["Andrew Robertson",79],["Pedro Porro",84],["Archie Gray",80],["Sandro Tonali",85],["Rodrigo Bentancur",82],["Mateus Fernandes",83],["Lucas Bergvall",83],["Conor Gallagher",82],["Xavi Simons",84],["James Maddison",84],["Dejan Kulusevski",82],["Savio",82],["Mathys Tel",81],["Wilson Odobert",80],["Mykhaylo Mudryk",78],["Mohamed Kudus",84],["Omar Marmoush",83],["Dominic Solanke",81],["Richarlison",79]],
  "Aston Villa": [["Tammy Abraham",81],["Ross Barkley",82],["Marco Bizot",80],["Lamare Bogarde",80],["Emiliano Buendia",84],["Matty Cash",82],["Pau Torres",82],["Alejandro Garnacho",80],["Joao Gomes",81],["Leon Goretzka",77],["Taylor Harwood Bellis",79],["Nicolas Jackson",85],["Boubacar Kamara",83],["Ian Maatsen",82],["John McGinn",84],["Tyrone Mings",81],["Amadou Onana",80],["Victor Lindelof",82],["Matteo Ruggeri",83],["Zion Suzuki",82],["Aaron Wan Bissaka",81]],
  "Bournemouth": [["Amine Adli",80],["Julian Araujo",78],["David Brooks",76],["Ryan Christie",78],["Lewis Cook",77],["Evanilson",83],["Michele Di Gregorio",83],["Bafode Diakite",81],["James Hill",80],["Daniel Jebbison",76],["Justin Kluivert",83],["Antonio Silva",84],["Djordje Petrovic",81],["Alvaro Rodriguez",79],["Juanlu Sanchez",77],["Alex Scott",86],["Adam Smith",80],["Marcus Tavernier",82],["Adrien Truffert",82]],
  "Brentford": [["Kristoffer Ajer",84],["Jaidon Anthony",80],["Nathan Collins",81],["Mikkel Damsgaard",83],["Josh Dasilva",80],["El Hadji Malick Diouf",81],["Fabio Carvalho",75],["Rico Henry",77],["Aaron Hickey",78],["Vitaly Janelt",79],["Mathias Jensen",80],["Michael Kayode",83],["Caoimhin Kelleher",78],["Keane Lewis Potter",81],["Igor Thiago",86],["Dango Ouattara",84],["Mamadou Sangare",83],["Kevin Schade",86],["Hakon Valdimarsson",79],["Sepp van den Berg",81],["Callum Wilson",81],["Yehor Yarmoliuk",82],["Jannik Schuster",82]],
  "Brighton": [["Yasin Ayari",83],["James Beadle",74],["Olivier Boscagli",79],["Promise David",76],["Maxim De Cuyper",83],["Lewis Dunk",82],["Evan Ferguson",77],["Diego Gomez",81],["Pascal Gross",84],["Jaouen Hadjam",78],["Ferdi Kadioglu",82],["Yankuba Minteh",85],["Kaoru Mitoma",82],["Matt O'Riley",80],["Ibrahim Osman",79],["Georginio Rutter",80],["Jason Steele",81],["Pascal Struijk",83],["Michael Svoboda",75],["Bart Verbruggen",79],["Luka Vuskovic",88],["Mats Wieffer",81]],
  "Coventry City": [["Aurele Amenda",78],["Taiwo Awoniyi",76],["Dan Bentley",74],["Jay Dasilva",79],["Josh Eccles",77],["Matt Grimes",78],["Gustavo Hamer",80],["Kaine Kesler-Hayden",79],["Frank Onyeka",81],["Victor Torp",78],["Ethan Pinnock",77],["Jack Rudoni",74],["Carl Rushworth",81],["Tatsuhiro Sakamoto",72],["Ellis Simms",73],["Loum Tchaouna",74],["Bobby Thomas",74],["Brandon Thomas Asante",75],["Caleb Yirenkyi",80],["Milan van Ewijk",81],["Haji Wright",80]],
  "Crystal Palace": [["Walter Benitez",82],["Ben Chilwell",81],["Axel Disasi",80],["Cheick Doucoure",82],["Matheus Franca",77],["Evann Guessand",79],["Dean Henderson",83],["Will Hughes",81],["Daichi Kamada",83],["Anan Khalaili",78],["Jorgen Strand Larsen",79],["Jefferson Lerma",81],["Jean-Philippe Mateta",84],["Dwight McNeil",81],["Oscar Mingueza",80],["Tyrick Mitchell",82],["Eddie Nketiah",81],["Dario Osorio",80],["Yeremy Pino",81],["Chris Richards",82],["Ismaila Sarr",83],["Quinten Timber",79],["Takehiro Tomiyasu",77],["Adam Wharton",86]],
  "Everton": [["Carlos Alcaraz",78],["Thierno Barry",85],["Christian Norgaard",83],["Jarrad Branthwaite",83],["Kiernan Dewsbury-Hall",82],["James Garner",82],["Jack Grealish",84],["Hayden Hackney",82],["Brennan Johnson",81],["Michael Keane",79],["Ainsley Maitland-Niles",77],["Vitalii Mykolenko",79],["Jake O'Brien",80],["Jordan Pickford",83],["Merlin Rohl",80],["James Tarkowski",81],["Mark Travers",76]],
  "Fulham": [["David Affengruber",80],["Joachim Andersen",82],["Calvin Bassey",78],["Sander Berge",84],["Oscar Bobb",81],["Tom Cairney",76],["Timothy Castagne",76],["Shea Charles",74],["Jorge Cuenca",77],["Gonzalo Garcia",78],["Alex Iwobi",77],["Hugo Larsson",78],["Benjamin Lecomte",72],["Bernd Leno",74],["Rodrigo Muniz",76],["Cesar Palacios",71],["Harrison Reed",73],["Antonee Robinson",82],["Kevin",79],["Ryan Sessegnon",76],["Emile Smith Rowe",75],["Kenny Tete",72]],
  "Hull City": [["Semi Ajayi",72],["Mohamed Belloumi",73],["Jack Butland",72],["Mohamed-Ali Cho",74],["Lewie Coyle",71],["Matt Crooks",71],["John Egan",69],["Joe Gelhardt",69],["Ryan Giles",68],["Lucas Gourna-Douath",71],["Charlie Hughes",66],["Tim Iroegbunam",73],["Oliver McBurnie",79],["Patrick McNair",78],["Nobel Mendy",74],["Hidemasa Morita",82],["Brooke Norton-Cuffy",75],["Abdulkadir Omur",73],["Regan Slater",71],["Elliot Stroud",79],["Matt Targett",80],["Konstantinos Tzolakis",83]],
  "Ipswich Town": [["Chuba Akpom",74],["Jack Clarke",75],["Emersonn",72],["Leif Davis",78],["Issa Diop",81],["Julio Enciso",81],["Abdul Fatawu",80],["Zian Flemming",78],["Darnell Furlong",77],["Jacob Greaves",79],["Cedric Kipre",71],["Sasa Lukic",75],["Daizen Maeda",76],["Azor Matusiwa",71],["Kasey McAteer",70],["Anis Mehmeti",71],["Florentino",81],["Marcelino Nunez",80],["Dara O'Shea",75],["Exequiel Palacios",79],["Jaden Philogene",76],["Kjell Scherpen",72],["Jack Taylor",70]],
  "Leeds United": [["Brenden Aaronson",81],["Ethan Ampadu",82],["Melvin Bard",81],["Jaka Bijol",82],["Jayden Bogle",81],["Dominic Calvert-Lewin",84],["Nico Elvedi",83],["Ilia Gruev",78],["Gabriel Gudmundsson",76],["Daniel James",74],["Mateo Joseph",72],["James Justin",71],["Sean Longstaff",73],["Tarik Muharemovic",83],["Lukas Nmecha",81],["Noah Okafor",80],["Joe Rodon",80],["Anton Stach",78],["Ao Tanaka",79],["James Trafford",82],["Harry Wilson",83],["Michael Zetterer",74]],
  "Newcastle United": [["Joelinton",79],["Harvey Barnes",83],["Sven Botman",82],["Dan Burn",81],["Amar Dedic",84],["Anthony Elanga",82],["Mark Gillespie",74],["Nicolas Gonzalez",82],["Lewis Hall",85],["Lukas Hornicek",82],["Tino Livramento",81],["Jacob Murphy",80],["William Osula",79],["Nick Pope",83],["Jacob Ramsey",83],["Fabian Schar",82],["Malick Thiaw",81],["Joe Willock",79],["Yoane Wissa",80]],
  "Nottingham Forest": [["Ola Aina",81],["Murillo",80],["Liam Delap",82],["Ousmane Diomande",82],["Nicolas Dominguez",81],["Morgan Gibbs-White",86],["Callum Hudson-Odoi",82],["Arnaud Kalimuendo",83],["Igor Jesus",81],["John Victor",79],["James McAtee",77],["Nikola Milenkovic",79],["Daniel Munoz",82],["Dan Ndoye",80],["Luca Netz",75],["Felipe",77],["Ibrahim Sangare",79],["Nicolo Savona",78],["Xaver Schlager",81],["Matz Sels",80],["Neco Williams",80],["Chris Wood",75],["Ryan Yates",72]],
  "Sunderland": [["Omar Alderete",81],["Ajibola Alese",78],["Abdoullah Ba",79],["Dan Ballard",81],["Brian Brobbey",82],["Kevin Danso",80],["Habib Diarra",81],["Trai Hume",82],["Wilson Isidor",80],["Enzo Le Fee",79],["Reinildo Mandava",76],["Thomas Meunier",72],["Nordi Mukiele",73],["Romaine Mundle",72],["Luke O'Nien",73],["Nilson Angulo",74],["Robin Roefs",71],["Noah Sadiki",75],["Granit Xhaka",85]],

  "Real Madrid": [["Thibaut Courtois",87],["Andriy Lunin",82],["Dean Huijsen",86],["Ibrahima Konate",85],["Raul Asencio",84],["Eder Militao",83],["Antonio Rudiger",85],["Marc Cucurella",85],["Alvaro Carreras",82],["Trent Alexander Arnold",84],["Denzel Dumfries",86],["Aurelien Tchouameni",85],["Federico Valverde",88],["Eduardo Camavinga",85],["Jude Bellingham",90],["Arda Güler",89],["Bernardo Silva",86],["Vinicius Junior",90],["Yan Diomande",88],["Rodrygo",84],["Brahim Diaz",84],["Kylian Mbappe",91],["Endrick",83],["Carlos Espi",82]],
  "Barcelona": [["Joan Garcia",85],["Pau Cubarsi",88],["Eric Garcia",82],["Gerard Martin",83],["Andreas Christensen",81],["Alejandro Balde",81],["Jules Kounde",85],["Xavi Espart",83],["Joao Cancelo",87],["Rodri",90],["Marc Bernal",81],["Pedri",89],["Gavi",82],["Frenkie de Jong",82],["Fermin Lopez",88],["Dani Olmo",87],["Anthony Gordon",85],["Lamine Yamal",92],["Karim Adeyemi",86],["Raphinha",90],["Gabriel Jesus",85]],
  "Atletico Madrid": [["Jan Oblak",85],["Marc Pubill",85],["Cristian Romero",86],["David Hancko",85],["Robin Le Normand",84],["Alejandro Grimaldo",86],["Marcos Llorente",84],["Morten Hjulmand",83],["Pablo Barrios",84],["Koke",82],["Kangin Lee",82],["Alex Baena",86],["Ademola Lookman",84],["Guiliano Simeone",84],["Julian Alvarez",88],["Jonathan David",87],["Alexander Sorloth",80]],

  "Como": [["Robert Sanchez",83],["Jacobo Ramon",86],["Marc Oliver Kempf",82],["Trevoh Chalobah",81],["Alex Valle",81],["Yan Couto",83],["Maxime Perrone",80],["Samuele Ricci",81],["Lucas Da Cunha",84],["Maxence Caqueret",82],["Nico Paz",89],["Martin Baturina",87],["Assane Diao",81],["Jesus Rodriguez",83],["Jayden Addai",82],["Moise Kean",83],["Anastasios Douvikas",85]],
  "Inter": [["Josep Martinez",81],["Ivan Provedel",80],["Alessandro Bastoni",86],["Yann Bisseck",83],["Manuel Akanji",82],["John Stones",84],["Benjamin Pavard",81],["Federico Dimarco",86],["Carlos Augusto",80],["Djed Spence",81],["Aleksandar Stankovic",82],["Hakan Calhanoglu",84],["Nicolo Barella",87],["Petar Sucic",85],["Curtis Jones",81],["Andy Diouf",80],["Piotr Zielinski",84],["Henrikh Mkhitaryan",79],["Luis Henrique",82],["Lautaro Martinez",87],["Marcus Thuram",88],["Pio Esposito",82],["Ange Yoan Bonny",81]],
  "Juventus": [["Kamil Grabara",81],["Guglielmo Vicario",83],["Bremer",83],["Pierre Kalulu",78],["Lloyd Kelly",77],["Jhon Lucumi",78],["Federico Gatti",79],["Andrea Cambiaso",78],["Juan Cabal",77],["Zeki Celik",80],["Manuel Locatelli",84],["Khephren Thuram",81],["Weston McKennie",82],["Pape Matar Sarr",81],["Douglas Luiz",82],["Teun Koopmeiners",84],["Kenan Yildiz",85],["Kerim Alajbegovic",83],["Nico Gonzalez",82],["Jeremie Boga",81],["Francisco Conceicao",83],["Edon Zhegrova",80],["Nick Woltemade",84],["Randal Kolo Muani",82],["Jeff Ekhator",77]],
  "Milan": [["Mike Maignan",86],["Strahinja Pavlovic",83],["Koni De Winter",82],["Mario Gila",82],["Matteo Gabbia",81],["Fikayo Tomori",81],["Davide Bartesaghi",83],["Pervis Estupinan",84],["Ardon Jashari",81],["Adrien Rabiot",82],["Yunus Musah",77],["Luka Modric",81],["Ruben Loftus Cheek",79],["Diego Moreira",82],["Alphadjo Cisse",79],["Alexis Saelemaekers",78],["Christian Pulisic",83],["Omari Hutchinson",77],["Samuel Chukwueze",78],["Goncalo Ramos",86],["Francesco Camarda",80]],
  "Roma": [["Mile Svilar",85],["Evan Ndicka",82],["Kostas Koulierakis",83],["Gianluca Mancini",83],["Leonardo Balerdi",80],["Mario Hermoso",79],["Wesley",82],["Nahuel Molina",82],["Devyne Rensch",80],["Bryan Cristante",81],["Marten de Roon",81],["Manu Kone",85],["Nicolo Pisilli",80],["Rodrigo Mora",82],["Lorenzo Pellegrini",84],["Matias Soule",83],["Paulo Dybala",84],["Donyell Malen",86],["Santiago Castro",79]],

  "Bayern Munchen": [["Jonas Urbig",82],["Manuel Neuer",82],["Dayot Upamecano",85],["Jonathan Tah",85],["Kim Min Jae",84],["Hiroki Ito",82],["Nathaniel Brown",83],["Alphonso Davies",83],["Josip Stanisic",82],["Konrad Laimer",86],["Sacha Boey",81],["Aleksandar Pavlovic",86],["Joshua Kimmich",87],["Tom Bischof",83],["Jamal Musiala",89],["Lennart Karl",85],["Ismael Saibari",87],["Luis Diaz",88],["Michael Olise",91],["Serge Gnabry",84],["Harry Kane",93]],
  "Borussia Dortmund": [["Gregor Kobel",88],["Nico Schlotterbeck",88],["Joane Gadou",80],["Waldemar Anton",83],["Ramy Bensebaini",82],["Daniel Svensson",80],["Julian Ryerson",84],["Felix Nmecha",83],["Jobe Bellingham",82],["Joey Veerman",85],["Marcel Sabitzer",85],["Ethan Nwaneri",81],["Kostas Karetsas",80],["Giannis Konstantelias",79],["Max Beier",82],["Serhou Guirassy",86],["Fabio Silva",85]],
  "Bayer Leverkusen": [["Mark Flekken",82],["Jarrel Quansah",81],["Edmond Tapsoba",84],["Facundo Medina",83],["Miguel Gutierrez",83],["Lucaz Vazquez",80],["Robert Andrich",82],["Ibrahim Maza",86],["Aleix Garcia",83],["Malik Tillman",83],["Jonas Hofmann",84],["Afonso Moreira",79],["Elisse Ben Seghir",79],["Moussa Diaby",81],["Martin Terrier",80],["Christian Kofane",84],["Patrik Schick",82]],
  "RB Leipzig": [["Maarten Vandervoort",78],["Castello Lukeba",83],["Maxime Esteve",81],["Willi Orban",82],["Lukas Klostermann",80],["David Raum",81],["Ridle Baku",78],["Nicolas Seiwald",79],["Neil El Aynaoui",80],["Ezechiel Banzuzi",80],["Christoph Baumgartner",84],["Rocco Reitz",81],["Brajan Gruda",82],["Antonio Nusa",87],["Johan Bakayoko",81],["Romulo",83],["Christhoper Nkunku",85]],

  "PSG": [["Matvey Safonov",83],["Lucas Chevalier",82],["Willian Pacho",86],["Ilya Zabarnyi",84],["Marquinhos",89],["Lucas Beraldo",83],["Nuno Mendes",90],["Lucas Hernandez",82],["Lucas Digne",83],["Achraf Hakimi",90],["Vitinha",90],["Joao Neves",89],["Warren Zaire Emery",86],["Senny Mayulu",79],["Fabian Ruiz",88],["Dro Fernandez",78],["Khvicha Kvaratskhelia",89],["Mika Godts",84],["Desire Doue",90],["Ousmane Dembele",91],["Ferran Torres",85]],
  "Monaco": [["Philipp Kohn",81],["Lukas Hradecky",83],["Christian Mawissa",80],["Mohammed Salisu",82],["Eric Dier",82],["Vanderson",83],["Jordan Teze",79],["Denis Zakaria",81],["Lamine Camara",85],["Aleksandr Golovin",81],["Ansu Fati",82],["Takumi Minamino",80],["Folarin Balogun",82],["Mika Biereth",77],["Paris Brunner",83]]
};

const CLUB_TO_LEAGUE = {
  "Manchester City": "Premier Lig", "Arsenal": "Premier Lig", "Chelsea": "Premier Lig", "Liverpool": "Premier Lig",
  "Manchester United": "Premier Lig", "Tottenham": "Premier Lig", "Aston Villa": "Premier Lig", "Bournemouth": "Premier Lig",
  "Brentford": "Premier Lig", "Brighton": "Premier Lig", "Coventry City": "Premier Lig", "Crystal Palace": "Premier Lig",
  "Everton": "Premier Lig", "Fulham": "Premier Lig", "Hull City": "Premier Lig", "Ipswich Town": "Premier Lig",
  "Leeds United": "Premier Lig", "Newcastle United": "Premier Lig", "Nottingham Forest": "Premier Lig", "Sunderland": "Premier Lig",
  "Real Madrid": "La Liga", "Barcelona": "La Liga", "Atletico Madrid": "La Liga",
  "Como": "Serie A", "Inter": "Serie A", "Juventus": "Serie A", "Milan": "Serie A", "Roma": "Serie A",
  "Bayern Munchen": "Bundesliga", "Borussia Dortmund": "Bundesliga", "Bayer Leverkusen": "Bundesliga", "RB Leipzig": "Bundesliga",
  "PSG": "Ligue 1", "Monaco": "Ligue 1"
};

const PS = {
  "Manchester City": "GGDDDDDDDDMMMMMMFFFFF",
  "Arsenal": "GGGDDDDDDDDMMMMMMFFFFFF",
  "Chelsea": "GGDDDDDDDDDDMMMMMMFFFFFFF",
  "Liverpool": "GGDDDDDDDDDMMMMMMFFFFFF",
  "Manchester United": "GDDDDDDDDMMMMMMMFDFFFFF",
  "Tottenham": "GGDDDDDDDDMMMMMMMMMFFFFFFFF",
  "Aston Villa": "FMGMMDDFMMDFMDMDMDDGD",
  "Bournemouth": "FDMMMFGDDFMDGDDMDMD",
  "Brentford": "DFDMMDMDDMMDGDFFMFGDFMD",
  "Brighton": "MGDFDDFMMDDFFMFFGDDGDM",
  "Coventry City": "DFGDMMMDMMDMGFFFDFMDF",
  "Crystal Palace": "GDDMFFGMMDFMFFDDFFFDFMDM",
  "Everton": "MFMDMMFMFDDDDGMDG",
  "Fulham": "DDDMFMDMDFMMGGFMMDFDMD",
  "Hull City": "DFGFDMDFDMDMFMDMDMMDDG",
  "Ipswich Town": "FFDDDMFMDDDMFMMFMMDMFGM",
  "Leeds United": "MMDDDFDMDFFDMDFFDMMGFG",
  "Newcastle United": "MFDDDFGMDGDFFGMDDMF",
  "Nottingham Forest": "DDFDMMFFFGMDDFDDMDMGDFM",
  "Sunderland": "DDMDFDMDFMDDDFDFGMM",
  "Real Madrid": "GGDDDDDDDDDMMMMMMFFFMFFF",
  "Barcelona": "GDDDDDDDDMMMMMMMFFFFF",
  "Atletico Madrid": "GDDDDDMMMMMMFFFFF",
  "Como": "GDDDDDMMMMMMFFFFF",
  "Inter": "GGDDDDDDDDMMMMMMMMMFFFF",
  "Juventus": "GGDDDDDDDDMMMMMMFFFFFFFFF",
  "Milan": "GDDDDDDDMMMMMFMFMFFFF",
  "Roma": "GDDDDDDDDMMMMMMFFFF",
  "Bayern Munchen": "GGDDDDDDDMDMMMMMMFFFF",
  "Borussia Dortmund": "GDDDDDDMMMMMMMFFF",
  "Bayer Leverkusen": "GDDDDDMMMMMFMFFFF",
  "RB Leipzig": "GDDDDDDMMMMMMFFFF",
  "PSG": "GGDDDDDDDDMMMMMMFFFFF",
  "Monaco": "GGDDDDDMMMFMFFF"
};

const POSITIONS = ["GK", "DEF", "MID", "FWD"];
const POS_LABEL = { GK: "Kaleci", DEF: "Defans", MID: "Orta Saha", FWD: "Forvet" };
const POS_SHORT = { GK: "KL", DEF: "DEF", MID: "OS", FWD: "FV" };

const STARTERS_COUNT = 11;
const SUBS_COUNT = 3;
const ROUNDS = STARTERS_COUNT + SUBS_COUNT; // 14 Oyuncu (11 Asil + 3 Yedek)
const FORMATION_QUOTA = { GK: 1, DEF: 4, MID: 3, FWD: 3 };

const FORMATIONS = {
  "4-3-3": { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  "4-4-2": { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  "3-5-2": { GK: 1, DEF: 3, MID: 5, FWD: 2 },
  "4-2-3-1": { GK: 1, DEF: 4, MID: 4, FWD: 2 }
};

const ALIASES = {
  GK: "GK", KL: "GK", KALECI: "GK", "KALECİ": "GK", G: "GK",
  DEF: "DEF", DF: "DEF", D: "DEF", CB: "DEF", LB: "DEF", RB: "DEF", LWB: "DEF", RWB: "DEF",
  STP: "DEF", SLB: "DEF", SGB: "DEF", DEFANS: "DEF", BEK: "DEF",
  MID: "MID", MF: "MID", M: "MID", CM: "MID", CDM: "MID", CAM: "MID", DM: "MID", AM: "MID",
  LM: "MID", RM: "MID", OS: "MID", OOS: "MID", MOS: "MID", "ORTA SAHA": "MID",
  FWD: "FWD", FW: "FWD", F: "FWD", ST: "FWD", CF: "FWD", LW: "FWD", RW: "FWD", FV: "FWD",
  SF: "FWD", SLK: "FWD", SGK: "FWD", FORVET: "FWD", KANAT: "FWD"
};

function normPos(raw) {
  if (!raw) return null;
  const k = String(raw).trim().toLocaleUpperCase("tr-TR");
  if (!k) return null;
  return ALIASES[k] || ALIASES[k.replace(/İ/g, "I")] || null;
}

let P = [], CLUBS = [], LEAGUES = [];
function setPool(rows) {
  P = rows.map((x, i) => ({
    id: i,
    n: x.name,
    c: x.club,
    lg: x.league || CLUB_TO_LEAGUE[x.club] || "Diğer",
    r: x.rating,
    pos: x.position || "MID"
  }));
  CLUBS = [...new Set(P.map(p => p.c))];
  LEAGUES = [...new Set(P.map(p => p.lg))];
}

const DEFAULT_ROWS = Object.entries(DATA).flatMap(([c, l]) =>
  l.map(([n, r], i) => ({
    name: n,
    club: c,
    league: CLUB_TO_LEAGUE[c] || "Premier Lig",
    rating: r,
    position: ({ G: "GK", D: "DEF", M: "MID", F: "FWD" })[(PS[c] || "")[i]] || "MID"
  }))
);
setPool(DEFAULT_ROWS);

const HD = {
  name: ["name", "oyuncu", "isim", "ad"],
  club: ["club", "kulup", "kulüp", "takim", "takım"],
  league: ["league", "lig"],
  rating: ["rating", "reyting", "puan"],
  position: ["position", "pozisyon", "mevki"]
};

function parseRating(v, w, who) {
  const t = String(v == null ? "" : v).trim();
  if (!t) return null;
  const n = +t;
  if (Number.isInteger(n) && n >= 1 && n <= 99) return n;
  w.push(who + ": reyting 1–99 olmalı (" + t + ")");
  return null;
}

function parseList(txt) {
  const w = [], rows = [];
  const lines = txt.replace(/^\uFEFF/, "").split(/\r?\n/).map(l => l.trim());
  const first = lines.find(Boolean) || "";
  const d = [";", "\t", ","].find(x => first.includes(x));
  if (d) {
    const hd = first.split(d).map(x => x.trim().toLocaleLowerCase("tr-TR"));
    const ix = {};
    for (const k in HD) ix[k] = hd.findIndex(x => HD[k].includes(x));
    if (ix.name >= 0) {
      for (const l of lines.slice(lines.indexOf(first) + 1)) {
        if (!l) continue;
        const c = l.split(d).map(x => x.trim());
        const name = c[ix.name];
        if (!name) continue;
        const clubName = (ix.club >= 0 && c[ix.club]) || "Kulüpsüz";
        rows.push({
          name,
          club: clubName,
          league: (ix.league >= 0 && c[ix.league]) || CLUB_TO_LEAGUE[clubName] || "Özel Lig",
          rating: parseRating(ix.rating >= 0 ? c[ix.rating] : "", w, name),
          position: ix.position >= 0 ? normPos(c[ix.position]) : null
        });
      }
      return { format: "csv", rows, warnings: w };
    }
  }
  let club = "Kulüpsüz";
  let currentLeague = "Özel Lig";
  const knownLeagues = ["premier lig", "la liga", "serie a", "bundesliga", "ligue 1"];
  for (const l of lines) {
    if (!l || /kadro(lar)? reytingleri/i.test(l)) continue;
    const low = l.toLocaleLowerCase("tr-TR");
    if (knownLeagues.includes(low)) {
      currentLeague = LEAGUES_META.find(m => m.id.toLocaleLowerCase("tr-TR") === low)?.id || l;
      continue;
    }
    const m = l.match(/^(.*?)\s+(\d{1,3})(?:\s+(\S+(?:\s\S+)?))?$/);
    if (!m) {
      club = l;
      if (CLUB_TO_LEAGUE[club]) currentLeague = CLUB_TO_LEAGUE[club];
      continue;
    }
    const pos = m[3] ? normPos(m[3]) : null;
    if (m[3] && !pos) w.push(m[1] + ": pozisyon tanınmadı (" + m[3] + ")");
    rows.push({
      name: m[1].trim(),
      club,
      league: CLUB_TO_LEAGUE[club] || currentLeague,
      rating: parseRating(m[2], w, m[1]),
      position: pos || "MID"
    });
  }
  return { format: "text", rows, warnings: w };
}
