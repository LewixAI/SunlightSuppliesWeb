/**
 * Site content.
 *
 * Every name, address, number and photograph below came off Sunlight's own
 * material (see ../../research/company-profile.md). Nothing here is invented
 * copy dressed up as fact.
 */

export const COMPANY = {
  name: "Sunlight Supplies Sdn Bhd",
  short: "Sunlight Supplies",
  reg: "1068356-M",
  founded: 2014,
  founder: "John Tang",
  tagline: "The smile on your face, made us move forward.",
  taglineZh: "你臉上的笑容是我們前進的動力",
  email: "sales@sunlightrack.com",
  email2: "noni@sunlightrack.com",
  whatsapp: "60137028880",
  facebook: "https://www.facebook.com/sunlightsupplies/",
  youtube: "https://www.youtube.com/@sunlightsupplies6147",
};

export const NAV = [
  { label: "Systems", href: "#systems" },
  { label: "Installed", href: "#installed" },
  { label: "Retail", href: "#retail" },
  { label: "How we work", href: "#process" },
  { label: "Contact", href: "#contact" },
];

/** The eighteen systems they list. Six have photography of their own. */
export const SYSTEMS = [
  {
    slug: "selective-pallet-racking",
    name: "Selective Pallet Racking",
    zh: "重型货架",
    blurb:
      "Every pallet reachable without moving another. The default for mixed stock and fast turnover.",
    load: "1 000 - 3 000 kg a position",
    image: "/systems/selective-pallet-racking.jpg",
  },
  {
    slug: "double-deep-pallet-racking",
    name: "Double Deep Pallet Racking",
    zh: "双深式货架",
    blurb:
      "Two pallets deep on each side of the aisle. Trades some selectivity for roughly a third more positions.",
    load: "1 000 - 3 000 kg a position",
    image: "/systems/double-deep-pallet-racking.jpg",
  },
  {
    slug: "drive-in-racking",
    name: "Drive In Racking",
    zh: "驶入式货架",
    blurb:
      "The truck drives into the lane. Highest density there is for one SKU held in volume.",
    load: "1 000 - 2 000 kg a position",
    image: "/systems/drive-in-racking.jpg",
  },
  {
    slug: "heavy-medium-duty-storage-racking",
    name: "Heavy / Medium Duty Storage Racking",
    zh: "重型储物货架",
    blurb:
      "Hand-loaded shelving for cartons and part-pallets, decked in chipboard or steel panel.",
    load: "300 - 1 000 kg a level",
    image: "/systems/heavy-medium-duty-storage-racking.jpg",
  },
  {
    slug: "multi-tier-heavy-duty-racking",
    name: "Multi-Tier Heavy Duty Racking",
    zh: "多层重型货架",
    blurb:
      "Walkable floors built off the rack itself. Buys a second and third storey without touching the building.",
    load: "Floor rated to specification",
    image: "/systems/multi-tier-heavy-duty-racking.jpg",
  },
  {
    slug: "cantilever-racking",
    name: "Cantilever Racking",
    zh: "悬臂式货架",
    blurb:
      "Arms off a single column, no front upright in the way. For pipe, timber, board and profile.",
    load: "500 - 1 500 kg an arm",
    image: "/systems/cantilever-racking.jpg",
  },
];

/** The rest of the range, listed without photography rather than with stock. */
export const SYSTEMS_MORE = [
  "Very Narrow Aisle (VNA)",
  "Pallet Flow Racking",
  "Push Back Racking",
  "Radio Shuttle Racking",
  "ASRS",
  "Superblock Rack Supported Platform",
  "Pallet Rack Supported Mezzanine",
  "Light Duty Boltless Rack",
  "Rack and Stand",
  "Gondola",
  "Oppa Rack",
  "Pigeon Hole",
];

export interface Project {
  slug: string;
  client: string;
  system: string;
  year: string;
  photos: string[];
}

/** Ten completed Johor Bahru sites, captioned by Sunlight themselves. */
export const PROJECTS: Project[] = [
  {
    slug: "itg-machinery",
    client: "ITG Machinery",
    system: "Heavy Duty Racking System",
    year: "2021",
    photos: [
      "1653459708_img_20210102_151039_14_11zon.jpg",
      "1653459710_img_20210102_151244_19_11zon.jpg",
      "1653459711_img_20210102_151922_12_11zon.jpg",
      "1653459713_img_20210102_151056_15_11zon.jpg",
    ],
  },
  {
    slug: "zero-to-infinity",
    client: "Zero To Infinity",
    system: "Heavy Duty Racking System",
    year: "2022",
    photos: [
      "1653464243_img_20220106_142846.jpg",
      "1653464238_img_20220106_142648.jpg",
      "1653464255_img_20220106_142923.jpg",
    ],
  },
  {
    slug: "elite-hight",
    client: "Elite Hight",
    system: "Heavy Duty Racking System",
    year: "2021",
    photos: [
      "1653453903_img_20211011_172526_23_11zon.jpg",
      "1653453931_img_20211013_151759_20_11zon.jpg",
      "1653453906_img_20211013_152441_21_11zon_3_11zon.jpg",
    ],
  },
  {
    slug: "tf-plastics",
    client: "TF Plastics",
    system: "Selective Pallet Racking",
    year: "2022",
    photos: [
      "1653460628_img_20220321_103133.jpg",
      "1653460636_img_20220321_103218.jpg",
      "1653460641_img_20220321_103234.jpg",
    ],
  },
  {
    slug: "kearyirama-global-sdn-bhd",
    client: "KearyIrama Global",
    system: "Superblock Rack Supported Platform",
    year: "2021",
    photos: [
      "1653460099_img_20210311_123604.jpg",
      "1653460099_img_20210311_123627.jpg",
      "1653460100_img_20210311_123548.jpg",
    ],
  },
  {
    slug: "grand-meltique-food-trading",
    client: "Grand Meltique Food Trading",
    system: "Selective Pallet Racking",
    year: "2021",
    photos: [
      "1653459059_img_20210721_110535_1_11zon.jpg",
      "1653459060_img_20210721_110646_3_11zon.jpg",
      "1653459146_img_20210721_110524_11zon.jpg",
    ],
  },
  {
    slug: "fanz-sdn-bhd",
    client: "Fanz Sdn Bhd",
    system: "Selective Pallet Racking",
    year: "2021",
    photos: [
      "1653454930_img_20210104_162605.jpg",
      "1653454931_img_20210104_162502.jpg",
      "1653464187_img_20210104_162537.jpg",
    ],
  },
  {
    slug: "keck-seng-electronic",
    client: "Keck Seng Electronic",
    system: "Heavy Duty Racking System",
    year: "2022",
    photos: [
      "1653460346_img_20220114_110209.jpg",
      "1653461223_img_20220114_110203.jpg",
    ],
  },
  {
    slug: "electronics-world",
    client: "Electronics World",
    system: "Superblock Rack Supported Platform",
    year: "2021",
    photos: [
      "1653454347_img_20211102_151435.jpg",
      "1653454349_img_20211102_151501.jpg",
    ],
  },
  {
    slug: "euro-base-technology",
    client: "Euro Base Technology",
    system: "Selective Pallet Racking",
    year: "2022",
    photos: ["1653454536_img_20220304_170720.jpg"],
  },
];

export const CLIENTS = [
  { name: "Mydin", file: "/clients/mydin.png" },
  { name: "Hershey's", file: "/clients/hersheys.png" },
  { name: "Holiday Villa", file: "/clients/holiday-villa.png" },
  { name: "Forest City", file: "/clients/forest-city.png" },
  { name: "Mid Valley Southkey", file: "/clients/mid-valley-southkey.png" },
  { name: "Al-Ikhsan", file: "/clients/al-ikhsan.png" },
  { name: "Fraser Place", file: "/clients/fraser-place.png" },
  { name: "Petikemas", file: "/clients/petikemas.png" },
  { name: "ITG Machinery", file: "/clients/itg-machinery.png" },
  { name: "Grand Meltique", file: "/clients/grand-meltique.png" },
  { name: "Vermi Industries", file: "/clients/vermi-industries.png" },
  { name: "Edaran Ilmu", file: "/clients/edaran-ilmu.png" },
  { name: "SKP", file: "/clients/skp.png" },
  { name: "BP MPAK", file: "/clients/bp-mpak.png" },
  { name: "PC Image", file: "/clients/pc-image.png" },
  { name: "My Liberica", file: "/clients/my-liberica.png" },
];

export const RETAIL = [
  {
    name: "Gondola",
    zh: "雙面陳列架子",
    file: "/retail/gondola.png",
    note: "Load to 50 kg a level, four levels and up, white or black.",
  },
  {
    name: "Oppa Rack",
    zh: "韩国架子",
    file: "/retail/oppa-basket-stand.png",
    note: "Rubber shoes, shelf dividers and side panels to order.",
  },
  {
    name: "Light Duty Boltless Rack",
    zh: "无螺絲架子",
    file: "/retail/light-duty-boltless-rack.png",
    note: "Load to 300 kg, beige, blue or yellow.",
  },
  {
    name: "Cashier Counter",
    zh: "結帳櫃檯",
    file: "/retail/cashier-counter.png",
    note: "Counter with bookshelf, register optional.",
  },
  {
    name: "Shopping Trolley",
    zh: "手推車",
    file: "/retail/shopping-trolley.png",
    note: "Two tier and single basket, with or without rollers.",
  },
  {
    name: "Offer Bin",
    zh: "鐵線産品",
    file: "/retail/offer-bin.png",
    note: "One to three levels, back netting optional.",
  },
  {
    name: "Mannequin",
    zh: "人體模型",
    file: "/retail/mannequin.png",
    note: "Full form, hand, child and hanging types.",
  },
  {
    name: "Pigeon Hole",
    zh: "分格架",
    file: "/retail/pigeon-hole.png",
    note: "Boltless carcass, cell size to your pick face.",
  },
  {
    name: "Hand Truck",
    zh: "手推車",
    file: "/retail/hand-truck.png",
    note: "130 kg plastic, metal and PVC ST150.",
  },
  {
    name: "Fruit Rack Basket",
    zh: "水果架",
    file: "/retail/fruit-rack-basket.png",
    note: "Wire basket tiers for fresh produce.",
  },
  {
    name: "Four Way Display Stand",
    zh: "四方展示架",
    file: "/retail/four-way-display-stand.png",
    note: "Bearing turntable, garment or accessory arms.",
  },
  {
    name: "Banner Stand",
    zh: "海報架",
    file: "/retail/banner-stand.png",
    note: "Free standing, adjustable head height.",
  },
];

export const PROCESS = [
  {
    n: "01",
    title: "Shop measurement",
    body: "Someone comes out and measures the building, the columns, the doors and the truck path. Free, and before any drawing exists.",
  },
  {
    n: "02",
    title: "AutoCAD layout",
    body: "You get a dimensioned layout drawing to approve. Also free, and it is the drawing everything downstream is built from.",
  },
  {
    n: "03",
    title: "Quotation off the drawing",
    body: "Components counted from the approved layout, not estimated. What you approve is what gets fabricated and what gets invoiced.",
  },
  {
    n: "04",
    title: "Install, or dismantle",
    body: "Ready stock, own crew, all systems. Relocations and reconfigurations are the same team taking it back down.",
  },
];

export const LOCATIONS = [
  {
    name: "Setia Business Park",
    role: "Head office and warehouse",
    address:
      "No 8, Jalan Perniagaan Setia 1/1, Taman Perniagaan Setia, 81100 Johor Bahru, Johor",
    tel: "+607-5543 990",
    fax: "+607-5543 991",
    mobile: "+6013-702 8880",
    maps: "https://maps.google.com/?q=Sunlight+Supplies+Sdn+Bhd+Jalan+Perniagaan+Setia+1/1+Johor+Bahru",
  },
  {
    name: "Kempas Utama",
    role: "Branch",
    address: "28, Jalan Kempas Utama 3/1, Taman Kempas Utama, 81300 Skudai, Johor",
    tel: "+607-5500 081",
    fax: "+607-5500 082",
    mobile: "+6010-710 8988",
    maps: "https://maps.google.com/?q=Jalan+Kempas+Utama+3/1+Taman+Kempas+Utama+Skudai",
  },
  {
    name: "Uda Utama",
    role: "Branch",
    address:
      "6, Jalan Uda Utama 4/1, Bandar Uda Utama, 81300 Johor Bahru, Johor",
    tel: "+6018-262 8988",
    fax: "+607-5500 081",
    mobile: "+6018-262 8988",
    maps: "https://maps.google.com/?q=Jalan+Uda+Utama+4/1+Bandar+Uda+Utama+Johor+Bahru",
  },
];
