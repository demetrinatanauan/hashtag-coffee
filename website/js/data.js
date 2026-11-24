/* =========================================================
   Menu data – Hashtag Coffee Capitol Site
   Items and prices are taken from the branch's official menu
   (posted on its Facebook page, December 2024).
   One list feeds the Home page (featured dishes), the Menu
   page (photo cards + full menu board) and the order tray.
   Prices are in Philippine pesos (₱).
   ========================================================= */

const IMG = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

/* Menu sections in the same order as the café's printed menu.
   cat = filter tab, sizes = labels for the two price columns. */
const GROUPS = [
  { id: "coffee",        name: "Coffee",                 cat: "coffee",      sizes: ["S", "L"] },
  { id: "frappe-coffee", name: "Frappe · Coffee Based",  cat: "coffee",      sizes: ["S", "L"] },
  { id: "matcha",        name: "Matcha Series",          cat: "non-coffee",  sizes: ["S", "L"] },
  { id: "milk-tea",      name: "Milk Tea",               cat: "non-coffee",  sizes: ["S", "L"] },
  { id: "frappe-nc",     name: "Frappe · Non-Coffee",    cat: "non-coffee",  sizes: ["S", "L"] },
  { id: "refreshing",    name: "Refreshing Drinks",      cat: "non-coffee",  sizes: ["S", "L"] },
  { id: "yogurt",        name: "Yogurt Series",          cat: "non-coffee",  sizes: ["S", "L"] },
  { id: "hot-tea",       name: "Hot Tea",                cat: "non-coffee" },
  { id: "breakfast",     name: "All-Day Breakfast",      cat: "meals" },
  { id: "specials",      name: "House Specials",         cat: "meals" },
  { id: "rice-bowls",    name: "Rice Bowls",             cat: "meals",
    note: "Promo price ₱169 from 9–11 AM and 2–4 PM" },
  { id: "protein-salad", name: "High Protein Salad",     cat: "meals" },
  { id: "pasta",         name: "Pasta",                  cat: "pasta-pizza", sizes: ["Solo", "Platter"] },
  { id: "pizza",         name: "Pizza",                  cat: "pasta-pizza" },
  { id: "appetizers",    name: "Appetizers",             cat: "snacks" },
  { id: "sandwiches",    name: "Sandwiches",             cat: "snacks" },
  { id: "burgers",       name: "Burgers",                cat: "snacks",      sizes: ["Solo", "Combo"] },
  { id: "salads",        name: "Salads",                 cat: "snacks" },
];

const CATEGORIES = {
  all: "All",
  coffee: "Coffee",
  "non-coffee": "Non-Coffee",
  meals: "Meals",
  "pasta-pizza": "Pasta & Pizza",
  snacks: "Snacks & Burgers",
};

/* item(group, name, price or [small, large], extra) */
const MENU = [];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
function item(group, name, prices, extra = {}) {
  MENU.push({ id: slug(group + " " + name), group, name, prices: [].concat(prices), ...extra });
}

// ---- Coffee ----
item("coffee", "Hashtag Coffee Signature", [195, 210], { best: true, featured: true, tag: "Signature",
  desc: "The house favorite – our signature espresso blend with milk. Ask for it hot or iced.",
  img: IMG("photo-1509042239860-f550ce710b93") });
item("coffee", "Coffee Latte", [162, 192]);
item("coffee", "Sea Salt Latte", [166, 195], { tag: "Iced", desc: "Espresso and milk topped with a lightly salted cream.",
  img: IMG("photo-1461023058943-07fcbe16d735"), photo: true });
item("coffee", "Mocha Latte", [192, 208]);
item("coffee", "Salted Caramel", [192, 208]);
item("coffee", "Caramel Macchiato", [192, 208], { tag: "Sweet", desc: "Milk, espresso and vanilla finished with caramel.",
  img: IMG("photo-1517701604599-bb29b565090c"), photo: true });
item("coffee", "White Mocha", [192, 208]);
item("coffee", "Roasted Almond Latte", [162, 192]);
item("coffee", "Chocolate Caramel", [192, 208]);

// ---- Frappe (coffee based) ----
item("frappe-coffee", "Salted Caramel", [190, 218]);
item("frappe-coffee", "Java Chip", [195, 220]);
item("frappe-coffee", "Caramel Macchiato", [190, 218]);
item("frappe-coffee", "White Mocha", [190, 218]);
item("frappe-coffee", "Cookies and Cream Espresso", [220, 245], { tag: "Frappe",
  desc: "Blended espresso, cookies and cream, topped with whipped cream.",
  img: IMG("photo-1572490122747-3968b75cc699"), photo: true });

// ---- Matcha ----
item("matcha", "Matcha Latte", [162, 192]);
item("matcha", "Matcha Espresso", [195, 210], { best: true, featured: true, tag: "Must try",
  desc: "Smooth matcha and milk with a shot of espresso on top.",
  img: IMG("photo-1515823064-d6e0c04616a7") });
item("matcha", "Matcha Strawberry", [195, 210]);

// ---- Milk tea ----
item("milk-tea", "Okinawa", [145, 155], { tag: "Milk tea", desc: "Classic Okinawa milk tea with brown-sugar sweetness.",
  img: IMG("photo-1558857563-b371033873b8"), photo: true });
item("milk-tea", "Dark Chocolate", [148, 165]);
item("milk-tea", "Oreo Cheesecake", [172, 189]);

// ---- Frappe (non-coffee) ----
item("frappe-nc", "Milky Strawberry", [195, 220]);
item("frappe-nc", "Dark Chocolate", [195, 220]);
item("frappe-nc", "Chocolate Strawberry", [195, 220]);
item("frappe-nc", "Mango Graham", [220, 245]);
item("frappe-nc", "Red Velvet", [195, 220]);
item("frappe-nc", "Matcha", [220, 245]);
item("frappe-nc", "Cookies and Cream", [220, 245]);

// ---- Refreshing drinks ----
item("refreshing", "Refreshing Strawberry", [145, 169], { tag: "Refresher", desc: "Iced strawberry refresher – light, fruity and not too sweet.",
  img: IMG("photo-1497534446932-c925b458314e"), photo: true });
item("refreshing", "Refreshing Blueberry", [145, 169]);
item("refreshing", "Kiwi Lemonade", [152, 174]);
item("refreshing", "Mango Pop", [122, 149]);
item("refreshing", "Mermaid Tail", [146, 170]);

// ---- Yogurt ----
item("yogurt", "Yogurt Strawberry", [152, 174]);
item("yogurt", "Yogurt Cloud Mango", [152, 174]);
item("yogurt", "Yogurt Blueberry", [152, 174]);

// ---- Hot tea ----
item("hot-tea", "Ceylon Honey Lemonade", 135);
item("hot-tea", "Green Tea", 110);
item("hot-tea", "Chamomile Tea", 110);
item("hot-tea", "Peppermint Tea", 110);

// ---- All-day breakfast ----
item("breakfast", "Beef Tapa", 375);
item("breakfast", "Boneless Bangus", 350);
item("breakfast", "Hungarian Sausage", 295);
item("breakfast", "Premium Bacon", 315);

// ---- House specials ----
item("specials", "Salisbury Steak", 350);
item("specials", "Grilled Pork Chop", 355);
item("specials", "Braised Pork Belly", 380);
item("specials", "Chef's Fried Chicken", 330, { tag: "Rice meal", desc: "Crispy, golden fried chicken served with rice.",
  img: IMG("photo-1626082927389-6cd097cdc6ec"), photo: true });
item("specials", "Lulay's Lechon Kawali", 360, { best: true });
item("specials", "Chicken Ala King", 345);
item("specials", "Cajun Roast Chicken", 355);
item("specials", "Salted Egg Lechon Kawali", 365);
item("specials", "Butter Aged USDA Ribeye Steak", 1350, { tag: "Premium",
  desc: "Butter-aged USDA ribeye, the top-tier plate on the menu. Great for celebrations.",
  img: IMG("photo-1600891964092-4316c288032e") });
item("specials", "Texas Style BBQ Pork Ribs – Solo (200–250 g)", 499, { priceText: "₱499–625" });
item("specials", "Texas Style BBQ Pork Ribs – Half Slab (300–500 g)", 750, { priceText: "₱750–1,499" });
item("specials", "Texas Style BBQ Pork Ribs – Full Slab (550–1000 g)", 1375, { priceText: "₱1,375–2,499",
  tag: "Sharing", featured: true, card: "Texas Style BBQ Pork Ribs",
  desc: "Slow-cooked ribs in BBQ sauce. Solo, half slab or full slab – priced by weight.",
  img: IMG("photo-1544025162-d76694265947") });

// ---- Rice bowls ----
for (const flavor of ["Orange Chicken", "Teriyaki", "Soy Garlic", "Garlic Parmesan", "Sweet Sriracha"])
  item("rice-bowls", flavor + " Rice Bowl", 250);

// ---- High protein salad ----
item("protein-salad", "Quarter Leg Chicken", 390);
item("protein-salad", "Herb Marinated Grilled Chicken", 420, { tag: "High protein",
  desc: "Herb-marinated grilled chicken on a bed of fresh salad.",
  img: IMG("photo-1532550907401-a500c9a57435"), photo: true });

// ---- Pasta ----
item("pasta", "Bacon Alfredo", [260, 750]);
item("pasta", "Tuna Puttanesca", [260, 750]);
item("pasta", "Meaty Spaghetti", [260, 750]);
item("pasta", "Creamy Tuna Pesto", [320, 920]);
item("pasta", "Grilled Chicken Pesto", [320, 930]);
item("pasta", "Pasta Bolognese", [320, 930], { tag: "Pasta", desc: "Pasta in a rich, slow-cooked meat sauce. Solo or platter for the barkada.",
  img: IMG("photo-1621996346565-e3dbc646d9a9"), photo: true });
item("pasta", "Char Siu Peanut", [335, 950]);
item("pasta", "Seafood Aglio Olio", [355, 1010]);
item("pasta", "Seafood Marinara", [375, 1050], { tag: "Seafood", desc: "Seafood pasta in a tomato marinara sauce.",
  img: IMG("photo-1563379926898-05f4575a45d8"), photo: true });
item("pasta", "Creamy Truffle Chicken", [410, 1170]);

// ---- Pizza ----
item("pizza", "Three Cheese", 370, { tag: "Pizza", desc: "A simple, cheesy classic baked to order.",
  img: IMG("photo-1574071318508-1cdbab80d002"), photo: true });
item("pizza", "Pepperoni", 380, { best: true, featured: true, tag: "Sharing",
  desc: "Loaded with pepperoni and melted cheese. Good for sharing.",
  img: IMG("photo-1513104890138-7c749659a591") });
item("pizza", "Beef Pepper & Onion", 390);

// ---- Appetizers ----
item("appetizers", "Nachos Overload", 395, { tag: "Barkada", featured: true,
  desc: "A big platter of nachos piled with toppings and cheese – made for groups.",
  img: IMG("photo-1513456852971-30c0b8199d4d") });
item("appetizers", "Chicken Tenders", 310);
item("appetizers", "Shoe String Fries", 160);
item("appetizers", "Bacon Cheese Fries", 295, { tag: "Snack", desc: "Fries topped with cheese sauce and bacon bits.",
  img: IMG("photo-1573080496219-bb080dd4f877"), photo: true });
item("appetizers", "Chili Cheese Fries", 315);
item("appetizers", "Calamari Fritti", 370);
item("appetizers", "Party Platter", 499);

// ---- Sandwiches ----
item("sandwiches", "Sweet Glazed Ham", 169);
item("sandwiches", "Double Bacon", 195);
item("sandwiches", "German Franks", 225);
item("sandwiches", "Tuna Sandwich", 220);
item("sandwiches", "Golden Chicken Nuggets", 220);

// ---- Burgers ----
item("burgers", "Monster Crispy Chicken", [330, 360]);
item("burgers", "Hashtag Quarter Pounder", [360, 390], { best: true, featured: true, tag: "Burger",
  desc: "The house quarter-pound burger. Add fries and a drink with the combo.",
  img: IMG("photo-1568901346375-23c9450c58cd") });

// ---- Salads ----
item("salads", "Kani Salad", 255);
item("salads", "Caesar Salad", 255, { tag: "Salad", desc: "Crisp greens with Caesar dressing and croutons.",
  img: IMG("photo-1546793665-c74683f339c1"), photo: true });

/* Opening hours (0 = Sunday). From the branch's Facebook page:
   7 AM – 2 AM daily, last order at 1 AM. A closing time earlier
   than the opening time means the café closes after midnight. */
const HOURS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  .map(day => ({ day, open: "07:00", close: "02:00" }));
const LAST_ORDER = "1:00 AM";
