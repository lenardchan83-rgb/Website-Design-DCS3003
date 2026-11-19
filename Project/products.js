const PRODUCTS = [
  /* -----FOOTBALL----- */
  {
    id: 1,
    name: "Air Strike Football Boots",
    category: "football",
    price: 289,
    oldPrice: 359,
    image: "images/Air_Strike_Football_Boots.jpg",
    rating: 4.7,
    badge: "Bestseller",
    description: "Lightweight firm-ground boots with a textured strike zone for cleaner contact and faster acceleration on dry pitches."
  },
  {
    id: 2,
    name: "FIFA 2026 Football",
    category: "football",
    price: 89,
    image: "images/FIFA_Football.jpg",
    rating: 4.5,
    description: "Thermo-bonded size 5 match ball with a consistent flight path. FIFA Quality stamp, suitable for grass and turf."
  },

  /* -----RACKET SPORTS----- */
  {
    id: 3,
    name: "Carbon Control Racket",
    category: "racket",
    price: 319,
    oldPrice: 399,
    image: "images/Carbon_Control_Racket.jpg",
    rating: 4.8,
    badge: "New",
    description: "Full-carbon frame with a head-light balance for fast net play and powerful smashes."
  },
  {
    id: 4,
    name: "Ace 23 Jr Tennis Racket",
    category: "racket",
    price: 259,
    image: "images/Ace23_JR_Tennis_Racket.jpg",
    rating: 4.4,
    description: "100-square-inch head with a forgiving sweet spot — ideal for club players stepping up."
  },

  /* -----BASKETBALL----- */
  {
    id: 5,
    name: "Court King Basketball",
    category: "basketball",
    price: 129,
    image: "images/Court_King_Basketball.jpg",
    rating: 4.6,
    description: "Deep-channel composite leather ball for indoor and outdoor courts. Size 7."
  },
  {
    id: 6,
    name: "Hoop Master Shoes",
    category: "basketball",
    price: 349,
    oldPrice: 429,
    image: "images/Light_Cyan_Hoop_Shoes.jpg",
    rating: 4.7,
    description: "High-traction outsole and cushioned midsole for explosive cuts and soft landings."
  },

  /* -----RUNNING----- */
  {
    id: 7,
    name: "Trail Runner Shoes",
    category: "running",
    price: 399,
    image: "images/Trail_Runner_Shoes.jpg",
    rating: 4.9,
    badge: "Bestseller",
    description: "Grippy lugs, breathable mesh and a rock plate for mixed-terrain runs."
  },
  {
    id: 8,
    name: "Trainer Shoes",
    category: "running",
    price: 279,
    oldPrice: 319,
    image: "images/Trainer_Shoes.jpg",
    rating: 4.3,
    description: "Everyday cushioned trainer for road miles and gym sessions."
  },

  /* -----ACCESSORIES----- */
  {
    id: 9,
    name: "WorkOut Gloves",
    category: "accessories",
    price: 59,
    image: "images/WorkOut_Gloves.jpg",
    rating: 4.2,
    description: "Padded palm gloves for lifting and field sessions."
  },
  {
    id: 10,
    name: "Sports Water Bottle",
    category: "accessories",
    price: 39,
    oldPrice: 49,
    image: "images/Sports_Water_Bottle.jpg",
    rating: 4.1,
    description: "BPA-free bottle with a leak-proof lid and one-hand flip cap."
  },
  {
    id: 11,
    name: "Sports Socks (4 pairs)",
    category: "accessories",
    price: 45,
    image: "images/Sports_Socks_4Pairs.jpg",
    rating: 4.4,
    description: "Cushioned heel and arch support in a breathable cotton blend."
  },
  {
    id: 12,
    name: "Team Duffel Bag",
    category: "accessories",
    price: 129,
    oldPrice: 159,
    image: "images/Team_Duffel_Bag.jpg",
    rating: 4.5,
    description: "40L duffel with a separate boot compartment and ventilated panels."
  }
];

const CATEGORIES = [
  { key: "football",    name: "Football",      blurb: "Boots, balls & training kit" },
  { key: "racket",      name: "Racket Sports", blurb: "Rackets, shuttlecocks & grips" },
  { key: "basketball",  name: "Basketball",    blurb: "Balls, shoes & hoops" },
  { key: "running",     name: "Running",       blurb: "Shoes, apparel & hydration" },
  { key: "accessories", name: "Accessories",   blurb: "Bags, gloves, bottles & socks" }
];

const PROMOS = {
  SPORT10: { type: "percent", value: 10, label: "10% off" }
};

const SHIPPING = {
  flat: 12,
  freeThreshold: 300
};